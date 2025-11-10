import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/business-info - Get business information (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    // Get business settings from database
    const businessSettings = await prisma.siteSettings.findUnique({
      where: { key: 'business_settings' }
    })

    // Default values
    const defaultInfo = {
      companyName: '',
      legalName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      contactEmail: '',
      contactPhone: '',
      iban: '',
      vatNumber: ''
    }

    // If we have business settings, extract info
    if (businessSettings && businessSettings.value) {
      const settings = businessSettings.value as any
      return NextResponse.json({
        companyName: settings.companyName || defaultInfo.companyName,
        legalName: settings.legalName || defaultInfo.legalName,
        address: settings.address || defaultInfo.address,
        city: settings.city || defaultInfo.city,
        postalCode: settings.postalCode || defaultInfo.postalCode,
        country: settings.country || defaultInfo.country,
        contactEmail: settings.contactEmail || defaultInfo.contactEmail,
        contactPhone: settings.contactPhone || defaultInfo.contactPhone,
        iban: settings.iban || defaultInfo.iban,
        vatNumber: settings.vatNumber || defaultInfo.vatNumber
      })
    }

    // Return defaults
    return NextResponse.json(defaultInfo)
  } catch (error) {
    console.error('Error fetching business info:', error)
    return NextResponse.json(
      {
        companyName: '',
        legalName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        contactEmail: '',
        contactPhone: '',
        iban: '',
        vatNumber: ''
      },
      { status: 200 }
    )
  }
}

