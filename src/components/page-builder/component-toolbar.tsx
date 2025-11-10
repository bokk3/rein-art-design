'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PageComponent } from '@/types/page-builder'
import { 
  Type, 
  Image, 
  Grid, 
  Megaphone, 
  Space, 
  Star,
  Plus,
  Film,
  Columns,
  Layers,
  Award,
  ChevronDown,
  Sliders
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
    type: 'hero-carousel' as const,
    label: 'Hero Carousel',
    icon: Sliders,
    description: 'Full-page image carousel with auto-scroll'
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
    type: 'gallery-showcase' as const,
    label: 'Gallery Showcase',
    icon: Film,
    description: 'Auto-scrolling full-width image showcase'
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
  },
  {
    type: 'split-screen' as const,
    label: 'Split Screen',
    icon: Columns,
    description: 'Image and text side by side'
  },
  {
    type: 'image-text-overlay' as const,
    label: 'Image with Overlay',
    icon: Layers,
    description: 'Text overlaid on large image'
  },
  {
    type: 'feature-showcase' as const,
    label: 'Feature Showcase',
    icon: Award,
    description: 'Large showcase for featured project'
  }
]

export function ComponentToolbar({ onAddComponent }: ComponentToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (type: PageComponent['type']) => {
    onAddComponent(type)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Plus className="h-4 w-4" />
        <span>Add Component</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 z-20 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <div className="p-2">
              {componentTypes.map(({ type, label, icon: Icon, description }) => (
                <button
                  key={type}
                  onClick={() => handleSelect(type)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}