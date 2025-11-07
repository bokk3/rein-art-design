# 🏢 Small Business CMS

A comprehensive content management system built for small businesses, featuring multilingual support, project portfolios, contact management, GDPR compliance, page builder, analytics, and dark mode support.

---

## 🚀 Quick Start

1. **Setup environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your BETTER_AUTH_SECRET
   ```

2. **Start development:**
   ```bash
   docker compose up -d postgres
   npm install
   npx prisma db push
   npm run clear-and-seed
   npm run dev
   ```

3. **Access the application:**
   - Homepage: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Login: admin@nextjs-cms.com / admin123

## 🏗️ Architecture

Built with modern web technologies:
- ⚛️ **Frontend**: Next.js 15 with TypeScript
- 🔐 **Authentication**: Better Auth with role-based access
- 🐘 **Database**: PostgreSQL with Prisma ORM
- 🎨 **Styling**: Tailwind CSS
- ✏️ **Rich Text**: TipTap editor
- 📷 **Image Processing**: Sharp
- 🧪 **Testing**: Vitest

## ✨ Current Features

### Core Infrastructure
- 🗄️ **Database Schema**: Complete multilingual content model
- 🔐 **Authentication**: Role-based admin system with Better Auth
- 📁 **Project Management**: Full CRUD with multilingual support
- 🖼️ **Image Processing**: Upload, resize, and thumbnail generation with grayscale filter
- ✍️ **Content Management**: Rich text editor with TipTap
- 📬 **Contact System**: Form submission and admin management
- 📧 **Email Service**: SMTP integration for notifications
- 🎨 **Page Builder**: Visual drag-and-drop page builder for homepage customization
- 📊 **Analytics**: Privacy-focused analytics with GDPR compliance
- 🍪 **Cookie Consent**: Granular cookie consent management (Essential, Analytics, Marketing)
- 🌓 **Dark Mode**: Full light/dark mode support throughout the application

### Admin Features
- 🎛️ **Admin Dashboard**: Enhanced dashboard with real-time stats, charts, system clock, and visits ticker
- 🛠️ **Project Management**: Create, edit, delete projects with images
- 📄 **Content Pages**: Manage About, Services, and custom pages with multilingual support
- 🎨 **Page Builder**: Visual editor for building custom homepage layouts with multiple component types
- 💬 **Contact Messages**: View and manage form submissions with GDPR compliance
- ⚙️ **Email Settings**: Configure SMTP settings
- 🎨 **Theme Settings**: Configure site colors, fonts, and grayscale image filter
- 📊 **Analytics Dashboard**: View page views, popular pages, and export analytics data
- 👥 **User Management**: Admin authentication and sessions
- 🌍 **Language & Translation Management**: 
  - Configure enabled languages and default language
  - Edit content translations (navigation, footer, pages) in simplified interface
  - Auto-translate new languages using DeepL API
  - Translate missing keys for existing languages
  - System translations accessible on-demand (hidden by default)

### Public Features
- 🎨 **Portfolio Gallery**: Responsive 2-column project showcase with larger cards
- 🔍 **Project Details**: Modal popup with translucent background, project navigation arrows, and image carousel
- 📖 **Content Pages**: Dynamic About, Services, Contact pages with full multilingual support
- 📝 **Contact Form**: GDPR-compliant contact submission
- 🌍 **Multilingual UI**: 
  - Language selector in navigation (portal-based dropdown for proper z-index)
  - All UI text translated (navigation, footer, buttons, forms, etc.)
  - URL-based language switching (`?lang=fr`)
  - Language persists across page navigation
  - Smooth translation loading with fallback prevention
- 🚀 **SEO Optimization**: Meta tags, sitemaps, structured data
- 🍪 **Cookie Banner**: Granular cookie consent with category selection
- 🌓 **Theme Toggle**: Light/dark mode switcher in navigation
- 📊 **Privacy-Focused Analytics**: Respects user consent, excludes admin activity

## 🚧 In Progress

### Next Priority Features
- ⚡ **Performance Optimization**: Image lazy loading and caching improvements
- 📱 **Instagram Integration**: Automated post synchronization
- 🧪 **Testing Suite**: Expand test coverage
- 🔄 **Page Builder Enhancements**: Additional component types and customization options

## 📋 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin panel pages
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── page-builder/  # Page builder management
│   │   └── settings/       # Theme and email settings
│   ├── api/               # API endpoints
│   │   ├── analytics/     # Analytics tracking and stats
│   │   ├── cookie-consent/# Cookie consent management
│   │   ├── page-builder/  # Page builder API
│   │   └── image-settings/# Image settings API
│   ├── projects/          # Public portfolio pages
│   └── [slug]/            # Dynamic content pages
├── components/
│   ├── admin/             # Admin interface components
│   │   ├── analytics-dashboard.tsx
│   │   ├── page-builder-management.tsx
│   │   └── theme-settings.tsx
│   ├── gallery/           # Portfolio gallery components
│   │   ├── project-card.tsx
│   │   ├── project-grid.tsx
│   │   └── project-modal.tsx
│   ├── layout/            # Site layout components
│   │   ├── cookie-banner.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   ├── page-builder/      # Page builder components
│   │   ├── component-editor.tsx
│   │   ├── component-renderer.tsx
│   │   └── page-builder.tsx
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
│   ├── cookie-consent-context.tsx
│   ├── image-settings-context.tsx
│   ├── language-context.tsx # Language switching and URL parameter management
│   └── theme-context.tsx
├── lib/                   # Utilities and services
│   ├── analytics-service.ts # Analytics tracking
│   ├── auth-middleware.ts # Authentication logic
│   ├── content-service.ts # Content management
│   ├── project-service.ts # Project operations
│   ├── image-processing.ts # Image handling
│   ├── translation-service.ts # Translation management and fallback logic
│   └── translation-api-service.ts # DeepL/Google Translate API integration
├── hooks/                 # React hooks
│   └── use-t.ts          # Translation hook (useT, useTSync)
└── types/                 # TypeScript definitions
```

