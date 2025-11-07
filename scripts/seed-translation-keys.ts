import { prisma } from '../src/lib/db'
import { TranslationService } from '../src/lib/translation-service'

const commonTranslations = {
  // Buttons
  'button.submit': {
    category: 'content',
    description: 'Submit button text',
    translations: {
      nl: 'Verzenden',
      fr: 'Envoyer',
      en: 'Submit',
      de: 'Absenden'
    }
  },
  'button.cancel': {
    category: 'content',
    description: 'Cancel button text',
    translations: {
      nl: 'Annuleren',
      fr: 'Annuler',
      en: 'Cancel',
      de: 'Abbrechen'
    }
  },
  'button.save': {
    category: 'content',
    description: 'Save button text',
    translations: {
      nl: 'Opslaan',
      fr: 'Enregistrer',
      en: 'Save',
      de: 'Speichern'
    }
  },
  'button.delete': {
    category: 'content',
    description: 'Delete button text',
    translations: {
      nl: 'Verwijderen',
      fr: 'Supprimer',
      en: 'Delete',
      de: 'Löschen'
    }
  },
  'button.edit': {
    category: 'content',
    description: 'Edit button text',
    translations: {
      nl: 'Bewerken',
      fr: 'Modifier',
      en: 'Edit',
      de: 'Bearbeiten'
    }
  },
  'button.create': {
    category: 'content',
    description: 'Create button text',
    translations: {
      nl: 'Aanmaken',
      fr: 'Créer',
      en: 'Create',
      de: 'Erstellen'
    }
  },
  'button.add': {
    category: 'content',
    description: 'Add button text',
    translations: {
      nl: 'Toevoegen',
      fr: 'Ajouter',
      en: 'Add',
      de: 'Hinzufügen'
    }
  },
  'button.close': {
    category: 'content',
    description: 'Close button text',
    translations: {
      nl: 'Sluiten',
      fr: 'Fermer',
      en: 'Close',
      de: 'Schließen'
    }
  },
  'button.back': {
    category: 'content',
    description: 'Back button text',
    translations: {
      nl: 'Terug',
      fr: 'Retour',
      en: 'Back',
      de: 'Zurück'
    }
  },
  'button.next': {
    category: 'content',
    description: 'Next button text',
    translations: {
      nl: 'Volgende',
      fr: 'Suivant',
      en: 'Next',
      de: 'Weiter'
    }
  },
  'button.previous': {
    category: 'content',
    description: 'Previous button text',
    translations: {
      nl: 'Vorige',
      fr: 'Précédent',
      en: 'Previous',
      de: 'Vorherige'
    }
  },
  'button.loading': {
    category: 'content',
    description: 'Loading button text',
    translations: {
      nl: 'Laden...',
      fr: 'Chargement...',
      en: 'Loading...',
      de: 'Laden...'
    }
  },
  'button.saving': {
    category: 'content',
    description: 'Saving button text',
    translations: {
      nl: 'Opslaan...',
      fr: 'Enregistrement...',
      en: 'Saving...',
      de: 'Speichern...'
    }
  },
  'button.deleting': {
    category: 'content',
    description: 'Deleting button text',
    translations: {
      nl: 'Verwijderen...',
      fr: 'Suppression...',
      en: 'Deleting...',
      de: 'Löschen...'
    }
  },

  // Navigation
  'nav.home': {
    category: 'content',
    description: 'Home navigation link',
    translations: {
      nl: 'Home',
      fr: 'Accueil',
      en: 'Home',
      de: 'Startseite'
    }
  },
  'nav.projects': {
    category: 'content',
    description: 'Projects navigation link',
    translations: {
      nl: 'Projecten',
      fr: 'Projets',
      en: 'Projects',
      de: 'Projekte'
    }
  },
  'nav.about': {
    category: 'content',
    description: 'About navigation link',
    translations: {
      nl: 'Over',
      fr: 'À propos',
      en: 'About',
      de: 'Über'
    }
  },
  'nav.contact': {
    category: 'content',
    description: 'Contact navigation link',
    translations: {
      nl: 'Contact',
      fr: 'Contact',
      en: 'Contact',
      de: 'Kontakt'
    }
  },
  'nav.services': {
    category: 'content',
    description: 'Services navigation link',
    translations: {
      nl: 'Diensten',
      fr: 'Services',
      en: 'Services',
      de: 'Dienstleistungen'
    }
  },

  // Admin
  'admin.dashboard': {
    category: 'admin',
    description: 'Admin dashboard title',
    translations: {
      nl: 'Dashboard',
      fr: 'Tableau de bord',
      en: 'Dashboard',
      de: 'Dashboard'
    }
  },
  'admin.projects': {
    category: 'admin',
    description: 'Admin projects section',
    translations: {
      nl: 'Projecten',
      fr: 'Projets',
      en: 'Projects',
      de: 'Projekte'
    }
  },
  'admin.content': {
    category: 'admin',
    description: 'Admin content section',
    translations: {
      nl: 'Inhoud',
      fr: 'Contenu',
      en: 'Content',
      de: 'Inhalt'
    }
  },
  'admin.messages': {
    category: 'admin',
    description: 'Admin messages section',
    translations: {
      nl: 'Berichten',
      fr: 'Messages',
      en: 'Messages',
      de: 'Nachrichten'
    }
  },
  'admin.settings': {
    category: 'admin',
    description: 'Admin settings section',
    translations: {
      nl: 'Instellingen',
      fr: 'Paramètres',
      en: 'Settings',
      de: 'Einstellungen'
    }
  },
  'admin.translations': {
    category: 'admin',
    description: 'Admin translations section',
    translations: {
      nl: 'Vertalingen',
      fr: 'Traductions',
      en: 'Translations',
      de: 'Übersetzungen'
    }
  },
  'admin.pageBuilder': {
    category: 'admin',
    description: 'Admin page builder section',
    translations: {
      nl: 'Pagina Bouwer',
      fr: 'Constructeur de pages',
      en: 'Page Builder',
      de: 'Seiten-Builder'
    }
  },
  'admin.gallery': {
    category: 'admin',
    description: 'Admin gallery section',
    translations: {
      nl: 'Galerij',
      fr: 'Galerie',
      en: 'Gallery',
      de: 'Galerie'
    }
  },
  'admin.analytics': {
    category: 'admin',
    description: 'Admin analytics section',
    translations: {
      nl: 'Analyses',
      fr: 'Analytiques',
      en: 'Analytics',
      de: 'Analysen'
    }
  },

  // Messages
  'message.success': {
    category: 'messages',
    description: 'Success message',
    translations: {
      nl: 'Succesvol!',
      fr: 'Succès!',
      en: 'Success!',
      de: 'Erfolg!'
    }
  },
  'message.error': {
    category: 'messages',
    description: 'Error message',
    translations: {
      nl: 'Er is een fout opgetreden',
      fr: 'Une erreur s\'est produite',
      en: 'An error occurred',
      de: 'Ein Fehler ist aufgetreten'
    }
  },
  'message.loading': {
    category: 'messages',
    description: 'Loading message',
    translations: {
      nl: 'Laden...',
      fr: 'Chargement...',
      en: 'Loading...',
      de: 'Laden...'
    }
  },
  'message.noData': {
    category: 'messages',
    description: 'No data available message',
    translations: {
      nl: 'Geen gegevens beschikbaar',
      fr: 'Aucune donnée disponible',
      en: 'No data available',
      de: 'Keine Daten verfügbar'
    }
  },

  // Forms
  'form.name': {
    category: 'forms',
    description: 'Name field label',
    translations: {
      nl: 'Naam',
      fr: 'Nom',
      en: 'Name',
      de: 'Name'
    }
  },
  'form.email': {
    category: 'forms',
    description: 'Email field label',
    translations: {
      nl: 'E-mail',
      fr: 'E-mail',
      en: 'Email',
      de: 'E-Mail'
    }
  },
  'form.password': {
    category: 'forms',
    description: 'Password field label',
    translations: {
      nl: 'Wachtwoord',
      fr: 'Mot de passe',
      en: 'Password',
      de: 'Passwort'
    }
  },
  'form.message': {
    category: 'forms',
    description: 'Message field label',
    translations: {
      nl: 'Bericht',
      fr: 'Message',
      en: 'Message',
      de: 'Nachricht'
    }
  },
  'form.required': {
    category: 'forms',
    description: 'Required field indicator',
    translations: {
      nl: 'Verplicht',
      fr: 'Requis',
      en: 'Required',
      de: 'Erforderlich'
    }
  },
  'form.projectType': {
    category: 'forms',
    description: 'Project type field label',
    translations: {
      nl: 'Projecttype',
      fr: 'Type de projet',
      en: 'Project Type',
      de: 'Projekttyp'
    }
  },
  'form.selectProjectType': {
    category: 'forms',
    description: 'Select project type placeholder',
    translations: {
      nl: 'Selecteer een projecttype',
      fr: 'Sélectionnez un type de projet',
      en: 'Select a project type',
      de: 'Wählen Sie einen Projekttyp'
    }
  },
  'form.sendMessage': {
    category: 'forms',
    description: 'Send message button',
    translations: {
      nl: 'Bericht verzenden',
      fr: 'Envoyer le message',
      en: 'Send Message',
      de: 'Nachricht senden'
    }
  },
  'form.sending': {
    category: 'forms',
    description: 'Sending message button',
    translations: {
      nl: 'Verzenden...',
      fr: 'Envoi...',
      en: 'Sending...',
      de: 'Senden...'
    }
  },
  'form.messageSent': {
    category: 'messages',
    description: 'Message sent successfully',
    translations: {
      nl: 'Bericht succesvol verzonden!',
      fr: 'Message envoyé avec succès!',
      en: 'Message sent successfully!',
      de: 'Nachricht erfolgreich gesendet!'
    }
  },
  'form.thankYou': {
    category: 'messages',
    description: 'Thank you message',
    translations: {
      nl: 'Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.',
      fr: 'Merci pour votre message. Nous vous répondrons dans les plus brefs délais.',
      en: 'Thank you for your message. We\'ll get back to you as soon as possible.',
      de: 'Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.'
    }
  },
  'form.sendAnother': {
    category: 'forms',
    description: 'Send another message button',
    translations: {
      nl: 'Nog een bericht verzenden',
      fr: 'Envoyer un autre message',
      en: 'Send another message',
      de: 'Weitere Nachricht senden'
    }
  },
  'form.errorSending': {
    category: 'messages',
    description: 'Error sending message',
    translations: {
      nl: 'Fout bij verzenden bericht',
      fr: 'Erreur lors de l\'envoi du message',
      en: 'Error sending message',
      de: 'Fehler beim Senden der Nachricht'
    }
  },
  'form.tryAgain': {
    category: 'forms',
    description: 'Try again link',
    translations: {
      nl: 'Opnieuw proberen',
      fr: 'Réessayer',
      en: 'Try again',
      de: 'Erneut versuchen'
    }
  },
  'form.privacyAccept': {
    category: 'forms',
    description: 'Privacy policy acceptance text',
    translations: {
      nl: 'Ik accepteer het privacybeleid en ga akkoord met de verwerking van mijn persoonsgegevens voor het beantwoorden van mijn vraag. *',
      fr: 'J\'accepte la politique de confidentialité et j\'accepte le traitement de mes données personnelles pour répondre à ma demande. *',
      en: 'I accept the privacy policy and agree to the processing of my personal data for the purpose of responding to my inquiry. *',
      de: 'Ich akzeptiere die Datenschutzrichtlinie und stimme der Verarbeitung meiner persönlichen Daten zum Zweck der Beantwortung meiner Anfrage zu. *'
    }
  },
  'form.marketingConsent': {
    category: 'forms',
    description: 'Marketing consent text',
    translations: {
      nl: 'Ik zou graag af en toe updates ontvangen over uw diensten en projecten (optioneel).',
      fr: 'J\'aimerais recevoir occasionnellement des mises à jour sur vos services et projets (optionnel).',
      en: 'I would like to receive occasional updates about your services and projects (optional).',
      de: 'Ich möchte gelegentlich Updates zu Ihren Dienstleistungen und Projekten erhalten (optional).'
    }
  },
  'form.dataProtection': {
    category: 'forms',
    description: 'Data protection notice title',
    translations: {
      nl: 'Gegevensbescherming:',
      fr: 'Avis de protection des données:',
      en: 'Data Protection Notice:',
      de: 'Datenschutzhinweis:'
    }
  },
  'auth.signIn': {
    category: 'admin',
    description: 'Sign in button',
    translations: {
      nl: 'Inloggen',
      fr: 'Se connecter',
      en: 'Sign In',
      de: 'Anmelden'
    }
  },
  'auth.signUp': {
    category: 'admin',
    description: 'Sign up button',
    translations: {
      nl: 'Registreren',
      fr: 'S\'inscrire',
      en: 'Sign Up',
      de: 'Registrieren'
    }
  },
  'auth.signOut': {
    category: 'admin',
    description: 'Sign out button',
    translations: {
      nl: 'Uitloggen',
      fr: 'Se déconnecter',
      en: 'Sign Out',
      de: 'Abmelden'
    }
  },
  'auth.createAccount': {
    category: 'admin',
    description: 'Create account title',
    translations: {
      nl: 'Account aanmaken',
      fr: 'Créer un compte',
      en: 'Create Account',
      de: 'Konto erstellen'
    }
  },
  'auth.welcome': {
    category: 'admin',
    description: 'Welcome message',
    translations: {
      nl: 'Welkom!',
      fr: 'Bienvenue!',
      en: 'Welcome!',
      de: 'Willkommen!'
    }
  },
  'auth.loggedInAs': {
    category: 'admin',
    description: 'Logged in as text',
    translations: {
      nl: 'Ingelogd als:',
      fr: 'Connecté en tant que:',
      en: 'Logged in as:',
      de: 'Angemeldet als:'
    }
  },
  'auth.alreadyHaveAccount': {
    category: 'admin',
    description: 'Already have account text',
    translations: {
      nl: 'Heeft u al een account?',
      fr: 'Vous avez déjà un compte?',
      en: 'Already have an account?',
      de: 'Haben Sie bereits ein Konto?'
    }
  },
  'auth.noAccount': {
    category: 'admin',
    description: 'Don\'t have account text',
    translations: {
      nl: 'Heeft u nog geen account?',
      fr: 'Vous n\'avez pas de compte?',
      en: 'Don\'t have an account?',
      de: 'Haben Sie noch kein Konto?'
    }
  },
  'nav.backToSite': {
    category: 'content',
    description: 'Back to site link',
    translations: {
      nl: 'Terug naar site',
      fr: 'Retour au site',
      en: 'Back to Site',
      de: 'Zurück zur Website'
    }
  },
  'project.edit': {
    category: 'admin',
    description: 'Edit project title',
    translations: {
      nl: 'Project bewerken',
      fr: 'Modifier le projet',
      en: 'Edit Project',
      de: 'Projekt bearbeiten'
    }
  },
  'project.create': {
    category: 'admin',
    description: 'Create project title',
    translations: {
      nl: 'Project aanmaken',
      fr: 'Créer un projet',
      en: 'Create Project',
      de: 'Projekt erstellen'
    }
  },
  'project.basicSettings': {
    category: 'admin',
    description: 'Basic settings section',
    translations: {
      nl: 'Basisinstellingen',
      fr: 'Paramètres de base',
      en: 'Basic Settings',
      de: 'Grundeinstellungen'
    }
  },
  'project.contentType': {
    category: 'admin',
    description: 'Content type label',
    translations: {
      nl: 'Inhoudstype',
      fr: 'Type de contenu',
      en: 'Content Type',
      de: 'Inhaltstyp'
    }
  },
  'project.selectContentType': {
    category: 'admin',
    description: 'Select content type placeholder',
    translations: {
      nl: 'Selecteer inhoudstype',
      fr: 'Sélectionnez le type de contenu',
      en: 'Select content type',
      de: 'Inhaltstyp auswählen'
    }
  },
  'project.featured': {
    category: 'admin',
    description: 'Featured checkbox label',
    translations: {
      nl: 'Uitgelicht',
      fr: 'En vedette',
      en: 'Featured',
      de: 'Hervorgehoben'
    }
  },
  'project.published': {
    category: 'admin',
    description: 'Published checkbox label',
    translations: {
      nl: 'Gepubliceerd',
      fr: 'Publié',
      en: 'Published',
      de: 'Veröffentlicht'
    }
  },
  'project.translations': {
    category: 'admin',
    description: 'Translations section',
    translations: {
      nl: 'Vertalingen',
      fr: 'Traductions',
      en: 'Translations',
      de: 'Übersetzungen'
    }
  },
  'project.title': {
    category: 'admin',
    description: 'Project title label',
    translations: {
      nl: 'Titel',
      fr: 'Titre',
      en: 'Title',
      de: 'Titel'
    }
  },
  'project.titlePlaceholder': {
    category: 'admin',
    description: 'Project title placeholder',
    translations: {
      nl: 'Projecttitel',
      fr: 'Titre du projet',
      en: 'Project title',
      de: 'Projektitel'
    }
  },
  'project.description': {
    category: 'admin',
    description: 'Project description label',
    translations: {
      nl: 'Beschrijving',
      fr: 'Description',
      en: 'Description',
      de: 'Beschreibung'
    }
  },
  'project.descriptionPlaceholder': {
    category: 'admin',
    description: 'Project description placeholder',
    translations: {
      nl: 'Projectbeschrijving',
      fr: 'Description du projet',
      en: 'Project description',
      de: 'Projektbeschreibung'
    }
  },
  'project.materials': {
    category: 'admin',
    description: 'Materials label',
    translations: {
      nl: 'Materialen (gescheiden door komma\'s)',
      fr: 'Matériaux (séparés par des virgules)',
      en: 'Materials (comma-separated)',
      de: 'Materialien (durch Kommas getrennt)'
    }
  },
  'project.materialsPlaceholder': {
    category: 'admin',
    description: 'Materials placeholder',
    translations: {
      nl: 'Hout, Metaal, Glas',
      fr: 'Bois, Métal, Verre',
      en: 'Wood, Metal, Glass',
      de: 'Holz, Metall, Glas'
    }
  },
  'project.images': {
    category: 'admin',
    description: 'Images section',
    translations: {
      nl: 'Afbeeldingen',
      fr: 'Images',
      en: 'Images',
      de: 'Bilder'
    }
  },
  'project.update': {
    category: 'admin',
    description: 'Update project button',
    translations: {
      nl: 'Project bijwerken',
      fr: 'Mettre à jour le projet',
      en: 'Update Project',
      de: 'Projekt aktualisieren'
    }
  },
  'project.saving': {
    category: 'admin',
    description: 'Saving project button',
    translations: {
      nl: 'Opslaan...',
      fr: 'Enregistrement...',
      en: 'Saving...',
      de: 'Speichern...'
    }
  },
  'project.unknownLanguage': {
    category: 'admin',
    description: 'Unknown language fallback',
    translations: {
      nl: 'Onbekende taal',
      fr: 'Langue inconnue',
      en: 'Unknown Language',
      de: 'Unbekannte Sprache'
    }
  },
  'nav.theme': {
    category: 'content',
    description: 'Theme label',
    translations: {
      nl: 'Thema',
      fr: 'Thème',
      en: 'Theme',
      de: 'Design'
    }
  },
  'nav.language': {
    category: 'content',
    description: 'Language label',
    translations: {
      nl: 'Taal',
      fr: 'Langue',
      en: 'Language',
      de: 'Sprache'
    }
  },
  'footer.brand': {
    category: 'content',
    description: 'Footer brand name',
    translations: {
      nl: 'Rein Art Design',
      fr: 'Rein Art Design',
      en: 'Rein Art Design',
      de: 'Rein Art Design'
    }
  },
  'footer.tagline': {
    category: 'content',
    description: 'Footer tagline',
    translations: {
      nl: 'Elegante en functionele meubels handgemaakt in onze werkplaats',
      fr: 'Meubles élégants et fonctionnels fabriqués à la main dans notre atelier',
      en: 'Elegant and functional furniture handmade in our workshop',
      de: 'Elegante und funktionale Möbel handgefertigt in unserer Werkstatt'
    }
  },
  'footer.navigation': {
    category: 'content',
    description: 'Footer navigation section title',
    translations: {
      nl: 'Navigatie',
      fr: 'Navigation',
      en: 'Navigation',
      de: 'Navigation'
    }
  },
  'footer.legal': {
    category: 'content',
    description: 'Footer legal section title',
    translations: {
      nl: 'Juridisch',
      fr: 'Légal',
      en: 'Legal',
      de: 'Rechtliches'
    }
  },
  'footer.privacyPolicy': {
    category: 'content',
    description: 'Privacy policy link',
    translations: {
      nl: 'Privacybeleid',
      fr: 'Politique de confidentialité',
      en: 'Privacy Policy',
      de: 'Datenschutzerklärung'
    }
  },
  'footer.termsOfService': {
    category: 'content',
    description: 'Terms of service link',
    translations: {
      nl: 'Servicevoorwaarden',
      fr: 'Conditions d\'utilisation',
      en: 'Terms of Service',
      de: 'Nutzungsbedingungen'
    }
  },
  'footer.cookiePreferences': {
    category: 'content',
    description: 'Cookie preferences link',
    translations: {
      nl: 'Cookievoorkeuren',
      fr: 'Préférences de cookies',
      en: 'Cookie Preferences',
      de: 'Cookie-Einstellungen'
    }
  },
  'footer.allRightsReserved': {
    category: 'content',
    description: 'All rights reserved text',
    translations: {
      nl: 'Alle rechten voorbehouden.',
      fr: 'Tous droits réservés.',
      en: 'All rights reserved.',
      de: 'Alle Rechte vorbehalten.'
    }
  },
  'contact.title': {
    category: 'content',
    description: 'Contact page title',
    translations: {
      nl: 'Neem contact op',
      fr: 'Contactez-nous',
      en: 'Contact Us',
      de: 'Kontaktieren Sie uns'
    }
  },
  'contact.subtitle': {
    category: 'content',
    description: 'Contact page subtitle',
    translations: {
      nl: 'Neem contact met ons op voor vragen over onze meubels of voor een op maat gemaakte opdracht. We staan klaar om samen met u uw droommeubel te ontwerpen en te realiseren.',
      fr: 'Contactez-nous pour des questions sur nos meubles ou pour une commande sur mesure. Nous sommes prêts à concevoir et réaliser votre meuble de rêve avec vous.',
      en: 'Contact us for questions about our furniture or for a custom-made order. We are ready to design and realize your dream furniture together with you.',
      de: 'Kontaktieren Sie uns für Fragen zu unseren Möbeln oder für eine maßgeschneiderte Bestellung. Wir sind bereit, gemeinsam mit Ihnen Ihr Traummöbel zu entwerfen und zu realisieren.'
    }
  },
  'contact.sendMessage': {
    category: 'content',
    description: 'Send us a message heading',
    translations: {
      nl: 'Stuur ons een bericht',
      fr: 'Envoyez-nous un message',
      en: 'Send us a message',
      de: 'Senden Sie uns eine Nachricht'
    }
  },
  'contact.contactInformation': {
    category: 'content',
    description: 'Contact information heading',
    translations: {
      nl: 'Contactgegevens',
      fr: 'Informations de contact',
      en: 'Contact Information',
      de: 'Kontaktinformationen'
    }
  },
  'contact.email': {
    category: 'content',
    description: 'Email label',
    translations: {
      nl: 'E-mail',
      fr: 'E-mail',
      en: 'Email',
      de: 'E-Mail'
    }
  },
  'contact.phone': {
    category: 'content',
    description: 'Phone label',
    translations: {
      nl: 'Telefoon',
      fr: 'Téléphone',
      en: 'Phone',
      de: 'Telefon'
    }
  },
  'contact.location': {
    category: 'content',
    description: 'Location label',
    translations: {
      nl: 'Locatie',
      fr: 'Localisation',
      en: 'Location',
      de: 'Standort'
    }
  },
  'contact.businessHours': {
    category: 'content',
    description: 'Business hours heading',
    translations: {
      nl: 'Openingstijden',
      fr: 'Heures d\'ouverture',
      en: 'Business Hours',
      de: 'Öffnungszeiten'
    }
  },
  'contact.mondayFriday': {
    category: 'content',
    description: 'Monday-Friday label',
    translations: {
      nl: 'Maandag - Vrijdag',
      fr: 'Lundi - Vendredi',
      en: 'Monday - Friday',
      de: 'Montag - Freitag'
    }
  },
  'contact.saturday': {
    category: 'content',
    description: 'Saturday label',
    translations: {
      nl: 'Zaterdag',
      fr: 'Samedi',
      en: 'Saturday',
      de: 'Samstag'
    }
  },
  'contact.sunday': {
    category: 'content',
    description: 'Sunday label',
    translations: {
      nl: 'Zondag',
      fr: 'Dimanche',
      en: 'Sunday',
      de: 'Sonntag'
    }
  },
  'contact.closed': {
    category: 'content',
    description: 'Closed label',
    translations: {
      nl: 'Gesloten',
      fr: 'Fermé',
      en: 'Closed',
      de: 'Geschlossen'
    }
  },
  'contact.quickResponse': {
    category: 'content',
    description: 'Quick response heading',
    translations: {
      nl: 'Snelle reactie',
      fr: 'Réponse rapide',
      en: 'Quick Response',
      de: 'Schnelle Antwort'
    }
  },
  'contact.quickResponseText': {
    category: 'content',
    description: 'Quick response text',
    translations: {
      nl: 'We reageren meestal op alle vragen binnen 24 uur tijdens werkdagen.',
      fr: 'Nous répondons généralement à toutes les demandes dans les 24 heures pendant les jours ouvrables.',
      en: 'We typically respond to all inquiries within 24 hours during business days.',
      de: 'Wir antworten normalerweise auf alle Anfragen innerhalb von 24 Stunden an Werktagen.'
    }
  },
  'contact.backToHome': {
    category: 'content',
    description: 'Back to home link',
    translations: {
      nl: '← Terug naar Home',
      fr: '← Retour à l\'accueil',
      en: '← Back to Home',
      de: '← Zurück zur Startseite'
    }
  },
  'content.pageSettings': {
    category: 'admin',
    description: 'Page settings section',
    translations: {
      nl: 'Paginainstellingen',
      fr: 'Paramètres de page',
      en: 'Page Settings',
      de: 'Seiteneinstellungen'
    }
  },
  'content.slug': {
    category: 'admin',
    description: 'Slug label',
    translations: {
      nl: 'Slug',
      fr: 'Slug',
      en: 'Slug',
      de: 'Slug'
    }
  },
  'content.generateFromTitle': {
    category: 'admin',
    description: 'Generate slug from title button',
    translations: {
      nl: 'Genereer van titel',
      fr: 'Générer à partir du titre',
      en: 'Generate from Title',
      de: 'Aus Titel generieren'
    }
  },
  'content.published': {
    category: 'admin',
    description: 'Published checkbox',
    translations: {
      nl: 'Gepubliceerd',
      fr: 'Publié',
      en: 'Published',
      de: 'Veröffentlicht'
    }
  },
  'content.title': {
    category: 'admin',
    description: 'Title label',
    translations: {
      nl: 'Titel',
      fr: 'Titre',
      en: 'Title',
      de: 'Titel'
    }
  },
  'content.titlePlaceholder': {
    category: 'admin',
    description: 'Title placeholder',
    translations: {
      nl: 'Voer paginatitel in...',
      fr: 'Entrez le titre de la page...',
      en: 'Enter page title...',
      de: 'Seitentitel eingeben...'
    }
  },
  'content.content': {
    category: 'admin',
    description: 'Content label',
    translations: {
      nl: 'Inhoud',
      fr: 'Contenu',
      en: 'Content',
      de: 'Inhalt'
    }
  },
  'content.contentPlaceholder': {
    category: 'admin',
    description: 'Content placeholder',
    translations: {
      nl: 'Schrijf inhoud in {language}...',
      fr: 'Écrivez le contenu en {language}...',
      en: 'Write content in {language}...',
      de: 'Inhalt auf {language} schreiben...'
    }
  },
  'content.default': {
    category: 'admin',
    description: 'Default language badge',
    translations: {
      nl: 'Standaard',
      fr: 'Par défaut',
      en: 'Default',
      de: 'Standard'
    }
  },
  'content.preview': {
    category: 'admin',
    description: 'Preview button',
    translations: {
      nl: 'Voorbeeld',
      fr: 'Aperçu',
      en: 'Preview',
      de: 'Vorschau'
    }
  },
  'content.createPage': {
    category: 'admin',
    description: 'Create page button',
    translations: {
      nl: 'Pagina aanmaken',
      fr: 'Créer la page',
      en: 'Create Page',
      de: 'Seite erstellen'
    }
  },
  'content.saveChanges': {
    category: 'admin',
    description: 'Save changes button',
    translations: {
      nl: 'Wijzigingen opslaan',
      fr: 'Enregistrer les modifications',
      en: 'Save Changes',
      de: 'Änderungen speichern'
    }
  },
  'content.editLanguage': {
    category: 'admin',
    description: 'Edit language indicator',
    translations: {
      nl: 'Bewerk in {language}',
      fr: 'Modifier en {language}',
      en: 'Editing in {language}',
      de: 'Bearbeiten auf {language}'
    }
  },
  'content.translateToAll': {
    category: 'admin',
    description: 'Translate to all languages button',
    translations: {
      nl: 'Vertaal naar alle talen',
      fr: 'Traduire vers toutes les langues',
      en: 'Translate to all languages',
      de: 'In alle Sprachen übersetzen'
    }
  },
  'admin.contentPages': {
    category: 'admin',
    description: 'Content pages heading',
    translations: {
      nl: 'Inhoudspagina\'s',
      fr: 'Pages de contenu',
      en: 'Content Pages',
      de: 'Inhaltsseiten'
    }
  },
  'admin.manageContentPages': {
    category: 'admin',
    description: 'Manage content pages description',
    translations: {
      nl: 'Beheer uw website inhoudspagina\'s',
      fr: 'Gérez les pages de contenu de votre site web',
      en: 'Manage your website content pages',
      de: 'Verwalten Sie Ihre Website-Inhaltsseiten'
    }
  },
  'admin.newPage': {
    category: 'admin',
    description: 'New page button',
    translations: {
      nl: 'Nieuwe pagina',
      fr: 'Nouvelle page',
      en: 'New Page',
      de: 'Neue Seite'
    }
  },
  'admin.searchPages': {
    category: 'admin',
    description: 'Search pages placeholder',
    translations: {
      nl: 'Zoek pagina\'s...',
      fr: 'Rechercher des pages...',
      en: 'Search pages...',
      de: 'Seiten suchen...'
    }
  },
  'admin.allLanguages': {
    category: 'admin',
    description: 'All languages filter',
    translations: {
      nl: 'Alle talen',
      fr: 'Toutes les langues',
      en: 'All Languages',
      de: 'Alle Sprachen'
    }
  },
  'admin.allStatus': {
    category: 'admin',
    description: 'All status filter',
    translations: {
      nl: 'Alle statussen',
      fr: 'Tous les statuts',
      en: 'All Status',
      de: 'Alle Status'
    }
  },
  'admin.published': {
    category: 'admin',
    description: 'Published status',
    translations: {
      nl: 'Gepubliceerd',
      fr: 'Publié',
      en: 'Published',
      de: 'Veröffentlicht'
    }
  },
  'admin.unpublished': {
    category: 'admin',
    description: 'Unpublished status',
    translations: {
      nl: 'Niet gepubliceerd',
      fr: 'Non publié',
      en: 'Unpublished',
      de: 'Nicht veröffentlicht'
    }
  },
  'admin.createProject': {
    category: 'admin',
    description: 'Create project button',
    translations: {
      nl: 'Project aanmaken',
      fr: 'Créer un projet',
      en: 'Create Project',
      de: 'Projekt erstellen'
    }
  },
  'admin.searchProjects': {
    category: 'admin',
    description: 'Search projects placeholder',
    translations: {
      nl: 'Zoek projecten...',
      fr: 'Rechercher des projets...',
      en: 'Search projects...',
      de: 'Projekte suchen...'
    }
  },
  'admin.allProjects': {
    category: 'admin',
    description: 'All projects filter',
    translations: {
      nl: 'Alle projecten',
      fr: 'Tous les projets',
      en: 'All Projects',
      de: 'Alle Projekte'
    }
  },
  'admin.featured': {
    category: 'admin',
    description: 'Featured status',
    translations: {
      nl: 'Uitgelicht',
      fr: 'En vedette',
      en: 'Featured',
      de: 'Hervorgehoben'
    }
  },
  'admin.notFeatured': {
    category: 'admin',
    description: 'Not featured status',
    translations: {
      nl: 'Niet uitgelicht',
      fr: 'Non en vedette',
      en: 'Not Featured',
      de: 'Nicht hervorgehoben'
    }
  },
  'admin.draft': {
    category: 'admin',
    description: 'Draft status',
    translations: {
      nl: 'Concept',
      fr: 'Brouillon',
      en: 'Draft',
      de: 'Entwurf'
    }
  },
  'admin.project': {
    category: 'admin',
    description: 'Project label',
    translations: {
      nl: 'Project',
      fr: 'Projet',
      en: 'Project',
      de: 'Projekt'
    }
  },
  'admin.status': {
    category: 'admin',
    description: 'Status label',
    translations: {
      nl: 'Status',
      fr: 'Statut',
      en: 'Status',
      de: 'Status'
    }
  },
  'admin.images': {
    category: 'admin',
    description: 'Images label',
    translations: {
      nl: 'Afbeeldingen',
      fr: 'Images',
      en: 'Images',
      de: 'Bilder'
    }
  },
  'admin.created': {
    category: 'admin',
    description: 'Created label',
    translations: {
      nl: 'Aangemaakt',
      fr: 'Créé',
      en: 'Created',
      de: 'Erstellt'
    }
  },
  'admin.actions': {
    category: 'admin',
    description: 'Actions label',
    translations: {
      nl: 'Acties',
      fr: 'Actions',
      en: 'Actions',
      de: 'Aktionen'
    }
  },
  'admin.noProjectsFound': {
    category: 'admin',
    description: 'No projects found message',
    translations: {
      nl: 'Geen projecten gevonden. Maak uw eerste project aan om te beginnen.',
      fr: 'Aucun projet trouvé. Créez votre premier projet pour commencer.',
      en: 'No projects found. Create your first project to get started.',
      de: 'Keine Projekte gefunden. Erstellen Sie Ihr erstes Projekt, um zu beginnen.'
    }
  },
  'admin.translationsCount': {
    category: 'admin',
    description: 'Translations count',
    translations: {
      nl: 'vertaling(en)',
      fr: 'traduction(s)',
      en: 'translation(s)',
      de: 'Übersetzung(en)'
    }
  },
  'admin.loading': {
    category: 'admin',
    description: 'Loading text',
    translations: {
      nl: 'Laden...',
      fr: 'Chargement...',
      en: 'Loading...',
      de: 'Laden...'
    }
  },
  'admin.loadingProjects': {
    category: 'admin',
    description: 'Loading projects text',
    translations: {
      nl: 'Projecten laden...',
      fr: 'Chargement des projets...',
      en: 'Loading projects...',
      de: 'Projekte laden...'
    }
  },
  'admin.error': {
    category: 'admin',
    description: 'Error label',
    translations: {
      nl: 'Fout',
      fr: 'Erreur',
      en: 'Error',
      de: 'Fehler'
    }
  },
  'admin.retry': {
    category: 'admin',
    description: 'Retry button',
    translations: {
      nl: 'Opnieuw proberen',
      fr: 'Réessayer',
      en: 'Retry',
      de: 'Erneut versuchen'
    }
  },
  'projects.title': {
    category: 'content',
    description: 'Projects page title',
    translations: {
      nl: 'Onze Projecten',
      fr: 'Nos Projets',
      en: 'Our Projects',
      de: 'Unsere Projekte'
    }
  },
  'projects.subtitle': {
    category: 'content',
    description: 'Projects page subtitle',
    translations: {
      nl: 'Ontdek onze collectie van op maat gemaakte meubels. Elk stuk wordt in huis ontworpen en handgemaakt in onze werkplaats met aandacht voor detail en duurzaamheid.',
      fr: 'Explorez notre collection de meubles sur mesure. Chaque pièce est conçue en interne et fabriquée à la main dans notre atelier avec attention aux détails et durabilité.',
      en: 'Explore our collection of custom-made furniture. Each piece is designed in-house and handmade in our workshop with attention to detail and durability.',
      de: 'Entdecken Sie unsere Sammlung von maßgeschneiderten Möbeln. Jedes Stück wird intern entworfen und in unserer Werkstatt handgefertigt mit Liebe zum Detail und Langlebigkeit.'
    }
  },
  'projects.backToProjects': {
    category: 'content',
    description: 'Back to projects button',
    translations: {
      nl: '← Terug naar Projecten',
      fr: '← Retour aux projets',
      en: '← Back to Projects',
      de: '← Zurück zu Projekten'
    }
  }
}

