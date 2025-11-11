import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'
import { InstagramProjectConverter } from '@/lib/instagram-project-converter'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/instagram/posts/[id]/convert - Convert Instagram post to Project
 * Requires admin or editor role
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Require editor authentication
    await requireEditor(request)

    const { id } = await params

    // Get published option from request body (default: false)
    const body = await request.json().catch(() => ({}))
    const published = body.published === true

    // Find Instagram post
    const post = await prisma.instagramPost.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Instagram post not found' },
        { status: 404 }
      )
    }

    // Check if already converted
    if (post.projectId) {
      const existingProject = await prisma.project.findUnique({
        where: { id: post.projectId },
        include: {
          translations: {
            include: {
              language: true,
            },
          },
          images: true,
        },
      })

      if (existingProject) {
        return NextResponse.json({
          success: true,
          message: 'Post already converted to project',
          project: existingProject,
        })
      }
    }

    // Convert post to project
    console.log(`Converting Instagram post ${post.instagramId} to project...`)
    const project = await InstagramProjectConverter.convertPostToProject(post, published)

    return NextResponse.json({
      success: true,
      message: 'Instagram post converted to project successfully',
      project,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error converting Instagram post:', error)
    return NextResponse.json(
      {
        error: 'Failed to convert Instagram post to project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

