'use client'

import { PageComponent } from '@/types/page-builder'
import { ComponentRenderer } from './component-renderer'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, Edit, Copy, Trash2 } from 'lucide-react'

interface SortableComponentProps {
  component: PageComponent
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onUpdate?: (data: any) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function SortableComponent({
  component,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
  onMoveUp,
  onMoveDown
}: SortableComponentProps) {

  return (
    <div
      className={`relative group border-2 transition-colors ${
        isSelected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-transparent hover:border-gray-300'
      }`}
      onClick={(e) => {
        // Don't select if clicking on editable elements or overlay controls
        if ((e.target as HTMLElement).closest('[data-editable]') || 
            (e.target as HTMLElement).closest('button') ||
            (e.target as HTMLElement).closest('.absolute')) {
          return
        }
        onSelect()
      }}
    >
      {/* Component Content */}
      <ComponentRenderer 
        component={component} 
        isPreview={false}
        isEditing={isSelected}
        onUpdate={onUpdate}
      />
      
      {/* Overlay Controls - No background overlay, just controls */}
      <div className={`absolute inset-0 pointer-events-none z-50 ${
        isSelected ? 'pointer-events-auto' : 'group-hover:pointer-events-auto'
      }`}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Move Controls */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-[60]">
          {onMoveUp && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onMoveUp()
              }}
              className="pointer-events-auto bg-white dark:bg-gray-800 shadow-lg"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onMoveDown()
              }}
              className="pointer-events-auto bg-white dark:bg-gray-800 shadow-lg"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1 z-[60]">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onSelect()
            }}
            className="pointer-events-auto bg-white dark:bg-gray-800 shadow-lg"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onDuplicate()
            }}
            className="pointer-events-auto bg-white dark:bg-gray-800 shadow-lg"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onDelete()
            }}
            className="pointer-events-auto bg-white dark:bg-gray-800 shadow-lg"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Component Type Label */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded z-[60] pointer-events-auto">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)} (#{index + 1})
        </div>
      </div>
    </div>
  )
}