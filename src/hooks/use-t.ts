'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'

// Cache for client-side translations
const translationCache = new Map<string, { value: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Batch fetch queue to avoid multiple requests
let batchQueue: Set<string> = new Set()
let batchTimeout: NodeJS.Timeout | null = null
const BATCH_DELAY = 10 // ms - small delay to batch requests

interface UseTOptions {
  fallbackLanguage?: string
  defaultValue?: string
}

/**
 * Simple translation hook that returns a `t` function
 * Returns the translation synchronously (from cache or fetches)
 * 
 * @example
 * const { t } = useT()
 * return <button>{t('button.submit')}</button>
 */
export function useT(options: UseTOptions = {}) {
  const { currentLanguage, isLoading: languageLoading } = useLanguage()
  const { fallbackLanguage, defaultValue = '' } = options
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set())
  const [languageVersion, setLanguageVersion] = useState(0) // Force re-render on language change
  const pendingKeysRef = useRef<Set<string>>(new Set())
  const previousLanguageRef = useRef<string>(currentLanguage)

  // Batch fetch translations for multiple keys
  const batchFetchTranslations = useCallback(
    async (keys: string[]) => {
      if (keys.length === 0) return

      try {
        const response = await fetch(
          `/api/translations?keys=${keys.map(k => encodeURIComponent(k)).join(',')}&lang=${currentLanguage}${
            fallbackLanguage ? `&fallback=${fallbackLanguage}` : ''
          }`
        )

        if (response.ok) {
          const data = await response.json()
          const updates: Record<string, string> = {}
          
          keys.forEach(key => {
            const value = data[key] || defaultValue || key
            updates[key] = value
            
            // Cache the result
            const cacheKey = `${key}:${currentLanguage}`
            translationCache.set(cacheKey, { value, timestamp: Date.now() })
          })
          
          // Update state
          setTranslations(prev => ({ ...prev, ...updates }))
          
          // Clear from pending
          keys.forEach(key => pendingKeysRef.current.delete(key))
          setLoadingKeys(prev => {
            const next = new Set(prev)
            keys.forEach(key => next.delete(key))
            return next
          })
        } else {
          // Fallback to defaults
          const updates: Record<string, string> = {}
          keys.forEach(key => {
            updates[key] = defaultValue || key
            pendingKeysRef.current.delete(key)
          })
          setTranslations(prev => ({ ...prev, ...updates }))
          setLoadingKeys(prev => {
            const next = new Set(prev)
            keys.forEach(key => next.delete(key))
            return next
          })
        }
      } catch (error) {
        console.error(`Error fetching translations:`, error)
        // Fallback to defaults
        const updates: Record<string, string> = {}
        keys.forEach(key => {
          updates[key] = defaultValue || key
          pendingKeysRef.current.delete(key)
        })
        setTranslations(prev => ({ ...prev, ...updates }))
        setLoadingKeys(prev => {
          const next = new Set(prev)
          keys.forEach(key => next.delete(key))
          return next
        })
      }
    },
    [currentLanguage, fallbackLanguage, defaultValue]
  )

  // Fetch translation for a key (adds to batch queue)
  const fetchTranslation = useCallback(
    (key: string) => {
      if (loadingKeys.has(key) || pendingKeysRef.current.has(key)) return // Already loading or pending

      pendingKeysRef.current.add(key)
      setLoadingKeys(prev => new Set(prev).add(key))

      // Add to batch queue
      batchQueue.add(key)

      // Clear existing timeout
      if (batchTimeout) {
        clearTimeout(batchTimeout)
      }

      // Set new timeout for batch fetch
      batchTimeout = setTimeout(() => {
        const keysToFetch = Array.from(batchQueue)
        batchQueue.clear()
        if (keysToFetch.length > 0) {
          batchFetchTranslations(keysToFetch)
        }
      }, BATCH_DELAY)
    },
    [loadingKeys, batchFetchTranslations]
  )

  // Clear translations when language changes
  useEffect(() => {
    const previousLanguage = previousLanguageRef.current
    
    // Only clear if language actually changed
    if (previousLanguage !== currentLanguage) {
      // Clear state to force re-render
      setTranslations({})
      pendingKeysRef.current.clear()
      setLoadingKeys(new Set())
      
      // Increment version to force t() callback to be recreated
      // This ensures components using t() will re-render
      setLanguageVersion(prev => prev + 1)
      
      // Don't delete cache entries immediately - keep them as fallback
      // They'll be cleaned up by TTL naturally
      previousLanguageRef.current = currentLanguage
    }

    // Pre-fetch common translations for the new language
    if (!languageLoading && currentLanguage) {
      const commonKeys = [
        'nav.home', 'nav.projects', 'nav.about', 'nav.contact',
        'footer.brand', 'footer.navigation', 'footer.legal',
        'button.submit', 'button.cancel', 'button.save',
        'admin.dashboard', 'admin.projects', 'admin.content',
        'projects.backToProjects', 'projects.title', 'projects.subtitle'
      ]
      
      // Filter out keys that are already cached
      const keysToFetch = commonKeys.filter(key => {
        const cacheKey = `${key}:${currentLanguage}`
        const cached = translationCache.get(cacheKey)
        return !cached || Date.now() - cached.timestamp >= CACHE_TTL
      })

      if (keysToFetch.length > 0) {
        // Pre-fetch in background
        fetch(`/api/translations?keys=${keysToFetch.join(',')}&lang=${currentLanguage}`)
          .then(res => res.json())
          .then(data => {
            // Populate cache
            keysToFetch.forEach(key => {
              if (data[key]) {
                const cacheKey = `${key}:${currentLanguage}`
                translationCache.set(cacheKey, { value: data[key], timestamp: Date.now() })
                // Also update state so components re-render
                setTranslations(prev => ({ ...prev, [key]: data[key] }))
              }
            })
          })
          .catch(err => console.error('Error pre-fetching translations:', err))
      }
    }
  }, [currentLanguage, languageLoading])

  const t = useCallback(
    (key: string): string => {
      // Check cache first (synchronous, no flash)
      const cacheKey = `${key}:${currentLanguage}`
      const cached = translationCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.value
      }

      // Check if we have it in state for current language
      if (translations[key]) {
        return translations[key]
      }

      // Fetch immediately if not loading
      if (!loadingKeys.has(key) && !pendingKeysRef.current.has(key) && !languageLoading) {
        fetchTranslation(key)
      }
      
      // If language is loading, use fallback to prevent flash
      if (languageLoading) {
        // Try to get from any available language cache as fallback (prevents flash)
        // First try default language, then previous language, then any cached version
        const fallbackLanguages = ['nl', previousLanguageRef.current].filter(
          (lang, index, arr) => lang && arr.indexOf(lang) === index && lang !== currentLanguage
        )
        
        for (const fallbackLang of fallbackLanguages) {
          const fallbackCacheKey = `${key}:${fallbackLang}`
          const fallbackCached = translationCache.get(fallbackCacheKey)
          if (fallbackCached && Date.now() - fallbackCached.timestamp < CACHE_TTL) {
            return fallbackCached.value
          }
        }
        
        // Also try any cached version of this key (from any language) as last resort
        for (const [cacheKey, cached] of translationCache.entries()) {
          if (cacheKey.startsWith(`${key}:`) && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.value
          }
        }
      }
      
      // If we just changed languages and don't have the translation yet,
      // return the key to force a re-render (component will update when translation loads)
      // This ensures the component shows something different, triggering React to re-render

      // Return key or defaultValue - this will trigger a re-render when language changes
      // The translation will update once it's fetched
      return defaultValue || key
    },
    [currentLanguage, translations, loadingKeys, languageLoading, defaultValue, fetchTranslation, languageVersion]
  )

  return { t, isLoading: languageLoading }
}

/**
 * Synchronous version that returns the translation value directly
 * Use this in components that need the translation immediately
 * 
 * @example
 * const t = useTSync('button.submit')
 * return <button>{t}</button>
 */
export function useTSync(key: string, options: UseTOptions = {}) {
  const { currentLanguage, isLoading: languageLoading } = useLanguage()
  const { fallbackLanguage, defaultValue = '' } = options
  const [translation, setTranslation] = useState<string>(defaultValue || key)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (languageLoading) {
      setIsLoading(true)
      return
    }

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

