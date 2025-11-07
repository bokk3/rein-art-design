'use client'

import { useState, useCallback, useEffect } from 'react'
// import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
// import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { PageComponent, ComponentData, MultilingualText } from '@/types/page-builder'
import { SortableComponent } from './sortable-component'
import { ComponentEditor } from './component-editor'
import { ComponentToolbar } from './component-toolbar'
import { Button } from '@/components/ui/button'
import { Save, Eye, Plus, Languages, Loader2 } from 'lucide-react'

interface PageBuilderProps {
  initialComponents?: PageComponent[]
  onSave?: (components: PageComponent[]) => void
  onPreview?: (components: PageComponent[]) => void
}

interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
}

export function PageBuilder({ 
  initialComponents = [], 
  onSave, 
  onPreview 
}: PageBuilderProps) {
  const [components, setComponents] = useState<PageComponent[]>(initialComponents)
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [languages, setLanguages] = useState<Language[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationStatus, setTranslationStatus] = useState<string>('')
  const [apiConfigured, setApiConfigured] = useState(false)

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages')
        if (response.ok) {
          const langs = await response.json()
          setLanguages(langs)
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

  const moveComponent = useCallback((fromIndex: number, toIndex: number) => {
    setComponents((items) => {
      const newItems = [...items]
      const [movedItem] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, movedItem)
      
      // Update order values
      return newItems.map((item, index) => ({
        ...item,
        order: index
      }))
    })
  }, [])

  const addComponent = useCallback((type: PageComponent['type']) => {
    const newComponent: PageComponent = {
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      order: components.length,
      data: getDefaultComponentData(type)
    }

    setComponents(prev => [...prev, newComponent])
    setSelectedComponent(newComponent)
    setIsEditing(true)
  }, [components.length])

  const updateComponent = useCallback((id: string, data: ComponentData) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, data } : comp
      )
    )
  }, [])

  const deleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
      setIsEditing(false)
    }
  }, [selectedComponent])

  const duplicateComponent = useCallback((component: PageComponent) => {
    const newComponent: PageComponent = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: components.length
    }

    setComponents(prev => [...prev, newComponent])
  }, [components.length])

  const handleSave = useCallback(() => {
    onSave?.(components)
  }, [components, onSave])

  const handlePreview = useCallback(() => {
    onPreview?.(components)
  }, [components, onPreview])

  // Get multilingual fields for a component type
  const getMultilingualFields = (componentType: PageComponent['type']): string[] => {
    const fields: string[] = []
    switch (componentType) {
      case 'hero':
        fields.push('title', 'subtitle', 'description', 'primaryButton', 'secondaryButton', 'heroButtonText')
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
        // Features are handled separately in the array
        fields.push('title', 'subtitle')
        break
      case 'gallery':
        fields.push('title', 'subtitle')
        break
      case 'testimonials':
        // Testimonials are handled separately in the array
        fields.push('title')
        break
    }
    return fields
  }

  // Translate all components
  const handleTranslateAll = useCallback(async () => {
    if (!apiConfigured || languages.length === 0) {
      alert('Translation API is not configured or no languages available')
      return
    }

    const defaultLang = languages.find(l => l.isDefault)
    if (!defaultLang) {
      alert('No default language found')
      return
    }

    const sourceLanguage = defaultLang.code
    const targetLangs = languages
      .filter(l => l.code !== sourceLanguage && (l.isActive !== false))
      .map(l => l.code)

    if (targetLangs.length === 0) {
      alert('No other active languages to translate to')
      return
    }

    setIsTranslating(true)
    setTranslationStatus('Translating all components...')

    try {
      const updatedComponents = await Promise.all(
        components.map(async (component) => {
          const fields = getMultilingualFields(component.type)
          const updatedData = { ...component.data }
          let hasUpdates = false

          // Translate each multilingual field
          for (const field of fields) {
            // For CTA components, also check 'title' if 'heading' doesn't exist
            let value = component.data[field as keyof ComponentData] as MultilingualText | undefined
            if (!value || typeof value === 'string') {
              // Special case: CTA might use 'title' instead of 'heading'
              if (component.type === 'cta' && field === 'heading') {
                const titleValue = component.data.title as MultilingualText | undefined
                if (titleValue && typeof titleValue === 'object') {
                  value = titleValue
                }
              }
              if (!value || typeof value === 'string') continue
            }

            const sourceText = value[sourceLanguage]
            if (!sourceText || !sourceText.trim()) continue

            try {
              setTranslationStatus(`Translating ${component.type} - ${field}...`)
              
              const response = await fetch('/api/admin/translate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  text: sourceText,
                  fromLang: sourceLanguage,
                  toLangs: targetLangs,
                  contentType: 'text'
                })
              })

              if (response.ok) {
                const data = await response.json()
                
                // Create updated multilingual value with all languages
                const updatedValue: MultilingualText = {
                  ...(value && typeof value === 'object' ? value : {}),
                  [sourceLanguage]: sourceText // Keep source
                }

                // Add translations for all target languages
                for (const [langCode, translatedText] of Object.entries(data.translations)) {
                  if (translatedText && typeof translatedText === 'string' && translatedText.trim()) {
                    updatedValue[langCode] = translatedText
                  }
                }

                // For CTA, always save as 'heading' (normalize from 'title' if needed)
                const targetField = (component.type === 'cta' && field === 'heading') ? 'heading' : field
                
                updatedData[targetField as keyof ComponentData] = updatedValue as any
                hasUpdates = true
              }

              // Add delay to respect rate limits
              await new Promise(resolve => setTimeout(resolve, 250))
            } catch (error) {
              console.error(`Error translating ${component.type}.${field}:`, error)
            }
          }

          // Handle features array (special case)
          if (component.type === 'features' && Array.isArray(component.data.features)) {
            const updatedFeatures = await Promise.all(
              component.data.features.map(async (feature: any) => {
                const updatedFeature = { ...feature }
                let featureHasUpdates = false

                // Translate feature title
                if (feature.title && typeof feature.title === 'object' && feature.title[sourceLanguage]) {
                  const sourceTitle = feature.title[sourceLanguage]
                  try {
                    const response = await fetch('/api/admin/translate-content', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        text: sourceTitle,
                        fromLang: sourceLanguage,
                        toLangs: targetLangs,
                        contentType: 'text'
                      })
                    })

                    if (response.ok) {
                      const data = await response.json()
                      updatedFeature.title = {
                        ...feature.title,
                        [sourceLanguage]: sourceTitle,
                        ...Object.fromEntries(
                          Object.entries(data.translations).map(([code, text]) => [code, text])
                        )
                      }
                      featureHasUpdates = true
                    }
                    await new Promise(resolve => setTimeout(resolve, 250))
                  } catch (error) {
                    console.error('Error translating feature title:', error)
                  }
                }

                // Translate feature description
                if (feature.description && typeof feature.description === 'object' && feature.description[sourceLanguage]) {
                  const sourceDesc = feature.description[sourceLanguage]
                  try {
                    const response = await fetch('/api/admin/translate-content', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        text: sourceDesc,
                        fromLang: sourceLanguage,
                        toLangs: targetLangs,
                        contentType: 'text'
                      })
                    })

                    if (response.ok) {
                      const data = await response.json()
                      updatedFeature.description = {
                        ...feature.description,
                        [sourceLanguage]: sourceDesc,
                        ...Object.fromEntries(
                          Object.entries(data.translations).map(([code, text]) => [code, text])
                        )
                      }
                      featureHasUpdates = true
                    }
                    await new Promise(resolve => setTimeout(resolve, 250))
                  } catch (error) {
                    console.error('Error translating feature description:', error)
                  }
                }

                return featureHasUpdates ? updatedFeature : feature
              })
            )
            updatedData.features = updatedFeatures
            hasUpdates = true
          }

          // Handle testimonials array (special case)
          if (component.type === 'testimonials' && Array.isArray(component.data.testimonials)) {
            const updatedTestimonials = await Promise.all(
              component.data.testimonials.map(async (testimonial: any) => {
                const updatedTestimonial = { ...testimonial }
                let testimonialHasUpdates = false

                // Translate testimonial role
                if (testimonial.role && typeof testimonial.role === 'object' && testimonial.role[sourceLanguage]) {
                  const sourceRole = testimonial.role[sourceLanguage]
                  try {
                    const response = await fetch('/api/admin/translate-content', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        text: sourceRole,
                        fromLang: sourceLanguage,
                        toLangs: targetLangs,
                        contentType: 'text'
                      })
                    })

                    if (response.ok) {
                      const data = await response.json()
                      updatedTestimonial.role = {
                        ...testimonial.role,
                        [sourceLanguage]: sourceRole,
                        ...Object.fromEntries(
                          Object.entries(data.translations).map(([code, text]) => [code, text])
                        )
                      }
                      testimonialHasUpdates = true
                    }
                    await new Promise(resolve => setTimeout(resolve, 250))
                  } catch (error) {
                    console.error('Error translating testimonial role:', error)
                  }
                }

                // Translate testimonial content
                if (testimonial.content && typeof testimonial.content === 'object' && testimonial.content[sourceLanguage]) {
                  const sourceContent = testimonial.content[sourceLanguage]
                  try {
                    const response = await fetch('/api/admin/translate-content', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        text: sourceContent,
                        fromLang: sourceLanguage,
                        toLangs: targetLangs,
                        contentType: 'text'
                      })
                    })

                    if (response.ok) {
                      const data = await response.json()
                      updatedTestimonial.content = {
                        ...testimonial.content,
                        [sourceLanguage]: sourceContent,
                        ...Object.fromEntries(
                          Object.entries(data.translations).map(([code, text]) => [code, text])
                        )
                      }
                      testimonialHasUpdates = true
                    }
                    await new Promise(resolve => setTimeout(resolve, 250))
                  } catch (error) {
                    console.error('Error translating testimonial content:', error)
                  }
                }

                return testimonialHasUpdates ? updatedTestimonial : testimonial
              })
            )
            updatedData.testimonials = updatedTestimonials
            hasUpdates = true
          }

          return hasUpdates ? { ...component, data: updatedData } : component
        })
      )

      setComponents(updatedComponents)
      setTranslationStatus(`Translation complete! Translated ${updatedComponents.length} component(s).`)
      setTimeout(() => setTranslationStatus(''), 5000)
    } catch (error) {
      console.error('Error translating components:', error)
      setTranslationStatus('Translation failed. Please try again.')
      setTimeout(() => setTranslationStatus(''), 5000)
    } finally {
      setIsTranslating(false)
    }
  }, [components, languages, apiConfigured])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <ComponentToolbar onAddComponent={addComponent} />
            
            <div className="flex items-center gap-2">
              {apiConfigured && components.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleTranslateAll}
                  disabled={isTranslating}
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
                      <span>Translate All</span>
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          {translationStatus && !isTranslating && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-700 dark:text-green-300">
              {translationStatus}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto pb-20">
          <div className="p-6 pt-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-96 text-center">
                  <div>
                    <div className="text-gray-400 mb-4">
                      <Plus className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Start Building Your Page
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Add components from the toolbar above to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {components.map((component, index) => (
                    <SortableComponent
                      key={component.id}
                      component={component}
                      index={index}
                      isSelected={selectedComponent?.id === component.id}
                      onSelect={() => {
                        setSelectedComponent(component)
                        setIsEditing(true)
                      }}
                      onDelete={() => deleteComponent(component.id)}
                      onDuplicate={() => duplicateComponent(component)}
                      onMoveUp={index > 0 ? () => moveComponent(index, index - 1) : undefined}
                      onMoveDown={index < components.length - 1 ? () => moveComponent(index, index + 1) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Component Editor Sidebar */}
      {isEditing && selectedComponent && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Component</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                ×
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <ComponentEditor
              component={selectedComponent}
              onChange={(data) => updateComponent(selectedComponent.id, data)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function getDefaultComponentData(type: PageComponent['type']): ComponentData {
  switch (type) {
    case 'hero':
      return {
        title: {
          nl: 'Welkom bij Ons Portfolio',
          fr: 'Bienvenue dans Notre Portfolio'
        },
        subtitle: {
          nl: 'Ontdek unieke handgemaakte stukken gemaakt met kwaliteitsmaterialen en aandacht voor detail.',
          fr: 'Découvrez des pièces artisanales uniques fabriquées avec des matériaux de qualité et une attention aux détails.'
        },
        heroButtonText: {
          nl: 'Bekijk Projecten',
          fr: 'Voir les Projets'
        },
        heroButtonLink: '/projects',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      }
    case 'text':
      return {
        content: {
          nl: 'Voeg hier uw tekstinhoud toe...',
          fr: 'Ajoutez votre contenu textuel ici...'
        },
        alignment: 'left',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      }
    case 'image':
      return {
        imageUrl: '',
        alt: {
          nl: 'Afbeelding beschrijving',
          fr: 'Description de l\'image'
        },
        caption: {
          nl: '',
          fr: ''
        },
        backgroundColor: '#ffffff'
      }
    case 'gallery':
      return {
        images: [],
        backgroundColor: '#ffffff'
      }
    case 'cta':
      return {
        heading: {
          nl: 'Klaar om Uw Project te Starten?',
          fr: 'Prêt à Commencer Votre Projet?'
        },
        description: {
          nl: 'Neem contact met ons op om uw ideeën te bespreken en te leren hoe we uw visie tot leven kunnen brengen.',
          fr: 'Contactez-nous pour discuter de vos idées et apprendre comment nous pouvons donner vie à votre vision.'
        },
        ctaButtonText: {
          nl: 'Contact Opnemen',
          fr: 'Nous Contacter'
        },
        ctaButtonLink: '/contact',
        backgroundColor: '#000000',
        textColor: '#ffffff'
      }
    case 'spacer':
      return {
        height: 60,
        backgroundColor: '#ffffff'
      }
    default:
      return {}
  }
}