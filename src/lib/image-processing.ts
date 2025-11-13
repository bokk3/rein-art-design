import sharp from 'sharp'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync, statSync } from 'fs'
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
      quality = 92, // Increased from 85 to 92 for better quality
      format: requestedFormat
    } = options

    // Detect image format from buffer (create a new sharp instance for metadata)
    const metadata = await sharp(buffer).metadata()
    const detectedFormat = metadata.format || 'jpeg'
    
    // Use detected format if no format is requested
    // For PNG files, preserve PNG format to maintain transparency
    const hasAlpha = metadata.hasAlpha || false
    const finalFormat = requestedFormat || (
      detectedFormat === 'png' ? 'png' : 
      detectedFormat === 'webp' ? 'webp' : 
      'jpeg'
    )

    // Generate unique filename with correct extension
    const timestamp = Date.now()
    const ext = finalFormat === 'jpeg' ? 'jpg' : finalFormat
    const uniqueFilename = `${timestamp}-${filename.replace(/\.[^/.]+$/, '')}.${ext}`
    const thumbnailFilename = `thumb-${uniqueFilename.replace(/\.(jpg|jpeg|png|webp)$/i, '.jpg')}`

    // Process original image with format-specific options
    // Create a new sharp instance for processing
    let processedBuffer: Buffer
    const imageProcessor = sharp(buffer).resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })

    if (finalFormat === 'png') {
      // For PNG, preserve transparency and use PNG compression
      processedBuffer = await imageProcessor
        .png({ 
          quality: Math.min(100, quality + 15), 
          compressionLevel: 9,
          adaptiveFiltering: true
        })
        .toBuffer()
    } else if (finalFormat === 'webp') {
      processedBuffer = await imageProcessor
        .webp({ quality, effort: 4 })
        .toBuffer()
    } else {
      // Default to JPEG
      processedBuffer = await imageProcessor
        .jpeg({ quality, mozjpeg: true })
        .toBuffer()
    }

    // Process thumbnail (always JPEG for thumbnails for consistency and smaller size)
    // Increased size to 800x800 and quality to 90 to prevent pixelation when displayed larger
    // For PNGs with transparency, flatten onto white background before converting to JPEG
    let thumbnailBuffer: Buffer
    const thumbnailSize = 800 // Increased from 300 to 800 for better quality
    const thumbnailQuality = 90 // Increased from 80 to 90 for better quality
    try {
      const thumbnailProcessor = sharp(buffer)
        .resize(thumbnailSize, thumbnailSize, {
          fit: 'cover',
          position: 'center'
        })
      
      // If PNG has transparency, flatten onto white background
      if (finalFormat === 'png' && hasAlpha) {
        thumbnailBuffer = await thumbnailProcessor
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: thumbnailQuality, mozjpeg: true })
          .toBuffer()
      } else {
        // Regular thumbnail processing
        thumbnailBuffer = await thumbnailProcessor
          .jpeg({ quality: thumbnailQuality, mozjpeg: true })
          .toBuffer()
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error)
      // Fallback: try simple JPEG conversion with flatten for safety
      thumbnailBuffer = await sharp(buffer)
        .resize(thumbnailSize, thumbnailSize, {
          fit: 'cover',
          position: 'center'
        })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: thumbnailQuality, mozjpeg: true })
        .toBuffer()
    }

    // Save files
    const originalPath = path.join(this.UPLOAD_DIR, uniqueFilename)
    const thumbnailPath = path.join(this.THUMBNAIL_DIR, thumbnailFilename)

    try {
      await writeFile(originalPath, processedBuffer)
      await writeFile(thumbnailPath, thumbnailBuffer)
      
      // Verify files were written
      const originalStats = statSync(originalPath)
      const thumbnailStats = statSync(thumbnailPath)
      
      console.log(`✅ Saved image: ${uniqueFilename} (${originalStats.size} bytes, format: ${finalFormat})`)
      console.log(`✅ Saved thumbnail: ${thumbnailFilename} (${thumbnailStats.size} bytes)`)
    } catch (error) {
      console.error('Error saving image files:', error)
      throw new Error(`Failed to save image files: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Get final image metadata
    const finalMetadata = await sharp(processedBuffer).metadata()

    return {
      originalUrl: `/uploads/${uniqueFilename}`,
      thumbnailUrl: `/uploads/thumbnails/${thumbnailFilename}`,
      filename: uniqueFilename,
      size: processedBuffer.length,
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0
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
        .jpeg({ quality: 92 })
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