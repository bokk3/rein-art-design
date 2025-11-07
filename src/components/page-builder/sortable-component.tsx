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
  onMoveUp,
  onMoveDown
}: SortableComponentProps) {

  return (
    <div
      className={`relative group border-2 transition-colors ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-transparent hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Component Content */}
      <ComponentRenderer component={component} isPreview={false} />
      
      {/* Overlay Controls */}
      <div className={`absolute inset-0 bg-blue-500 bg-opacity-10 transition-opacity ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        {/* Move Controls */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {onMoveUp && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                onMoveUp()
              }}
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
                onMoveDown()
              }}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Component Type Label */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)} (#{index + 1})
        </div>
      </div>
    </div>
  )
}