'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollParallaxOptions {
  enabled?: boolean
  speed?: number // Parallax speed multiplier (>1.0 = faster than scroll upward)
}

export function useScrollParallax({ 
  enabled = true, 
  speed = 1.1 // Text moves 1.1x faster than scroll (upward)
}: UseScrollParallaxOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('translateY(0px)')
  const initialScrollYRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setTransform('translateY(0px)')
      initialScrollYRef.current = null
      return
    }

    const element = elementRef.current
    if (!element) return

    let ticking = false
    let rafId: number | null = null

    const updateParallax = () => {
      if (!element) {
        ticking = false
        return
      }

      const scrollY = window.scrollY || window.pageYOffset
      const windowHeight = window.innerHeight
      
      // Get parent hero section to check if it's in viewport
      const parentSection = element.closest('[data-hero-section]')
      if (!parentSection) {
        setTransform('translateY(0px)')
        ticking = false
        return
      }
      
      const parentRect = parentSection.getBoundingClientRect()
      const parentTop = parentRect.top
      const parentBottom = parentRect.bottom
      
      // Initialize scroll position on first render when hero is visible
      if (initialScrollYRef.current === null) {
        if (parentTop < windowHeight && parentBottom > 0) {
          // Hero is in or near viewport - initialize
          initialScrollYRef.current = Math.max(0, scrollY)
        } else {
          // Hero not in viewport yet - no parallax
          setTransform('translateY(0px)')
          ticking = false
          return
        }
      }
      
      // Only apply parallax when hero is in viewport or just above
      if (parentTop > windowHeight * 1.5) {
        // Hero is far below viewport - no parallax
        setTransform('translateY(0px)')
        ticking = false
        return
      }
      
      // Calculate how much we've scrolled since initialization
      const scrollDelta = scrollY - initialScrollYRef.current
      
      // Parallax effect: text moves up faster than scroll
      // Speed of 1.5 means text moves 1.5x the scroll distance upward
      // Since the container moves with scroll naturally, we apply extra upward movement
      // For speed 1.5: (1.5 - 1.0) = 0.5x extra movement upward
      const parallaxOffset = -scrollDelta * (speed - 1.0)
      
      setTransform(`translateY(${parallaxOffset}px)`)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    // Initial calculation
    updateParallax()

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

