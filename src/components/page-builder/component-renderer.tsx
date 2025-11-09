'use client'

import React from 'react'
import { PageComponent, ComponentData } from '@/types/page-builder'
// Import extracted components
import { HeroComponent } from './components/hero-component'
import { SplitScreenComponent } from './components/split-screen-component'
import { ImageTextOverlayComponent } from './components/image-text-overlay-component'
import { FeatureShowcaseComponent } from './components/feature-showcase-component'
import { TextComponent } from './components/text-component'
import { ImageComponent } from './components/image-component'
import { SpacerComponent } from './components/spacer-component'
import { FeaturesComponent } from './components/features-component'
import { GalleryComponent } from './components/gallery-component'
import { GalleryShowcaseComponent } from './components/gallery-showcase-component'
import { TestimonialsComponent } from './components/testimonials-component'
import { CTAComponent } from './components/cta-component'
// Import utilities
import { getText as getTextUtil } from './utils/text-helpers'

interface ComponentRendererProps {
  component: PageComponent
  isPreview?: boolean
  currentLanguage?: string
  onProjectClick?: (project: any) => void
  isEditing?: boolean
  onUpdate?: (data: any) => void
}


export function ComponentRenderer({ 
  component, 
  isPreview = false, 
  currentLanguage = 'nl',
  onProjectClick,
  isEditing = false,
  onUpdate
}: ComponentRendererProps) {
  const { type, data } = component

  // Helper function to get multilingual text
  const getText = (text: string | { [key: string]: string } | undefined): string => {
    return getTextUtil(text, currentLanguage)
  }

  // Helper function to update multilingual text
  const updateMultilingualText = (field: keyof typeof data, value: string) => {
    if (!onUpdate) return
    
    const currentValue = data[field]
    const newValue: { [key: string]: string } = typeof currentValue === 'string' 
      ? { [currentLanguage]: value }
      : { ...(currentValue as { [key: string]: string } || {}), [currentLanguage]: value }
    
    onUpdate({ ...data, [field]: newValue })
  }

  // Helper function to update nested array fields (like features, testimonials)
  const updateNestedField = (arrayField: string, index: number, field: string, value: string) => {
    if (!onUpdate) return
    
    const array = (data[arrayField as keyof typeof data] as any[]) || []
    const updatedArray = [...array]
    if (updatedArray[index]) {
      const currentValue = updatedArray[index][field]
      const newValue: { [key: string]: string } = typeof currentValue === 'string'
        ? { [currentLanguage]: value }
        : { ...(currentValue as { [key: string]: string } || {}), [currentLanguage]: value }
      updatedArray[index] = { ...updatedArray[index], [field]: newValue }
      onUpdate({ ...data, [arrayField]: updatedArray })
    }
  }

  switch (type) {
    case 'hero':
      return (
        <HeroComponent
          data={data}
          currentLanguage={currentLanguage}
          isEditing={isEditing}
          getText={getText}
        />
      )
      
    case 'split-screen':
      return (
        <SplitScreenComponent
          data={data}
          getText={getText}
        />
      )
      
    case 'image-text-overlay':
      return (
        <ImageTextOverlayComponent
          data={data}
          getText={getText}
        />
      )
      
    case 'feature-showcase':
      return (
        <FeatureShowcaseComponent
          data={data}
          getText={getText}
          currentLanguage={currentLanguage}
        />
      )

    case 'features':
      return (
        <FeaturesComponent
          data={data}
          getText={getText}
          isEditing={isEditing}
          onUpdate={(field, value) => updateMultilingualText(field, value)}
          onUpdateNested={updateNestedField}
        />
      )

    case 'text':
      return (
        <TextComponent
          data={data}
          getText={getText}
          isEditing={isEditing}
          onUpdate={(field, value) => updateMultilingualText(field, value)}
        />
      )

    case 'image':
      return (
        <ImageComponent
          data={data}
          getText={getText}
          isEditing={isEditing}
          onUpdate={(field, value) => updateMultilingualText(field, value)}
        />
      )

    case 'gallery':
      return (
        <GalleryComponent
          data={data}
          getText={getText}
          currentLanguage={currentLanguage}
          isEditing={isEditing}
          onProjectClick={onProjectClick}
          onUpdate={(field, value) => updateMultilingualText(field, value)}
        />
      )

    case 'gallery-showcase':
      return <GalleryShowcaseComponent data={data} isEditing={isEditing} />

    case 'testimonials':
      return (
        <TestimonialsComponent
          data={data}
          getText={getText}
          isEditing={isEditing}
          onUpdate={(field, value) => updateMultilingualText(field, value)}
          onUpdateNested={updateNestedField}
        />
      )

    case 'cta':
      return (
        <CTAComponent
          data={data}
          getText={getText}
          isEditing={isEditing}
          onUpdate={(field, value) => updateMultilingualText(field, value)}
        />
      )

    case 'spacer':
      return <SpacerComponent data={data} />

    default:
      return (
        <div className="py-8 px-8 text-center text-gray-500">
          Unknown component type: {type}
        </div>
      )
  }
}