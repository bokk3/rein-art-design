import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth-middleware'
import { ProjectService } from '@/lib/project-service'
import { TranslationAPIService } from '@/lib/translation-api-service'
import { ContentValidator } from '@/lib/content-validation'

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(req)

    const { projectIds } = await req.json()

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: 'Invalid project IDs' }, { status: 400 })
    }

    // Fetch all active languages
    const { prisma } = await import('@/lib/db')
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: { isDefault: 'desc' }
    })

    const defaultLang = languages.find(l => l.isDefault)
    if (!defaultLang) {
      return NextResponse.json({ error: 'No default language found' }, { status: 400 })
    }

    const targetLangs = languages
      .filter(l => !l.isDefault && l.isActive)
      .map(l => l.code)

    if (targetLangs.length === 0) {
      return NextResponse.json({ error: 'No target languages available' }, { status: 400 })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each project
    for (const projectId of projectIds) {
      try {
        const project = await ProjectService.getProjectById(projectId)
        if (!project) {
          results.failed++
          results.errors.push(`Project ${projectId} not found`)
          continue
        }

        // Find default language translation
        const defaultTranslation = project.translations.find(
          t => t.languageId === defaultLang.id
        )

        if (!defaultTranslation) {
          results.failed++
          results.errors.push(`Project ${projectId} has no default language translation`)
          continue
        }

        const updates: Array<{
          languageId: string
          title: string
          description: any
          materials: string[]
        }> = []

        // Translate title to each target language
        let titleTranslations: Record<string, string> = {}
        if (defaultTranslation.title) {
          const translationAPI = new TranslationAPIService()
          for (const targetLangCode of targetLangs) {
            try {
              const translated = await translationAPI.translateText(
                defaultTranslation.title,
                defaultLang.code,
                targetLangCode
              )
              if (translated && translated.trim()) {
                titleTranslations[targetLangCode] = translated
              }
              // Add delay to respect rate limits
              await new Promise(resolve => setTimeout(resolve, 250))
            } catch (error) {
              console.error(`Error translating title to ${targetLangCode} for project ${projectId}:`, error)
            }
          }
        }

        // Translate description (extract plain text, translate, reconstruct)
        let descriptionTranslations: Record<string, any> = {}
        if (defaultTranslation.description) {
          const plainText = ContentValidator.extractPlainText(defaultTranslation.description as any)
          if (plainText.trim()) {
            const translationAPI = new TranslationAPIService()
            for (const targetLangCode of targetLangs) {
              try {
                const translatedText = await translationAPI.translateText(
                  plainText,
                  defaultLang.code,
                  targetLangCode
                )

                // Reconstruct rich text for translation
                if (translatedText && typeof translatedText === 'string' && translatedText.trim()) {
                  // Create a simple paragraph structure with translated text
                  const lines = translatedText.split('\n').filter(line => line.trim())
                  if (lines.length > 0) {
                    descriptionTranslations[targetLangCode] = {
                      type: 'doc',
                      content: lines.map((line: string) => ({
                        type: 'paragraph',
                        content: [{ type: 'text', text: line }]
                      }))
                    }
                  }
                }
                // Add delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 250))
              } catch (error) {
                console.error(`Error translating description to ${targetLangCode} for project ${projectId}:`, error)
              }
            }
          }
        }

        // Translate materials (join, translate, split)
        let materialsTranslations: Record<string, string[]> = {}
        if (defaultTranslation.materials && defaultTranslation.materials.length > 0) {
          const translationAPI = new TranslationAPIService()
          for (const targetLangCode of targetLangs) {
            try {
              // Join materials with commas, translate, then split back
              const materialsText = defaultTranslation.materials.join(', ')
              const translatedText = await translationAPI.translateText(
                materialsText,
                defaultLang.code,
                targetLangCode
              )

              if (translatedText && typeof translatedText === 'string' && translatedText.trim()) {
                materialsTranslations[targetLangCode] = translatedText
                  .split(',')
                  .map(m => m.trim())
                  .filter(m => m)
              }
              // Add delay to respect rate limits
              await new Promise(resolve => setTimeout(resolve, 250))
            } catch (error) {
              console.error(`Error translating materials to ${targetLangCode} for project ${projectId}:`, error)
            }
          }
        }

        // Build updates for each target language
        for (const targetLang of languages.filter(l => targetLangs.includes(l.code))) {
          const existingTranslation = project.translations.find(
            t => t.languageId === targetLang.id
          )

          // Only use translated values if they exist, otherwise keep existing or use default
          const translatedTitle = titleTranslations[targetLang.code]
          const translatedDescription = descriptionTranslations[targetLang.code]
          const translatedMaterials = materialsTranslations[targetLang.code]
          
          updates.push({
            languageId: targetLang.id,
            // Use translated title if available, otherwise keep existing, otherwise use default
            title: translatedTitle || existingTranslation?.title || defaultTranslation.title,
            // Use translated description if available, otherwise keep existing, otherwise use default
            description: translatedDescription || existingTranslation?.description || defaultTranslation.description,
            // Use translated materials if available, otherwise keep existing, otherwise use default
            materials: translatedMaterials || existingTranslation?.materials || defaultTranslation.materials
          })
        }

        // Also preserve all existing translations that aren't being updated
        const existingTranslationIds = new Set(updates.map(u => u.languageId))
        for (const existingTranslation of project.translations) {
          if (!existingTranslationIds.has(existingTranslation.languageId)) {
            updates.push({
              languageId: existingTranslation.languageId,
              title: existingTranslation.title,
              description: existingTranslation.description,
              materials: existingTranslation.materials
            })
          }
        }

        // Update project with all translations (new + existing)
        await ProjectService.updateProject(projectId, {
          translations: updates
        })

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Project ${projectId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      results: {
        total: projectIds.length,
        success: results.success,
        failed: results.failed,
        errors: results.errors
      }
    })
  } catch (error) {
    console.error('Error in bulk project translation:', error)
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to translate projects' },
      { status: 500 }
    )
  }
}

