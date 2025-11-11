import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/instagram/posts/[id] - Get specific Instagram post
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const post = await prisma.instagramPost.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            translations: {
              include: {
                language: true,
              },
            },
            images: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Instagram post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching Instagram post:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch Instagram post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/instagram/posts/[id] - Delete Instagram post
 * Requires admin or editor role
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Require editor authentication
    await requireEditor(request)

    const { id } = await params

    // Check if post exists
    const post = await prisma.instagramPost.findUnique({
      where: { id },
      include: {
        project: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Instagram post not found' },
        { status: 404 }
      )
    }

    // If post is linked to a project, we'll keep the project but remove the link
    // The project can be managed separately
    await prisma.instagramPost.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram post deleted successfully',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error deleting Instagram post:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete Instagram post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

