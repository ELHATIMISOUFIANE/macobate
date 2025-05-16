// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { sendContactEmail, sendConfirmationEmail } from '../../lib/emailService';

export const post: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    // Récupération des données du formulaire
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const subject = formData.get('subject')?.toString() || 'Contact from Website';
    const message = formData.get('message')?.toString() || '';
    
    // Validation des données
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Veuillez remplir tous les champs obligatoires.'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Envoyer l'email
    const emailSent = await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message
    });
    
    // Envoyer l'email de confirmation au visiteur
    if (emailSent) {
      await sendConfirmationEmail(email, name);
    }
    
    return new Response(
      JSON.stringify({
        success: emailSent,
        message: emailSent 
          ? 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt.' 
          : 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.'
      }),
      {
        status: emailSent ? 200 : 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};