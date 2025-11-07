import { NextRequest, NextResponse } from 'next/server'
import { ProjectService } from '@/lib/project-service'
import { requireEditor, requireAdmin, AuthError, getAuthenticatedUser } from '@/lib/auth-middleware'
import { UpdateProjectRequest } from '@/types/project'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/projects/[id] - Get single project
 * Public for published projects, admin for all projects
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const project = await ProjectService.getProjectById(id)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user is authenticated
    const user = await getAuthenticatedUser(request)
    
    // If not published and user is not admin/editor, deny access
    if (!project.published && (!user || !['admin', 'editor'].includes(user.role || ''))) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/projects/[id] - Update project
 * Requires admin or editor role
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireEditor(request)
    const { id } = await params
    const body: UpdateProjectRequest = await request.json()

    // Check if project exists
    const existingProject = await ProjectService.getProjectById(id)
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Validate translations if provided
    if (body.translations) {
      for (const translation of body.translations) {
        if (!translation.languageId || !translation.title) {
          return NextResponse.json(
            { error: 'Each translation must have languageId and title' },
            { status: 400 }
          )
        }
      }
    }

    const project = await ProjectService.updateProject(id, body)

    return NextResponse.json({ project })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/projects/[id] - Delete project
 * Requires admin role
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAdmin(request)
    const { id } = await params

    // Check if project exists
    const existingProject = await ProjectService.getProjectById(id)
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await ProjectService.deleteProject(id)

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}