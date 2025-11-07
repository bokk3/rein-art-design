import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { TranslationService } from '@/lib/translation-service'

/**
 * GET /api/admin/translation-keys - Get all translation keys with translations (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const keys = await TranslationService.getAllTranslationKeys({
      category: category || undefined,
      search: search || undefined
    })

    return NextResponse.json(keys)
  } catch (error: any) {
    console.error('Error fetching translation keys:', error)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch translation keys' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/translation-keys - Create a new translation key (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { key, category, description, translations } = body

    if (!key || !category) {
      return NextResponse.json(
        { error: 'Key and category are required' },
        { status: 400 }
      )
    }

    const translationKey = await TranslationService.createTranslationKey({
      key,
      category,
      description,
      translations
    })

    return NextResponse.json(translationKey)
  } catch (error: any) {
    console.error('Error creating translation key:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Translation key already exists' },
        { status: 409 }
      )
    }
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create translation key' },
      { status: 500 }
    )
  }
}

