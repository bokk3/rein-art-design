'use client'

import { useEffect, useRef, useState } from 'react'

interface UseParallaxOptions {
  speed?: number // Parallax speed multiplier (0.1 = subtle, 0.15 = medium)
  enabled?: boolean // Enable/disable parallax
}

export function useParallax({ speed = 0.12, enabled = true }: UseParallaxOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('translateY(0px)')

  useEffect(() => {
    if (!enabled) {
      setTransform('translateY(0px)')
      return
    }

    const element = elementRef.current
    if (!element) return

    let ticking = false
    let rafId: number | null = null

    const updateTransform = () => {
      if (!element) {
        ticking = false
        return
      }

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Check if element is in viewport
      const isVisible = rect.bottom >= 0 && rect.top <= windowHeight
      
      if (!isVisible) {
        setTransform('translateY(0px)')
        ticking = false
        return
      }

      // Calculate parallax offset - subtle depth effect
      // Standard parallax: image moves slower than scroll
      
      const elementTop = rect.top
      const elementHeight = rect.height
      const elementCenter = elementTop + elementHeight / 2
      const viewportCenter = windowHeight / 2
      
      // Distance from viewport center (in viewport coordinates)
      // Positive = below center, negative = above center
      const distanceFromCenter = elementCenter - viewportCenter
      
      // Apply parallax transform
      // Speed of 0.12 means image moves 12% of the distance from center
      // This creates a subtle depth effect
      let parallaxOffset = distanceFromCenter * speed
      
      // Normalize by viewport height for consistent effect across screen sizes
      parallaxOffset = (parallaxOffset / windowHeight) * 100
      
      // Limit movement for subtle, elegant effect
      const clampedOffset = Math.max(-25, Math.min(25, parallaxOffset))
      
      setTransform(`translateY(${clampedOffset}px)`)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(updateTransform)
        ticking = true
      }
    }

    // Initial calculation
    updateTransform()

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [enabled, speed])

  return {
    ref: elementRef,
    style: {
      transform,
      willChange: enabled ? 'transform' : 'auto'
    } as React.CSSProperties
  }
}

