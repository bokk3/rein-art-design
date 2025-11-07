'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

interface CookieConsentContextType {
  preferences: CookiePreferences | null
  hasConsent: boolean
  isLoading: boolean
  acceptAll: () => Promise<void>
  rejectAll: () => Promise<void>
  savePreferences: (prefs: CookiePreferences) => Promise<void>
  showBanner: boolean
  setShowBanner: (show: boolean) => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)
  const [hasConsent, setHasConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showBanner, setShowBanner] = useState(false)

  // Generate or retrieve session ID
  const getSessionId = (): string => {
    if (typeof window === 'undefined') return ''
    
    let sessionId = sessionStorage.getItem('cookie_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('cookie_session_id', sessionId)
    }
    return sessionId
  }

  // Load preferences from API
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const sessionId = getSessionId()
        const response = await fetch(`/api/cookie-consent?sessionId=${sessionId}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.preferences) {
            setPreferences(data.preferences)
            setHasConsent(true)
            setShowBanner(false)
          } else {
            // No consent yet, show banner
            setShowBanner(true)
          }
        } else {
          // No consent yet, show banner
          setShowBanner(true)
        }
      } catch (error) {
        console.error('Error loading cookie preferences:', error)
        // On error, show banner to allow user to consent
        setShowBanner(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [])

  const savePreferences = async (prefs: CookiePreferences) => {
    try {
      const sessionId = getSessionId()
      console.log('[Cookie Consent] Saving preferences', { sessionId, prefs })
      const response = await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...prefs,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[Cookie Consent] Preferences saved', { data })
        // Use the saved preferences from the response to ensure consistency
        setPreferences(prefs)
        setHasConsent(true)
        setShowBanner(false)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving cookie preferences:', error)
      throw error
    }
  }

  const acceptAll = async () => {
    await savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
    })
  }

  const rejectAll = async () => {
    await savePreferences({
      essential: true, // Essential cookies are always required
      analytics: false,
      marketing: false,
    })
  }

  return (
    <CookieConsentContext.Provider
      value={{
        preferences,
        hasConsent,
        isLoading,
        acceptAll,
        rejectAll,
        savePreferences,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}

