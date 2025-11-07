'use client'

import { useState, useEffect } from 'react'
import { ProjectWithRelations } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Languages, Loader2 } from 'lucide-react'
import { useT } from '@/hooks/use-t'

interface ProjectListProps {
  onCreateProject: () => void
  onEditProject: (project: ProjectWithRelations) => void
  onDeleteProject: (project: ProjectWithRelations) => void
}

export function ProjectList({ onCreateProject, onEditProject, onDeleteProject }: ProjectListProps) {
  const { t } = useT()
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [publishedFilter, setPublishedFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationStatus, setTranslationStatus] = useState<string>('')
  const [apiConfigured, setApiConfigured] = useState(false)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (search) params.append('search', search)
      if (publishedFilter !== 'all') params.append('published', publishedFilter)
      if (featuredFilter !== 'all') params.append('featured', featuredFilter)
      params.append('limit', '50') // Get more projects for admin view

      const response = await fetch(`/api/projects?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      setProjects(data.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [search, publishedFilter, featuredFilter])

  // Check if translation API is configured
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch('/api/admin/translations/check-api')
        if (response.ok) {
          const data = await response.json()
          setApiConfigured(data.configured)
        }
      } catch (error) {
        console.error('Error checking API:', error)
      }
    }
    checkAPI()
  }, [])

  // Bulk translate all projects
  const handleTranslateAll = async () => {
    if (!apiConfigured) {
      alert('Translation API is not configured. Please configure it in Settings.')
      return
    }

    if (projects.length === 0) {
      alert('No projects to translate')
      return
    }

    if (!confirm(`Translate all ${projects.length} project(s) to all active languages?`)) {
      return
    }

    setIsTranslating(true)
    setTranslationStatus('Translating projects...')

    try {
      const projectIds = projects.map(p => p.id)
      const response = await fetch('/api/admin/projects/translate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to translate projects')
      }

      const data = await response.json()
      setTranslationStatus(
        `Translation complete! ${data.results.success} succeeded, ${data.results.failed} failed.`
      )
      
      // Refresh projects list
      await fetchProjects()
      
      setTimeout(() => setTranslationStatus(''), 5000)
    } catch (error) {
      console.error('Error translating projects:', error)
      setTranslationStatus(
        `Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      setTimeout(() => setTranslationStatus(''), 5000)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleToggleFeatured = async (project: ProjectWithRelations) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/toggle-featured`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to toggle featured status')
      }

      // Refresh the list
      fetchProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleTogglePublished = async (project: ProjectWithRelations) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/toggle-published`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to toggle published status')
      }

      // Refresh the list
      fetchProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const getProjectTitle = (project: ProjectWithRelations) => {
    // Get title from first available translation
    const translation = project.translations[0]
    return translation?.title || 'Untitled Project'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{t('admin.loadingProjects')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="text-red-800">{t('admin.error')}: {error}</div>
        <Button 
          onClick={fetchProjects} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          {t('admin.retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.projects')}</h1>
        <div className="flex gap-2">
          {apiConfigured && projects.length > 0 && (
            <Button
              onClick={handleTranslateAll}
              disabled={isTranslating}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{translationStatus || 'Translating...'}</span>
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4" />
                  <span>Translate All</span>
                </>
              )}
            </Button>
          )}
          <Button onClick={onCreateProject}>
            {t('admin.createProject')}
          </Button>
        </div>
      </div>

      {/* Translation Status */}
      {translationStatus && !isTranslating && (
        <div className={`p-4 rounded-md ${
          translationStatus.includes('failed') || translationStatus.includes('Failed')
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
        }`}>
          {translationStatus}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder={t('admin.searchProjects')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
        >
          <option value="all">{t('admin.allStatus')}</option>
          <option value="true">{t('admin.published')}</option>
          <option value="false">{t('admin.draft')}</option>
        </Select>
        <Select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
        >
          <option value="all">{t('admin.allProjects')}</option>
          <option value="true">{t('admin.featured')}</option>
          <option value="false">{t('admin.notFeatured')}</option>
        </Select>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.project')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.images')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.created')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  {t('admin.noProjectsFound')}
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {getProjectTitle(project)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {project.translations.length} {t('admin.translationsCount')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full ${
                        project.published 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                      {project.featured && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {project.images.length} image(s)
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <Button
                      onClick={() => onEditProject(project)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleFeatured(project)}
                      variant="outline"
                      size="sm"
                    >
                      {project.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      onClick={() => handleTogglePublished(project)}
                      variant="outline"
                      size="sm"
                    >
                      {project.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      onClick={() => onDeleteProject(project)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}