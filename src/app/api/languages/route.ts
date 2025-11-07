import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/languages - Get all active languages
 */
export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(languages)
  } catch (error) {
    console.error('Error fetching languages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    )
  }
}