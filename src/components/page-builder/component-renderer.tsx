'use client'

import { PageComponent } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Award, 
  Users, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Heart,
  Shield,
  Zap,
  Target,
  Lightbulb,
  Palette
} from 'lucide-react'
import { ProjectCard } from '@/components/gallery/project-card'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'

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

  const containerStyle = {
    backgroundColor: data.backgroundColor || '#ffffff',
    color: data.textColor || '#000000',
    padding: data.padding ? 
      `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px` : 
      undefined
  }

  // Helper function to get multilingual text
  const getText = (text: string | { [key: string]: string } | undefined): string => {
    if (!text) return ''
    if (typeof text === 'string') return text
    return text[currentLanguage] || text['nl'] || Object.values(text)[0] || ''
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

  // Inline editable text component
  const EditableText = ({ 
    value, 
    field, 
    className, 
    as: Component = 'span',
    multiline = false,
    onUpdate: customUpdate
  }: { 
    value: string
    field: keyof typeof data | string
    className?: string
    as?: keyof JSX.IntrinsicElements
    multiline?: boolean
    onUpdate?: (value: string) => void
  }) => {
    const componentIsEditing = isEditing
    const [isLocalEditing, setIsLocalEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

    useEffect(() => {
      if (isLocalEditing && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, [isLocalEditing])

    useEffect(() => {
      setEditValue(value)
    }, [value])

    if (!isLocalEditing) {
      return (
        <Component
          data-editable
          className={`${className} ${componentIsEditing ? 'cursor-text hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-dashed rounded px-1' : ''} transition-all inline-block`}
          onClick={(e) => {
            if (componentIsEditing) {
              e.stopPropagation()
              setIsLocalEditing(true)
            }
          }}
          onDoubleClick={(e) => {
            if (componentIsEditing) {
              e.stopPropagation()
              setIsLocalEditing(true)
            }
          }}
        >
          {value || (componentIsEditing ? <span className="text-gray-400 italic">Click to edit</span> : '')}
        </Component>
      )
    }

    const handleBlur = () => {
      if (editValue !== value) {
        if (customUpdate) {
          customUpdate(editValue)
        } else if (typeof field === 'string' && field.startsWith('feature-') || field.startsWith('testimonial-')) {
          // Skip - handled by customUpdate
        } else {
          updateMultilingualText(field as keyof typeof data, editValue)
        }
      }
      setIsLocalEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault()
        handleBlur()
      }
      if (e.key === 'Escape') {
        setEditValue(value)
        setIsLocalEditing(false)
      }
    }

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          data-editable
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} w-full bg-white/90 dark:bg-gray-800/90 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onClick={(e) => e.stopPropagation()}
          rows={3}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        data-editable
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} bg-white/90 dark:bg-gray-800/90 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={(e) => e.stopPropagation()}
      />
    )
  }

  switch (type) {
    case 'hero':
      const gradientClass = data.backgroundType === 'gradient' && data.gradient 
        ? `bg-gradient-to-br ${data.gradient}` 
        : ''
      
      // Only use default background if no custom backgroundColor is set
      const defaultHeroBg = !data.backgroundColor && !data.backgroundType && !gradientClass
        ? 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:bg-gray-900' 
        : ''
      
      // Determine if we should use inline style for background (when custom color is set and not gradient)
      const useInlineBackground = data.backgroundColor && data.backgroundType !== 'gradient' && !gradientClass
      
      // Build style object - only include properties that are explicitly set
      const heroStyle: React.CSSProperties = {}
      if (useInlineBackground) {
        heroStyle.backgroundColor = data.backgroundColor || '#ffffff'
      }
      if (data.textColor) {
        heroStyle.color = data.textColor
      }
      if (data.padding) {
        heroStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }

      // Animation variants for hero content
      const heroContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }

      const heroContentVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
          },
        },
      }

      const heroItemVariants = {
        hidden: { 
          opacity: 0, 
          y: 50,
          filter: 'blur(10px)',
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }

      const heroTitleVariants = {
        hidden: { 
          opacity: 0, 
          y: 60,
          scale: 0.95,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }

      const heroButtonVariants = {
        hidden: { 
          opacity: 0, 
          y: 30,
          scale: 0.9,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
        hover: {
          scale: 1.05,
          transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }

      const backgroundImageVariants = {
        hidden: { 
          opacity: 0,
          scale: 1.15,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }
      
      // Calculate height accounting for navigation (h-20 = 80px on md, h-24 = 96px on lg)
      const heroHeightStyle = data.height === 'screen' 
        ? { minHeight: 'calc(100vh - 80px)' } 
        : {}
      
      const combinedStyle = {
        ...heroHeightStyle,
        ...(Object.keys(heroStyle).length > 0 ? heroStyle : {})
      }
      
      return (
        <motion.div 
          className={`relative ${data.height === 'screen' ? '' : 'py-16'} px-4 sm:px-6 lg:px-8 flex items-center justify-center ${gradientClass || defaultHeroBg} overflow-hidden`}
          style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.backgroundImage && (
            <motion.div 
              className="absolute inset-0"
              variants={backgroundImageVariants}
              initial="hidden"
              animate="visible"
            >
              <Image
                src={data.backgroundImage}
                alt=""
                fill
                className="object-cover"
                priority
              />
              <motion.div 
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          )}
          
          <motion.div 
            className="relative z-10 max-w-5xl mx-auto text-center py-8"
            variants={heroContentVariants}
            initial="hidden"
            animate="visible"
          >
            {data.title && (
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight"
                variants={heroTitleVariants}
              >
                {isEditing ? (
                  <EditableText
                    value={getText(data.title)}
                    field="title"
                    className="text-4xl sm:text-5xl lg:text-7xl font-bold"
                    as="span"
                  />
                ) : (
                  getText(data.title)
                )}
              </motion.h1>
            )}
            
            {data.subtitle && (
              <motion.p 
                className="text-xl sm:text-2xl lg:text-3xl mb-4 opacity-90 font-light"
                variants={heroItemVariants}
              >
                {isEditing ? (
                  <EditableText
                    value={getText(data.subtitle)}
                    field="subtitle"
                    className="text-xl sm:text-2xl lg:text-3xl font-light opacity-90"
                    as="span"
                  />
                ) : (
                  getText(data.subtitle)
                )}
              </motion.p>
            )}
            
            {data.description && (
              <motion.p 
                className="text-lg sm:text-xl mb-8 opacity-80 max-w-3xl mx-auto leading-relaxed"
                variants={heroItemVariants}
              >
                {isEditing ? (
                  <EditableText
                    value={getText(data.description)}
                    field="description"
                    className="text-lg sm:text-xl opacity-80 max-w-3xl mx-auto leading-relaxed block"
                    as="span"
                    multiline
                  />
                ) : (
                  getText(data.description)
                )}
              </motion.p>
            )}
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={heroContentVariants}
            >
              {(data.primaryButton || data.heroButtonText) && (
                <motion.div 
                  variants={heroButtonVariants}
                  whileHover={!isEditing ? "hover" : undefined}
                  whileTap={!isEditing ? { scale: 0.95 } : undefined}
                >
                  {isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.primaryButton || data.heroButtonText)}
                        field={data.primaryButton ? "primaryButton" : "heroButtonText"}
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.primaryButtonLink || data.heroButtonLink || "/projects"}>
                      <Button 
                        size="lg"
                        className="w-full sm:w-auto text-lg px-8 py-4 h-auto bg-white text-slate-900 hover:bg-gray-100 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100 border-2 border-transparent transition-all duration-300"
                      >
                        {getText(data.primaryButton || data.heroButtonText)}
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </motion.span>
                      </Button>
                    </Link>
                  )}
                </motion.div>
              )}
              
              {data.secondaryButton && (
                <motion.div 
                  variants={heroButtonVariants}
                  whileHover={!isEditing ? "hover" : undefined}
                  whileTap={!isEditing ? { scale: 0.95 } : undefined}
                >
                  {isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.secondaryButton)}
                        field="secondaryButton"
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.secondaryButtonLink || "/contact"}>
                      <Button 
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300"
                      >
                        {getText(data.secondaryButton)}
                      </Button>
                    </Link>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )

    case 'features':
      const getIcon = (iconName: string) => {
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
          palette: Palette
        }
        const IconComponent = icons[iconName as keyof typeof icons] || Award
        return <IconComponent className="w-12 h-12" />
      }

      // Use Tailwind classes only for specific string values, otherwise use inline style
      const featuresBgClass = data.backgroundColor === 'white' 
        ? 'bg-white dark:bg-gray-900' 
        : data.backgroundColor === 'gray-50' 
        ? 'bg-gray-50 dark:bg-gray-800' 
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
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title)}
                      field="title"
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title)
                  )}
                </h2>
              )}
              {data.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {isEditing ? (
                    <EditableText
                      value={getText(data.subtitle)}
                      field="subtitle"
                      className="text-xl text-gray-600 dark:text-gray-300"
                      as="span"
                    />
                  ) : (
                    getText(data.subtitle)
                  )}
                </p>
              )}
            </div>
            
            {data.features && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {data.features.map((feature: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                        {getIcon(feature.icon)}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {isEditing ? (
                        <EditableText
                          value={getText(feature.title)}
                          field={`feature-${index}-title` as any}
                          className="text-xl font-semibold"
                          as="span"
                          onUpdate={(val) => updateNestedField('features', index, 'title', val)}
                        />
                      ) : (
                        getText(feature.title)
                      )}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {isEditing ? (
                        <EditableText
                          value={getText(feature.description)}
                          field={`feature-${index}-description` as any}
                          className="text-gray-600 dark:text-gray-300 leading-relaxed"
                          as="span"
                          multiline
                          onUpdate={(val) => updateNestedField('features', index, 'description', val)}
                        />
                      ) : (
                        getText(feature.description)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )

    case 'text':
      return (
        <div 
          className="py-8 px-8"
          style={containerStyle}
        >
          <div className={`max-w-4xl mx-auto prose prose-lg ${
            data.alignment === 'center' ? 'text-center' : 
            data.alignment === 'right' ? 'text-right' : 'text-left'
          }`}>
            {isEditing ? (
              <EditableText
                value={getText(data.content)}
                field="content"
                className="prose prose-lg w-full"
                as="span"
                multiline
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

    case 'image':
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
                    {isEditing ? (
                      <EditableText
                        value={getText(data.caption)}
                        field="caption"
                        className="text-sm text-gray-600 italic"
                        as="span"
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

    case 'gallery':
      const [featuredProjects, setFeaturedProjects] = useState([])
      
      useEffect(() => {
        if (data.showFeatured) {
          fetch('/api/projects?featured=true')
            .then(res => res.json())
            .then(data => setFeaturedProjects(data.projects || []))
            .catch(err => console.error('Error fetching featured projects:', err))
        }
      }, [data.showFeatured])

      // Use Tailwind classes only for specific string values, otherwise use inline style
      const galleryBgClass = data.backgroundColor === 'gray-50' 
        ? 'bg-gray-50 dark:bg-gray-800' 
        : data.backgroundColor === 'white' 
        ? 'bg-white dark:bg-gray-900' 
        : ''
      
      // Build style object - only include properties that are explicitly set
      const galleryStyle: React.CSSProperties = {}
      if (data.backgroundColor && data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50') {
        galleryStyle.backgroundColor = data.backgroundColor
      }
      if (data.textColor) {
        galleryStyle.color = data.textColor
      }
      if (data.padding) {
        galleryStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }

      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 ${galleryBgClass}`}
          style={Object.keys(galleryStyle).length > 0 ? galleryStyle : undefined}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {data.title && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title)}
                      field="title"
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title)
                  )}
                </h2>
              )}
              {data.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {isEditing ? (
                    <EditableText
                      value={getText(data.subtitle)}
                      field="subtitle"
                      className="text-xl text-gray-600 dark:text-gray-300"
                      as="span"
                    />
                  ) : (
                    getText(data.subtitle)
                  )}
                </p>
              )}
            </div>
            
            {data.showFeatured && featuredProjects.length > 0 ? (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${
                  data.columns === 4 ? 'lg:grid-cols-4' : 
                  data.columns === 3 ? 'lg:grid-cols-3' : 
                  data.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                } gap-8`}>
                  {featuredProjects.slice(0, data.maxItems || 8).map((project: any) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => onProjectClick?.(project)}
                      languageId={currentLanguage}
                    />
                  ))}
                </div>
                
                {featuredProjects.length > (data.maxItems || 8) && (
                  <div className="text-center mt-12">
                    <Link href="/projects">
                      <Button variant="outline" size="lg">
                        View All Projects
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : data.images && data.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.images.map((image: any, index: number) => (
                  <div key={image.id || index} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No projects to display</p>
              </div>
            )}
          </div>
        </div>
      )

    case 'gallery-showcase':
      const [currentImageIndex, setCurrentImageIndex] = useState(0)
      const showcaseImages = data.showcaseImages || []
      const autoScrollSpeed = data.autoScrollSpeed || 4000 // default 4 seconds
      const transitionDuration = data.transitionDuration || 1000 // default 1 second

      // Auto-scroll through images
      useEffect(() => {
        if (showcaseImages.length <= 1) return

        const interval = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length)
        }, autoScrollSpeed)

        return () => clearInterval(interval)
      }, [showcaseImages.length, autoScrollSpeed])

      // Build style object
      const showcaseStyle: React.CSSProperties = {}
      if (data.backgroundColor) {
        showcaseStyle.backgroundColor = data.backgroundColor
      }
      if (data.padding) {
        showcaseStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }

      if (showcaseImages.length === 0) {
        return (
          <div 
            className="w-full h-[50vh] bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            style={Object.keys(showcaseStyle).length > 0 ? showcaseStyle : undefined}
          >
            <p className="text-gray-500 dark:text-gray-400">No images selected for showcase</p>
          </div>
        )
      }

      return (
        <div 
          className="w-full h-[50vh] relative overflow-hidden"
          style={Object.keys(showcaseStyle).length > 0 ? showcaseStyle : undefined}
        >
          {showcaseImages.map((image: any, index: number) => (
            <motion.div
              key={image.id || index}
              className="absolute inset-0"
              initial={{ opacity: 0, x: '100%' }}
              animate={{
                opacity: currentImageIndex === index ? 1 : 0,
                x: currentImageIndex === index ? '0%' : currentImageIndex > index ? '-100%' : '100%',
              }}
              transition={{
                duration: transitionDuration / 1000,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src={image.url}
                alt={image.alt || ''}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white text-lg font-medium">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
          
          {/* Progress indicators */}
          {showcaseImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {showcaseImages.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentImageIndex === index
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )

    case 'testimonials':
      // Use Tailwind classes only for specific string values, otherwise use inline style
      const testimonialsBgClass = data.backgroundColor === 'white' 
        ? 'bg-white dark:bg-gray-900' 
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
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title)}
                      field="title"
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
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
                  <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gray-700 dark:text-gray-300 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      {isEditing ? (
                        <EditableText
                          value={getText(testimonial.content)}
                          field={`testimonial-${index}-content` as any}
                          className="text-gray-700 dark:text-gray-300 italic"
                          as="span"
                          multiline
                          onUpdate={(val) => updateNestedField('testimonials', index, 'content', val)}
                        />
                      ) : (
                        `"${getText(testimonial.content)}"`
                      )}
                    </blockquote>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {isEditing ? (
                          <EditableText
                            value={getText(testimonial.role)}
                            field={`testimonial-${index}-role` as any}
                            className="text-gray-600 dark:text-gray-400 text-sm"
                            as="span"
                            onUpdate={(val) => updateNestedField('testimonials', index, 'role', val)}
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

    case 'cta':
      // Use Tailwind classes for dark mode compatibility
      // Check if backgroundColor is actually set (not empty string, null, or undefined)
      const hasCustomBg = data.backgroundColor && 
                         data.backgroundColor.trim() !== '' && 
                         data.backgroundColor !== 'slate-900' &&
                         data.backgroundType === 'solid'
      
      // Determine background class - always ensure dark mode support
      // For default gradient, we need to ensure dark mode properly overrides
      const ctaBgClass = data.backgroundColor === 'slate-900' 
        ? 'bg-slate-900 dark:bg-gray-950' 
        : hasCustomBg
        ? 'dark:bg-gray-950' // Only dark mode class, light mode uses inline style
        : '' // Will use wrapper approach for default gradient
      
      // Build style object - only include properties that are explicitly set
      const ctaStyle: React.CSSProperties = {}
      if (data.textColor) {
        ctaStyle.color = data.textColor
      } else if (data.backgroundColor === 'slate-900') {
        // Default white text for dark background
        ctaStyle.color = '#ffffff'
      }
      if (data.padding) {
        ctaStyle.padding = `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px`
      }
      
      // For default gradient (no backgroundColor), use wrapper to ensure dark mode works
      const isDefaultGradient = !data.backgroundColor || 
                                data.backgroundColor.trim() === '' || 
                                (data.backgroundColor !== 'slate-900' && !hasCustomBg)
      
      if (isDefaultGradient) {
        return (
          <div 
            className="py-20 px-4 sm:px-6 lg:px-8 text-center relative"
            data-cta-gradient="true"
            style={{
              ...(Object.keys(ctaStyle).length > 0 ? ctaStyle : {}),
              // Use inline gradient for light mode, CSS will override in dark mode
              background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb)'
            } as React.CSSProperties}
          >
            <div className="max-w-4xl mx-auto">
              {(data.title || data.heading) && (
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${data.backgroundColor === 'slate-900' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title || data.heading)}
                      field={data.title ? "title" : "heading"}
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title || data.heading)
                  )}
                </h2>
              )}
              
              {data.description && (
                <p className={`text-xl mb-10 leading-relaxed ${data.backgroundColor === 'slate-900' ? 'text-gray-300 opacity-90' : 'text-gray-700 dark:text-gray-400 opacity-90'}`}>
                  {isEditing ? (
                    <EditableText
                      value={getText(data.description)}
                      field="description"
                      className="text-xl leading-relaxed"
                      as="span"
                      multiline
                    />
                  ) : (
                    getText(data.description)
                  )}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(data.primaryButton || data.ctaButtonText) && (
                  isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.primaryButton || data.ctaButtonText)}
                        field={data.primaryButton ? "primaryButton" : "ctaButtonText"}
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.ctaButtonLink || "/contact"}>
                      <Button 
                        size="lg"
                        className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-transparent ${
                          data.backgroundColor === 'slate-900' 
                            ? 'bg-white text-slate-900 hover:bg-gray-100' 
                            : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                        }`}
                      >
                        {getText(data.primaryButton || data.ctaButtonText)}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  )
                )}
                
                {data.secondaryButton && (
                  isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.secondaryButton)}
                        field="secondaryButton"
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.secondaryButtonLink || "/projects"}>
                      <Button 
                        variant="outline"
                        size="lg"
                        className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 ${
                          data.backgroundColor === 'slate-900'
                            ? 'border-white text-white bg-white/5 hover:bg-white hover:text-slate-900'
                            : 'border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-gray-900'
                        }`}
                      >
                        {getText(data.secondaryButton)}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )
      }
      
      // Use wrapper div approach for custom solid colors to ensure dark mode works
      // Use CSS variable so dark mode can override via Tailwind class
      if (hasCustomBg) {
        return (
          <div 
            className={`py-20 px-4 sm:px-6 lg:px-8 text-center dark:bg-gray-950 relative`} 
            style={{ 
              ['--cta-bg' as any]: data.backgroundColor,
              backgroundColor: 'var(--cta-bg)'
            } as React.CSSProperties}
          >
            <div className="max-w-4xl mx-auto">
              {(data.title || data.heading) && (
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${data.backgroundColor === 'slate-900' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {isEditing ? (
                    <EditableText
                      value={getText(data.title || data.heading)}
                      field={data.title ? "title" : "heading"}
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                      as="span"
                    />
                  ) : (
                    getText(data.title || data.heading)
                  )}
                </h2>
              )}
              
              {data.description && (
                <p className={`text-xl mb-10 leading-relaxed ${data.backgroundColor === 'slate-900' ? 'text-gray-300 opacity-90' : 'text-gray-700 dark:text-gray-400 opacity-90'}`}>
                  {isEditing ? (
                    <EditableText
                      value={getText(data.description)}
                      field="description"
                      className="text-xl leading-relaxed"
                      as="span"
                      multiline
                    />
                  ) : (
                    getText(data.description)
                  )}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(data.primaryButton || data.ctaButtonText) && (
                  isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.primaryButton || data.ctaButtonText)}
                        field={data.primaryButton ? "primaryButton" : "ctaButtonText"}
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.ctaButtonLink || "/contact"}>
                      <Button 
                        size="lg"
                        className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-transparent ${
                          data.backgroundColor === 'slate-900' 
                            ? 'bg-white text-slate-900 hover:bg-gray-100' 
                            : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                        }`}
                      >
                        {getText(data.primaryButton || data.ctaButtonText)}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  )
                )}
                
                {data.secondaryButton && (
                  isEditing ? (
                    <div className="inline-block">
                      <EditableText
                        value={getText(data.secondaryButton)}
                        field="secondaryButton"
                        className="text-lg px-8 py-4"
                        as="span"
                      />
                    </div>
                  ) : (
                    <Link href={data.secondaryButtonLink || "/projects"}>
                      <Button 
                        variant="outline"
                        size="lg"
                        className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 ${
                          data.backgroundColor === 'slate-900'
                            ? 'border-white text-white bg-white/5 hover:bg-white hover:text-slate-900'
                            : 'border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-gray-900'
                        }`}
                      >
                        {getText(data.secondaryButton)}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )
      }
      
      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 text-center relative ${ctaBgClass}`}
          style={Object.keys(ctaStyle).length > 0 ? ctaStyle : undefined}
        >
          <div className="max-w-4xl mx-auto">
            {(data.title || data.heading) && (
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${data.backgroundColor === 'slate-900' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {isEditing ? (
                  <EditableText
                    value={getText(data.title || data.heading)}
                    field={data.title ? "title" : "heading"}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    as="span"
                  />
                ) : (
                  getText(data.title || data.heading)
                )}
              </h2>
            )}
            
            {data.description && (
              <p className={`text-xl mb-10 leading-relaxed ${data.backgroundColor === 'slate-900' ? 'text-gray-300 opacity-90' : 'text-gray-700 dark:text-gray-400 opacity-90'}`}>
                {isEditing ? (
                  <EditableText
                    value={getText(data.description)}
                    field="description"
                    className="text-xl leading-relaxed"
                    as="span"
                    multiline
                  />
                ) : (
                  getText(data.description)
                )}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(data.primaryButton || data.ctaButtonText) && (
                isEditing ? (
                  <div className="inline-block">
                    <EditableText
                      value={getText(data.primaryButton || data.ctaButtonText)}
                      field={data.primaryButton ? "primaryButton" : "ctaButtonText"}
                      className="text-lg px-8 py-4"
                      as="span"
                    />
                  </div>
                ) : (
                  <Link href={data.ctaButtonLink || "/contact"}>
                    <Button 
                      size="lg"
                      className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-transparent ${
                        data.backgroundColor === 'slate-900' 
                          ? 'bg-white text-slate-900 hover:bg-gray-100' 
                          : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100'
                      }`}
                    >
                      {getText(data.primaryButton || data.ctaButtonText)}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )
              )}
              
              {data.secondaryButton && (
                isEditing ? (
                  <div className="inline-block">
                    <EditableText
                      value={getText(data.secondaryButton)}
                      field="secondaryButton"
                      className="text-lg px-8 py-4"
                      as="span"
                    />
                  </div>
                ) : (
                  <Link href={data.secondaryButtonLink || "/projects"}>
                    <Button 
                      variant="outline"
                      size="lg"
                      className={`w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 ${
                        data.backgroundColor === 'slate-900'
                          ? 'border-white text-white bg-white/5 hover:bg-white hover:text-slate-900'
                          : 'border-gray-900 text-gray-900 bg-gray-50/30 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-gray-900'
                      }`}
                    >
                      {getText(data.secondaryButton)}
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )

    case 'spacer':
      return (
        <div 
          style={{
            height: `${data.height || 60}px`,
            backgroundColor: data.backgroundColor || 'transparent'
          }}
        />
      )

    default:
      return (
        <div className="py-8 px-8 text-center text-gray-500">
          Unknown component type: {type}
        </div>
      )
  }
}