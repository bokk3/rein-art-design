# Rein Art Design CMS
[![Build and Push Docker Image](https://github.com/bokk3/rein-art-design/actions/workflows/docker-build.yml/badge.svg?branch=production)](https://github.com/bokk3/rein-art-design/actions/workflows/docker-build.yml)

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

## 🧑‍💻 Development Guide

### 1. Requirements

- **Node.js 18+** (>= v20 recommended). Use [`nvm`](https://github.com/nvm-sh/nvm) to match the project version quickly.
- **npm 9+** (bundled with recent Node releases).
- **PostgreSQL 15+**. You can run it locally or via Docker (see below).
- **Docker & Docker Compose plugin** (optional but recommended for local database and service parity).

### 2. Clone & Install

```bash
git clone git@github.com:bokk3/rein-art-design.git
cd rein-art-design
npm install
```

> ℹ️  If you work on multiple Node projects, run `nvm use` or `nvm install` inside the repo to align with the required Node version before installing dependencies.

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Update `.env.local` with at least:

- `DATABASE_URL` – points to your dev database.
- `BETTER_AUTH_SECRET` – generate with `openssl rand -base64 32`.
- SMTP credentials if you want to test outbound e‑mail.

All CLI scripts (Prisma, seeders, scraping utilities) also read `.env.local`, so make sure it stays in sync with your local database.

### 4. Start the Database

**Option A – Docker (recommended)**

```bash
# Start Postgres on port 5433
docker compose up -d postgres
```

`docker-compose.yml` exposes Postgres on `localhost:5433` with default credentials. Use the matching `DATABASE_URL`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/rein"
```

**Option B – Local Postgres instance**

Create a database manually and update `DATABASE_URL` accordingly.

> After schema changes run `npx prisma generate` to refresh the Prisma client.

### 5. Bootstrap the Database

```bash
npx prisma db push          # sync Prisma schema
npm run clear-and-seed      # load baseline content and admin user
```

Useful follow-up scripts:

- `npm run create-admin` – create an additional admin account.
- `npm run seed-translations` – repopulate translation keys.
- `npm run create-modern-homepage` – rebuild the default homepage layout.

### 6. Run the App

```bash
npm run dev
```

This starts Next.js on http://localhost:3020 with hot-reload enabled.

- Homepage: http://localhost:3020
- Admin panel: http://localhost:3020/admin (use credentials from the seed script)

If you prefer a full Docker dev environment, start both services:

```bash
docker compose up
```

The application will be available at http://localhost:3020 and the source tree is live-mounted for instant reloads.

### 7. Working with Media & Content

- `npm run scrape-images` – download remote site images into `scraped-images/`.
- `npm run migrate-images` – process scraped images and update database records to local `public/uploads/` paths.
- `npm run scrape-projects` / `npm run instagram-sync` – additional ingestion pipelines.
- All processed assets live in `public/uploads/` and should be committed so deployments stay deterministic.

### 8. Quality Checks

```bash
npm run lint          # ESLint (Next.js config)
npm run test          # Vitest in CI mode
npm run test:watch    # Continuous testing while developing
```

### 9. Database Maintenance (Local)

- **Reset**: `npm run clear-and-seed`
- **Migrations**: `npx prisma migrate dev --name <description>`
- **Inspect**: `npx prisma studio` launches the Prisma data browser.
- **Manual backup**: `docker compose exec postgres pg_dump -U postgres -d rein > backups/dev_backup.sql`

### 10. Troubleshooting Tips

- If Node modules go out of sync after switching branches, run `rm -rf node_modules .next` and `npm install`.
- When Prisma throws `P3014`/migration errors, ensure the database is on the expected version and re-run `npx prisma db push`.
- For Docker-based development, use `docker compose down -v` to wipe persisted volumes (database + uploads) when you need a clean slate.

## 🚢 Deployment Guide (Multi-Arch)

The CI pipeline publishes a multi-architecture Docker image at `3bok/rein-art-design:latest` covering both `linux/amd64` and `linux/arm64` (Raspberry Pi). Docker will automatically select the right variant on pull.

### Quick Deploy Steps

1. **Prepare host**
   - Install Docker Engine + Compose plugin (v20.10+).
   - Ensure ports 80/443 are available if you front the app with Nginx.
2. **Fetch code & config**
   ```bash
   git clone git@github.com:bokk3/rein-art-design.git
   cd rein-art-design
   cp .env.staging.example .env.staging   # adjust credentials & URLs
   ```
3. **Pull the image**
   ```bash
   docker pull 3bok/rein-art-design:latest
   # Optional – force a specific architecture:
   docker pull --platform=linux/arm64 3bok/rein-art-design:latest
   docker pull --platform=linux/amd64 3bok/rein-art-design:latest
   ```
4. **Compose snippet (app + Postgres)**
   ```yaml
   services:
     postgres:
       image: postgres:15-alpine
       environment:
         POSTGRES_DB: rein_staging
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data

     app:
       image: 3bok/rein-art-design:latest
       # platform: linux/amd64   # uncomment only to pin architecture manually
       depends_on:
         - postgres
       environment:
         NODE_ENV: production
         DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD}@postgres:5432/rein_staging
         NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
         NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
         BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
       ports:
         - "3000:3000"
       volumes:
         - ./backup_db.bak:/backup/backup_db.bak:ro   # optional helper mount
   volumes:
     postgres_data:
   ```
5. **Apply database migrations or restore backup**
   ```bash
   # Using the runtime image to apply migrations:
   docker run --rm \
     --env-file .env.staging \
     --network $(docker compose ls --format '{{.Name}}' | head -n1)_default \
     3bok/rein-art-design:latest \
     npx prisma migrate deploy

   # Or restore a plain SQL backup:
   docker compose exec postgres \
     psql -U ${POSTGRES_USER:-postgres} -d rein_staging < backup_db.bak
   ```
6. **Start the stack**
   ```bash
   docker compose up -d
   docker compose ps
   ```
7. **Verify & monitor**
   - `docker compose logs -f app`
   - `curl -I https://your-domain`

For ARM boards that struggle with native builds, this workflow avoids cross-compilation entirely—the manifest list returned by `3bok/rein-art-design:latest` picks the correct binary layers automatically.

Need more detail (SSL, cron jobs, full Pi setup)? See `STAGING-DEPLOYMENT.md` for an extended, Pi-focused walkthrough.

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
- [Development Guide](#-development-guide) - Local workflow, scripts & tips
- [Deployment Guide](#-deployment-guide-multi-arch) - Multi-architecture containers
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
