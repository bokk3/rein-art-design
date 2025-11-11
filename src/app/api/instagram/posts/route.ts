import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/instagram/posts - List Instagram posts
 * Public endpoint with optional admin filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const converted = searchParams.get('converted')
    const limit = parseInt(searchParams.get('limit') || '25')
    const offset = parseInt(searchParams.get('offset') || '0')
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {}

    if (converted === 'true') {
      where.projectId = { not: null }
    } else if (converted === 'false') {
      where.projectId = null
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // Get posts
    const [posts, total] = await Promise.all([
      prisma.instagramPost.findMany({
        where,
        orderBy: {
          postedAt: 'desc',
        },
        take: limit,
        skip: offset,
        include: {
          project: {
            select: {
              id: true,
              published: true,
              featured: true,
            },
          },
        },
      }),
      prisma.instagramPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch Instagram posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

