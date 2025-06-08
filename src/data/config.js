// src/data/config.js
// Configuration globale du blog MACOBATE

export const BLOG_CONFIG = {
  // Général
  siteName: "MACOBATE",
  baseUrl: "https://macobate.com",
  articlesPerPage: 6,
  
  // SEO
  defaultTitle: "Blog MACOBATE - Actualités et innovations industrielles",
  defaultDescription: "Découvrez les dernières actualités, innovations et projets de MACOBATE",
  defaultImage: "/images/blog-og.jpg",
  
  // Images par défaut
  defaultAuthorImage: "/images/team/author-default.jpg",
  defaultArticleImage: "/images/blog/default.jpg",
  
  // Réseaux sociaux
  social: {
    facebook: "https://www.facebook.com/sharer/sharer.php?u=",
    twitter: "https://twitter.com/intent/tweet?url=",
    linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=",
    whatsapp: "https://wa.me/?text="
  }
};

// Utilitaires globaux
export const utils = {
  // Copier dans le presse-papiers
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback pour navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  },

  // Validation email
  isValidEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Formater une URL avec paramètres
  buildUrl: (base, params = {}) => {
    const url = new URL(base, BLOG_CONFIG.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.pathname + url.search;
  },

  // Afficher une notification
  showNotification: (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-suppression après 5 secondes
    const timer = setTimeout(() => {
      utils.removeNotification(notification);
    }, 5000);
    
    // Bouton de fermeture
    notification.querySelector('.notification-close').addEventListener('click', () => {
      clearTimeout(timer);
      utils.removeNotification(notification);
    });
  },

  // Supprimer une notification
  removeNotification: (notification) => {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  },

  // Initialiser les animations CSS
  initNotificationStyles: () => {
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        .notification-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }
        .notification-close {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export default { BLOG_CONFIG, utils };