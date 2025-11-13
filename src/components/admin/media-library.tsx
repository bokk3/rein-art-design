'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Download,
  Eye,
  X,
  Filter,
  Calendar,
  FileImage,
  Loader2,
  Edit3,
  Move,
  Copy,
  Settings,
  Tag,
  FolderOpen,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Check,
  ChevronDown
} from 'lucide-react'

interface MediaItem {
  id: string
  filename: string
  originalUrl: string
  thumbnailUrl: string
  alt: string
  size: number
  width: number
  height: number
  mimeType: string
  createdAt: string
  projectId?: string
  projectTitle?: string
  order?: number
  tags?: string[]
  category?: string
}

interface MediaLibraryProps {
  onSelect?: (media: MediaItem) => void
  onSelectMultiple?: (media: MediaItem[]) => void
  selectionMode?: 'single' | 'multiple' | 'none'
  selectedItems?: MediaItem[]
  allowUpload?: boolean
  className?: string
}

interface BulkAction {
  id: string
  label: string
  icon: React.ReactNode
  action: (items: MediaItem[]) => void
  requiresConfirmation?: boolean
}

interface ImageOptimizationSettings {
  quality: number
  maxWidth: number
  maxHeight: number
  format: 'jpeg' | 'png' | 'webp'
  generateThumbnails: boolean
  thumbnailSize: number
}

