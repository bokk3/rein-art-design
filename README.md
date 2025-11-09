# Rein Art Design CMS

Website voor Rein Art Design - Elegante en functionele meubels handgemaakt in onze werkplaats.

## Over

Rein Art Design maakt op maat gemaakte meubels die afgestemd zijn op mensen die ze dagdagelijks gebruiken. Alle meubels worden in huis ontworpen en handgemaakt in onze werkplaats in Wilsele.

## ✨ Features

### Core Features
- **Projecten Portfolio** - Toon uw handgemaakte meubels met foto's en beschrijvingen
- **Meertalig** - Volledige ondersteuning voor Nederlands, Frans, Engels en Duits
- **Contactformulier** - Laat bezoekers contact opnemen voor op maat gemaakte opdrachten
- **Admin Dashboard** - Beheer projecten, content en berichten eenvoudig
- **Responsive Design** - Werkt perfect op alle apparaten
- **Dark Mode** - Volledige ondersteuning voor licht/donker thema

### Admin Features

#### Content Management
- **Page Builder** - Visuele drag-and-drop pagina builder voor homepage en content pagina's
  - Hero secties met flexibele tekst, logo's en buttons
  - Text, Image, Gallery, CTA, Features, Testimonials componenten
  - Realtime preview en live editing
  - Multilingual content support

- **Project Management** - Volledige CRUD voor projecten
  - Meerdere afbeeldingen per project
  - Multilingual beschrijvingen
  - Materialen en metadata
  - Project analytics (views, unique visitors)

- **Content Pages** - Beheer statische pagina's (About, Services, etc.)
  - Rich text editor met TipTap
  - Multilingual content
  - SEO-friendly URLs

- **Media Library** - Centrale media bibliotheek
  - Drag & drop upload
  - Bulk upload functionaliteit
  - Automatische thumbnail generatie
  - Image optimization (JPEG, PNG, WebP)
  - Metadata management

#### Analytics & Tracking
- **Privacy-Focused Analytics** - GDPR-compliant analytics systeem
  - Page views tracking
  - Unique visitors
  - Custom events (project views, etc.)
  - Per-project analytics
  - Dashboard met grafieken en statistieken

#### Settings & Configuration
- **Languages & Localization** - Beheer talen en vertalingen
  - Activeren/deactiveren talen
  - Default taal instellen
  - Translation coverage tracking
  - System translations management

- **Appearance & Theme** - Theme configuratie
  - Light/Dark/System mode
  - User theme toggle opties
  - Grayscale image filter
  - Custom color schemes

- **Email Configuration** - SMTP instellingen
  - Email service configuratie
  - Test email functionaliteit
  - Contact form notifications

- **SEO & Meta Settings** - Search Engine Optimization
  - Meta tags (title, description, keywords)
  - Open Graph settings (Facebook, LinkedIn)
  - Twitter Cards configuratie
  - Canonical URLs
  - Robots.txt settings
  - Sitemap generation
  - Structured data (Schema.org)

- **Social Media** - Social media integratie
  - Social links (Facebook, Instagram, LinkedIn, Twitter, YouTube, Pinterest, TikTok)
  - Social sharing buttons
  - Instagram feed integratie

- **Business Information** - Bedrijfsgegevens beheer
  - Company details (naam, eigenaar, legal name)
  - Adres informatie
  - Contact gegevens (email, telefoon, WhatsApp)
  - Legal & Financial (VAT nummer, IBAN, registratie)
  - Business hours per dag

#### Communication
- **Contact Messages** - Beheer contact formulier submissions
  - GDPR-compliant consent tracking
  - Email notifications
  - Message details en antwoorden

- **Cookie Consent** - GDPR cookie management
  - Granular consent (Essential, Analytics, Marketing)
  - Customizable banner
  - Consent storage

### Technical Features
- **Image Processing** - Automatische image optimization
  - Format conversion (JPEG, PNG, WebP)
  - Thumbnail generatie
  - Metadata extraction
  - Dark mode PNG inversion

- **Authentication** - Secure admin access
  - Role-based access control
  - Session management
  - Protected routes

- **Database** - PostgreSQL met Prisma ORM
  - Multilingual content model
  - Flexible JSON storage voor settings
  - Analytics event tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Docker (optional, voor database)

### Installation

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd rein-art-design
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and configure:
   # - DATABASE_URL
   # - BETTER_AUTH_SECRET
   # - SMTP settings (optional)
   ```

4. **Setup database:**
   ```bash
   # Using Docker
   docker compose up -d postgres
   
   # Or use existing PostgreSQL instance
   # Update DATABASE_URL in .env.local
   ```

5. **Run migrations:**
   ```bash
   npx prisma db push
   ```

6. **Seed database:**
   ```bash
   npm run clear-and-seed
   ```

7. **Start development server:**
   ```bash
   npm run dev
   ```

8. **Access the application:**
   - Homepage: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Login: Check seed script for default credentials

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth v1.3
- **Image Processing**: Sharp
- **Rich Text**: TipTap editor
- **Analytics**: Custom privacy-focused system

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel routes
│   │   ├── settings/       # Settings pages
│   │   ├── projects/       # Project management
│   │   ├── gallery/        # Media library
│   │   ├── page-builder/   # Visual page builder
│   │   └── analytics/      # Analytics dashboard
│   ├── api/                # API routes
│   └── [public routes]     # Public pages
├── components/             # React components
│   ├── admin/              # Admin components
│   ├── page-builder/       # Page builder components
│   └── ui/                 # UI components
├── lib/                    # Utilities and services
├── contexts/               # React contexts
└── types/                  # TypeScript types
```

## 📚 Documentation

- [Setup Guide](docs/setup-guide.md) - Detailed setup instructions
- [Design Document](docs/design.md) - System architecture and design
- [Requirements](docs/requirements.md) - Feature requirements
- [Page Builder](docs/page-builder-draft.md) - Page builder documentation
- [Translation Guide](docs/translation-migration-guide.md) - Translation system guide
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run clear-and-seed` - Clear database and seed with default data
- `npm run create-admin` - Create admin user
- `npm run create-default-homepage` - Create default homepage

## 📝 Settings Overview

### SEO Settings
Configure meta tags, Open Graph, Twitter Cards, and advanced SEO options for better search engine visibility.

### Social Media Settings
Manage social media profile links and enable/disable social sharing buttons throughout the site.

### Business Information Settings
Store and manage company details, address, contact information, business hours, VAT number, and banking details.

### Language Settings
Activate/deactivate languages, set default language, and manage translation coverage.

### Theme Settings
Configure theme mode (light/dark/system), user controls, and image display preferences.

### Email Settings
Configure SMTP settings for contact form notifications and email functionality.

## 🔐 Security

- Role-based access control
- Protected admin routes
- GDPR-compliant data handling
- Secure session management
- Input validation and sanitization

## 🌍 Multilingual Support

The system supports multiple languages with:
- Dynamic language activation
- Translation key management
- Fallback to default language
- Per-language content editing
- URL-based language switching

## 📊 Analytics

Privacy-focused analytics system that tracks:
- Page views
- Unique visitors
- Custom events
- Per-project statistics
- Referrer information

All analytics are GDPR-compliant and respect user consent preferences.

## 📧 Contact

**Rein Art Design BVBA**  
Bornestraat 285  
3012 Wilsele  
België

📧 contact@reinartdesign.be  
📞 + 32 (0) 487 837 041  
🌐 [www.reinartdesign.be](https://www.reinartdesign.be)

## 📄 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.
