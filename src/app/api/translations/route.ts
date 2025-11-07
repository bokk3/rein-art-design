import { NextRequest, NextResponse } from 'next/server'
import { TranslationService } from '@/lib/translation-service'

/**
 * GET /api/translations - Get translations for multiple keys
 * Query params: keys (comma-separated), lang (language code), fallback (optional fallback language code)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const keysParam = searchParams.get('keys')
    const languageCode = searchParams.get('lang') || 'nl'
    const fallbackCode = searchParams.get('fallback') || undefined

    if (!keysParam) {
      return NextResponse.json(
        { error: 'Keys parameter is required' },
        { status: 400 }
      )
    }

    const keys = keysParam.split(',').map(k => k.trim()).filter(Boolean)

    if (keys.length === 0) {
      return NextResponse.json(
        { error: 'At least one key is required' },
        { status: 400 }
      )
    }

    // Get translations
    const translations = await TranslationService.getTranslations(
      keys,
      languageCode,
      fallbackCode
    )

    return NextResponse.json(translations)
  } catch (error) {
    console.error('Error fetching translations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    )
  }
}

