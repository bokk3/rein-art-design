'use client'

import { ProjectWithRelations } from '@/types/project'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectModalProps {
  project: ProjectWithRelations | null
  isOpen: boolean
  onClose: () => void
  languageId?: string
  allProjects?: ProjectWithRelations[]
  onProjectChange?: (project: ProjectWithRelations) => void
}

export function ProjectModal({ project, isOpen, onClose, languageId = 'nl', allProjects = [], onProjectChange }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [project])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !project) return

    const images = project.images
    const currentProjectIndex = allProjects.findIndex(p => p.id === project.id)
    const hasPreviousProject = currentProjectIndex > 0
    const hasNextProject = currentProjectIndex < allProjects.length - 1 && currentProjectIndex >= 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        // If at first image and has previous project, go to previous project
        if (currentImageIndex === 0 && hasPreviousProject && onProjectChange) {
          onProjectChange(allProjects[currentProjectIndex - 1])
        } else if (currentImageIndex > 0) {
          setCurrentImageIndex((prev) => prev - 1)
        }
      } else if (e.key === 'ArrowRight') {
        // If at last image and has next project, go to next project
        if (currentImageIndex === images.length - 1 && hasNextProject && onProjectChange) {
          onProjectChange(allProjects[currentProjectIndex + 1])
        } else if (currentImageIndex < images.length - 1) {
          setCurrentImageIndex((prev) => prev + 1)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, project, currentImageIndex, allProjects, onProjectChange])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Get translation for the specified language or fallback to first available
  // Use useMemo to make it reactive to languageId changes
  // Must be called before any early returns to follow Rules of Hooks
  const translation = useMemo(() => {
    if (!project) return null
    return project.translations.find(t => t.language.code === languageId) 
      || project.translations[0]
  }, [project, project?.translations, languageId])

  if (!isOpen || !project || !translation) return null

  const images = project.images
  const currentImage = images[currentImageIndex]

  // Find current project index
  const currentProjectIndex = allProjects.findIndex(p => p.id === project.id)
  const hasPreviousProject = currentProjectIndex > 0
  const hasNextProject = currentProjectIndex < allProjects.length - 1 && currentProjectIndex >= 0

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const nextProject = () => {
    if (hasNextProject && onProjectChange) {
      onProjectChange(allProjects[currentProjectIndex + 1])
    }
  }

  const previousProject = () => {
    if (hasPreviousProject && onProjectChange) {
      onProjectChange(allProjects[currentProjectIndex - 1])
    }
  }

  // Parse TipTap JSON content to plain text for display
  const getDescriptionText = (description: any): string => {
    if (typeof description === 'string') return description
    if (!description || !description.content) return ''
    
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || ''
      if (node.content) {
        return node.content.map(extractText).join('')
      }
      return ''
    }
    
    return description.content.map(extractText).join('\n')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Beautiful backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Project Navigation - Previous */}
      {hasPreviousProject && onProjectChange && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 glass hover:bg-white/95 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-white/20"
          onClick={(e) => {
            e.stopPropagation()
            previousProject()
          }}
          aria-label="Previous project"
        >
          <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
        </Button>
      )}

      {/* Project Navigation - Next */}
      {hasNextProject && onProjectChange && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 glass hover:bg-white/95 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-white/20"
          onClick={(e) => {
            e.stopPropagation()
            nextProject()
          }}
          aria-label="Next project"
        >
          <ChevronRight className="h-6 w-6 text-gray-900 dark:text-white" />
        </Button>
      )}

      {/* Modal Content - Beautiful glassmorphism */}
      <div className="relative glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl max-w-5xl max-h-[95vh] w-full overflow-hidden animate-fade-in">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 glass hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border border-white/20 dark:border-gray-700/30"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-900 dark:text-white" />
        </Button>

        <div className="flex flex-col lg:flex-row bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95">
          {/* Image Section */}
          <div className="lg:w-2/3 relative">
            {currentImage && (
              <div className="relative aspect-square lg:aspect-4/3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <Image
                  src={currentImage.originalUrl}
                  alt={currentImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100"
                      onClick={previousImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`relative shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-black' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image.thumbnailUrl}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/3 p-8 overflow-y-auto max-h-[50vh] lg:max-h-[95vh] bg-gradient-to-b from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Featured Badge */}
              {project.featured && (
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-amber-500/30 border border-amber-400/30">
                  <span>⭐</span>
                  <span>Featured Project</span>
                </div>
              )}
              
              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {translation.title}
              </h2>
              
              {/* Materials */}
              {translation.materials.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {translation.materials.map((material, index) => (
                      <span 
                        key={index}
                        className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full text-sm font-medium border border-gray-200/50 dark:border-gray-600/50 shadow-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              {translation.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Description</h3>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {getDescriptionText(translation.description)}
                  </div>
                </div>
              )}
              
              {/* Project Info */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center justify-between">
                    <span className="font-medium">Content Type:</span>
                    <span className="text-gray-900 dark:text-gray-100">{project.contentType.displayName}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-medium">Created:</span>
                    <span className="text-gray-900 dark:text-gray-100">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}