import { prisma } from '../src/lib/db'
import { TranslationAPIService } from '../src/lib/translation-api-service'
import { ContentValidator } from '../src/lib/content-validation'
import { ProjectService } from '../src/lib/project-service'

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
    const defaultLanguage = await prisma.language.findFirst({
      where: { isDefault: true }
    })

    if (!nlLanguage || !defaultLanguage) {
      console.error('❌ Dutch or default language not found')
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
    let translated = 0

    for (const project of projects) {
      // Find the translation that's assigned to the default language (NL)
      const defaultTranslation = project.translations.find(
        t => t.languageId === defaultLanguage.id
      )

      if (!defaultTranslation) {
        console.log(`⚠️  Project ${project.id} has no default language translation, skipping`)
        continue
      }

      // Check if the title looks like English (simple heuristic)
      // If it contains common English words or patterns, it's likely English
      const looksLikeEnglish = /^(A|An|The|Custom|Handcrafted|Live Edge|Modern|Vintage|Rustic|Contemporary)/i.test(defaultTranslation.title)

      if (looksLikeEnglish && defaultLanguage.code === 'nl') {
        console.log(`🔄 Project "${defaultTranslation.title}" appears to be in English but assigned to Dutch`)
        
        // Check if there's already an English translation
        const existingEnTranslation = project.translations.find(
          t => t.language.code === 'en'
        )

        if (existingEnTranslation) {
          // Swap: move English content to EN language, and we'll translate to NL
          console.log(`   Found existing EN translation, will translate to NL`)
          
          // Translate English to Dutch
          try {
            const translationAPI = new TranslationAPIService()
            
            // Translate title
            const nlTitle = await translationAPI.translateText(
              existingEnTranslation.title,
              'en',
              'nl'
            )

            // Translate description
            let nlDescription = defaultTranslation.description
            if (existingEnTranslation.description) {
              const plainText = ContentValidator.extractPlainText(existingEnTranslation.description as any)
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

            // Update the Dutch translation with translated content
            await prisma.projectTranslation.update({
              where: { id: defaultTranslation.id },
              data: {
                title: nlTitle,
                description: nlDescription,
                materials: existingEnTranslation.materials // Keep materials as-is
              }
            })

            // Update English translation with the original English content
            await prisma.projectTranslation.update({
              where: { id: existingEnTranslation.id },
              data: {
                title: existingEnTranslation.title,
                description: existingEnTranslation.description,
                materials: existingEnTranslation.materials
              }
            })

            translated++
            console.log(`   ✅ Translated and fixed`)
          } catch (error) {
            console.error(`   ❌ Error translating:`, error)
            // Fallback: just swap the languages
            await prisma.projectTranslation.update({
              where: { id: defaultTranslation.id },
              data: {
                languageId: enLanguage?.id || defaultTranslation.languageId
              }
            })
            if (existingEnTranslation && nlLanguage) {
              await prisma.projectTranslation.update({
                where: { id: existingEnTranslation.id },
                data: {
                  languageId: nlLanguage.id
                }
              })
            }
            fixed++
            console.log(`   ✅ Swapped language assignments (translation failed)`)
          }
        } else {
          // No English translation exists, so the English content is in the Dutch slot
          // Translate it to Dutch and create an English translation
          try {
            const translationAPI = new TranslationAPIService()
            
            // Translate title from English to Dutch
            const nlTitle = await translationAPI.translateText(
              defaultTranslation.title,
              'en',
              'nl'
            )

            // Translate description
            let nlDescription = defaultTranslation.description
            if (defaultTranslation.description) {
              const plainText = ContentValidator.extractPlainText(defaultTranslation.description as any)
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

            // Update Dutch translation with translated content
            await prisma.projectTranslation.update({
              where: { id: defaultTranslation.id },
              data: {
                title: nlTitle,
                description: nlDescription
              }
            })

            // Create English translation with original English content
            if (enLanguage) {
              await prisma.projectTranslation.create({
                data: {
                  projectId: project.id,
                  languageId: enLanguage.id,
                  title: defaultTranslation.title, // Original English title
                  description: defaultTranslation.description, // Original English description
                  materials: defaultTranslation.materials
                }
              })
            }

            translated++
            console.log(`   ✅ Translated to Dutch and created English translation`)
          } catch (error) {
            console.error(`   ❌ Error translating:`, error)
            // If translation fails, at least move the English content to EN language
            if (enLanguage) {
              await prisma.projectTranslation.update({
                where: { id: defaultTranslation.id },
                data: {
                  languageId: enLanguage.id
                }
              })
              // Create empty Dutch translation
              await prisma.projectTranslation.create({
                data: {
                  projectId: project.id,
                  languageId: nlLanguage.id,
                  title: '[Nederlandse vertaling nodig]',
                  description: { type: 'doc', content: [] },
                  materials: defaultTranslation.materials
                }
              })
            }
            fixed++
            console.log(`   ⚠️  Moved to EN, created placeholder NL (translation failed)`)
          }
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log(`\n✅ Fixed ${fixed} projects, translated ${translated} projects`)
    console.log('🎉 Project language fix complete!')
  } catch (error) {
    console.error('❌ Error fixing project languages:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixProjectLanguages()

