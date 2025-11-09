export interface PageComponent {
  id: string
  type: 'hero' | 'text' | 'image' | 'gallery' | 'gallery-showcase' | 'cta' | 'spacer' | 'features' | 'testimonials'
  order: number
  data: ComponentData
}

export interface MultilingualText {
  [languageCode: string]: string
}

// Hero text block types
export type HeroTextBlockType = 'heading' | 'subtitle' | 'body' | 'small'
export type HeroElementType = 'text' | 'logo' | 'button'

// Hero text block configuration
export interface HeroTextBlock {
  id: string
  type: HeroElementType
  // For text blocks
  textType?: HeroTextBlockType // heading, subtitle, body, small
  content?: MultilingualText
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
  fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  textColor?: string // Override global text color
  opacity?: number // 0-100
  maxWidth?: number | 'full' | 'none' // Max width in pixels, 'full', or 'none'
  order: number // Display order
  visible?: boolean // Show/hide this block
  // For logo blocks
  logoUrl?: string
  logoAlt?: MultilingualText
  logoWidth?: number // Logo width in pixels
  logoHeight?: number // Logo height in pixels (optional, maintains aspect ratio if not set)
  // For button blocks
  buttonText?: MultilingualText
  buttonLink?: string
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl'
}

// Hero layout configuration
export interface HeroLayout {
  textAlignment?: 'left' | 'center' | 'right' | 'justify'
  verticalAlignment?: 'top' | 'center' | 'bottom'
  horizontalAlignment?: 'left' | 'center' | 'right'
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full' | number // number = max-width in pixels
  contentPadding?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  gap?: number // Gap between elements in pixels
}

export interface ComponentData {
  // Hero component - NEW flexible structure
  heroElements?: HeroTextBlock[] // Dynamic array of hero elements (text blocks, logos, buttons)
  heroLayout?: HeroLayout // Layout configuration
  
  // Hero component - LEGACY structure (backwards compatibility)
  title?: MultilingualText
  subtitle?: MultilingualText
  description?: MultilingualText
  heroButtonText?: MultilingualText
  heroButtonLink?: string
  primaryButton?: MultilingualText
  primaryButtonLink?: string
  secondaryButton?: MultilingualText
  secondaryButtonLink?: string
  
  // Hero background and styling
  backgroundImage?: string
  backgroundType?: 'solid' | 'gradient' | 'image'
  gradient?: string
  gradientFrom?: string // Hex color for gradient start
  gradientVia?: string // Hex color for gradient middle (optional)
  gradientTo?: string // Hex color for gradient end
  gradientDirection?: 'to-t' | 'to-tr' | 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl'
  backgroundOverlayOpacity?: number // 0-100, controls overlay opacity on background image
  backgroundOverlayColor?: string // Hex color for the overlay (default: black)
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
  useCarousel?: boolean // Explicitly enable/disable carousel mode
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