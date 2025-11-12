import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await requireEditor(request)

    // Get contact categories from database
    const contactCategories = await prisma.siteSettings.findUnique({
      where: { key: 'contact_categories' }
    })

    // Default categories for furniture maker
    const defaultCategories = [
      'Keukens',
      'Badkamermeubels',
      'Woonkamermeubels',
      'Op maat gemaakte meubels',
      'Renovatie',
      'Andere'
    ]

    if (contactCategories && Array.isArray(contactCategories.value)) {
      return NextResponse.json(contactCategories.value as string[])
    }

    return NextResponse.json(defaultCategories)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error fetching contact categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireEditor(request)

    const categories = await request.json()

    // Validate that it's an array
    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Categories must be an array' },
        { status: 400 }
      )
    }

    // Validate each category is a non-empty string
    if (!categories.every(cat => typeof cat === 'string' && cat.trim().length > 0)) {
      return NextResponse.json(
        { error: 'All categories must be non-empty strings' },
        { status: 400 }
      )
    }

    // Save contact categories to database
    await prisma.siteSettings.upsert({
      where: { key: 'contact_categories' },
      update: {
        value: categories,
        category: 'contact',
        description: 'Contact form project type categories'
      },
      create: {
        key: 'contact_categories',
        value: categories,
        category: 'contact',
        description: 'Contact form project type categories'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error saving contact categories:', error)
    return NextResponse.json(
      { error: 'Failed to save contact categories' },
      { status: 500 }
    )
  }
}

