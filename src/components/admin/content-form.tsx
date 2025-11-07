'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from './rich-text-editor'
import { ContentPageFormData, ContentTranslationFormData, JSONContent } from '@/types/content'
import { ContentValidator } from '@/lib/content-validation'
import { ContentService } from '@/lib/content-service'
import { Save, Eye, Globe, AlertCircle, CheckCircle, Loader2, Languages } from 'lucide-react'
import { useT } from '@/hooks/use-t'

interface ContentFormProps {
  initialData?: ContentPageFormData
  pageId?: string // Page ID for edit mode (to exclude from slug validation)
  languages: Array<{ id: string; code: string; name: string; isDefault: boolean; isActive?: boolean }>
  onSave: (data: ContentPageFormData) => Promise<void>
  onPreview?: (data: ContentPageFormData, languageCode: string) => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export function ContentForm({
  initialData,
  pageId,
  languages,
  onSave,
  onPreview,
  isLoading = false,
  mode = 'create'
}: ContentFormProps) {
  const { t } = useT()
  const [formData, setFormData] = useState<ContentPageFormData>(() => ({
    slug: initialData?.slug || '',
    published: initialData?.published || false,
    translations: initialData?.translations || []
  }))

  const [activeLanguage, setActiveLanguage] = useState(
    languages.find(l => l.isDefault)?.code || languages[0]?.code || 'nl'
  )
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [slugValidation, setSlugValidation] = useState<{
    isValid: boolean
    isAvailable: boolean
    error?: string
    suggestions?: string[]
  } | null>(null)
  const [isValidatingSlug, setIsValidatingSlug] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationStatus, setTranslationStatus] = useState<string>('')
  const [apiConfigured, setApiConfigured] = useState(false)

