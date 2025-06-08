import { translations } from './translations.js';

/**
 * Obtient l'objet de traduction pour une langue donnée
 * @param {string} lang - Code de langue ('en' ou 'fr')
 * @returns {Object} Objet de traductions
 */
export function t(lang = 'en') {
  return translations[lang] || translations.en;
}

/**
 * Détermine la langue actuelle depuis l'URL
 * @param {string} pathname - Le pathname de l'URL
 * @returns {string} Code de langue ('en' ou 'fr')
 */
export function getLangFromUrl(pathname) {
  if (pathname.startsWith('/fr')) {
    return 'fr';
  }
  return 'en'; // Anglais par défaut
}

/**
 * Génère l'URL localisée en fonction de la langue
 * @param {string} path - Le chemin de base
 * @param {string} lang - Code de langue
 * @returns {string} URL localisée
 */
export function localizeUrl(path, lang) {
  // Supprimer le préfixe de langue existant si présent
  const cleanPath = path.replace(/^\/(fr|en)/, '') || '/';
  
  if (lang === 'fr') {
    return '/fr' + cleanPath;
  }
  // Anglais par défaut, pas de préfixe
  return cleanPath;
}

/**
 * Obtient les URLs alternatives pour les balises hreflang
 * @param {string} currentPath - Le chemin actuel
 * @returns {Object} Objet avec les URLs pour chaque langue
 */
export function getHreflangUrls(currentPath) {
  const cleanPath = currentPath.replace(/^\/(fr|en)/, '') || '/';
  
  return {
    en: cleanPath,
    fr: '/fr' + cleanPath,
    'x-default': cleanPath // Anglais par défaut
  };
}

/**
 * Configuration de navigation avec traductions
 * @param {Object} t - Objet de traductions pour la langue courante
 * @param {string} lang - Code de langue
 * @returns {Array} Configuration du menu de navigation
 */
export function getNavigationConfig(t, lang) {
  const getUrl = (path) => localizeUrl(path, lang);
  
  return [
    {
      title: t.nav.home,
      url: getUrl('/'),
      hasSubmenu: false,
      showInMainOnly: lang === 'en' // Seulement pour l'anglais
    },
    {
      title: t.nav.about,
      url: getUrl('/about'),
      hasSubmenu: true,
      showInMainOnly: false,
      submenu: [
        { title: t.nav.aboutSubmenu.ceoMessage, url: getUrl('/about#company-section') },
        { title: t.nav.aboutSubmenu.achievements, url: getUrl('/about#achived-section') },
        { title: t.nav.aboutSubmenu.history, url: getUrl('/about#history-section') },
        { title: t.nav.aboutSubmenu.strengths, url: getUrl('/about#highlights-section') },
        { title: t.nav.aboutSubmenu.services, url: getUrl('/services/allServices') },
      ],
    },
    {
      title: t.nav.brands,
      url: getUrl('/our-brands'),
      hasSubmenu: true,
      showInMainOnly: false,
      submenu: [
        { title: t.nav.brandsSubmenu.robex, url: getUrl('/our-brands/robex') },
        { title: t.nav.brandsSubmenu.cranex, url: getUrl('/our-brands/cranex') },
        { title: t.nav.brandsSubmenu.tanko, url: getUrl('/our-brands/tanko') },
        { title: t.nav.brandsSubmenu.mws, url: getUrl('/our-brands/mws') },
      ],
    },
    {
      title: t.nav.activities,
      url: getUrl('/services/allServices'),
      hasSubmenu: true,
      showInMainOnly: false,
      submenu: [
        { title: t.nav.activitiesSubmenu.metalStructures, url: getUrl('/services/detailServices#charpente-metallique') },
        { title: t.nav.activitiesSubmenu.pressureVessels, url: getUrl('/services/detailServices#appareils-pression') },
        { title: t.nav.activitiesSubmenu.storageTanks, url: getUrl('/services/detailServices#reservoirs-stockage') },
        { title: t.nav.activitiesSubmenu.hydromechanical, url: getUrl('/services/detailServices#equipements-hydromecaniques') },
        { title: t.nav.activitiesSubmenu.waterTreatment, url: getUrl('/services/detailServices#traitement-eau') },
        { title: t.nav.activitiesSubmenu.electricityAutomation, url: getUrl('/services/detailServices#electricite-automatismes') },
        { title: t.nav.activitiesSubmenu.projects, url: getUrl('/projects/allProjects') },
      ],
    },
    {
      title: t.nav.news,
      url: getUrl('/blog/allBlog'),
      hasSubmenu: false,
      showInMainOnly: lang === 'fr' // Seulement pour le français
    },
    {
      title: t.nav.career,
      url: getUrl('/career'),
      hasSubmenu: false,
      showInMainOnly: lang === 'en' // Seulement pour l'anglais
    },
    {
      title: t.nav.contact,
      url: getUrl('/contact'),
      hasSubmenu: false,
      showInMainOnly: true
    },
  ];
}

/**
 * Obtient les liens du footer
 * @param {Object} t - Objet de traductions pour la langue courante
 * @param {string} lang - Code de langue
 * @returns {Object} Configuration des liens du footer
 */
export function getFooterLinks(t, lang) {
  const getUrl = (path) => localizeUrl(path, lang);
  
  return {
    usefulLinks1: [
      { title: t.footer.links.home, url: getUrl('/') },
      { title: t.footer.links.team, url: getUrl('/about#team-section') },
      { title: t.footer.links.requestQuote, url: getUrl('/formDevis') },
      { title: t.footer.links.contact, url: getUrl('/contact') },
    ],
    usefulLinks2: [
      { title: t.footer.links.businessSectors, url: getUrl('/services/allServices') },
      { title: t.footer.links.news, url: getUrl('/blog/allBlog') },
      { title: t.footer.links.whyChooseUs, url: getUrl('/quality') },
    ],
    socialLinks: [
      { icon: 'fa-facebook', url: 'https://www.facebook.com/macobate/#' },
      { icon: 'fa-twitter', url: 'https://ma.linkedin.com/company/macobate' },
      { icon: 'fa-linkedin', url: '#' },
    ],
    materials: [
      {
        icon: 'flaticon-doc',
        title: t.footer.materials.companyPresentation,
        subtitle: t.footer.materials.companyPresentationYear,
        url: '#',
      },
      {
        icon: 'flaticon-doc',
        title: t.footer.materials.technicalTraining,
        subtitle: t.footer.materials.technicalTrainingSubtitle,
        url: '#',
      },
      {
        icon: 'flaticon-pdf',
        title: t.footer.materials.companyGrowth,
        subtitle: t.footer.materials.companyGrowthSubtitle,
        url: '#',
      },
    ],
  };
}