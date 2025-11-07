import { prisma } from '../src/lib/db'

async function checkMedia() {
  try {
    const images = await prisma.projectImage.findMany({
      include: {
        project: {
          select: {
            id: true,
            translations: {
              select: {
                title: true
              },
              take: 1
            }
          }
        }
      }
    })
    
    console.log('Found', images.length, 'images in database:')
    images.forEach(img => {
      console.log(`- ${img.id}: ${img.originalUrl} (project: ${img.projectId || 'none'})`)
    })
    
  } catch (error) {
    console.error('Error checking media:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMedia()