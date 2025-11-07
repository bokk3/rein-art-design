import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/image-settings - Get image display settings (public)
 */
export async function GET(request: NextRequest) {
  try {
    const themeSettings = await prisma.siteSettings.findUnique({
      where: { key: 'theme_settings' }
    })

    // Default settings
    const defaultSettings = {
      grayscaleImages: false
    }

    const settings = themeSettings?.value as any || defaultSettings

    return NextResponse.json({
      grayscaleImages: settings.grayscaleImages || false
    })
  } catch (error) {
    console.error('Error fetching image settings:', error)
    return NextResponse.json(
      { grayscaleImages: false }, // Return default on error
      { status: 200 }
    )
  }
}