  // Check if translation API is configured
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch('/api/admin/translations/check-api')
        if (response.ok) {
          const data = await response.json()
          setApiConfigured(data.configured)
        }
      } catch (error) {
        console.error('Error checking API:', error)
      }
    }
    checkAPI()
  }, [])

  // Initialize translations when languages are loaded
  useEffect(() => {
    if (languages.length > 0 && formData.translations.length === 0 && !initialData) {
      setFormData(prev => ({
        ...prev,
        translations: languages.map(lang => ({
          languageId: lang.id,
          title: '',
          content: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [] }]
          }
        }))
      }))
    }
  }, [languages, formData.translations.length, initialData])

  // Get current translation
  const currentTranslation = formData.translations.find(t => {
    const lang = languages.find(l => l.id === t.languageId)
    return lang?.code === activeLanguage
  })



  // Validate slug when it changes
  useEffect(() => {
    const validateSlug = async () => {
      if (!formData.slug || formData.slug.length < 2) {
        setSlugValidation(null)
        return
      }

      setIsValidatingSlug(true)
      try {
        const response = await fetch('/api/content/validate-slug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: formData.slug,
            excludeId: mode === 'edit' ? pageId : undefined
          })
        })

        if (response.ok) {
          const result = await response.json()
          setSlugValidation(result)
        }
      } catch (error) {
        console.error('Error validating slug:', error)
      } finally {
        setIsValidatingSlug(false)
      }
    }

    const timeoutId = setTimeout(validateSlug, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.slug, mode, pageId])

  const updateSlug = (value: string) => {
    setFormData(prev => ({ ...prev, slug: value }))
  }

  const generateSlugFromTitle = () => {
    if (currentTranslation?.title) {
      const generatedSlug = ContentService.generateSlug(currentTranslation.title)
      updateSlug(generatedSlug)
    }
  }

  const updateTranslation = (field: keyof ContentTranslationFormData, value: any) => {
    if (!currentTranslation) return

    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(t => {
        const lang = languages.find(l => l.id === t.languageId)
        if (lang?.code === activeLanguage) {
          return { ...t, [field]: value }
        }
        return t
      })
    }))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validate slug
    if (!formData.slug) {
      errors.slug = 'Slug is required'
    } else if (!ContentValidator.isValidSlug(formData.slug)) {
      errors.slug = 'Invalid slug format'
    } else if (slugValidation && !slugValidation.isAvailable) {
      errors.slug = 'Slug is not available'
    }

    // Only require default language to be complete
    const defaultLang = languages.find(l => l.isDefault)
    formData.translations.forEach((translation, index) => {
      const lang = languages.find(l => l.id === translation.languageId)
      if (!lang) return

      // Only validate default language as required
      if (lang.isDefault) {
        if (!translation.title.trim()) {
          errors[`translation_${lang.code}_title`] = `Title is required for ${lang.name} (default language)`
        }

        if (!translation.content || ContentValidator.extractPlainText(translation.content).trim().length === 0) {
          errors[`translation_${lang.code}_content`] = `Content is required for ${lang.name} (default language)`
        }
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  const handlePreview = () => {
    if (onPreview) {
      onPreview(formData, activeLanguage)
    }
  }

  const handleTranslateAll = async () => {
    if (!currentTranslation || !apiConfigured) return

    const sourceLang = languages.find(l => l.code === activeLanguage)
    if (!sourceLang) return

    const sourceTitle = currentTranslation.title.trim()
    const sourceContent = currentTranslation.content

    if (!sourceTitle && (!sourceContent || ContentValidator.extractPlainText(sourceContent).trim().length === 0)) {
      alert('Please enter content in the current language before translating')
      return
    }

    setIsTranslating(true)
    setTranslationStatus('Translating...')

    try {
      // Filter for active languages (exclude current language)
      // If isActive is undefined, treat as active (for backwards compatibility)
      const targetLangs = languages
        .filter(l => {
          const isNotCurrent = l.code !== activeLanguage
          const isActive = l.isActive !== false // true or undefined means active
          return isNotCurrent && isActive
        })
        .map(l => l.code)
      
      console.log('Available languages:', languages.map(l => ({ code: l.code, name: l.name, isActive: l.isActive, isDefault: l.isDefault })))
      console.log('Current active language:', activeLanguage)
      console.log('Target languages for translation:', targetLangs)
      
      if (targetLangs.length === 0) {
        const availableCodes = languages.map(l => l.code).join(', ')
        setTranslationStatus(`No other active languages found. Available: ${availableCodes}. Make sure other languages are enabled in Settings.`)
        setIsTranslating(false)
        return
      }

      // Translate title
      let titleTranslations: Record<string, string> = {}
      if (sourceTitle) {
        setTranslationStatus('Translating titles...')
        const titleResponse = await fetch('/api/admin/translate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: sourceTitle,
            fromLang: activeLanguage,
            toLangs: targetLangs,
            contentType: 'text'
          })
        })

        if (titleResponse.ok) {
          const titleData = await titleResponse.json()
          titleTranslations = titleData.translations || {}
          console.log('Title translation response:', titleData)
        } else {
          const errorData = await titleResponse.json().catch(() => ({}))
          console.error('Title translation failed:', errorData)
        }
      }

      // Translate content (extract plain text, translate, then reconstruct)
      let contentTranslations: Record<string, any> = {}
      if (sourceContent && ContentValidator.extractPlainText(sourceContent).trim().length > 0) {
        setTranslationStatus('Translating content...')
        const plainText = ContentValidator.extractPlainText(sourceContent)
        
        const contentResponse = await fetch('/api/admin/translate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: JSON.stringify(sourceContent),
            fromLang: activeLanguage,
            toLangs: targetLangs,
            contentType: 'richText'
          })
        })

        if (contentResponse.ok) {
          const contentData = await contentResponse.json()
          console.log('Content translation response:', contentData)
          
          // For rich text, we'll create simple paragraph structures with translated text
          for (const [langCode, translatedText] of Object.entries(contentData.translations)) {
            if (translatedText && typeof translatedText === 'string' && translatedText.trim()) {
              // Split by newlines and create paragraphs
              const lines = translatedText.split('\n').filter(line => line.trim())
              
              if (lines.length > 0) {
                // Create a paragraph for each non-empty line, or combine into one
                const paragraphs = lines.map(line => ({
                  type: 'paragraph' as const,
                  content: [{
                    type: 'text' as const,
                    text: line.trim()
                  }]
                }))
                
                contentTranslations[langCode] = {
                  type: 'doc',
                  content: paragraphs.length > 0 ? paragraphs : [{
                    type: 'paragraph',
                    content: [{
                      type: 'text',
                      text: translatedText.trim()
                    }]
                  }]
                }
                console.log(`Created content translation for ${langCode}:`, contentTranslations[langCode])
              }
            }
          }
        }
      }

      // Update form data with translations
      const translatedLanguages: string[] = []
      console.log('Title translations:', titleTranslations)
      console.log('Content translations:', contentTranslations)
      
      setFormData(prev => {
        console.log('Current form translations:', prev.translations.map((t: any) => {
          const lang = languages.find(l => l.id === t.languageId)
          return lang?.code
        }))
        // Create a map of existing translations by language ID
        const existingTranslations = new Map(prev.translations.map(t => [t.languageId, t]))
        
        // Update or create translations for all target languages
        const updatedTranslations = languages.map(lang => {
          // Skip current language
          if (lang.code === activeLanguage) {
            const existing = existingTranslations.get(lang.id)
            return existing || {
              languageId: lang.id,
              title: '',
              content: { type: 'doc', content: [{ type: 'paragraph', content: [] }] }
            }
          }

          // Get existing translation or create new one
          const existing = existingTranslations.get(lang.id) || {
            languageId: lang.id,
            title: '',
            content: { type: 'doc', content: [{ type: 'paragraph', content: [] }] }
          }

          const updatedTranslation: typeof existing = { ...existing }
          let hasUpdate = false
          
          // Update title if translation exists
          if (titleTranslations[lang.code] && titleTranslations[lang.code].trim()) {
            console.log(`Updating title for ${lang.code}: "${titleTranslations[lang.code]}"`)
            updatedTranslation.title = titleTranslations[lang.code].trim()
            hasUpdate = true
          }
          
          // Update content if translation exists
          if (contentTranslations[lang.code]) {
            const content = contentTranslations[lang.code]
            // Check if content has actual text
            const hasText = ContentValidator.extractPlainText(content).trim().length > 0
            if (hasText) {
              console.log(`Updating content for ${lang.code}`)
              updatedTranslation.content = content
              hasUpdate = true
            } else {
              console.log(`Skipping empty content for ${lang.code}`)
            }
          }

          if (hasUpdate) {
            translatedLanguages.push(lang.name)
            console.log(`✓ Translation updated for ${lang.name} (${lang.code})`)
          } else if (existingTranslations.has(lang.id)) {
            // Keep existing translation even if no update
            console.log(`Keeping existing translation for ${lang.name} (${lang.code})`)
          } else {
            console.log(`✗ No translation update for ${lang.name} (${lang.code})`)
          }

          return updatedTranslation
        })

        const updated = {
          ...prev,
          translations: updatedTranslations
        }
        
        console.log('Updated form data translations:', updated.translations.map(t => {
          const lang = languages.find(l => l.id === t.languageId)
          return {
            lang: lang?.code,
            hasTitle: !!t.title?.trim(),
            hasContent: ContentValidator.extractPlainText(t.content).trim().length > 0
          }
        }))
        return updated
      })

      const langList = translatedLanguages.length > 0 
        ? ` (${translatedLanguages.join(', ')})`
        : ''
      setTranslationStatus(`Translation complete! Translated to ${translatedLanguages.length} language(s)${langList}. Don't forget to save your changes.`)
      setTimeout(() => setTranslationStatus(''), 7000)
    } catch (error) {
      console.error('Error translating:', error)
      setTranslationStatus('Translation failed. Please try again.')
      setTimeout(() => setTranslationStatus(''), 5000)
    } finally {
      setIsTranslating(false)
    }
  }

  const getSlugStatus = () => {
    if (isValidatingSlug) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
    }

    if (!slugValidation) {
      return null
    }

    if (slugValidation.isValid && slugValidation.isAvailable) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    return <AlertCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Settings */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('content.pageSettings')}</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {t('content.slug')}
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={formData.slug}
                  onChange={(e) => updateSlug(e.target.value)}
                  placeholder="page-slug"
                  className={validationErrors.slug ? 'border-red-500' : ''}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getSlugStatus()}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateSlugFromTitle}
                disabled={!currentTranslation?.title}
              >
                {t('content.generateFromTitle')}
              </Button>
            </div>
            {validationErrors.slug && (
              <p className="text-sm text-red-600 mt-1">{validationErrors.slug}</p>
            )}
            {slugValidation?.error && (
              <p className="text-sm text-red-600 mt-1">{slugValidation.error}</p>
            )}
            {slugValidation?.suggestions && slugValidation.suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Suggestions:</p>
                <div className="flex gap-2 mt-1">
                  {slugValidation.suggestions.slice(0, 3).map(suggestion => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateSlug(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              {t('content.published')}
            </label>
          </div>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/50">
          <div className="px-6 pt-4 pb-2">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
              {t('project.translations')}
            </h4>
          </div>
          <nav className="flex space-x-2 px-6 pb-2">
            {languages.map(language => {
              const translation = formData.translations.find(t => t.languageId === language.id)
              const hasContent = translation?.title || (translation?.content && 
                ContentValidator.extractPlainText(translation.content).trim().length > 0)
              
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => setActiveLanguage(language.code)}
                  className={`py-3 px-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-all duration-200 rounded-t-xl ${
                    activeLanguage === language.code
                      ? 'border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase font-bold">{language.code}</span>
                  <span>{language.name}</span>
                  {language.isDefault && (
                    <span className="text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 py-1 rounded-full shadow-sm">
                      {t('content.default')}
                    </span>
                  )}
                  {hasContent && (
                    <span title="Has content">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </span>
                  )}
                  {!hasContent && activeLanguage === language.code && (
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">(Empty)</span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Translation Content */}
        <div className="p-6">
          {currentTranslation && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('content.editLanguage').replace('{language}', languages.find(l => l.code === activeLanguage)?.name || activeLanguage)}
                  </span>
                </div>
                {apiConfigured && languages.filter(l => l.code !== activeLanguage && (l.isActive !== false)).length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTranslateAll}
                    disabled={isTranslating || !currentTranslation?.title?.trim()}
                    className="flex items-center gap-2"
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{translationStatus || 'Translating...'}</span>
                      </>
                    ) : (
                      <>
                        <Languages className="h-4 w-4" />
                        <span>{t('content.translateToAll')}</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              {translationStatus && !isTranslating && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">{translationStatus}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t('content.title')} <span className="text-xs font-normal text-gray-500">({languages.find(l => l.code === activeLanguage)?.name})</span>
                </label>
                <Input
                  value={currentTranslation.title}
                  onChange={(e) => updateTranslation('title', e.target.value)}
                  placeholder={t('content.titlePlaceholder')}
                  className={validationErrors[`translation_${activeLanguage}_title`] ? 'border-red-500' : ''}
                />
                {validationErrors[`translation_${activeLanguage}_title`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors[`translation_${activeLanguage}_title`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {t('content.content')} <span className="text-xs font-normal text-gray-500">({languages.find(l => l.code === activeLanguage)?.name})</span>
                </label>
                <RichTextEditor
                  content={currentTranslation.content}
                  onChange={(content) => updateTranslation('content', content)}
                  placeholder={t('content.contentPlaceholder').replace('{language}', languages.find(l => l.code === activeLanguage)?.name || activeLanguage)}
                  className={validationErrors[`translation_${activeLanguage}_content`] ? 'border-red-500' : ''}
                />
                {validationErrors[`translation_${activeLanguage}_content`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors[`translation_${activeLanguage}_content`]}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {onPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              disabled={isLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              {t('content.preview')}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className={translationStatus && !isTranslating ? 'ring-2 ring-green-500 ring-offset-2' : ''}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {mode === 'create' ? t('content.createPage') : t('content.saveChanges')}
          </Button>
        </div>
      </div>
    </div>
  )
}