async function seedTranslationKeys() {
  try {
    console.log('🌱 Seeding translation keys...')

    // Get all active languages
    const languages = await prisma.language.findMany({
      where: { isActive: true }
    })

    if (languages.length === 0) {
      console.log('⚠️  No active languages found. Please add languages first.')
      return
    }

    console.log(`Found ${languages.length} active languages:`, languages.map((l: { code: string }) => l.code).join(', '))

    let created = 0
    let updated = 0

    for (const [key, data] of Object.entries(commonTranslations)) {
      try {
        // Check if key exists using TranslationService
        const existingKey = await TranslationService.getTranslationKey(key)

        if (existingKey) {
          // Update existing key
          // TranslationKeyWithTranslations extends TranslationKey, so it has an id property
          // Using type assertion since TypeScript doesn't always infer extended types correctly
          const keyId = (existingKey as unknown as { id: string }).id
          await TranslationService.updateTranslationKey(keyId, {
            category: data.category,
            description: data.description
          })

          // Add/update translations
          for (const [langCode, value] of Object.entries(data.translations)) {
            const language = languages.find((l: { code: string }) => l.code === langCode)
            if (language) {
              await TranslationService.upsertTranslation({
                keyId: keyId,
                languageId: language.id,
                value
              })
            }
          }

          updated++
          console.log(`  ✓ Updated: ${key}`)
        } else {
          // Create new key with translations
          const translations = Object.entries(data.translations)
            .map(([langCode, value]) => {
              const language = languages.find((l: { code: string }) => l.code === langCode)
              return language ? { languageId: language.id, value } : null
            })
            .filter(Boolean) as Array<{ languageId: string; value: string }>

          await TranslationService.createTranslationKey({
            key,
            category: data.category,
            description: data.description,
            translations
          })

          created++
          console.log(`  ✓ Created: ${key}`)
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  Skipped (duplicate): ${key}`)
        } else {
          console.error(`  ✗ Error with ${key}:`, error.message)
        }
      }
    }

    console.log(`\n✅ Complete! Created: ${created}, Updated: ${updated}`)
  } catch (error) {
    console.error('❌ Error seeding translation keys:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedTranslationKeys()

