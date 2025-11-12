import { ProjectService } from '@/lib/project-service'
import { ProjectGalleryClient } from './project-gallery-client'
import { ProjectsHeader } from '@/components/projects/projects-header'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Browse our collection of custom projects and artisan work.',
  openGraph: {
    title: 'Projects | Portfolio',
    description: 'Browse our collection of custom projects and artisan work.',
    type: 'website',
  },
}

interface ProjectsPageProps {
  searchParams: Promise<{
    lang?: string
  }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams
  const languageCode = resolvedSearchParams.lang || 'nl'
  
  // Fetch all published projects (don't filter by language here, let the client handle it)
  const projects = await ProjectService.getPublishedProjects()
  


  return (
    <div className="min-h-screen bg-white dark:bg-[#181818]">
      {/* Header */}
      <ProjectsHeader />

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectGalleryClient projects={projects} />
      </div>
    </div>
  )
}