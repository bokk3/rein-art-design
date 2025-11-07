import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth-middleware'
import { deleteAnalyticsData, deleteOldAnalyticsData } from '@/lib/analytics-service'

/**
 * DELETE /api/analytics/delete - Delete analytics data (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)

    const body = await request.json()
    const { startDate, endDate, daysOld } = body

    let deletedCount: number

    if (daysOld) {
      // Delete data older than specified days
      deletedCount = await deleteOldAnalyticsData(daysOld)
    } else {
      // Delete data in date range
      const start = startDate ? new Date(startDate) : undefined
      const end = endDate ? new Date(endDate) : undefined
      deletedCount = await deleteAnalyticsData(start, end)
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} analytics events`,
    })
  } catch (error) {
    console.error('Error deleting analytics data:', error)
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete analytics data' },
      { status: 500 }
    )
  }
}

