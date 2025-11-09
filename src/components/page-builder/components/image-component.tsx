'use client'

import React from 'react'
import { ComponentData } from '@/types/page-builder'
import Image from 'next/image'
import { getText } from '../utils/text-helpers'
import { EditableText } from '../utils/editable-text'

interface ImageComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
  isEditing?: boolean
  onUpdate?: (field: keyof ComponentData, value: string) => void
}

export function ImageComponent({ data, getText, isEditing = false, onUpdate }: ImageComponentProps) {
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
      <div className="max-w-4xl mx-auto text-center">
        {data.imageUrl ? (
          <div className="relative inline-block">
            <Image
              src={data.imageUrl}
              alt={getText(data.alt) || ''}
              width={800}
              height={600}
              className="rounded-lg shadow-lg"
            />
            {data.caption && (
              <p className="mt-4 text-sm text-gray-600 italic">
                {isEditing && onUpdate ? (
                  <EditableText
                    value={getText(data.caption)}
                    field="caption"
                    className="text-sm text-gray-600 italic"
                    as="span"
                    isEditing={isEditing}
                    onUpdate={(val) => onUpdate('caption', val)}
                  />
                ) : (
                  getText(data.caption)
                )}
              </p>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Select an image</p>
          </div>
        )}
      </div>
    </div>
  )
}

