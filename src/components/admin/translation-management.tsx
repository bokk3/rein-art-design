'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface TranslationKey {
  id: string
  key: string
  category: string
  description?: string
  translations: Array<{
    id: string
    languageId: string
    language: {
      id: string
      code: string
      name: string
    }
    value: string
  }>
}

interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
}

type ViewMode = 'list' | 'edit' | 'create'

export function TranslationManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedKey, setSelectedKey] = useState<TranslationKey | null>(null)
  const [editingTranslations, setEditingTranslations] = useState<Record<string, string>>({})
  const [newKey, setNewKey] = useState({ key: '', category: 'ui', description: '' })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (viewMode === 'list') {
      loadTranslationKeys()
    }
  }, [viewMode, searchQuery, categoryFilter])

  const loadData = async () => {
    await Promise.all([loadTranslationKeys(), loadLanguages()])
  }

  const loadTranslationKeys = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (categoryFilter !== 'all') params.set('category', categoryFilter)

      const response = await fetch(`/api/admin/translation-keys?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTranslationKeys(data)
      }
    } catch (error) {
      console.error('Error loading translation keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLanguages = async () => {
    try {
      const response = await fetch('/api/admin/languages')
      if (response.ok) {
        const data = await response.json()
        setLanguages(data.filter((l: Language) => l.isActive))
      }
    } catch (error) {
      console.error('Error loading languages:', error)
    }
  }

  const handleCreateNew = () => {
    setNewKey({ key: '', category: 'ui', description: '' })
    setEditingTranslations({})
    setSelectedKey(null)
    setViewMode('create')
  }

  const handleEdit = (key: TranslationKey) => {
    setSelectedKey(key)
    // Initialize editing translations with existing values
    const translations: Record<string, string> = {}
    key.translations.forEach(t => {
      translations[t.languageId] = t.value
    })
    setEditingTranslations(translations)
    setViewMode('edit')
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      if (viewMode === 'create') {
        // Create new translation key
        const translations = languages
          .filter(lang => editingTranslations[lang.id])
          .map(lang => ({
            languageId: lang.id,
            value: editingTranslations[lang.id]
          }))

        const response = await fetch('/api/admin/translation-keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: newKey.key,
            category: newKey.category,
            description: newKey.description || undefined,
            translations
          })
        })

        if (!response.ok) {
          const error = await response.json()
          alert(error.error || 'Failed to create translation key')
          return
        }
      } else if (viewMode === 'edit' && selectedKey) {
        // Update translations
        const updates = languages
          .filter(lang => editingTranslations[lang.id] !== undefined)
          .map(lang => ({
            keyId: selectedKey.id,
            languageId: lang.id,
            value: editingTranslations[lang.id] || ''
          }))

        await Promise.all(
          updates.map(update =>
            fetch('/api/admin/translations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update)
            })
          )
        )
      }

      // Clear cache and reload (cache is client-side, will be cleared on next page load)
      // The translation hooks will automatically fetch fresh data

      setViewMode('list')
      await loadTranslationKeys()
    } catch (error) {
      console.error('Error saving translations:', error)
      alert('Error saving translations')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this translation key? This will delete all translations for this key.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/translation-keys/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadTranslationKeys()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete translation key')
      }
    } catch (error) {
      console.error('Error deleting translation key:', error)
      alert('Error deleting translation key')
    }
  }

  const getCategories = () => {
    const categories = new Set(translationKeys.map(k => k.category))
    return Array.from(categories).sort()
  }

  const getTranslationCoverage = (key: TranslationKey) => {
    const total = languages.length
    const translated = key.translations.length
    return { translated, total, percentage: total > 0 ? Math.round((translated / total) * 100) : 0 }
  }

  if (loading && viewMode === 'list') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Translation Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage UI text translations for all languages
          </p>
        </div>
        {viewMode === 'list' && (
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Translation Key
          </Button>
        )}
      </div>

      {viewMode === 'list' && (
        <>
          {/* Filters */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search translation keys..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="category" className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                Category
              </Label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {getCategories().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Translation Keys List */}
          <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Coverage
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {translationKeys.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {searchQuery || categoryFilter !== 'all' 
                          ? 'No translation keys found matching your filters'
                          : 'No translation keys yet. Create your first one!'}
                      </td>
                    </tr>
                  ) : (
                    translationKeys.map((key) => {
                      const coverage = getTranslationCoverage(key)
                      return (
                        <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {key.key}
                              </div>
                              {key.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {key.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                              {key.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {coverage.percentage === 100 ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {coverage.translated}/{coverage.total} ({coverage.percentage}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(key)}
                                className="flex items-center gap-1"
                              >
                                <Edit2 className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(key.id)}
                                className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {(viewMode === 'edit' || viewMode === 'create') && (
        <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {viewMode === 'create' ? 'Create Translation Key' : 'Edit Translation Key'}
            </h3>
            <Button variant="outline" onClick={() => setViewMode('list')}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>

          <div className="space-y-6">
            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="key" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Translation Key *
                </Label>
                <Input
                  id="key"
                  value={viewMode === 'create' ? newKey.key : selectedKey?.key || ''}
                  onChange={(e) => {
                    if (viewMode === 'create') {
                      setNewKey({ ...newKey, key: e.target.value })
                    }
                  }}
                  placeholder="button.submit"
                  disabled={viewMode === 'edit'}
                  className="font-mono"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use dot notation (e.g., button.submit, nav.home)
                </p>
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Category *
                </Label>
                <select
                  id="category"
                  value={viewMode === 'create' ? newKey.category : selectedKey?.category || 'ui'}
                  onChange={(e) => {
                    if (viewMode === 'create') {
                      setNewKey({ ...newKey, category: e.target.value })
                    }
                  }}
                  disabled={viewMode === 'edit'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="ui">UI</option>
                  <option value="messages">Messages</option>
                  <option value="errors">Errors</option>
                  <option value="admin">Admin</option>
                  <option value="forms">Forms</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Description (optional)
              </Label>
              <Input
                id="description"
                value={viewMode === 'create' ? newKey.description : selectedKey?.description || ''}
                onChange={(e) => {
                  if (viewMode === 'create') {
                    setNewKey({ ...newKey, description: e.target.value })
                  }
                }}
                placeholder="Help text for translators"
                disabled={viewMode === 'edit'}
              />
            </div>

            {/* Translations */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">
                Translations
              </Label>
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-4">
                    <div className="w-32 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {lang.name}
                      </span>
                      {lang.isDefault && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <Input
                      value={editingTranslations[lang.id] || ''}
                      onChange={(e) => {
                        setEditingTranslations({
                          ...editingTranslations,
                          [lang.id]: e.target.value
                        })
                      }}
                      placeholder={`Translation for ${lang.name}...`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setViewMode('list')}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

