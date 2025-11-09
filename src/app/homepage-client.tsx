'use client'

import { ProjectWithRelations } from '@/types/project'
import { ProjectCard } from '@/components/gallery/project-card'
import { ProjectModal } from '@/components/gallery/project-modal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
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
  const { currentLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  // Fetch all featured projects for modal navigation
  useEffect(() => {
    fetch('/api/projects?featured=true')
      .then(res => res.json())
      .then(data => setAllFeaturedProjects(data.projects || featuredProjects))
      .catch(() => setAllFeaturedProjects(featuredProjects))
  }, [featuredProjects])

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

  // If page builder components exist, use them; otherwise show default homepage
  if (pageBuilderComponents && pageBuilderComponents.length > 0) {
    return (
      <>
        <div className="min-h-screen bg-white dark:bg-[#181818] relative overflow-x-hidden">
          {pageBuilderComponents
            .sort((a, b) => a.order - b.order)
            .map((component) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                isPreview={true}
                currentLanguage={currentLanguage}
                onProjectClick={handleProjectClick}
              />
            ))}
        </div>

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