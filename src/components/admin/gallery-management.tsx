'use client'

import { useState } from 'react'
import { MediaLibrary } from './media-library'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Upload,
  Settings,
  FolderOpen,
  BarChart3,
  Download,
  Trash2,
  Tag,
  Move,
  Grid,
  List,
  Filter,
  Loader2
} from 'lucide-react'

interface GalleryStats {
  totalImages: number
  totalSize: string
  unusedImages: number
  recentUploads: number
}

export function GalleryManagement() {
  const [activeTab, setActiveTab] = useState<'library' | 'bulk-upload' | 'settings' | 'stats'>('library')
  const [bulkUploadFiles, setBulkUploadFiles] = useState<FileList | null>(null)
  const [bulkUploadDragOver, setBulkUploadDragOver] = useState(false)
  const [uploadingBulk, setUploadingBulk] = useState(false)
  const [bulkUploadSettings, setBulkUploadSettings] = useState({
    projectId: '',
    category: 'portfolio',
    tags: '',
    quality: 92,
    maxWidth: 1920,
    maxHeight: 1080
  })

  const handleBulkUpload = async () => {
    if (!bulkUploadFiles) return

    setUploadingBulk(true)
    const formData = new FormData()
    
    Array.from(bulkUploadFiles).forEach(file => {
      formData.append('files', file)
    })
    
    formData.append('projectId', bulkUploadSettings.projectId)
    formData.append('category', bulkUploadSettings.category)
    formData.append('tags', bulkUploadSettings.tags)

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        const uploadedCount = result.uploaded || result.items?.length || 0
        if (uploadedCount > 0) {
          alert(`Successfully uploaded ${uploadedCount} image(s)`)
          setBulkUploadFiles(null)
          // Refresh the library
          setActiveTab('library')
        } else {
          alert('No images were uploaded. Please check file formats and sizes.')
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || `Failed to upload images (${response.status})`
        alert(errorMessage)
      }
    } catch (error) {
      console.error('Error uploading:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error uploading images. Please try again.'
      alert(errorMessage)
    } finally {
      setUploadingBulk(false)
    }
  }

  // Drag and drop handlers for bulk upload
  const handleBulkDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setBulkUploadDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setBulkUploadFiles(e.dataTransfer.files)
    }
  }

  const handleBulkDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setBulkUploadDragOver(true)
  }

  const handleBulkDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setBulkUploadDragOver(false)
  }

  const tabs = [
    { id: 'library', label: 'Media Library', icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: <Upload className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart3 className="h-4 w-4" /> }
  ]

  return (
    <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/50">
        <nav className="flex space-x-2 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-4 border-b-2 font-semibold text-sm transition-all duration-200 rounded-t-xl ${
                activeTab === tab.id
                  ? 'border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'library' && (
          <MediaLibrary
            selectionMode="multiple"
            allowUpload={true}
            className="border-0 shadow-none"
            showTitle={false}
          />
        )}

        {activeTab === 'bulk-upload' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Bulk Image Upload</h3>
              <p className="text-gray-600 mb-6">
                Upload multiple images at once with consistent settings and metadata.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Selection */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulk-files">Select Images</Label>
                  <div
                    className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      bulkUploadDragOver 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    } ${uploadingBulk ? 'opacity-50 pointer-events-none' : ''}`}
                    onDrop={handleBulkDrop}
                    onDragOver={handleBulkDragOver}
                    onDragLeave={handleBulkDragLeave}
                  >
                    <input
                      id="bulk-files"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setBulkUploadFiles(e.target.files)}
                      className="hidden"
                      disabled={uploadingBulk}
                    />
                    <label htmlFor="bulk-files" className="cursor-pointer">
                      {uploadingBulk ? (
                        <>
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Uploading images...
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Drop images here or click to select
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Supports JPEG, PNG, WebP (max 10MB each)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {bulkUploadFiles && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        {bulkUploadFiles.length} files selected
                      </p>
                      <div className="mt-2 max-h-32 overflow-y-auto">
                        {Array.from(bulkUploadFiles).map((file, index) => (
                          <div key={index} className="text-sm text-gray-500 truncate">
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Upload Settings</h4>
                
                <div>
                  <Label htmlFor="project-select">Assign to Project (Optional)</Label>
                  <select
                    id="project-select"
                    value={bulkUploadSettings.projectId}
                    onChange={(e) => setBulkUploadSettings(prev => ({
                      ...prev,
                      projectId: e.target.value
                    }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">No Project</option>
                    {/* Projects would be loaded dynamically */}
                  </select>
                </div>

                <div>
                  <Label htmlFor="category-select">Category</Label>
                  <select
                    id="category-select"
                    value={bulkUploadSettings.category}
                    onChange={(e) => setBulkUploadSettings(prev => ({
                      ...prev,
                      category: e.target.value
                    }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="portfolio">Portfolio</option>
                    <option value="gallery">Gallery</option>
                    <option value="blog">Blog</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bulk-tags">Tags (comma-separated)</Label>
                  <Input
                    id="bulk-tags"
                    value={bulkUploadSettings.tags}
                    onChange={(e) => setBulkUploadSettings(prev => ({
                      ...prev,
                      tags: e.target.value
                    }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bulk-quality">Quality (%)</Label>
                    <Input
                      id="bulk-quality"
                      type="number"
                      min="1"
                      max="100"
                      value={bulkUploadSettings.quality}
                      onChange={(e) => setBulkUploadSettings(prev => ({
                        ...prev,
                        quality: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bulk-max-width">Max Width (px)</Label>
                    <Input
                      id="bulk-max-width"
                      type="number"
                      value={bulkUploadSettings.maxWidth}
                      onChange={(e) => setBulkUploadSettings(prev => ({
                        ...prev,
                        maxWidth: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                </div>

                  <Button
                    onClick={handleBulkUpload}
                    disabled={!bulkUploadFiles || uploadingBulk}
                    className="w-full"
                  >
                    {uploadingBulk ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload {bulkUploadFiles?.length || 0} Images
                      </>
                    )}
                  </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Gallery Settings</h3>
              <p className="text-gray-600 mb-6">
                Configure default settings for image processing and organization.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Default Image Processing</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="default-quality">Default Quality (%)</Label>
                    <Input
                      id="default-quality"
                      type="number"
                      min="1"
                      max="100"
                      defaultValue="85"
                    />
                  </div>
                  <div>
                    <Label htmlFor="default-format">Default Format</Label>
                    <select
                      id="default-format"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="default-max-width">Max Width (px)</Label>
                    <Input
                      id="default-max-width"
                      type="number"
                      defaultValue="1920"
                    />
                  </div>
                  <div>
                    <Label htmlFor="default-max-height">Max Height (px)</Label>
                    <Input
                      id="default-max-height"
                      type="number"
                      defaultValue="1080"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="thumbnail-size">Thumbnail Size (px)</Label>
                  <Input
                    id="thumbnail-size"
                    type="number"
                    defaultValue="300"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Organization Settings</h4>
                
                <div>
                  <Label htmlFor="default-category">Default Category</Label>
                  <select
                    id="default-category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="portfolio">Portfolio</option>
                    <option value="gallery">Gallery</option>
                    <option value="blog">Blog</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="auto-tags">Auto-generate Tags</Label>
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Generate tags from filename</span>
                    </label>
                    <label className="flex items-center mt-2">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Generate tags from project name</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="cleanup-settings">Cleanup Settings</Label>
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Auto-delete unused images after 30 days</span>
                    </label>
                    <label className="flex items-center mt-2">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Compress images older than 90 days</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>
                Save Settings
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Gallery Statistics</h3>
              <p className="text-gray-600 mb-6">
                Overview of your media library usage and performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <FolderOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Total Images</p>
                    <p className="text-2xl font-bold text-blue-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Total Size</p>
                    <p className="text-2xl font-bold text-green-900">0 MB</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <Trash2 className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-600">Unused Images</p>
                    <p className="text-2xl font-bold text-yellow-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <Upload className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Recent Uploads</p>
                    <p className="text-2xl font-bold text-purple-900">0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-4">Storage Usage by Category</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio</span>
                    <span className="text-sm font-medium">0 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gallery</span>
                    <span className="text-sm font-medium">0 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Blog</span>
                    <span className="text-sm font-medium">0 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">0 MB</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-4">Most Used Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    portfolio (0)
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    gallery (0)
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    featured (0)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}