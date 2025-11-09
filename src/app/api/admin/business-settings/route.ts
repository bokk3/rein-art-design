import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    await requireEditor(request)

    // Get business settings from database
    const businessSettings = await prisma.siteSettings.findUnique({
      where: { key: 'business_settings' }
    })

    // Also check for individual keys (legacy support from seed data)
    const [
      companyName,
      companyOwner,
      companyAddress,
      companyDetails,
      contactEmail,
      contactPhone
    ] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { key: 'company_name' } }),
      prisma.siteSettings.findUnique({ where: { key: 'company_owner' } }),
      prisma.siteSettings.findUnique({ where: { key: 'company_address' } }),
      prisma.siteSettings.findUnique({ where: { key: 'company_details' } }),
      prisma.siteSettings.findUnique({ where: { key: 'contact_email' } }),
      prisma.siteSettings.findUnique({ where: { key: 'contact_phone' } })
    ])

    // Default values
    const defaultSettings = {
      companyName: '',
      companyOwner: '',
      legalName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      contactEmail: '',
      contactPhone: '',
      whatsapp: '',
      vatNumber: '',
      companyRegistration: '',
      iban: '',
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '09:00', close: '17:00', closed: true }
      }
    }

    // If we have consolidated business_settings, use that
    if (businessSettings) {
      return NextResponse.json({
        ...defaultSettings,
        ...(businessSettings.value as object)
      })
    }

    // Otherwise, merge legacy individual keys
    const legacySettings = { ...defaultSettings }

    if (companyName && typeof companyName.value === 'string') {
      legacySettings.companyName = companyName.value
    }
    if (companyOwner && typeof companyOwner.value === 'string') {
      legacySettings.companyOwner = companyOwner.value
    }
    if (contactEmail && typeof contactEmail.value === 'string') {
      legacySettings.contactEmail = contactEmail.value
    }
    if (contactPhone && typeof contactPhone.value === 'string') {
      legacySettings.contactPhone = contactPhone.value
    }

    // Parse address (format: "Street\nPostalCode City" or similar)
    if (companyAddress && typeof companyAddress.value === 'string') {
      const addressLines = companyAddress.value.split('\n')
      if (addressLines.length >= 1) {
        legacySettings.address = addressLines[0]
      }
      if (addressLines.length >= 2) {
        const cityLine = addressLines[1].trim()
        // Try to parse "1234 City" format
        const match = cityLine.match(/^(\d+)\s+(.+)$/)
        if (match) {
          legacySettings.postalCode = match[1]
          legacySettings.city = match[2]
        } else {
          legacySettings.city = cityLine
        }
      }
    }

    // Parse company details
    if (companyDetails && typeof companyDetails.value === 'object') {
      const details = companyDetails.value as any
      if (details.legalName) legacySettings.legalName = details.legalName
      if (details.vat) legacySettings.vatNumber = details.vat
      if (details.iban) legacySettings.iban = details.iban
    }

    return NextResponse.json(legacySettings)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error fetching business settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business settings' },
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

    // Save business settings to database
    await prisma.siteSettings.upsert({
      where: { key: 'business_settings' },
      update: {
        value: settings,
        category: 'company',
        description: 'Business information and company details'
      },
      create: {
        key: 'business_settings',
        value: settings,
        category: 'company',
        description: 'Business information and company details'
      }
    })

    // Also update individual keys for legacy support (optional - can be removed later)
    if (settings.companyName) {
      await prisma.siteSettings.upsert({
        where: { key: 'company_name' },
        update: { value: settings.companyName, category: 'company' },
        create: { key: 'company_name', value: settings.companyName, category: 'company' }
      })
    }
    if (settings.companyOwner) {
      await prisma.siteSettings.upsert({
        where: { key: 'company_owner' },
        update: { value: settings.companyOwner, category: 'company' },
        create: { key: 'company_owner', value: settings.companyOwner, category: 'company' }
      })
    }
    if (settings.contactEmail) {
      await prisma.siteSettings.upsert({
        where: { key: 'contact_email' },
        update: { value: settings.contactEmail, category: 'contact' },
        create: { key: 'contact_email', value: settings.contactEmail, category: 'contact' }
      })
    }
    if (settings.contactPhone) {
      await prisma.siteSettings.upsert({
        where: { key: 'contact_phone' },
        update: { value: settings.contactPhone, category: 'contact' },
        create: { key: 'contact_phone', value: settings.contactPhone, category: 'contact' }
      })
    }

    // Update address (combine address, postalCode, city)
    if (settings.address || settings.postalCode || settings.city) {
      const addressValue = [settings.address, `${settings.postalCode} ${settings.city}`].filter(Boolean).join('\n')
      await prisma.siteSettings.upsert({
        where: { key: 'company_address' },
        update: { value: addressValue, category: 'company' },
        create: { key: 'company_address', value: addressValue, category: 'company' }
      })
    }

    // Update company details
    if (settings.legalName || settings.vatNumber || settings.iban) {
      const companyDetails = {
        legalName: settings.legalName || '',
        vat: settings.vatNumber || '',
        iban: settings.iban || ''
      }
      await prisma.siteSettings.upsert({
        where: { key: 'company_details' },
        update: { value: companyDetails, category: 'company' },
        create: { key: 'company_details', value: companyDetails, category: 'company' }
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

    console.error('Error saving business settings:', error)
    return NextResponse.json(
      { error: 'Failed to save business settings' },
      { status: 500 }
    )
  }
}

