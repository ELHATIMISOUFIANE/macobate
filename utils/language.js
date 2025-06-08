---
// Exemple d'utilisation dans un composant Astro
import { getTranslations } from '../i18n/translations.js';
import { 
  getCurrentLanguage, 
  getLanguageInfo, 
  getSEOConfig,
  formatDate,
  generateBreadcrumbs,
  useLanguage
} from './language.js';

// Récupération des informations de langue
const currentPath = Astro.url.pathname;
const lang = getCurrentLanguage(currentPath);
const langInfo = getLanguageInfo(lang);
const t = getTranslations(lang);

// Configuration SEO
const seoConfig = getSEOConfig(lang, currentPath);

// Utilitaire complet de langue
const languageUtils = useLanguage(currentPath);

// Formatage de dates
const currentDate = new Date();
const formattedDate = formatDate(currentDate, lang, { 
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric' 
});

// Génération des breadcrumbs
const breadcrumbs = generateBreadcrumbs(currentPath, lang, {
  'about': lang === 'fr' ? 'À Propos' : 'About',
  'projects': lang === 'fr' ? 'Projets' : 'Projects',
  'contact': 'Contact'
});

// Exemple de données pour démonstration
interface Props {
  title?: string;
  showBreadcrumbs?: boolean;
}

const { title, showBreadcrumbs = false } = Astro.props;
---

<!DOCTYPE html>
<html lang={langInfo.code} dir={langInfo.dir}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- SEO Meta Tags -->
  <title>{title ? `${title} | ${seoConfig.siteName}` : seoConfig.siteName}</title>
  <meta name="description" content={seoConfig.description || t.header.description} />
  <meta name="keywords" content={seoConfig.keywords} />
  
  <!-- Hreflang Links -->
  {seoConfig.hreflangLinks.map(link => (
    <link rel={link.rel} hreflang={link.hreflang} href={link.href} />
  ))}
  
  <!-- Open Graph -->
  <meta property="og:locale" content={langInfo.locale} />
  <meta property="og:site_name" content={seoConfig.siteName} />
</head>

<body>
  <!-- Header avec sélecteur de langue -->
  <header class="main-header">
    <div class="language-info">
      <span class="current-language">
        {langInfo.flag} {langInfo.name}
      </span>
      <div class="language-options">
        <a href={languageUtils.urls.fr} 
           class={lang === 'fr' ? 'active' : ''}
           hreflang="fr">
          🇲🇦 Français
        </a>
        <a href={languageUtils.urls.en} 
           class={lang === 'en' ? 'active' : ''}
           hreflang="en">
          🇺🇸 English
        </a>
      </div>
    </div>
  </header>

  <!-- Breadcrumbs conditionnels -->
  {showBreadcrumbs && (
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol class="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => (
          <li class={`breadcrumb-item ${crumb.current ? 'current' : ''}`}>
            {crumb.current ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <>
                <a href={crumb.url}>{crumb.label}</a>
                {index < breadcrumbs.length - 1 && <span class="separator">›</span>}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )}

  <!-- Contenu principal -->
  <main>
    <section class="demo-section">
      <h1>{t.career.title}</h1>
      <p class="date-info">
        {lang === 'fr' ? 'Publié le' : 'Published on'}: {formattedDate}
      </p>
      
      <!-- Informations de débogage (à retirer en production) -->
      <div class="debug-info" style="background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-radius: 4px;">
        <h3>Debug Info:</h3>
        <ul>
          <li><strong>Current Language:</strong> {lang} ({langInfo.name})</li>
          <li><strong>Locale:</strong> {langInfo.locale}</li>
          <li><strong>French URL:</strong> {languageUtils.urls.fr}</li>
          <li><strong>English URL:</strong> {languageUtils.urls.en}</li>
          <li><strong>Is French:</strong> {languageUtils.isfrench ? 'Yes' : 'No'}</li>
        </ul>
      </div>
      
      <slot />
    </section>
  </main>

  <!-- Footer -->
  <footer class="main-footer">
    <div class="footer-language-info">
      <p>
        {lang === 'fr' 
          ? `Cette page est disponible en ${langInfo.name}` 
          : `This page is available in ${langInfo.name}`
        }
      </p>
      
      <!-- Liens vers les autres langues -->
      <div class="alternate-languages">
        {Object.entries(languageUtils.urls).map(([langCode, url]) => {
          if (langCode !== lang) {
            const altLangInfo = getLanguageInfo(langCode);
            return (
              <a href={url} hreflang={langCode}>
                {altLangInfo.flag} {altLangInfo.name}
              </a>
            );
          }
        })}
      </div>
    </div>
  </footer>
  
  <!-- Scripts -->
  <script>
    // Exemple d'utilisation côté client
    document.addEventListener('DOMContentLoaded', function() {
      // Détection de la langue préférée du navigateur
      const browserLang = navigator.language?.split('-')[0] || 'en';
      const currentLang = document.documentElement.lang;
      
      console.log('Browser preferred language:', browserLang);
      console.log('Current page language:', currentLang);
      
      // Logique de redirection automatique (optionnelle)
      // if (browserLang === 'fr' && currentLang === 'en' && !localStorage.getItem('language-preference')) {
      //   // Proposer de basculer vers le français
      // }
    });
  </script>
</body>
</html>

<style>
  .language-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .current-language {
    font-weight: 500;
  }
  
  .language-options {
    display: flex;
    gap: 0.5rem;
  }
  
  .language-options a {
    padding: 0.25rem 0.5rem;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .language-options a:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .language-options a.active {
    background-color: #007bff;
    color: white;
  }
  
  .breadcrumbs {
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background-color: #f8f9fa;
    border-radius: 4px;
  }
  
  .breadcrumb-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .breadcrumb-item.current {
    font-weight: 500;
  }
  
  .separator {
    color: #6c757d;
  }
  
  .debug-info {
    font-family: monospace;
    font-size: 0.875rem;
  }
  
  .alternate-languages {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .alternate-languages a {
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.05);
    transition: background-color 0.2s;
  }
  
  .alternate-languages a:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>