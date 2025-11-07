import { NextRequest, NextResponse } from 'next/server'
import { ContentService } from '@/lib/content-service'
import { ContentValidator } from '@/lib/content-validation'
import { authMiddleware } from '@/lib/auth-middleware'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/content/[id] - Get a specific content page
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const { searchParams } = new URL(request.url)
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true'
    const languageCode = searchParams.get('language')

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

    const page = await ContentService.getPageById(id, includeUnpublished)

    if (!page) {
      return NextResponse.json(
        { error: 'Content page not found' },
        { status: 404 }
      )
    }

    // If language is specified, get with fallback
    if (languageCode) {
      const { page: pageData, translation, usedLanguage } = await ContentService.getPageWithFallback(
        page.slug,
        languageCode
      )

      return NextResponse.json({
        ...pageData,
        currentTranslation: translation,
        usedLanguage
      })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching content page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content page' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/content/[id] - Update a content page
 */
export async function PUT(
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

    const body = await request.json()

    // Validate input data
    const validationErrors = ContentValidator.validateContentPage(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Check if page exists
    const existingPage = await ContentService.getPageById(id, true)
    if (!existingPage) {
      return NextResponse.json(
        { error: 'Content page not found' },
        { status: 404 }
      )
    }

    // Check if slug is available (excluding current page)
    if (body.slug && body.slug !== existingPage.slug) {
      const isSlugAvailable = await ContentService.isSlugAvailable(body.slug, id)
      if (!isSlugAvailable) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        )
      }
    }

    // Sanitize content
    const sanitizedTranslations = body.translations?.map((translation: any) => ({
      ...translation,
      content: ContentValidator.sanitizeTipTapContent(translation.content)
    }))

    // Update the page
    const updatedPage = await ContentService.updatePage(id, {
      ...body,
      ...(sanitizedTranslations && { translations: sanitizedTranslations })
    })

    return NextResponse.json(updatedPage)
  } catch (error) {
    console.error('Error updating content page:', error)
    return NextResponse.json(
      { error: 'Failed to update content page' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/content/[id] - Delete a content page
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

    // Check if page exists
    const existingPage = await ContentService.getPageById(id, true)
    if (!existingPage) {
      return NextResponse.json(
        { error: 'Content page not found' },
        { status: 404 }
      )
    }

    // Delete the page
    await ContentService.deletePage(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content page:', error)
    return NextResponse.json(
      { error: 'Failed to delete content page' },
      { status: 500 }
    )
  }
}