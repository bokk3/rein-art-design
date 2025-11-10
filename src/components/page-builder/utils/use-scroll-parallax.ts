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
        initialScrollYRef.current = null
        ticking = false
        return
      }
      
      const parentRect = parentSection.getBoundingClientRect()
      const parentTop = parentRect.top
      const parentBottom = parentRect.bottom
      const parentHeight = parentRect.height
      
      // Check if hero is in viewport
      const isInViewport = parentTop < windowHeight && parentBottom > 0
      
      // Reset initialization if hero is far above viewport (scrolled back up past it)
      if (parentBottom < -windowHeight * 0.5) {
        // Hero is far above viewport - reset
        initialScrollYRef.current = null
        setTransform('translateY(0px)')
        ticking = false
        return
      }
      
      // Only apply parallax when hero is in or near viewport
      if (!isInViewport && parentTop > windowHeight * 1.5) {
        // Hero is far below viewport - no parallax
        setTransform('translateY(0px)')
        ticking = false
        return
      }
      
      // Calculate parallax based on hero's position relative to viewport
      // Use parentTop directly - when it's 0, hero is at top of viewport (no parallax)
      // As we scroll down, parentTop becomes negative, parallax increases (text moves up)
      // As we scroll up, parentTop becomes positive, parallax decreases (text moves down)
      
      if (isInViewport) {
        // Calculate parallax based on how far hero top is from viewport top
        // parentTop = 0 means hero top is at viewport top (baseline, no parallax)
        // parentTop < 0 means we've scrolled down (hero moved up), apply upward parallax
        // parentTop > 0 means hero is below viewport top (scrolled up), apply downward parallax
        
        // Initialize reference when hero first enters viewport from above
        // If hero is already visible on load, use current parentTop as baseline
        if (initialScrollYRef.current === null) {
          // Store the scroll position when hero top reaches viewport top
          // This happens when parentTop = 0, so we calculate: scrollY - parentTop
          initialScrollYRef.current = scrollY - parentTop
        }
        
        // Calculate how much we've scrolled since hero was at viewport top
        // When hero top is at viewport top: scrollDelta = 0 (no parallax)
        // As we scroll down: scrollDelta increases (positive), parallax moves text up
        // As we scroll up: scrollDelta decreases (negative), parallax moves text down
        const scrollDelta = scrollY - initialScrollYRef.current
        
        // Only apply parallax when scrolling down (positive scrollDelta)
        // When scrolling up (negative scrollDelta), reset to prevent text going too low
        if (scrollDelta >= 0) {
          // Parallax effect: text moves up faster than scroll
          // Speed of 1.5 means text moves 1.5x the scroll distance upward
          // Since the container moves with scroll naturally, we apply extra upward movement
          // For speed 1.5: (1.5 - 1.0) = 0.5x extra movement upward
          const parallaxOffset = -scrollDelta * (speed - 1.0)
          setTransform(`translateY(${parallaxOffset}px)`)
        } else {
          // Scrolled back up past initial position - reset parallax
          setTransform('translateY(0px)')
          // Reset initialization so it recalculates when scrolling down again
          initialScrollYRef.current = scrollY - parentTop
        }
      } else {
        // Hero not in viewport - reset parallax
        setTransform('translateY(0px)')
        // Reset initialization when hero is far from viewport so it recalculates on re-entry
        if (parentBottom < -windowHeight * 0.5 || parentTop > windowHeight * 1.5) {
          initialScrollYRef.current = null
        }
      }
      
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

