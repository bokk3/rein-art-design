'use client'

import { ProjectWithRelations } from '@/types/project'
import { ProjectCard } from './project-card'
import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ProjectGridProps {
  projects: ProjectWithRelations[]
  onProjectClick: (project: ProjectWithRelations) => void
  languageId?: string
}

export function ProjectGrid({ projects, onProjectClick, languageId = 'nl' }: ProjectGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'featured'>('newest')
  const [visibleCount, setVisibleCount] = useState(12)

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      if (!searchTerm) return true
      
      const translation = project.translations.find(t => t.language.code === languageId) 
        || project.translations[0]
      
      if (!translation) return false
      
      const searchLower = searchTerm.toLowerCase()
      return (
        translation.title.toLowerCase().includes(searchLower) ||
        translation.materials.some(material => 
          material.toLowerCase().includes(searchLower)
        )
      )
    })

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [projects, searchTerm, sortBy, languageId])

  // Visible projects for lazy loading
  const visibleProjects = filteredAndSortedProjects.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAndSortedProjects.length

  // Load more projects
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, filteredAndSortedProjects.length))
  }

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12)
  }, [searchTerm, sortBy])

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">No projects available yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'newest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('newest')}
          >
            Newest
          </Button>
          <Button
            variant={sortBy === 'featured' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('featured')}
          >
            Featured
          </Button>
          <Button
            variant={sortBy === 'oldest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('oldest')}
          >
            Oldest
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {visibleProjects.length} of {filteredAndSortedProjects.length} projects
      </div>

      {/* Project Grid */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No projects match your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onProjectClick(project)}
                languageId={languageId}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-8">
              <Button
                onClick={loadMore}
                variant="outline"
                size="lg"
              >
                Load More Projects
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}