import { NextRequest, NextResponse } from 'next/server'
import { InstagramService } from '@/lib/instagram-service'

/**
 * GET /api/cron/instagram-sync - Scheduled Instagram sync endpoint
 * Protected with secret token
 */
export async function GET(request: NextRequest) {
  try {
    // Get secret from query parameter
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const expectedSecret = process.env.INSTAGRAM_CRON_SECRET

    // Validate secret
    if (!expectedSecret) {
      console.error('INSTAGRAM_CRON_SECRET is not set in environment variables')
      return NextResponse.json(
        { error: 'Cron secret not configured' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      console.warn('Invalid cron secret provided')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if sync is enabled
    const syncEnabled = process.env.INSTAGRAM_SYNC_ENABLED !== 'false'
    if (!syncEnabled) {
      return NextResponse.json({
        success: true,
        message: 'Instagram sync is disabled',
        skipped: true,
      })
    }

    // Get auto-create option from environment
    const autoCreateProjects = process.env.INSTAGRAM_AUTO_CREATE_PROJECTS === 'true'

    // Perform sync
    console.log('Starting scheduled Instagram sync...')
    const result = await InstagramService.syncFeed(autoCreateProjects)

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Sync completed: ${result.newPosts} new posts, ${result.updatedPosts} updated posts`
        : 'Sync completed with errors',
      data: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Instagram cron sync error:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync Instagram feed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

