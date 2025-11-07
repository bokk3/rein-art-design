import { NextRequest, NextResponse } from 'next/server'
import { ProjectService } from '@/lib/project-service'
import { requireEditor, AuthError } from '@/lib/auth-middleware'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/projects/[id]/toggle-featured - Toggle project featured status
 * Requires admin or editor role
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireEditor(request)
    const { id } = await params

    const project = await ProjectService.toggleFeatured(id)

    return NextResponse.json({ 
      project,
      message: `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    if (error instanceof Error && error.message === 'Project not found') {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    console.error('Error toggling featured status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle featured status' },
      { status: 500 }
    )
  }
}