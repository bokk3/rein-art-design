'use client'

import { useState } from 'react'
import { ProjectWithRelations } from '@/types/project'
import { ProjectList } from './project-list'
import { ProjectForm } from './project-form'
import { DeleteConfirmation } from './delete-confirmation'

type View = 'list' | 'create' | 'edit'

export function ProjectManagement() {
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null)
  const [deleteProject, setDeleteProject] = useState<ProjectWithRelations | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleCreateProject = () => {
    setSelectedProject(null)
    setCurrentView('create')
  }

  const handleEditProject = (project: ProjectWithRelations) => {
    setSelectedProject(project)
    setCurrentView('edit')
  }

  const handleDeleteProject = (project: ProjectWithRelations) => {
    setDeleteProject(project)
  }

  const handleSaveProject = () => {
    setCurrentView('list')
    setSelectedProject(null)
  }

  const handleCancelEdit = () => {
    setCurrentView('list')
    setSelectedProject(null)
  }

  const confirmDelete = async () => {
    if (!deleteProject) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/projects/${deleteProject.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setDeleteProject(null)
      // The project list will refresh automatically
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete project. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const cancelDelete = () => {
    setDeleteProject(null)
  }

  const getProjectTitle = (project: ProjectWithRelations) => {
    const translation = project.translations[0]
    return translation?.title || 'Untitled Project'
  }

  return (
    <div className="animate-fade-in">
      {currentView === 'list' && (
        <ProjectList
          onCreateProject={handleCreateProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <ProjectForm
          project={selectedProject || undefined}
          onSave={handleSaveProject}
          onCancel={handleCancelEdit}
        />
      )}

      <DeleteConfirmation
        isOpen={!!deleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteProject ? getProjectTitle(deleteProject) : ''}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleteLoading}
      />
    </div>
  )
}