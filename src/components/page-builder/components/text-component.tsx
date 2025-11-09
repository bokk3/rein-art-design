'use client'

import React from 'react'
import { ComponentData } from '@/types/page-builder'
import { getText } from '../utils/text-helpers'
import { EditableText } from '../utils/editable-text'

interface TextComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
  isEditing?: boolean
  onUpdate?: (field: keyof ComponentData, value: string) => void
}

export function TextComponent({ data, getText, isEditing = false, onUpdate }: TextComponentProps) {
  const containerStyle = {
    backgroundColor: data.backgroundColor || '#ffffff',
    color: data.textColor || '#000000',
    padding: data.padding ? 
      `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px` : 
      undefined
  }

  return (
    <div 
      className="py-8 px-8"
      style={containerStyle}
    >
      <div className={`max-w-4xl mx-auto prose prose-lg ${
        data.alignment === 'center' ? 'text-center' : 
        data.alignment === 'right' ? 'text-right' : 'text-left'
      }`}>
        {isEditing && onUpdate ? (
          <EditableText
            value={getText(data.content)}
            field="content"
            className="prose prose-lg w-full"
            as="span"
            multiline
            isEditing={isEditing}
            onUpdate={(val) => onUpdate('content', val)}
          />
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: getText(data.content) }}
            style={{ color: data.textColor }}
          />
        )}
      </div>
    </div>
  )
}

