'use client'

import { useState, useEffect } from 'react'
import { ContentList } from './content-list'
import { ContentForm } from './content-form'
import { ContentTranslations } from './content-translations'
import { Button } from '@/components/ui/button'
import { ContentPageFormData, ContentPageWithTranslations } from '@/types/content'
import { ArrowLeft, Loader2, FileText, Globe } from 'lucide-react'

interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
}

type ViewMode = 'list' | 'create' | 'edit' | 'preview'
type TabMode = 'pages' | 'translations'

export function ContentManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [tabMode, setTabMode] = useState<TabMode>('pages')
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState<ContentPageWithTranslations | null>(null)
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        // Fetch all active languages from the database
        const response = await fetch('/api/languages')
        if (response.ok) {
          const languagesData = await response.json()
          console.log('Fetched languages for content form:', languagesData)
          setLanguages(languagesData)
        } else {
          // Fallback to hardcoded languages if API fails
          console.warn('Failed to fetch languages, using fallback')
          setLanguages([
            { id: '1', code: 'nl', name: 'Nederlands', isDefault: true, isActive: true },
            { id: '2', code: 'fr', name: 'Français', isDefault: false, isActive: true }
          ])
        }
      } catch (error) {
        console.error('Error fetching languages:', error)
        // Fallback to hardcoded languages
        setLanguages([
          { id: '1', code: 'nl', name: 'Nederlands', isDefault: true, isActive: true },
          { id: '2', code: 'fr', name: 'Français', isDefault: false, isActive: true }
        ])
      }
    }

    fetchLanguages()
  }, [])

  // Fetch selected page data when editing
  useEffect(() => {
    const fetchPage = async () => {
      if (viewMode === 'edit' && selectedPageId) {
        try {
          setLoading(true)
          const response = await fetch(`/api/content/${selectedPageId}?includeUnpublished=true`)
          if (response.ok) {
            const page = await response.json()
            setSelectedPage(page)
          }
        } catch (error) {
          console.error('Error fetching page:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPage()
  }, [viewMode, selectedPageId])

  const handleCreateNew = () => {
    setSelectedPageId(null)
    setSelectedPage(null)
    setViewMode('create')
  }

  const handleEdit = (id: string) => {
    setSelectedPageId(id)
    setViewMode('edit')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh the list by going back to list view
        setViewMode('list')
      } else {
        alert('Failed to delete page')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page')
    }
  }

  const handlePreview = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content/${id}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languageCode: 'nl' })
      })

      if (response.ok) {
        const preview = await response.json()
        setPreviewData(preview)
        setSelectedPageId(id)
        setViewMode('preview')
      }
    } catch (error) {
      console.error('Error generating preview:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublished = (id: string, published: boolean) => {
    // This is handled by the ContentList component
    console.log(`Page ${id} ${published ? 'published' : 'unpublished'}`)
  }

  const handleSave = async (data: ContentPageFormData) => {
    try {
      setLoading(true)

      const url = viewMode === 'create' 
        ? '/api/content'
        : `/api/content/${selectedPageId}`

      const method = viewMode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setViewMode('list')
      } else {
        const error = await response.json()
        alert(`Failed to save page: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving page:', error)
      alert('Failed to save page')
    } finally {
      setLoading(false)
    }
  }

  const handleFormPreview = async (data: ContentPageFormData, languageCode: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content/${selectedPageId || 'new'}/preview`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, languageCode })
      })

      if (response.ok) {
        const preview = await response.json()
        setPreviewData(preview)
        setViewMode('preview')
      }
    } catch (error) {
      console.error('Error generating preview:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedPageId(null)
    setSelectedPage(null)
    setPreviewData(null)
  }

  const getFormInitialData = (): ContentPageFormData | undefined => {
    if (!selectedPage) return undefined

    return {
      slug: selectedPage.slug,
      published: selectedPage.published,
      translations: selectedPage.translations.map(t => ({
        languageId: t.languageId,
        title: t.title,
        content: t.content as any
      }))
    }
  }

  if (loading && (viewMode === 'edit' || viewMode === 'preview')) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation */}
      {viewMode !== 'list' && (
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div className="text-sm text-gray-600">
            {viewMode === 'create' && 'Create New Page'}
            {viewMode === 'edit' && 'Edit Page'}
            {viewMode === 'preview' && 'Preview Page'}
          </div>
        </div>
      )}

      {/* Tabs for list view */}
      {viewMode === 'list' && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setTabMode('pages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                tabMode === 'pages'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              Content Pages
            </button>
            <button
              onClick={() => setTabMode('translations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                tabMode === 'translations'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Globe className="h-4 w-4" />
              Content Translations
            </button>
          </nav>
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'list' && tabMode === 'pages' && (
        <ContentList
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onTogglePublished={handleTogglePublished}
        />
      )}

      {viewMode === 'list' && tabMode === 'translations' && (
        <ContentTranslations />
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <ContentForm
          initialData={getFormInitialData()}
          pageId={selectedPageId || undefined}
          languages={languages}
          onSave={handleSave}
          onPreview={handleFormPreview}
          isLoading={loading}
          mode={viewMode}
        />
      )}

      {viewMode === 'preview' && previewData && (
        <div className="bg-white rounded-lg border p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {previewData.translation?.title || 'Untitled'}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Slug: /{previewData.slug}</span>
              <span>Language: {previewData.translation?.language?.name}</span>
              <span>Status: {previewData.published ? 'Published' : 'Draft'}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            {previewData.translation?.content && (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: JSON.stringify(previewData.translation.content) 
                }} 
              />
            )}
          </div>

          {previewData.meta && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Meta Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Excerpt:</span>
                  <p className="text-gray-600">{previewData.meta.excerpt}</p>
                </div>
                <div>
                  <span className="font-medium">Word Count:</span>
                  <p className="text-gray-600">{previewData.meta.wordCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}