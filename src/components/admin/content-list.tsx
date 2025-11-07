'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ContentPageListItem } from '@/types/content'
import { useT } from '@/hooks/use-t'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Globe, 
  Calendar,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Filter
} from 'lucide-react'
import Link from 'next/link'

interface ContentListProps {
  onCreateNew: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPreview: (id: string) => void
  onTogglePublished: (id: string, published: boolean) => void
}

export function ContentList({
  onCreateNew,
  onEdit,
  onDelete,
  onPreview,
  onTogglePublished
}: ContentListProps) {
  const { t } = useT()
  const [pages, setPages] = useState<ContentPageListItem[]>([])
  const [filteredPages, setFilteredPages] = useState<ContentPageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'unpublished'>('all')
  const [sortBy, setSortBy] = useState<'updatedAt' | 'title' | 'slug'>('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchPages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        includeUnpublished: 'true',
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/content?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching content pages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [sortBy, sortOrder])

  useEffect(() => {
    let filtered = [...pages]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(page => 
        page.slug.toLowerCase().includes(query) ||
        page.translations.some(t => 
          t.title.toLowerCase().includes(query) ||
          t.excerpt.toLowerCase().includes(query)
        )
      )
    }

    // Apply language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(page =>
        page.translations.some(t => t.languageCode === selectedLanguage)
      )
    }

    // Apply published filter
    if (publishedFilter !== 'all') {
      filtered = filtered.filter(page => 
        publishedFilter === 'published' ? page.published : !page.published
      )
    }

    setFilteredPages(filtered)
  }, [pages, searchQuery, selectedLanguage, publishedFilter])

  const handleTogglePublished = async (id: string, currentPublished: boolean) => {
    try {
      const endpoint = currentPublished ? 'DELETE' : 'POST'
      const response = await fetch(`/api/content/${id}/publish`, {
        method: endpoint
      })

      if (response.ok) {
        await fetchPages()
        onTogglePublished(id, !currentPublished)
      }
    } catch (error) {
      console.error('Error toggling published status:', error)
    }
  }

  const getAvailableLanguages = () => {
    const languages = new Set<string>()
    pages.forEach(page => {
      page.translations.forEach(t => {
        languages.add(t.languageCode)
      })
    })
    return Array.from(languages).sort()
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.contentPages')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('admin.manageContentPages')}</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t('admin.newPage')}
        </Button>
      </div>

      {/* Filters */}
      <div className="glass border border-white/20 dark:border-gray-700/30 p-4 rounded-xl shadow-lg space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('admin.searchPages')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">{t('admin.allLanguages')}</option>
            {getAvailableLanguages().map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Published Filter */}
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">{t('admin.allStatus')}</option>
            <option value="published">{t('admin.published')}</option>
            <option value="unpublished">{t('admin.unpublished')}</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-')
              setSortBy(by as any)
              setSortOrder(order as any)
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="updatedAt-desc">Latest First</option>
            <option value="updatedAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="slug-asc">Slug A-Z</option>
            <option value="slug-desc">Slug Z-A</option>
          </select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredPages.length} of {pages.length} pages
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredPages.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Globe className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content pages found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || selectedLanguage !== 'all' || publishedFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by creating your first content page.'
              }
            </p>
            {!searchQuery && selectedLanguage === 'all' && publishedFilter === 'all' && (
              <Button onClick={onCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Page
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Languages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPages.map((page) => {
                  const defaultTranslation = page.translations[0]
                  
                  return (
                    <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {defaultTranslation?.title || 'Untitled'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            /{page.slug}
                          </div>
                          {defaultTranslation?.excerpt && (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                              {defaultTranslation.excerpt}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {page.translations.map((translation) => (
                            <span
                              key={translation.languageId}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {translation.languageCode.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTogglePublished(page.id, page.published)}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            page.published
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {page.published ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(page.updatedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPreview(page.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(page.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(page.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}