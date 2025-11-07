'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Globe, Plus, Trash2, Check, X, Star, Settings2, Languages, Loader2 } from 'lucide-react'
import { TranslationManagement } from './translation-management'
import { useT } from '@/hooks/use-t'

interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
  coverage?: {
    totalKeys: number
    translatedKeys: number
    coverage: number
    missingKeys: string[]
  }
}

export function LanguageSettings() {
  const { t } = useT()
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showTranslations, setShowTranslations] = useState(false)
  const [newLanguage, setNewLanguage] = useState({ code: '', name: '' })
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [translating, setTranslating] = useState<string | null>(null)
  const [translationStatus, setTranslationStatus] = useState<Record<string, { status: 'idle' | 'translating' | 'success' | 'error', message?: string }>>({})
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    loadLanguages()
    checkAPIConfiguration()
  }, [])

  const checkAPIConfiguration = async () => {
    try {
      const response = await fetch('/api/admin/translations/check-api')
      if (response.ok) {
        const data = await response.json()
        setApiConfigured(data.configured)
      }
    } catch (error) {
      console.error('Error checking API configuration:', error)
      setApiConfigured(false)
    }
  }

  const loadLanguages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/languages')
      if (response.ok) {
        const data = await response.json()
        setLanguages(data)
      }
    } catch (error) {
      console.error('Error loading languages:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLanguage = async (id: string, updates: Partial<Language>) => {
    try {
      setSaving(id)
      const response = await fetch(`/api/admin/languages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await loadLanguages()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update language')
      }
    } catch (error) {
      console.error('Error updating language:', error)
      alert('Error updating language')
    } finally {
      setSaving(null)
    }
  }

  const createLanguage = async () => {
    if (!newLanguage.code || !newLanguage.name) {
      alert('Please provide both code and name')
      return
    }

    try {
      setSaving('new')
      const response = await fetch('/api/admin/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: newLanguage.code.toLowerCase(),
          name: newLanguage.name,
          isActive: true,
          isDefault: languages.length === 0, // Set as default if first language
          autoTranslate: autoTranslate && apiConfigured
        })
      })

      if (response.ok) {
        const newLang = await response.json()
        setNewLanguage({ code: '', name: '' })
        setShowAddForm(false)
        await loadLanguages()
        
        if (autoTranslate && apiConfigured) {
          setTranslationStatus(prev => ({
            ...prev,
            [newLang.id]: { status: 'success', message: 'Auto-translated on creation' }
          }))
        }
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create language')
      }
    } catch (error) {
      console.error('Error creating language:', error)
      alert('Error creating language')
    } finally {
      setSaving(null)
    }
  }

  const translateMissing = async (languageId: string) => {
    try {
      setTranslating(languageId)
      setTranslationStatus(prev => ({
        ...prev,
        [languageId]: { status: 'translating', message: 'Translating missing keys...' }
      }))

      const response = await fetch(`/api/admin/languages/${languageId}/translate-missing`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        setTranslationStatus(prev => ({
          ...prev,
          [languageId]: { 
            status: 'success', 
            message: `${data.translated} translations added${data.failed > 0 ? `, ${data.failed} failed` : ''}` 
          }
        }))
        await loadLanguages() // Reload to update coverage
      } else {
        const error = await response.json()
        setTranslationStatus(prev => ({
          ...prev,
          [languageId]: { status: 'error', message: error.error || 'Translation failed' }
        }))
      }
    } catch (error) {
      console.error('Error translating missing:', error)
      setTranslationStatus(prev => ({
        ...prev,
        [languageId]: { status: 'error', message: 'Translation failed' }
      }))
    } finally {
      setTranslating(null)
    }
  }

  const deleteLanguage = async (id: string) => {
    const language = languages.find(l => l.id === id)
    if (!language) return

    if (language.isDefault) {
      alert('Cannot delete the default language')
      return
    }

    if (!confirm(`Are you sure you want to delete ${language.name} (${language.code})?`)) {
      return
    }

    try {
      setSaving(id)
      const response = await fetch(`/api/admin/languages/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadLanguages()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete language')
      }
    } catch (error) {
      console.error('Error deleting language:', error)
      alert('Error deleting language')
    } finally {
      setSaving(null)
    }
  }

  const toggleActive = (language: Language) => {
    updateLanguage(language.id, { isActive: !language.isActive })
  }

  const setDefault = (language: Language) => {
    if (!language.isActive) {
      alert('Cannot set an inactive language as default')
      return
    }
    updateLanguage(language.id, { isDefault: true })
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Language Management
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowTranslations(!showTranslations)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings2 className="h-4 w-4" />
            {showTranslations ? 'Hide' : 'Show'} System Translations
          </Button>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Language
          </Button>
        </div>
      </div>

      {/* Add Language Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Add New Language
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-code" className="text-sm text-gray-700 dark:text-gray-300">
                Language Code (e.g., en, fr, de)
              </Label>
              <Input
                id="new-code"
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                placeholder="en"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-name" className="text-sm text-gray-700 dark:text-gray-300">
                Language Name (e.g., English, Français)
              </Label>
              <Input
                id="new-name"
                value={newLanguage.name}
                onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                placeholder="English"
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Auto-translate option */}
          {apiConfigured && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Automatically translate all existing keys using DeepL
                </span>
              </label>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 ml-6">
                This will translate all existing translation keys from the default language to the new language.
              </p>
            </div>
          )}

          {apiConfigured === false && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Translation API not configured. Add DEEPL_API_KEY to your environment variables to enable auto-translation.
              </p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button
              onClick={createLanguage}
              disabled={saving === 'new'}
              size="sm"
            >
              {saving === 'new' ? 'Creating...' : 'Create Language'}
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false)
                setNewLanguage({ code: '', name: '' })
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Languages List */}
      <div className="space-y-3">
        {languages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No languages configured. Add your first language above.
          </div>
        ) : (
          languages.map((language) => (
            <div
              key={language.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                language.isDefault
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              } ${!language.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Default Badge */}
                  {language.isDefault && (
                    <Star className="h-5 w-5 text-blue-500 fill-blue-500" />
                  )}

                  {/* Language Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {language.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({language.code.toUpperCase()})
                      </span>
                      {!language.isActive && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Translation Coverage */}
                    {language.coverage && (
                      <div className="mt-1 space-y-1">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium">
                            {language.coverage.translatedKeys} / {language.coverage.totalKeys}
                          </span>
                          {' '}translations ({Math.round(language.coverage.coverage)}%)
                        </div>
                        {language.coverage.coverage < 100 && apiConfigured && (
                          <Button
                            onClick={() => translateMissing(language.id)}
                            disabled={translating === language.id}
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs mt-1"
                          >
                            {translating === language.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Translating...
                              </>
                            ) : (
                              <>
                                <Languages className="h-3 w-3 mr-1" />
                                Translate Missing
                              </>
                            )}
                          </Button>
                        )}
                        {translationStatus[language.id] && (
                          <div className={`text-xs mt-1 ${
                            translationStatus[language.id].status === 'success' 
                              ? 'text-green-600 dark:text-green-400' 
                              : translationStatus[language.id].status === 'error'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {translationStatus[language.id].message}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Set Default Button */}
                  {!language.isDefault && language.isActive && (
                    <Button
                      onClick={() => setDefault(language)}
                      variant="outline"
                      size="sm"
                      disabled={saving === language.id}
                      className="flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" />
                      Set Default
                    </Button>
                  )}

                  {/* Toggle Active */}
                  <button
                    onClick={() => toggleActive(language)}
                    disabled={saving === language.id || language.isDefault}
                    className={`p-2 rounded-lg border transition-all ${
                      language.isActive
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-400'
                    } ${language.isDefault ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                    title={language.isDefault ? 'Cannot disable default language' : language.isActive ? 'Disable' : 'Enable'}
                  >
                    {language.isActive ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>

                  {/* Delete Button */}
                  {!language.isDefault && (
                    <button
                      onClick={() => deleteLanguage(language.id)}
                      disabled={saving === language.id}
                      className="p-2 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:opacity-80 transition-opacity disabled:opacity-50"
                      title="Delete language"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Text */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> The default language is used as a fallback when translations are missing.
          You cannot disable or delete the default language. Translation coverage shows how many UI strings
          have been translated for each language.
        </p>
      </div>

      {/* System Translations Section */}
      {showTranslations && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
              System Translations
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced: Manage all system translation keys including admin UI and system messages.
              For content translations (navigation, footer, etc.), use the Content Manager.
            </p>
          </div>
          <TranslationManagement />
        </div>
      )}
    </div>
  )
}

