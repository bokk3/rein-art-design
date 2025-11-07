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
 * POST /api/content/[id]/preview - Generate preview of content page
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

    const body = await request.json()
    const { languageCode = 'nl' } = body

    // Get the content page
    const page = await ContentService.getPageById(id, true)
    if (!page) {
      return NextResponse.json(
        { error: 'Content page not found' },
        { status: 404 }
      )
    }

    // Get translation for the specified language
    const translation = page.translations.find(t => t.language.code === languageCode)
    if (!translation) {
      return NextResponse.json(
        { error: `Translation not found for language: ${languageCode}` },
        { status: 404 }
      )
    }

    // Generate preview data
    const preview = {
      id: page.id,
      slug: page.slug,
      published: page.published,
      translation: {
        title: translation.title,
        content: translation.content,
        language: {
          code: translation.language.code,
          name: translation.language.name
        }
      },
      meta: {
        excerpt: ContentValidator.generateExcerpt(translation.content as any),
        wordCount: ContentValidator.extractPlainText(translation.content as any).split(/\s+/).length,
        lastUpdated: page.updatedAt
      }
    }

    return NextResponse.json(preview)
  } catch (error) {
    console.error('Error generating content preview:', error)
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/content/[id]/preview - Preview content with unsaved changes
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
    const { translations, languageCode = 'nl' } = body

    // Validate the preview data
    if (!translations || !Array.isArray(translations)) {
      return NextResponse.json(
        { error: 'Translations data is required' },
        { status: 400 }
      )
    }

    // Find the translation for the specified language
    const translation = translations.find((t: any) => 
      t.languageCode === languageCode || t.language?.code === languageCode
    )

    if (!translation) {
      return NextResponse.json(
        { error: `Translation not found for language: ${languageCode}` },
        { status: 404 }
      )
    }

    // Validate the translation content
    if (!translation.content) {
      return NextResponse.json(
        { error: 'Translation content is required' },
        { status: 400 }
      )
    }

    // Sanitize the content for preview
    const sanitizedContent = ContentValidator.sanitizeTipTapContent(translation.content)

    // Generate preview data
    const preview = {
      id: id,
      slug: body.slug || 'preview',
      published: body.published || false,
      translation: {
        title: translation.title || 'Untitled',
        content: sanitizedContent,
        language: {
          code: languageCode,
          name: translation.language?.name || languageCode.toUpperCase()
        }
      },
      meta: {
        excerpt: ContentValidator.generateExcerpt(sanitizedContent),
        wordCount: ContentValidator.extractPlainText(sanitizedContent).split(/\s+/).length,
        isPreview: true,
        previewTime: new Date().toISOString()
      }
    }

    return NextResponse.json(preview)
  } catch (error) {
    console.error('Error generating content preview:', error)
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}