import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'
import { TranslationService } from '@/lib/translation-service'
import { TranslationAPIService } from '@/lib/translation-api-service'

/**
 * GET /api/admin/languages - Get all languages (admin only, includes inactive)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const languages = await prisma.language.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { isActive: 'desc' },
        { code: 'asc' }
      ]
    })

    // Get translation coverage for each language
    const languagesWithCoverage = await Promise.all(
      languages.map(async (lang) => {
        const coverage = await TranslationService.getTranslationCoverage(lang.code)
        return {
          ...lang,
          coverage
        }
      })
    )

    return NextResponse.json(languagesWithCoverage)
  } catch (error: any) {
    console.error('Error fetching languages:', error)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/languages - Create a new language (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { code, name, isDefault, isActive } = body

    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code and name are required' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const language = await prisma.language.create({
      data: {
        code,
        name,
        isDefault: isDefault || false,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    // Auto-translate if requested
    const { autoTranslate } = body
    if (autoTranslate && TranslationAPIService.isConfigured()) {
      try {
        // Get default language as source
        const defaultLang = await prisma.language.findFirst({
          where: { isDefault: true, isActive: true }
        })

        if (defaultLang && defaultLang.code !== code) {
          // Get all translation keys with their default language translations
          const translationKeys = await prisma.translationKey.findMany({
            include: {
              translations: {
                where: { languageId: defaultLang.id },
                include: { language: true }
              }
            }
          })

          // Translate each key with rate limiting
          const translationAPI = new TranslationAPIService()
          let translated = 0
          let failed = 0
          
          // DeepL free tier: max 5 requests/second = 200ms between requests
          // Using 250ms to be safe
          const DELAY_BETWEEN_REQUESTS = 250
          
          for (let i = 0; i < translationKeys.length; i++) {
            const key = translationKeys[i]
            const sourceTranslation = key.translations[0]
            if (sourceTranslation && sourceTranslation.value) {
              try {
                const translatedText = await translationAPI.translateText(
                  sourceTranslation.value,
                  defaultLang.code,
                  code
                )

                // Save translation (upsert to avoid duplicates)
                await prisma.translation.upsert({
                  where: {
                    keyId_languageId: {
                      keyId: key.id,
                      languageId: language.id
                    }
                  },
                  update: {
                    value: translatedText
                  },
                  create: {
                    keyId: key.id,
                    languageId: language.id,
                    value: translatedText
                  }
                })
                translated++
                
                // Rate limiting: wait between requests (except for the last one)
                if (i < translationKeys.length - 1) {
                  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
                }
              } catch (error: any) {
                console.error(`Failed to translate key ${key.key}:`, error)
                failed++
                
                // If rate limited, wait longer before continuing
                if (error.message?.includes('429')) {
                  console.log('Rate limited, waiting 5 seconds before continuing...')
                  await new Promise(resolve => setTimeout(resolve, 5000))
                } else if (i < translationKeys.length - 1) {
                  await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
                }
              }
            }
          }

          console.log(`Auto-translation complete: ${translated} translated, ${failed} failed`)
        }
      } catch (error) {
        console.error('Auto-translation error:', error)
        // Don't fail language creation if translation fails
      }
    }

    return NextResponse.json(language)
  } catch (error: any) {
    console.error('Error creating language:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Language code already exists' },
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
      { error: 'Failed to create language' },
      { status: 500 }
    )
  }
}


