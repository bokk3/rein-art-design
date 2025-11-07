import { prisma } from '../src/lib/db'
import { TranslationAPIService } from '../src/lib/translation-api-service'
import { ContentValidator } from '../src/lib/content-validation'

async function fixProjectLanguages() {
  try {
    console.log('🔧 Fixing project language assignments...')

    // Get languages
    const nlLanguage = await prisma.language.findUnique({
      where: { code: 'nl' }
    })
    const enLanguage = await prisma.language.findUnique({
      where: { code: 'en' }
    })
    const frLanguage = await prisma.language.findUnique({
      where: { code: 'fr' }
    })
    const defaultLanguage = await prisma.language.findFirst({
      where: { isDefault: true }
    })

    if (!nlLanguage || !defaultLanguage) {
      console.error('❌ Dutch or default language not found')
      return
    }

    if (defaultLanguage.code !== 'nl') {
      console.error(`❌ Default language is ${defaultLanguage.code}, not 'nl'. Please set Dutch as default first.`)
      return
    }

    // Get all projects
    const projects = await prisma.project.findMany({
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })

    console.log(`📦 Found ${projects.length} projects to check`)

    let fixed = 0
    let skipped = 0

    for (const project of projects) {
      // Find the translation assigned to Dutch (default language)
      const nlTranslation = project.translations.find(
        t => t.languageId === nlLanguage.id
      )

      // Find English translation if it exists
      const enTranslation = enLanguage ? project.translations.find(
        t => t.languageId === enLanguage.id
      ) : null

      // Find French translation if it exists
      const frTranslation = frLanguage ? project.translations.find(
        t => t.languageId === frLanguage.id
      ) : null

      if (!nlTranslation) {
        console.log(`⚠️  Project ${project.id} has no Dutch translation, skipping`)
        skipped++
        continue
      }

      // Check if the Dutch translation contains English text
      // Simple heuristic: check if title starts with common English words
      const looksLikeEnglish = /^(A|An|The|Custom|Handcrafted|Live Edge|Modern|Vintage|Rustic|Contemporary|Artisan|Bespoke|Unique|Stunning|Solid|Reclaimed|Floor-to-ceiling)/i.test(nlTranslation.title)

      if (looksLikeEnglish) {
        console.log(`🔄 Project "${nlTranslation.title}" - English text found in Dutch slot`)
        
        // If there's already an English translation, check if it's different
        if (enTranslation && enTranslation.title !== nlTranslation.title) {
          console.log(`   Found existing EN translation with different content`)
          console.log(`   EN: "${enTranslation.title}"`)
          console.log(`   NL (wrong): "${nlTranslation.title}"`)
          
          // The English content is in the Dutch slot, and there's a different English translation
          // This is confusing - let's translate the current NL (English) content to Dutch
          try {
            const translationAPI = new TranslationAPIService()
            
            // Translate the English content (currently in NL slot) to Dutch
            const nlTitle = await translationAPI.translateText(
              nlTranslation.title,
              'en',
              'nl'
            )

            // Translate description
            let nlDescription = nlTranslation.description
            if (nlTranslation.description) {
              const plainText = ContentValidator.extractPlainText(nlTranslation.description as any)
              if (plainText.trim()) {
                const translatedText = await translationAPI.translateText(
                  plainText,
                  'en',
                  'nl'
                )
                
                // Reconstruct rich text
                const lines = translatedText.split('\n').filter(line => line.trim())
                if (lines.length > 0) {
                  nlDescription = {
                    type: 'doc',
                    content: lines.map((line: string) => ({
                      type: 'paragraph',
                      content: [{ type: 'text', text: line }]
                    }))
                  }
                }
              }
            }

            // Save original English content before updating
            const originalEnglishTitle = nlTranslation.title
            const originalEnglishDescription = nlTranslation.description
            const originalEnglishMaterials = nlTranslation.materials

            // Update Dutch translation with translated content
            await prisma.projectTranslation.update({
              where: { id: nlTranslation.id },
              data: {
                title: nlTitle,
                description: nlDescription,
                materials: nlTranslation.materials // Keep materials
              }
            })

            // Create/update English translation with the original English content
            if (enLanguage) {
              await prisma.projectTranslation.upsert({
                where: {
                  projectId_languageId: {
                    projectId: project.id,
                    languageId: enLanguage.id
                  }
                },
                update: {
                  title: originalEnglishTitle,
                  description: originalEnglishDescription,
                  materials: originalEnglishMaterials
                },
                create: {
                  projectId: project.id,
                  languageId: enLanguage.id,
                  title: originalEnglishTitle,
                  description: originalEnglishDescription,
                  materials: originalEnglishMaterials
                }
              })
            }

            fixed++
            console.log(`   ✅ Translated to Dutch: "${nlTitle}" and saved EN translation`)
            await new Promise(resolve => setTimeout(resolve, 500))
          } catch (error) {
            console.error(`   ❌ Error translating:`, error)
            skipped++
          }
        } else {
          // No English translation exists, or it's the same
          // Translate the English content to Dutch and create English translation
          try {
            const translationAPI = new TranslationAPIService()
            
            // Save original English content before updating
            const originalEnglishTitle = nlTranslation.title
            const originalEnglishDescription = nlTranslation.description
            const originalEnglishMaterials = nlTranslation.materials
            
            // Translate title from English to Dutch
            const nlTitle = await translationAPI.translateText(
              originalEnglishTitle,
              'en',
              'nl'
            )

            // Translate description
            let nlDescription = originalEnglishDescription
            if (originalEnglishDescription) {
              const plainText = ContentValidator.extractPlainText(originalEnglishDescription as any)
              if (plainText.trim()) {
                const translatedText = await translationAPI.translateText(
                  plainText,
                  'en',
                  'nl'
                )
                
                // Reconstruct rich text
                const lines = translatedText.split('\n').filter(line => line.trim())
                if (lines.length > 0) {
                  nlDescription = {
                    type: 'doc',
                    content: lines.map((line: string) => ({
                      type: 'paragraph',
                      content: [{ type: 'text', text: line }]
                    }))
                  }
                }
              }
            }

            // Update Dutch translation with translated content (keep same languageId!)
            await prisma.projectTranslation.update({
              where: { id: nlTranslation.id },
              data: {
                title: nlTitle,
                description: nlDescription
                // DO NOT change languageId - keep it as Dutch!
              }
            })

            // Create English translation with the original English content
            if (enLanguage) {
              await prisma.projectTranslation.upsert({
                where: {
                  projectId_languageId: {
                    projectId: project.id,
                    languageId: enLanguage.id
                  }
                },
                update: {
                  title: originalEnglishTitle,
                  description: originalEnglishDescription,
                  materials: originalEnglishMaterials
                },
                create: {
                  projectId: project.id,
                  languageId: enLanguage.id,
                  title: originalEnglishTitle,
                  description: originalEnglishDescription,
                  materials: originalEnglishMaterials
                }
              })
            }

            fixed++
            console.log(`   ✅ Translated to Dutch: "${nlTitle}" and created EN translation`)
            await new Promise(resolve => setTimeout(resolve, 500))
          } catch (error) {
            console.error(`   ❌ Error translating:`, error)
            skipped++
          }
        }
      } else {
        console.log(`✓ Project "${nlTranslation.title}" - Already in Dutch (or not English)`)
        skipped++
      }
    }

    console.log(`\n✅ Fixed ${fixed} projects, skipped ${skipped} projects`)
    console.log('🎉 Project language fix complete!')
  } catch (error) {
    console.error('❌ Error fixing project languages:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixProjectLanguages()

