import { prisma } from '../src/lib/db'

async function checkProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        translations: {
          include: {
            language: true
          }
        },
        images: true,
        contentType: true
      }
    })
    
    console.log('Found', projects.length, 'projects in database:')
    projects.forEach(project => {
      console.log(`\n- Project ID: ${project.id}`)
      console.log(`  Published: ${project.published}`)
      console.log(`  Featured: ${project.featured}`)
      console.log(`  Content Type: ${project.contentType.name}`)
      console.log(`  Images: ${project.images.length}`)
      console.log(`  Translations:`)
      project.translations.forEach(trans => {
        console.log(`    - ${trans.language.code}: "${trans.title}"`)
      })
    })
    
    // Also check languages
    const languages = await prisma.language.findMany()
    console.log('\nAvailable languages:')
    languages.forEach(lang => {
      console.log(`- ${lang.code} (${lang.name}) - Default: ${lang.isDefault}`)
    })
    
  } catch (error) {
    console.error('Error checking projects:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProjects()