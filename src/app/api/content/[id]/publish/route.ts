import { NextRequest, NextResponse } from 'next/server'
import { ContentService } from '@/lib/content-service'
import { ContentUtils } from '@/lib/content-utils'
import { authMiddleware } from '@/lib/auth-middleware'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * POST /api/content/[id]/publish - Publish a content page
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    // Check authentication
    const authResult = await authMiddleware(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the content page
    const page = await ContentService.getPageById(id, true)
    if (!page) {
      return NextResponse.json(
        { error: 'Content page not found' },
        { status: 404 }
      )
    }

    // Check if page is already published
    if (page.published) {
      return NextResponse.json(
        { error: 'Content page is already published' },
        { status: 400 }
      )
    }

    // Validate that page has required translations
    const requiredLanguages = ['nl'] // Could be made configurable
    const translationCheck = ContentUtils.hasRequiredTranslations(page, requiredLanguages)
    
    if (!translationCheck.isComplete) {
      return NextResponse.json(
        { 
          error: 'Missing required translations',
          details: {
            missing: translationCheck.missing,
            required: requiredLanguages
          }
        },
        { status: 400 }
      )
    }

    // Publish the page
    const publishedPage = await ContentService.updatePage(id, {
      published: true
    })

    return NextResponse.json({
      success: true,
      page: publishedPage,
      publishedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error publishing content page:', error)
    return NextResponse.json(
      { error: 'Failed to publish content page' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/content/[id]/publish - Unpublish a content page
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    // Check authentication
    const authResult = await authMiddleware(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the content page
    const page = await ContentService.getPageById(id, true)
    if (!page) {
      return NextResponse.json(
        { error: 'Content page not found' },
        { status: 404 }
      )
    }

    // Check if page is already unpublished
    if (!page.published) {
      return NextResponse.json(
        { error: 'Content page is already unpublished' },
        { status: 400 }
      )
    }

    // Unpublish the page
    const unpublishedPage = await ContentService.updatePage(id, {
      published: false
    })

    return NextResponse.json({
      success: true,
      page: unpublishedPage,
      unpublishedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error unpublishing content page:', error)
    return NextResponse.json(
      { error: 'Failed to unpublish content page' },
      { status: 500 }
    )
  }
}