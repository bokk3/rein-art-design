// scripts/migrate-images-to-local.ts
import { prisma } from '../src/lib/db'
import { ImageProcessor } from '../src/lib/image-processing'
import { readFile, readdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

/**
 * Migrate project images and homepage images from external URLs to local files
 * 
 * Usage:
 *   tsx scripts/migrate-images-to-local.ts <scraped-images-folder>
 * 
 * Example:
 *   tsx scripts/migrate-images-to-local.ts ./scraped-images
 */

interface ImageMapping {
  externalUrl: string
  localPath: string
  thumbnailPath: string
}

async function findImageFile(
  scrapedFolder: string,
  url: string
): Promise<string | null> {
  try {
    // Extract filename from URL
    const urlPath = new URL(url).pathname
    const filename = path.basename(urlPath)
    
    // Try exact match first
    const exactPath = path.join(scrapedFolder, filename)
    if (existsSync(exactPath)) {
      return exactPath
    }
    
    // Try to find file with similar name (case-insensitive)
    const files = await readdir(scrapedFolder)
    const found = files.find(f => {
      // Skip JSON metadata files
      if (f.endsWith('.json')) return false
      
      const fLower = f.toLowerCase()
      const filenameLower = filename.toLowerCase()
      
      // Exact match (case-insensitive)
      if (fLower === filenameLower) return true
      
      // Match without extension
      const fBase = path.basename(f, path.extname(f))
      const filenameBase = path.basename(filename, path.extname(filename))
      if (fBase.toLowerCase() === filenameBase.toLowerCase()) return true
      
      // Partial match (filename contains part of scraped file or vice versa)
      if (fLower.includes(filenameBase.toLowerCase()) || 
          filenameBase.toLowerCase().includes(fBase.toLowerCase())) {
        return true
      }
      
      return false
    })
    
    if (found) {
      return path.join(scrapedFolder, found)
    }
    
    return null
  } catch {
    return null
  }
}

async function processAndSaveImage(
  imagePath: string,
  originalUrl: string
): Promise<ImageMapping> {
  // Read image file
  const buffer = await readFile(imagePath)
  const filename = path.basename(imagePath)
  
  // Process image (resize, optimize, generate thumbnail)
  const processed = await ImageProcessor.processImage(
    buffer,
    filename,
    {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85
    }
  )
  
  return {
    externalUrl: originalUrl,
    localPath: processed.originalUrl, // e.g., /uploads/timestamp-filename.jpg
    thumbnailPath: processed.thumbnailUrl // e.g., /uploads/thumbnails/thumb-timestamp-filename.jpg
  }
}

async function migrateProjectImages(scrapedFolder: string) {
  console.log('🖼️  Migrating project images...')
  
  // Get all project images with external URLs
  const projectImages = await prisma.projectImage.findMany({
    where: {
      OR: [
        { originalUrl: { startsWith: 'http://' } },
        { originalUrl: { startsWith: 'https://' } }
      ]
    },
    include: {
      project: {
        include: {
          translations: true
        }
      }
    }
  })
  
  console.log(`   Found ${projectImages.length} external images to migrate`)
  
  const mappings: ImageMapping[] = []
  let successCount = 0
  let skippedCount = 0
  const processedUrls = new Set<string>() // Track already processed URLs to avoid duplicates
  
  for (const image of projectImages) {
    try {
      // Skip if we already processed this URL
      if (processedUrls.has(image.originalUrl)) {
        // Reuse existing mapping
        const existingMapping = mappings.find(m => m.externalUrl === image.originalUrl)
        if (existingMapping) {
          await prisma.projectImage.update({
            where: { id: image.id },
            data: {
              originalUrl: existingMapping.localPath,
              thumbnailUrl: existingMapping.thumbnailPath
            }
          })
          successCount++
          console.log(`   ✅ Reused mapping for: ${image.originalUrl.substring(0, 60)}...`)
        }
        continue
      }
      
      // Find local file
      const localFile = await findImageFile(scrapedFolder, image.originalUrl)
      
      if (!localFile) {
        console.log(`   ⚠️  Skipping ${image.originalUrl.substring(0, 60)}... - file not found in scraped folder`)
        skippedCount++
        continue
      }
      
      // Process and save image
      const mapping = await processAndSaveImage(localFile, image.originalUrl)
      mappings.push(mapping)
      processedUrls.add(image.originalUrl)
      
      // Update database
      await prisma.projectImage.update({
        where: { id: image.id },
        data: {
          originalUrl: mapping.localPath,
          thumbnailUrl: mapping.thumbnailPath
        }
      })
      
      successCount++
      console.log(`   ✅ Migrated: ${path.basename(localFile)} -> ${mapping.localPath}`)
    } catch (error) {
      console.error(`   ❌ Error migrating ${image.originalUrl.substring(0, 60)}...:`, error instanceof Error ? error.message : error)
    }
  }
  
  console.log(`\n   ✅ Successfully migrated: ${successCount}`)
  console.log(`   ⚠️  Skipped (not found): ${skippedCount}`)
  
  return mappings
}

// Recursive function to find and replace image URLs in component data
function replaceImageUrls(obj: any, mappings: ImageMapping[]): any {
  if (typeof obj === 'string') {
    // Check if this string is an external image URL
    if (obj.startsWith('http://') || obj.startsWith('https://')) {
      const mapping = mappings.find(m => m.externalUrl === obj)
      if (mapping) {
        return mapping.localPath
      }
    }
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => replaceImageUrls(item, mappings))
  }
  
  if (obj && typeof obj === 'object') {
    const newObj: any = {}
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = replaceImageUrls(value, mappings)
    }
    return newObj
  }
  
  return obj
}

