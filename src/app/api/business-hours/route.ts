import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/business-hours - Get business hours (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    // Get business settings from database
    const businessSettings = await prisma.siteSettings.findUnique({
      where: { key: 'business_settings' }
    })

    // Default business hours
    const defaultBusinessHours = {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: true }
    }

    // If we have business settings, extract business hours
    if (businessSettings && businessSettings.value) {
      const settings = businessSettings.value as any
      if (settings.businessHours) {
        return NextResponse.json({
          businessHours: settings.businessHours
        })
      }
    }

    // Return default hours
    return NextResponse.json({
      businessHours: defaultBusinessHours
    })
  } catch (error) {
    console.error('Error fetching business hours:', error)
    return NextResponse.json(
      { 
        businessHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '09:00', close: '17:00', closed: false },
          sunday: { open: '09:00', close: '17:00', closed: true }
        }
      },
      { status: 200 }
    )
  }
}

