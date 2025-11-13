import { NextRequest, NextResponse } from 'next/server'
import { ImageProcessor } from '@/lib/image-processing'
import { requireEditor, AuthError } from '@/lib/auth-middleware'

/**
 * POST /api/upload - Upload and process images
 * Requires admin or editor role
 */
export async function POST(request: NextRequest) {
  try {
    await requireEditor(request)

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = ImageProcessor.validateImageFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = await ImageProcessor.fileToBuffer(file)

    // Process image
    const processedImage = await ImageProcessor.processImage(
      buffer,
      file.name,
      {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 92,
        format: 'jpeg'
      }
    )

    return NextResponse.json(processedImage)
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}