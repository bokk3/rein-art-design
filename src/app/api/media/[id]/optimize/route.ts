import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireEditor } from '@/lib/auth-middleware'
import { ImageProcessor } from '@/lib/image-processing'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * POST /api/media/[id]/optimize - Re-optimize an image with new settings
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    // Check authentication
    await requireEditor(request)

    const body = await request.json()
    const { quality, maxWidth, maxHeight, format } = body

    // Find the media item
    const mediaItem = await prisma.projectImage.findUnique({
      where: { id }
    })

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      )
    }

    try {
      // Get the original file (this is a simplified approach)
      // In a real implementation, you'd want to store the original file separately
      const response = await fetch(mediaItem.originalUrl)
      const buffer = Buffer.from(await response.arrayBuffer())

      // Re-process the image with new settings
      const processedImage = await ImageProcessor.processImage(
        buffer,
        mediaItem.originalUrl.split('/').pop() || 'image',
        {
          quality: quality || 92,
          maxWidth: maxWidth || 1920,
          maxHeight: maxHeight || 1080,
          format: format || 'jpeg'
        }
      )

      // Update the database record with new URLs
      const updatedItem = await prisma.projectImage.update({
        where: { id },
        data: {
          originalUrl: processedImage.originalUrl,
          thumbnailUrl: processedImage.thumbnailUrl
        }
      })

      return NextResponse.json({
        success: true,
        item: {
          id: updatedItem.id,
          originalUrl: updatedItem.originalUrl,
          thumbnailUrl: updatedItem.thumbnailUrl,
          size: processedImage.size,
          width: processedImage.width,
          height: processedImage.height
        }
      })
    } catch (processingError) {
      console.error('Error re-processing image:', processingError)
      return NextResponse.json(
        { error: 'Failed to re-process image' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error optimizing media:', error)
    return NextResponse.json(
      { error: 'Failed to optimize media' },
      { status: 500 }
    )
  }
}