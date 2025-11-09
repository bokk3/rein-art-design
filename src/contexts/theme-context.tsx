'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark' // The actual theme being applied
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Get the resolved theme (actual light/dark value)
function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

// Apply theme to document
function applyTheme(resolvedTheme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  
  // Set CSS variables - use consistent dark mode color
  if (resolvedTheme === 'dark') {
    document.documentElement.style.setProperty('--background', '#181818')
    document.documentElement.style.setProperty('--foreground', '#ededed')
  } else {
    document.documentElement.style.setProperty('--background', '#ffffff')
    document.documentElement.style.setProperty('--foreground', '#171717')
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    const initTheme = () => {
      try {
        const saved = localStorage.getItem('theme') as Theme | null
        const initial: Theme = saved || 'system'
        
        setThemeState(initial)
        const resolved = getResolvedTheme(initial)
        applyTheme(resolved)
      } catch (error) {
        console.error('Theme init error:', error)
        setThemeState('light')
        applyTheme('light')
      }
      setMounted(true)
    }

    initTheme()
  }, [])

  // Listen to system preference changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light'
      applyTheme(resolved)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  // Apply theme changes
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    
    try {
      localStorage.setItem('theme', newTheme)
      const resolved = getResolvedTheme(newTheme)
      applyTheme(resolved)
    } catch (error) {
      console.error('Theme save error:', error)
    }
  }

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system -> light
    let newTheme: Theme
    if (theme === 'light') {
      newTheme = 'dark'
    } else if (theme === 'dark') {
      newTheme = 'system'
    } else {
      newTheme = 'light'
    }
    setTheme(newTheme)
  }

  const resolvedTheme = getResolvedTheme(theme)

  const value = {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
    mounted
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}