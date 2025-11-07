import { prisma } from './db'

export interface AnalyticsEventData {
  sessionId: string
  pagePath: string
  pageTitle?: string
  referrer?: string | null
  userAgent?: string | null
  language?: string
  country?: string
  eventType?: string
  metadata?: Record<string, any>
  ipAddress?: string | null
}

/**
 * Check if a path is an admin path (should be excluded from analytics)
 */
function isAdminPath(path: string): boolean {
  return path.startsWith('/admin')
}

/**
 * Filter out admin paths from an array of page paths
 */
function filterAdminPaths<T extends { path: string }>(pages: T[]): T[] {
  return pages.filter(page => !isAdminPath(page.path))
}

/**
 * Track an analytics event
 * Only tracks if analytics cookies are consented
 * Excludes admin pages from tracking
 */
export async function trackEvent(data: AnalyticsEventData): Promise<void> {
  try {
    // Skip tracking for admin pages
    if (isAdminPath(data.pagePath)) {
      console.log('[Analytics Service] Skipping admin page', { pagePath: data.pagePath })
      return
    }

    // Check if analytics consent is given
    const consent = await prisma.cookieConsent.findUnique({
      where: { sessionId: data.sessionId },
    })

    console.log('[Analytics Service] Checking consent', { 
      sessionId: data.sessionId, 
      hasConsent: !!consent, 
      analytics: consent?.analytics 
    })

    // Only track if analytics consent is given
    if (!consent?.analytics) {
      console.log('[Analytics Service] Not tracking - no analytics consent', { sessionId: data.sessionId })
      return
    }

    // Check if Prisma client has analyticsEvent model (might not be regenerated yet)
    if (!(prisma as any).analyticsEvent) {
      console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
      return
    }

    // Check if analytics_events table exists (Prisma client might not be regenerated yet)
    try {
      console.log('[Analytics Service] Creating analytics event', { pagePath: data.pagePath })
      await (prisma as any).analyticsEvent.create({
      data: {
        sessionId: data.sessionId,
        pagePath: data.pagePath,
        pageTitle: data.pageTitle,
        referrer: data.referrer || null,
        userAgent: data.userAgent || null,
        language: data.language,
        country: data.country,
        eventType: data.eventType || 'pageview',
        metadata: data.metadata || {},
        ipAddress: data.ipAddress || null,
      },
    })
      console.log('[Analytics Service] Event tracked successfully')
    } catch (dbError: any) {
      // Check if it's a "table doesn't exist" error
      if (dbError?.code === '42P01' || dbError?.message?.includes('does not exist')) {
        console.warn('[Analytics Service] Analytics table does not exist yet. Run: npx prisma db push && npx prisma generate')
      } else {
        throw dbError
      }
    }
  } catch (error) {
    // Silently fail analytics - don't break the user experience
    console.error('Analytics tracking error:', error)
  }
}

/**
 * Get analytics statistics
 */
export interface AnalyticsStats {
  totalPageViews: number
  uniqueVisitors: number
  popularPages: Array<{ path: string; views: number }>
  recentEvents: Array<{
    id: string
    pagePath: string
    pageTitle?: string
    createdAt: Date
  }>
  viewsByDay: Array<{ date: string; views: number }>
  viewsByPage: Array<{ path: string; views: number }>
}

