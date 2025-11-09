import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await requireEditor(request)

    // Get SEO settings from database
    const seoSettings = await prisma.siteSettings.findUnique({
      where: { key: 'seo_settings' }
    })

    // Default values
    const defaultSettings = {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterSite: '',
      twitterCreator: '',
      canonicalUrl: '',
      robotsIndex: true,
      robotsFollow: true,
      sitemapEnabled: true,
      structuredDataEnabled: true
    }

    if (seoSettings) {
      return NextResponse.json({
        ...defaultSettings,
        ...(seoSettings.value as object)
      })
    }

    return NextResponse.json(defaultSettings)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error fetching SEO settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO settings' },
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

    // Save SEO settings to database
    await prisma.siteSettings.upsert({
      where: { key: 'seo_settings' },
      update: {
        value: settings,
        category: 'seo',
        description: 'SEO and meta tag settings'
      },
      create: {
        key: 'seo_settings',
        value: settings,
        category: 'seo',
        description: 'SEO and meta tag settings'
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

    console.error('Error saving SEO settings:', error)
    return NextResponse.json(
      { error: 'Failed to save SEO settings' },
      { status: 500 }
    )
  }
}

