import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { TranslationAPIService } from '@/lib/translation-api-service'

/**
 * GET /api/admin/translations/check-api
 * Check if translation API is configured
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const configured = TranslationAPIService.isConfigured()
    const provider = process.env.TRANSLATION_PROVIDER || 'deepl'

    return NextResponse.json({
      configured,
      provider: configured ? provider : null
    })
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to check API configuration' },
      { status: 500 }
    )
  }
}