export async function getAnalyticsStats(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsStats> {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default: last 30 days
  const end = endDate || new Date()

  // Return empty stats if there's an error (e.g., table doesn't exist yet)
  const emptyStats: AnalyticsStats = {
    totalPageViews: 0,
    uniqueVisitors: 0,
    popularPages: [],
    recentEvents: [],
    viewsByDay: [],
    viewsByPage: [],
  }

  // Check if Prisma client has analyticsEvent model
  if (!(prisma as any).analyticsEvent) {
    console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
    return emptyStats
  }

  try {
    // Base filter for all queries (excluding admin pages)
    // Note: Prisma doesn't support "not startsWith" directly, so we filter in memory for arrays
    // and use a workaround for counts
    const baseWhere = {
      createdAt: { gte: start, lte: end },
      eventType: 'pageview' as const,
    }

    // Get all events first, then filter out admin pages
    // This is less efficient but works reliably with Prisma
    const allEventsForStats = await (prisma as any).analyticsEvent.findMany({
      where: baseWhere,
      select: {
        id: true,
        sessionId: true,
        pagePath: true,
        pageTitle: true,
        createdAt: true,
      },
    })

    // Filter out admin pages
    const nonAdminEvents = allEventsForStats.filter((event: any) => !isAdminPath(event.pagePath))

    // Total page views (excluding admin)
    const totalPageViews = nonAdminEvents.length

    // Unique visitors (unique session IDs, excluding admin)
    const uniqueSessionIds = new Set(nonAdminEvents.map((e: any) => e.sessionId))
    const uniqueVisitors = Array.from(uniqueSessionIds)

    // Popular pages (excluding admin)
    const pageViewsMap = new Map<string, number>()
    nonAdminEvents.forEach((event: any) => {
      const count = pageViewsMap.get(event.pagePath) || 0
      pageViewsMap.set(event.pagePath, count + 1)
    })

    const popularPages = Array.from(pageViewsMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Recent events (excluding admin) - limit to 10 for performance
    const recentEvents = nonAdminEvents
      .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((event: any) => ({
        id: event.id,
        pagePath: event.pagePath,
        pageTitle: event.pageTitle,
        createdAt: event.createdAt,
      }))

    // Views by day (last 30 days, excluding admin)
    const viewsByDayMap = new Map<string, number>()
    nonAdminEvents.forEach((event: any) => {
      const date = event.createdAt.toISOString().split('T')[0]
      viewsByDayMap.set(date, (viewsByDayMap.get(date) || 0) + 1)
    })

    const viewsByDay = Array.from(viewsByDayMap.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30)

    // Views by page path (excluding admin)
    const viewsByPage = Array.from(pageViewsMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)

    return {
      totalPageViews,
      uniqueVisitors: uniqueVisitors.length,
      popularPages,
      recentEvents,
      viewsByDay,
      viewsByPage,
    }
  } catch (error) {
    // If table doesn't exist or any other error, return empty stats
    console.error('Error fetching analytics stats:', error)
    return emptyStats
  }
}

/**
 * Export analytics data as JSON
 */
export async function exportAnalyticsData(
  startDate?: Date,
  endDate?: Date
): Promise<any[]> {
  const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Default: last year
  const end = endDate || new Date()

  // Check if Prisma client has analyticsEvent model
  if (!(prisma as any).analyticsEvent) {
    console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
    return []
  }

  try {
      const events = await (prisma as any).analyticsEvent.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

      return events.map((event: any) => ({
      id: event.id,
      sessionId: event.sessionId,
      pagePath: event.pagePath,
      pageTitle: event.pageTitle,
      referrer: event.referrer,
      userAgent: event.userAgent,
      language: event.language,
      country: event.country,
      ipAddress: event.ipAddress,
      eventType: event.eventType,
      metadata: event.metadata,
      createdAt: event.createdAt.toISOString(),
    }))
  } catch (error) {
    // If table doesn't exist or any other error, return empty array
    console.error('Error exporting analytics data:', error)
    return []
  }
}

/**
 * Delete analytics data
 */
export async function deleteAnalyticsData(
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  const start = startDate || new Date(0) // Default: all time
  const end = endDate || new Date()

  // Check if Prisma client has analyticsEvent model
  if (!(prisma as any).analyticsEvent) {
    console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
    return 0
  }

    const result = await (prisma as any).analyticsEvent.deleteMany({
    where: {
      createdAt: { gte: start, lte: end },
    },
  })

  return result.count
}

/**
 * Delete analytics data older than specified days
 * 
 * Default retention: 365 days (1 year)
 * This function should be called periodically (e.g., via cron job) to automatically
 * purge old analytics data and comply with data retention policies.
 * 
 * To set up automatic purging:
 * 1. Create a cron job or scheduled task that calls this function
 * 2. Or use a service like Vercel Cron or a database scheduler
 * 3. Recommended: Run daily or weekly to delete data older than retention period
 * 
 * Example cron job (runs daily at 2 AM):
 * 0 2 * * * curl -X POST https://your-domain.com/api/analytics/purge?daysOld=365
 */
export async function deleteOldAnalyticsData(daysOld: number = 365): Promise<number> {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

  // Check if Prisma client has analyticsEvent model
  if (!(prisma as any).analyticsEvent) {
    console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
    return 0
  }

  console.log(`[Analytics Service] Purging analytics data older than ${daysOld} days (before ${cutoffDate.toISOString()})`)

    const result = await (prisma as any).analyticsEvent.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
    },
  })

  console.log(`[Analytics Service] Deleted ${result.count} old analytics events`)
  return result.count
}

