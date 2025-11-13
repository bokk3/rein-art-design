'use client'

import React, { useState, useEffect } from 'react'
import { ComponentData } from '@/types/page-builder'
import Image from 'next/image'

interface GalleryShowcaseComponentProps {
  data: ComponentData
  isEditing?: boolean
}

export function GalleryShowcaseComponent({ data, isEditing = false }: GalleryShowcaseComponentProps) {
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
            quality={100}
            unoptimized={true}
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
}

