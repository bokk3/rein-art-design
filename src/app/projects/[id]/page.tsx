import { ProjectService } from '@/lib/project-service'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProjectDetailClient } from './project-detail-client'

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const project = await ProjectService.getProjectById(resolvedParams.id)
  
  if (!project || !project.published) {
    return {
      title: 'Project Not Found',
    }
  }

  // Get the default translation (Dutch) or first available
  const translation = project.translations.find(t => t.language.code === 'nl') 
    || project.translations[0]

  if (!translation) {
    return {
      title: 'Project Not Found',
    }
  }

  const firstImage = project.images[0]

  return {
    title: `${translation.title} | Portfolio`,
    description: translation.materials.join(', '),
    openGraph: {
      title: translation.title,
      description: translation.materials.join(', '),
      type: 'article',
      images: firstImage ? [
        {
          url: firstImage.originalUrl,
          width: 1200,
          height: 630,
          alt: firstImage.alt,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: translation.title,
      description: translation.materials.join(', '),
      images: firstImage ? [firstImage.originalUrl] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params
  const project = await ProjectService.getProjectById(resolvedParams.id)
  
  if (!project || !project.published) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}