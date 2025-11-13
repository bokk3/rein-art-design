'use client'

import React from 'react'
import { ComponentData } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getText } from '../utils/text-helpers'
import { isLightColor, darkenColor, adjustDarkColorForDarkMode, lightenColor } from '../utils/color-helpers'
import { useImageParallax } from '../utils/use-image-parallax'

interface SplitScreenComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
}

export function SplitScreenComponent({ data, getText }: SplitScreenComponentProps) {
  // Parallax effect for split screen image
  const imageParallax = useImageParallax({ 
    enabled: (data.splitImageParallax !== false) && !!data.splitImageUrl, // Default to true if not set
    speed: 0.15 // Subtle parallax - image moves at 15% of scroll speed
  })
  
  const splitImageSide = data.splitImageSide || 'left'
  const splitRatio = data.splitImageRatio || '50-50'
  
  // Determine width classes based on ratio
  const getWidthClasses = (ratio: string) => {
    if (ratio === '60-40') {
      return { image: 'lg:w-[60%]', text: 'lg:w-[40%]' }
    } else if (ratio === '40-60') {
      return { image: 'lg:w-[40%]', text: 'lg:w-[60%]' }
    }
    return { image: 'lg:w-1/2', text: 'lg:w-1/2' }
  }
  
  const widthClasses = getWidthClasses(splitRatio)
  
  // Determine background classes for the section
  let splitBgClass = 'bg-white dark:bg-[#181818]'
  if (data.backgroundColor === 'white') {
    splitBgClass = 'bg-white dark:bg-[#181818]'
  } else if (data.backgroundColor === 'gray-50') {
    splitBgClass = 'bg-gray-50 dark:bg-[#1a1a1a]'
  } else if (data.backgroundColor) {
    splitBgClass = 'split-screen-custom'
  }
  
  const splitStyle: React.CSSProperties & Record<string, string> = {} as React.CSSProperties & Record<string, string>
  
  // Handle custom background colors with dark mode support
  if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
    splitStyle['--split-bg-color'] = data.backgroundColor
    // For dark mode, darken light colors
    if (isLightColor(data.backgroundColor)) {
      splitStyle['--split-bg-dark'] = darkenColor(data.backgroundColor, 0.6)
    } else {
      // For dark colors, keep them but adjust slightly
      splitStyle['--split-bg-dark'] = adjustDarkColorForDarkMode(data.backgroundColor)
    }
    splitStyle.backgroundColor = data.backgroundColor
  }
  
  if (data.padding) {
    splitStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
  }
  
  // Handle text color with dark mode
  if (data.textColor) {
    splitStyle['--split-text-color'] = data.textColor
    // For dark mode text, adjust based on background
    if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
      if (isLightColor(data.backgroundColor)) {
        // Light background becomes dark, so lighten text
        splitStyle['--split-text-dark'] = lightenColor(data.textColor, 0.8)
      } else {
        splitStyle['--split-text-dark'] = data.textColor
      }
    } else {
      splitStyle['--split-text-dark'] = data.textColor
    }
    splitStyle.color = data.textColor
  }
  
  // Determine text side background
  let textSideBgClass = 'bg-white dark:bg-[#181818]'
  if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
    textSideBgClass = 'split-text-custom'
  }
  
  return (
    <section 
      className={`${splitBgClass} overflow-hidden`}
      style={Object.keys(splitStyle).length > 0 ? splitStyle : undefined}
      data-parallax-container
    >
      <div className={`flex flex-col ${splitImageSide === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[60vh]`}>
        {/* Image Side */}
        <div 
          className={`relative w-full ${widthClasses.image} min-h-[50vh] bg-gray-100 dark:bg-gray-800 overflow-hidden`}
        >
          {data.splitImageUrl ? (
            <>
              <div 
                ref={imageParallax.ref}
                className={`absolute inset-0 overflow-hidden ${data.splitImageKenBurns ? 'animate-ken-burns' : ''}`}
                style={imageParallax.style}
              >
                <Image
                  src={data.splitImageUrl}
                  alt={getText(data.splitImageAlt) || ''}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center bottom' }}
                  quality={100}
                  unoptimized={true}
                  priority
                />
              </div>
              {data.splitImageOverlay && (
                <div className={`absolute inset-0 z-10 pointer-events-none ${splitImageSide === 'left' ? 'bg-gradient-to-r from-black/20 to-transparent' : 'bg-gradient-to-l from-black/20 to-transparent'}`} />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500">No image selected</p>
            </div>
          )}
        </div>
        
        {/* Text Side */}
        <div 
          className={`flex items-center justify-center p-8 lg:p-12 xl:p-16 w-full ${widthClasses.text} ${textSideBgClass}`}
        >
          <div className="max-w-2xl">
            {data.splitSubtitle && (
              <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                {getText(data.splitSubtitle)}
              </p>
            )}
            {data.splitTitle && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {getText(data.splitTitle)}
              </h2>
            )}
            {data.splitContent && (
              <div className="text-lg text-gray-600 dark:text-gray-300 mb-8 prose dark:prose-invert max-w-none">
                <p>{getText(data.splitContent)}</p>
              </div>
            )}
            {data.splitButtonText && (
              <Link href={data.splitButtonLink || '/projects'}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:border-white"
                >
                  {getText(data.splitButtonText)}
                  <ArrowRight className="w-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

