'use client'

import { ProjectWithRelations } from '@/types/project'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useImageSettings } from '@/contexts/image-settings-context'
import { useT } from '@/hooks/use-t'

interface ProjectDetailClientProps {
  project: ProjectWithRelations
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { currentLanguage, languages } = useLanguage()
  const { grayscaleImages } = useImageSettings()
  const { t } = useT()

  // Helper function to add language parameter to URLs
  const getLocalizedHref = (href: string) => {
    const defaultLang = languages.find(l => l.isDefault)
    if (currentLanguage === defaultLang?.code) {
      return href
    }
    const separator = href.includes('?') ? '&' : '?'
    return `${href}${separator}lang=${currentLanguage}`
  }

  // Get translation for the specified language or fallback to first available
  // Use useMemo to make it reactive to currentLanguage changes
  const translation = useMemo(() => {
    return project.translations.find(t => t.language.code === currentLanguage) 
      || project.translations[0]
  }, [project.translations, currentLanguage])

  if (!translation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Project Not Available</h1>
          <p className="text-gray-600 mb-6">This project is not available in the selected language.</p>
          <Link href={getLocalizedHref('/projects')}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('projects.backToProjects')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = project.images
  const currentImage = images[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
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

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": translation.title,
    "description": getDescriptionText(translation.description),
    "creator": {
      "@type": "Person",
      "name": project.creator.name
    },
    "dateCreated": project.createdAt,
    "material": translation.materials,
    "image": images.map(img => img.originalUrl),
    "url": `${process.env.NEXT_PUBLIC_BASE_URL || ''}/projects/${project.id}`
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href={getLocalizedHref('/projects')}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('projects.backToProjects')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              {currentImage && (
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={currentImage.originalUrl}
                    alt={currentImage.alt}
                    fill
                    className={`object-cover ${grayscaleImages ? 'grayscale' : ''}`}
                    style={grayscaleImages ? { filter: 'grayscale(100%)' } : undefined}
                    sizes="(max-width: 1024px) 100vw, 50vw"
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
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
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
                        className={`object-cover ${grayscaleImages ? 'grayscale' : ''}`}
                        style={grayscaleImages ? { filter: 'grayscale(100%)' } : undefined}
                        sizes="(max-width: 640px) 25vw, 16vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              {/* Featured Badge */}
              {project.featured && (
                <div className="inline-block bg-black text-white text-sm px-3 py-1 rounded">
                  Featured Project
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-black">
                {translation.title}
              </h1>
              
              {/* Materials */}
              {translation.materials.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Materials</h2>
                  <div className="flex flex-wrap gap-2">
                    {translation.materials.map((material, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm"
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {getDescriptionText(translation.description)}
                  </div>
                </div>
              )}
              
              {/* Project Info */}
              <div className="pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Content Type:</span> {project.contentType.displayName}</p>
                  <p><span className="font-medium">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Artist:</span> {project.creator.name}</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-6">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    Commission Similar Work
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}