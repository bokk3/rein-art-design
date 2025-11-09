'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollFadeOptions {
  enabled?: boolean
  fadeStart?: number // Percentage of viewport height to start fading (0-1)
  fadeEnd?: number // Percentage of viewport height to complete fade (0-1)
}

export function useScrollFade({ 
  enabled = true, 
  fadeStart = 0.3, // Start fading when 30% of viewport is scrolled
  fadeEnd = 0.7 // Complete fade when 70% of viewport is scrolled
}: UseScrollFadeOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useState(1)
  const [transform, setTransform] = useState('translateY(0px)')

  useEffect(() => {
    if (!enabled) {
      setOpacity(1)
      setTransform('translateY(0px)')
      return
    }

    const element = elementRef.current
    if (!element) return

    let ticking = false
    let rafId: number | null = null

    const updateFade = () => {
      if (!element) {
        ticking = false
        return
      }

      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      
      // Fade out when scrolling away from hero (element leaving viewport from top)
      // fadeStart: when to start fading (e.g., 0.8 = when element top is at 80% of viewport height)
      // fadeEnd: when to complete fade (e.g., 0.3 = when element top is at 30% of viewport height)
      
      const fadeStartPx = windowHeight * fadeStart
      const fadeEndPx = windowHeight * fadeEnd
      
      let fadeOpacity = 1
      let parallaxOffset = 0
      
      // When element is below fadeStart threshold, it's fully visible
      if (elementTop >= fadeStartPx) {
        fadeOpacity = 1
        parallaxOffset = 0
      } 
      // When element is between fadeStart and fadeEnd, fade it out
      else if (elementTop > fadeEndPx) {
        const fadeRange = fadeStartPx - fadeEndPx
        const distanceFromStart = fadeStartPx - elementTop
        const fadeProgress = distanceFromStart / fadeRange
        fadeOpacity = Math.max(0, 1 - fadeProgress)
        parallaxOffset = fadeProgress * -25 // Move up to 25px as it fades
      }
      // When element is above fadeEnd threshold, it's fully faded
      else {
        fadeOpacity = 0
        parallaxOffset = -25
      }
      
      setOpacity(fadeOpacity)
      setTransform(`translateY(${parallaxOffset}px)`)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(updateFade)
        ticking = true
      }
    }

    // Initial calculation
    updateFade()

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
  }, [enabled, fadeStart, fadeEnd])

  return {
    ref: elementRef,
    style: {
      opacity,
      transform,
      transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
    } as React.CSSProperties
  }
}

