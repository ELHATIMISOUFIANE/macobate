/**
 * Script optimisé pour l'enregistrement du Service Worker MACOBATE
 * Améliore l'expérience utilisateur avec:
 * - Fonctionnalités hors ligne
 * - Chargement plus rapide des pages
 * - Notification des mises à jour
 */

// Fonction auto-exécutée pour éviter les variables globales
(function() {
  'use strict';

  // Configuration
  const SW_VERSION = '1.0.0';
  const SW_URL = '/service-worker.js';
  const DEBUG = false; // Mettre à true pour activer les logs détaillés

  // Logging conditionnel
  const log = DEBUG ? console.log.bind(console) : function(){};
  const warn = console.warn.bind(console);
  const error = console.error.bind(console);

  // Détecter si le navigateur prend en charge les Service Workers
  if ('serviceWorker' in navigator) {
    // Attendre que la page soit complètement chargée pour ne pas impacter les performances
    window.addEventListener('load', async () => {
      try {
        log('MACOBATE SW: Tentative d\'enregistrement du Service Worker...');
        
        // Enregistrer le Service Worker
        const registration = await navigator.serviceWorker.register(SW_URL);
        log('MACOBATE SW: Service Worker enregistré avec succès:', registration.scope);

        // Vérifier les mises à jour des Service Workers existants
        checkForUpdates(registration);
        
        // Créer l'interface utilisateur pour les notifications de mise à jour
        setupUpdateUI(registration);
        
        // Configurer l'indexedDB pour le stockage hors ligne des formulaires
        setupOfflineFormSupport();
        
      } catch (err) {
        error('MACOBATE SW: Erreur lors de l\'enregistrement du Service Worker:', err);
      }
    });

    // Gérer les événements online/offline
    setupNetworkStatusHandlers();
  } else {
    warn('MACOBATE SW: Les Service Workers ne sont pas pris en charge par ce navigateur');
  }

  /**
   * Vérifie si une mise à jour du Service Worker est disponible
   */
  function checkForUpdates(registration) {
    // Vérifier au chargement de la page
    if (registration.waiting) {
      log('MACOBATE SW: Nouvelle version en attente d\'activation');
      showUpdateNotification();
    }

    // Surveiller les mises à jour futures
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      log('MACOBATE SW: Nouveau Service Worker en cours d\'installation');

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          log('MACOBATE SW: Nouvelle version installée et en attente');
          showUpdateNotification();
        }
      });
    });

    // Vérifier la version active
    if (navigator.serviceWorker.controller) {
      checkVersion();
    }
  }

  /**
   * Met en place l'interface utilisateur pour la notification de mise à jour
   */
  function setupUpdateUI(registration) {
    // Ajouter un gestionnaire pour le bouton de mise à jour
    document.addEventListener('click', (event) => {
      if (event.target && event.target.id === 'update-sw-button') {
        event.preventDefault();
        
        if (registration.waiting) {
          // Envoyer un message pour activer immédiatement le nouveau Service Worker
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Recharger la page pour utiliser le nouveau Service Worker
        window.location.reload();
      }
    });
  }

  /**
   * Affiche une notification à l'utilisateur qu'une mise à jour est disponible
   */
  function showUpdateNotification() {
    // Créer une notification en bas de la page
    const notification = document.createElement('div');
    notification.id = 'sw-update-notification';
    notification.innerHTML = `
      <div style="position: fixed; bottom: 20px; right: 20px; background-color: #1720d7; color: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 9999; display: flex; align-items: center; max-width: 300px;">
        <div style="flex-grow: 1; margin-right: 10px;">
          <strong>Mise à jour disponible</strong>
          <p style="margin: 5px 0 0; font-size: 14px;">Une nouvelle version du site est disponible.</p>
        </div>
        <button id="update-sw-button" style="background-color: white; color: #1720d7; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Mettre à jour</button>
      </div>
    `;
    
    // Ajouter la notification au DOM
    document.body.appendChild(notification);
  }

  /**
   * Vérifie la version actuelle du Service Worker
   */
  function checkVersion() {
    if (navigator.serviceWorker.controller) {
      // Créer un canal de communication
      const messageChannel = new MessageChannel();
      
      // Configurer le gestionnaire de réponse
      messageChannel.port1.onmessage = (event) => {
        if (event.data && event.data.version) {
          log('MACOBATE SW: Version active:', event.data.version);
          
          // Comparer avec la version attendue
          if (event.data.version !== SW_VERSION) {
            log('MACOBATE SW: Version différente détectée');
          }
        }
      };
      
      // Envoyer la demande au Service Worker
      navigator.serviceWorker.controller.postMessage({
        type: 'CHECK_VERSION'
      }, [messageChannel.port2]);
    }
  }

  /**
   * Configure le support des formulaires hors ligne
   */
  function setupOfflineFormSupport() {
    // Intercepter les soumissions de formulaire pertinentes
    document.addEventListener('submit', (event) => {
      // Cibler uniquement les formulaires de contact et devis
      if (event.target.id === 'contact-form' || event.target.id === 'devis-form') {
        // Si hors ligne, stocker dans IndexedDB pour synchronisation ultérieure
        if (!navigator.onLine) {
          event.preventDefault();
          
          const formData = new FormData(event.target);
          const formObject = {};
          
          formData.forEach((value, key) => {
            formObject[key] = value;
          });
          
          // Stocker dans IndexedDB
          storeFormData(event.target.id, formObject);
          
          // Informer l'utilisateur
          alert('Vous êtes actuellement hors ligne. Votre demande sera envoyée automatiquement dès que la connexion sera rétablie.');
        }
      }
    });
  }

  /**
   * Stocke les données de formulaire dans IndexedDB pour synchronisation ultérieure
   */
  async function storeFormData(formType, data) {
    try {
      const dbName = 'macobate-forms';
      const storeName = formType === 'contact-form' ? 'pending-contacts' : 'pending-devis';
      
      // Ouvrir/créer la base de données
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        
        request.onerror = (event) => reject('Erreur d'ouverture de la base de données');
        request.onsuccess = (event) => resolve(event.target.result);
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          // Créer les object stores si nécessaire
          if (!db.objectStoreNames.contains('pending-contacts')) {
            db.createObjectStore('pending-contacts', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('pending-devis')) {
            db.createObjectStore('pending-devis', { keyPath: 'id', autoIncrement: true });
          }
        };
      });
      
      // Ajouter les données à l'object store
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      store.add({
        timestamp: Date.now(),
        data: data
      });
      
      // Attendre la fin de la transaction
      await new Promise((resolve) => {
        transaction.oncomplete = resolve;
      });
      
      log('MACOBATE SW: Formulaire stocké pour synchronisation ultérieure');
      
      // Planifier une synchronisation background quand la connexion reviendra
      if ('sync' in registration) {
        await registration.sync.register(formType === 'contact-form' ? 'contact-form-submit' : 'devis-form-submit');
        log('MACOBATE SW: Synchronisation background enregistrée');
      }
      
    } catch (err) {
      error('MACOBATE SW: Erreur lors du stockage du formulaire:', err);
    }
  }

  /**
   * Configure les gestionnaires pour les événements de changement de statut réseau
   */
  function setupNetworkStatusHandlers() {
    // Quand la connexion est perdue
    window.addEventListener('offline', () => {
      log('MACOBATE SW: Connexion perdue');
      
      // Afficher une notification subtile
      const notification = document.createElement('div');
      notification.id = 'offline-notification';
      notification.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background-color: #f44336; color: white; padding: 12px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 9999;">
          <strong>Hors ligne</strong> - Certaines fonctionnalités peuvent être limitées
        </div>
      `;
      
      document.body.appendChild(notification);
    });
    
    // Quand la connexion est rétablie
    window.addEventListener('online', () => {
      log('MACOBATE SW: Connexion rétablie');
      
      // Supprimer la notification hors ligne si présente
      const notification = document.getElementById('offline-notification');
      if (notification) {
        notification.remove();
      }
      
      // Afficher une notification de reconnexion
      const onlineNotification = document.createElement('div');
      onlineNotification.id = 'online-notification';
      onlineNotification.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background-color: #4CAF50; color: white; padding: 12px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 9999;">
          <strong>En ligne</strong> - Connexion rétablie
        </div>
      `;
      
      document.body.appendChild(onlineNotification);
      
      // Supprimer après 3 secondes
      setTimeout(() => {
        const notif = document.getElementById('online-notification');
        if (notif) {
          notif.remove();
        }
      }, 3000);
    });
  }
})();