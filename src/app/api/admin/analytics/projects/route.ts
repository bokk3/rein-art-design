import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { getProjectAnalyticsStats } from '@/lib/analytics-service'

/**
 * GET /api/admin/analytics/projects - Get analytics for all projects
 */
export async function GET(request: NextRequest) {
  try {
    await requireEditor(request)

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let start: Date | undefined
    let end: Date | undefined

    if (startDate && endDate) {
      start = new Date(startDate)
      end = new Date(endDate)
    } else {
      // Use days parameter
      end = new Date()
      start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    }

    const stats = await getProjectAnalyticsStats(start, end)

    return NextResponse.json(stats)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error fetching project analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project analytics' },
      { status: 500 }
    )
  }
}