## 🗄️ Database Schema

### Core Models
- 👤 **Users**: Admin authentication and roles
- 🎨 **Projects**: Portfolio items with multilingual content
- 📄 **ContentPages**: Dynamic pages (About, Services, etc.)
- 💌 **ContactMessages**: Form submissions with GDPR compliance fields
- 🌐 **Languages**: Configurable language support (enabled, default, code, name)
- 🔑 **TranslationKey**: UI translation keys organized by category
- 📝 **Translation**: Language-specific translations for UI strings
- 🧩 **ComponentTranslation**: Page builder component field translations
- ⚙️ **SiteSettings**: System configuration (includes page builder data)
- 📊 **AnalyticsEvent**: Page views and visitor tracking (privacy-focused)

### Multilingual Support
Comprehensive database-driven internationalization system:
- 🌍 **Translation System**: All UI text and content stored in database (no hardcoded strings)
- 🔑 **Translation Keys**: Organized by category (ui, content, admin, forms, errors)
- 📝 **Component Translations**: Page builder components support multilingual content
- 🔄 **Automatic Translation**: DeepL API integration for auto-translating new languages
- ⚙️ **Language Management**: Admin panel for enabling/disabling languages, setting defaults
- 🎯 **Smart Fallbacks**: Automatic fallback to default language if translation missing
- 🚀 **React Hooks**: `useT()` hook for easy translation access in components
- 📊 **Translation Coverage**: Visual indicators showing translation completeness per language
- 🇳🇱 Dutch (default)
- 🇫🇷 French
- 🇩🇪 German
- 🇬🇧 English
- 🌍 Extensible for additional languages

## 🔧 Development Commands

```bash
# 🗄️ Database
npm run db:reset          # Reset and seed database
npm run db:seed           # Seed with sample data
npx prisma studio         # Database GUI
npm run fix:prisma        # Regenerate Prisma client (if models missing)

# 🚀 Development
npm run dev               # Start dev server
npm run build             # Production build
npm run test              # Run test suite
npm run test:watch        # Watch mode testing

# 👨‍💼 Admin Management
npx tsx scripts/reset-admin.ts          # Reset admin user
npx tsx scripts/check-content.ts        # Verify content data
npx tsx scripts/create-modern-homepage.ts # Create modern homepage with page builder

# 🎨 Page Builder
npx tsx scripts/create-modern-homepage.ts # Generate modern homepage components

# 🌍 Translations
npx tsx scripts/seed-translation-keys.ts # Seed database with common UI translation keys
```

## 📊 Progress Status

**Overall Progress: ~90% Complete**

### Completed Modules (100%)
- 💎 Database & Models
- 🛡️ Authentication System
- 📂 Project Management
- 📝 Content Management
- 🎭 Image Processing
- 📞 Contact System
- 🖼️ Public Portfolio
- 🎯 Admin Interface
- 🎨 **Page Builder System**: Visual drag-and-drop homepage builder
- 🍪 **GDPR Compliance**: Cookie consent banner and privacy controls
- 📊 **Analytics System**: Privacy-focused analytics with admin dashboard
- 🌓 **Dark Mode**: Full light/dark theme support
- 🎨 **Theme Settings**: Customizable site colors and image filters
- 📊 **Enhanced Dashboard**: Real-time stats, charts, system clock
- 🌍 **Internationalization System**: 
  - Database-driven translations
  - Language management interface
  - Automatic translation API integration (DeepL)
  - React hooks for translations
  - Component-based translations for page builder
  - URL-based language switching with persistence
  - Translation coverage tracking

### In Development (50-75%)
- ⚡ Performance Optimization
- 🧪 Expanded Test Coverage

### Planned (0-25%)
- 📸 Instagram Integration
- 🔄 Additional Page Builder Components

## 🌍 Internationalization (i18n)

The CMS features a comprehensive database-driven translation system:

### Translation Architecture
- **Database Storage**: All UI text stored in PostgreSQL (no hardcoded strings)
- **Translation Keys**: Organized by category (`ui`, `content`, `admin`, `forms`, `errors`)
- **Component Translations**: Page builder components support multilingual field translations
- **Fallback Logic**: Automatic fallback to default language if translation missing
- **Client-Side Caching**: Optimized translation fetching with batch requests
- **URL-Based Switching**: Language selection persists via `?lang=xx` URL parameter

### Translation Management
1. **Language Settings** (`/admin/settings`):
   - Enable/disable languages
   - Set default language
   - Add new languages
   - View translation coverage per language
   - Auto-translate new languages (DeepL API)
   - Translate missing keys for existing languages

2. **Content Translations** (`/admin/content` → "Content Translations" tab):
   - Simplified editor for client-facing translations
   - Edit navigation, footer, contact page, projects page text
   - Category-filtered view (only `content` category)

3. **System Translations** (Settings → "Show System Translations"):
   - Full translation key management
   - Edit all UI strings across categories
   - Add new translation keys
   - Search and filter capabilities

### Using Translations in Components
```tsx
import { useT } from '@/hooks/use-t'

export function MyComponent() {
  const { t } = useT()
  
  return (
    <button>{t('button.submit')}</button>
  )
}
```

### Automatic Translation
When adding a new language, the system can automatically translate all existing keys using:
- **DeepL API** (recommended, supports free tier)
- **Google Translate API** (alternative)
- **LibreTranslate** (self-hosted option)

Configure `DEEPL_API_KEY` in `.env.local` to enable auto-translation.

## 🎨 Page Builder

The CMS includes a powerful visual page builder for creating custom homepage layouts:

### Component Types
- **Hero**: Large banner with title, subtitle, buttons, and background options (solid, gradient, image)
- **Features**: Grid of feature cards with icons, titles, and descriptions
- **Gallery**: Display featured projects or custom images in configurable grid layouts
- **Text**: Rich text content blocks with alignment options
- **Image**: Single image display with caption
- **CTA**: Call-to-action sections with buttons
- **Testimonials**: Customer testimonials with ratings
- **Spacer**: Vertical spacing control

### Features
- ✨ Drag-and-drop component reordering
- 🎨 Custom background colors and gradients
- 🌓 Dark mode compatible styling
- 🌍 **Full multilingual support**: Each component field can be translated
- 📱 Responsive design
- 🔧 Granular styling controls (padding, colors, etc.)

### Usage
1. Navigate to `/admin/page-builder`
2. Add components using the toolbar
3. Edit component properties in the sidebar (with language tabs)
4. Preview changes in real-time
5. Save to update the homepage

Run `npx tsx scripts/create-modern-homepage.ts` to generate a modern homepage template.

## 📝 Configuration

### Environment Variables
```bash
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-password"

# Optional: Automatic Translation API
DEEPL_API_KEY="your-deepl-api-key"  # For auto-translating new languages
# Alternative: GOOGLE_TRANSLATE_API_KEY or LIBRETRANSLATE_API_URL
```

### GDPR & Privacy
- ✅ Cookie consent banner with granular controls
- ✅ Privacy-focused analytics (respects user consent)
- ✅ IP address tracking (configurable)
- ✅ Analytics data export and deletion
- ✅ Privacy policy page with cookie management instructions

### Admin Access
- 📧 **Email**: admin@nextjs-cms.com
- 🔑 **Password**: admin123
- 👑 **Role**: Full admin access

## 🤝 Contributing

This is a custom CMS built for small business needs. The codebase follows modern React/Next.js patterns with TypeScript for type safety.

## 📄 License

Private project - All rights reserved.
