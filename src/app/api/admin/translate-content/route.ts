import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { TranslationAPIService } from '@/lib/translation-api-service'
import { ContentValidator } from '@/lib/content-validation'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    if (!TranslationAPIService.isConfigured()) {
      return NextResponse.json(
        { error: 'Translation API is not configured' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { text, fromLang, toLangs, contentType = 'text' } = body

    if (!text || !fromLang || !toLangs || !Array.isArray(toLangs)) {
      return NextResponse.json(
        { error: 'Missing required fields: text, fromLang, toLangs' },
        { status: 400 }
      )
    }

    const translationAPI = new TranslationAPIService()
    const translations: Record<string, string> = {}

    // Extract plain text from rich text content if needed
    let plainText = text
    if (contentType === 'richText') {
      try {
        const content = typeof text === 'string' ? JSON.parse(text) : text
        plainText = ContentValidator.extractPlainText(content)
      } catch (e) {
        // If parsing fails, treat as plain text
        plainText = text
      }
    }

    if (!plainText || plainText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text to translate' },
        { status: 400 }
      )
    }

    // Translate to each target language
    for (const toLang of toLangs) {
      if (toLang === fromLang) {
        translations[toLang] = text // Keep original for same language
        continue
      }

      try {
        const translated = await translationAPI.translateText(
          plainText,
          fromLang,
          toLang
        )
        translations[toLang] = translated

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 250))
      } catch (error) {
        console.error(`Error translating to ${toLang}:`, error)
        // Continue with other languages even if one fails
        translations[toLang] = ''
      }
    }

    return NextResponse.json({ translations })
  } catch (error: any) {
    console.error('Error in translate-content:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to translate content' },
      { status: 500 }
    )
  }
}

