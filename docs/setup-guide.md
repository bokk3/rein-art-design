# Setup Guide - Rein Art Design CMS

Technische setup instructies voor ontwikkelaars.

## Vereisten

- Node.js 18+ 
- PostgreSQL database
- npm of yarn

## Installatie

1. **Installeer dependencies:**
   ```bash
   npm install
   ```

2. **Configureer omgevingsvariabelen:**
   Maak een `.env.local` bestand met:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/rein_art_design"
   ADMIN_EMAIL="your-admin@email.com"
   ADMIN_PASSWORD="your-secure-password"
   ADMIN_NAME="Admin User"
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

3. **Database setup:**
   ```bash
   # Genereer Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

4. **Seed de database:**
   ```bash
   # Seed basis data (languages, content types, settings)
   npm run db:seed
   
   # Seed translation keys
   npm run seed-translations
   
   # Maak admin gebruiker aan
   npm run create-admin
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Database Scripts

- `npm run db:seed` - Seed basis data
- `npm run seed-translations` - Seed UI vertalingen
- `npm run create-admin` - Maak admin gebruiker
- `npm run reset-admin` - Reset admin gebruiker
- `npm run clear-and-seed` - Wis auth data en maak nieuwe admin
- `npm run scrape-projects` - Scrape projecten van oude website

## Project Structuur

```
src/
├── app/              # Next.js app router pages
│   ├── admin/        # Admin dashboard pages
│   ├── api/          # API routes
│   └── [pages]/      # Public pages
├── components/       # React components
│   ├── admin/        # Admin components
│   └── ui/           # UI components
├── lib/              # Utility functions
│   ├── auth.ts       # Authentication
│   ├── db.ts         # Database client
│   └── ...
└── types/            # TypeScript types

prisma/
├── schema.prisma     # Database schema
└── seed.ts          # Database seed script
```

## Database Schema

Het project gebruikt Prisma met PostgreSQL. Belangrijkste modellen:

- **User** - Gebruikers en authenticatie
- **UserRole** - Rollen en permissies
- **Project** - Meubel projecten
- **ProjectTranslation** - Meertalige project content
- **ContentPage** - Statische pagina's
- **ContactMessage** - Contact formulier berichten
- **Language** - Ondersteunde talen
- **SiteSettings** - Site configuratie
- **TranslationKey** - UI vertalingen

## Authenticatie

Het project gebruikt Better Auth voor authenticatie. Admin gebruikers hebben een `UserRole` record met `role: 'admin'`.

## Meertaligheid

Het systeem ondersteunt:
- Nederlands (default)
- Frans
- Engels (inactief)
- Duits (inactief)

Vertalingen worden opgeslagen in:
- `TranslationKey` / `Translation` - UI strings
- `ProjectTranslation` - Project content
- `ContentPageTranslation` - Page content

## Development

### Prisma Commands

```bash
# Genereer Prisma client na schema wijzigingen
npx prisma generate

# Maak nieuwe migration
npx prisma migrate dev --name migration_name

# Reset database (LET OP: wist alle data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Environment Variables

Vereiste variabelen in `.env.local`:

- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_EMAIL` - Admin email adres
- `ADMIN_PASSWORD` - Admin wachtwoord
- `ADMIN_NAME` - Admin naam
- `BETTER_AUTH_SECRET` - Secret voor Better Auth (genereer met `openssl rand -base64 32`)
- `BETTER_AUTH_URL` - Base URL (http://localhost:3000 voor dev)

## Troubleshooting

### "Admin access required" error
- Zorg dat je ingelogd bent
- Controleer of de gebruiker een `UserRole` heeft met `role: 'admin'`
- Run `npm run create-admin` om admin gebruiker aan te maken

### Prisma client errors
- Run `npx prisma generate` na schema wijzigingen
- Herstart de dev server

### Database connection errors
- Controleer `DATABASE_URL` in `.env.local`
- Zorg dat PostgreSQL draait
- Controleer database credentials

## Deployment

Voor productie deployment:

1. Zet environment variables in hosting platform
2. Run migrations: `npx prisma migrate deploy`
3. Seed database: `npm run db:seed && npm run seed-translations`
4. Build: `npm run build`
5. Start: `npm start`

## Support

Voor vragen of problemen, contacteer de ontwikkelaar.

