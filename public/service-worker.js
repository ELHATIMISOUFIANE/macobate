// Service Worker pour Macobate
const CACHE_NAME = "macobate-cache-v1";
const ENABLE_CACHE = false; // ⬅️ Passe à true pour réactiver le cache

// Liste des ressources à mettre en cache immédiatement
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/about",
  "/market-sectors",
  "/contact",
  "/service",
  "/blog",
  "/css/bootstrap.css",
  "/css/style.css",
  "/css/responsive.css",
  "/js/jquery.js",
  "/js/bootstrap.min.js",
  "/js/script.js",
  "/js/map-script.js",
  "/images/logo.png",
  "/images/logo-small.png",
  "/images/favicon.png",
];

// Installation du Service Worker
self.addEventListener("install", (event) => {
  if (!ENABLE_CACHE) return;

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Mise en cache des ressources statiques pour Macobate");
        return Promise.all(
          PRECACHE_URLS.map((url) => {
            return cache.add(url).catch((error) => {
              console.warn(`Impossible de mettre en cache ${url}:`, error);
              return Promise.resolve(); // Ne bloque pas
            });
          })
        );
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error(
          "Erreur lors de l'installation du service worker:",
          error
        );
      })
  );
});

// Activation du Service Worker
self.addEventListener("activate", (event) => {
  if (!ENABLE_CACHE) return;

  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log("Suppression de l'ancien cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
      .catch((error) => {
        console.error("Erreur lors de l'activation du service worker:", error);
      })
  );
});

// Gestion des requêtes
self.addEventListener("fetch", (event) => {
  // Si le cache est désactivé, passe tout au réseau
  if (!ENABLE_CACHE) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Ignore les requêtes externes/API
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("analytics") ||
    event.request.url.includes("google-analytics") ||
    event.request.url.includes("maps.googleapis.com") ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request)
          .then((response) => {
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            const responseToCache = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn(
                  "Erreur lors de la mise en cache de",
                  event.request.url,
                  error
                );
              });

            return response;
          })
          .catch((error) => {
            console.warn("Erreur réseau pour", event.request.url, error);

            if (event.request.mode === "navigate") {
              return caches.match("/offline.html").catch(
                () =>
                  new Response(
                    "<html><body><h1>Hors ligne</h1><p>Veuillez vérifier votre connexion.</p></body></html>",
                    {
                      headers: { "Content-Type": "text/html; charset=utf-8" },
                    }
                  )
              );
            }

            if (event.request.destination === "image") {
              return new Response(null, {
                status: 503,
                statusText: "Service Unavailable",
              });
            }

            throw error;
          });
      })
      .catch((error) => {
        console.error("Erreur dans le service worker:", error);
        return new Response("Une erreur est survenue.", { status: 500 });
      })
  );
});

// Mise à jour du Service Worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
