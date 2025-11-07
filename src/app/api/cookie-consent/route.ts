import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/cookie-consent - Get cookie consent preferences for a session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const consent = await prisma.cookieConsent.findUnique({
      where: { sessionId },
    })

    if (!consent) {
      return NextResponse.json({ preferences: null })
    }

    return NextResponse.json({
      preferences: {
        essential: consent.essential,
        analytics: consent.analytics,
        marketing: consent.marketing,
      },
    })
  } catch (error) {
    console.error('Error fetching cookie consent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cookie consent' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cookie-consent - Save cookie consent preferences
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, essential, analytics, marketing } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Essential cookies are always required
    const essentialValue = essential !== undefined ? essential : true

    const consent = await prisma.cookieConsent.upsert({
      where: { sessionId },
      update: {
        essential: essentialValue,
        analytics: analytics === true,
        marketing: marketing === true,
        updatedAt: new Date(),
      },
      create: {
        sessionId,
        essential: essentialValue,
        analytics: analytics === true,
        marketing: marketing === true,
      },
    })

    return NextResponse.json({
      success: true,
      preferences: {
        essential: consent.essential,
        analytics: consent.analytics,
        marketing: consent.marketing,
      },
    })
  } catch (error) {
    console.error('Error saving cookie consent:', error)
    return NextResponse.json(
      { error: 'Failed to save cookie consent' },
      { status: 500 }
    )
  }
}