export function MediaLibrary({
  onSelect,
  onSelectMultiple,
  selectionMode = 'none',
  selectedItems = [],
  allowUpload = true,
  className = '',
  showTitle = true
}: MediaLibraryProps & { showTitle?: boolean }) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showUploadArea, setShowUploadArea] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>(selectedItems)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'images' | 'unused'>('all')
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [showOptimizationSettings, setShowOptimizationSettings] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'project'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('')
  const [projects, setProjects] = useState<Array<{id: string, title: string}>>([])
  
  const [optimizationSettings, setOptimizationSettings] = useState<ImageOptimizationSettings>({
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg',
    generateThumbnails: true,
    thumbnailSize: 300
  })

  // Enhanced features are always enabled in admin context
  const allowBulkActions = true
  const allowOrganization = true
  const showMetadataEditor = true

  // Fetch media items and projects
  useEffect(() => {
    fetchMedia()
    fetchProjects()
  }, [])



  const fetchMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setMedia(data)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects.map((p: any) => ({
          id: p.id,
          title: p.translations[0]?.title || 'Untitled'
        })))
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)

    try {
      const formData = new FormData()
      
      // Add all files to the form data
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })
      
      // Add default metadata
      formData.append('category', 'portfolio')
      formData.append('tags', '')

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Upload response:', result)
        
        // Refresh the media list to show the new uploads
        await fetchMedia()
        
        const uploadedCount = result.uploaded || result.items?.length || 0
        if (uploadedCount > 0) {
          console.log(`✅ Successfully uploaded ${uploadedCount} image(s)`)
          setShowUploadArea(false) // Hide upload area after successful upload
          // Show success message
          alert(`Successfully uploaded ${uploadedCount} image(s)`)
        } else {
          alert('No images were uploaded. Please check file formats and sizes.')
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || `Failed to upload images (${response.status})`
        console.error('Failed to upload images:', response.status, errorMessage)
        alert(errorMessage)
      }
    } catch (error) {
      console.error('Error uploading files:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error uploading images. Please try again.'
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files)
      setShowUploadArea(false) // Hide after drop
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleSelect = (item: MediaItem) => {
    if (selectionMode === 'none') return

    if (selectionMode === 'single') {
      setSelectedMedia([item])
      onSelect?.(item)
    } else {
      const isSelected = selectedMedia.some(m => m.id === item.id)
      const newSelection = isSelected
        ? selectedMedia.filter(m => m.id !== item.id)
        : [...selectedMedia, item]

      setSelectedMedia(newSelection)
      onSelectMultiple?.(newSelection)
    }
  }

  const handleDelete = async (item: MediaItem) => {
    // Better confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.filename}"?\n\nThis action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      const response = await fetch(`/api/media/${item.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMedia(prev => prev.filter(m => m.id !== item.id))
        setSelectedMedia(prev => prev.filter(m => m.id !== item.id))
        // Close preview/edit if the deleted item was open
        if (previewItem?.id === item.id) {
          setPreviewItem(null)
        }
        if (editingItem?.id === item.id) {
          setEditingItem(null)
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        alert(`Failed to delete media: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      alert('Failed to delete media. Please try again.')
    }
  }

  const handleBulkDelete = async (items: MediaItem[]) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${items.length} item${items.length > 1 ? 's' : ''}?\n\nThis action cannot be undone.`
    )
    
    if (!confirmed) return

    try {
      const deletePromises = items.map(async item => {
        const response = await fetch(`/api/media/${item.id}`, { method: 'DELETE' })
        return { item, success: response.ok }
      })
      
      const results = await Promise.all(deletePromises)
      const successfulDeletes = results.filter(r => r.success)
      const failedDeletes = results.filter(r => !r.success)
      
      if (successfulDeletes.length > 0) {
        const deletedIds = successfulDeletes.map(r => r.item.id)
        setMedia(prev => prev.filter(m => !deletedIds.includes(m.id)))
        setSelectedMedia([])
        // Close preview/edit if any deleted items were open
        if (previewItem && successfulDeletes.some(r => r.item.id === previewItem.id)) {
          setPreviewItem(null)
        }
        if (editingItem && successfulDeletes.some(r => r.item.id === editingItem.id)) {
          setEditingItem(null)
        }
      }
      
      if (failedDeletes.length > 0) {
        alert(`Failed to delete ${failedDeletes.length} of ${items.length} item${failedDeletes.length > 1 ? 's' : ''}. Please try again.`)
      }
    } catch (error) {
      console.error('Error bulk deleting media:', error)
      alert('Failed to delete media. Please try again.')
    }
  }

  const handleBulkMove = async (items: MediaItem[]) => {
    const projectId = prompt('Enter project ID to move items to:')
    if (!projectId) return

    try {
      const updatePromises = items.map(item =>
        fetch(`/api/media/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId })
        })
      )
      
      await Promise.all(updatePromises)
      
      // Update local state
      setMedia(prev => prev.map(m => 
        items.some(item => item.id === m.id) 
          ? { ...m, projectId }
          : m
      ))
      setSelectedMedia([])
    } catch (error) {
      console.error('Error bulk moving media:', error)
    }
  }

  const handleBulkTag = async (items: MediaItem[]) => {
    const tags = prompt('Enter tags (comma-separated):')
    if (!tags) return

    const tagArray = tags.split(',').map(tag => tag.trim())

    try {
      const updatePromises = items.map(item =>
        fetch(`/api/media/${item.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags: [...(item.tags || []), ...tagArray] })
        })
      )
      
      await Promise.all(updatePromises)
      
      // Update local state
      setMedia(prev => prev.map(m => 
        items.some(item => item.id === m.id) 
          ? { ...m, tags: [...(m.tags || []), ...tagArray] }
          : m
      ))
      setSelectedMedia([])
    } catch (error) {
      console.error('Error bulk tagging media:', error)
    }
  }

  const handleBulkOptimize = async (items: MediaItem[]) => {
    if (!confirm(`Re-optimize ${items.length} images with current settings?`)) return

    try {
      const optimizePromises = items.map(item =>
        fetch(`/api/media/${item.id}/optimize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(optimizationSettings)
        })
      )
      
      await Promise.all(optimizePromises)
      
      // Refresh media list
      fetchMedia()
      setSelectedMedia([])
    } catch (error) {
      console.error('Error bulk optimizing media:', error)
    }
  }

  const handleUpdateMetadata = async (item: MediaItem, updates: Partial<MediaItem>) => {
    try {
      const response = await fetch(`/api/media/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setMedia(prev => prev.map(m => 
          m.id === item.id ? { ...m, ...updates } : m
        ))
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error updating metadata:', error)
    }
  }

  const handleReorder = async (itemId: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/media/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      })

      if (response.ok) {
        setMedia(prev => prev.map(m => 
          m.id === itemId ? { ...m, order: newOrder } : m
        ))
      }
    } catch (error) {
      console.error('Error reordering media:', error)
    }
  }

  // Define bulk actions
  const bulkActions: BulkAction[] = [
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: <Trash2 className="h-4 w-4" />,
      action: handleBulkDelete,
      requiresConfirmation: true
    },
    {
      id: 'move',
      label: 'Move to Project',
      icon: <Move className="h-4 w-4" />,
      action: handleBulkMove
    },
    {
      id: 'tag',
      label: 'Add Tags',
      icon: <Tag className="h-4 w-4" />,
      action: handleBulkTag
    },
    {
      id: 'optimize',
      label: 'Re-optimize',
      icon: <Settings className="h-4 w-4" />,
      action: handleBulkOptimize
    }
  ]

  const filteredAndSortedMedia = media
    .filter(item => {
      const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))

      const matchesFilter = filterType === 'all' ||
        (filterType === 'images' && item.mimeType.startsWith('image/')) ||
        (filterType === 'unused' && !item.projectId)

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

      const matchesTag = !tagFilter || (item.tags && item.tags.some(tag => 
        tag.toLowerCase().includes(tagFilter.toLowerCase())
      ))

      return matchesSearch && matchesFilter && matchesCategory && matchesTag
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.filename.localeCompare(b.filename)
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'project':
          comparison = (a.projectTitle || '').localeCompare(b.projectTitle || '')
          break
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Media thumbnail component (similar to ProjectCard)
  function MediaThumbnailCard({ 
    item, 
    isSelected, 
    onSelect, 
    onPreview, 
    onEdit,
    onDelete,
    showMetadataEditor 
  }: { 
    item: MediaItem
    isSelected: boolean
    onSelect: () => void
    onPreview: () => void
    onEdit: () => void
    onDelete: () => void
    showMetadataEditor: boolean
  }) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [imageSrc, setImageSrc] = useState(item.thumbnailUrl || item.originalUrl)

    // Fallback to originalUrl if thumbnail fails
    const handleImageError = () => {
      if (imageSrc === item.thumbnailUrl && item.originalUrl && item.originalUrl !== item.thumbnailUrl) {
        setImageSrc(item.originalUrl)
        setImageError(false)
      } else {
        console.error('Image failed to load:', imageSrc)
        setImageError(true)
      }
    }

    return (
      <div
        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${isSelected ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        onClick={onSelect}
      >
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden min-h-[160px] sm:min-h-[200px] md:min-h-[220px]">
          {imageSrc && !imageError ? (
            <>
              <Image
                src={imageSrc}
                alt={item.alt || item.filename}
                fill
                className={`object-cover transition-all duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                quality={90}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                unoptimized={imageSrc.startsWith('http://') || imageSrc.startsWith('https://')}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
              <FileImage className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        {/* Action buttons - positioned in top-right corner, only visible on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
            title="Preview"
            className="h-8 w-8 p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {showMetadataEditor && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              title="Edit"
              className="h-8 w-8 p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            title="Delete"
            className="h-8 w-8 p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 shadow-lg border border-red-200 dark:border-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Selection indicator - positioned in top-left, larger and more visible */}
        {isSelected && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-30 shadow-lg border-2 border-white dark:border-gray-800">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    )
  }

  // If className includes shadow-none, don't apply glass styling
  const hasShadow = !className.includes('shadow-none')
  
  return (
    <div className={`${hasShadow ? 'glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl' : ''} overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/50">
        <div className={`flex items-center justify-between ${showTitle ? 'mb-4' : ''}`}>
          {showTitle && (
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Media Library</h3>
          )}
          {!showTitle && (
            <div className="flex-1" />
          )}
          <div className="flex items-center gap-2">
            {/* Optimization Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptimizationSettings(!showOptimizationSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Upload Button (Toggle Upload Area) */}
            {allowUpload && (
              <Button 
                onClick={() => setShowUploadArea(!showUploadArea)} 
                variant="outline" 
                size="sm"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {showUploadArea ? 'Hide Upload' : 'Upload Images'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Large Upload Area with Drag and Drop (Toggleable) */}
        {allowUpload && showUploadArea && (
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(e.target.files)
                  setShowUploadArea(false) // Hide after selection
                }
              }}
              className="hidden"
              id="media-upload-input"
              disabled={uploading}
            />
            <label
              htmlFor="media-upload-input"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                flex flex-col items-center justify-center gap-3 px-6 py-12 rounded-lg border-2 border-dashed transition-all cursor-pointer
                ${dragOver 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50/50 dark:bg-gray-800/50'
                }
                ${uploading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  <span className="text-xl font-medium text-gray-900 dark:text-gray-100">Uploading images...</span>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                      Drop images here or click to select
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Supports JPEG, PNG, WebP (max 10MB each)
                    </p>
                  </div>
                </>
              )}
            </label>
          </div>
        )}

        {/* Search and Filters */}
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search media, tags, or alt text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Files</option>
              <option value="images">Images Only</option>
              <option value="unused">Unused</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
              <option value="project">Sort by Project</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Filter by tags..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-48"
            />
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Categories</option>
              <option value="portfolio">Portfolio</option>
              <option value="gallery">Gallery</option>
              <option value="blog">Blog</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Selection Info and Bulk Actions */}
        {selectionMode !== 'none' && selectedMedia.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''} selected
              </span>
              
              {allowBulkActions && (
                <div className="flex items-center gap-2">
                  {bulkActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => action.action(selectedMedia)}
                      className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      {action.icon}
                      <span className="ml-1">{action.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Optimization Settings Panel */}
        {showOptimizationSettings && (
          <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-3">Image Optimization Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quality">Quality (%)</Label>
                <Input
                  id="quality"
                  type="number"
                  min="1"
                  max="100"
                  value={optimizationSettings.quality}
                  onChange={(e) => setOptimizationSettings(prev => ({
                    ...prev,
                    quality: parseInt(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="maxWidth">Max Width (px)</Label>
                <Input
                  id="maxWidth"
                  type="number"
                  value={optimizationSettings.maxWidth}
                  onChange={(e) => setOptimizationSettings(prev => ({
                    ...prev,
                    maxWidth: parseInt(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="maxHeight">Max Height (px)</Label>
                <Input
                  id="maxHeight"
                  type="number"
                  value={optimizationSettings.maxHeight}
                  onChange={(e) => setOptimizationSettings(prev => ({
                    ...prev,
                    maxHeight: parseInt(e.target.value)
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <select
                  id="format"
                  value={optimizationSettings.format}
                  onChange={(e) => setOptimizationSettings(prev => ({
                    ...prev,
                    format: e.target.value as any
                  }))}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg text-sm text-gray-900 dark:text-gray-100"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredAndSortedMedia.length === 0 ? (
          <div className="text-center py-12">
            <FileImage className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No media found matching your search.' : 'No media files yet.'}
            </p>
            {allowUpload && !searchQuery && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Upload some images to get started.
              </p>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredAndSortedMedia.map((item) => {
              const isSelected = selectedMedia.some(m => m.id === item.id)
              return (
                <MediaThumbnailCard
                  key={item.id}
                  item={item}
                  isSelected={isSelected}
                  onSelect={() => handleSelect(item)}
                  onPreview={() => setPreviewItem(item)}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => handleDelete(item)}
                  showMetadataEditor={showMetadataEditor}
                />
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedMedia.map((item) => {
              const isSelected = selectedMedia.some(m => m.id === item.id)
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  onClick={() => handleSelect(item)}
                >
                  {item.thumbnailUrl ? (
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.alt || item.filename}
                        fill
                        className="object-cover"
                        sizes="48px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (target.src !== item.originalUrl) {
                            target.src = item.originalUrl
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                      <FileImage className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{item.filename}</p>
                      {item.projectTitle && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{item.projectTitle}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(item.size)} • {item.width}×{item.height} • {formatDate(item.createdAt)}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewItem(item)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {showMetadataEditor && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingItem(item)
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                    {allowOrganization && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          const newOrder = prompt('Enter new order:', item.order?.toString() || '0')
                          if (newOrder) handleReorder(item.id, parseInt(newOrder))
                        }}
                      >
                        <Move className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item)
                      }}
                      title="Delete"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl max-w-4xl max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{previewItem.filename}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewItem(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="relative w-full max-h-96 mx-auto aspect-auto">
                <Image
                  src={previewItem.originalUrl}
                  alt={previewItem.alt || previewItem.filename}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-900 dark:text-gray-100">
                <div>
                  <span className="font-medium">Dimensions:</span> {previewItem.width}×{previewItem.height}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {formatFileSize(previewItem.size)}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {previewItem.mimeType}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {formatDate(previewItem.createdAt)}
                </div>
                {previewItem.projectTitle && (
                  <div>
                    <span className="font-medium">Project:</span> {previewItem.projectTitle}
                  </div>
                )}
                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div className="col-span-2">
                    <span className="font-medium">Tags:</span> {previewItem.tags.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Metadata</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-4">
                {editingItem.thumbnailUrl ? (
                  <div className="relative w-24 h-24 rounded overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <Image
                      src={editingItem.thumbnailUrl}
                      alt={editingItem.alt || editingItem.filename}
                      fill
                      className="object-cover"
                      sizes="96px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src !== editingItem.originalUrl) {
                          target.src = editingItem.originalUrl
                        } else {
                          target.style.display = 'none'
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                    <FileImage className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{editingItem.filename}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(editingItem.size)} • {editingItem.width}×{editingItem.height}
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const updates = {
                    alt: formData.get('alt') as string,
                    tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
                    category: formData.get('category') as string,
                    projectId: formData.get('projectId') as string || undefined,
                    order: parseInt(formData.get('order') as string) || 0
                  }
                  handleUpdateMetadata(editingItem, updates)
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    name="alt"
                    defaultValue={editingItem.alt}
                    placeholder="Describe the image for accessibility"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={editingItem.tags?.join(', ') || ''}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingItem.category || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">No Category</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="gallery">Gallery</option>
                    <option value="blog">Blog</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="projectId">Assign to Project</Label>
                  <select
                    id="projectId"
                    name="projectId"
                    defaultValue={editingItem.projectId || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">No Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={editingItem.order || 0}
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingItem(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}