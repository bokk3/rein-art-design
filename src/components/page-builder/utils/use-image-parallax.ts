'use client'

import { useEffect, useRef, useState } from 'react'

interface UseImageParallaxOptions {
  enabled?: boolean
  speed?: number // Parallax speed multiplier (0.2 = moves at 20% of scroll speed)
}

export function useImageParallax({ 
  enabled = true, 
  speed = 0.15 // Image moves at 15% of scroll speed (subtle but visible)
}: UseImageParallaxOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const [transform, setTransform] = useState('translateY(0px) scale(1.35)')
  const initialScrollYRef = useRef<number | null>(null)
  const containerEnteredViewportRef = useRef<boolean>(false)

  useEffect(() => {
    if (!enabled) {
      setTransform('translateY(0px) scale(1.35)')
      initialScrollYRef.current = null
      containerEnteredViewportRef.current = false
      return
    }

    const element = elementRef.current
    if (!element) return

    // Find parent container - prioritize data-parallax-container, then section, then relative container
    // For feature-showcase side layouts, we need to go up to the section, not the inner relative div
    let parent: HTMLElement | null = element.parentElement
    let container: HTMLElement | null = null
    
    // First, look for data-parallax-container attribute (most reliable)
    while (parent) {
      if (parent.hasAttribute('data-parallax-container')) {
        container = parent
        break
      }
      parent = parent.parentElement
    }
    
    // If not found, look for section tag
    if (!container) {
      parent = element.parentElement
      while (parent) {
        if (parent.tagName === 'SECTION') {
          container = parent
          break
        }
        parent = parent.parentElement
      }
    }
    
    // If still not found, find the nearest relative container
    if (!container) {
      parent = element.parentElement
      while (parent && !parent.classList.contains('relative') && parent.tagName !== 'SECTION') {
        parent = parent.parentElement
      }
      container = parent || element.parentElement
    }
    
    containerRef.current = container

    let ticking = false
    let rafId: number | null = null

    const updateParallax = () => {
      if (!element || !containerRef.current) {
        ticking = false
        return
      }

      const scrollY = window.scrollY || window.pageYOffset
      const windowHeight = window.innerHeight
      
      const containerRect = containerRef.current.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerBottom = containerRect.bottom
      const containerHeight = containerRect.height
      
      // Check if container is in viewport
      const isVisible = containerBottom >= 0 && containerTop <= windowHeight
      
      // Initialize scroll position when container enters viewport
      if (isVisible && !containerEnteredViewportRef.current) {
        initialScrollYRef.current = scrollY
        containerEnteredViewportRef.current = true
      }
      
      if (!isVisible) {
        // Container not in viewport - reset
        if (containerTop > windowHeight) {
          // Container below viewport - reset state
          setTransform('translateY(0px) scale(1.35)')
          initialScrollYRef.current = null
          containerEnteredViewportRef.current = false
        } else {
          // Container above viewport - keep last parallax state or reset
          setTransform('translateY(0px) scale(1.35)')
        }
        ticking = false
        return
      }
      
      // Scale image to 135% to provide extra image area (17.5% on each side)
      const imageScale = 1.35
      
      // Calculate maximum parallax movement (17.5% of container height)
      const maxMovement = containerHeight * 0.175
      
      // Calculate scroll delta from when container entered viewport
      const scrollDelta = initialScrollYRef.current !== null 
        ? scrollY - initialScrollYRef.current 
        : 0
      
      // Parallax: image moves up (negative translateY) as user scrolls down
      // Speed controls how much the image moves relative to scroll
      // As scroll increases, parallaxOffset becomes more negative (image moves up)
      let parallaxOffset = -scrollDelta * speed
      
      // Calculate container's progress through viewport to create smooth start/stop
      // When container is at bottom of viewport: reduce parallax
      // When container is at top of viewport: parallax at max
      const containerCenter = containerTop + containerHeight / 2
      const viewportCenter = windowHeight / 2
      const distanceFromCenter = Math.abs(containerCenter - viewportCenter) / (windowHeight / 2)
      
      // Reduce parallax at edges for smoother transitions
      // When container is centered: full parallax
      // When container is at edges: reduced parallax
      const edgeFactor = Math.max(0.5, 1 - distanceFromCenter * 0.3)
      parallaxOffset = parallaxOffset * edgeFactor
      
      // Clamp to ensure we don't exceed bounds
      // Minimum: 0 (image bottom at container bottom, initial state)
      // Maximum: -maxMovement (image top at container top, parallax stops)
      const clampedOffset = Math.max(-maxMovement, Math.min(0, parallaxOffset))
      
      setTransform(`translateY(${clampedOffset}px) scale(${imageScale})`)
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

