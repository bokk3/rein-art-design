import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'
import { TranslationAPIService } from '@/lib/translation-api-service'

/**
 * POST /api/admin/languages/[id]/translate-missing
 * Translate all missing translations for a language
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const resolvedParams = await params
    const languageId = resolvedParams.id

    if (!TranslationAPIService.isConfigured()) {
      return NextResponse.json(
        { error: 'Translation API not configured. Please add DEEPL_API_KEY to your environment variables.' },
        { status: 400 }
      )
    }

    // Get the target language
    const targetLanguage = await prisma.language.findUnique({
      where: { id: languageId }
    })

    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'Language not found' },
        { status: 404 }
      )
    }

    // Get default language as source
    const defaultLang = await prisma.language.findFirst({
      where: { isDefault: true, isActive: true }
    })

    if (!defaultLang) {
      return NextResponse.json(
        { error: 'No default language found' },
        { status: 400 }
      )
    }

    if (defaultLang.id === languageId) {
      return NextResponse.json(
        { error: 'Cannot translate default language' },
        { status: 400 }
      )
    }

    // Get all translation keys
    const translationKeys = await prisma.translationKey.findMany({
      include: {
        translations: {
          where: {
            OR: [
              { languageId: defaultLang.id },
              { languageId: languageId }
            ]
          },
          include: { language: true }
        }
      }
    })

    // Find keys that need translation (have default but not target)
    const keysToTranslate = translationKeys.filter(key => {
      const hasDefault = key.translations.some(t => t.languageId === defaultLang.id)
      const hasTarget = key.translations.some(t => t.languageId === languageId)
      return hasDefault && !hasTarget
    })

    if (keysToTranslate.length === 0) {
      return NextResponse.json({
        message: 'No missing translations found',
        translated: 0,
        total: 0
      })
    }

    // Translate each missing key with rate limiting
    const translationAPI = new TranslationAPIService()
    let translated = 0
    let failed = 0
    const errors: string[] = []

    // DeepL free tier: max 5 requests/second = 200ms between requests
    // Using 250ms to be safe
    const DELAY_BETWEEN_REQUESTS = 250

    for (let i = 0; i < keysToTranslate.length; i++) {
      const key = keysToTranslate[i]
      const sourceTranslation = key.translations.find(t => t.languageId === defaultLang.id)
      
      if (sourceTranslation && sourceTranslation.value) {
        try {
          const translatedText = await translationAPI.translateText(
            sourceTranslation.value,
            defaultLang.code,
            targetLanguage.code
          )

          // Save translation
          await prisma.translation.create({
            data: {
              keyId: key.id,
              languageId: languageId,
              value: translatedText
            }
          })
          translated++
          
          // Rate limiting: wait between requests (except for the last one)
          if (i < keysToTranslate.length - 1) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
          }
        } catch (error: any) {
          console.error(`Failed to translate key ${key.key}:`, error)
          failed++
          errors.push(`${key.key}: ${error.message}`)
          
          // If it's a rate limit error, wait longer before continuing
          if (error.message?.includes('429')) {
            console.log('Rate limited, waiting 5 seconds before continuing...')
            await new Promise(resolve => setTimeout(resolve, 5000))
          } else {
            // For other errors, still wait a bit to avoid hammering the API
            if (i < keysToTranslate.length - 1) {
              await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
            }
          }
        }
      }
    }

    return NextResponse.json({
      message: `Translation complete: ${translated} translated, ${failed} failed`,
      translated,
      failed,
      total: keysToTranslate.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error: any) {
    console.error('Error translating missing translations:', error)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to translate missing translations' },
      { status: 500 }
    )
  }
}

