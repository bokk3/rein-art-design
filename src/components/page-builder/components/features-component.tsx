'use client'

import React from 'react'
import { ComponentData } from '@/types/page-builder'
import { 
  Award, 
  Users, 
  Clock, 
  Star, 
  CheckCircle, 
  Heart,
  Shield,
  Zap,
  Target,
  Lightbulb,
  Palette,
  Hammer,
  Wrench,
  Settings,
  Cog,
  HardHat,
  ToolCase,
  Box,
  Package,
  Factory,
  Truck,
  Ruler,
  Square,
  Scissors,
  Paintbrush,
  Pen,
  Layers,
  FileText,
  Briefcase,
  Building,
  Home,
  Sofa,
  Table,
  Archive,
  Sparkles,
  Hand,
  Handshake
} from 'lucide-react'
import { getText } from '../utils/text-helpers'
import { EditableText } from '../utils/editable-text'

interface FeaturesComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
  isEditing?: boolean
  onUpdate?: (field: keyof ComponentData, value: string) => void
  onUpdateNested?: (arrayField: string, index: number, field: string, value: string) => void
}

const getIcon = (iconName: string, iconColor?: string) => {
  const icons = {
    award: Award,
    users: Users,
    clock: Clock,
    star: Star,
    check: CheckCircle,
    heart: Heart,
    shield: Shield,
    zap: Zap,
    target: Target,
    lightbulb: Lightbulb,
    palette: Palette,
    hammer: Hammer,
    wrench: Wrench,
    settings: Settings,
    cog: Cog,
    hardhat: HardHat,
    tool: ToolCase,
    box: Box,
    package: Package,
    factory: Factory,
    truck: Truck,
    ruler: Ruler,
    square: Square,
    scissors: Scissors,
    paintbrush: Paintbrush,
    pen: Pen,
    layers: Layers,
    filetext: FileText,
    briefcase: Briefcase,
    building: Building,
    home: Home,
    sofa: Sofa,
    table: Table,
    archive: Archive,
    sparkles: Sparkles,
    hand: Hand,
    handshake: Handshake
  }
  const IconComponent = icons[iconName as keyof typeof icons] || Award
  const iconStyle = iconColor ? { color: iconColor } : undefined
  return <IconComponent className="w-12 h-12" style={iconStyle} />
}

export function FeaturesComponent({ data, getText, isEditing = false, onUpdate, onUpdateNested }: FeaturesComponentProps) {
  // Use Tailwind classes only for specific string values, otherwise use inline style
  const featuresBgClass = data.backgroundColor === 'white' 
    ? 'bg-white dark:bg-[#181818]' 
    : data.backgroundColor === 'gray-50' 
    ? 'bg-gray-50 dark:bg-[#1a1a1a]' 
    : ''
  
  // Build style object - only include properties that are explicitly set
  const featuresStyle: React.CSSProperties = {}
  if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
    featuresStyle.backgroundColor = data.backgroundColor
  }
  if (data.textColor) {
    featuresStyle.color = data.textColor
  }
  if (data.padding) {
    featuresStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
  }

  return (
    <div 
      className={`py-20 px-4 sm:px-6 lg:px-8 ${featuresBgClass}`}
      style={Object.keys(featuresStyle).length > 0 ? featuresStyle : undefined}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {data.title && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
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
          {data.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {isEditing && onUpdate ? (
                <EditableText
                  value={getText(data.subtitle)}
                  field="subtitle"
                  className="text-xl text-gray-600 dark:text-gray-300"
                  as="span"
                  isEditing={isEditing}
                  onUpdate={(val) => onUpdate('subtitle', val)}
                />
              ) : (
                getText(data.subtitle)
              )}
            </p>
          )}
        </div>
        
        {data.features && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.features.map((feature: any, index: number) => {
              // Get icon color from feature or component level, with fallback
              const iconColor = feature.iconColor || data.featuresIconColor
              const iconBgColor = feature.iconBgColor || data.featuresIconBgColor
              
              // Build icon container style
              const iconContainerStyle: React.CSSProperties = {}
              if (iconBgColor) {
                iconContainerStyle.backgroundColor = iconBgColor
              }
              if (iconColor) {
                iconContainerStyle.color = iconColor
              }
              
              // Default classes if no custom colors
              const iconContainerClass = !iconBgColor && !iconColor
                ? 'p-4 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400'
                : 'p-4 rounded-full'
              
              return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className={iconContainerClass} style={Object.keys(iconContainerStyle).length > 0 ? iconContainerStyle : undefined}>
                    {getIcon(feature.icon, iconColor)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {isEditing && onUpdateNested ? (
                    <EditableText
                      value={getText(feature.title)}
                      field={`feature-${index}-title`}
                      className="text-xl font-semibold"
                      as="span"
                      isEditing={isEditing}
                      onUpdate={(val) => onUpdateNested('features', index, 'title', val)}
                    />
                  ) : (
                    getText(feature.title)
                  )}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isEditing && onUpdateNested ? (
                    <EditableText
                      value={getText(feature.description)}
                      field={`feature-${index}-description`}
                      className="text-gray-600 dark:text-gray-300 leading-relaxed"
                      as="span"
                      multiline
                      isEditing={isEditing}
                      onUpdate={(val) => onUpdateNested('features', index, 'description', val)}
                    />
                  ) : (
                    getText(feature.description)
                  )}
                </p>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  )
}

