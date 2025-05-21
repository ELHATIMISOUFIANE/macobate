/**
 * Génère les marquages Schema.org pour différentes pages du site MACOBATE
 * @param {string} pageType - Type de page (home, about, market, contact, blog, service, projects)
 * @returns {string} - Marquage JSON-LD pour Schema.org
 */
export function getSchemaOrgMarkup(pageType) {
  const baseUrl = "https://macobate.com";
  
  // Schéma de base pour toutes les pages
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": baseUrl,
    "inLanguage": "fr-MA",
    "publisher": {
      "@type": "Organization",
      "name": "MACOBATE",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.png`
      }
    }
  };
  
  // Schémas spécifiques par type de page
  const schemasByType = {
    // Page d'accueil
    home: {
      "@type": "WebPage",
      "name": "MACOBATE - Solutions d'ingénierie industrielle au Maroc et en Afrique",
      "description": "MACOBATE, entreprise marocaine d'ingénierie industrielle spécialisée dans la charpente métallique, les équipements hydromécaniques, les appareils à pression et le traitement d'eau.",
      "mainEntity": {
        "@type": "Organization",
        "name": "MACOBATE",
        "description": "Entreprise d'ingénierie industrielle fondée il y a plus de 40 ans, spécialisée dans les infrastructures hydrauliques, industrielles et environnementales.",
        "foundingDate": "1980",
        "foundingLocation": "Rabat, Maroc",
        "knowsAbout": ["Ingénierie industrielle", "Structures métalliques", "Équipements hydromécaniques", "Traitement des eaux", "Appareils à pression"]
      }
    },
    
    // Page à propos
    about: {
      "@type": "AboutPage",
      "name": "À propos de MACOBATE - Notre histoire et notre expertise",
      "description": "Découvrez l'histoire de MACOBATE, entreprise marocaine d'ingénierie fondée il y a plus de 40 ans et spécialisée dans les infrastructures industrielles et hydrauliques.",
      "mainEntity": {
        "@type": "Organization",
        "name": "MACOBATE",
        "foundingDate": "1980",
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "value": "100+"
        },
        "award": [
          "Certification ISO 9001",
          "Certification ISO 14001",
          "Certification EN 1090-2 EXC2/3"
        ]
      }
    },
    
    // Page services
    service: {
      "@type": "WebPage",
      "name": "Services et Solutions MACOBATE - Ingénierie industrielle et hydraulique",
      "description": "Découvrez nos services d'ingénierie industrielle: charpente métallique, équipements hydromécaniques, traitement des eaux et automatismes.",
      "mainEntity": {
        "@type": "Service",
        "serviceType": "Ingénierie industrielle",
        "provider": {
          "@type": "Organization",
          "name": "MACOBATE"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Services d'ingénierie MACOBATE",
          "itemListElement": [
            {
              "@type": "Service",
              "name": "Charpente Métallique",
              "url": `${baseUrl}/services/detailServices#charpente-metallique`
            },
            {
              "@type": "Service",
              "name": "Équipements Hydromécaniques",
              "url": `${baseUrl}/services/detailServices#equipements-hydromecaniques`
            },
            {
              "@type": "Service",
              "name": "Traitement de l'eau",
              "url": `${baseUrl}/services/detailServices#traitement-eau`
            }
          ]
        }
      }
    },
    
    // Page projets
    projects: {
      "@type": "CollectionPage",
      "name": "Projets et Réalisations MACOBATE",
      "description": "Découvrez les projets réalisés par MACOBATE dans l'ingénierie industrielle, les infrastructures hydrauliques et le traitement des eaux.",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Project", 
              "name": "Barrage Sidi Mohammed Ben Abdellah",
              "description": "Équipements hydromécaniques et vannes de régulation",
              "url": `${baseUrl}/projects/detailProjects#barrages-amenagements-hydrauliques`
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Project",
              "name": "Station d'Épuration OCP Khouribga",
              "description": "Installation complète de traitement des eaux usées industrielles",
              "url": `${baseUrl}/projects/detailProjects#stations-pompage-traitement`
            }
          }
        ]
      }
    },
    
    // Page contact
    contact: {
      "@type": "ContactPage",
      "name": "Contactez MACOBATE - Demande d'information ou devis",
      "description": "Contactez notre équipe d'experts pour toute demande d'information, de devis ou de collaboration dans le domaine de l'ingénierie industrielle.",
      "mainEntity": {
        "@type": "Organization",
        "name": "MACOBATE",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+212 5 37 65 96 46",
          "email": "contact@macobate.com",
          "contactType": "customer service",
          "availableLanguage": ["French", "Arabic", "English"]
        }
      }
    },
    
    // Page blog
    blog: {
      "@type": "Blog",
      "name": "Actualités et Articles MACOBATE",
      "description": "Suivez les actualités de MACOBATE, nos derniers projets, innovations et participation aux événements du secteur de l'ingénierie industrielle."
    }
  };
  
  // Sélectionner le schéma approprié ou utiliser le schéma de base
  const selectedSchema = schemasByType[pageType] || baseSchema;
  
  // Fusionner le schéma sélectionné avec le schéma de base
  const finalSchema = { ...baseSchema, ...selectedSchema };
  
  // Convertir le schéma en JSON pour l'insérer dans la page
  return `<script type="application/ld+json">${JSON.stringify(finalSchema)}</script>`;
}