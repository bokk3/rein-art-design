import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth-middleware'
import { getAnalyticsStats } from '@/lib/analytics-service'

/**
 * GET /api/analytics/stats - Get analytics statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined

    const stats = await getAnalyticsStats(start, end)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching analytics stats:', error)
    
    // Handle authentication/authorization errors
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
}

