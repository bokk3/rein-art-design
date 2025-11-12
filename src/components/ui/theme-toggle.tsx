'use client'

import { useTheme } from '@/contexts/theme-context'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from './button'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme, mounted } = useTheme()
  const [isHydrated, setIsHydrated] = useState(false)

  // Mark as hydrated after first client render to prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Use a safe default for SSR - always light to match server render
  // This ensures className is consistent between server and client
  const safeResolvedTheme = isHydrated ? resolvedTheme : 'light'
  const safeTheme = isHydrated ? theme : 'light'

  const getAriaLabel = () => {
    if (safeTheme === 'system') return 'Switch theme (currently: system)'
    if (safeTheme === 'light') return 'Switch to dark mode'
    return 'Switch to light mode'
  }

  // Always use the same aria-label during SSR to prevent hydration mismatch
  const ariaLabel = isHydrated ? getAriaLabel() : 'Switch theme'

  // Always render both icons with consistent classNames
  // During SSR and first render, both use light mode classes (sun visible, moon hidden)
  // After hydration, they update based on actual theme
  const sunClassName = `absolute inset-0 w-5 h-5 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
    safeResolvedTheme === 'light' 
      ? 'rotate-0 scale-100 opacity-100' 
      : 'rotate-90 scale-0 opacity-0'
  }`
  
  const moonClassName = `absolute inset-0 w-5 h-5 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
    safeResolvedTheme === 'dark' 
      ? 'rotate-0 scale-100 opacity-100' 
      : '-rotate-90 scale-0 opacity-0'
  }`

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={mounted ? toggleTheme : undefined}
      className="relative w-10 h-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
      aria-label={ariaLabel}
      disabled={!mounted}
      suppressHydrationWarning
    >
      <div className="relative w-5 h-5" suppressHydrationWarning>
        {/* Sun Icon - visible in light mode */}
        <Sun 
          className={sunClassName}
          suppressHydrationWarning
        />
        
        {/* Moon Icon - visible in dark mode */}
        <Moon 
          className={moonClassName}
          suppressHydrationWarning
        />
      </div>
    </Button>
  )
}