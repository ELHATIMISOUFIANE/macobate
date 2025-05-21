// Service Worker optimisé pour MACOBATE
const CACHE_NAME = "macobate-cache-v1";
const ENABLE_CACHE = true; // Activé pour améliorer les performances et l'expérience offline

// Pages et ressources essentielles à mettre en cache immédiatement
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/offline.html",
  "/about",
  "/contact",
  "/formDevis",
  "/services/allServices",
  "/projects/allProjects",
  "/blog/allBlog",
  "/css/bootstrap.css",
  "/css/style.css",
  "/css/responsive.css",
  "/js/jquery.js",
  "/js/bootstrap.min.js",
  "/js/script.js",
  "/images/logo.png",
  "/images/logo-small.png",
  "/images/favicon.png",
  "/images/background/1.jpg",
  "/images/background/2.jpg",
  "/images/background/6.jpg",
  "/images/background/7.jpg",
];

// Images et ressources secondaires à mettre en cache lors de leur utilisation
const CACHE_ON_DEMAND = [
  "\\.jpg$",
  "\\.jpeg$",
  "\\.png$",
  "\\.gif$",
  "\\.svg$",
  "\\.webp$",
  "\\.woff2?$",
  "\\.ttf$",
  "\\.eot$",
  "\\.css$",
  "\\.js$",
];

// Installation du Service Worker - Mise en cache initiale
self.addEventListener("install", (event) => {
  if (!ENABLE_CACHE) return;

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Mise en cache des ressources statiques pour MACOBATE");
        return Promise.all(
          PRECACHE_URLS.map((url) => {
            return cache.add(url).catch((error) => {
              console.warn(`Impossible de mettre en cache ${url}:`, error);
              return Promise.resolve(); // Continue le processus même en cas d'erreur
            });
          })
        );
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error("Erreur lors de l'installation du service worker:", error);
      })
  );
});

// Activation du Service Worker - Nettoyage des anciens caches
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
            return Promise.resolve();
          })
        );
      })
      .then(() => self.clients.claim())
      .catch((error) => {
        console.error("Erreur lors de l'activation du service worker:", error);
      })
  );
});

// Stratégie de cache "Network First, falling back to cache" pour les pages HTML
// Et "Cache First, falling back to network" pour les ressources statiques
self.addEventListener("fetch", (event) => {
  // Si le cache est désactivé, tout passe au réseau
  if (!ENABLE_CACHE) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Ignorer les requêtes non GET et les requêtes externes/API
  if (event.request.method !== 'GET') return;
  
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("analytics") ||
    event.request.url.includes("google-analytics") ||
    event.request.url.includes("maps.googleapis.com") ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  const url = new URL(event.request.url);
  const isHtmlRequest = event.request.mode === "navigate" || 
                        (event.request.headers.get('accept') && 
                         event.request.headers.get('accept').includes('text/html'));
  
  // Pour les pages HTML, essayer d'abord le réseau puis le cache
  if (isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone la réponse pour mettre en cache
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, essayez le cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Si pas dans le cache, afficher la page hors ligne
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // Pour les ressources statiques (images, CSS, JS, etc.), essayer d'abord le cache
  const isCacheableResource = CACHE_ON_DEMAND.some(pattern => 
    new RegExp(pattern).test(event.request.url)
  );
  
  if (isCacheableResource) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Si dans le cache, retourner directement
          if (cachedResponse) {
            // En parallèle, mettre à jour le cache (cache then network)
            fetch(event.request)
              .then((response) => {
                if (response.ok) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, response));
                }
              })
              .catch(() => {});
              
            return cachedResponse;
          }
          
          // Si pas dans le cache, aller au réseau et mettre en cache
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Clone pour mettre en cache
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch((error) => {
              console.warn("Erreur réseau pour", event.request.url, error);
              
              // Pour les images, retourner une image par défaut
              if (event.request.destination === "image") {
                return caches.match('/images/placeholder.png');
              }
              
              throw error;
            });
        })
    );
    return;
  }
  
  // Pour les autres requêtes
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then((cachedResponse) => {
            return cachedResponse || new Response("Une erreur est survenue.", { status: 500 });
          });
      })
  );
});

// Mise à jour du Service Worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Notification spécifique à MACOBATE pour les mises à jour du site
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_VERSION') {
    const currentVersion = '1.0.0'; // À incrémenter pour les mises à jour
    
    // Répondre avec la version actuelle
    event.ports[0].postMessage({
      version: currentVersion,
      status: 'active'
    });
  }
});

// Synchronisation en arrière-plan pour les formulaires
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-submit') {
    event.waitUntil(syncContactForm());
  } else if (event.tag === 'devis-form-submit') {
    event.waitUntil(syncDevisForm());
  }
});

// Fonction pour synchroniser les formulaires de contact en cas de connexion instable
async function syncContactForm() {
  try {
    const dbName = 'macobate-forms';
    const storeName = 'pending-contacts';
    
    // Ouvrir la base de données
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      
      request.onerror = (event) => reject('Erreur d'ouverture de la base de données');
      request.onsuccess = (event) => resolve(event.target.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
    
    // Récupérer les formulaires en attente
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const pendingForms = await new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = (event) => resolve(event.target.result);
    });
    
    // Soumettre chaque formulaire
    for (const form of pendingForms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          // Supprimer de la file d'attente
          store.delete(form.id);
        }
      } catch (error) {
        console.error('Erreur lors de la synchronisation:', error);
      }
    }
    
    return transaction.complete;
  } catch (error) {
    console.error('Erreur de synchronisation:', error);
  }
}

// Fonction pour synchroniser les formulaires de devis en cas de connexion instable
async function syncDevisForm() {
  // Logique similaire à syncContactForm pour les formulaires de devis
  // ...
}