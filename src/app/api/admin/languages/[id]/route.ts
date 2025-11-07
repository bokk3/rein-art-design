import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'
import { TranslationService } from '@/lib/translation-service'

/**
 * PUT /api/admin/languages/[id] - Update a specific language (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    const body = await request.json()
    const { code, name, isDefault, isActive } = body

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.language.updateMany({
        where: {
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }

    // Prevent disabling the default language
    const currentLanguage = await prisma.language.findUnique({ where: { id } })
    if (currentLanguage?.isDefault && isActive === false) {
      return NextResponse.json(
        { error: 'Cannot disable the default language' },
        { status: 400 }
      )
    }

    const language = await prisma.language.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(name && { name }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive })
      }
    })

    // Clear translation cache when language settings change
    TranslationService.clearCache()

    return NextResponse.json(language)
  } catch (error: any) {
    console.error('Error updating language:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Language code already exists' },
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
      { error: 'Failed to update language' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/languages/[id] - Delete a language (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    // Prevent deleting the default language
    const language = await prisma.language.findUnique({ where: { id } })
    if (language?.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete the default language' },
        { status: 400 }
      )
    }

    await prisma.language.delete({
      where: { id }
    })

    // Clear translation cache
    TranslationService.clearCache()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting language:', error)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete language' },
      { status: 500 }
    )
  }
}

