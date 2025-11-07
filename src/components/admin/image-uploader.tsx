'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface ProjectImage {
  id?: string
  originalUrl: string
  thumbnailUrl: string
  alt: string
  order: number
}

interface ImageUploaderProps {
  images: ProjectImage[]
  onImagesChange: (images: ProjectImage[]) => void
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const newImages: ProjectImage[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`)
          continue
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          alert(`${file.name} is too large (max 10MB)`)
          continue
        }

        // Create form data
        const formData = new FormData()
        formData.append('file', file)

        // Upload image
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const result = await response.json()
        
        newImages.push({
          originalUrl: result.originalUrl,
          thumbnailUrl: result.thumbnailUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for alt text
          order: images.length + newImages.length
        })
      }

      onImagesChange([...images, ...newImages])
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], alt }
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    
    // Update order values
    newImages.forEach((img, index) => {
      img.order = index
    })
    
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="text-gray-600">
            {uploading ? (
              <div>Uploading images...</div>
            ) : (
              <div>
                <div className="text-lg">Drop images here or click to select</div>
                <div className="text-sm">Supports JPEG, PNG, WebP (max 10MB each)</div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Select Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Uploaded Images ({images.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={image.thumbnailUrl}
                      alt={image.alt}
                      fill
                      className="object-cover rounded"
                      unoptimized={false}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={image.alt}
                      onChange={(e) => updateImageAlt(index, e.target.value)}
                      placeholder="Alt text"
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveImage(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                        disabled={index === images.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}