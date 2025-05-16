// src/lib/emailService.ts
import nodemailer from 'nodemailer';
import type { MailOptions } from 'nodemailer/lib/smtp-transport';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Configuration du transporteur de mail - à remplacer par vos paramètres réels
const emailConfig: EmailConfig = {
  host: 'smtp.macobate.com',
  port: 587,
  secure: false, // true pour 465, false pour d'autres ports
  auth: {
    user: 'contact@macobate.com',
    pass: 'votre_mot_de_passe_email',
  },
};

// Créer un transporteur de mail réutilisable
const transporter = nodemailer.createTransport(emailConfig);

/**
 * Envoie un email à partir des données du formulaire de contact
 * @param formData Les données du formulaire de contact
 * @returns Promise<boolean> Succès ou échec de l'envoi
 */
export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  try {
    const mailOptions: MailOptions = {
      from: `"Site Web Macobate" <${emailConfig.auth.user}>`,
      to: 'contact@macobate.com', // Email de réception des formulaires
      replyTo: formData.email,
      subject: `Nouveau message de contact: ${formData.subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Téléphone:</strong> ${formData.phone}</p>
        <p><strong>Sujet:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong><br>${formData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Ce message a été envoyé depuis le formulaire de contact du site web.</small></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message envoyé: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

/**
 * Envoie un email de confirmation au visiteur
 * @param email L'adresse email du visiteur
 * @param name Le nom du visiteur
 * @returns Promise<boolean> Succès ou échec de l'envoi
 */
export async function sendConfirmationEmail(email: string, name: string): Promise<boolean> {
  try {
    const mailOptions: MailOptions = {
      from: `"Macobate" <${emailConfig.auth.user}>`,
      to: email,
      subject: 'Nous avons bien reçu votre message',
      html: `
        <h2>Bonjour ${name},</h2>
        <p>Nous vous confirmons la bonne réception de votre message.</p>
        <p>Notre équipe vous répondra dans les plus brefs délais.</p>
        <p>Cordialement,</p>
        <p><strong>L'équipe Macobate </strong></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation envoyée: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    return false;
  }
}