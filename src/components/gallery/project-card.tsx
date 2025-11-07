'use client'

import { ProjectWithRelations } from '@/types/project'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { useImageSettings } from '@/contexts/image-settings-context'

interface ProjectCardProps {
  project: ProjectWithRelations
  onClick: () => void
  languageId?: string
}

export function ProjectCard({ project, onClick, languageId = 'nl' }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { grayscaleImages } = useImageSettings()
  
  // Get translation for the specified language or fallback to first available
  // Use useMemo to make it reactive to languageId changes
  const translation = useMemo(() => {
    return project.translations.find(t => t.language.code === languageId) 
      || project.translations[0]
  }, [project.translations, languageId])
  
  // Get the first image as the card thumbnail
  const thumbnailImage = project.images[0]
  
  if (!translation) {
    return null
  }

  return (
    <div 
      className="group cursor-pointer bg-white dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-gray-900/40 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gray-300 dark:hover:border-gray-600 animate-fade-in"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        {thumbnailImage && !imageError ? (
          <>
            <Image
              src={thumbnailImage.thumbnailUrl}
              alt={thumbnailImage.alt}
              fill
              className={`object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${grayscaleImages ? 'grayscale group-hover:grayscale-0' : ''}`}
              style={grayscaleImages ? { filter: 'grayscale(100%)' } : undefined}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error('Image failed to load:', thumbnailImage.thumbnailUrl, e)
                setImageError(true)
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              unoptimized={false}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
            )}
          </>
        ) : (
          // Placeholder for projects without images
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">No Image</p>
            </div>
          </div>
        )}
        
        {/* Beautiful gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Featured badge - Beautiful design */}
        {project.featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/30 backdrop-blur-sm border border-amber-400/30">
            ⭐ Featured
          </div>
        )}
      </div>
      
      <div className="p-6 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800/90 dark:to-gray-900/50">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
          {translation.title}
        </h3>
        
        {/* Materials - Stacked vertically for consistent card height */}
        {translation.materials.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {translation.materials.slice(0, 3).map((material, index) => (
              <span 
                key={index}
                className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-600/50 shadow-sm w-fit"
              >
                {material}
              </span>
            ))}
            {translation.materials.length > 3 && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-1.5">
                +{translation.materials.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* View details indicator - Beautiful arrow animation */}
        <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-all duration-300">
          <span>View details</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
    </div>
  )
}