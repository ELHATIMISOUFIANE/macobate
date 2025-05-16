// src/lib/schema.ts
// Module pour la gestion des schémas Schema.org

/**
 * Génère le Schema.org markup pour l'organisation
 * @returns {string} Le markup Schema.org pour l'organisation
 */
export function getOrganizationSchema(): string {
  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Macobate Industry",
  "url": "https://votredomaine.com",
  "logo": "https://votredomaine.com/images/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+212XXXXXXXXX",
    "contactType": "customer service",
    "email": "contact@macobate.com",
    "availableLanguage": ["English", "French"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "48 Zone Industrielle, Quartier Bouregreg",
    "addressLocality": "Rabat",
    "postalCode": "10000",
    "addressCountry": "MA"
  },
  "sameAs": [
    "https://www.facebook.com/Macobateindustry",
    "https://www.twitter.com/Macobateindustry",
    "https://www.linkedin.com/company/Macobateindustry"
  ]
}
</script>
`;
}

/**
 * Génère le Schema.org markup pour la page À propos
 * @returns {string} Le markup Schema.org pour la page À propos
 */
export function getAboutPageSchema(): string {
  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Us - Macobate Industry",
  "description": "Learn about Macobate Industry, our mission, vision, and our expert team of professionals in industrial solutions.",
  "mainEntity": {
    "@type": "Organization",
    "name": "Macobate Industry",
    "foundingDate": "1975",
    "founders": [
      {
        "@type": "Person",
        "name": "Teena Venanda",
        "jobTitle": "CEO & Founder"
      }
    ],
    "numberOfEmployees": "1635"
  }
}
</script>
`;
}

/**
 * Génère le Schema.org markup pour la page des secteurs de marché
 * @returns {string} Le markup Schema.org pour la page des secteurs de marché
 */
export function getMarketSectorsSchema(): string {
  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Service",
      "position": 1,
      "name": "Automotive Manufacturing",
      "description": "Specialized services for the automotive manufacturing industry.",
      "provider": {
        "@type": "Organization",
        "name": "Macobate Industry"
      },
      "url": "https://votredomaine.com/market-single"
    },
    {
      "@type": "Service",
      "position": 2,
      "name": "Industrial Construction",
      "description": "Expert solutions for industrial construction projects.",
      "provider": {
        "@type": "Organization",
        "name": "Macobate Industry"
      },
      "url": "https://votredomaine.com/market-single"
    },
    {
      "@type": "Service",
      "position": 3,
      "name": "Oil & Gas Conservation",
      "description": "Innovative solutions for oil and gas conservation.",
      "provider": {
        "@type": "Organization",
        "name": "Macobate Industry"
      },
      "url": "https://votredomaine.com/market-single"
    }
  ]
}
</script>
`;
}

/**
 * Génère le Schema.org markup pour la page des projets
 * @returns {string} Le markup Schema.org pour la page des projets
 */
export function getProjectsPageSchema(): string {
  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Projects - Macobate Industry",
  "description": "Explore our portfolio of industrial projects and constructions across various locations.",
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 9,
    "itemListElement": [
      {
        "@type": "Article",
        "position": 1,
        "name": "Boston Railway Station",
        "image": "https://votredomaine.com/images/gallery/16.jpg",
        "url": "https://votredomaine.com/projects-single",
        "locationCreated": {
          "@type": "Place",
          "name": "New York"
        },
        "datePublished": "2015"
      },
      {
        "@type": "Article",
        "position": 2,
        "name": "Boston Railway Station",
        "image": "https://votredomaine.com/images/gallery/17.jpg",
        "url": "https://votredomaine.com/projects-single",
        "locationCreated": {
          "@type": "Place",
          "name": "New York"
        },
        "datePublished": "2015"
      },
      {
        "@type": "Article",
        "position": 3,
        "name": "Boston Railway Station",
        "image": "https://votredomaine.com/images/gallery/18.jpg",
        "url": "https://votredomaine.com/projects-single",
        "locationCreated": {
          "@type": "Place",
          "name": "New York"
        },
        "datePublished": "2015"
      }
    ]
  },
  "provider": {
    "@type": "Organization",
    "name": "Macobate Industry"
  }
}
</script>
`;
}

/**
 * Génère le Schema.org markup pour la page de contact
 * @returns {string} Le markup Schema.org pour la page de contact
 */
export function getContactPageSchema(): string {
  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact - Macobate Industry",
  "description": "Contact Macobate Industry for inquiries about our industrial solutions and services.",
  "mainEntity": {
    "@type": "Organization",
    "name": "Macobate Industry",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+321 4567 89 012",
      "contactType": "customer service",
      "email": "Supportteam@Metroindustry.com",
      "availableLanguage": ["English", "French"],
      "contactOption": "TollFree",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "17:00"
      }
    }
  }
}
</script>
`;
}

/**
 * Génère le Schema.org markup pour la page de blog
 * @returns {string} Le markup Schema.org pour la page de blog
 */
export function getBlogPageSchema(): string {
  return `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog - Macobate Industry",
  "description": "Latest news, insights and updates from Macobate Industry.",
  "publisher": {
    "@type": "Organization",
    "name": "Macobate Industry",
    "logo": {
      "@type": "ImageObject",
      "url": "https://votredomaine.com/images/logo.png"
    }
  },
  "blogPost": [
    {
      "@type": "BlogPosting",
      "headline": "We are best for any industrial & business solution.",
      "datePublished": "2017-08-13T00:00:00+00:00",
      "author": {
        "@type": "Person",
        "name": "Fernando"
      },
      "url": "https://votredomaine.com/blog-detail"
    },
    {
      "@type": "BlogPosting",
      "headline": "10 reason why should choose our industry.",
      "datePublished": "2017-08-13T00:00:00+00:00",
      "author": {
        "@type": "Person",
        "name": "Fernando"
      },
      "url": "https://votredomaine.com/blog-detail"
    },
    {
      "@type": "BlogPosting",
      "headline": "We won best factory award of the year 2015 & 16.",
      "datePublished": "2017-07-05T00:00:00+00:00",
      "author": {
        "@type": "Person",
        "name": "Richardson"
      },
      "url": "https://votredomaine.com/blog-detail"
    }
  ]
}
</script>
`;
}

/**
 * Obtient le markup Schema.org approprié en fonction du type de page
 * @param {string} pageType Le type de page (home, about, market, contact, blog, projects)
 * @returns {string} Le markup Schema.org approprié
 */
export function getSchemaOrgMarkup(pageType: string): string {
  switch(pageType) {
    case 'home':
      return getOrganizationSchema();
    case 'about':
      return getAboutPageSchema();
    case 'market':
      return getMarketSectorsSchema();
    case 'projects':
      return getProjectsPageSchema();
    case 'contact':
      return getContactPageSchema();
    case 'blog':
      return getBlogPageSchema();
    default:
      return getOrganizationSchema();
  }
}