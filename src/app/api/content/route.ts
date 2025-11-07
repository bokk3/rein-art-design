import { NextRequest, NextResponse } from 'next/server'
import { ContentService } from '@/lib/content-service'
import { ContentValidator } from '@/lib/content-validation'
import { ContentUtils } from '@/lib/content-utils'
import { authMiddleware } from '@/lib/auth-middleware'

/**
 * GET /api/content - List all content pages
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true'
    const languageCode = searchParams.get('language')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') as 'updatedAt' | 'slug' | 'title' || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'

    // Check authentication for unpublished content
    if (includeUnpublished) {
      const authResult = await authMiddleware(request)
      if (!authResult.success) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
    }

    // Get all pages
    let pages = await ContentService.getAllPages(includeUnpublished)

    // Apply filters
    if (languageCode) {
      pages = ContentUtils.filterPages(pages, { languageCode })
    }

    // Apply search
    if (search) {
      const searchResults = ContentUtils.searchPages(pages, search, languageCode || undefined)
      // Convert search results back to full pages
      const searchPageIds = searchResults.map(r => r.id)
      pages = pages.filter(p => searchPageIds.includes(p.id))
    }

    // Sort pages
    pages = ContentUtils.sortPages(pages, sortBy, sortOrder, languageCode || 'nl')

    // Transform for list display
    const listItems = pages.map(page => ContentUtils.transformForList(page))

    // Get statistics
    const stats = ContentUtils.getContentStats(pages)

    return NextResponse.json({
      pages: listItems,
      stats,
      total: pages.length
    })
  } catch (error) {
    console.error('Error fetching content pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content pages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/content - Create a new content page
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input data
    const validationErrors = ContentValidator.validateContentPage(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Check if slug is available
    const isSlugAvailable = await ContentService.isSlugAvailable(body.slug)
    if (!isSlugAvailable) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      )
    }

    // Sanitize content
    const sanitizedTranslations = body.translations.map((translation: any) => ({
      ...translation,
      content: ContentValidator.sanitizeTipTapContent(translation.content)
    }))

    // Create the page
    const page = await ContentService.createPage({
      ...body,
      translations: sanitizedTranslations
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating content page:', error)
    return NextResponse.json(
      { error: 'Failed to create content page' },
      { status: 500 }
    )
  }
}