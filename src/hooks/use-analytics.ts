'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCookieConsent } from '@/contexts/cookie-consent-context'

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('cookie_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('cookie_session_id', sessionId)
  }
  return sessionId
}

/**
 * Track page view
 */
async function trackPageView(path: string, title?: string) {
  try {
    const sessionId = getSessionId()
    const referrer = document.referrer || null
    
    console.log('[Analytics Hook] Calling track API', { path, sessionId })
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        pagePath: path,
        pageTitle: title || document.title,
        referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        eventType: 'pageview',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Analytics Hook] Track API error', { status: response.status, error: errorData })
    } else {
      console.log('[Analytics Hook] Track API success')
    }
  } catch (error) {
    // Log error but don't break user experience
    console.error('[Analytics Hook] Analytics tracking error:', error)
  }
}

/**
 * Track custom event
 */
export async function trackEvent(
  eventType: string,
  metadata?: Record<string, any>
) {
  try {
    const sessionId = getSessionId()
    const referrer = document.referrer || null
    
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        pagePath: window.location.pathname,
        pageTitle: document.title,
        referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        eventType,
        metadata,
      }),
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
  }
}

/**
 * Hook to automatically track page views
 */
export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { preferences } = useCookieConsent()

  useEffect(() => {
    // Only track if analytics consent is given
    if (!preferences?.analytics) {
      console.log('[Analytics] Not tracking - analytics consent not given', { preferences })
      return
    }

    console.log('[Analytics] Tracking page view', { pathname, preferences })

    // Small delay to ensure page title is set
    const timeoutId = setTimeout(() => {
      // Track page view
      const queryString = searchParams?.toString()
      const fullPath = pathname + (queryString ? `?${queryString}` : '')
      const title = document.title
      console.log('[Analytics] Sending pageview', { fullPath, title, sessionId: getSessionId() })
      trackPageView(fullPath, title)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [pathname, searchParams, preferences?.analytics])

  return {
    trackEvent,
  }
}

