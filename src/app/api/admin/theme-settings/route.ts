import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireEditor } from '@/lib/auth-middleware'

/**
 * GET /api/admin/theme-settings - Get theme settings
 */
export async function GET(request: NextRequest) {
  try {
    await requireEditor(request)

    const themeSettings = await prisma.siteSettings.findUnique({
      where: { key: 'theme_settings' }
    })

    // Default theme settings
    const defaultSettings = {
      mode: 'user-choice',
      allowUserToggle: true,
      defaultTheme: 'light',
      grayscaleImages: false,
      scrollSnapEnabled: true
    }

    return NextResponse.json(themeSettings?.value || defaultSettings)
  } catch (error) {
    console.error('Error fetching theme settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch theme settings' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/theme-settings - Save theme settings
 */
export async function POST(request: NextRequest) {
  try {
    await requireEditor(request)

    const settings = await request.json()

    // Validate settings
    const validModes = ['light', 'dark', 'system', 'user-choice']
    const validThemes = ['light', 'dark']

    if (!validModes.includes(settings.mode)) {
      return NextResponse.json(
        { error: 'Invalid theme mode' },
        { status: 400 }
      )
    }

    if (!validThemes.includes(settings.defaultTheme)) {
      return NextResponse.json(
        { error: 'Invalid default theme' },
        { status: 400 }
      )
    }

    // Save theme settings
    await prisma.siteSettings.upsert({
      where: { key: 'theme_settings' },
      update: {
        value: settings,
        category: 'appearance',
        description: 'Theme and appearance settings'
      },
      create: {
        key: 'theme_settings',
        value: settings,
        category: 'appearance',
        description: 'Theme and appearance settings'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving theme settings:', error)
    return NextResponse.json(
      { error: 'Failed to save theme settings' },
      { status: 500 }
    )
  }
}