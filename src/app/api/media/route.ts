import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireEditor } from '@/lib/auth-middleware'
import { ImageProcessor } from '@/lib/image-processing'

/**
 * GET /api/media - Get all media items
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication for admin access
    try {
      await requireEditor(request)
    } catch (authError) {
      console.log('Auth error in GET /api/media:', authError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const media = await prisma.projectImage.findMany({
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
        createdAt: 'desc'
      }
    })

    // Transform the data to match MediaItem interface
    // Read actual file dimensions and size from filesystem
    const transformedMedia = await Promise.all(media.map(async (item) => {
      let size = 0
      let width = 0
      let height = 0
      let mimeType = 'image/jpeg'

      try {
        // Read file stats and image metadata
        const fs = await import('fs')
        const pathModule = await import('path')
        const sharp = (await import('sharp')).default

        // Get file paths - handle both absolute and relative URLs
        const originalUrl = item.originalUrl.startsWith('/') ? item.originalUrl : `/${item.originalUrl}`
        const thumbnailUrl = item.thumbnailUrl.startsWith('/') ? item.thumbnailUrl : `/${item.thumbnailUrl}`
        const originalPath = pathModule.join(process.cwd(), 'public', originalUrl)
        const thumbnailPath = pathModule.join(process.cwd(), 'public', thumbnailUrl)

        // Check if original file exists and get file size
        if (fs.existsSync(originalPath)) {
          const stats = fs.statSync(originalPath)
          size = stats.size

          // Get image dimensions and mime type from the actual file
          try {
            const metadata = await sharp(originalPath).metadata()
            width = metadata.width || 0
            height = metadata.height || 0
            mimeType = metadata.format ? `image/${metadata.format}` : 'image/jpeg'
          } catch (error) {
            console.error(`Error reading image metadata for ${item.originalUrl}:`, error)
          }
        } else {
          console.warn(`Original file not found: ${originalPath}`)
        }

        // Verify thumbnail exists
        if (!fs.existsSync(thumbnailPath)) {
          console.warn(`Thumbnail file not found: ${thumbnailPath}`)
        }
      } catch (error) {
        console.error(`Error reading file info for ${item.originalUrl}:`, error)
        // Continue with default values if file read fails
      }

      return {
        id: item.id,
        filename: item.originalUrl.split('/').pop() || 'unknown',
        originalUrl: item.originalUrl,
        thumbnailUrl: item.thumbnailUrl,
        alt: item.alt,
        size,
        width,
        height,
        mimeType,
        createdAt: item.createdAt.toISOString(),
        projectId: item.projectId,
        projectTitle: item.project?.translations[0]?.title,
        order: item.order,
        tags: [], // We'll add this to the schema later
        category: 'portfolio' // Default category
      }
    }))

    return NextResponse.json(transformedMedia)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/media - Bulk upload media items
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    try {
      await requireEditor(request)
    } catch (authError) {
      console.log('Auth error in POST /api/media:', authError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const projectId = formData.get('projectId') as string | null
    const category = formData.get('category') as string || 'portfolio'
    const tags = formData.get('tags') as string || ''

    if (!files.length) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedItems = []

    for (const file of files) {
      try {
        // Validate file
        const validation = ImageProcessor.validateImageFile(file)
        if (!validation.valid) {
          console.error(`File validation failed for ${file.name}:`, validation.error)
          continue
        }

        // Convert file to buffer
        const buffer = await ImageProcessor.fileToBuffer(file)

        // Detect format from file type and process image
        // Preserve PNG format for PNG files, convert others to JPEG
        const fileFormat = file.type.includes('png') ? 'png' : 
                          file.type.includes('webp') ? 'webp' : 
                          'jpeg'
        
        const processedImage = await ImageProcessor.processImage(
          buffer,
          file.name,
          {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 92,
            format: fileFormat
          }
        )
        
        console.log('Processed image:', processedImage)
        
        // Create the project image record
        const projectImage = await prisma.projectImage.create({
          data: {
            projectId: projectId || null,
            originalUrl: processedImage.originalUrl,
            thumbnailUrl: processedImage.thumbnailUrl,
            alt: file.name.replace(/\.[^/.]+$/, ''),
            order: 0
          }
        })
        
        console.log('Created project image:', projectImage)

        // Determine mimeType based on processed format
        const processedMimeType = fileFormat === 'png' ? 'image/png' : 
                                  fileFormat === 'webp' ? 'image/webp' : 
                                  'image/jpeg'

        uploadedItems.push({
          id: projectImage.id,
          filename: processedImage.filename,
          originalUrl: processedImage.originalUrl,
          thumbnailUrl: processedImage.thumbnailUrl,
          alt: projectImage.alt,
          size: processedImage.size,
          width: processedImage.width,
          height: processedImage.height,
          mimeType: processedMimeType,
          createdAt: projectImage.createdAt.toISOString(),
          projectId: projectImage.projectId,
          order: projectImage.order,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          category
        })
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        continue
      }
    }

    return NextResponse.json({ 
      success: true, 
      uploaded: uploadedItems.length,
      items: uploadedItems 
    })
  } catch (error) {
    console.error('Error bulk uploading media:', error)
    return NextResponse.json(
      { error: 'Failed to upload media', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}