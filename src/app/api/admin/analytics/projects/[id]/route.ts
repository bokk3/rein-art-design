import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { getProjectAnalytics } from '@/lib/analytics-service'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/analytics/projects/[id] - Get detailed analytics for a specific project
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireEditor(request)

    const { id } = await params
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

    const analytics = await getProjectAnalytics(id, start, end)

    if (!analytics) {
      return NextResponse.json(
        { error: 'Project analytics not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(analytics)
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

