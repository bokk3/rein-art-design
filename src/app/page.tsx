import { ProjectService } from '@/lib/project-service'
import { HomepageClient } from './homepage-client'
import { Metadata } from 'next'
import { PageComponent } from '@/types/page-builder'

export const metadata: Metadata = {
  title: 'Exceptional Craftsmanship | Custom Artisan Work',
  description: 'Where tradition meets innovation. Discover unique handcrafted pieces made with premium materials and meticulous attention to detail. Each project tells a story of passion, skill, and artistic vision.',
  openGraph: {
    title: 'Exceptional Craftsmanship | Custom Artisan Work',
    description: 'Where tradition meets innovation. Discover unique handcrafted pieces made with premium materials and meticulous attention to detail.',
    type: 'website',
  },
}

interface HomeProps {
  searchParams: Promise<{
    lang?: string
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams
  const languageCode = resolvedSearchParams.lang || 'nl'
  
  // Fetch featured projects for the homepage with language support
  const featuredProjects = await ProjectService.getFeaturedProjects(languageCode)
  
  // Check if there are page builder components
  let pageBuilderComponents = null
  try {
    // Import prisma directly to avoid fetch during SSR
    const { prisma } = await import('@/lib/db')
    const homepage = await prisma.siteSettings.findUnique({
      where: { key: 'homepage_components' }
    })
    pageBuilderComponents = homepage?.value || null
  } catch (error) {
    console.error('Error fetching page builder components:', error)
  }
  
  return (
    <HomepageClient 
      featuredProjects={featuredProjects} 
      pageBuilderComponents={pageBuilderComponents as PageComponent[] | null}
      currentLanguage={languageCode}
    />
  )
}
