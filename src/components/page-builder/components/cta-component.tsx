'use client'

import React from 'react'
import { ComponentData } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getText } from '../utils/text-helpers'
import { EditableText } from '../utils/editable-text'
import { isLightColor, darkenColor, adjustDarkColorForDarkMode, isPureBlack, lightenColor } from '../utils/color-helpers'

interface CTAComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
  isEditing?: boolean
  onUpdate?: (field: keyof ComponentData, value: string) => void
}

export function CTAComponent({ data, getText, isEditing = false, onUpdate }: CTAComponentProps) {
  // Build background style based on background type - EXACTLY like hero component
  const ctaBackgroundStyle: React.CSSProperties = {}
  let ctaBgClass = ''
  const ctaCSSVars: React.CSSProperties & Record<string, string> = {} as React.CSSProperties & Record<string, string>
  
  // Check if we have a backgroundColor - if so, treat it as solid (like hero does)
  // Hero checks backgroundType, but CTA might not have it set, so we check backgroundColor directly
  if (data.backgroundColor && typeof data.backgroundColor === 'string' && data.backgroundColor.trim() !== '') {
    // Treat as solid background (like hero's backgroundType === 'solid')
    const bgColor = data.backgroundColor.trim()
    // Store in CSS variable
    ctaCSSVars['--cta-bg-color'] = bgColor
    
    // For dark mode: smart color adaptation (EXACTLY like hero)
    if (isLightColor(bgColor)) {
      // Light colors: darken significantly to create contrast
      ctaCSSVars['--cta-bg-color-dark'] = darkenColor(bgColor, 0.6)
    } else {
      // Dark colors: adjust slightly for dark mode (lighten a bit for contrast)
      ctaCSSVars['--cta-bg-color-dark'] = adjustDarkColorForDarkMode(bgColor)
    }
    
    ctaBackgroundStyle.backgroundColor = bgColor
    ctaBgClass = 'cta-solid-custom'
  } else {
    // Default gradient - no custom background (like hero's else case)
    ctaBgClass = 'cta-gradient-default'
    // For default gradient, use CSS variable approach
    ctaCSSVars['--cta-gradient-light'] = 'linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb)'
    ctaCSSVars['--cta-gradient-dark'] = '#181818'
    ctaBackgroundStyle.background = 'linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb)'
  }
  
  // Build style object (EXACTLY like hero)
  const ctaStyle: React.CSSProperties = {
    ...ctaBackgroundStyle,
    ...ctaCSSVars
  }
  
  // Handle text color with dark mode support (EXACTLY like hero)
  if (data.textColor) {
    ctaCSSVars['--cta-text-color'] = data.textColor
    
    // For dark mode: smart text color adaptation (EXACTLY like hero)
    if (data.backgroundColor && typeof data.backgroundColor === 'string') {
      const bgIsLight = isLightColor(data.backgroundColor.trim())
      const textIsLight = isLightColor(data.textColor)
      const bgIsPureBlack = isPureBlack(data.backgroundColor.trim())
      
      if (bgIsLight) {
        // Light background: in dark mode it becomes dark, so dark text should become light
        if (!textIsLight) {
          ctaCSSVars['--cta-text-color-dark'] = lightenColor(data.textColor, 0.8)
        } else {
          // Light text on light background - might need to darken in dark mode
          ctaCSSVars['--cta-text-color-dark'] = data.textColor
        }
      } else if (bgIsPureBlack) {
        // Pure black background: keep text as is
        // Black stays black in dark mode, so text color should stay the same
        ctaCSSVars['--cta-text-color-dark'] = data.textColor
      } else {
        // Dark (but not pure black) background: keep text as is
        ctaCSSVars['--cta-text-color-dark'] = data.textColor
      }
    } else {
      ctaCSSVars['--cta-text-color-dark'] = data.textColor
    }
    
    ctaStyle.color = data.textColor
  }
  
  if (data.padding) {
    ctaStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
  }
  
  // Render button content (editable or link)
  const renderButton = (buttonTextValue: string | { [key: string]: string } | undefined, buttonLink: string, field: string, variant: 'primary' | 'secondary') => {
    const buttonText = getText(buttonTextValue)
    if (!buttonText) return null
    
    if (isEditing && onUpdate) {
      return (
        <div className="inline-block">
          <EditableText
            value={buttonText}
            field={field}
            className="text-lg px-8 py-4"
            as="span"
            isEditing={isEditing}
            onUpdate={(val) => onUpdate(field as keyof ComponentData, val)}
          />
        </div>
      )
    }
    
    // Determine button styles based on background
    const bgColorForButton = data.backgroundColor && typeof data.backgroundColor === 'string' ? data.backgroundColor.trim() : ''
    const isDarkBackground = bgColorForButton && (
      bgColorForButton === 'slate-900' || 
      bgColorForButton === '#0f172a' ||
      (!isLightColor(bgColorForButton))
    )
    
    const buttonClasses = variant === 'primary'
      ? `w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-transparent ${
          isDarkBackground
            ? 'bg-white text-slate-900 hover:bg-gray-100 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100' 
            : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
        }`
      : `w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 ${
          isDarkBackground
            ? 'border-white text-white bg-white/5 hover:bg-white hover:text-slate-900 dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-slate-900'
            : 'border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-gray-900'
        }`
    
    return (
      <Link href={buttonLink}>
        <Button 
          size="lg"
          variant={variant === 'primary' ? 'default' : 'outline'}
          className={buttonClasses}
        >
          {buttonText}
          {variant === 'primary' && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
      </Link>
    )
  }
  
  // Determine text color classes - if textColor is set, CSS variable handles it
  // Otherwise use default colors based on background
  const getTextColorClasses = () => {
    if (data.textColor) {
      // Custom text color - CSS variable will handle dark mode
      return ''
    }
    
    // No custom text color - use defaults
    const bgColor = data.backgroundColor && typeof data.backgroundColor === 'string' ? data.backgroundColor.trim() : ''
    if (bgColor && !isLightColor(bgColor)) {
      // Dark background - use white text
      return 'text-white'
    }
    
    // Light background or no background - use dark text in light mode, light in dark mode
    return 'text-gray-900 dark:text-white'
  }
  
  const getDescriptionColorClasses = () => {
    if (data.textColor) {
      // Custom text color - CSS variable will handle dark mode
      return 'opacity-90'
    }
    
    // No custom text color - use defaults
    const bgColor = data.backgroundColor && typeof data.backgroundColor === 'string' ? data.backgroundColor.trim() : ''
    if (bgColor && !isLightColor(bgColor)) {
      // Dark background - use light gray text
      return 'text-gray-300 opacity-90'
    }
    
    // Light background or no background
    return 'text-gray-700 dark:text-gray-400 opacity-90'
  }
  
  // Common content rendering
  const renderContent = () => (
    <div 
      className={`py-20 px-4 sm:px-6 lg:px-8 text-center relative ${ctaBgClass}`}
      style={Object.keys(ctaStyle).length > 0 ? ctaStyle : undefined}
    >
      <div className="max-w-4xl mx-auto">
        {(data.title || data.heading) && (
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${getTextColorClasses()}`}>
            {isEditing && onUpdate ? (
              <EditableText
                value={getText(data.title || data.heading)}
                field={(data.title ? "title" : "heading") as keyof ComponentData}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                as="span"
                isEditing={isEditing}
                onUpdate={(val) => onUpdate((data.title ? "title" : "heading") as keyof ComponentData, val)}
              />
            ) : (
              getText(data.title || data.heading)
            )}
          </h2>
        )}
        
        {data.description && (
          <p className={`text-xl mb-10 leading-relaxed ${getDescriptionColorClasses()}`}>
            {isEditing && onUpdate ? (
              <EditableText
                value={getText(data.description)}
                field="description"
                className="text-xl leading-relaxed"
                as="span"
                multiline
                isEditing={isEditing}
                onUpdate={(val) => onUpdate('description', val)}
              />
            ) : (
              getText(data.description)
            )}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {renderButton(data.primaryButton || data.ctaButtonText, data.ctaButtonLink || "/contact", data.primaryButton ? "primaryButton" : "ctaButtonText", 'primary')}
          {renderButton(data.secondaryButton, data.secondaryButtonLink || "/projects", "secondaryButton", 'secondary')}
        </div>
      </div>
    </div>
  )
  
  return renderContent()
}

