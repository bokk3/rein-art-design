'use client'

import React, { useMemo } from 'react'
import { ComponentData, HeroTextBlock, HeroLayout } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getText } from '../utils/text-helpers'
import { isLightColor, darkenColor, adjustDarkColorForDarkMode, isPureBlack, lightenColor } from '../utils/color-helpers'
import { EditableText } from '../utils/editable-text'
import { useScrollParallax } from '../utils/use-scroll-parallax'

interface HeroComponentProps {
  data: ComponentData
  currentLanguage: string
  isEditing?: boolean
  getText: (text: string | { [key: string]: string } | undefined) => string
}

export function HeroComponent({ data, currentLanguage, isEditing = false, getText }: HeroComponentProps) {
  // Parallax effect for hero text - moves up faster than scroll speed
  const textParallax = useScrollParallax({ 
    enabled: !isEditing,
    speed: 1.5 // Text moves 1.5x faster than scroll (upward)
  })
  
  // Helper to convert legacy hero data to new format (backwards compatibility)
  const normalizeHeroElements = useMemo((): HeroTextBlock[] => {
    // If new structure exists, use it
    if (data.heroElements && Array.isArray(data.heroElements) && data.heroElements.length > 0) {
      return data.heroElements.filter(el => el.visible !== false).sort((a, b) => a.order - b.order)
    }
    
    // Otherwise, convert legacy structure
    const elements: HeroTextBlock[] = []
    let order = 0
    
    if (data.title) {
      elements.push({
        id: 'legacy-title',
        type: 'text',
        textType: 'heading',
        content: data.title,
        fontSize: '7xl',
        fontWeight: 'bold',
        order: order++,
        visible: true
      })
    }
    
    if (data.subtitle) {
      elements.push({
        id: 'legacy-subtitle',
        type: 'text',
        textType: 'subtitle',
        content: data.subtitle,
        fontSize: '3xl',
        fontWeight: 'light',
        opacity: 90,
        order: order++,
        visible: true
      })
    }
    
    if (data.description) {
      elements.push({
        id: 'legacy-description',
        type: 'text',
        textType: 'body',
        content: data.description,
        fontSize: 'xl',
        opacity: 80,
        maxWidth: 768,
        order: order++,
        visible: true
      })
    }
    
    if (data.primaryButton || data.heroButtonText) {
      elements.push({
        id: 'legacy-primary-button',
        type: 'button',
        buttonText: data.primaryButton || data.heroButtonText,
        buttonLink: data.primaryButtonLink || data.heroButtonLink || '/projects',
        buttonVariant: 'primary',
        buttonSize: 'lg',
        order: order++,
        visible: true
      })
    }
    
    if (data.secondaryButton) {
      elements.push({
        id: 'legacy-secondary-button',
        type: 'button',
        buttonText: data.secondaryButton,
        buttonLink: data.secondaryButtonLink || '/contact',
        buttonVariant: 'secondary',
        buttonSize: 'lg',
        order: order++,
        visible: true
      })
    }
    
    return elements
  }, [data])
  
  // Get layout configuration or use defaults
  const layout: HeroLayout = data.heroLayout || {
    textAlignment: 'center',
    verticalAlignment: 'center',
    horizontalAlignment: 'center',
    contentWidth: 'wide',
    gap: 16
  }
  
  // Build background style based on background type
  const heroBackgroundStyle: React.CSSProperties = {}
  let backgroundClass = ''
  const heroCSSVars: React.CSSProperties & Record<string, string> = {} as React.CSSProperties & Record<string, string>
  
  if (data.backgroundType === 'gradient') {
    const direction = data.gradientDirection || 'to-br'
    const fromColor = data.gradientFrom || '#ffffff'
    const viaColor = data.gradientVia
    const toColor = data.gradientTo || '#000000'
    
    const gradientDirectionMap: { [key: string]: string } = {
      'to-t': 'to top',
      'to-tr': 'to top right',
      'to-r': 'to right',
      'to-br': 'to bottom right',
      'to-b': 'to bottom',
      'to-bl': 'to bottom left',
      'to-l': 'to left',
      'to-tl': 'to top left'
    }
    
    const dir = gradientDirectionMap[direction] || 'to bottom right'
    
    // Calculate dark mode colors
    const fromDark = isLightColor(fromColor) ? darkenColor(fromColor, 0.4) : fromColor
    const viaDark = viaColor ? (isLightColor(viaColor) ? darkenColor(viaColor, 0.4) : viaColor) : null
    const toDark = isLightColor(toColor) ? darkenColor(toColor, 0.4) : toColor
    
    // Build gradients
    const lightGradient = viaColor 
      ? `linear-gradient(${dir}, ${fromColor}, ${viaColor}, ${toColor})`
      : `linear-gradient(${dir}, ${fromColor}, ${toColor})`
    
    const darkGradient = viaDark
      ? `linear-gradient(${dir}, ${fromDark}, ${viaDark}, ${toDark})`
      : `linear-gradient(${dir}, ${fromDark}, ${toDark})`
    
    // Store in CSS variables for dark mode override
    heroCSSVars['--hero-gradient-light'] = lightGradient
    heroCSSVars['--hero-gradient-dark'] = darkGradient
    
    heroBackgroundStyle.background = lightGradient
    backgroundClass = 'hero-gradient-custom'
  } else if (data.backgroundType === 'solid') {
    const bgColor = data.backgroundColor || '#ffffff'
    // Store in CSS variable
    heroCSSVars['--hero-bg-color'] = bgColor
    
    // For dark mode: smart color adaptation
    if (isLightColor(bgColor)) {
      // Light colors: darken significantly to create contrast
      heroCSSVars['--hero-bg-color-dark'] = darkenColor(bgColor, 0.6)
    } else {
      // Dark colors: adjust slightly for dark mode (lighten a bit for contrast)
      heroCSSVars['--hero-bg-color-dark'] = adjustDarkColorForDarkMode(bgColor)
    }
    
    heroBackgroundStyle.backgroundColor = bgColor
    backgroundClass = 'hero-solid-custom'
  } else if (!data.backgroundType || data.backgroundType === 'image') {
    backgroundClass = !data.backgroundImage ? 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:bg-[#181818]' : ''
  }
  
  // Build style object
  const heroStyle: React.CSSProperties = {
    ...heroBackgroundStyle,
    ...heroCSSVars
  }
  
  // Handle text color with dark mode support
  if (data.textColor) {
    heroCSSVars['--hero-text-color'] = data.textColor
    
    // For dark mode: always adapt dark text to light, and keep light text light
    // This ensures readability regardless of background type
    const textIsLight = isLightColor(data.textColor)
    const textIsPureBlack = isPureBlack(data.textColor)
    
    // Normalize color string for comparison
    const normalizedColor = data.textColor.trim().toLowerCase()
    const isBlackColor = textIsPureBlack || 
                        normalizedColor === '#000' || 
                        normalizedColor === '#000000' ||
                        normalizedColor === 'black' ||
                        normalizedColor === 'rgb(0, 0, 0)' ||
                        normalizedColor === 'rgba(0, 0, 0, 1)'
    
    if (isBlackColor) {
      // Pure black text: make it white in dark mode for visibility
      heroCSSVars['--hero-text-color-dark'] = '#ffffff'
    } else if (!textIsLight) {
      // Dark (but not pure black) text: lighten significantly for dark mode
      heroCSSVars['--hero-text-color-dark'] = lightenColor(data.textColor, 0.9)
    } else {
      // Light text: keep it light in dark mode
      heroCSSVars['--hero-text-color-dark'] = data.textColor
    }
    
    heroStyle.color = data.textColor
  }
  
  // Apply padding from layout or legacy padding
  if (layout.contentPadding) {
    heroStyle.padding = `${layout.contentPadding.top || 0}px ${layout.contentPadding.right || 0}px ${layout.contentPadding.bottom || 0}px ${layout.contentPadding.left || 0}px`
  } else if (data.padding) {
    heroStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
  }

  // Calculate height
  const heroHeightStyle = data.height === 'screen' 
    ? { minHeight: 'calc(100vh - 80px)' } 
    : data.height && typeof data.height === 'number'
    ? { minHeight: `${data.height}px` }
    : {}
  
  const combinedStyle = {
    ...heroHeightStyle,
    ...heroStyle
  }
  
  // Determine vertical alignment classes
  const verticalAlignClass = layout.verticalAlignment === 'top' 
    ? 'items-start' 
    : layout.verticalAlignment === 'bottom' 
    ? 'items-end' 
    : 'items-center'
  
  // Determine horizontal alignment classes
  const horizontalAlignClass = layout.horizontalAlignment === 'left'
    ? 'justify-start'
    : layout.horizontalAlignment === 'right'
    ? 'justify-end'
    : 'justify-center'
  
  // Determine text alignment
  const textAlignClass = layout.textAlignment === 'left'
    ? 'text-left'
    : layout.textAlignment === 'right'
    ? 'text-right'
    : layout.textAlignment === 'justify'
    ? 'text-justify'
    : 'text-center'
  
  // Determine content width
  const getContentWidth = (): string => {
    if (typeof layout.contentWidth === 'number') {
      return `max-w-[${layout.contentWidth}px]`
    }
    switch (layout.contentWidth) {
      case 'narrow': return 'max-w-2xl'
      case 'medium': return 'max-w-4xl'
      case 'wide': return 'max-w-5xl'
      case 'full': return 'max-w-full'
      default: return 'max-w-5xl'
    }
  }
  
  // Group consecutive buttons together for horizontal layout
  const groupElements = (elements: HeroTextBlock[]): Array<HeroTextBlock | HeroTextBlock[]> => {
    const grouped: Array<HeroTextBlock | HeroTextBlock[]> = []
    let buttonGroup: HeroTextBlock[] = []
    
    elements.forEach((element, index) => {
      if (element.type === 'button' && element.visible) {
        buttonGroup.push(element)
      } else {
        // If we have a button group, add it first
        if (buttonGroup.length > 0) {
          grouped.push(buttonGroup)
          buttonGroup = []
        }
        // Add the non-button element
        if (element.visible) {
          grouped.push(element)
        }
      }
    })
    
    // Add any remaining button group
    if (buttonGroup.length > 0) {
      grouped.push(buttonGroup)
    }
    
    return grouped
  }
  
  // Render a single hero element
  const renderSingleElement = (element: HeroTextBlock, index: number, isLastInGroup: boolean = false) => {
    const elementStyle: React.CSSProperties = {}
    // Only apply element-specific textColor if explicitly set, otherwise inherit from parent hero-text-custom
    if (element.textColor) {
      elementStyle.color = element.textColor
    }
    // Always ensure text elements inherit color from parent for dark mode
    if (element.opacity !== undefined) elementStyle.opacity = element.opacity / 100
    if (element.maxWidth && typeof element.maxWidth === 'number') {
      elementStyle.maxWidth = `${element.maxWidth}px`
    }
    
    const gap = layout.gap || 16
    const marginBottom = isLastInGroup ? `${gap}px` : '0'
    
    switch (element.type) {
      case 'text':
        if (!element.content) return null
        
        const fontSizeClasses: Record<string, string> = {
          'xs': 'text-xs',
          'sm': 'text-sm',
          'base': 'text-base',
          'lg': 'text-lg',
          'xl': 'text-xl',
          '2xl': 'text-2xl',
          '3xl': 'text-3xl',
          '4xl': 'text-4xl',
          '5xl': 'text-5xl',
          '6xl': 'text-6xl',
          '7xl': 'text-7xl',
          '8xl': 'text-8xl',
          '9xl': 'text-9xl'
        }
        
        const fontWeightClasses: Record<string, string> = {
          'light': 'font-light',
          'normal': 'font-normal',
          'medium': 'font-medium',
          'semibold': 'font-semibold',
          'bold': 'font-bold',
          'extrabold': 'font-extrabold',
          'black': 'font-black'
        }
        
        const textTypeClasses: Record<string, string> = {
          'heading': 'leading-tight',
          'subtitle': 'leading-relaxed',
          'body': 'leading-relaxed',
          'small': 'leading-normal'
        }
        
        const fontSize = element.fontSize || (element.textType === 'heading' ? '7xl' : element.textType === 'subtitle' ? '3xl' : element.textType === 'body' ? 'xl' : 'base')
        const fontWeight = element.fontWeight || (element.textType === 'heading' ? 'bold' : element.textType === 'subtitle' ? 'light' : 'normal')
        const textTypeClass = textTypeClasses[element.textType || 'body'] || ''
        
        const Tag = element.textType === 'heading' ? 'h1' : element.textType === 'subtitle' ? 'h2' : 'p'
        
        // Handle maxWidth for text elements
        let maxWidthStyle: React.CSSProperties = {}
        let maxWidthClass = 'mx-auto'
        if (element.maxWidth === 'none') {
          maxWidthClass = ''
          maxWidthStyle.width = 'auto'
        } else if (element.maxWidth === 'full') {
          maxWidthClass = ''
          maxWidthStyle.width = '100%'
        } else if (typeof element.maxWidth === 'number') {
          maxWidthStyle.maxWidth = `${element.maxWidth}px`
        }
        
        return (
          <Tag
            key={element.id}
            className={`${fontSizeClasses[fontSize]} ${fontWeightClasses[fontWeight]} ${textTypeClass} ${maxWidthClass} hero-text-fade-in hero-text-custom`}
            style={{ ...elementStyle, marginBottom, ...maxWidthStyle, width: maxWidthStyle.width || '100%' }}
          >
            {isEditing ? (
              <EditableText
                value={getText(element.content)}
                field={`hero-element-${element.id}` as any}
                className=""
                as="span"
                multiline={element.textType === 'body'}
                isEditing={isEditing}
              />
            ) : (
              getText(element.content)
            )}
          </Tag>
        )
      
      case 'logo':
        if (!element.logoUrl) return null
        return (
          <div
            key={element.id}
            className="hero-text-fade-in mx-auto hero-logo-container"
            style={{ marginBottom, width: element.logoWidth ? `${element.logoWidth}px` : 'auto' }}
          >
            <Image
              src={element.logoUrl}
              alt={getText(element.logoAlt) || ''}
              width={element.logoWidth || 200}
              height={element.logoHeight || element.logoWidth || 200}
              className="object-contain hero-logo-image"
              priority
            />
          </div>
        )
      
      case 'button':
        if (!element.buttonText) return null
        const buttonVariants = {
          'primary': 'bg-white text-slate-900 hover:bg-gray-100 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 border-2 border-transparent',
          'secondary': 'border-2 border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-slate-900',
          'outline': 'border-2 border-current hover:bg-current hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-slate-900',
          'ghost': 'hover:bg-white/10 dark:hover:bg-white/10'
        }
        
        const buttonSizes = {
          'sm': 'text-sm px-4 py-2',
          'md': 'text-base px-6 py-3',
          'lg': 'text-lg px-8 py-4',
          'xl': 'text-xl px-10 py-5'
        }
        
        return (
          <div key={element.id} className="hero-text-fade-in">
            {isEditing ? (
              <div className="inline-block">
                <EditableText
                  value={getText(element.buttonText)}
                  field={`hero-element-${element.id}` as any}
                  className={`${buttonSizes[element.buttonSize || 'lg']}`}
                  as="span"
                  isEditing={isEditing}
                />
              </div>
            ) : (
              <Link href={element.buttonLink || '#'}>
                <Button
                  variant={element.buttonVariant === 'primary' ? 'default' : element.buttonVariant === 'secondary' || element.buttonVariant === 'outline' ? 'outline' : 'ghost'}
                  size={element.buttonSize === 'sm' ? 'sm' : element.buttonSize === 'lg' || element.buttonSize === 'md' || element.buttonSize === 'xl' ? 'lg' : 'lg'}
                  className={`w-full sm:w-auto ${buttonVariants[element.buttonVariant || 'primary']} transition-all duration-300 ${buttonSizes[element.buttonSize || 'lg']}`}
                >
                  {getText(element.buttonText)}
                  {element.buttonVariant === 'primary' && <ArrowRight className="w-5 h-5 ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1" />}
                </Button>
              </Link>
            )}
          </div>
        )
      
      default:
        return null
    }
  }
  
  // Render grouped elements - group consecutive buttons together
  const groupedElements = useMemo(() => {
    return groupElements(normalizeHeroElements)
  }, [normalizeHeroElements])
  const gap = layout.gap || 16
  
  return (
    <div 
      data-hero-section
      data-hero-bg-type={data.backgroundType || 'image'}
      className={`relative ${data.height === 'screen' ? '' : 'py-16'} px-4 sm:px-6 lg:px-8 flex ${verticalAlignClass} ${horizontalAlignClass} ${backgroundClass} overflow-hidden hero-fade-in`}
      style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
    >
      {data.backgroundType === 'image' && data.backgroundImage && (
        <div className="absolute inset-0 hero-bg-fade-in overflow-hidden">
          <Image
            src={data.backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div 
            className="absolute inset-0 z-[1]" 
            style={{ 
              backgroundColor: data.backgroundOverlayColor || '#000000',
              opacity: (data.backgroundOverlayOpacity !== undefined ? data.backgroundOverlayOpacity : 0) / 100
            }}
          />
        </div>
      )}
      
      <div 
        ref={textParallax.ref}
        className={`relative z-10 ${getContentWidth()} ${textAlignClass} py-8 w-full hero-text-custom`}
        style={{
          ...textParallax.style,
          // Apply CSS variables for text color (dark mode handled by CSS)
          // Always set CSS variables if they were calculated in heroCSSVars
          ...(heroCSSVars['--hero-text-color'] && {
            '--hero-text-color': heroCSSVars['--hero-text-color']
          }),
          ...(heroCSSVars['--hero-text-color-dark'] && {
            '--hero-text-color-dark': heroCSSVars['--hero-text-color-dark']
          })
        } as React.CSSProperties}
      >
        {groupedElements.map((item, groupIndex) => {
          const isLastGroup = groupIndex === groupedElements.length - 1
          
          // If it's an array, it's a button group - render buttons horizontally
          if (Array.isArray(item)) {
            return (
              <div 
                key={`button-group-${groupIndex}`}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-text-fade-in w-full"
                style={{ marginBottom: isLastGroup ? '0' : `${gap}px` }}
              >
                {item.map((button, btnIndex) => (
                  <div key={button.id}>
                    {renderSingleElement(button, btnIndex, false)}
                  </div>
                ))}
              </div>
            )
          } else {
            // Single element (text or logo)
            return renderSingleElement(item, groupIndex, !isLastGroup)
          }
        })}
      </div>
    </div>
  )
}

