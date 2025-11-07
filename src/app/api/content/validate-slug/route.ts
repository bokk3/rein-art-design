import { NextRequest, NextResponse } from 'next/server'
import { ContentService } from '@/lib/content-service'
import { ContentValidator } from '@/lib/content-validation'
import { authMiddleware } from '@/lib/auth-middleware'

/**
 * POST /api/content/validate-slug - Validate and suggest content page slug
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
    const { slug, title, excludeId } = body

    let targetSlug = slug

    // If no slug provided but title is available, generate from title
    if (!targetSlug && title) {
      targetSlug = ContentService.generateSlug(title)
    }

    if (!targetSlug) {
      return NextResponse.json(
        { error: 'Slug or title is required' },
        { status: 400 }
      )
    }

    // Validate slug format
    const isValidFormat = ContentValidator.isValidSlug(targetSlug)
    if (!isValidFormat) {
      return NextResponse.json({
        isValid: false,
        isAvailable: false,
        slug: targetSlug,
        error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.',
        suggestions: []
      })
    }

    // Check availability
    const isAvailable = await ContentService.isSlugAvailable(targetSlug, excludeId)

    let suggestions: string[] = []
    let finalSlug = targetSlug

    // If not available, generate suggestions
    if (!isAvailable) {
      finalSlug = await ContentService.ensureUniqueSlug(targetSlug, excludeId)
      
      // Generate additional suggestions
      suggestions = await Promise.all([
        ContentService.ensureUniqueSlug(`${targetSlug}-page`, excludeId),
        ContentService.ensureUniqueSlug(`${targetSlug}-content`, excludeId),
        ContentService.ensureUniqueSlug(`${targetSlug}-info`, excludeId)
      ])
      
      // Remove duplicates and the final slug from suggestions
      suggestions = [...new Set(suggestions)].filter(s => s !== finalSlug)
    }

    return NextResponse.json({
      isValid: isValidFormat,
      isAvailable,
      slug: targetSlug,
      suggestedSlug: finalSlug,
      suggestions,
      ...(isAvailable ? {} : { 
        error: 'Slug is already in use',
        message: `The slug "${targetSlug}" is already taken. Try "${finalSlug}" instead.`
      })
    })
  } catch (error) {
    console.error('Error validating slug:', error)
    return NextResponse.json(
      { error: 'Failed to validate slug' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/content/validate-slug - Quick slug availability check
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await authMiddleware(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const excludeId = searchParams.get('excludeId')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Validate slug format
    const isValidFormat = ContentValidator.isValidSlug(slug)
    if (!isValidFormat) {
      return NextResponse.json({
        isValid: false,
        isAvailable: false,
        slug,
        error: 'Invalid slug format'
      })
    }

    // Check availability
    const isAvailable = await ContentService.isSlugAvailable(slug, excludeId || undefined)

    return NextResponse.json({
      isValid: isValidFormat,
      isAvailable,
      slug
    })
  } catch (error) {
    console.error('Error checking slug availability:', error)
    return NextResponse.json(
      { error: 'Failed to check slug availability' },
      { status: 500 }
    )
  }
}