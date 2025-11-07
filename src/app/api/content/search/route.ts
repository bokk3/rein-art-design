import { NextRequest, NextResponse } from 'next/server'
import { ContentService } from '@/lib/content-service'
import { ContentUtils } from '@/lib/content-utils'

/**
 * GET /api/content/search - Search content pages
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const languageCode = searchParams.get('language')
    const publishedOnly = searchParams.get('publishedOnly') !== 'false'
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
        pagination: {
          limit,
          offset,
          hasMore: false
        }
      })
    }

    // Get all pages (published only by default)
    const pages = await ContentService.getAllPages(!publishedOnly)

    // Perform search
    const searchResults = ContentUtils.searchPages(pages, query, languageCode || undefined)

    // Apply pagination
    const paginatedResults = searchResults.slice(offset, offset + limit)
    const hasMore = searchResults.length > offset + limit

    return NextResponse.json({
      results: paginatedResults,
      total: searchResults.length,
      query: query.trim(),
      pagination: {
        limit,
        offset,
        hasMore
      },
      filters: {
        languageCode: languageCode || null,
        publishedOnly
      }
    })
  } catch (error) {
    console.error('Error searching content pages:', error)
    return NextResponse.json(
      { error: 'Failed to search content pages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/content/search - Advanced search with filters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      query,
      filters = {},
      sort = { by: 'updatedAt', order: 'desc' },
      pagination = { limit: 10, offset: 0 }
    } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: '',
        pagination: {
          ...pagination,
          hasMore: false
        }
      })
    }

    // Get all pages based on filters
    let pages = await ContentService.getAllPages(!filters.publishedOnly)

    // Apply additional filters
    if (filters.languageCode || filters.hasTranslation) {
      pages = ContentUtils.filterPages(pages, {
        languageCode: filters.languageCode,
        hasTranslation: filters.hasTranslation
      })
    }

    // Perform search
    let searchResults = ContentUtils.searchPages(pages, query, filters.languageCode)

    // Apply sorting
    if (sort.by === 'relevance') {
      // Results are already sorted by relevance from searchPages
    } else {
      // Sort by other criteria
      const fullPages = pages.filter(p => 
        searchResults.some(r => r.id === p.id)
      )
      const sortedPages = ContentUtils.sortPages(
        fullPages, 
        sort.by as any, 
        sort.order as any, 
        filters.languageCode || 'nl'
      )
      
      // Rebuild search results in sorted order
      searchResults = sortedPages.map(page => {
        const result = searchResults.find(r => r.id === page.id)!
        return result
      })
    }

    // Apply pagination
    const paginatedResults = searchResults.slice(
      pagination.offset, 
      pagination.offset + pagination.limit
    )
    const hasMore = searchResults.length > pagination.offset + pagination.limit

    return NextResponse.json({
      results: paginatedResults,
      total: searchResults.length,
      query: query.trim(),
      pagination: {
        ...pagination,
        hasMore
      },
      filters,
      sort
    })
  } catch (error) {
    console.error('Error performing advanced search:', error)
    return NextResponse.json(
      { error: 'Failed to perform advanced search' },
      { status: 500 }
    )
  }
}