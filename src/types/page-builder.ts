export interface PageComponent {
  id: string
  type: 'hero' | 'text' | 'image' | 'gallery' | 'gallery-showcase' | 'cta' | 'spacer' | 'features' | 'testimonials'
  order: number
  data: ComponentData
}

export interface MultilingualText {
  [languageCode: string]: string
}

export interface ComponentData {
  // Hero component - multilingual
  title?: MultilingualText
  subtitle?: MultilingualText
  description?: MultilingualText
  heroButtonText?: MultilingualText
  heroButtonLink?: string
  primaryButton?: MultilingualText
  primaryButtonLink?: string
  secondaryButton?: MultilingualText
  secondaryButtonLink?: string
  backgroundImage?: string
  backgroundType?: 'solid' | 'gradient' | 'image'
  gradient?: string
  height?: 'auto' | 'screen' | number
  
  // Text component - multilingual
  content?: MultilingualText
  alignment?: 'left' | 'center' | 'right'
  
  // Image component - multilingual
  imageUrl?: string
  alt?: MultilingualText
  caption?: MultilingualText
  
  // Gallery component
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
  
  // Gallery Showcase component - auto-scrolling full-width gallery
  showcaseImages?: Array<{
    id: string
    url: string
    alt: string
    caption?: string
  }>
  autoScrollSpeed?: number // milliseconds between transitions
  transitionDuration?: number // milliseconds for transition animation
  
  // Features component
  features?: Array<{
    icon: string
    title: MultilingualText
    description: MultilingualText
  }>
  
  // Testimonials component
  testimonials?: Array<{
    name: string
    role: MultilingualText
    content: MultilingualText
    rating?: number
    avatar?: string
  }>
  
  // CTA component - multilingual
  heading?: MultilingualText
  ctaButtonText?: MultilingualText
  ctaButtonLink?: string
  
  // Spacer component
  
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

export interface PageBuilderData {
  id: string
  slug: string
  title: string
  components: PageComponent[]
  published: boolean
  createdAt: string
  updatedAt: string
}