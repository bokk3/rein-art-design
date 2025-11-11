'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ComponentData } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ProjectCard } from '@/components/gallery/project-card'
import { getText } from '../utils/text-helpers'
import { EditableText } from '../utils/editable-text'

interface GalleryComponentProps {
  data: ComponentData
  getText: (text: string | { [key: string]: string } | undefined) => string
  currentLanguage: string
  isEditing?: boolean
  onProjectClick?: (project: any) => void
  onUpdate?: (field: keyof ComponentData, value: string) => void
}

export function GalleryComponent({ 
  data, 
  getText, 
  currentLanguage, 
  isEditing = false, 
  onProjectClick,
  onUpdate 
}: GalleryComponentProps) {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [projectsPerView, setProjectsPerView] = useState(3) // Responsive: 1 on mobile, 3 on desktop/tablet
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const useCarousel = data.useCarousel !== false && (data.useCarousel === true || featuredProjects.length > 3)
  const projectsToShow = data.maxItems ? Math.min(featuredProjects.length, data.maxItems) : featuredProjects.length
  const maxScrollIndex = Math.max(0, projectsToShow - projectsPerView) // Stop when last project is visible
  
  // Calculate min-height for full page (accounting for navigation)
  const minHeightStyle = useCarousel 
    ? { minHeight: 'calc(100vh - 80px)' }
    : {}
  
  // Responsive projects per view: 1 on mobile, 3 on tablet/desktop
  useEffect(() => {
    const updateProjectsPerView = () => {
      if (window.innerWidth < 768) {
        setProjectsPerView(1) // Mobile: 1 item
      } else {
        setProjectsPerView(3) // Tablet/Desktop: 3 items
      }
    }
    
    updateProjectsPerView()
    window.addEventListener('resize', updateProjectsPerView)
    return () => window.removeEventListener('resize', updateProjectsPerView)
  }, [])

  useEffect(() => {
    if (data.showFeatured) {
      fetch('/api/projects?featured=true')
        .then(res => res.json())
        .then(data => setFeaturedProjects(data.projects || []))
        .catch(err => console.error('Error fetching featured projects:', err))
    }
  }, [data.showFeatured])

  // Mouse wheel scroll handler - only works when hovering over the carousel
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel || !useCarousel || isEditing) return

    let scrollTimeout: NodeJS.Timeout | null = null
    let lastScrollTime = 0
    const scrollThrottle = 100 // ms between scrolls

    const handleWheel = (e: WheelEvent) => {
      if (!isHovered) return
      
      const now = Date.now()
      if (now - lastScrollTime < scrollThrottle) {
        e.preventDefault()
        return
      }
      
      e.preventDefault()
      e.stopPropagation()
      lastScrollTime = now
      
      // Determine scroll direction and amount
      const scrollAmount = Math.abs(e.deltaY) > 50 ? 1 : 0 // Only scroll if significant movement
      if (scrollAmount === 0) return
      
      const delta = e.deltaY > 0 ? 1 : -1
      setCurrentScrollIndex((prev) => {
        const next = prev + delta
        return Math.max(0, Math.min(maxScrollIndex, next))
      })
    }

    carousel.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      carousel.removeEventListener('wheel', handleWheel)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [isHovered, useCarousel, isEditing, maxScrollIndex])

  const handleScrollLeft = () => {
    setCurrentScrollIndex((prev) => Math.max(0, prev - 1))
  }

  const handleScrollRight = () => {
    setCurrentScrollIndex((prev) => Math.min(maxScrollIndex, prev + 1))
  }

  // Touch/swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left - go to next
        handleScrollRight()
      } else {
        // Swiped right - go to previous
        handleScrollLeft()
      }
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  // Use Tailwind classes only for specific string values, otherwise use inline style
  const galleryBgClass = data.backgroundColor === 'gray-50' 
    ? 'bg-gray-50 dark:bg-gray-800' 
    : data.backgroundColor === 'white' 
    ? 'bg-white dark:bg-[#181818]' 
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
    <section 
      className={`flex flex-col ${galleryBgClass}`}
      style={{
        ...(Object.keys(galleryStyle).length > 0 ? galleryStyle : {}),
        ...minHeightStyle,
        paddingTop: data.padding?.top ? `${data.padding.top}px` : '4rem',
        paddingBottom: data.padding?.bottom ? `${data.padding.bottom}px` : '4rem',
        paddingLeft: data.padding?.left ? `${data.padding.left}px` : '1rem',
        paddingRight: data.padding?.right ? `${data.padding.right}px` : '1rem',
      }}
    >
      <div className="max-w-[95%] mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-12">
          {data.title && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
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
        
        {data.showFeatured && featuredProjects.length > 0 ? (
          <>
            {useCarousel ? (
              <div className="flex-1 flex flex-col justify-center" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                <div className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-8 px-2 sm:px-4 md:px-8">
                  {/* Left Arrow */}
                  <button
                    onClick={handleScrollLeft}
                    className="flex-shrink-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                    aria-label="Scroll left"
                    disabled={currentScrollIndex === 0}
                  >
                    <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10" />
                  </button>

                  {/* Scrollable Container */}
                  <div 
                    ref={carouselRef}
                    className="flex-1 w-full relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div 
                      className="relative overflow-hidden"
                      style={{
                        width: '100%',
                        paddingTop: '2rem',
                        paddingBottom: '2rem',
                      }}
                    >
                      <div 
                        ref={scrollContainerRef}
                        className="overflow-y-visible scrollbar-hide"
                        style={{
                          paddingLeft: '2rem',
                          paddingRight: '2rem',
                          marginTop: '-2rem',
                          marginBottom: '-2rem',
                          paddingTop: '2rem',
                          paddingBottom: '2rem',
                        }}
                      >
                        <div
                          className="flex transition-transform duration-300 ease-out items-stretch"
                          style={{
                            gap: '1.5rem',
                            transform: `translateX(calc(-${currentScrollIndex} * (100% / ${projectsPerView} + 1.5rem / ${projectsPerView})))`,
                          }}
                        >
                          {featuredProjects.slice(0, projectsToShow).map((project: any, index: number) => (
                            <div
                              key={project.id}
                              className="flex-shrink-0 flex items-stretch"
                              style={{
                                width: `calc((100% - ${(projectsPerView - 1) * 1.5}rem) / ${projectsPerView})`,
                                paddingLeft: '0.5rem',
                                paddingRight: '0.5rem',
                              }}
                            >
                              <div className="w-full h-full">
                                <ProjectCard
                                  project={project}
                                  onClick={() => onProjectClick?.(project)}
                                  languageId={currentLanguage}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={handleScrollRight}
                    className="flex-shrink-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 z-10"
                    aria-label="Scroll right"
                    disabled={currentScrollIndex >= maxScrollIndex}
                  >
                    <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10" />
                  </button>
                </div>

                {/* Scroll Indicators */}
                {maxScrollIndex > 0 && (
                  <div className="flex justify-center gap-2 mt-12 mb-4">
                    {Array.from({ length: maxScrollIndex + 1 }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentScrollIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          currentScrollIndex === index
                            ? 'w-8 bg-gray-900 dark:bg-white'
                            : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        aria-label={`Go to position ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              data.layout === 'masonry' ? (
                <div 
                  className={`columns-1 ${data.columns === 2 ? 'sm:columns-2' : data.columns === 4 ? 'sm:columns-2 lg:columns-4' : 'sm:columns-2 lg:columns-3'}`}
                  style={{
                    columnGap: '1.5rem',
                  }}
                >
                  {featuredProjects.slice(0, data.maxItems || 8).map((project: any) => (
                    <div key={project.id} className="break-inside-avoid mb-6">
                      <ProjectCard
                        project={project}
                        onClick={() => onProjectClick?.(project)}
                        languageId={currentLanguage}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${
                  data.columns === 4 ? 'lg:grid-cols-4' : 
                  data.columns === 3 ? 'lg:grid-cols-3' : 
                  data.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                } gap-8 items-stretch`}>
                  {featuredProjects.slice(0, data.maxItems || 8).map((project: any) => (
                    <div key={project.id} className="h-full">
                      <ProjectCard
                        project={project}
                        onClick={() => onProjectClick?.(project)}
                        languageId={currentLanguage}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
            
            {/* Always show button to view all projects */}
            <div className="text-center mt-12 mb-4">
              <Link href="/projects">
                <Button variant="outline" size="lg">
                  View All Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : data.images && data.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(data.images || []).map((image: any, index: number) => (
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
    </section>
  )
}

