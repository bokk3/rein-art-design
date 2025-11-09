import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await requireEditor(request)

    // Get social settings from database
    const socialSettings = await prisma.siteSettings.findUnique({
      where: { key: 'social_settings' }
    })

    // Also check for individual social link keys (legacy support from seed data)
    // Note: seed data uses 'instagram_url' (not 'instagram_url' in some cases)
    const [facebook, instagram, linkedin, twitter, youtube, pinterest, tiktok] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: 'facebook_url' } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { key: 'instagram_url' } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { key: 'linkedin_url' } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { key: 'twitter_url' } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { key: 'youtube_url' } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { key: 'pinterest_url' } }).catch(() => null),
      prisma.siteSettings.findUnique({ where: { key: 'tiktok_url' } }).catch(() => null)
    ])

    // Default values
    const defaultSettings = {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
      pinterest: '',
      tiktok: '',
      enableSharing: true
    }

    // If we have consolidated social_settings, use that
    if (socialSettings) {
      return NextResponse.json({
        ...defaultSettings,
        ...(socialSettings.value as object)
      })
    }

    // Otherwise, check legacy individual keys
    // Handle both string values and object values from seed data
    const getStringValue = (setting: any): string => {
      if (!setting) return ''
      if (typeof setting.value === 'string') return setting.value
      return ''
    }

    const legacySettings = {
      ...defaultSettings,
      facebook: getStringValue(facebook),
      instagram: getStringValue(instagram),
      linkedin: getStringValue(linkedin),
      twitter: getStringValue(twitter),
      youtube: getStringValue(youtube),
      pinterest: getStringValue(pinterest),
      tiktok: getStringValue(tiktok)
    }

    return NextResponse.json(legacySettings)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error fetching social settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireEditor(request)

    const settings = await request.json()

    // Validate required fields
    if (typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      )
    }

    // Save social settings to database
    await prisma.siteSettings.upsert({
      where: { key: 'social_settings' },
      update: {
        value: settings,
        category: 'social',
        description: 'Social media links and sharing settings'
      },
      create: {
        key: 'social_settings',
        value: settings,
        category: 'social',
        description: 'Social media links and sharing settings'
      }
    })

    // Also update individual keys for legacy support (optional - can be removed later)
    // This allows components that read individual keys to still work
    if (settings.facebook) {
      await prisma.siteSettings.upsert({
        where: { key: 'facebook_url' },
        update: { value: settings.facebook, category: 'social' },
        create: { key: 'facebook_url', value: settings.facebook, category: 'social' }
      })
    }
    if (settings.instagram) {
      await prisma.siteSettings.upsert({
        where: { key: 'instagram_url' },
        update: { value: settings.instagram, category: 'social' },
        create: { key: 'instagram_url', value: settings.instagram, category: 'social' }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error saving social settings:', error)
    return NextResponse.json(
      { error: 'Failed to save social settings' },
      { status: 500 }
    )
  }
}

