import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireEditor } from '@/lib/auth-middleware'

/**
 * GET /api/page-builder/homepage - Get homepage components
 */
export async function GET(request: NextRequest) {
  try {
    // For now, we'll store page builder data in a simple way
    // In a real implementation, you might want a dedicated table
    const homepage = await prisma.siteSettings.findUnique({
      where: { key: 'homepage_components' }
    })

    const components = homepage?.value || []

    return NextResponse.json({ components })
  } catch (error) {
    console.error('Error fetching homepage components:', error)
    return NextResponse.json(
      { error: 'Failed to fetch homepage components' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/page-builder/homepage - Save homepage components
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireEditor(request)

    const { components } = await request.json()

    // Save components to site settings
    await prisma.siteSettings.upsert({
      where: { key: 'homepage_components' },
      update: {
        value: components,
        category: 'page_builder',
        description: 'Homepage page builder components'
      },
      create: {
        key: 'homepage_components',
        value: components,
        category: 'page_builder',
        description: 'Homepage page builder components'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving homepage components:', error)
    return NextResponse.json(
      { error: 'Failed to save homepage components' },
      { status: 500 }
    )
  }
}