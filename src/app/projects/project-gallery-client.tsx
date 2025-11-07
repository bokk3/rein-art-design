'use client'

import { ProjectWithRelations } from '@/types/project'
import { ProjectGrid } from '@/components/gallery/project-grid'
import { ProjectModal } from '@/components/gallery/project-modal'
import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface ProjectGalleryClientProps {
  projects: ProjectWithRelations[]
}

export function ProjectGalleryClient({ projects }: ProjectGalleryClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentLanguage } = useLanguage()

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

  return (
    <>
      <ProjectGrid
        projects={projects}
        onProjectClick={handleProjectClick}
        languageId={currentLanguage}
      />
      
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        languageId={currentLanguage}
        allProjects={projects}
        onProjectChange={handleProjectChange}
      />
    </>
  )
}