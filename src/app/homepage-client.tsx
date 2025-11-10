'use client'

import { ProjectWithRelations } from '@/types/project'
import { ProjectCard } from '@/components/gallery/project-card'
import { ProjectModal } from '@/components/gallery/project-modal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { PageComponent } from '@/types/page-builder'
import { ComponentRenderer } from '@/components/page-builder/component-renderer'
import { useTheme } from '@/contexts/theme-context'

interface HomepageClientProps {
  featuredProjects: ProjectWithRelations[]
  pageBuilderComponents?: PageComponent[] | null
  currentLanguage: string
}

export function HomepageClient({ 
  featuredProjects, 
  pageBuilderComponents, 
  currentLanguage: initialLanguage 
}: HomepageClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [allFeaturedProjects, setAllFeaturedProjects] = useState<ProjectWithRelations[]>(featuredProjects)
  const [scrollSnapEnabled, setScrollSnapEnabled] = useState(true)
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0)
  const componentRefs = useRef<(HTMLDivElement | null)[]>([])
  const { currentLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  // Fetch all featured projects for modal navigation
  useEffect(() => {
    fetch('/api/projects?featured=true')
      .then(res => res.json())
      .then(data => setAllFeaturedProjects(data.projects || featuredProjects))
      .catch(() => setAllFeaturedProjects(featuredProjects))
  }, [featuredProjects])

  // Fetch scroll snap setting
  useEffect(() => {
    fetch('/api/admin/theme-settings')
      .then(res => res.json())
      .then(data => {
        setScrollSnapEnabled(data.scrollSnapEnabled !== false) // Default to true
      })
      .catch(() => setScrollSnapEnabled(true))
  }, [])

  const handleProjectClick = (project: ProjectWithRelations) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const handleProjectChange = (project: ProjectWithRelations) => {
    setSelectedProject(project)
  }

  // Initialize component refs array
  useEffect(() => {
    if (pageBuilderComponents && pageBuilderComponents.length > 0) {
      componentRefs.current = new Array(pageBuilderComponents.length).fill(null)
    }
  }, [pageBuilderComponents])

  // Enable scroll snapping on homepage based on settings
  useEffect(() => {
    if (pageBuilderComponents && pageBuilderComponents.length > 0 && scrollSnapEnabled) {
      // Add snap-container class to html element
      document.documentElement.classList.add('snap-container')
      
      return () => {
        // Remove on unmount
        document.documentElement.classList.remove('snap-container')
      }
    } else {
      // Remove if disabled or no components
      document.documentElement.classList.remove('snap-container')
    }
  }, [pageBuilderComponents, scrollSnapEnabled])

  // Gentle scroll snapping - helps CSS scroll snap work better
  useEffect(() => {
    if (!pageBuilderComponents || pageBuilderComponents.length === 0 || !scrollSnapEnabled) {
      return
    }

    let scrollTimeout: NodeJS.Timeout | null = null
    const SNAP_THRESHOLD = 400 // Larger area to look for snap points (was 150px)
    const MIN_OFFSET = 30 // Minimum offset to trigger snap

    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      // Wait for scroll to settle - shorter delay for fast scrolling, longer for slow
      scrollTimeout = setTimeout(() => {
        const componentElements = componentRefs.current.filter(Boolean) as HTMLDivElement[]
        if (componentElements.length === 0) {
          return
        }

        const currentScroll = window.scrollY
        const viewportCenter = window.innerHeight / 2
        const viewportBottom = currentScroll + window.innerHeight
        
        // Get the last component's bottom position
        const lastComponent = componentElements[componentElements.length - 1]
        const lastComponentRect = lastComponent.getBoundingClientRect()
        const lastComponentBottom = lastComponentRect.bottom + window.scrollY
        
        // Don't snap if we're already past the last component (e.g., at footer)
        // Allow some buffer (100px) so we can scroll to footer without snapping back
        if (viewportBottom > lastComponentBottom + 100) {
          return // User is scrolling to footer, don't interfere
        }
        
        // Find which component's center is closest to viewport center
        let nearestIndex = 0
        let minDistance = Infinity
        
        for (let i = 0; i < componentElements.length; i++) {
          const element = componentElements[i]
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementCenter = elementTop + rect.height / 2
          const viewportCenterAbsolute = currentScroll + viewportCenter
          const distance = Math.abs(viewportCenterAbsolute - elementCenter)
          
          if (distance < minDistance) {
            minDistance = distance
            nearestIndex = i
          }
        }

        // Always snap to the nearest component if we're within threshold
        const nearestElement = componentElements[nearestIndex]
        if (nearestElement) {
          const rect = nearestElement.getBoundingClientRect()
          const snapPosition = rect.top + window.scrollY - 72 // Account for nav
          const offset = Math.abs(currentScroll - snapPosition)
          
          // Snap if we're meaningfully off the snap position
          // Use larger threshold so we catch more cases
          if (offset > MIN_OFFSET) {
            window.scrollTo({
              top: snapPosition,
              behavior: 'smooth'
            })
          }
        }
      }, 250) // Balanced delay for both fast and slow scrolling
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [pageBuilderComponents, scrollSnapEnabled])

  // Track which component is currently in view for scroll button
  useEffect(() => {
    if (!pageBuilderComponents || pageBuilderComponents.length === 0 || !scrollSnapEnabled) {
      return
    }

    const handleScroll = () => {
      const scrollY = window.scrollY + 100 // Offset for nav
      const componentElements = componentRefs.current.filter(Boolean) as HTMLDivElement[]
      
      for (let i = 0; i < componentElements.length; i++) {
        const element = componentElements[i]
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        
        // Check if this component is in the viewport (with some tolerance)
        if (scrollY >= elementTop - 100 && scrollY < elementTop + rect.height / 2) {
          setCurrentComponentIndex(i)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pageBuilderComponents, scrollSnapEnabled])

  // Scroll to next component
  const scrollToNext = () => {
    if (!pageBuilderComponents || pageBuilderComponents.length === 0) return
    
    const nextIndex = currentComponentIndex + 1
    if (nextIndex < componentRefs.current.length) {
      const nextElement = componentRefs.current[nextIndex]
      if (nextElement) {
        const rect = nextElement.getBoundingClientRect()
        const scrollTop = window.scrollY + rect.top - 72 // Account for nav height
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        })
      }
    }
  }

  // If page builder components exist, use them; otherwise show default homepage
  if (pageBuilderComponents && pageBuilderComponents.length > 0) {
    return (
      <>
        <div className="min-h-screen bg-white dark:bg-[#181818] relative overflow-x-hidden">
          {pageBuilderComponents
            .sort((a, b) => a.order - b.order)
            .map((component, index) => (
              <div 
                key={component.id} 
                ref={(el) => { componentRefs.current[index] = el }}
                className={scrollSnapEnabled ? 'snap-item' : ''}
              >
                <ComponentRenderer
                  component={component}
                  isPreview={true}
                  currentLanguage={currentLanguage}
                  onProjectClick={handleProjectClick}
                />
              </div>
            ))}
        </div>

        {/* Scroll to Next Component Button */}
        {scrollSnapEnabled && 
         pageBuilderComponents && 
         pageBuilderComponents.length > 1 && 
         currentComponentIndex < pageBuilderComponents.length - 1 && (
          <button
            onClick={scrollToNext}
            className="fixed bottom-6 right-6 z-50 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700 group"
            aria-label="Scroll to next section"
          >
            <ChevronDown className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          </button>
        )}

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          languageId={currentLanguage}
          allProjects={allFeaturedProjects}
          onProjectChange={handleProjectChange}
        />
      </>
    )
  }

  // Default homepage content
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#181818]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:bg-[#181818]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6">
                Custom Artisan Work
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Discover unique handcrafted pieces made with quality materials and attention to detail. 
                Each project is a testament to traditional craftsmanship and modern design.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/projects">
                  <Button size="lg" className="w-full sm:w-auto">
                    View All Projects
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Commission Work
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <section className="bg-gray-50 dark:bg-[#1a1a1a] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
                  Featured Work
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  A selection of our most notable projects showcasing the range and quality of our craftsmanship.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {featuredProjects.slice(0, 8).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project)}
                    languageId={currentLanguage}
                  />
                ))}
              </div>

              {featuredProjects.length > 8 && (
                <div className="text-center">
                  <Link href="/projects">
                    <Button variant="outline" size="lg">
                      View All {featuredProjects.length} Featured Projects
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* About Section */}
        <section className="bg-white dark:bg-[#181818] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6">
                  Craftsmanship Meets Design
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Every piece we create is a unique blend of traditional techniques and contemporary aesthetics. 
                  We work closely with our clients to bring their vision to life, using only the finest materials 
                  and time-honored methods.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  From concept to completion, we ensure each project reflects the highest standards of quality 
                  and attention to detail that our clients have come to expect.
                </p>
                <Link href="/about">
                  <Button variant="outline">
                    Learn More About Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 aspect-square rounded-lg"></div>
                  <div className="bg-gray-100 dark:bg-gray-700 aspect-4/3 rounded-lg"></div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-gray-100 dark:bg-gray-700 aspect-4/3 rounded-lg"></div>
                  <div className="bg-gray-100 dark:bg-gray-700 aspect-square rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:bg-gray-950 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-400 mb-8">
              Get in touch to discuss your ideas and learn how we can bring your vision to life.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                Start a Conversation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        languageId={currentLanguage}
      />
    </>
  )
}