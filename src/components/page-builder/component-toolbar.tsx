'use client'

import { Button } from '@/components/ui/button'
import { PageComponent } from '@/types/page-builder'
import { 
  Type, 
  Image, 
  Grid, 
  Megaphone, 
  Space, 
  Star,
  Plus
} from 'lucide-react'

interface ComponentToolbarProps {
  onAddComponent: (type: PageComponent['type']) => void
}

const componentTypes = [
  {
    type: 'hero' as const,
    label: 'Hero Section',
    icon: Star,
    description: 'Large banner with title, subtitle and call-to-action'
  },
  {
    type: 'text' as const,
    label: 'Text Block',
    icon: Type,
    description: 'Rich text content with formatting options'
  },
  {
    type: 'image' as const,
    label: 'Image',
    icon: Image,
    description: 'Single image with optional caption'
  },
  {
    type: 'gallery' as const,
    label: 'Gallery',
    icon: Grid,
    description: 'Grid of images from your media library'
  },
  {
    type: 'cta' as const,
    label: 'Call to Action',
    icon: Megaphone,
    description: 'Highlighted section with button'
  },
  {
    type: 'spacer' as const,
    label: 'Spacer',
    icon: Space,
    description: 'Add vertical spacing between sections'
  }
]

export function ComponentToolbar({ onAddComponent }: ComponentToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Add Component:</span>
      
      {componentTypes.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          onClick={() => onAddComponent(type)}
          className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  )
}