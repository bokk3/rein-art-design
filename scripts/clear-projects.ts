import { prisma } from '../src/lib/db'

async function clearProjects() {
  try {
    console.log('🗑️  Clearing all projects and translations...')

    // Delete all projects (this will cascade delete translations and images)
    const deleted = await prisma.project.deleteMany({})

    console.log(`✅ Deleted ${deleted.count} project(s) and all associated translations/images`)
    console.log('🎉 Projects cleared! You can now reseed with Dutch content.')
  } catch (error) {
    console.error('❌ Error clearing projects:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

clearProjects()

