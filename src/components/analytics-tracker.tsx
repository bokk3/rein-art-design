'use client'

import { Suspense } from 'react'
import { useAnalytics } from '@/hooks/use-analytics'

/**
 * Analytics tracker component that automatically tracks page views
 * Only tracks if analytics cookies are consented
 */
function AnalyticsTrackerInner() {
  useAnalytics()
  return null
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  )
}

