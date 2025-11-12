'use client'

import { useEffect } from 'react'
import { useTheme } from '@/contexts/theme-context'

/**
 * Dynamically updates the favicon based on the current theme
 * 
 * File naming convention:
 * - Light mode (black icon): /favicon.ico or /favicon-light.ico
 * - Dark mode (white icon): /favicon-dark.ico or /favicon-white.ico
 * 
 * Place your favicon files in the /public directory:
 * - favicon.ico (for light mode - black icon)
 * - favicon-dark.ico (for dark mode - white icon)
 * 
 * Or use:
 * - favicon-light.ico (for light mode)
 * - favicon-white.ico (for dark mode)
 */
export function DynamicFavicon() {
  const { resolvedTheme, mounted } = useTheme()

  useEffect(() => {
    if (!mounted) return

    // Find existing favicon link or create one
    let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    
    if (!faviconLink) {
      faviconLink = document.createElement('link')
      faviconLink.rel = 'icon'
      faviconLink.type = 'image/x-icon'
      document.head.appendChild(faviconLink)
    }

    // Update favicon based on theme
    // Default naming: favicon.ico (light) and favicon-dark.ico (dark)
    if (resolvedTheme === 'dark') {
      // Dark mode: use white favicon
      // Try favicon-dark.ico first, fallback to favicon-white.ico
      faviconLink.href = '/favicon-dark.ico'
    } else {
      // Light mode: use black favicon
      // Use favicon.ico (standard) or favicon-light.ico
      faviconLink.href = '/favicon.ico'
    }
  }, [resolvedTheme, mounted])

  return null
}

