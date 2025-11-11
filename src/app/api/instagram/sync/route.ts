import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { InstagramService } from '@/lib/instagram-service'

/**
 * POST /api/instagram/sync - Manually trigger Instagram feed sync
 * Requires admin or editor role
 */
export async function POST(request: NextRequest) {
  try {
    // Require editor authentication
    await requireEditor(request)

    // Get auto-create option from request body
    const body = await request.json().catch(() => ({}))
    const autoCreateProjects = body.autoCreateProjects === true || 
                               process.env.INSTAGRAM_AUTO_CREATE_PROJECTS === 'true'

    // Perform sync
    console.log('Starting manual Instagram sync...')
    const result = await InstagramService.syncFeed(autoCreateProjects)

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Sync completed: ${result.newPosts} new posts, ${result.updatedPosts} updated posts`
        : 'Sync completed with errors',
      data: result,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Instagram sync error:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync Instagram feed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

