'use client'

import React, { useState, useEffect } from 'react'
import { ComponentData } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getText } from '../utils/text-helpers'
import { useImageParallax } from '../utils/use-image-parallax'

interface FeatureShowcaseComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
  currentLanguage: string
}

export function FeatureShowcaseComponent({ data, getText, currentLanguage }: FeatureShowcaseComponentProps) {
  const [showcaseProject, setShowcaseProject] = useState<any>(null)
  
  useEffect(() => {
    if (data.showcaseProjectId) {
      fetch(`/api/projects/${data.showcaseProjectId}`)
        .then(res => res.json())
        .then(project => setShowcaseProject(project))
        .catch(() => setShowcaseProject(null))
    }
  }, [data.showcaseProjectId])
  
  const showcaseLayout = data.showcaseLayout || 'image-left'
  const showcaseImageSize = data.showcaseImageSize || 'large'
  const showcaseImage = data.showcaseImageUrl || (showcaseProject?.images?.[0]?.originalUrl)
  const showcaseTitle = data.showcaseTitle ? getText(data.showcaseTitle) : showcaseProject?.title
  const showcaseDescription = data.showcaseDescription ? getText(data.showcaseDescription) : showcaseProject?.description
  
  // Parallax effect for showcase images (full-image layout)
  const fullImageParallax = useImageParallax({ 
    enabled: (data.showcaseImageParallax !== false) && showcaseLayout === 'full-image' && !!showcaseImage, // Default to true if not set
    speed: 0.15 // Subtle parallax - image moves at 15% of scroll speed
  })
  
  // Parallax effect for showcase images (side layouts)
  const sideImageParallax = useImageParallax({ 
    enabled: (data.showcaseImageParallax !== false) && showcaseLayout !== 'full-image' && !!showcaseImage, // Default to true if not set
    speed: 0.15 // Subtle parallax - image moves at 15% of scroll speed
  })
  
  const imageSizeClasses = {
    'medium': 'lg:w-1/2',
    'large': 'lg:w-3/5',
    'xlarge': 'lg:w-2/3'
  }
  
  if (showcaseLayout === 'full-image') {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden" data-parallax-container>
        {showcaseImage ? (
          <>
            <div 
              ref={fullImageParallax.ref}
              className="absolute inset-0 overflow-hidden"
              style={fullImageParallax.style}
            >
              <Image
                src={showcaseImage}
                alt={getText(data.showcaseImageAlt) || showcaseTitle || ''}
                fill
                className="object-cover"
                style={{ objectPosition: 'center bottom' }}
                quality={100}
                unoptimized={true}
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8 lg:p-12 z-10">
              <div className="text-center max-w-3xl text-white">
                {data.showcaseSubtitle && (
                  <p className="text-sm uppercase tracking-wider mb-4 text-gray-300">
                    {getText(data.showcaseSubtitle)}
                  </p>
                )}
                {showcaseTitle && (
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                    {showcaseTitle}
                  </h2>
                )}
                {showcaseDescription && (
                  <p className="text-xl mb-8 text-gray-200">
                    {showcaseDescription}
                  </p>
                )}
                {data.showcaseButtonText && (
                  <Link href={data.showcaseButtonLink || `/projects/${data.showcaseProjectId}`}>
                    <Button 
                      size="lg" 
                      className="bg-white text-gray-900 dark:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-100"
                    >
                      {getText(data.showcaseButtonText)}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500">No image selected</p>
          </div>
        )}
      </section>
    )
  }
  
  return (
    <section 
      className={`bg-white dark:bg-[#181818] overflow-hidden ${
        data.padding 
          ? '' 
          : 'py-16 lg:py-24'
      }`}
      style={data.padding ? {
        paddingTop: `${data.padding.top}px`,
        paddingBottom: `${data.padding.bottom}px`,
        paddingLeft: `${data.padding.left}px`,
        paddingRight: `${data.padding.right}px`
      } : {}}
      data-parallax-container
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${
        showcaseLayout === 'image-right' ? 'lg:flex-row-reverse' : 
        showcaseLayout === 'image-top' ? 'lg:flex-col' : 
        'lg:flex-row'
      } gap-8 lg:gap-12 ${showcaseLayout === 'image-top' ? '' : 'lg:items-center'}`}>
        {/* Image */}
        {showcaseImage ? (
          <div className={`relative ${imageSizeClasses[showcaseImageSize]} ${showcaseLayout === 'image-top' ? 'w-full aspect-[16/10] lg:aspect-[16/9]' : 'w-full min-h-[400px] lg:min-h-[500px]'} bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl`}>
            <div 
              ref={sideImageParallax.ref}
              className="absolute inset-0"
              style={sideImageParallax.style}
            >
              <Image
                src={showcaseImage}
                alt={getText(data.showcaseImageAlt) || showcaseTitle || ''}
                fill
                className="object-cover"
                style={{ objectPosition: 'center bottom' }}
                quality={100}
                unoptimized={true}
                priority
              />
            </div>
          </div>
        ) : (
          <div className={`relative ${imageSizeClasses[showcaseImageSize]} ${showcaseLayout === 'image-top' ? 'w-full aspect-[16/10] lg:aspect-[16/9]' : 'w-full min-h-[400px] lg:min-h-[500px]'} bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-2xl`}>
            <p className="text-gray-400 dark:text-gray-500">No image selected</p>
          </div>
        )}
        
        {/* Content */}
        <div className={`flex-1 ${showcaseLayout === 'image-top' ? 'text-center' : ''}`}>
          {data.showcaseSubtitle && (
            <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              {getText(data.showcaseSubtitle)}
            </p>
          )}
          {showcaseTitle && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {showcaseTitle}
            </h2>
          )}
          {showcaseDescription && (
            <div className="text-lg text-gray-600 dark:text-gray-300 mb-8 prose dark:prose-invert max-w-none">
              <p>{showcaseDescription}</p>
            </div>
          )}
          {data.showcaseButtonText && (
            <Link href={data.showcaseButtonLink || `/projects/${data.showcaseProjectId || ''}`}>
              <Button 
                size="lg" 
                variant="outline"
                className="dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:border-white"
              >
                {getText(data.showcaseButtonText)}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

