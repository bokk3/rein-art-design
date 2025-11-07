import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ImageProcessor } from '../image-processing'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import sharp from 'sharp'

// Mock dependencies
vi.mock('fs/promises', () => ({
  default: {
    writeFile: vi.fn(),
    mkdir: vi.fn(),
    unlink: vi.fn()
  },
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  unlink: vi.fn()
}))

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn()
  },
  existsSync: vi.fn()
}))

vi.mock('sharp', () => {
  const mockSharpInstance = {
    resize: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed-image')),
    metadata: vi.fn().mockResolvedValue({ width: 800, height: 600 })
  }
  return {
    default: vi.fn(() => mockSharpInstance)
  }
})

const mockWriteFile = vi.mocked(writeFile)
const mockMkdir = vi.mocked(mkdir)
const mockUnlink = vi.mocked(unlink)
const mockExistsSync = vi.mocked(existsSync)
const mockSharp = vi.mocked(sharp)

describe('ImageProcessor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mocks
    mockExistsSync.mockReturnValue(true)
    mockWriteFile.mockResolvedValue(undefined)
    mockMkdir.mockResolvedValue(undefined)
    mockUnlink.mockResolvedValue(undefined)
    
    // Mock sharp chain
    const mockSharpInstance = {
      resize: vi.fn().mockReturnThis(),
      jpeg: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed-image')),
      metadata: vi.fn().mockResolvedValue({ width: 800, height: 600 })
    }
    
    mockSharp.mockReturnValue(mockSharpInstance)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initializeDirectories', () => {
    it('should create directories if they do not exist', async () => {
      // Mock existsSync to return false for both directories
      mockExistsSync.mockReturnValue(false)

      await ImageProcessor.initializeDirectories()

      expect(mockMkdir).toHaveBeenCalledWith('public/uploads', { recursive: true })
      expect(mockMkdir).toHaveBeenCalledWith('public/uploads/thumbnails', { recursive: true })
      expect(mockMkdir).toHaveBeenCalledTimes(2)
    })

    it('should not create directories if they exist', async () => {
      mockExistsSync.mockReturnValue(true)

      await ImageProcessor.initializeDirectories()

      expect(mockMkdir).not.toHaveBeenCalled()
    })
  })

  describe('processImage', () => {
    it('should process image with default options', async () => {
      const buffer = Buffer.from('test-image')
      const filename = 'test.jpg'

      const result = await ImageProcessor.processImage(buffer, filename)

      expect(mockSharp).toHaveBeenCalledWith(buffer)
      expect(result).toMatchObject({
        originalUrl: expect.stringMatching(/^\/uploads\/\d+-test\.jpg$/),
        thumbnailUrl: expect.stringMatching(/^\/uploads\/thumbnails\/thumb-\d+-test\.jpg$/),
        filename: expect.stringMatching(/^\d+-test\.jpg$/),
        size: expect.any(Number),
        width: 800,
        height: 600
      })
    })

    it('should process image with custom options', async () => {
      const buffer = Buffer.from('test-image')
      const filename = 'test.png'
      const options = {
        maxWidth: 1000,
        maxHeight: 800,
        quality: 90,
        format: 'jpeg' as const
      }

      const mockSharpInstance = {
        resize: vi.fn().mockReturnThis(),
        jpeg: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed-image')),
        metadata: vi.fn().mockResolvedValue({ width: 1000, height: 800 })
      }
      
      mockSharp.mockReturnValue(mockSharpInstance)

      await ImageProcessor.processImage(buffer, filename, options)

      expect(mockSharpInstance.resize).toHaveBeenCalledWith(1000, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      expect(mockSharpInstance.jpeg).toHaveBeenCalledWith({ quality: 90 })
    })

    it('should create thumbnail with correct dimensions', async () => {
      const buffer = Buffer.from('test-image')
      const filename = 'test.jpg'

      const mockSharpInstance = {
        resize: vi.fn().mockReturnThis(),
        jpeg: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed-image')),
        metadata: vi.fn().mockResolvedValue({ width: 300, height: 300 })
      }
      
      mockSharp.mockReturnValue(mockSharpInstance)

      await ImageProcessor.processImage(buffer, filename)

      // Should be called twice - once for original, once for thumbnail
      expect(mockSharpInstance.resize).toHaveBeenCalledWith(300, 300, {
        fit: 'cover',
        position: 'center'
      })
    })
  })

  describe('deleteImage', () => {
    it('should delete both original and thumbnail files', async () => {
      // Mock existsSync to return true for both files
      mockExistsSync.mockReturnValue(true)

      await ImageProcessor.deleteImage('/uploads/test.jpg', '/uploads/thumbnails/thumb-test.jpg')

      expect(mockUnlink).toHaveBeenCalledWith('public/uploads/test.jpg')
      expect(mockUnlink).toHaveBeenCalledWith('public/uploads/thumbnails/thumb-test.jpg')
      expect(mockUnlink).toHaveBeenCalledTimes(2)
    })

    it('should not throw error if files do not exist', async () => {
      mockExistsSync.mockReturnValue(false)

      await expect(ImageProcessor.deleteImage('/uploads/test.jpg', '/uploads/thumbnails/thumb-test.jpg')).resolves.not.toThrow()
    })

    it('should not throw error if deletion fails', async () => {
      mockExistsSync.mockReturnValue(true)
      mockUnlink.mockRejectedValue(new Error('Deletion failed'))

      await expect(ImageProcessor.deleteImage('/uploads/test.jpg', '/uploads/thumbnails/thumb-test.jpg')).resolves.not.toThrow()
    })
  })

  describe('validateImageFile', () => {
    it('should validate valid JPEG file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = ImageProcessor.validateImageFile(file)

      expect(result).toEqual({ valid: true })
    })

    it('should validate valid PNG file', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = ImageProcessor.validateImageFile(file)

      expect(result).toEqual({ valid: true })
    })

    it('should validate valid WebP file', () => {
      const file = new File(['test'], 'test.webp', { type: 'image/webp' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }) // 1MB

      const result = ImageProcessor.validateImageFile(file)

      expect(result).toEqual({ valid: true })
    })

    it('should reject invalid file type', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      Object.defineProperty(file, 'size', { value: 1024 })

      const result = ImageProcessor.validateImageFile(file)

      expect(result).toEqual({
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      })
    })

    it('should reject file that is too large', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }) // 11MB

      const result = ImageProcessor.validateImageFile(file)

      expect(result).toEqual({
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
      })
    })
  })

  describe('fileToBuffer', () => {
    it('should convert File to Buffer', async () => {
      const mockArrayBuffer = new ArrayBuffer(8)
      
      // Create a proper File mock with arrayBuffer method
      const file = {
        name: 'test.jpg',
        type: 'image/jpeg',
        size: 1024,
        arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer)
      } as unknown as File

      const result = await ImageProcessor.fileToBuffer(file)

      expect(result).toBeInstanceOf(Buffer)
      expect(file.arrayBuffer).toHaveBeenCalled()
    })
  })

  describe('generateResponsiveSizes', () => {
    it('should generate multiple image sizes', async () => {
      const buffer = Buffer.from('test-image')
      const filename = 'test.jpg'
      const sizes = [400, 800, 1200]

      const mockSharpInstance = {
        resize: vi.fn().mockReturnThis(),
        jpeg: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed-image'))
      }
      
      mockSharp.mockReturnValue(mockSharpInstance)

      const result = await ImageProcessor.generateResponsiveSizes(buffer, filename, sizes)

      expect(result).toHaveLength(3)
      expect(result[0]).toMatchObject({
        size: 400,
        url: expect.stringMatching(/400w\.jpg$/)
      })
      expect(result[1]).toMatchObject({
        size: 800,
        url: expect.stringMatching(/800w\.jpg$/)
      })
      expect(result[2]).toMatchObject({
        size: 1200,
        url: expect.stringMatching(/1200w\.jpg$/)
      })

      // Should call resize for each size
      expect(mockSharpInstance.resize).toHaveBeenCalledTimes(3)
      expect(mockSharpInstance.resize).toHaveBeenCalledWith(400, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
    })

    it('should use default sizes if none provided', async () => {
      const buffer = Buffer.from('test-image')
      const filename = 'test.jpg'

      const mockSharpInstance = {
        resize: vi.fn().mockReturnThis(),
        jpeg: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed-image'))
      }
      
      mockSharp.mockReturnValue(mockSharpInstance)

      const result = await ImageProcessor.generateResponsiveSizes(buffer, filename)

      expect(result).toHaveLength(4) // Default sizes: [400, 800, 1200, 1920]
      expect(mockSharpInstance.resize).toHaveBeenCalledTimes(4)
    })
  })
})