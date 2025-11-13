import { prisma } from '../src/lib/db'
import { ImageProcessor } from '../src/lib/image-processing'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

/**
 * Regenerate all thumbnails with improved quality settings (800x800, quality 90)
 * This script can be run in the Docker container
 */
async function regenerateThumbnails() {
  console.log('🖼️  Regenerating thumbnails with improved quality...')
  console.log('   New settings: 800x800px, quality 90\n')

  try {
    // Get all project images
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
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`📊 Found ${images.length} images to process\n`)

    let successCount = 0
    let skippedCount = 0
    let errorCount = 0

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const projectTitle = image.project?.translations[0]?.title || 'Unknown Project'
      
      try {
        // Get file path from URL (remove leading slash if present)
        const originalUrl = image.originalUrl.startsWith('/') 
          ? image.originalUrl.substring(1) 
          : image.originalUrl
        
        const originalPath = path.join(process.cwd(), 'public', originalUrl)
        
        // Check if original file exists
        if (!existsSync(originalPath)) {
          console.log(`⚠️  [${i + 1}/${images.length}] Skipping: Original file not found`)
          console.log(`   Path: ${originalPath}`)
          console.log(`   Project: ${projectTitle}\n`)
          skippedCount++
          continue
        }

        // Read original image
        const imageBuffer = await readFile(originalPath)
        const filename = path.basename(originalPath)

        console.log(`🔄 [${i + 1}/${images.length}] Processing: ${filename}`)
        console.log(`   Project: ${projectTitle}`)

        // Get existing thumbnail path
        const existingThumbnailUrl = image.thumbnailUrl.startsWith('/')
          ? image.thumbnailUrl.substring(1)
          : image.thumbnailUrl
        const existingThumbnailPath = path.join(process.cwd(), 'public', existingThumbnailUrl)

        // Regenerate thumbnail directly using sharp (to overwrite existing file)
        const sharp = (await import('sharp')).default
        const thumbnailBuffer = await sharp(imageBuffer)
          .resize(800, 800, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 90, mozjpeg: true })
          .toBuffer()

        // Write thumbnail (overwrites existing file)
        const { writeFile } = await import('fs/promises')
        await writeFile(existingThumbnailPath, thumbnailBuffer)

        // Verify thumbnail was created
        if (existsSync(existingThumbnailPath)) {
          const stats = await import('fs').then(fs => fs.promises.stat(existingThumbnailPath))
          console.log(`   ✅ Thumbnail regenerated: ${(stats.size / 1024).toFixed(1)}KB`)
          console.log(`   Path: ${existingThumbnailUrl}\n`)
          successCount++
        } else {
          console.log(`   ⚠️  Thumbnail file not found after processing\n`)
          skippedCount++
        }

      } catch (error) {
        console.error(`   ❌ Error processing image ${image.id}:`, error instanceof Error ? error.message : error)
        errorCount++
        console.log()
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Regeneration Summary:')
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ⚠️  Skipped: ${skippedCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📦 Total: ${images.length}`)
    console.log('='.repeat(50))

    if (successCount > 0) {
      console.log('\n✨ Thumbnail regeneration complete!')
      console.log('   New thumbnails are 800x800px with quality 90')
      console.log('   You may need to clear your browser cache to see the improvements')
    }

  } catch (error) {
    console.error('❌ Fatal error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
regenerateThumbnails()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })

