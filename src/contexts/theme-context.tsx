'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    const initTheme = () => {
      try {
        const saved = localStorage.getItem('theme')
        const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const initial = (saved as Theme) || system
        
        setThemeState(initial)
        document.documentElement.classList.toggle('dark', initial === 'dark')
        
        // Set CSS variables on init
        if (initial === 'dark') {
          document.documentElement.style.setProperty('--background', '#0a0a0a')
          document.documentElement.style.setProperty('--foreground', '#ededed')
        } else {
          document.documentElement.style.setProperty('--background', '#ffffff')
          document.documentElement.style.setProperty('--foreground', '#171717')
        }
        

      } catch (error) {
        console.error('Theme init error:', error)
        setThemeState('light')
      }
      setMounted(true)
    }

    initTheme()
  }, [])

  // Apply theme changes
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    
    try {
      localStorage.setItem('theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      
      // Force CSS variable update
      if (newTheme === 'dark') {
        document.documentElement.style.setProperty('--background', '#0a0a0a')
        document.documentElement.style.setProperty('--foreground', '#ededed')
      } else {
        document.documentElement.style.setProperty('--background', '#ffffff')
        document.documentElement.style.setProperty('--foreground', '#171717')
      }
    } catch (error) {
      console.error('Theme save error:', error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const value = {
    theme,
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