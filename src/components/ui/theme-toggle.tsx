'use client'

import { useTheme } from '@/contexts/theme-context'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from './button'

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme, mounted } = useTheme()

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="relative w-10 h-10 p-0 rounded-full opacity-50"
        disabled
      >
        <div className="w-5 h-5" />
      </Button>
    )
  }

  const getAriaLabel = () => {
    if (theme === 'system') return 'Switch theme (currently: system)'
    if (theme === 'light') return 'Switch to dark mode'
    return 'Switch to light mode'
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-10 h-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
      aria-label={getAriaLabel()}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon - visible in light mode */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
            resolvedTheme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        
        {/* Moon Icon - visible in dark mode */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
            resolvedTheme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </Button>
  )
}