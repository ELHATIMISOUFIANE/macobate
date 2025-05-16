// contact-form.js - Gestion du formulaire de contact avec validation et soumission AJAX
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Réinitialiser les messages d'erreur
      document.querySelectorAll('.error-message').forEach(el => el.remove());
      document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
      
      // Masquer les messages précédents
      if (document.getElementById('form-success')) {
        document.getElementById('form-success').remove();
      }
      if (document.getElementById('form-error')) {
        document.getElementById('form-error').remove();
      }
      
      // Validation du formulaire
      let isValid = true;
      const formData = new FormData(contactForm);
      
      // Validation du nom
      if (!formData.get('username') || formData.get('username').trim() === '') {
        showError('username', 'Veuillez entrer votre nom');
        isValid = false;
      }
      
      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.get('email') || !emailRegex.test(formData.get('email'))) {
        showError('email', 'Veuillez entrer une adresse email valide');
        isValid = false;
      }
      
      // Validation du téléphone
      if (!formData.get('phone') || formData.get('phone').trim() === '') {
        showError('phone', 'Veuillez entrer votre numéro de téléphone');
        isValid = false;
      }
      
      // Validation du message
      if (!formData.get('message') || formData.get('message').trim() === '') {
        showError('message', 'Veuillez entrer votre message');
        isValid = false;
      }
      
      if (!isValid) {
        return false;
      }
      
      // Afficher le bouton en mode chargement
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Envoi en cours...';
      submitBtn.disabled = true;
      
      try {
        // Envoyer le formulaire via AJAX
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Afficher message de succès
          const successMessage = document.createElement('div');
          successMessage.id = 'form-success';
          successMessage.className = 'alert alert-success mt-3';
          successMessage.innerHTML = '<i class="fa fa-check-circle"></i> ' + result.message;
          contactForm.appendChild(successMessage);
          
          // Réinitialiser le formulaire
          contactForm.reset();
        } else {
          // Afficher message d'erreur
          const errorMessage = document.createElement('div');
          errorMessage.id = 'form-error';
          errorMessage.className = 'alert alert-danger mt-3';
          errorMessage.innerHTML = '<i class="fa fa-exclamation-circle"></i> ' + result.message;
          contactForm.appendChild(errorMessage);
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du formulaire:', error);
        
        // Afficher message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.id = 'form-error';
        errorMessage.className = 'alert alert-danger mt-3';
        errorMessage.innerHTML = '<i class="fa fa-exclamation-circle"></i> Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer plus tard.';
        contactForm.appendChild(errorMessage);
      } finally {
        // Rétablir le bouton
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Fonction pour afficher les erreurs de validation
  function showError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.add('has-error');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message text-danger';
    errorMessage.style.fontSize = '12px';
    errorMessage.style.marginTop = '5px';
    errorMessage.innerHTML = message;
    
    formGroup.appendChild(errorMessage);
  }
});