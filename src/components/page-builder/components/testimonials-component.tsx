'use client'

import React from 'react'
import { ComponentData } from '@/types/page-builder'
import { Star } from 'lucide-react'
import { getText } from '../utils/text-helpers'
import { EditableText } from '../utils/editable-text'

interface TestimonialsComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
  isEditing?: boolean
  onUpdate?: (field: keyof ComponentData, value: string) => void
  onUpdateNested?: (arrayField: string, index: number, field: string, value: string) => void
}

export function TestimonialsComponent({ 
  data, 
  getText, 
  isEditing = false, 
  onUpdate,
  onUpdateNested 
}: TestimonialsComponentProps) {
  // Use Tailwind classes only for specific string values, otherwise use inline style
  const testimonialsBgClass = data.backgroundColor === 'white' 
    ? 'bg-white dark:bg-[#181818]' 
    : data.backgroundColor === 'gray-50' 
    ? 'bg-gray-50 dark:bg-gray-800' 
    : ''
  
  // Build style object - only include properties that are explicitly set
  const testimonialsStyle: React.CSSProperties = {}
  if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
    testimonialsStyle.backgroundColor = data.backgroundColor
  }
  if (data.textColor) {
    testimonialsStyle.color = data.textColor
  }
  if (data.padding) {
    testimonialsStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
  }

  return (
    <div 
      className={`py-20 px-4 sm:px-6 lg:px-8 ${testimonialsBgClass}`}
      style={Object.keys(testimonialsStyle).length > 0 ? testimonialsStyle : undefined}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {data.title && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {isEditing && onUpdate ? (
                <EditableText
                  value={getText(data.title)}
                  field="title"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                  as="span"
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate('title', val)}
                />
              ) : (
                getText(data.title)
              )}
            </h2>
          )}
        </div>
        
        {data.testimonials && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="bg-white dark:bg-[#1a1a1a] p-8 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-700 dark:text-gray-300 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  {isEditing && onUpdateNested ? (
                    <EditableText
                      value={getText(testimonial.content)}
                      field={`testimonial-${index}-content`}
                      className="text-gray-700 dark:text-gray-300 italic"
                      as="span"
                      multiline
                      isEditing={isEditing}
                      onUpdate={(val) => onUpdateNested('testimonials', index, 'content', val)}
                    />
                  ) : (
                    `"${getText(testimonial.content)}"`
                  )}
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {isEditing && onUpdateNested ? (
                      <EditableText
                        value={getText(testimonial.role)}
                        field={`testimonial-${index}-role`}
                        className="text-gray-600 dark:text-gray-400 text-sm"
                        as="span"
                        isEditing={isEditing}
                        onUpdate={(val) => onUpdateNested('testimonials', index, 'role', val)}
                      />
                    ) : (
                      getText(testimonial.role)
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

