import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/seo-settings - Get SEO settings (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
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
      robotsFollow: true
    }

    // If we have SEO settings, return them
    if (seoSettings && seoSettings.value) {
      const settings = seoSettings.value as any
      return NextResponse.json({
        metaTitle: settings.metaTitle || defaultSettings.metaTitle,
        metaDescription: settings.metaDescription || defaultSettings.metaDescription,
        metaKeywords: settings.metaKeywords || defaultSettings.metaKeywords,
        ogTitle: settings.ogTitle || defaultSettings.ogTitle,
        ogDescription: settings.ogDescription || defaultSettings.ogDescription,
        ogImage: settings.ogImage || defaultSettings.ogImage,
        ogType: settings.ogType || defaultSettings.ogType,
        twitterCard: settings.twitterCard || defaultSettings.twitterCard,
        twitterSite: settings.twitterSite || defaultSettings.twitterSite,
        twitterCreator: settings.twitterCreator || defaultSettings.twitterCreator,
        canonicalUrl: settings.canonicalUrl || defaultSettings.canonicalUrl,
        robotsIndex: settings.robotsIndex !== false,
        robotsFollow: settings.robotsFollow !== false
      })
    }

    // Return defaults
    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return NextResponse.json(
      {
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
        robotsFollow: true
      },
      { status: 200 }
    )
  }
}

