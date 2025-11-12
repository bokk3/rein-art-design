import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
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
    console.error('Error fetching contact categories:', error)
    // Return defaults on error
    return NextResponse.json([
      'Keukens',
      'Badkamermeubels',
      'Woonkamermeubels',
      'Op maat gemaakte meubels',
      'Renovatie',
      'Andere'
    ])
  }
}

