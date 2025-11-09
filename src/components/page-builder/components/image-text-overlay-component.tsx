'use client'

import React from 'react'
import { ComponentData } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getText } from '../utils/text-helpers'
import { useImageParallax } from '../utils/use-image-parallax'

interface ImageTextOverlayComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
}

export function ImageTextOverlayComponent({ data, getText }: ImageTextOverlayComponentProps) {
  // Parallax effect for overlay image
  const imageParallax = useImageParallax({ 
    enabled: !!data.overlayImageUrl,
    speed: 0.15 // Subtle parallax - image moves at 15% of scroll speed
  })
  
  const overlayPosition = data.overlayPosition || 'center'
  const overlayBg = data.overlayBackground || 'dark'
  const overlayOpacity = data.overlayBackgroundOpacity !== undefined ? data.overlayBackgroundOpacity : 70
  
  // Position classes
  const positionClasses = {
    'top-left': 'items-start justify-start',
    'top-center': 'items-start justify-center',
    'top-right': 'items-start justify-end',
    'center-left': 'items-center justify-start',
    'center': 'items-center justify-center',
    'center-right': 'items-center justify-end',
    'bottom-left': 'items-end justify-start',
    'bottom-center': 'items-end justify-center',
    'bottom-right': 'items-end justify-end'
  }
  
  // Background classes for text overlay
  const overlayBgClasses = {
    'none': '',
    'dark': 'bg-black/70 dark:bg-black/80',
    'light': 'bg-white/90 dark:bg-gray-900/90',
    'gradient': 'bg-gradient-to-r from-black/70 via-black/60 to-transparent dark:from-black/80 dark:via-black/70 dark:to-transparent'
  }
  
  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        ...(data.padding ? {
          paddingTop: `${data.padding.top}px`,
          paddingBottom: `${data.padding.bottom}px`,
          paddingLeft: `${data.padding.left}px`,
          paddingRight: `${data.padding.right}px`
        } : {})
      }}
    >
      {data.overlayImageUrl ? (
        <>
          <div 
            ref={imageParallax.ref}
            className="absolute inset-0 overflow-hidden"
            style={imageParallax.style}
          >
            <Image
              src={data.overlayImageUrl}
              alt={getText(data.overlayImageAlt) || ''}
              fill
              className="object-cover"
              style={{ objectPosition: 'center bottom' }}
              priority
              unoptimized={data.overlayImageUrl.startsWith('http://') || data.overlayImageUrl.startsWith('https://')}
            />
          </div>
          <div className={`absolute inset-0 flex ${positionClasses[overlayPosition]} p-8 lg:p-12 xl:p-16 z-10`}>
            <div className={`${overlayBg !== 'none' ? overlayBgClasses[overlayBg] : ''} rounded-lg p-8 lg:p-12 max-w-2xl ${overlayBg === 'none' ? 'text-white' : ''}`}
                 style={overlayBg !== 'none' ? { opacity: overlayOpacity / 100 } : {}}
            >
              {data.overlaySubtitle && (
                <p className={`text-sm uppercase tracking-wider mb-4 ${overlayBg === 'light' ? 'text-gray-600 dark:text-gray-300' : 'text-gray-300 dark:text-gray-400'}`}>
                  {getText(data.overlaySubtitle)}
                </p>
              )}
              {data.overlayTitle && (
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${overlayBg === 'light' ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                  {getText(data.overlayTitle)}
                </h2>
              )}
              {data.overlayContent && (
                <div className={`text-lg mb-8 prose dark:prose-invert max-w-none ${overlayBg === 'light' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-200 dark:text-gray-300'}`}>
                  <p>{getText(data.overlayContent)}</p>
                </div>
              )}
              {data.overlayButtonText && (
                <Link href={data.overlayButtonLink || '/projects'}>
                  <Button 
                    size="lg" 
                    className={overlayBg === 'light' 
                      ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'}
                  >
                    {getText(data.overlayButtonText)}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500">No image selected</p>
        </div>
      )}
    </section>
  )
}

