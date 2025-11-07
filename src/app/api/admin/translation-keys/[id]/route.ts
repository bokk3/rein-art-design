import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { TranslationService } from '@/lib/translation-service'

/**
 * PUT /api/admin/translation-keys/[id] - Update a translation key (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    const body = await request.json()
    const { key, category, description } = body

    const translationKey = await TranslationService.updateTranslationKey(id, {
      key,
      category,
      description
    })

    return NextResponse.json(translationKey)
  } catch (error: any) {
    console.error('Error updating translation key:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Translation key already exists' },
        { status: 409 }
      )
    }
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update translation key' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/translation-keys/[id] - Delete a translation key (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    await TranslationService.deleteTranslationKey(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting translation key:', error)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete translation key' },
      { status: 500 }
    )
  }
}

