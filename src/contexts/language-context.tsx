'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
}

interface LanguageContextType {
  currentLanguage: string
  languages: Language[]
  setLanguage: (code: string) => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('nl')
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages')
        if (response.ok) {
          const langs = await response.json()
          setLanguages(langs)
          
          // Set current language from URL or default
          const langParam = searchParams.get('lang')
          if (langParam && langs.some((l: Language) => l.code === langParam)) {
            setCurrentLanguage(langParam)
          } else {
            const defaultLang = langs.find((l: Language) => l.isDefault)
            setCurrentLanguage(defaultLang?.code || 'nl')
          }
        }
      } catch (error) {
        console.error('Error fetching languages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLanguages()
  }, [searchParams])

  // Update language when URL parameter changes (e.g., browser back/forward)
  useEffect(() => {
    if (languages.length === 0) return
    
    const langParam = searchParams.get('lang')
    if (langParam && languages.some((l: Language) => l.code === langParam)) {
      if (currentLanguage !== langParam) {
        setCurrentLanguage(langParam)
      }
    } else {
      const defaultLang = languages.find((l: Language) => l.isDefault)
      if (defaultLang && currentLanguage !== defaultLang.code) {
        // Only reset to default if there's no lang param
        if (!langParam) {
          setCurrentLanguage(defaultLang.code)
        }
      }
    }
  }, [searchParams, languages, currentLanguage])

  const setLanguage = (code: string) => {
    // Update state first so components can react immediately
    setCurrentLanguage(code)
    
    // Update URL with language parameter
    const url = new URL(window.location.href)
    const defaultLang = languages.find(l => l.isDefault)
    
    if (code === defaultLang?.code) {
      // Remove lang parameter for default language
      url.searchParams.delete('lang')
    } else {
      // Set lang parameter for non-default languages
      url.searchParams.set('lang', code)
    }
    
    // Use replace instead of push to avoid adding to history and prevent full page reload
    // This ensures client-side navigation without page refresh
    router.replace(url.pathname + url.search, { scroll: false })
  }


  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      languages,
      setLanguage,
      isLoading
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}