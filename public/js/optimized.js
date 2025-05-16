/**
 * Fichier JavaScript optimisé qui combine les fonctionnalités essentielles
 * et supprime le code inutilisé pour de meilleures performances
 */

(function($) {
  'use strict';
  
  // Variables globales
  var metronApp = {};
  
  // Initialisation de l'application
  metronApp.init = function() {
    // Fonctions d'initialisation
    this.stickyHeader();
    this.searchPopup();
    this.scrollToTop();
    this.initSliders();
    this.enableLightbox();
    this.initCounters();
    this.initWow();
    this.handleMobileNav();
    this.progressBars();
    
    // Enregistrement du service worker
    this.registerServiceWorker();
  };
  
  // Header sticky
  metronApp.stickyHeader = function() {
    if ($('.sticky-header').length) {
      var stickyMenu = $('.sticky-header');
      var mainHeader = $('.main-header');
      
      $(window).on('scroll', function() {
        var scrollPos = $(window).scrollTop();
        if (scrollPos > 100) {
          stickyMenu.addClass('fixed-header');
          mainHeader.addClass('fixed-header');
        } else {
          stickyMenu.removeClass('fixed-header');
          mainHeader.removeClass('fixed-header');
        }
      });
    }
  };
  
  // Popup de recherche
  metronApp.searchPopup = function() {
    if($('.search-box-outer').length) {
      $('.search-box-outer').on('click', function() {
        $('body').addClass('search-active');
      });
      $('.close-search').on('click', function() {
        $('body').removeClass('search-active');
      });
    }
  };
  
  // Bouton retour en haut
  metronApp.scrollToTop = function() {
    if($('.scroll-to-top').length){
      $(window).on('scroll', function() {
        var scrollPos = $(window).scrollTop();
        if (scrollPos > 400) {
          $('.scroll-to-top').fadeIn(300);
        } else {
          $('.scroll-to-top').fadeOut(300);
        }
      });
      
      $('.scroll-to-top').on('click', function() {
        $('html, body').animate({
          scrollTop: 0
        }, 500);
        return false;
      });
    }
  };
  
  // Initialisation des sliders
  metronApp.initSliders = function() {
    // Sliders principaux
    if ($('.main-slider .tp-banner').length) {
      var MainSlider = $('.main-slider .tp-banner');
      
      MainSlider.show().revolution({
        delay: 7000,
        responsiveLevels: [2220, 1024, 778, 480],
        gridwidth: [1170, 970, 750, 480],
        gridheight: [780, 650, 600, 500],
        navigation: {
          arrows: {
            enable: true,
            style: 'metis',
            tmp: '',
            hide_onleave: false
          }
        },
        touchenabled: 'on',
        onHoverStop: 'off',
      });
    }
    
    // Carousel d'items
    if ($('.three-item-carousel').length) {
      $('.three-item-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        smartSpeed: 700,
        autoplay: 5000,
        navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          800: { items: 2 },
          1024: { items: 3 },
          1200: { items: 3 }
        }
      });
    }
    
    // Carousel de témoignages
    if ($('.testimonial-two-item').length) {
      $('.testimonial-two-item').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        smartSpeed: 500,
        autoplay: 4000,
        navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
        responsive: {
          0: { items: 1 },
          480: { items: 1 },
          769: { items: 2 },
          1024: { items: 2 }
        }
      });
    }
    
    // Carousel de sponsors/clients
    if ($('.sponsors-carousel').length) {
      $('.sponsors-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        smartSpeed: 500,
        autoplay: 4000,
        navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
        responsive: {
          0: { items: 2 },
          480: { items: 3 },
          600: { items: 4 },
          800: { items: 5 },
          1024: { items: 6 }
        }
      });
    }
  };
  
  // Lightbox pour les images et vidéos
  metronApp.enableLightbox = function() {
    if($('.lightbox-image').length) {
      $('.lightbox-image').fancybox({
        openEffect: 'fade',
        closeEffect: 'fade',
        helpers: {
          media: {}
        }
      });
    }
  };
  
  // Compteurs pour les statistiques
  metronApp.initCounters = function() {
    if($('.count-box').length){
      $('.count-box').appear(function(){
        var $t = $(this),
          n = $t.find('.count-text').attr('data-stop'),
          r = parseInt($t.find('.count-text').attr('data-speed'), 10);
        
        if (!$t.hasClass('counted')) {
          $t.addClass('counted');
          $({
            countNum: $t.find('.count-text').text()
          }).animate({
            countNum: n
          }, {
            duration: r,
            easing: 'linear',
            step: function() {
              $t.find('.count-text').text(Math.floor(this.countNum));
            },
            complete: function() {
              $t.find('.count-text').text(this.countNum);
            }
          });
        }
      });
    }
  };
  
  // Animation WOW.js
  metronApp.initWow = function() {
    if($('.wow').length){
      var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true
      });
      wow.init();
    }
  };
  
  // Navigation mobile
  metronApp.handleMobileNav = function() {
    $('.main-menu .navbar-collapse > ul > li.dropdown').append('<div class="dropdown-btn"><span class="fa fa-angle-down"></span></div>');
    
    // Dropdown Button
    $('.main-menu .navbar-collapse > ul > li.dropdown .dropdown-btn').on('click', function() {
      $(this).prev('ul').slideToggle(500);
    });
    
    // Toggle menu button
    $('.main-menu .navbar-toggle').on('click', function() {
      $(this).toggleClass('active');
    });
  };
  
  // Barres de progression
  metronApp.progressBars = function() {
    if($('.progress-box .bar-fill').length){
      $('.progress-box .bar-fill').each(function() {
        var progressWidth = $(this).attr('data-percent');
        $(this).css('width', progressWidth + '%');
      });
    }
    
    if($('.range-slider-1').length){
      $('.range-slider-1').slider({
        range: true,
        min: 0,
        max: 7500,
        values: [1000, 5000],
        slide: function(event, ui) {
          $('.range-slider-1 .count').text(ui.values[0] + ' - ' + ui.values[1]);
        }
      });
      
      $('.range-slider-1 .count').text($('.range-slider-1').slider('values', 0) + ' - ' + $('.range-slider-1').slider('values', 1));
    }
  };
  
  // Enregistrement du service worker
  metronApp.registerServiceWorker = function() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
          .then(function(registration) {
            console.log('Service Worker enregistré avec succès:', registration.scope);
          })
          .catch(function(error) {
            console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
          });
      });
    }
  };
  
  // Initialisation au chargement
  $(document).ready(function() {
    metronApp.init();
    
    // Préchargeur
    if($('.preloader').length){
      $('.preloader').delay(200).fadeOut(500);
    }
  });
  
  // Initialisation après le chargement de la fenêtre
  $(window).on('load', function() {
    // Map Google (si nécessaire)
    if($('.map-canvas').length){
      var mapCanvas = $('.map-canvas');
      
      mapCanvas.each(function() {
        var $this = $(this);
        var zoom = $this.data('zoom') || 15;
        var lat = $this.data('lat');
        var lng = $this.data('lng');
        var type = $this.data('type') || 'roadmap';
        var hue = $this.data('hue') || '#0076db';
        var title = $this.data('title');
        var iconPath = $this.data('icon-path') || 'images/icons/map-marker.png';
        var contentString = $this.data('content');
        
        var mapOptions = {
          center: new google.maps.LatLng(lat, lng),
          zoom: zoom,
          mapTypeId: type,
          scrollwheel: false,
          styles: [
            {
              "featureType": "landscape",
              "stylers": [{"saturation": -100},{"lightness": 65},{"visibility": "on"}]
            }
          ]
        };
        
        var map = new google.maps.Map($this[0], mapOptions);
        
        // Marqueur
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          title: title,
          icon: iconPath
        });
        
        // Info Window
        if (contentString) {
          var infoWindow = new google.maps.InfoWindow({
            content: contentString
          });
          
          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  });
  
})(jQuery);