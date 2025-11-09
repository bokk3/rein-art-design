'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { PageComponent, HeroTextBlock, HeroLayout } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
// Removed framer-motion - using CSS animations instead
import { 
  Award, 
  Users, 
  Clock, 
  Star, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Heart,
  Shield,
  Zap,
  Target,
  Lightbulb,
  Palette,
  Hammer,
  Wrench,
  Settings,
  Cog,
  HardHat,
  ToolCase,
  Box,
  Package,
  Factory,
  Truck,
  Ruler,
  Square,
  Scissors,
  Paintbrush,
  Pen,
  Layers,
  FileText,
  Briefcase,
  Building,
  Home,
  Sofa,
  Table,
  Archive,
  Sparkles,
  Hand,
  Handshake
} from 'lucide-react'
import { ProjectCard } from '@/components/gallery/project-card'
import { Input } from '@/components/ui/input'

interface ComponentRendererProps {
  component: PageComponent
  isPreview?: boolean
  currentLanguage?: string
  onProjectClick?: (project: any) => void
  isEditing?: boolean
  onUpdate?: (data: any) => void
}

export function ComponentRenderer({ 
  component, 
  isPreview = false, 
  currentLanguage = 'nl',
  onProjectClick,
  isEditing = false,
  onUpdate
}: ComponentRendererProps) {
  const { type, data } = component

  const containerStyle = {
    backgroundColor: data.backgroundColor || '#ffffff',
    color: data.textColor || '#000000',
    padding: data.padding ? 
      `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px` : 
      undefined
  }

  // Helper function to get multilingual text
  const getText = (text: string | { [key: string]: string } | undefined): string => {
    if (!text) return ''
    if (typeof text === 'string') return text
    return text[currentLanguage] || text['nl'] || Object.values(text)[0] || ''
  }

  // Helper function to update multilingual text
  const updateMultilingualText = (field: keyof typeof data, value: string) => {
    if (!onUpdate) return
    
    const currentValue = data[field]
    const newValue: { [key: string]: string } = typeof currentValue === 'string' 
      ? { [currentLanguage]: value }
      : { ...(currentValue as { [key: string]: string } || {}), [currentLanguage]: value }
    
    onUpdate({ ...data, [field]: newValue })
  }

  // Helper function to update nested array fields (like features, testimonials)
  const updateNestedField = (arrayField: string, index: number, field: string, value: string) => {
    if (!onUpdate) return
    
    const array = (data[arrayField as keyof typeof data] as any[]) || []
    const updatedArray = [...array]
    if (updatedArray[index]) {
      const currentValue = updatedArray[index][field]
      const newValue: { [key: string]: string } = typeof currentValue === 'string'
        ? { [currentLanguage]: value }
        : { ...(currentValue as { [key: string]: string } || {}), [currentLanguage]: value }
      updatedArray[index] = { ...updatedArray[index], [field]: newValue }
      onUpdate({ ...data, [arrayField]: updatedArray })
    }
  }

  // Inline editable text component
  const EditableText = ({ 
    value, 
    field, 
    className, 
    as: Component = 'span',
    multiline = false,
    onUpdate: customUpdate
  }: { 
    value: string
    field: keyof typeof data | string
    className?: string
    as?: keyof React.JSX.IntrinsicElements
    multiline?: boolean
    onUpdate?: (value: string) => void
  }) => {
    const componentIsEditing = isEditing
    const [isLocalEditing, setIsLocalEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

    useEffect(() => {
      if (isLocalEditing && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, [isLocalEditing])

    useEffect(() => {
      setEditValue(value)
    }, [value])

    if (!isLocalEditing) {
      const ComponentElement = Component as React.ElementType
      return (
        <ComponentElement
          data-editable
          className={`${className} ${componentIsEditing ? 'cursor-text hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-dashed rounded px-1' : ''} transition-all inline-block`}
          onClick={(e: React.MouseEvent) => {
            if (componentIsEditing) {
              e.stopPropagation()
              setIsLocalEditing(true)
            }
          }}
          onDoubleClick={(e: React.MouseEvent) => {
            if (componentIsEditing) {
              e.stopPropagation()
              setIsLocalEditing(true)
            }
          }}
        >
          {value || (componentIsEditing ? <span className="text-gray-400 italic">Click to edit</span> : '')}
        </ComponentElement>
      )
    }

    const handleBlur = () => {
      if (editValue !== value) {
        if (customUpdate) {
          customUpdate(editValue)
        } else if (typeof field === 'string' && (field.startsWith('feature-') || field.startsWith('testimonial-'))) {
          // Skip - handled by customUpdate
        } else {
          updateMultilingualText(field as keyof typeof data, editValue)
        }
      }
      setIsLocalEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault()
        handleBlur()
      } else if (e.key === 'Escape') {
        setEditValue(value)
        setIsLocalEditing(false)
      } else if (e.key === 'Enter' && multiline && e.shiftKey) {
        e.preventDefault()
        handleBlur()
      }
    }

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          data-editable
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} w-full bg-white/90 dark:bg-[#1a1a1a]/90 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onClick={(e) => e.stopPropagation()}
          rows={3}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        data-editable
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} bg-white/90 dark:bg-[#1a1a1a]/90 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={(e) => e.stopPropagation()}
      />
    )
  }

  switch (type) {
    case 'hero':
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
            maxWidth: 768, // 3xl = 768px
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
      
      // Helper to check if a color is light (for dark mode adaptation)
      const isLightColor = (color: string): boolean => {
        if (!color) return false
        // Remove # if present
        const hex = color.replace('#', '')
        if (hex.length !== 6) return false
        
        // Convert to RGB
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        return luminance > 0.5
      }
      
      // Helper to darken a color for dark mode
      // For very light colors (white), convert to a nice dark color instead of gray
      const darkenColor = (color: string, factor: number = 0.3): string => {
        if (!color) return color
        const hex = color.replace('#', '')
        if (hex.length !== 6) return color
        
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        
        // Check if it's very light (almost white)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        if (luminance > 0.9) {
          // For very light colors, convert to a dark gray instead of just darkening
          // This prevents white -> gray issue
          const darkValue = Math.floor(30 + (luminance - 0.9) * 20) // Range: 30-50
          return `#${darkValue.toString(16).padStart(2, '0')}${darkValue.toString(16).padStart(2, '0')}${darkValue.toString(16).padStart(2, '0')}`
        }
        
        // For other colors, darken normally but ensure minimum contrast
        const newR = Math.max(0, Math.floor(r * (1 - factor)))
        const newG = Math.max(0, Math.floor(g * (1 - factor)))
        const newB = Math.max(0, Math.floor(b * (1 - factor)))
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
      }
      
      // Helper to check if a color is pure black (or very close to black)
      const isPureBlack = (color: string): boolean => {
        if (!color) return false
        const hex = color.replace('#', '').toLowerCase().trim()
        if (hex.length === 3) {
          // Handle shorthand like '000'
          return hex === '000'
        }
        if (hex.length === 6) {
          // Check for pure black
          if (hex === '000000') return true
          // Check if it's very close to black (within 10 in each channel)
          const num = parseInt(hex, 16)
          if (isNaN(num)) return false
          const r = (num >> 16) & 0xff
          const g = (num >> 8) & 0xff
          const b = num & 0xff
          return r < 10 && g < 10 && b < 10
        }
        return false
      }
      
      // Helper to adjust dark colors for dark mode
      // For black backgrounds, keep them black in dark mode (don't lighten to gray)
      const adjustDarkColorForDarkMode = (color: string): string => {
        if (!color) return color
        
        // Keep pure black as black - don't change it to gray
        if (isPureBlack(color)) {
          return color
        }
        
        const hex = color.replace('#', '').toLowerCase()
        if (hex.length !== 6) return color
        
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        
        // Check if it's very dark (almost black but not pure black)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        if (luminance < 0.15) {
          // For very dark colors, keep them as is - don't lighten to gray
          return color
        }
        
        // For medium-dark colors, keep as is
        return color
      }
      
      // Helper to lighten a color (for text on dark backgrounds)
      const lightenColor = (color: string, factor: number = 0.3): string => {
        if (!color) return color
        const hex = color.replace('#', '')
        if (hex.length !== 6) return color
        
        const r = Math.min(255, Math.floor(parseInt(hex.substring(0, 2), 16) + (255 - parseInt(hex.substring(0, 2), 16)) * factor))
        const g = Math.min(255, Math.floor(parseInt(hex.substring(2, 4), 16) + (255 - parseInt(hex.substring(2, 4), 16)) * factor))
        const b = Math.min(255, Math.floor(parseInt(hex.substring(4, 6), 16) + (255 - parseInt(hex.substring(4, 6), 16)) * factor))
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
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
        
        // For dark mode: smart text color adaptation
        if (data.backgroundType === 'solid' && data.backgroundColor) {
          const bgIsLight = isLightColor(data.backgroundColor)
          const textIsLight = isLightColor(data.textColor)
          const bgIsPureBlack = isPureBlack(data.backgroundColor)
          
          if (bgIsLight) {
            // Light background: in dark mode it becomes dark, so dark text should become light
            if (!textIsLight) {
              heroCSSVars['--hero-text-color-dark'] = lightenColor(data.textColor, 0.8)
            } else {
              // Light text on light background - might need to darken in dark mode
              heroCSSVars['--hero-text-color-dark'] = data.textColor
            }
          } else if (bgIsPureBlack) {
            // Pure black background: keep text as is
            // Black stays black in dark mode, so text color should stay the same
            heroCSSVars['--hero-text-color-dark'] = data.textColor
          } else {
            // Dark (but not pure black) background: keep text as is
            heroCSSVars['--hero-text-color-dark'] = data.textColor
          }
        } else {
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
        if (element.textColor) elementStyle.color = element.textColor
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
                className={`${fontSizeClasses[fontSize]} ${fontWeightClasses[fontWeight]} ${textTypeClass} ${maxWidthClass} hero-text-fade-in`}
                style={{ ...elementStyle, marginBottom, ...maxWidthStyle, width: maxWidthStyle.width || '100%' }}
              >
                {isEditing ? (
                  <EditableText
                    value={getText(element.content)}
                    field={`hero-element-${element.id}` as any}
                    className=""
                    as="span"
                    multiline={element.textType === 'body'}
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
            <div className="absolute inset-0 hero-bg-fade-in">
              <Image
                src={data.backgroundImage}
                alt=""
                fill
                className="object-cover"
                priority
              />
              <div 
                className="absolute inset-0" 
                style={{ 
                  backgroundColor: data.backgroundOverlayColor || '#000000',
                  opacity: (data.backgroundOverlayOpacity !== undefined ? data.backgroundOverlayOpacity : 0) / 100
                }}
              />
            </div>
          )}
          
          <div className={`relative z-10 ${getContentWidth()} ${textAlignClass} py-8 w-full`}>
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

    case 'features':
      const getIcon = (iconName: string) => {
        const icons = {
          award: Award,
          users: Users,
          clock: Clock,
          star: Star,
          check: CheckCircle,
          heart: Heart,
          shield: Shield,
          zap: Zap,
          target: Target,
          lightbulb: Lightbulb,
          palette: Palette,
          hammer: Hammer,
          wrench: Wrench,
          settings: Settings,
          cog: Cog,
          hardhat: HardHat,
          tool: ToolCase,
          box: Box,
          package: Package,
          factory: Factory,
          truck: Truck,
          ruler: Ruler,
          square: Square,
          scissors: Scissors,
          paintbrush: Paintbrush,
          pen: Pen,
          layers: Layers,
          filetext: FileText,
          briefcase: Briefcase,
          building: Building,
          home: Home,
          sofa: Sofa,
          table: Table,
          archive: Archive,
          sparkles: Sparkles,
          hand: Hand,
          handshake: Handshake
        }
        const IconComponent = icons[iconName as keyof typeof icons] || Award
        return <IconComponent className="w-12 h-12" />
      }

      // Use Tailwind classes only for specific string values, otherwise use inline style
      const featuresBgClass = data.backgroundColor === 'white' 
        ? 'bg-white dark:bg-[#181818]' 
        : data.backgroundColor === 'gray-50' 
        ? 'bg-gray-50 dark:bg-[#1a1a1a]' 
        : ''
      
      // Build style object - only include properties that are explicitly set
      const featuresStyle: React.CSSProperties = {}
      if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
        featuresStyle.backgroundColor = data.backgroundColor
      }
      if (data.textColor) {
        featuresStyle.color = data.textColor
      }
      if (data.padding) {
        featuresStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }

      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 ${featuresBgClass}`}
          style={Object.keys(featuresStyle).length > 0 ? featuresStyle : undefined}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {data.title && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title)}
                      field="title"
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title)
                  )}
                </h2>
              )}
              {data.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {isEditing ? (
                    <EditableText
                      value={getText(data.subtitle)}
                      field="subtitle"
                      className="text-xl text-gray-600 dark:text-gray-300"
                      as="span"
                    />
                  ) : (
                    getText(data.subtitle)
                  )}
                </p>
              )}
            </div>
            
            {data.features && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {data.features.map((feature: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                        {getIcon(feature.icon)}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {isEditing ? (
                        <EditableText
                          value={getText(feature.title)}
                          field={`feature-${index}-title` as any}
                          className="text-xl font-semibold"
                          as="span"
                          onUpdate={(val) => updateNestedField('features', index, 'title', val)}
                        />
                      ) : (
                        getText(feature.title)
                      )}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {isEditing ? (
                        <EditableText
                          value={getText(feature.description)}
                          field={`feature-${index}-description` as any}
                          className="text-gray-600 dark:text-gray-300 leading-relaxed"
                          as="span"
                          multiline
                          onUpdate={(val) => updateNestedField('features', index, 'description', val)}
                        />
                      ) : (
                        getText(feature.description)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )

    case 'text':
      return (
        <div 
          className="py-8 px-8"
          style={containerStyle}
        >
          <div className={`max-w-4xl mx-auto prose prose-lg ${
            data.alignment === 'center' ? 'text-center' : 
            data.alignment === 'right' ? 'text-right' : 'text-left'
          }`}>
            {isEditing ? (
              <EditableText
                value={getText(data.content)}
                field="content"
                className="prose prose-lg w-full"
                as="span"
                multiline
              />
            ) : (
              <div 
                dangerouslySetInnerHTML={{ __html: getText(data.content) }}
                style={{ color: data.textColor }}
              />
            )}
          </div>
        </div>
      )

    case 'image':
      return (
        <div 
          className="py-8 px-8"
          style={containerStyle}
        >
          <div className="max-w-4xl mx-auto text-center">
            {data.imageUrl ? (
              <div className="relative inline-block">
                <Image
                  src={data.imageUrl}
                  alt={getText(data.alt) || ''}
                  width={800}
                  height={600}
                  className="rounded-lg shadow-lg"
                />
                {data.caption && (
                  <p className="mt-4 text-sm text-gray-600 italic">
                    {isEditing ? (
                      <EditableText
                        value={getText(data.caption)}
                        field="caption"
                        className="text-sm text-gray-600 italic"
                        as="span"
                      />
                    ) : (
                      getText(data.caption)
                    )}
                  </p>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Select an image</p>
              </div>
            )}
          </div>
        </div>
      )

    case 'gallery':
      const [featuredProjects, setFeaturedProjects] = useState([])
      const [currentScrollIndex, setCurrentScrollIndex] = useState(0)
      const scrollContainerRef = useRef<HTMLDivElement>(null)
      const carouselRef = useRef<HTMLDivElement>(null)
      const [isHovered, setIsHovered] = useState(false)
      const useCarousel = data.useCarousel !== false && (data.useCarousel === true || featuredProjects.length > 3)
      const projectsToShow = data.maxItems ? Math.min(featuredProjects.length, data.maxItems) : featuredProjects.length
      const projectsPerView = 3 // Number of projects visible at once
      const maxScrollIndex = Math.max(0, projectsToShow - projectsPerView) // Stop when last project is visible
      
      // Calculate min-height for full page (accounting for navigation)
      const minHeightStyle = useCarousel 
        ? { minHeight: 'calc(100vh - 80px)' }
        : {}
      
      useEffect(() => {
        if (data.showFeatured) {
          fetch('/api/projects?featured=true')
            .then(res => res.json())
            .then(data => setFeaturedProjects(data.projects || []))
            .catch(err => console.error('Error fetching featured projects:', err))
        }
      }, [data.showFeatured])

      // Mouse wheel scroll handler - only works when hovering over the carousel
      useEffect(() => {
        const carousel = carouselRef.current
        if (!carousel || !useCarousel || isEditing) return

        let scrollTimeout: NodeJS.Timeout | null = null
        let lastScrollTime = 0
        const scrollThrottle = 100 // ms between scrolls

        const handleWheel = (e: WheelEvent) => {
          if (!isHovered) return
          
          const now = Date.now()
          if (now - lastScrollTime < scrollThrottle) {
            e.preventDefault()
            return
          }
          
          e.preventDefault()
          e.stopPropagation()
          lastScrollTime = now
          
          // Determine scroll direction and amount
          const scrollAmount = Math.abs(e.deltaY) > 50 ? 1 : 0 // Only scroll if significant movement
          if (scrollAmount === 0) return
          
          const delta = e.deltaY > 0 ? 1 : -1
          setCurrentScrollIndex((prev) => {
            const next = prev + delta
            return Math.max(0, Math.min(maxScrollIndex, next))
          })
        }

        carousel.addEventListener('wheel', handleWheel, { passive: false })
        return () => {
          carousel.removeEventListener('wheel', handleWheel)
          if (scrollTimeout) clearTimeout(scrollTimeout)
        }
      }, [isHovered, useCarousel, isEditing, maxScrollIndex])

      const handleScrollLeft = () => {
        setCurrentScrollIndex((prev) => Math.max(0, prev - 1))
      }

      const handleScrollRight = () => {
        setCurrentScrollIndex((prev) => Math.min(maxScrollIndex, prev + 1))
      }

      // Use Tailwind classes only for specific string values, otherwise use inline style
      const galleryBgClass = data.backgroundColor === 'gray-50' 
        ? 'bg-gray-50 dark:bg-gray-800' 
        : data.backgroundColor === 'white' 
        ? 'bg-white dark:bg-[#181818]' 
        : ''
      
      // Build style object - only include properties that are explicitly set
      const galleryStyle: React.CSSProperties = {}
      if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
        galleryStyle.backgroundColor = data.backgroundColor
      }
      if (data.textColor) {
        galleryStyle.color = data.textColor
      }
      if (data.padding) {
        galleryStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }

      return (
        <section 
          className={`flex flex-col ${galleryBgClass}`}
          style={{
            ...(Object.keys(galleryStyle).length > 0 ? galleryStyle : {}),
            ...minHeightStyle,
            paddingTop: data.padding?.top ? `${data.padding.top}px` : '4rem',
            paddingBottom: data.padding?.bottom ? `${data.padding.bottom}px` : '4rem',
            paddingLeft: data.padding?.left ? `${data.padding.left}px` : '1rem',
            paddingRight: data.padding?.right ? `${data.padding.right}px` : '1rem',
          }}
        >
          <div className="max-w-[95%] mx-auto w-full flex-1 flex flex-col">
            <div className="text-center mb-12">
              {data.title && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title)}
                      field="title"
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title)
                  )}
                </h2>
              )}
              {data.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {isEditing ? (
                    <EditableText
                      value={getText(data.subtitle)}
                      field="subtitle"
                      className="text-xl text-gray-600 dark:text-gray-300"
                      as="span"
                    />
                  ) : (
                    getText(data.subtitle)
                  )}
                </p>
              )}
            </div>
            
            {data.showFeatured && featuredProjects.length > 0 ? (
              <>
                {useCarousel ? (
                  <div className="flex-1 flex flex-col justify-center" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="relative flex items-center gap-8 px-8">
                      {/* Left Arrow - Outside container with more space */}
                      <button
                        onClick={handleScrollLeft}
                        className="flex-shrink-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                        aria-label="Scroll left"
                        disabled={currentScrollIndex === 0}
                      >
                        <ArrowLeft className="w-10 h-10" />
                      </button>

                      {/* Scrollable Container - Wider with more padding for shadows */}
                      <div 
                        ref={carouselRef}
                        className="flex-1 w-full relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        {/* Outer container for clipping horizontal overflow */}
                        <div 
                          className="relative overflow-hidden"
                          style={{
                            width: '100%',
                            paddingTop: '2rem',
                            paddingBottom: '2rem',
                          }}
                        >
                          {/* Inner container with padding for shadows */}
                          <div 
                            ref={scrollContainerRef}
                            className="overflow-y-visible scrollbar-hide"
                            style={{
                              paddingLeft: '2rem',
                              paddingRight: '2rem',
                              marginTop: '-2rem',
                              marginBottom: '-2rem',
                              paddingTop: '2rem',
                              paddingBottom: '2rem',
                            }}
                          >
                            <div
                              className="flex transition-transform duration-300 ease-out items-stretch"
                              style={{
                                gap: '1.5rem',
                                transform: `translateX(calc(-${currentScrollIndex} * (100% / ${projectsPerView} + 1.5rem / ${projectsPerView})))`,
                              }}
                            >
                              {featuredProjects.slice(0, projectsToShow).map((project: any, index: number) => (
                                <div
                                  key={project.id}
                                  className="flex-shrink-0 flex items-stretch"
                                  style={{
                                    width: `calc((100% - ${(projectsPerView - 1) * 1.5}rem) / ${projectsPerView})`,
                                    paddingLeft: '0.5rem',
                                    paddingRight: '0.5rem',
                                  }}
                                >
                                  <div className="w-full h-full">
                                    <ProjectCard
                                      project={project}
                                      onClick={() => onProjectClick?.(project)}
                                      languageId={currentLanguage}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Arrow - Outside container with more space */}
                      <button
                        onClick={handleScrollRight}
                        className="flex-shrink-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                        aria-label="Scroll right"
                        disabled={currentScrollIndex >= maxScrollIndex}
                      >
                        <ArrowRight className="w-10 h-10" />
                      </button>
                    </div>

                    {/* Scroll Indicators - show position in carousel */}
                    {maxScrollIndex > 0 && (
                      <div className="flex justify-center gap-2 mt-12 mb-4">
                        {Array.from({ length: maxScrollIndex + 1 }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentScrollIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              currentScrollIndex === index
                                ? 'w-8 bg-gray-900 dark:bg-white'
                                : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                            }`}
                            aria-label={`Go to position ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  data.layout === 'masonry' ? (
                    <div 
                      className={`columns-1 ${data.columns === 2 ? 'sm:columns-2' : data.columns === 4 ? 'sm:columns-2 lg:columns-4' : 'sm:columns-2 lg:columns-3'}`}
                      style={{
                        columnGap: '1.5rem',
                      }}
                    >
                      {featuredProjects.slice(0, data.maxItems || 8).map((project: any) => (
                        <div key={project.id} className="break-inside-avoid mb-6">
                          <ProjectCard
                            project={project}
                            onClick={() => onProjectClick?.(project)}
                            languageId={currentLanguage}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${
                      data.columns === 4 ? 'lg:grid-cols-4' : 
                      data.columns === 3 ? 'lg:grid-cols-3' : 
                      data.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                    } gap-8 items-stretch`}>
                      {featuredProjects.slice(0, data.maxItems || 8).map((project: any) => (
                        <div key={project.id} className="h-full">
                          <ProjectCard
                            project={project}
                            onClick={() => onProjectClick?.(project)}
                            languageId={currentLanguage}
                          />
                        </div>
                      ))}
                    </div>
                  )
                )}
                
                {/* Always show button to view all projects */}
                <div className="text-center mt-12 mb-4">
                  <Link href="/projects">
                    <Button variant="outline" size="lg">
                      View All Projects
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : data.images && data.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(data.images || []).map((image: any, index: number) => (
                  <div key={image.id || index} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No projects to display</p>
              </div>
            )}
          </div>
        </section>
      )

    case 'gallery-showcase':
      const [currentImageIndex, setCurrentImageIndex] = useState(0)
      const showcaseImages = data.showcaseImages || []
      const autoScrollSpeed = data.autoScrollSpeed || 4000 // default 4 seconds
      const transitionDuration = data.transitionDuration || 1000 // default 1 second

      // Auto-scroll through images (only when not editing)
      useEffect(() => {
        if (showcaseImages.length <= 1 || isEditing) return

        const interval = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length)
        }, autoScrollSpeed)

        return () => clearInterval(interval)
      }, [showcaseImages.length, autoScrollSpeed, isEditing])

      // Build style object
      const showcaseStyle: React.CSSProperties = {}
      if (data.backgroundColor) {
        showcaseStyle.backgroundColor = data.backgroundColor
      }
      if (data.padding) {
        showcaseStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }

      if (showcaseImages.length === 0) {
        return (
          <div 
            className="w-full h-[50vh] bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center"
            style={Object.keys(showcaseStyle).length > 0 ? showcaseStyle : undefined}
          >
            <p className="text-gray-500 dark:text-gray-400">No images selected for showcase</p>
          </div>
        )
      }

      return (
        <div 
          className="w-full h-[50vh] relative overflow-hidden"
          style={Object.keys(showcaseStyle).length > 0 ? showcaseStyle : undefined}
          onClick={(e) => {
            // Allow clicks to pass through to sortable component when not editing
            if (!isEditing) {
              e.stopPropagation()
            }
          }}
        >
          {showcaseImages.map((image: any, index: number) => (
            <div
              key={image.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                currentImageIndex === index ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
              }`}
              style={{
                transitionDuration: `${transitionDuration}ms`,
              }}
            >
              <Image
                src={image.url}
                alt={image.alt || ''}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 z-[2]">
                  <p className="text-white text-lg font-medium">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
          
          {/* Progress indicators */}
          {showcaseImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-[5] pointer-events-auto">
              {showcaseImages.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all pointer-events-auto ${
                    currentImageIndex === index
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )

    case 'testimonials':
      // Use Tailwind classes only for specific string values, otherwise use inline style
      const testimonialsBgClass = data.backgroundColor === 'white' 
        ? 'bg-white dark:bg-[#181818]' 
        : data.backgroundColor === 'gray-50' 
        ? 'bg-gray-50 dark:bg-gray-800' 
        : ''
      
      // Build style object - only include properties that are explicitly set
      const testimonialsStyle: React.CSSProperties = {}
      if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
        testimonialsStyle.backgroundColor = data.backgroundColor
      }
      if (data.textColor) {
        testimonialsStyle.color = data.textColor
      }
      if (data.padding) {
        testimonialsStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }

      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 ${testimonialsBgClass}`}
          style={Object.keys(testimonialsStyle).length > 0 ? testimonialsStyle : undefined}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {data.title && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title)}
                      field="title"
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title)
                  )}
                </h2>
              )}
            </div>
            
            {data.testimonials && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.testimonials.map((testimonial: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-[#1a1a1a] p-8 rounded-xl shadow-lg">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gray-700 dark:text-gray-300 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      {isEditing ? (
                        <EditableText
                          value={getText(testimonial.content)}
                          field={`testimonial-${index}-content` as any}
                          className="text-gray-700 dark:text-gray-300 italic"
                          as="span"
                          multiline
                          onUpdate={(val) => updateNestedField('testimonials', index, 'content', val)}
                        />
                      ) : (
                        `"${getText(testimonial.content)}"`
                      )}
                    </blockquote>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {isEditing ? (
                          <EditableText
                            value={getText(testimonial.role)}
                            field={`testimonial-${index}-role` as any}
                            className="text-gray-600 dark:text-gray-400 text-sm"
                            as="span"
                            onUpdate={(val) => updateNestedField('testimonials', index, 'role', val)}
                          />
                        ) : (
                          getText(testimonial.role)
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )

    case 'cta':
      // Use Tailwind classes for dark mode compatibility
      // Check if backgroundColor is actually set (not empty string, null, or undefined)
      const hasCustomBg = data.backgroundColor && 
                         data.backgroundColor.trim() !== '' && 
                         data.backgroundColor !== 'slate-900' &&
                         data.backgroundType === 'solid'
      
      // Determine background class - always ensure dark mode support
      // For default gradient, we need to ensure dark mode properly overrides
      const ctaBgClass = data.backgroundColor === 'slate-900' 
        ? 'bg-slate-900 dark:bg-gray-950' 
        : hasCustomBg
        ? 'dark:bg-gray-950' // Only dark mode class, light mode uses inline style
        : '' // Will use wrapper approach for default gradient
      
      // Build style object - only include properties that are explicitly set
      const ctaStyle: React.CSSProperties = {}
      if (data.textColor) {
        ctaStyle.color = data.textColor
      } else if (data.backgroundColor === 'slate-900') {
        // Default white text for dark background
        ctaStyle.color = '#ffffff'
      }
      if (data.padding) {
        ctaStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }
      
      // For default gradient (no backgroundColor), use wrapper to ensure dark mode works
      const isDefaultGradient = !data.backgroundColor || 
                                data.backgroundColor.trim() === '' || 
                                (data.backgroundColor !== 'slate-900' && !hasCustomBg)
      
      if (isDefaultGradient) {
        return (
          <div 
            className="py-20 px-4 sm:px-6 lg:px-8 text-center relative"
            data-cta-gradient="true"
            style={{
              ...(Object.keys(ctaStyle).length > 0 ? ctaStyle : {}),
              // Use inline gradient for light mode, CSS will override in dark mode
              background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb)'
            } as React.CSSProperties}
          >
            <div className="max-w-4xl mx-auto">
              {(data.title || data.heading) && (
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${data.backgroundColor === 'slate-900' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title || data.heading)}
                      field={data.title ? "title" : "heading"}
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title || data.heading)
                  )}
                </h2>
              )}
              
              {data.description && (
                <p className={`text-xl mb-10 leading-relaxed ${data.backgroundColor === 'slate-900' ? 'text-gray-300 opacity-90' : 'text-gray-700 dark:text-gray-400 opacity-90'}`}>
                  {isEditing ? (
                    <EditableText
                      value={getText(data.description)}
                      field="description"
                      className="text-xl leading-relaxed"
                      as="span"
                      multiline
                    />
                  ) : (
                    getText(data.description)
                  )}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(data.primaryButton || data.ctaButtonText) && (
                  isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.primaryButton || data.ctaButtonText)}
                        field={data.primaryButton ? "primaryButton" : "ctaButtonText"}
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.ctaButtonLink || "/contact"}>
                      <Button 
                        size="lg"
                        className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-transparent ${
                          data.backgroundColor === 'slate-900' 
                            ? 'bg-white text-slate-900 hover:bg-gray-100' 
                            : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                        }`}
                      >
                        {getText(data.primaryButton || data.ctaButtonText)}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  )
                )}
                
                {data.secondaryButton && (
                  isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.secondaryButton)}
                        field="secondaryButton"
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.secondaryButtonLink || "/projects"}>
                      <Button 
                        variant="outline"
                        size="lg"
                        className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 ${
                          data.backgroundColor === 'slate-900'
                            ? 'border-white text-white bg-white/5 hover:bg-white hover:text-slate-900'
                            : 'border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-gray-900'
                        }`}
                      >
                        {getText(data.secondaryButton)}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )
      }
      
      // Use wrapper div approach for custom solid colors to ensure dark mode works
      // Use CSS variable so dark mode can override via Tailwind class
      if (hasCustomBg) {
        return (
          <div 
            className={`py-20 px-4 sm:px-6 lg:px-8 text-center dark:bg-gray-950 relative`} 
            style={{ 
              ['--cta-bg' as any]: data.backgroundColor,
              backgroundColor: 'var(--cta-bg)'
            } as React.CSSProperties}
          >
            <div className="max-w-4xl mx-auto">
              {(data.title || data.heading) && (
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${data.backgroundColor === 'slate-900' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title || data.heading)}
                      field={data.title ? "title" : "heading"}
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title || data.heading)
                  )}
                </h2>
              )}
              
              {data.description && (
                <p className={`text-xl mb-10 leading-relaxed ${data.backgroundColor === 'slate-900' ? 'text-gray-300 opacity-90' : 'text-gray-700 dark:text-gray-400 opacity-90'}`}>
                  {isEditing ? (
                    <EditableText
                      value={getText(data.description)}
                      field="description"
                      className="text-xl leading-relaxed"
                      as="span"
                      multiline
                    />
                  ) : (
                    getText(data.description)
                  )}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(data.primaryButton || data.ctaButtonText) && (
                  isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.primaryButton || data.ctaButtonText)}
                        field={data.primaryButton ? "primaryButton" : "ctaButtonText"}
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.ctaButtonLink || "/contact"}>
                      <Button 
                        size="lg"
                        className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-transparent ${
                          data.backgroundColor === 'slate-900' 
                            ? 'bg-white text-slate-900 hover:bg-gray-100' 
                            : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                        }`}
                      >
                        {getText(data.primaryButton || data.ctaButtonText)}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  )
                )}
                
                {data.secondaryButton && (
                  isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.secondaryButton)}
                        field="secondaryButton"
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.secondaryButtonLink || "/projects"}>
                      <Button 
                        variant="outline"
                        size="lg"
                        className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 ${
                          data.backgroundColor === 'slate-900'
                            ? 'border-white text-white bg-white/5 hover:bg-white hover:text-slate-900'
                            : 'border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-gray-900'
                        }`}
                      >
                        {getText(data.secondaryButton)}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )
      }
      
      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 text-center relative ${ctaBgClass}`}
          style={Object.keys(ctaStyle).length > 0 ? ctaStyle : undefined}
        >
          <div className="max-w-4xl mx-auto">
            {(data.title || data.heading) && (
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${data.backgroundColor === 'slate-900' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {isEditing ? (
                  <EditableText
                    value={getText(data.title || data.heading)}
                    field={data.title ? "title" : "heading"}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    as="span"
                  />
                ) : (
                  getText(data.title || data.heading)
                )}
              </h2>
            )}
            
            {data.description && (
              <p className={`text-xl mb-10 leading-relaxed ${data.backgroundColor === 'slate-900' ? 'text-gray-300 opacity-90' : 'text-gray-700 dark:text-gray-400 opacity-90'}`}>
                {isEditing ? (
                  <EditableText
                    value={getText(data.description)}
                    field="description"
                    className="text-xl leading-relaxed"
                    as="span"
                    multiline
                  />
                ) : (
                  getText(data.description)
                )}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(data.primaryButton || data.ctaButtonText) && (
                isEditing ? (
                  <div className="inline-block">
                    <EditableText
                      value={getText(data.primaryButton || data.ctaButtonText)}
                      field={data.primaryButton ? "primaryButton" : "ctaButtonText"}
                      className="text-lg px-8 py-4"
                      as="span"
                    />
                  </div>
                ) : (
                  <Link href={data.ctaButtonLink || "/contact"}>
                    <Button 
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-4 h-auto"
                    >
                      {getText(data.primaryButton || data.ctaButtonText)}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )
              )}
              
              {data.secondaryButton && (
                isEditing ? (
                  <div className="inline-block">
                    <EditableText
                      value={getText(data.secondaryButton)}
                      field="secondaryButton"
                      className="text-lg px-8 py-4"
                      as="span"
                    />
                  </div>
                ) : (
                  <Link href={data.secondaryButtonLink || "/projects"}>
                    <Button 
                      variant="outline"
                      size="lg"
                      className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 ${
                        data.backgroundColor === 'slate-900'
                          ? 'border-white text-white bg-white/5 hover:bg-white hover:text-slate-900'
                          : 'border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-gray-900'
                      }`}
                    >
                      {getText(data.secondaryButton)}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )

    case 'spacer':
      return (
        <div 
          style={{
            height: `${data.height || 60}px`,
            backgroundColor: data.backgroundColor || 'transparent'
          }}
        />
      )

    default:
      return (
        <div className="py-8 px-8 text-center text-gray-500">
          Unknown component type: {type}
        </div>
      )
  }
}