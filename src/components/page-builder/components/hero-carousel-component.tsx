'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ComponentData } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { getText } from '../utils/text-helpers'
import { useImageParallax } from '../utils/use-image-parallax'

interface HeroCarouselComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
  currentLanguage: string
}

interface HeroCarouselImageProps {
  image: { id: string; src: string; alt: { [key: string]: string } }
  isActive: boolean
  parallaxEnabled: boolean
  kenBurnsEnabled: boolean
  getText: (text: string | { [key: string]: string } | undefined) => string
  priority: boolean
}

function HeroCarouselImage({ image, isActive, parallaxEnabled, kenBurnsEnabled, getText, priority }: HeroCarouselImageProps) {
  const imageParallax = useImageParallax({
    enabled: parallaxEnabled,
    speed: 0.15
  })

  // For carousel, remove the scale from parallax transform to prevent zooming
  const parallaxStyle = parallaxEnabled && imageParallax.style
    ? {
        ...imageParallax.style,
        transform: imageParallax.style.transform?.replace(/scale\([^)]+\)/g, 'scale(1)') || 'translateY(0px) scale(1)'
      }
    : undefined

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
      ref={parallaxEnabled ? imageParallax.ref : null}
      style={parallaxStyle}
    >
      <div
        className={`absolute inset-0 ${
          kenBurnsEnabled ? 'animate-ken-burns' : ''
        }`}
      >
        <Image
          src={image.src}
          alt={getText(image.alt) || ''}
          fill
          className="object-cover"
          priority={priority}
          unoptimized={image.src.startsWith('http://') || image.src.startsWith('https://')}
          style={{ objectPosition: 'center center' }}
        />
      </div>
    </div>
  )
}

export function HeroCarouselComponent({ data, getText, currentLanguage }: HeroCarouselComponentProps) {
  const images = data.heroCarouselImages || []
  const autoPlay = data.heroCarouselAutoPlay !== false // Default to true
  const interval = data.heroCarouselInterval || 5000
  const showDots = data.heroCarouselShowDots !== false // Default to true
  const showArrows = data.heroCarouselShowArrows !== false // Default to true
  const parallaxEnabled = data.heroCarouselParallax !== false // Default to true
  const kenBurnsEnabled = data.heroCarouselKenBurns !== false // Default to true
  const overlayOpacity = data.heroCarouselOverlayOpacity !== undefined ? data.heroCarouselOverlayOpacity : 40

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Preload next image
  useEffect(() => {
    if (images.length > 0) {
      const nextIndex = (currentIndex + 1) % images.length
      const nextImage = images[nextIndex]
      if (nextImage?.src) {
        const img = new window.Image()
        img.src = nextImage.src
      }
    }
  }, [currentIndex, images])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused || images.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoPlay, isPaused, images.length, interval])

  // Navigation callbacks - defined before useEffect that uses them
  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [images.length, isTransitioning])

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [images.length, isTransitioning])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [currentIndex, isTransitioning])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext])

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  if (images.length === 0) {
    return (
      <section className="relative w-screen h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">No images in carousel</p>
      </section>
    )
  }

  const currentImage = images[currentIndex]

  return (
    <section
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
      data-parallax-container
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero image carousel"
      role="region"
    >
      {/* Image Container with Fade Transition */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <HeroCarouselImage
            key={image.id || index}
            image={image}
            isActive={index === currentIndex}
            parallaxEnabled={parallaxEnabled && index === currentIndex}
            kenBurnsEnabled={kenBurnsEnabled && index === currentIndex}
            getText={getText}
            priority={index === 0}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {data.heroCarouselTitle && (
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up">
              {getText(data.heroCarouselTitle)}
            </h1>
          )}
          {data.heroCarouselSubtitle && (
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-8 sm:mb-12 font-light animate-fade-in-up-delay">
              {getText(data.heroCarouselSubtitle)}
            </p>
          )}
          {data.heroCarouselButtonText && (
            <div className="animate-fade-in-up-delay-2">
              <Link href={data.heroCarouselButtonLink || '/projects'}>
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {getText(data.heroCarouselButtonText)}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows - Simple <> style */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 text-white text-4xl sm:text-5xl font-light hover:opacity-80 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            aria-label="Previous image"
          >
            &lt;
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 text-white text-4xl sm:text-5xl font-light hover:opacity-80 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            aria-label="Next image"
          >
            &gt;
          </button>
        </>
      )}

      {/* Bottom Text Overlay */}
      {data.heroCarouselBottomText && (
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-40 text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white animate-fade-in-up-delay-2">
            {getText(data.heroCarouselBottomText)}
          </h2>
        </div>
      )}

      {/* Navigation Dots */}
      {showDots && images.length > 1 && (
        <div className={`absolute left-1/2 -translate-x-1/2 z-40 flex gap-2 sm:gap-3 ${data.heroCarouselBottomText ? 'bottom-16 sm:bottom-20' : 'bottom-16 sm:bottom-20'}`} role="tablist" aria-label="Carousel navigation">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === currentIndex
                  ? 'w-8 sm:w-10 h-3 sm:h-4 bg-white'
                  : 'w-3 sm:w-4 h-3 sm:h-4 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator - Animated arrow showing you can scroll down */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 animate-bounce">
        <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
      </div>
    </section>
  )
}

