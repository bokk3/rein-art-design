import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkContent() {
  try {
    console.log('🔍 Checking content pages...')
    
    const pages = await prisma.contentPage.findMany({
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })

    console.log(`Found ${pages.length} pages:`)
    
    for (const page of pages) {
      console.log(`\n📄 Page: ${page.slug}`)
      console.log(`   Published: ${page.published}`)
      console.log(`   Translations: ${page.translations.length}`)
      
      for (const translation of page.translations) {
        console.log(`   - ${translation.language.name} (${translation.language.code}):`)
        console.log(`     Title: "${translation.title}"`)
        console.log(`     Content type: ${typeof translation.content}`)
        console.log(`     Content:`, JSON.stringify(translation.content, null, 2))
      }
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkContent()