'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLanguage } from '@/contexts/language-context'

// Cache for client-side translations
const translationCache = new Map<string, { value: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface UseTranslationOptions {
  fallbackLanguage?: string
  defaultValue?: string
}

/**
 * Hook to get a single translation
 * 
 * @example
 * const t = useTranslation()
 * const submitText = t('button.submit')
 */
export function useTranslation(options: UseTranslationOptions = {}) {
  const { currentLanguage, isLoading: languageLoading } = useLanguage()
  const { fallbackLanguage, defaultValue = '' } = options

  const getTranslation = useCallback(
    async (key: string): Promise<string> => {
      // Check cache first
      const cacheKey = `${key}:${currentLanguage}`
      const cached = translationCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.value
      }

      try {
        const response = await fetch(
          `/api/translations?keys=${encodeURIComponent(key)}&lang=${currentLanguage}${
            fallbackLanguage ? `&fallback=${fallbackLanguage}` : ''
          }`
        )

        if (response.ok) {
          const data = await response.json()
          const value = data[key] || defaultValue || key
          
          // Cache the result
          translationCache.set(cacheKey, { value, timestamp: Date.now() })
          return value
        }
      } catch (error) {
        console.error(`Error fetching translation for key "${key}":`, error)
      }

      return defaultValue || key
    },
    [currentLanguage, fallbackLanguage, defaultValue]
  )

  return getTranslation
}

/**
 * Hook to get multiple translations at once
 * 
 * @example
 * const translations = useTranslations()
 * const texts = await translations(['button.submit', 'button.cancel'])
 */
export function useTranslations(options: UseTranslationOptions = {}) {
  const { currentLanguage, isLoading: languageLoading } = useLanguage()
  const { fallbackLanguage, defaultValue = '' } = options

  const getTranslations = useCallback(
    async (keys: string[]): Promise<Record<string, string>> => {
      if (keys.length === 0) return {}

      // Check cache for all keys
      const results: Record<string, string> = {}
      const keysToFetch: string[] = []

      keys.forEach(key => {
        const cacheKey = `${key}:${currentLanguage}`
        const cached = translationCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          results[key] = cached.value
        } else {
          keysToFetch.push(key)
        }
      })

      // Fetch missing translations
      if (keysToFetch.length > 0) {
        try {
          const response = await fetch(
            `/api/translations?keys=${keysToFetch.map(k => encodeURIComponent(k)).join(',')}&lang=${currentLanguage}${
              fallbackLanguage ? `&fallback=${fallbackLanguage}` : ''
            }`
          )

          if (response.ok) {
            const data = await response.json()
            
            keysToFetch.forEach(key => {
              const value = data[key] || defaultValue || key
              results[key] = value
              
              // Cache the result
              const cacheKey = `${key}:${currentLanguage}`
              translationCache.set(cacheKey, { value, timestamp: Date.now() })
            })
          } else {
            // Fallback to default values
            keysToFetch.forEach(key => {
              results[key] = defaultValue || key
            })
          }
        } catch (error) {
          console.error('Error fetching translations:', error)
          keysToFetch.forEach(key => {
            results[key] = defaultValue || key
          })
        }
      }

      return results
    },
    [currentLanguage, fallbackLanguage, defaultValue]
  )

  return getTranslations
}

/**
 * Hook to get translations synchronously (with loading state)
 * Returns the translation value and loading state
 * 
 * @example
 * const { t, isLoading } = useTranslationSync()
 * return isLoading ? 'Loading...' : t('button.submit')
 */
export function useTranslationSync(
  key: string,
  options: UseTranslationOptions = {}
) {
  const { currentLanguage, isLoading: languageLoading } = useLanguage()
  const { fallbackLanguage, defaultValue = '' } = options
  const [translation, setTranslation] = useState<string>(defaultValue || key)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (languageLoading) return

    const fetchTranslation = async () => {
      setIsLoading(true)
      
      // Check cache first
      const cacheKey = `${key}:${currentLanguage}`
      const cached = translationCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setTranslation(cached.value)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(
          `/api/translations?keys=${encodeURIComponent(key)}&lang=${currentLanguage}${
            fallbackLanguage ? `&fallback=${fallbackLanguage}` : ''
          }`
        )

        if (response.ok) {
          const data = await response.json()
          const value = data[key] || defaultValue || key
          setTranslation(value)
          
          // Cache the result
          translationCache.set(cacheKey, { value, timestamp: Date.now() })
        } else {
          setTranslation(defaultValue || key)
        }
      } catch (error) {
        console.error(`Error fetching translation for key "${key}":`, error)
        setTranslation(defaultValue || key)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranslation()
  }, [key, currentLanguage, fallbackLanguage, defaultValue, languageLoading])

  return { t: translation, isLoading }
}

/**
 * Hook to get multiple translations synchronously
 * 
 * @example
 * const { translations, isLoading } = useTranslationsSync(['button.submit', 'button.cancel'])
 * return isLoading ? 'Loading...' : translations['button.submit']
 */
export function useTranslationsSync(
  keys: string[],
  options: UseTranslationOptions = {}
) {
  const { currentLanguage, isLoading: languageLoading } = useLanguage()
  const { fallbackLanguage, defaultValue = '' } = options
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (languageLoading) return

    const fetchTranslations = async () => {
      setIsLoading(true)

      if (keys.length === 0) {
        setTranslations({})
        setIsLoading(false)
        return
      }

      // Check cache for all keys
      const results: Record<string, string> = {}
      const keysToFetch: string[] = []

      keys.forEach(key => {
        const cacheKey = `${key}:${currentLanguage}`
        const cached = translationCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          results[key] = cached.value
        } else {
          keysToFetch.push(key)
        }
      })

      // Fetch missing translations
      if (keysToFetch.length > 0) {
        try {
          const response = await fetch(
            `/api/translations?keys=${keysToFetch.map(k => encodeURIComponent(k)).join(',')}&lang=${currentLanguage}${
              fallbackLanguage ? `&fallback=${fallbackLanguage}` : ''
            }`
          )

          if (response.ok) {
            const data = await response.json()
            
            keysToFetch.forEach(key => {
              const value = data[key] || defaultValue || key
              results[key] = value
              
              // Cache the result
              const cacheKey = `${key}:${currentLanguage}`
              translationCache.set(cacheKey, { value, timestamp: Date.now() })
            })
          } else {
            // Fallback to default values
            keysToFetch.forEach(key => {
              results[key] = defaultValue || key
            })
          }
        } catch (error) {
          console.error('Error fetching translations:', error)
          keysToFetch.forEach(key => {
            results[key] = defaultValue || key
          })
        }
      }

      setTranslations(results)
      setIsLoading(false)
    }

    fetchTranslations()
  }, [keys.join(','), currentLanguage, fallbackLanguage, defaultValue, languageLoading])

  return { translations, isLoading }
}

/**
 * Clear the translation cache
 * Useful when language changes or translations are updated
 */
export function clearTranslationCache() {
  translationCache.clear()
}

