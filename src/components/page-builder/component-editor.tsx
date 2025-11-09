'use client'

import { useState, useEffect, useMemo } from 'react'
import { PageComponent, ComponentData, MultilingualText, HeroTextBlock, HeroLayout, HeroElementType, HeroTextBlockType } from '@/types/page-builder'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MediaLibrary } from '@/components/admin/media-library'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Globe, CheckCircle, AlertCircle, Copy, Star, Languages, Loader2, Plus, Trash2, GripVertical, MoveUp, MoveDown, Image as ImageIcon, Type, MousePointerClick, Upload, X } from 'lucide-react'
import { useT } from '@/hooks/use-t'

interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
}

interface ComponentEditorProps {
  component: PageComponent
  onChange: (data: ComponentData) => void
}

export function ComponentEditor({ component, onChange }: ComponentEditorProps) {
  const { t } = useT()
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaSelectionMode, setMediaSelectionMode] = useState<'single' | 'multiple'>('single')
  const [mediaTarget, setMediaTarget] = useState<string>('')
  const [languages, setLanguages] = useState<Language[]>([])
  const [activeLanguage, setActiveLanguage] = useState('nl')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationStatus, setTranslationStatus] = useState<string>('')
  const [apiConfigured, setApiConfigured] = useState(false)
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const [expandedHeroElement, setExpandedHeroElement] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [opacitySliderValues, setOpacitySliderValues] = useState<Record<string, number>>({})
  
  // Fetch featured projects count for carousel auto-enable logic
  useEffect(() => {
    if (component.type === 'gallery' && component.data.showFeatured) {
      fetch('/api/projects?featured=true')
        .then(res => res.json())
        .then(data => setFeaturedProjects(data.projects || []))
        .catch(() => setFeaturedProjects([]))
    }
  }, [component.type, component.data.showFeatured])

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages')
        if (response.ok) {
          const langs = await response.json()
          setLanguages(langs)
          const defaultLang = langs.find((l: Language) => l.isDefault)
          setActiveLanguage(defaultLang?.code || 'nl')
        }
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }
    fetchLanguages()
  }, [])

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

  const updateData = (key: string, value: any) => {
    const updatedData = {
      ...component.data,
      [key]: value
    }
    onChange(updatedData)
  }
  
  // Use a local state to track the overlay opacity for immediate UI feedback
  const [localOverlayOpacity, setLocalOverlayOpacity] = useState(component.data.backgroundOverlayOpacity ?? 0)
  
  useEffect(() => {
    setLocalOverlayOpacity(component.data.backgroundOverlayOpacity ?? 0)
  }, [component.data.backgroundOverlayOpacity])

  const updateMultilingualText = (key: string, languageCode: string, value: string) => {
    const currentValue = component.data[key as keyof ComponentData] as MultilingualText | undefined
    const updatedValue = {
      ...currentValue,
      [languageCode]: value
    }
    updateData(key, updatedValue)
  }

  const getMultilingualText = (key: string, languageCode: string): string => {
    const value = component.data[key as keyof ComponentData] as MultilingualText | string | undefined
    if (!value) return ''
    if (typeof value === 'string') return value
    return value[languageCode] || ''
  }

  const handleMediaSelect = (media: any) => {
    if (mediaTarget === 'backgroundImage' || mediaTarget === 'imageUrl') {
      updateData(mediaTarget, media.originalUrl)
    } else if (mediaTarget && mediaTarget.startsWith('logo-')) {
      // Handle logo selection for hero elements
      const elementId = mediaTarget.replace('logo-', '')
      const elements = normalizeHeroElements()
      const element = elements.find(el => el.id === elementId)
      if (element) {
        updateHeroElement(elementId, { logoUrl: media.originalUrl })
      }
    }
    setShowMediaLibrary(false)
  }

  const handleMediaSelectMultiple = (mediaList: any[]) => {
    if (mediaTarget === 'images') {
      const images = mediaList.map(media => ({
        id: media.id,
        url: media.originalUrl,
        alt: media.alt,
        caption: ''
      }))
      updateData('images', images)
    } else if (mediaTarget === 'showcaseImages') {
      const images = mediaList.map(media => ({
        id: media.id,
        url: media.originalUrl,
        alt: media.alt || '',
        caption: ''
      }))
      // If there are existing images, append; otherwise replace
      const existingImages = component.data.showcaseImages || []
      updateData('showcaseImages', [...existingImages, ...images])
    }
    setShowMediaLibrary(false)
  }

  const openMediaLibrary = (target: string, mode: 'single' | 'multiple' = 'single') => {
    setMediaTarget(target)
    setMediaSelectionMode(mode)
    setShowMediaLibrary(true)
  }

  // Handle file upload for gallery and other components
  const handleFileUpload = async (files: FileList | null, target: 'gallery' | 'showcase' | 'background' | 'logo') => {
    if (!files || files.length === 0) return

    if (target === 'gallery') {
      setUploadingGallery(true)
    }

    try {
      const uploadedImages: Array<{ id: string; url: string; alt: string; caption?: string }> = []

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
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to upload ${file.name}: ${response.status}`)
        }

        const result = await response.json()
        
        if (!result.originalUrl || !result.thumbnailUrl) {
          throw new Error(`Invalid response from server for ${file.name}`)
        }
        
        uploadedImages.push({
          id: result.id || `uploaded-${Date.now()}-${i}`,
          url: result.originalUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          caption: ''
        })
      }

      if (uploadedImages.length > 0) {
        if (target === 'gallery') {
          const existingImages = component.data.images || []
          updateData('images', [...existingImages, ...uploadedImages])
        } else if (target === 'showcase') {
          const existingImages = component.data.showcaseImages || []
          updateData('showcaseImages', [...existingImages, ...uploadedImages])
        } else if (target === 'background') {
          updateData('backgroundImage', uploadedImages[0].url)
        } else if (target === 'logo') {
          // Logo upload is handled separately for hero elements
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload images. Please try again.'
      alert(errorMessage)
    } finally {
      if (target === 'gallery') {
        setUploadingGallery(false)
      }
    }
  }

  // Drag and drop handlers for gallery
  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files, 'gallery')
  }

  const handleGalleryDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleGalleryDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  // Sync opacity slider values when elements change
  useEffect(() => {
    if (component.data.heroElements && Array.isArray(component.data.heroElements)) {
      const newValues: Record<string, number> = {}
      component.data.heroElements.forEach((el: HeroTextBlock) => {
        if (el.opacity !== undefined) {
          newValues[el.id] = el.opacity
        }
      })
      setOpacitySliderValues(prev => {
        // Only update if values actually changed to avoid unnecessary re-renders
        const hasChanges = Object.keys(newValues).some(id => prev[id] !== newValues[id])
        return hasChanges ? { ...prev, ...newValues } : prev
      })
    }
  }, [component.data.heroElements])

  // Hero builder helpers
  const normalizeHeroElements = (): HeroTextBlock[] => {
    if (component.data.heroElements && Array.isArray(component.data.heroElements) && component.data.heroElements.length > 0) {
      return component.data.heroElements.sort((a, b) => a.order - b.order)
    }
    // Convert legacy format
    const elements: HeroTextBlock[] = []
    let order = 0
    if (component.data.title) {
      elements.push({
        id: 'legacy-title',
        type: 'text',
        textType: 'heading',
        content: component.data.title,
        fontSize: '7xl',
        fontWeight: 'bold',
        order: order++,
        visible: true
      })
    }
    if (component.data.subtitle) {
      elements.push({
        id: 'legacy-subtitle',
        type: 'text',
        textType: 'subtitle',
        content: component.data.subtitle,
        fontSize: '3xl',
        fontWeight: 'light',
        opacity: 90,
        order: order++,
        visible: true
      })
    }
    if (component.data.description) {
      elements.push({
        id: 'legacy-description',
        type: 'text',
        textType: 'body',
        content: component.data.description,
        fontSize: 'xl',
        opacity: 80,
        maxWidth: 768,
        order: order++,
        visible: true
      })
    }
    if (component.data.primaryButton || component.data.heroButtonText) {
      elements.push({
        id: 'legacy-primary-button',
        type: 'button',
        buttonText: component.data.primaryButton || component.data.heroButtonText,
        buttonLink: component.data.primaryButtonLink || component.data.heroButtonLink || '/projects',
        buttonVariant: 'primary',
        buttonSize: 'lg',
        order: order++,
        visible: true
      })
    }
    if (component.data.secondaryButton) {
      elements.push({
        id: 'legacy-secondary-button',
        type: 'button',
        buttonText: component.data.secondaryButton,
        buttonLink: component.data.secondaryButtonLink || '/contact',
        buttonVariant: 'secondary',
        buttonSize: 'lg',
        order: order++,
        visible: true
      })
    }
    return elements
  }

  const updateHeroElements = (elements: HeroTextBlock[]) => {
    updateData('heroElements', elements)
  }

  const addHeroElement = (type: HeroElementType) => {
    const elements = normalizeHeroElements()
    const newElement: HeroTextBlock = {
      id: `hero-${Date.now()}`,
      type,
      order: elements.length,
      visible: true
    }
    if (type === 'text') {
      newElement.textType = 'heading'
      newElement.content = { [activeLanguage]: '' }
      newElement.fontSize = '7xl'
      newElement.fontWeight = 'bold'
    } else if (type === 'logo') {
      newElement.logoUrl = ''
      newElement.logoAlt = { [activeLanguage]: '' }
      newElement.logoWidth = 200
    } else if (type === 'button') {
      newElement.buttonText = { [activeLanguage]: '' }
      newElement.buttonLink = '/'
      newElement.buttonVariant = 'primary'
      newElement.buttonSize = 'lg'
    }
    updateHeroElements([...elements, newElement])
  }

  const removeHeroElement = (id: string) => {
    const elements = normalizeHeroElements()
    updateHeroElements(elements.filter(el => el.id !== id))
  }

  const updateHeroElement = (id: string, updates: Partial<HeroTextBlock>) => {
    const elements = normalizeHeroElements()
    const index = elements.findIndex(el => el.id === id)
    if (index !== -1) {
      elements[index] = { ...elements[index], ...updates }
      updateHeroElements(elements)
    }
  }

  const moveHeroElement = (id: string, direction: 'up' | 'down') => {
    const elements = normalizeHeroElements()
    const index = elements.findIndex(el => el.id === id)
    if (index === -1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= elements.length) return
    
    // Create a new array with swapped elements
    const reordered = [...elements]
    const [movedElement] = reordered.splice(index, 1)
    reordered.splice(newIndex, 0, movedElement)
    
    // Reassign order values sequentially
    const updated = reordered.map((el, idx) => ({
      ...el,
      order: idx
    }))
    
    updateHeroElements(updated)
  }

  const updateHeroLayout = (updates: Partial<HeroLayout>) => {
    const currentLayout: HeroLayout = component.data.heroLayout || {
      textAlignment: 'center',
      verticalAlignment: 'center',
      horizontalAlignment: 'center',
      contentWidth: 'wide',
      gap: 16
    }
    updateData('heroLayout', { ...currentLayout, ...updates })
  }

  if (showMediaLibrary) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMediaLibrary(false)}
          >
            ← Back to Editor
          </Button>
        </div>
        
        <MediaLibrary
          selectionMode={mediaSelectionMode}
          onSelect={mediaSelectionMode === 'single' ? handleMediaSelect : undefined}
          onSelectMultiple={mediaSelectionMode === 'multiple' ? handleMediaSelectMultiple : undefined}
          allowUpload={true}
        />
      </div>
    )
  }

  // Get multilingual fields for this component type
  const getMultilingualFields = (): string[] => {
    const fields: string[] = []
    switch (component.type) {
      case 'hero':
        // Legacy fields for backwards compatibility
        if (component.data.title || component.data.subtitle || component.data.description) {
          fields.push('title', 'subtitle', 'description', 'primaryButton', 'secondaryButton')
        }
        // New hero elements are handled separately in the editor
        // They don't need to be included in the general translation coverage
        break
      case 'text':
        fields.push('content')
        break
      case 'image':
        fields.push('alt', 'caption')
        break
      case 'cta':
        fields.push('heading', 'description', 'ctaButtonText')
        break
      case 'features':
        // Features array items have title and description
        break
      case 'testimonials':
        fields.push('title')
        // Testimonials array items have role and content
        break
    }
    return fields
  }

  // Check if a field has translation for a language
  const hasTranslation = (field: string, langCode: string): boolean => {
    const value = component.data[field as keyof ComponentData] as MultilingualText | undefined
    if (!value || typeof value === 'string') return false
    return !!(value[langCode] && value[langCode].trim().length > 0)
  }

  // Get translation coverage for a language
  const getTranslationCoverage = (langCode: string): { complete: number; total: number } => {
    const fields = getMultilingualFields()
    const complete = fields.filter(field => hasTranslation(field, langCode)).length
    return { complete, total: fields.length }
  }

  // Copy translations from default language
  const copyFromDefault = () => {
    const defaultLang = languages.find(l => l.isDefault)
    if (!defaultLang || defaultLang.code === activeLanguage) return

    const fields = getMultilingualFields()
    const updatedData = { ...component.data }

    fields.forEach(field => {
      const value = component.data[field as keyof ComponentData] as MultilingualText | undefined
      if (value && typeof value === 'object') {
        const defaultValue = value[defaultLang.code]
        if (defaultValue && !value[activeLanguage]) {
          updatedData[field as keyof ComponentData] = {
            ...value,
            [activeLanguage]: defaultValue
          } as any
        }
      }
    })

    onChange(updatedData)
  }

  // Translate all multilingual fields to other languages
  const handleTranslateAll = async () => {
    if (!apiConfigured) return

    const fields = getMultilingualFields()
    const sourceTexts: Record<string, string> = {}

    // Collect source texts from active language
    fields.forEach(field => {
      const value = component.data[field as keyof ComponentData] as MultilingualText | undefined
      if (value && typeof value === 'object') {
        const sourceText = value[activeLanguage]
        if (sourceText && sourceText.trim()) {
          sourceTexts[field] = sourceText
        }
      }
    })

    if (Object.keys(sourceTexts).length === 0) {
      alert('Please enter content in the current language before translating')
      return
    }

    const targetLangs = languages
      .filter(l => l.code !== activeLanguage && l.isActive)
      .map(l => l.code)

    if (targetLangs.length === 0) {
      alert('No other languages to translate to')
      return
    }

    setIsTranslating(true)
    setTranslationStatus('Translating...')

    try {
      const updatedData = { ...component.data }

      // Translate each field
      for (const [field, sourceText] of Object.entries(sourceTexts)) {
        setTranslationStatus(`Translating ${field}...`)
        
        const response = await fetch('/api/admin/translate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: sourceText,
            fromLang: activeLanguage,
            toLangs: targetLangs,
            contentType: 'text'
          })
        })

        if (response.ok) {
          const data = await response.json()
          const currentValue = component.data[field as keyof ComponentData] as MultilingualText | undefined
          
          const updatedValue: MultilingualText = {
            ...(currentValue && typeof currentValue === 'object' ? currentValue : {}),
            [activeLanguage]: sourceText // Keep source
          }

          // Add translations
          for (const [langCode, translatedText] of Object.entries(data.translations)) {
            if (translatedText) {
              updatedValue[langCode] = translatedText as string
            }
          }

          updatedData[field as keyof ComponentData] = updatedValue as any
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 250))
      }

      onChange(updatedData)
      setTranslationStatus('Translation complete!')
      setTimeout(() => setTranslationStatus(''), 3000)
    } catch (error) {
      console.error('Error translating:', error)
      setTranslationStatus('Translation failed. Please try again.')
      setTimeout(() => setTranslationStatus(''), 5000)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Component
        </h4>
      </div>

      {/* Enhanced Language Tabs */}
      {languages.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Language
              </span>
            </div>
            <div className="flex items-center gap-2">
              {apiConfigured && languages.filter(l => l.code !== activeLanguage && l.isActive).length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTranslateAll}
                  disabled={isTranslating}
                  className="h-6 px-2 text-xs"
                  title="Translate to all languages"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      <span className="text-xs">{translationStatus || 'Translating...'}</span>
                    </>
                  ) : (
                    <>
                      <Languages className="h-3 w-3 mr-1" />
                      <span>{t('content.translateToAll')}</span>
                    </>
                  )}
                </Button>
              )}
              {languages.length > 1 && activeLanguage !== languages.find(l => l.isDefault)?.code && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyFromDefault}
                  className="h-6 px-2 text-xs"
                  title="Copy from default language"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy from Default
                </Button>
              )}
            </div>
          </div>
          {translationStatus && !isTranslating && (
            <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs text-green-700 dark:text-green-300">
              {translationStatus}
            </div>
          )}
          <div className="flex gap-1 flex-wrap">
            {languages.map(language => {
              const coverage = getTranslationCoverage(language.code)
              const isActive = activeLanguage === language.code
              const isComplete = coverage.total > 0 && coverage.complete === coverage.total
              const hasPartial = coverage.complete > 0 && coverage.complete < coverage.total

              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => setActiveLanguage(language.code)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {language.isDefault && (
                    <Star className={`h-3 w-3 ${isActive ? 'text-white' : 'text-blue-500'}`} fill="currentColor" />
                  )}
                  <span>{language.name}</span>
                  {coverage.total > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isComplete
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : hasPartial
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {coverage.complete}/{coverage.total}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Hero Component Fields - New Flexible Builder */}
      {component.type === 'hero' && (() => {
        const heroElements = normalizeHeroElements()
        const layout: HeroLayout = component.data.heroLayout || {
          textAlignment: 'center',
          verticalAlignment: 'center',
          horizontalAlignment: 'center',
          contentWidth: 'wide',
          gap: 16
        }

        return (
          <>
            {/* Hero Elements Management */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">Hero Elements</h5>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addHeroElement('text')}
                    className="flex items-center gap-1"
                  >
                    <Type className="h-4 w-4" />
                    Add Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addHeroElement('logo')}
                    className="flex items-center gap-1"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Add Logo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addHeroElement('button')}
                    className="flex items-center gap-1"
                  >
                    <MousePointerClick className="h-4 w-4" />
                    Add Button
                  </Button>
                </div>
              </div>

              {heroElements.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No elements yet. Add text, logos, or buttons to build your hero.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {heroElements.map((element, index) => (
                    <div key={element.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {element.type === 'text' && <><Type className="h-4 w-4 inline mr-1" />Text ({element.textType || 'body'})</>}
                            {element.type === 'logo' && <><ImageIcon className="h-4 w-4 inline mr-1" />Logo</>}
                            {element.type === 'button' && <><MousePointerClick className="h-4 w-4 inline mr-1" />Button</>}
                          </span>
                          {!element.visible && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">(Hidden)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveHeroElement(element.id, 'up')}
                            disabled={index === 0}
                            className="h-7 w-7 p-0"
                          >
                            <MoveUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveHeroElement(element.id, 'down')}
                            disabled={index === heroElements.length - 1}
                            className="h-7 w-7 p-0"
                          >
                            <MoveDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedHeroElement(expandedHeroElement === element.id ? null : element.id)}
                            className="h-7 px-2 text-xs"
                          >
                            {expandedHeroElement === element.id ? 'Collapse' : 'Edit'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHeroElement(element.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {expandedHeroElement === element.id && (
                        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {/* Text Element Editor */}
                          {element.type === 'text' && (
                            <>
                              <div>
                                <Label>Text Type</Label>
                                <Select
                                  value={element.textType || 'body'}
                                  onChange={(e) => updateHeroElement(element.id, { textType: e.target.value as HeroTextBlockType })}
                                >
                                  <option value="heading">Heading</option>
                                  <option value="subtitle">Subtitle</option>
                                  <option value="body">Body</option>
                                  <option value="small">Small</option>
                                </Select>
                              </div>
                              <div>
                                <Label className="flex items-center gap-2">
                                  <span>Content</span>
                                  {element.content?.[activeLanguage] ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                                  )}
                                </Label>
                                <Input
                                  value={element.content?.[activeLanguage] || ''}
                                  onChange={(e) => {
                                    const content = { ...(element.content || {}), [activeLanguage]: e.target.value }
                                    updateHeroElement(element.id, { content })
                                  }}
                                  placeholder="Enter text content"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label>Font Size</Label>
                                  <Select
                                    value={element.fontSize || '7xl'}
                                    onChange={(e) => updateHeroElement(element.id, { fontSize: e.target.value as any })}
                                  >
                                    <option value="xs">XS</option>
                                    <option value="sm">SM</option>
                                    <option value="base">Base</option>
                                    <option value="lg">LG</option>
                                    <option value="xl">XL</option>
                                    <option value="2xl">2XL</option>
                                    <option value="3xl">3XL</option>
                                    <option value="4xl">4XL</option>
                                    <option value="5xl">5XL</option>
                                    <option value="6xl">6XL</option>
                                    <option value="7xl">7XL</option>
                                    <option value="8xl">8XL</option>
                                    <option value="9xl">9XL</option>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Font Weight</Label>
                                  <Select
                                    value={element.fontWeight || 'normal'}
                                    onChange={(e) => updateHeroElement(element.id, { fontWeight: e.target.value as any })}
                                  >
                                    <option value="light">Light</option>
                                    <option value="normal">Normal</option>
                                    <option value="medium">Medium</option>
                                    <option value="semibold">Semibold</option>
                                    <option value="bold">Bold</option>
                                    <option value="extrabold">Extrabold</option>
                                    <option value="black">Black</option>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label>Text Color (optional)</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="color"
                                      value={element.textColor || component.data.textColor || '#000000'}
                                      onChange={(e) => updateHeroElement(element.id, { textColor: e.target.value })}
                                      className="w-16 h-10 p-1"
                                    />
                                    <Input
                                      value={element.textColor || component.data.textColor || '#000000'}
                                      onChange={(e) => updateHeroElement(element.id, { textColor: e.target.value })}
                                      className="flex-1"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor={`opacity-${element.id}`}>
                                    Opacity: {opacitySliderValues[element.id] ?? element.opacity ?? 100}%
                                  </Label>
                                  <input
                                    id={`opacity-${element.id}`}
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={opacitySliderValues[element.id] ?? element.opacity ?? 100}
                                    onChange={(e) => {
                                      // Update local state for visual feedback only
                                      const newValue = parseInt(e.target.value) || 100
                                      setOpacitySliderValues(prev => ({ ...prev, [element.id]: newValue }))
                                    }}
                                    onMouseUp={(e) => {
                                      // Update component data when mouse is released
                                      const newValue = parseInt(e.currentTarget.value) || 100
                                      updateHeroElement(element.id, { opacity: newValue })
                                    }}
                                    onTouchEnd={(e) => {
                                      // Update component data when touch ends
                                      const newValue = parseInt(e.currentTarget.value) || 100
                                      updateHeroElement(element.id, { opacity: newValue })
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    style={{
                                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${opacitySliderValues[element.id] ?? element.opacity ?? 100}%, #e5e7eb ${opacitySliderValues[element.id] ?? element.opacity ?? 100}%, #e5e7eb 100%)`
                                    }}
                                  />
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Adjust the text opacity from 0 (transparent) to 100 (opaque)
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label>Max Width (px, leave empty for auto)</Label>
                                <Input
                                  type="number"
                                  value={typeof element.maxWidth === 'number' ? element.maxWidth : ''}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    updateHeroElement(element.id, { maxWidth: val ? parseInt(val) : undefined })
                                  }}
                                  placeholder="e.g., 768"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`visible-${element.id}`}
                                  checked={element.visible !== false}
                                  onChange={(e) => updateHeroElement(element.id, { visible: e.target.checked })}
                                />
                                <Label htmlFor={`visible-${element.id}`} className="cursor-pointer">Visible</Label>
                              </div>
                            </>
                          )}

                          {/* Logo Element Editor */}
                          {element.type === 'logo' && (
                            <>
                              <div>
                                <Label>Logo Image</Label>
                                <div className="mt-2">
                                  {element.logoUrl ? (
                                    <div className="flex items-center gap-2">
                                      <img src={element.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const input = document.createElement('input')
                                            input.type = 'file'
                                            input.accept = 'image/*'
                                            input.onchange = async (e) => {
                                              const target = e.target as HTMLInputElement
                                              if (target.files && target.files[0]) {
                                                const file = target.files[0]
                                                try {
                                                  const formData = new FormData()
                                                  formData.append('file', file)
                                                  const response = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: formData
                                                  })
                                                  if (response.ok) {
                                                    const result = await response.json()
                                                    if (result.originalUrl) {
                                                      updateHeroElement(element.id, { logoUrl: result.originalUrl })
                                                    }
                                                  }
                                                } catch (error) {
                                                  console.error('Upload error:', error)
                                                  alert('Failed to upload logo')
                                                }
                                              }
                                            }
                                            input.click()
                                          }}
                                        >
                                          <Upload className="h-4 w-4 mr-2" />
                                          Change
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setMediaTarget(`logo-${element.id}`)
                                            openMediaLibrary(`logo-${element.id}`, 'single')
                                          }}
                                        >
                                          <ImageIcon className="h-4 w-4 mr-2" />
                                          Browse
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateHeroElement(element.id, { logoUrl: '' })}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          const input = document.createElement('input')
                                          input.type = 'file'
                                          input.accept = 'image/*'
                                          input.onchange = async (e) => {
                                            const target = e.target as HTMLInputElement
                                            if (target.files && target.files[0]) {
                                              const file = target.files[0]
                                              try {
                                                const formData = new FormData()
                                                formData.append('file', file)
                                                const response = await fetch('/api/upload', {
                                                  method: 'POST',
                                                  body: formData
                                                })
                                                if (response.ok) {
                                                  const result = await response.json()
                                                  if (result.originalUrl) {
                                                    updateHeroElement(element.id, { logoUrl: result.originalUrl })
                                                  }
                                                }
                                              } catch (error) {
                                                console.error('Upload error:', error)
                                                alert('Failed to upload logo')
                                              }
                                            }
                                          }
                                          input.click()
                                        }}
                                      >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Logo
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setMediaTarget(`logo-${element.id}`)
                                          openMediaLibrary(`logo-${element.id}`, 'single')
                                        }}
                                      >
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Browse Media Library
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <Label>Alt Text</Label>
                                <Input
                                  value={element.logoAlt?.[activeLanguage] || ''}
                                  onChange={(e) => {
                                    const logoAlt = { ...(element.logoAlt || {}), [activeLanguage]: e.target.value }
                                    updateHeroElement(element.id, { logoAlt })
                                  }}
                                  placeholder="Logo alt text"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label>Width (px)</Label>
                                  <Input
                                    type="number"
                                    value={element.logoWidth || 200}
                                    onChange={(e) => updateHeroElement(element.id, { logoWidth: parseInt(e.target.value) || 200 })}
                                  />
                                </div>
                                <div>
                                  <Label>Height (px, optional)</Label>
                                  <Input
                                    type="number"
                                    value={element.logoHeight || ''}
                                    onChange={(e) => updateHeroElement(element.id, { logoHeight: e.target.value ? parseInt(e.target.value) : undefined })}
                                    placeholder="Auto"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`visible-logo-${element.id}`}
                                  checked={element.visible !== false}
                                  onChange={(e) => updateHeroElement(element.id, { visible: e.target.checked })}
                                />
                                <Label htmlFor={`visible-logo-${element.id}`} className="cursor-pointer">Visible</Label>
                              </div>
                            </>
                          )}

                          {/* Button Element Editor */}
                          {element.type === 'button' && (
                            <>
                              <div>
                                <Label className="flex items-center gap-2">
                                  <span>Button Text</span>
                                  {element.buttonText?.[activeLanguage] ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                                  )}
                                </Label>
                                <Input
                                  value={element.buttonText?.[activeLanguage] || ''}
                                  onChange={(e) => {
                                    const buttonText = { ...(element.buttonText || {}), [activeLanguage]: e.target.value }
                                    updateHeroElement(element.id, { buttonText })
                                  }}
                                  placeholder="Enter button text"
                                />
                              </div>
                              <div>
                                <Label>Button Link</Label>
                                <Input
                                  value={element.buttonLink || '/'}
                                  onChange={(e) => updateHeroElement(element.id, { buttonLink: e.target.value })}
                                  placeholder="/projects"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label>Variant</Label>
                                  <Select
                                    value={element.buttonVariant || 'primary'}
                                    onChange={(e) => updateHeroElement(element.id, { buttonVariant: e.target.value as any })}
                                  >
                                    <option value="primary">Primary</option>
                                    <option value="secondary">Secondary</option>
                                    <option value="outline">Outline</option>
                                    <option value="ghost">Ghost</option>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Size</Label>
                                  <Select
                                    value={element.buttonSize || 'lg'}
                                    onChange={(e) => updateHeroElement(element.id, { buttonSize: e.target.value as any })}
                                  >
                                    <option value="sm">Small</option>
                                    <option value="md">Medium</option>
                                    <option value="lg">Large</option>
                                    <option value="xl">Extra Large</option>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`visible-button-${element.id}`}
                                  checked={element.visible !== false}
                                  onChange={(e) => updateHeroElement(element.id, { visible: e.target.checked })}
                                />
                                <Label htmlFor={`visible-button-${element.id}`} className="cursor-pointer">Visible</Label>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Layout Controls */}
            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Layout</h5>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Text Alignment</Label>
                    <Select
                      value={layout.textAlignment || 'center'}
                      onChange={(e) => updateHeroLayout({ textAlignment: e.target.value as any })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Vertical Alignment</Label>
                    <Select
                      value={layout.verticalAlignment || 'center'}
                      onChange={(e) => updateHeroLayout({ verticalAlignment: e.target.value as any })}
                    >
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Horizontal Alignment</Label>
                    <Select
                      value={layout.horizontalAlignment || 'center'}
                      onChange={(e) => updateHeroLayout({ horizontalAlignment: e.target.value as any })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Content Width</Label>
                    <Select
                      value={typeof layout.contentWidth === 'number' ? 'custom' : layout.contentWidth || 'wide'}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          const width = prompt('Enter max width in pixels:', '1200')
                          if (width && !isNaN(parseInt(width))) {
                            updateHeroLayout({ contentWidth: parseInt(width) })
                          }
                        } else {
                          updateHeroLayout({ contentWidth: e.target.value as any })
                        }
                      }}
                    >
                      <option value="narrow">Narrow</option>
                      <option value="medium">Medium</option>
                      <option value="wide">Wide</option>
                      <option value="full">Full</option>
                      <option value="custom">Custom (px)</option>
                    </Select>
                    {typeof layout.contentWidth === 'number' && (
                      <Input
                        type="number"
                        value={layout.contentWidth}
                        onChange={(e) => updateHeroLayout({ contentWidth: parseInt(e.target.value) || 'wide' })}
                        className="mt-2"
                        placeholder="Width in pixels"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <Label>Gap Between Elements (px)</Label>
                  <Input
                    type="number"
                    value={layout.gap || 16}
                    onChange={(e) => updateHeroLayout({ gap: parseInt(e.target.value) || 16 })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Section Height</Label>
                  <Select
                    value={typeof component.data.height === 'string' ? component.data.height : typeof component.data.height === 'number' ? 'custom' : 'auto'}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        const height = prompt('Enter height in pixels:', '600')
                        if (height && !isNaN(parseInt(height))) {
                          updateData('height', parseInt(height))
                        }
                      } else {
                        updateData('height', e.target.value === 'auto' || e.target.value === 'screen' ? e.target.value : 'auto')
                      }
                    }}
                  >
                    <option value="auto">Auto</option>
                    <option value="screen">Full Screen</option>
                    <option value="custom">Custom (px)</option>
                  </Select>
                  {typeof component.data.height === 'number' && (
                    <Input
                      type="number"
                      value={component.data.height}
                      onChange={(e) => updateData('height', parseInt(e.target.value) || 'auto')}
                      className="mt-2"
                      placeholder="Height in pixels"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Background Controls */}
            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Background</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="backgroundType">Background Type</Label>
                <Select
                  id="backgroundType"
                  value={component.data.backgroundType || 'solid'}
                  onChange={(e) => updateData('backgroundType', e.target.value)}
                >
                  <option value="solid">Solid Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                </Select>
              </div>
              
              {component.data.backgroundType === 'solid' && (
                <div>
                  <Label htmlFor="solidBackgroundColor">Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="solidBackgroundColor"
                      type="color"
                      value={component.data.backgroundColor || '#ffffff'}
                      onChange={(e) => updateData('backgroundColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={component.data.backgroundColor || '#ffffff'}
                      onChange={(e) => updateData('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose a solid background color for the hero section
                  </p>
                </div>
              )}
              
              {component.data.backgroundType === 'gradient' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="gradientFrom">Gradient Start Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="gradientFrom"
                        type="color"
                        value={component.data.gradientFrom || '#ffffff'}
                        onChange={(e) => updateData('gradientFrom', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={component.data.gradientFrom || '#ffffff'}
                        onChange={(e) => updateData('gradientFrom', e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="gradientVia">Gradient Middle Color (Optional)</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="gradientVia"
                        type="color"
                        value={component.data.gradientVia || ''}
                        onChange={(e) => updateData('gradientVia', e.target.value || undefined)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={component.data.gradientVia || ''}
                        onChange={(e) => updateData('gradientVia', e.target.value || undefined)}
                        placeholder="Leave empty for no middle color"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="gradientTo">Gradient End Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="gradientTo"
                        type="color"
                        value={component.data.gradientTo || '#000000'}
                        onChange={(e) => updateData('gradientTo', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={component.data.gradientTo || '#000000'}
                        onChange={(e) => updateData('gradientTo', e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="gradientDirection">Gradient Direction</Label>
                    <Select
                      id="gradientDirection"
                      value={component.data.gradientDirection || 'to-br'}
                      onChange={(e) => updateData('gradientDirection', e.target.value)}
                    >
                      <option value="to-t">To Top</option>
                      <option value="to-tr">To Top Right</option>
                      <option value="to-r">To Right</option>
                      <option value="to-br">To Bottom Right</option>
                      <option value="to-b">To Bottom</option>
                      <option value="to-bl">To Bottom Left</option>
                      <option value="to-l">To Left</option>
                      <option value="to-tl">To Top Left</option>
                    </Select>
                  </div>
                  
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Preview</p>
                    <div 
                      className="h-16 rounded"
                      style={{
                        background: (() => {
                          const direction = component.data.gradientDirection || 'to-br'
                          const gradientDirectionMap: { [key: string]: string } = {
                            'to-t': 'to top',
                            'to-tr': 'to top right',
                            'to-r': 'to right',
                            'to-br': 'to bottom right',
                            'to-b': 'to bottom',
                            'to-bl': 'to bottom left',
                            'to-l': 'to left',
                            'to-tl': 'to top left'
                          }
                          const dir = gradientDirectionMap[direction] || 'to bottom right'
                          const from = component.data.gradientFrom || '#ffffff'
                          const via = component.data.gradientVia
                          const to = component.data.gradientTo || '#000000'
                          
                          return via 
                            ? `linear-gradient(${dir}, ${from}, ${via}, ${to})`
                            : `linear-gradient(${dir}, ${from}, ${to})`
                        })()
                      }}
                    />
                  </div>
                </div>
              )}
              
              {component.data.backgroundType === 'image' && (
                <div className="space-y-4">
                  <div>
                    <Label>Background Image</Label>
                    <div className="mt-2">
                      {component.data.backgroundImage ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={component.data.backgroundImage} 
                            alt="Background" 
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.accept = 'image/*'
                                input.onchange = (e) => {
                                  const target = e.target as HTMLInputElement
                                  if (target.files) {
                                    handleFileUpload(target.files, 'background')
                                  }
                                }
                                input.click()
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Change
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openMediaLibrary('backgroundImage')}
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Browse
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateData('backgroundImage', '')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = (e) => {
                                const target = e.target as HTMLInputElement
                                if (target.files) {
                                  handleFileUpload(target.files, 'background')
                                }
                              }
                              input.click()
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => openMediaLibrary('backgroundImage')}
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Browse Media Library
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="overlay-color">Overlay Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="overlay-color"
                          type="color"
                          value={component.data.backgroundOverlayColor || '#000000'}
                          onChange={(e) => {
                            updateData('backgroundOverlayColor', e.target.value)
                          }}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={component.data.backgroundOverlayColor || '#000000'}
                          onChange={(e) => {
                            updateData('backgroundOverlayColor', e.target.value)
                          }}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Choose the color for the overlay on the background image
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="overlay-opacity">
                        Overlay Opacity: {localOverlayOpacity}%
                      </Label>
                      <div className="mt-2 space-y-2">
                        <input
                          id="overlay-opacity"
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={localOverlayOpacity}
                          onChange={(e) => {
                            // Only update local state for visual feedback
                            const numVal = Number(e.target.value)
                            setLocalOverlayOpacity(numVal)
                          }}
                          onMouseUp={(e) => {
                            // Update component data when mouse is released
                            const numVal = Number(e.currentTarget.value)
                            updateData('backgroundOverlayOpacity', numVal)
                          }}
                          onTouchEnd={(e) => {
                            // Update component data when touch ends
                            const numVal = Number(e.currentTarget.value)
                            updateData('backgroundOverlayOpacity', numVal)
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${localOverlayOpacity}%, #e5e7eb ${localOverlayOpacity}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={localOverlayOpacity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10)
                              if (!isNaN(val) && val >= 0 && val <= 100) {
                                setLocalOverlayOpacity(val)
                                // Button/input updates immediately
                                updateData('backgroundOverlayOpacity', val)
                              }
                            }}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>0% (No Overlay)</span>
                          <span>50%</span>
                          <span>100% (Full Overlay)</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Adjust the opacity of the overlay on the background image. Lower values make the image brighter, higher values make it darker.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </>
        )
      })()}

      {/* Features Component Fields */}
      {component.type === 'features' && (
        <>
          <div>
            <Label htmlFor="featuresTitle">Title ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="featuresTitle"
              value={getMultilingualText('title', activeLanguage)}
              onChange={(e) => updateMultilingualText('title', activeLanguage, e.target.value)}
              placeholder="Enter features section title"
            />
          </div>
          
          <div>
            <Label htmlFor="featuresSubtitle">Subtitle ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="featuresSubtitle"
              value={getMultilingualText('subtitle', activeLanguage)}
              onChange={(e) => updateMultilingualText('subtitle', activeLanguage, e.target.value)}
              placeholder="Enter features section subtitle"
            />
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900">Features</h5>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentFeatures = component.data.features || []
                  const newFeature = {
                    icon: 'award',
                    title: { [activeLanguage]: '' },
                    description: { [activeLanguage]: '' }
                  }
                  updateData('features', [...currentFeatures, newFeature])
                }}
              >
                + Add Feature
              </Button>
            </div>
            
            <div className="space-y-4">
              {(component.data.features || []).map((feature: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium text-gray-700">Feature {index + 1}</h6>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentFeatures = component.data.features || []
                        updateData('features', currentFeatures.filter((_: any, i: number) => i !== index))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor={`feature-icon-${index}`}>Icon</Label>
                    <Select
                      id={`feature-icon-${index}`}
                      value={feature.icon || 'award'}
                      onChange={(e) => {
                        const currentFeatures = component.data.features || []
                        const updatedFeatures = [...currentFeatures]
                        updatedFeatures[index] = { ...updatedFeatures[index], icon: e.target.value }
                        updateData('features', updatedFeatures)
                      }}
                    >
                      <optgroup label="General">
                        <option value="award">Award</option>
                        <option value="users">Users</option>
                        <option value="clock">Clock</option>
                        <option value="star">Star</option>
                        <option value="check">Check</option>
                        <option value="heart">Heart</option>
                        <option value="shield">Shield</option>
                        <option value="zap">Zap</option>
                        <option value="target">Target</option>
                        <option value="lightbulb">Lightbulb</option>
                      </optgroup>
                      <optgroup label="Tools & Construction">
                        <option value="hammer">Hammer</option>
                        <option value="wrench">Wrench</option>
                        <option value="tool">Tool Case</option>
                        <option value="hardhat">Hard Hat</option>
                        <option value="ruler">Ruler</option>
                        <option value="square">Square</option>
                        <option value="scissors">Scissors</option>
                        <option value="building">Building</option>
                        <option value="factory">Factory</option>
                      </optgroup>
                      <optgroup label="Workshop & Materials">
                        <option value="settings">Settings</option>
                        <option value="cog">Cog</option>
                        <option value="box">Box</option>
                        <option value="package">Package</option>
                        <option value="archive">Archive</option>
                        <option value="layers">Layers</option>
                      </optgroup>
                      <optgroup label="Design & Finish">
                        <option value="palette">Palette</option>
                        <option value="paintbrush">Paintbrush</option>
                        <option value="pen">Pen</option>
                        <option value="sparkles">Sparkles</option>
                      </optgroup>
                      <optgroup label="Furniture">
                        <option value="sofa">Sofa</option>
                        <option value="chair">Chair</option>
                        <option value="table">Table</option>
                        <option value="home">Home</option>
                      </optgroup>
                      <optgroup label="Business & Delivery">
                        <option value="truck">Truck</option>
                        <option value="briefcase">Briefcase</option>
                        <option value="filetext">File Text</option>
                      </optgroup>
                      <optgroup label="Handcrafted">
                        <option value="hand">Hand</option>
                        <option value="handshake">Handshake</option>
                      </optgroup>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`feature-title-${index}`}>Title ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                    <Input
                      id={`feature-title-${index}`}
                      value={typeof feature.title === 'string' ? feature.title : (feature.title?.[activeLanguage] || '')}
                      onChange={(e) => {
                        const currentFeatures = component.data.features || []
                        const updatedFeatures = [...currentFeatures]
                        const currentTitle = updatedFeatures[index].title || {}
                        updatedFeatures[index] = {
                          ...updatedFeatures[index],
                          title: { ...currentTitle, [activeLanguage]: e.target.value }
                        }
                        updateData('features', updatedFeatures)
                      }}
                      placeholder="Enter feature title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`feature-description-${index}`}>Description ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                    <Input
                      id={`feature-description-${index}`}
                      value={typeof feature.description === 'string' ? feature.description : (feature.description?.[activeLanguage] || '')}
                      onChange={(e) => {
                        const currentFeatures = component.data.features || []
                        const updatedFeatures = [...currentFeatures]
                        const currentDescription = updatedFeatures[index].description || {}
                        updatedFeatures[index] = {
                          ...updatedFeatures[index],
                          description: { ...currentDescription, [activeLanguage]: e.target.value }
                        }
                        updateData('features', updatedFeatures)
                      }}
                      placeholder="Enter feature description"
                    />
                  </div>
                </div>
              ))}
              
              {(!component.data.features || component.data.features.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No features added yet. Click "Add Feature" to get started.</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Testimonials Component Fields */}
      {component.type === 'testimonials' && (
        <>
          <div>
            <Label htmlFor="testimonialsTitle">Title ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="testimonialsTitle"
              value={getMultilingualText('title', activeLanguage)}
              onChange={(e) => updateMultilingualText('title', activeLanguage, e.target.value)}
              placeholder="Enter testimonials section title"
            />
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900">Testimonials</h5>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentTestimonials = component.data.testimonials || []
                  const newTestimonial = {
                    name: '',
                    role: { [activeLanguage]: '' },
                    content: { [activeLanguage]: '' },
                    rating: 5
                  }
                  updateData('testimonials', [...currentTestimonials, newTestimonial])
                }}
              >
                + Add Testimonial
              </Button>
            </div>
            
            <div className="space-y-4">
              {(component.data.testimonials || []).map((testimonial: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium text-gray-700">Testimonial {index + 1}</h6>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentTestimonials = component.data.testimonials || []
                        updateData('testimonials', currentTestimonials.filter((_: any, i: number) => i !== index))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor={`testimonial-name-${index}`}>Name</Label>
                    <Input
                      id={`testimonial-name-${index}`}
                      value={testimonial.name || ''}
                      onChange={(e) => {
                        const currentTestimonials = component.data.testimonials || []
                        const updatedTestimonials = [...currentTestimonials]
                        updatedTestimonials[index] = { ...updatedTestimonials[index], name: e.target.value }
                        updateData('testimonials', updatedTestimonials)
                      }}
                      placeholder="Enter testimonial author name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`testimonial-role-${index}`}>Role ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                    <Input
                      id={`testimonial-role-${index}`}
                      value={typeof testimonial.role === 'string' ? testimonial.role : (testimonial.role?.[activeLanguage] || '')}
                      onChange={(e) => {
                        const currentTestimonials = component.data.testimonials || []
                        const updatedTestimonials = [...currentTestimonials]
                        const currentRole = updatedTestimonials[index].role || {}
                        updatedTestimonials[index] = {
                          ...updatedTestimonials[index],
                          role: { ...currentRole, [activeLanguage]: e.target.value }
                        }
                        updateData('testimonials', updatedTestimonials)
                      }}
                      placeholder="Enter role or title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`testimonial-content-${index}`}>Content ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                    <textarea
                      id={`testimonial-content-${index}`}
                      value={typeof testimonial.content === 'string' ? testimonial.content : (testimonial.content?.[activeLanguage] || '')}
                      onChange={(e) => {
                        const currentTestimonials = component.data.testimonials || []
                        const updatedTestimonials = [...currentTestimonials]
                        const currentContent = updatedTestimonials[index].content || {}
                        updatedTestimonials[index] = {
                          ...updatedTestimonials[index],
                          content: { ...currentContent, [activeLanguage]: e.target.value }
                        }
                        updateData('testimonials', updatedTestimonials)
                      }}
                      placeholder="Enter testimonial content"
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`testimonial-rating-${index}`}>Rating</Label>
                    <Select
                      id={`testimonial-rating-${index}`}
                      value={testimonial.rating || 5}
                      onChange={(e) => {
                        const currentTestimonials = component.data.testimonials || []
                        const updatedTestimonials = [...currentTestimonials]
                        updatedTestimonials[index] = { ...updatedTestimonials[index], rating: parseInt(e.target.value) }
                        updateData('testimonials', updatedTestimonials)
                      }}
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </Select>
                  </div>
                </div>
              ))}
              
              {(!component.data.testimonials || component.data.testimonials.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No testimonials added yet. Click "Add Testimonial" to get started.</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Text Component Fields */}
      {component.type === 'text' && (
        <>
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <span>Content</span>
              {hasTranslation('content', activeLanguage) ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <AlertCircle className="h-3 w-3 text-yellow-500" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({languages.find(l => l.code === activeLanguage)?.name})
              </span>
            </Label>
            <div className={`mt-2 ${!hasTranslation('content', activeLanguage) ? 'ring-1 ring-yellow-300 dark:ring-yellow-600 rounded' : ''}`}>
              <RichTextEditor
                content={component.data.content?.[activeLanguage] ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: component.data.content[activeLanguage] }] }] } : undefined}
                onChange={(content) => {
                  // Extract plain text from TipTap content for now
                  const text = content.content?.[0]?.content?.[0]?.text || ''
                  const updatedContent = { ...component.data.content, [activeLanguage]: text }
                  updateData('content', updatedContent)
                }}
                placeholder="Enter your text content..."
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="alignment">Text Alignment</Label>
            <select
              id="alignment"
              value={component.data.alignment || 'left'}
              onChange={(e) => updateData('alignment', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </>
      )}

      {/* Image Component Fields */}
      {component.type === 'image' && (
        <>
          <div>
            <Label>Image</Label>
            <div className="mt-2">
              {component.data.imageUrl ? (
                <div className="space-y-2">
                  <img 
                    src={component.data.imageUrl} 
                    alt="Selected" 
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openMediaLibrary('imageUrl')}
                    >
                      Change Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateData('imageUrl', '')}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => openMediaLibrary('imageUrl')}
                >
                  Select Image
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={component.data.alt?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedAlt = { ...component.data.alt, [activeLanguage]: e.target.value }
                updateData('alt', updatedAlt)
              }}
              placeholder="Describe the image"
            />
          </div>
          
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={component.data.caption?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedCaption = { ...component.data.caption, [activeLanguage]: e.target.value }
                updateData('caption', updatedCaption)
              }}
              placeholder="Optional image caption"
            />
          </div>
        </>
      )}

      {/* Gallery Component Fields */}
      {component.type === 'gallery' && (
        <>
          <div>
            <Label htmlFor="galleryTitle">Title ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="galleryTitle"
              value={getMultilingualText('title', activeLanguage)}
              onChange={(e) => updateMultilingualText('title', activeLanguage, e.target.value)}
              placeholder="Enter gallery title"
            />
          </div>
          
          <div>
            <Label htmlFor="gallerySubtitle">Subtitle ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="gallerySubtitle"
              value={getMultilingualText('subtitle', activeLanguage)}
              onChange={(e) => updateMultilingualText('subtitle', activeLanguage, e.target.value)}
              placeholder="Enter gallery subtitle"
            />
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Content Source</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="showFeatured">Display Featured Projects</Label>
                <Select
                  id="showFeatured"
                  value={component.data.showFeatured ? 'true' : 'false'}
                  onChange={(e) => updateData('showFeatured', e.target.value === 'true')}
                >
                  <option value="false">Custom Images</option>
                  <option value="true">Featured Projects</option>
                </Select>
              </div>
              
              {!component.data.showFeatured && (
                <div>
                  <Label>Gallery Images</Label>
                  <div className="mt-2 space-y-4">
                    {/* Drag and Drop Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragOver 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      } ${uploadingGallery ? 'opacity-50 pointer-events-none' : ''}`}
                      onDrop={handleGalleryDrop}
                      onDragOver={handleGalleryDragOver}
                      onDragLeave={handleGalleryDragLeave}
                    >
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center">
                          {uploadingGallery ? (
                            <>
                              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Uploading images...
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Drop images here or click to select
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Supports JPEG, PNG, WebP (max 10MB each)
                              </p>
                              <div className="flex gap-2 mt-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    const input = document.createElement('input')
                                    input.type = 'file'
                                    input.multiple = true
                                    input.accept = 'image/*'
                                    input.onchange = (e) => {
                                      const target = e.target as HTMLInputElement
                                      if (target.files) {
                                        handleFileUpload(target.files, 'gallery')
                                      }
                                    }
                                    input.click()
                                  }}
                                  disabled={uploadingGallery}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Select Images
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => openMediaLibrary('images', 'multiple')}
                                  disabled={uploadingGallery}
                                >
                                  <ImageIcon className="h-4 w-4 mr-2" />
                                  Browse Media Library
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Grid */}
                    {component.data.images && component.data.images.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {component.data.images.length} image{component.data.images.length !== 1 ? 's' : ''}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openMediaLibrary('images', 'multiple')}
                            >
                              Add More
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateData('images', [])}
                            >
                              Clear All
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {component.data.images.map((image, index) => (
                            <div key={image.id || index} className="relative group">
                              <img 
                                src={image.url} 
                                alt={image.alt} 
                                className="w-full h-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                              />
                              <button
                                onClick={() => {
                                  const images = component.data.images || []
                                  updateData('images', images.filter((_, i) => i !== index))
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {component.data.showFeatured && (
            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 mb-3">Display Options</h5>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="useCarousel" className="flex items-center gap-2">
                    <input
                      id="useCarousel"
                      type="checkbox"
                      checked={component.data.useCarousel === undefined 
                        ? (featuredProjects.length > 3) 
                        : component.data.useCarousel}
                      onChange={(e) => {
                        updateData('useCarousel', e.target.checked)
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>Use Carousel</span>
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                    {featuredProjects.length > 3 
                      ? 'Carousel is recommended when displaying more than 3 items'
                      : 'Enable horizontal scrolling carousel mode'}
                  </p>
                </div>
                
                {(component.data.useCarousel === false || (component.data.useCarousel === undefined && featuredProjects.length <= 3)) && (
                  <>
                    <div>
                      <Label htmlFor="maxItems">Max Items</Label>
                      <Input
                        id="maxItems"
                        type="number"
                        value={component.data.maxItems || 8}
                        onChange={(e) => updateData('maxItems', parseInt(e.target.value) || 8)}
                        min="1"
                        max="20"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="layout">Layout</Label>
                      <select
                        id="layout"
                        value={component.data.layout || 'grid'}
                        onChange={(e) => updateData('layout', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="grid">Grid</option>
                        <option value="masonry">Masonry</option>
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {component.data.layout === 'masonry' 
                          ? 'Masonry layout creates a Pinterest-style waterfall effect'
                          : 'Grid layout displays items in a uniform grid pattern'}
                      </p>
                    </div>
                  </>
                )}
                
                {component.data.useCarousel && (
                  <div>
                    <Label htmlFor="maxItems">Max Items</Label>
                    <Input
                      id="maxItems"
                      type="number"
                      value={component.data.maxItems || 8}
                      onChange={(e) => updateData('maxItems', parseInt(e.target.value) || 8)}
                      min="1"
                      max="20"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="columns">Columns</Label>
                  <Select
                    id="columns"
                    value={component.data.columns || 3}
                    onChange={(e) => updateData('columns', parseInt(e.target.value))}
                  >
                    <option value="2">2 Columns</option>
                    <option value="3">3 Columns</option>
                    <option value="4">4 Columns</option>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Gallery Showcase Component Fields */}
      {component.type === 'gallery-showcase' && (
        <>
          <div>
            <Label>Showcase Images</Label>
            <div className="mt-2">
              {component.data.showcaseImages && component.data.showcaseImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {component.data.showcaseImages.map((image: any, index: number) => (
                      <div key={image.id || index} className="relative">
                        <img 
                          src={image.url} 
                          alt={image.alt || ''} 
                          className="w-full h-16 object-cover rounded"
                        />
                        <button
                          onClick={() => {
                            const newImages = [...(component.data.showcaseImages || [])]
                            newImages.splice(index, 1)
                            updateData('showcaseImages', newImages)
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openMediaLibrary('showcaseImages', 'multiple')}
                    >
                      Add More Images
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateData('showcaseImages', [])}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => openMediaLibrary('showcaseImages', 'multiple')}
                >
                  Select Images
                </Button>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Animation Settings</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="autoScrollSpeed">Auto-scroll Speed (ms)</Label>
                <Input
                  id="autoScrollSpeed"
                  type="number"
                  value={component.data.autoScrollSpeed || 4000}
                  onChange={(e) => updateData('autoScrollSpeed', parseInt(e.target.value) || 4000)}
                  min="1000"
                  max="10000"
                  step="500"
                />
                <p className="text-xs text-gray-500 mt-1">Time between image transitions (1000-10000ms)</p>
              </div>
              
              <div>
                <Label htmlFor="transitionDuration">Transition Duration (ms)</Label>
                <Input
                  id="transitionDuration"
                  type="number"
                  value={component.data.transitionDuration || 1000}
                  onChange={(e) => updateData('transitionDuration', parseInt(e.target.value) || 1000)}
                  min="200"
                  max="3000"
                  step="100"
                />
                <p className="text-xs text-gray-500 mt-1">Duration of the transition animation (200-3000ms)</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div>
              <Label htmlFor="showcaseBackgroundColor">Background Color</Label>
              <Input
                id="showcaseBackgroundColor"
                type="color"
                value={component.data.backgroundColor || '#000000'}
                onChange={(e) => updateData('backgroundColor', e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </>
      )}

      {/* CTA Component Fields */}
      {component.type === 'cta' && (
        <>
          <div>
            <Label htmlFor="heading" className="flex items-center gap-2">
              <span>Heading</span>
              {hasTranslation('heading', activeLanguage) ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <AlertCircle className="h-3 w-3 text-yellow-500" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({languages.find(l => l.code === activeLanguage)?.name})
              </span>
            </Label>
            <Input
              id="heading"
              value={component.data.heading?.[activeLanguage] || component.data.title?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedHeading = { ...component.data.heading, [activeLanguage]: e.target.value }
                updateData('heading', updatedHeading)
              }}
              placeholder="Enter CTA heading"
              className={!hasTranslation('heading', activeLanguage) ? 'border-yellow-300 dark:border-yellow-600' : ''}
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="flex items-center gap-2">
              <span>Description</span>
              {hasTranslation('description', activeLanguage) ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <AlertCircle className="h-3 w-3 text-yellow-500" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({languages.find(l => l.code === activeLanguage)?.name})
              </span>
            </Label>
            <Input
              id="description"
              value={component.data.description?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedDescription = { ...component.data.description, [activeLanguage]: e.target.value }
                updateData('description', updatedDescription)
              }}
              placeholder="Enter CTA description"
              className={!hasTranslation('description', activeLanguage) ? 'border-yellow-300 dark:border-yellow-600' : ''}
            />
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Primary Button</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="ctaButtonText" className="flex items-center gap-2">
                  <span>Button Text</span>
                  {hasTranslation('ctaButtonText', activeLanguage) ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({languages.find(l => l.code === activeLanguage)?.name})
                  </span>
                </Label>
                <Input
                  id="ctaButtonText"
                  value={component.data.ctaButtonText?.[activeLanguage] || component.data.primaryButton?.[activeLanguage] || ''}
                  onChange={(e) => {
                    const updatedButtonText = { ...component.data.ctaButtonText, [activeLanguage]: e.target.value }
                    updateData('ctaButtonText', updatedButtonText)
                  }}
                  placeholder="Enter button text"
                  className={!hasTranslation('ctaButtonText', activeLanguage) ? 'border-yellow-300 dark:border-yellow-600' : ''}
                />
              </div>
              <div>
                <Label htmlFor="ctaButtonLink">Button Link</Label>
                <Input
                  id="ctaButtonLink"
                  value={component.data.ctaButtonLink || ''}
                  onChange={(e) => updateData('ctaButtonLink', e.target.value)}
                  placeholder="/contact"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Secondary Button</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="secondaryButton" className="flex items-center gap-2">
                  <span>Button Text</span>
                  {hasTranslation('secondaryButton', activeLanguage) ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({languages.find(l => l.code === activeLanguage)?.name})
                  </span>
                </Label>
                <Input
                  id="secondaryButton"
                  value={getMultilingualText('secondaryButton', activeLanguage)}
                  onChange={(e) => updateMultilingualText('secondaryButton', activeLanguage, e.target.value)}
                  placeholder="Enter button text"
                  className={!hasTranslation('secondaryButton', activeLanguage) ? 'border-yellow-300 dark:border-yellow-600' : ''}
                />
              </div>
              <div>
                <Label htmlFor="secondaryButtonLink">Button Link</Label>
                <Input
                  id="secondaryButtonLink"
                  value={component.data.secondaryButtonLink || ''}
                  onChange={(e) => updateData('secondaryButtonLink', e.target.value)}
                  placeholder="/projects"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer Component Fields */}
      {component.type === 'spacer' && (
        <div>
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            value={component.data.height || 60}
            onChange={(e) => updateData('height', parseInt(e.target.value) || 60)}
            min="10"
            max="500"
          />
        </div>
      )}

      {/* Common Style Fields */}
      <div className="border-t pt-4">
        <h5 className="font-medium text-gray-900 mb-3">Styling</h5>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="backgroundColor"
                type="color"
                value={component.data.backgroundColor || '#ffffff'}
                onChange={(e) => updateData('backgroundColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={component.data.backgroundColor || '#ffffff'}
                onChange={(e) => updateData('backgroundColor', e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="textColor"
                type="color"
                value={component.data.textColor || '#000000'}
                onChange={(e) => updateData('textColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={component.data.textColor || '#000000'}
                onChange={(e) => updateData('textColor', e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="border-t pt-3">
            <Label className="mb-2 block">Padding (px)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="paddingTop" className="text-xs text-gray-600">Top</Label>
                <Input
                  id="paddingTop"
                  type="number"
                  value={component.data.padding?.top || 0}
                  onChange={(e) => {
                    const currentPadding = component.data.padding || { top: 0, right: 0, bottom: 0, left: 0 }
                    updateData('padding', { ...currentPadding, top: parseInt(e.target.value) || 0 })
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paddingRight" className="text-xs text-gray-600">Right</Label>
                <Input
                  id="paddingRight"
                  type="number"
                  value={component.data.padding?.right || 0}
                  onChange={(e) => {
                    const currentPadding = component.data.padding || { top: 0, right: 0, bottom: 0, left: 0 }
                    updateData('padding', { ...currentPadding, right: parseInt(e.target.value) || 0 })
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paddingBottom" className="text-xs text-gray-600">Bottom</Label>
                <Input
                  id="paddingBottom"
                  type="number"
                  value={component.data.padding?.bottom || 0}
                  onChange={(e) => {
                    const currentPadding = component.data.padding || { top: 0, right: 0, bottom: 0, left: 0 }
                    updateData('padding', { ...currentPadding, bottom: parseInt(e.target.value) || 0 })
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paddingLeft" className="text-xs text-gray-600">Left</Label>
                <Input
                  id="paddingLeft"
                  type="number"
                  value={component.data.padding?.left || 0}
                  onChange={(e) => {
                    const currentPadding = component.data.padding || { top: 0, right: 0, bottom: 0, left: 0 }
                    updateData('padding', { ...currentPadding, left: parseInt(e.target.value) || 0 })
                  }}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}