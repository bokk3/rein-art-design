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
 * PATCH /api/media/[id] - Update media item metadata
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    // Check authentication
    await requireEditor(request)

    const body = await request.json()
    const { alt, projectId, order, tags, category } = body

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

    // Update the database record
    const updatedItem = await prisma.projectImage.update({
      where: { id },
      data: {
        ...(alt !== undefined && { alt }),
        ...(projectId !== undefined && { projectId: projectId || null }),
        ...(order !== undefined && { order })
        // Note: tags and category would need to be added to the schema
      },
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

    // Transform the response
    const transformedItem = {
      id: updatedItem.id,
      filename: updatedItem.originalUrl.split('/').pop() || 'unknown',
      originalUrl: updatedItem.originalUrl,
      thumbnailUrl: updatedItem.thumbnailUrl,
      alt: updatedItem.alt,
      size: 0,
      width: 0,
      height: 0,
      mimeType: 'image/jpeg',
      createdAt: updatedItem.createdAt.toISOString(),
      projectId: updatedItem.projectId,
      projectTitle: updatedItem.project?.translations[0]?.title,
      order: updatedItem.order,
      tags: tags || [],
      category: category || 'portfolio'
    }

    return NextResponse.json(transformedItem)
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/media/[id] - Delete a media item
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    // Check authentication
    await requireEditor(request)

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

    // Delete the database record
    await prisma.projectImage.delete({
      where: { id }
    })

    // Delete the actual files
    try {
      await ImageProcessor.deleteImage(
        mediaItem.originalUrl,
        mediaItem.thumbnailUrl
      )
    } catch (fileError) {
      console.error('Error deleting files:', fileError)
      // Continue even if file deletion fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}