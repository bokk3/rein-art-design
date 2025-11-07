import sharp from 'sharp'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export interface ProcessedImage {
  originalUrl: string
  thumbnailUrl: string
  filename: string
  size: number
  width: number
  height: number
}

export class ImageProcessor {
  private static readonly UPLOAD_DIR = 'public/uploads'
  private static readonly THUMBNAIL_DIR = 'public/uploads/thumbnails'

  /**
   * Initialize upload directories
   */
  static async initializeDirectories() {
    const dirs = [this.UPLOAD_DIR, this.THUMBNAIL_DIR]
    
    for (const dir of dirs) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true })
      }
    }
  }

  /**
   * Process and save an uploaded image
   */
  static async processImage(
    buffer: Buffer,
    filename: string,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    await this.initializeDirectories()

    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 85,
      format = 'jpeg'
    } = options

    // Generate unique filename
    const timestamp = Date.now()
    const ext = format === 'jpeg' ? 'jpg' : format
    const uniqueFilename = `${timestamp}-${filename.replace(/\.[^/.]+$/, '')}.${ext}`
    const thumbnailFilename = `thumb-${uniqueFilename}`

    // Process original image
    const processedBuffer = await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toBuffer()

    // Process thumbnail (300x300 max)
    const thumbnailBuffer = await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer()

    // Save files
    const originalPath = path.join(this.UPLOAD_DIR, uniqueFilename)
    const thumbnailPath = path.join(this.THUMBNAIL_DIR, thumbnailFilename)

    await writeFile(originalPath, processedBuffer)
    await writeFile(thumbnailPath, thumbnailBuffer)

    // Get image metadata
    const metadata = await sharp(processedBuffer).metadata()

    return {
      originalUrl: `/uploads/${uniqueFilename}`,
      thumbnailUrl: `/uploads/thumbnails/${thumbnailFilename}`,
      filename: uniqueFilename,
      size: processedBuffer.length,
      width: metadata.width || 0,
      height: metadata.height || 0
    }
  }

  /**
   * Delete image files
   */
  static async deleteImage(originalUrl: string, thumbnailUrl: string) {
    try {
      const originalPath = path.join('public', originalUrl)
      const thumbnailPath = path.join('public', thumbnailUrl)

      if (existsSync(originalPath)) {
        await unlink(originalPath)
      }

      if (existsSync(thumbnailPath)) {
        await unlink(thumbnailPath)
      }
    } catch (error) {
      console.error('Error deleting image files:', error)
      // Don't throw error - file deletion failure shouldn't break the app
    }
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
      }
    }

    return { valid: true }
  }

  /**
   * Convert File to Buffer for processing
   */
  static async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  /**
   * Generate multiple sizes for responsive images
   */
  static async generateResponsiveSizes(
    buffer: Buffer,
    filename: string,
    sizes: number[] = [400, 800, 1200, 1920]
  ): Promise<{ size: number; url: string }[]> {
    await this.initializeDirectories()

    const results: { size: number; url: string }[] = []
    const timestamp = Date.now()
    const baseName = filename.replace(/\.[^/.]+$/, '')

    for (const size of sizes) {
      const sizedFilename = `${timestamp}-${baseName}-${size}w.jpg`
      const sizedPath = path.join(this.UPLOAD_DIR, sizedFilename)

      const processedBuffer = await sharp(buffer)
        .resize(size, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toBuffer()

      await writeFile(sizedPath, processedBuffer)

      results.push({
        size,
        url: `/uploads/${sizedFilename}`
      })
    }

    return results
  }
}