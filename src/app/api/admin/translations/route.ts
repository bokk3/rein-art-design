import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { TranslationService } from '@/lib/translation-service'

/**
 * POST /api/admin/translations - Create or update a translation (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { keyId, languageId, value } = body

    if (!keyId || !languageId || value === undefined) {
      return NextResponse.json(
        { error: 'keyId, languageId, and value are required' },
        { status: 400 }
      )
    }

    const translation = await TranslationService.upsertTranslation({
      keyId,
      languageId,
      value
    })

    return NextResponse.json(translation)
  } catch (error: any) {
    console.error('Error saving translation:', error)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to save translation' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/translations - Delete a translation (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)

    const searchParams = request.nextUrl.searchParams
    const keyId = searchParams.get('keyId')
    const languageId = searchParams.get('languageId')

    if (!keyId || !languageId) {
      return NextResponse.json(
        { error: 'keyId and languageId are required' },
        { status: 400 }
      )
    }

    await TranslationService.deleteTranslation(keyId, languageId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting translation:', error)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete translation' },
      { status: 500 }
    )
  }
}

