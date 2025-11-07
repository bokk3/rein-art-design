import { NextRequest, NextResponse } from 'next/server'
import { ProjectService } from '@/lib/project-service'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { CreateProjectRequest, ProjectListFilters } from '@/types/project'

/**
 * GET /api/projects - List projects
 * Public endpoint for published projects, admin endpoint for all projects
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: ProjectListFilters = {
      published: searchParams.get('published') === 'true' ? true : 
                searchParams.get('published') === 'false' ? false : undefined,
      featured: searchParams.get('featured') === 'true' ? true :
               searchParams.get('featured') === 'false' ? false : undefined,
      contentTypeId: searchParams.get('contentTypeId') || undefined,
      languageId: searchParams.get('languageId') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }

    // Check if this is an admin request (has auth header)
    const authHeader = request.headers.get('authorization')
    const isAdminRequest = authHeader || request.headers.get('cookie')?.includes('better-auth')

    if (isAdminRequest) {
      try {
        // Verify admin/editor access for admin requests
        await requireEditor(request)
        // Admin can see all projects
      } catch (authError) {
        // If auth fails, fall back to public view
        filters.published = true
      }
    } else {
      // Public requests only see published projects
      filters.published = true
    }

    const projects = await ProjectService.getProjects(filters)
    
    // Calculate pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const total = projects.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProjects = projects.slice(startIndex, endIndex)

    return NextResponse.json({
      projects: paginatedProjects,
      total,
      page,
      limit,
      totalPages
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/projects - Create new project
 * Requires admin or editor role
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireEditor(request)
    const body: CreateProjectRequest = await request.json()

    // Validate required fields
    if (!body.contentTypeId || !body.translations || body.translations.length === 0) {
      return NextResponse.json(
        { error: 'Content type and at least one translation are required' },
        { status: 400 }
      )
    }

    // Validate translations
    for (const translation of body.translations) {
      if (!translation.languageId || !translation.title) {
        return NextResponse.json(
          { error: 'Each translation must have languageId and title' },
          { status: 400 }
        )
      }
    }

    const project = await ProjectService.createProject({
      contentTypeId: body.contentTypeId,
      featured: body.featured,
      published: body.published,
      createdBy: user.id,
      translations: body.translations,
      images: body.images
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}