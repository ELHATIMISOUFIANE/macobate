// config/routes.js
// Configuration centralisée des routes multilingues

export const routes = {
  // Pages principales
  home: {
    fr: '/',
    en: '/'
  },
  about: {
    fr: '/a-propos',
    en: '/about'
  },
  contact: {
    fr: '/contact',
    en: '/contact'
  },
  careers: {
    fr: '/carrieres',
    en: '/careers'
  },
  
  // Secteurs d'activité
  services: {
    fr: '/secteurs-activite',
    en: '/business-sectors'
  },
  allServices: {
    fr: '/services/tous-secteurs',
    en: '/services/all-sectors'
  },
  
  // Projets
  projects: {
    fr: '/projets',
    en: '/projects'
  },
  allProjects: {
    fr: '/projets/toutes-realisations',
    en: '/projects/all-projects'
  },
  detailProjects: {
    fr: '/projets/details',
    en: '/projects/details'
  },
  
  // Actualités/Blog
  news: {
    fr: '/actualites',
    en: '/news'
  },
  allBlog: {
    fr: '/blog/toutes-actualites',
    en: '/blog/all-news'
  },
  
  // Marques
  brands: {
    fr: '/nos-marques',
    en: '/our-brands'
  },
  
  // Qualité
  quality: {
    fr: '/qualite-certifications',
    en: '/quality-certifications'
  },
  
  // Devis
  quote: {
    fr: '/demander-devis',
    en: '/request-quote'
  }
};

/**
 * Obtient l'URL localisée pour une route donnée
 * @param {string} routeKey - Clé de la route (ex: 'about', 'contact')
 * @param {string} lang - Langue ('fr' ou 'en')
 * @returns {string} - URL localisée
 */
export function getLocalizedRoute(routeKey, lang = 'en') {
  const route = routes[routeKey];
  if (!route) {
    console.warn(`Route "${routeKey}" not found in routes configuration`);
    return '/';
  }
  
  const localizedPath = route[lang] || route.en;
  
  // Ajouter le préfixe /fr pour les routes françaises si ce n'est pas la page d'accueil
  if (lang === 'fr' && localizedPath !== '/') {
    return `/fr${localizedPath}`;
  }
  
  return localizedPath;
}

/**
 * Génère toutes les URLs alternatives pour une route
 * @param {string} routeKey - Clé de la route
 * @returns {object} - Objet avec les URLs fr et en
 */
export function getAllLocalizedRoutes(routeKey) {
  return {
    fr: getLocalizedRoute(routeKey, 'fr'),
    en: getLocalizedRoute(routeKey, 'en')
  };
}

/**
 * Trouve la clé de route correspondant à un chemin donné
 * @param {string} pathname - Chemin de l'URL
 * @returns {string|null} - Clé de la route ou null si non trouvée
 */
export function findRouteKey(pathname) {
  // Nettoyer le pathname (retirer /fr si présent)
  const cleanPath = pathname.replace(/^\/fr/, '') || '/';
  
  for (const [key, route] of Object.entries(routes)) {
    if (route.fr === cleanPath || route.en === cleanPath) {
      return key;
    }
  }
  
  return null;
}

/**
 * Vérifie si un chemin est une route valide
 * @param {string} pathname - Chemin à vérifier
 * @returns {boolean} - True si la route existe
 */
export function isValidRoute(pathname) {
  return findRouteKey(pathname) !== null;
}

// Configuration des métadonnées SEO par route
export const seoRoutes = {
  home: {
    fr: {
      title: 'MACOBATE - Ingénierie Industrielle Maroc | Leader depuis 40 ans',
      description: 'MACOBATE, leader marocain en ingénierie industrielle. Spécialisé dans les structures métalliques, équipements hydromécaniques et projets EPC depuis plus de 40 ans.',
      keywords: 'MACOBATE, ingénierie industrielle Maroc, structures métalliques, équipements hydromécaniques'
    },
    en: {
      title: 'MACOBATE - Industrial Engineering Morocco | Leader for 40 years',
      description: 'MACOBATE, Moroccan leader in industrial engineering. Specialized in steel structures, hydromechanical equipment and EPC projects for over 40 years.',
      keywords: 'MACOBATE, industrial engineering Morocco, steel structures, hydromechanical equipment'
    }
  },
  about: {
    fr: {
      title: 'À Propos de MACOBATE - Notre Histoire et Expertise',
      description: 'Découvrez l\'histoire de MACOBATE, notre expertise en ingénierie industrielle et nos 40 ans d\'expérience au service de l\'industrie marocaine.',
      keywords: 'histoire MACOBATE, expertise ingénierie, équipe technique, entreprise marocaine'
    },
    en: {
      title: 'About MACOBATE - Our History and Expertise',
      description: 'Discover MACOBATE\'s history, our expertise in industrial engineering and our 40 years of experience serving Moroccan industry.',
      keywords: 'MACOBATE history, engineering expertise, technical team, Moroccan company'
    }
  },
  contact: {
    fr: {
      title: 'Contactez MACOBATE - Devis et Informations',
      description: 'Contactez MACOBATE pour vos projets d\'ingénierie industrielle. Demandez un devis gratuit pour vos structures métalliques et équipements.',
      keywords: 'contact MACOBATE, devis gratuit, ingénierie Rabat, consultation technique'
    },
    en: {
      title: 'Contact MACOBATE - Quotes and Information',
      description: 'Contact MACOBATE for your industrial engineering projects. Request a free quote for your steel structures and equipment.',
      keywords: 'contact MACOBATE, free quote, engineering Rabat, technical consultation'
    }
  }
};

/**
 * Obtient les métadonnées SEO pour une route et langue données
 * @param {string} routeKey - Clé de la route
 * @param {string} lang - Langue
 * @returns {object} - Métadonnées SEO
 */
export function getSEOMetadata(routeKey, lang = 'en') {
  const seoData = seoRoutes[routeKey];
  if (!seoData) {
    return seoRoutes.home[lang]; // Fallback vers la page d'accueil
  }
  
  return seoData[lang] || seoData.en;
}