async function migrateHomepageImages(scrapedFolder: string, projectMappings: ImageMapping[]) {
  console.log('\n🏠 Migrating homepage images...')
  
  // Get homepage components
  const homepage = await prisma.siteSettings.findUnique({
    where: { key: 'homepage_components' }
  })
  
  if (!homepage || !homepage.value) {
    console.log('   ℹ️  No homepage components found')
    return
  }
  
  const components = homepage.value as any[]
  
  // First, collect all external URLs from components
  const externalUrls = new Set<string>()
  
  function collectUrls(obj: any) {
    if (typeof obj === 'string' && (obj.startsWith('http://') || obj.startsWith('https://'))) {
      externalUrls.add(obj)
    } else if (Array.isArray(obj)) {
      obj.forEach(collectUrls)
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(collectUrls)
    }
  }
  
  components.forEach(collectUrls)
  
  console.log(`   Found ${externalUrls.size} external image URLs in homepage components`)
  
  if (externalUrls.size === 0) {
    console.log('   ℹ️  No external URLs found in homepage components')
    return
  }
  
  // Process images and create mappings (if not already processed for projects)
  const homepageMappings: ImageMapping[] = []
  
  for (const url of externalUrls) {
    // Check if already mapped from project images
    const existingMapping = projectMappings.find(m => m.externalUrl === url)
    if (existingMapping) {
      homepageMappings.push(existingMapping)
      continue
    }
    
    // Process new image
    try {
      const localFile = await findImageFile(scrapedFolder, url)
      
      if (!localFile) {
        console.log(`   ⚠️  Skipping ${url.substring(0, 60)}... - file not found`)
        continue
      }
      
      const mapping = await processAndSaveImage(localFile, url)
      homepageMappings.push(mapping)
      projectMappings.push(mapping) // Add to project mappings for reuse
      console.log(`   ✅ Processed: ${path.basename(localFile)}`)
    } catch (error) {
      console.error(`   ❌ Error processing ${url.substring(0, 60)}...:`, error instanceof Error ? error.message : error)
    }
  }
  
  // Combine all mappings
  const allMappings = [...projectMappings, ...homepageMappings.filter(m => !projectMappings.includes(m))]
  
  // Replace URLs in components
  const updatedComponents = components.map(component => 
    replaceImageUrls(component, allMappings)
  )
  
  // Check if anything changed
  const hasChanges = JSON.stringify(updatedComponents) !== JSON.stringify(components)
  
  if (hasChanges) {
    // Update database
    await prisma.siteSettings.update({
      where: { key: 'homepage_components' },
      data: {
        value: updatedComponents
      }
    })
    
    console.log(`\n   ✅ Updated homepage components with ${homepageMappings.length} new image(s)`)
  } else {
    console.log(`\n   ℹ️  No homepage components needed updating`)
  }
}

async function main() {
  const scrapedFolder = process.argv[2]
  
  if (!scrapedFolder) {
    console.error('❌ Please provide the path to the scraped images folder')
    console.error('   Usage: tsx scripts/migrate-images-to-local.ts <scraped-images-folder>')
    console.error('   Example: tsx scripts/migrate-images-to-local.ts ./scraped-images')
    process.exit(1)
  }
  
  if (!existsSync(scrapedFolder)) {
    console.error(`❌ Folder not found: ${scrapedFolder}`)
    process.exit(1)
  }
  
  console.log(`📁 Using scraped images folder: ${scrapedFolder}\n`)
  
  try {
    // Migrate project images
    const projectMappings = await migrateProjectImages(scrapedFolder)
    
    // Migrate homepage images
    await migrateHomepageImages(scrapedFolder, projectMappings)
    
    console.log('\n✅ Migration complete!')
    console.log(`\n📝 Summary:`)
    console.log(`   - Project images migrated: ${projectMappings.length}`)
    console.log(`   - All images saved to: public/uploads/`)
    console.log(`   - Thumbnails saved to: public/uploads/thumbnails/`)
    console.log(`\n💡 Next steps:`)
    console.log(`   1. Verify images are displaying correctly on the site`)
    console.log(`   2. Test the homepage to ensure all images load`)
    console.log(`   3. You can now remove the scraped-images folder if everything works`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

