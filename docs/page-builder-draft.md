# Page Builder System - Draft Specification

> **Status**: Draft for review and integration into main requirements and design documents  
> **Date**: 2025-01-XX  
> **Purpose**: Document the visual page builder system that allows admins to create custom homepage and content pages

---

## Table of Contents

1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Design Specifications](#design-specifications)
4. [Component Types](#component-types)
5. [API Specifications](#api-specifications)
6. [Data Models](#data-models)
7. [Implementation Details](#implementation-details)

---

## Overview

The Page Builder System is a visual, drag-and-drop interface that allows admin users to create and customize homepage and content pages without writing code. The system supports multilingual content, responsive design, and maintains the minimal black-on-white aesthetic of the portfolio CMS.

### Key Features

- **Visual Page Builder**: Drag-and-drop interface for building pages
- **Component Library**: 8 pre-built component types (Hero, Text, Image, Gallery, CTA, Spacer, Features, Testimonials)
- **Multilingual Support**: All text content supports multiple languages with fallback handling
- **Live Preview**: Real-time preview of page changes
- **Responsive Design**: Components automatically adapt to mobile and desktop
- **Image Integration**: Direct integration with media library for image selection
- **Order Management**: Components can be reordered, duplicated, and deleted

---

## Requirements

### Requirement 14: Visual Page Builder System

**User Story:** As an admin user, I want to build custom pages using a visual page builder interface, so that I can create engaging homepage and content pages without technical knowledge.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a visual page builder interface accessible from `/admin/page-builder`
2. THE Page_Builder SHALL display a component toolbar with available component types
3. WHEN an admin adds a component, THE Page_Builder SHALL display it in the canvas with default content
4. THE Page_Builder SHALL allow dragging and reordering of components within the canvas
5. WHEN a component is selected, THE Page_Builder SHALL display an editing sidebar with component-specific fields
6. THE Page_Builder SHALL support multilingual content input for all text fields
7. THE Page_Builder SHALL provide a preview mode to view the page as visitors will see it
8. WHEN an admin saves the page, THE Page_Builder SHALL persist all component data to the database
9. THE Portfolio_System SHALL render page builder components on the public homepage
10. THE Page_Builder SHALL support at least 8 component types: Hero, Text, Image, Gallery, CTA, Spacer, Features, and Testimonials

#### Component-Specific Requirements

**Hero Component:**
1. THE Hero_Component SHALL support title, subtitle, and description text in all active languages
2. THE Hero_Component SHALL support primary and secondary call-to-action buttons with customizable links
3. THE Hero_Component SHALL support background customization (solid color, gradient, or image)
4. THE Hero_Component SHALL support configurable height (auto, full screen, or custom)

**Text Component:**
1. THE Text_Component SHALL support rich text content in all active languages
2. THE Text_Component SHALL support text alignment (left, center, right)
3. THE Text_Component SHALL support custom background and text colors

**Image Component:**
1. THE Image_Component SHALL allow selection from the media library
2. THE Image_Component SHALL support alt text and captions in all active languages
3. THE Image_Component SHALL display optimized images using Next.js Image component

**Gallery Component:**
1. THE Gallery_Component SHALL allow selection of multiple images from the media library
2. THE Gallery_Component SHALL support grid or masonry layout options
3. THE Gallery_Component SHALL support configurable column count
4. THE Gallery_Component SHALL support optional featured image display

**CTA Component:**
1. THE CTA_Component SHALL support heading text and button text in all active languages
2. THE CTA_Component SHALL support customizable button link
3. THE CTA_Component SHALL support custom background and text colors

**Spacer Component:**
1. THE Spacer_Component SHALL provide configurable vertical spacing between sections
2. THE Spacer_Component SHALL support responsive spacing options

**Features Component:**
1. THE Features_Component SHALL support multiple feature items
2. EACH Feature_Item SHALL support icon, title, and description in all active languages
3. THE Features_Component SHALL display features in a responsive grid layout

**Testimonials Component:**
1. THE Testimonials_Component SHALL support multiple testimonial entries
2. EACH Testimonial SHALL support name, role, content, rating, and optional avatar image
3. THE Testimonials_Component SHALL support multilingual role and content text

---

## Design Specifications

### Architecture

The Page Builder System uses a component-based architecture where pages are composed of ordered components. Each component has a unique ID, type, order, and data payload.

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Interface                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Toolbar    │  │    Canvas    │  │   Editor     │ │
│  │  (Components)│  │  (Preview)   │  │  (Properties)│ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   API Routes          │
              │  /api/page-builder/*  │
              └──────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Database            │
              │  SiteSettings Table  │
              │  (homepage_components)│
              └──────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Public Rendering    │
              │  ComponentRenderer    │
              └──────────────────────┘
```

### User Interface Design

#### Page Builder Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Save] [Preview]              Page Builder                   │
├─────────────────────────────────────────────────────────────┤
│ Add Component: [Hero] [Text] [Image] [Gallery] [CTA] [Spacer]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │                Canvas Area                           │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ [Hero Component]                             │  │   │
│  │  │ Title: Welcome to Our Portfolio             │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ [Text Component]                              │  │   │
│  │  │ Content: Lorem ipsum...                      │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ [Gallery Component]                          │  │   │
│  │  │ [Image] [Image] [Image]                       │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Edit Component                                      │   │
│  │ ┌──────────────────────────────────────────────┐  │   │
│  │ │ Component: Hero Section                      │  │   │
│  │ │ Title (NL): [________________]               │  │   │
│  │ │ Title (FR): [________________]               │  │   │
│  │ │ Subtitle (NL): [________________]           │  │   │
│  │ │ Subtitle (FR): [________________]           │  │   │
│  │ │ Background: [Solid] [Gradient] [Image]       │  │   │
│  │ │ ...                                         │  │   │
│  │ └──────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Rendering

Components are rendered on the public site using the `ComponentRenderer` component, which:
- Receives the current language preference
- Renders each component type with appropriate styling
- Handles missing translations with fallback logic
- Maintains responsive design across all screen sizes
- Applies minimal black-on-white theme styling

---

## Component Types

### 1. Hero Component

**Purpose**: Large banner section at the top of pages with compelling messaging and call-to-action.

**Data Structure**:
```typescript
{
  type: 'hero',
  data: {
    title: MultilingualText,           // Main headline
    subtitle: MultilingualText,         // Supporting text
    description: MultilingualText,      // Additional description
    heroButtonText: MultilingualText,   // Primary button text
    heroButtonLink: string,             // Primary button URL
    primaryButton: MultilingualText,    // Alternative primary button
    secondaryButton: MultilingualText,  // Secondary button text
    backgroundImage?: string,           // Background image URL
    backgroundType: 'solid' | 'gradient' | 'image',
    gradient?: string,                   // Tailwind gradient class
    height: 'auto' | 'screen' | number, // Section height
    backgroundColor?: string,            // Background color (hex)
    textColor?: string                   // Text color (hex)
  }
}
```

**Default Values**:
- Title: "Welcome to Our Portfolio" (in default language)
- Subtitle: Descriptive text about the business
- Background: White (#ffffff)
- Text: Black (#000000)
- Height: Auto

### 2. Text Component

**Purpose**: Rich text content block for paragraphs, lists, and formatted text.

**Data Structure**:
```typescript
{
  type: 'text',
  data: {
    content: MultilingualText,         // Rich text content (TipTap JSON)
    alignment: 'left' | 'center' | 'right',
    backgroundColor?: string,
    textColor?: string,
    padding?: {
      top: number,
      bottom: number,
      left: number,
      right: number
    }
  }
}
```

**Default Values**:
- Content: Empty placeholder text
- Alignment: Left
- Background: White
- Text: Black

### 3. Image Component

**Purpose**: Display a single image with optional caption and alt text.

**Data Structure**:
```typescript
{
  type: 'image',
  data: {
    imageUrl: string,                  // Image URL from media library
    alt: MultilingualText,             // Alt text for accessibility
    caption: MultilingualText,          // Optional caption
    backgroundColor?: string
  }
}
```

**Default Values**:
- Image: Empty (requires selection)
- Alt: "Image description" (in default language)
- Caption: Empty

### 4. Gallery Component

**Purpose**: Display multiple images in a grid or masonry layout.

**Data Structure**:
```typescript
{
  type: 'gallery',
  data: {
    images: Array<{
      id: string,
      url: string,
      alt: string,
      caption?: string
    }>,
    showFeatured: boolean,             // Show featured image separately
    maxItems?: number,                 // Maximum images to display
    layout: 'grid' | 'masonry',       // Layout style
    columns: number,                   // Number of columns (1-4)
    backgroundColor?: string
  }
}
```

**Default Values**:
- Images: Empty array
- Layout: Grid
- Columns: 3
- Show Featured: false

### 5. CTA (Call-to-Action) Component

**Purpose**: Highlighted section with heading and prominent button.

**Data Structure**:
```typescript
{
  type: 'cta',
  data: {
    heading: MultilingualText,         // CTA heading
    ctaButtonText: MultilingualText,   // Button text
    ctaButtonLink: string,              // Button URL
    backgroundColor?: string,
    textColor?: string,
    padding?: {
      top: number,
      bottom: number,
      left: number,
      right: number
    }
  }
}
```

**Default Values**:
- Heading: "Get Started" (in default language)
- Button Text: "Contact Us" (in default language)
- Button Link: "/contact"
- Background: Light gray (#f5f5f5)
- Text: Black

### 6. Spacer Component

**Purpose**: Add vertical spacing between sections.

**Data Structure**:
```typescript
{
  type: 'spacer',
  data: {
    height: number                     // Height in pixels
  }
}
```

**Default Values**:
- Height: 40px

### 7. Features Component

**Purpose**: Display a grid of features with icons, titles, and descriptions.

**Data Structure**:
```typescript
{
  type: 'features',
  data: {
    features: Array<{
      icon: string,                    // Icon name or SVG
      title: MultilingualText,
      description: MultilingualText
    }>,
    backgroundColor?: string,
    columns?: number                   // Number of columns (1-4)
  }
}
```

**Default Values**:
- Features: Empty array
- Columns: 3

### 8. Testimonials Component

**Purpose**: Display customer testimonials with ratings and avatars.

**Data Structure**:
```typescript
{
  type: 'testimonials',
  data: {
    testimonials: Array<{
      name: string,                   // Customer name
      role: MultilingualText,         // Customer role/company
      content: MultilingualText,       // Testimonial text
      rating?: number,                 // Rating (1-5)
      avatar?: string                  // Avatar image URL
    }>,
    backgroundColor?: string,
    columns?: number                   // Number of columns (1-3)
  }
}
```

**Default Values**:
- Testimonials: Empty array
- Columns: 2

---

## API Specifications

### Page Builder API Endpoints

#### GET /api/page-builder/homepage

**Description**: Retrieve homepage components configuration.

**Authentication**: None (public endpoint for rendering)

**Response**:
```json
{
  "components": [
    {
      "id": "component-1234567890",
      "type": "hero",
      "order": 0,
      "data": {
        "title": {
          "nl": "Welkom",
          "fr": "Bienvenue"
        },
        // ... other data
      }
    }
  ]
}
```

**Error Response**:
```json
{
  "error": "Failed to fetch homepage components"
}
```

#### POST /api/page-builder/homepage

**Description**: Save homepage components configuration.

**Authentication**: Required (Editor role or higher)

**Request Body**:
```json
{
  "components": [
    {
      "id": "component-1234567890",
      "type": "hero",
      "order": 0,
      "data": {
        // Component-specific data
      }
    }
  ]
}
```

**Response**:
```json
{
  "success": true
}
```

**Error Response**:
```json
{
  "error": "Failed to save homepage components"
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `500`: Server error

### Future API Endpoints (Not Yet Implemented)

#### GET /api/page-builder/pages
Retrieve all page builder pages.

#### GET /api/page-builder/pages/[slug]
Retrieve a specific page by slug.

#### POST /api/page-builder/pages
Create a new page builder page.

#### PUT /api/page-builder/pages/[slug]
Update an existing page.

#### DELETE /api/page-builder/pages/[slug]
Delete a page.

---

## Data Models

### TypeScript Interfaces

```typescript
/**
 * Page Component - Individual component in a page
 */
export interface PageComponent {
  id: string                    // Unique component ID
  type: 'hero' | 'text' | 'image' | 'gallery' | 'cta' | 'spacer' | 'features' | 'testimonials'
  order: number                 // Display order (0-based)
  data: ComponentData          // Component-specific data
}

/**
 * Multilingual Text - Text content in multiple languages
 */
export interface MultilingualText {
  [languageCode: string]: string  // e.g., { "nl": "Tekst", "fr": "Texte" }
}

/**
 * Component Data - Union type for all component data
 */
export interface ComponentData {
  // Hero component fields
  title?: MultilingualText
  subtitle?: MultilingualText
  description?: MultilingualText
  heroButtonText?: MultilingualText
  heroButtonLink?: string
  primaryButton?: MultilingualText
  secondaryButton?: MultilingualText
  backgroundImage?: string
  backgroundType?: 'solid' | 'gradient' | 'image'
  gradient?: string
  height?: 'auto' | 'screen' | number
  
  // Text component fields
  content?: MultilingualText
  alignment?: 'left' | 'center' | 'right'
  
  // Image component fields
  imageUrl?: string
  alt?: MultilingualText
  caption?: MultilingualText
  
  // Gallery component fields
  images?: Array<{
    id: string
    url: string
    alt: string
    caption?: string
  }>
  showFeatured?: boolean
  maxItems?: number
  layout?: 'grid' | 'masonry'
  columns?: number
  
  // Features component fields
  features?: Array<{
    icon: string
    title: MultilingualText
    description: MultilingualText
  }>
  
  // Testimonials component fields
  testimonials?: Array<{
    name: string
    role: MultilingualText
    content: MultilingualText
    rating?: number
    avatar?: string
  }>
  
  // CTA component fields
  heading?: MultilingualText
  ctaButtonText?: MultilingualText
  ctaButtonLink?: string
  
  // Common properties
  backgroundColor?: string
  textColor?: string
  padding?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

/**
 * Page Builder Data - Complete page configuration
 */
export interface PageBuilderData {
  id: string
  slug: string                  // URL slug (e.g., "homepage", "about")
  title: string                 // Page title
  components: PageComponent[]    // Ordered array of components
  published: boolean             // Publication status
  createdAt: string
  updatedAt: string
}
```

### Database Storage

Currently, page builder data is stored in the `SiteSettings` table:

```prisma
model SiteSettings {
  id          String   @id @default(cuid())
  key         String   @unique
  value       Json     // Stores PageComponent[] array
  category    String   // 'page_builder'
  description String?
  updatedAt   DateTime @updatedAt
}
```

**Current Implementation**:
- Key: `homepage_components`
- Value: JSON array of `PageComponent` objects
- Category: `page_builder`

**Future Enhancement**:
Consider creating a dedicated `PageBuilderPage` table for better organization:

```prisma
model PageBuilderPage {
  id          String         @id @default(cuid())
  slug        String         @unique
  title       String
  components  Json           // PageComponent[]
  published   Boolean        @default(false)
  createdBy   String
  creator     User           @relation(fields: [createdBy], references: [id])
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}
```

---

## Implementation Details

### Component Files Structure

```
src/
├── components/
│   ├── page-builder/
│   │   ├── page-builder.tsx           # Main page builder component
│   │   ├── component-toolbar.tsx      # Component type selection
│   │   ├── component-editor.tsx       # Component property editor
│   │   ├── component-renderer.tsx     # Public component renderer
│   │   └── sortable-component.tsx     # Draggable component wrapper
│   └── admin/
│       └── page-builder-management.tsx # Admin page wrapper
├── app/
│   ├── admin/
│   │   └── page-builder/
│   │       └── page.tsx               # Admin page route
│   ├── api/
│   │   └── page-builder/
│   │       └── homepage/
│   │           └── route.ts          # API endpoints
│   ├── page.tsx                       # Public homepage
│   └── homepage-client.tsx             # Homepage client component
└── types/
    └── page-builder.ts                 # TypeScript interfaces
```

### Key Implementation Features

1. **Multilingual Support**:
   - All text fields support `MultilingualText` interface
   - Fallback to default language if translation missing
   - Language-aware rendering based on user preference

2. **Component Ordering**:
   - Components maintain `order` property (0-based index)
   - Drag-and-drop functionality for reordering
   - Automatic order updates when components moved

3. **Component Editing**:
   - Sidebar editor appears when component selected
   - Real-time preview updates
   - Language toggle for multilingual fields
   - Media library integration for image selection

4. **Public Rendering**:
   - `ComponentRenderer` handles all component types
   - Responsive design with Tailwind CSS
   - Minimal black-on-white theme maintained
   - Optimized images using Next.js Image component

5. **Data Persistence**:
   - Components stored as JSON in `SiteSettings` table
   - Automatic save on component changes
   - Preview mode without saving

### Responsive Design

All components are designed to be responsive:

- **Mobile (< 768px)**: Single column layouts, stacked components
- **Tablet (768px - 1024px)**: 2-column layouts where appropriate
- **Desktop (> 1024px)**: Full multi-column layouts

### Performance Considerations

1. **Image Optimization**: All images use Next.js Image component with automatic optimization
2. **Lazy Loading**: Components can be lazy-loaded when below the fold
3. **Code Splitting**: Page builder components loaded only in admin panel
4. **Caching**: Homepage components cached in `SiteSettings` table

### Security Considerations

1. **Authentication**: Page builder only accessible to authenticated admin/editor users
2. **Input Validation**: All component data validated before saving
3. **XSS Prevention**: Rich text content sanitized using DOMPurify
4. **Image Security**: Only images from media library can be selected

---

## Future Enhancements

### Potential Additions

1. **More Component Types**:
   - Video component
   - Form embed component
   - Social media feed component
   - Pricing table component
   - FAQ accordion component

2. **Advanced Features**:
   - Component templates/presets
   - Undo/redo functionality
   - Component duplication
   - Page versioning
   - A/B testing support
   - Scheduled publishing

3. **Better Storage**:
   - Dedicated `PageBuilderPage` table
   - Component-level versioning
   - Page drafts and publishing workflow

4. **Enhanced Editor**:
   - Rich text editor for text components
   - Image cropping/editing
   - Color picker for backgrounds
   - Typography controls

5. **Multi-Page Support**:
   - Create pages beyond homepage
   - Page templates
   - Page routing and navigation

---

## Integration Points

### With Existing Systems

1. **Media Library**: Components use images from existing media library
2. **Language System**: Integrates with configurable language system
3. **Theme System**: Respects theme settings for colors and styling
4. **Authentication**: Uses existing Better Auth system for access control
5. **Content Management**: Can be used alongside traditional content pages

### Dependencies

- **TipTap**: For rich text editing in text components (future enhancement)
- **Next.js Image**: For optimized image rendering
- **Tailwind CSS**: For styling and responsive design
- **Lucide React**: For icons in component toolbar

---

## Testing Considerations

### Unit Tests

- Component data validation
- Multilingual text fallback logic
- Component ordering algorithms
- Default value generation

### Integration Tests

- API endpoint authentication
- Component save/load workflow
- Media library integration
- Language switching

### E2E Tests

- Create page with multiple components
- Reorder components
- Edit component properties
- Save and preview page
- Public rendering on homepage

---

## Notes

- This is a **draft document** for review
- Current implementation supports homepage only
- Some features (like rich text editor) may be partially implemented
- Database schema uses `SiteSettings` table as temporary storage
- Consider dedicated table for production use

---

## Questions for Review

1. Should page builder support pages beyond homepage?
2. Should we add a dedicated `PageBuilderPage` database table?
3. Which additional component types are priorities?
4. Should rich text editing be TipTap-based or simpler markdown?
5. Do we need component templates/presets?
6. Should there be a page versioning system?

