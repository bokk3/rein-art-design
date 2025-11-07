'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Globe, CheckCircle, AlertCircle } from 'lucide-react'
import { useT } from '@/hooks/use-t'

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

export function ContentTranslations() {
  const { t: useTTranslation } = useT()
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTranslations, setEditingTranslations] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      loadTranslationKeys()
    } else {
      loadTranslationKeys()
    }
  }, [searchQuery])

  const loadData = async () => {
    await Promise.all([loadTranslationKeys(), loadLanguages()])
  }

  const loadTranslationKeys = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('category', 'content') // Only show content category
      if (searchQuery) params.set('search', searchQuery)

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

  const handleEdit = (key: TranslationKey) => {
    const translations: Record<string, string> = {}
    languages.forEach(lang => {
      const existing = key.translations.find(t => t.language.code === lang.code)
      translations[lang.code] = existing?.value || ''
    })
    setEditingTranslations(prev => ({ ...prev, [key.id]: translations }))
  }

  const handleTranslationChange = (keyId: string, langCode: string, value: string) => {
    setEditingTranslations(prev => ({
      ...prev,
      [keyId]: {
        ...prev[keyId],
        [langCode]: value
      }
    }))
  }

  const handleSave = async (key: TranslationKey) => {
    try {
      setSaving(true)
      const translations = editingTranslations[key.id]
      if (!translations) return

      const language = languages.find(l => l.code === key.translations[0]?.language.code || languages[0].code)
      if (!language) return

      // Save each translation
      for (const [langCode, value] of Object.entries(translations)) {
        const lang = languages.find(l => l.code === langCode)
        if (!lang || !value.trim()) continue

        const existing = key.translations.find(t => t.language.code === langCode)
        
        const response = await fetch('/api/admin/translations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keyId: key.id,
            languageId: lang.id,
            value: value.trim()
          })
        })

        if (!response.ok) {
          console.error(`Error saving translation for ${langCode}`)
        }
      }

      // Reload to get updated data
      await loadTranslationKeys()
      setEditingTranslations(prev => {
        const next = { ...prev }
        delete next[key.id]
        return next
      })
    } catch (error) {
      console.error('Error saving translations:', error)
      alert('Error saving translations')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = (keyId: string) => {
    setEditingTranslations(prev => {
      const next = { ...prev }
      delete next[keyId]
      return next
    })
  }

  const getTranslationCoverage = (key: TranslationKey) => {
    const total = languages.length
    const translated = key.translations.length
    return { translated, total, percentage: total > 0 ? Math.round((translated / total) * 100) : 0 }
  }

  if (loading) {
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
            {useTTranslation('admin.contentTranslations') || 'Content Translations'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {useTTranslation('admin.contentTranslationsDesc') || 'Edit translations for your website content (navigation, footer, page titles, etc.)'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="search" className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
            {useTTranslation('admin.search') || 'Search'}
          </Label>
          <Input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={useTTranslation('admin.searchTranslations') || 'Search translation keys...'}
          />
        </div>
      </div>

      {/* Translation Keys List */}
      <div className="space-y-4">
        {translationKeys.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {useTTranslation('admin.noContentTranslations') || 'No content translations found'}
          </div>
        ) : (
          translationKeys.map((key) => {
            const isEditing = editingTranslations[key.id] !== undefined
            const coverage = getTranslationCoverage(key)

            return (
              <div
                key={key.id}
                className="glass border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg p-6 space-y-4"
              >
                {/* Key Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {key.key}
                      </h3>
                      {coverage.percentage === 100 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    {key.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{key.description}</p>
                    )}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      {coverage.translated}/{coverage.total} languages ({coverage.percentage}%)
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => handleEdit(key)}
                      variant="outline"
                      size="sm"
                    >
                      {useTTranslation('button.edit') || 'Edit'}
                    </Button>
                  )}
                </div>

                {/* Translations */}
                {isEditing ? (
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {languages.map((lang) => (
                      <div key={lang.id} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {lang.name} ({lang.code.toUpperCase()})
                          {lang.isDefault && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </Label>
                        <Input
                          value={editingTranslations[key.id]?.[lang.code] || ''}
                          onChange={(e) => handleTranslationChange(key.id, lang.code, e.target.value)}
                          placeholder={`Translation for ${lang.name}...`}
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleSave(key)}
                        disabled={saving}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {useTTranslation('button.save') || 'Save'}
                      </Button>
                      <Button
                        onClick={() => handleCancel(key.id)}
                        variant="outline"
                        size="sm"
                        disabled={saving}
                      >
                        {useTTranslation('button.cancel') || 'Cancel'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {languages.map((lang) => {
                      const translation = key.translations.find(t => t.language.code === lang.code)
                      return (
                        <div key={lang.id} className="space-y-1">
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {lang.name}
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {translation?.value || (
                              <span className="text-gray-400 italic">Not translated</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

