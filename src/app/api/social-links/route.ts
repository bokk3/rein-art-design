import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/social-links - Get social media links (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    // Get social settings from database
    const socialSettings = await prisma.siteSettings.findUnique({
      where: { key: 'social_settings' }
    })

    // Default values
    const defaultLinks = {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
      pinterest: '',
      tiktok: '',
      enableSharing: true
    }

    // If we have social settings, return them
    if (socialSettings && socialSettings.value) {
      const settings = socialSettings.value as any
      return NextResponse.json({
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        linkedin: settings.linkedin || '',
        twitter: settings.twitter || '',
        youtube: settings.youtube || '',
        pinterest: settings.pinterest || '',
        tiktok: settings.tiktok || '',
        enableSharing: settings.enableSharing !== false
      })
    }

    // Return defaults
    return NextResponse.json(defaultLinks)
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json(
      {
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        youtube: '',
        pinterest: '',
        tiktok: '',
        enableSharing: true
      },
      { status: 200 }
    )
  }
}

