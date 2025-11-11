import { ProjectService } from '@/lib/project-service'
import { HomepageClient } from './homepage-client'
import { Metadata } from 'next'
import { PageComponent } from '@/types/page-builder'
import { Suspense } from 'react'

// Force dynamic rendering since we need database access
export const dynamic = 'force-dynamic'
export const dynamicParams = true

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

async function HomePage({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams
  const languageCode = resolvedSearchParams.lang || 'nl'
  
  // Fetch featured projects for the homepage with language support
  let featuredProjects = []
  let pageBuilderComponents = null
  
  try {
    // Check if database is available (not in build environment)
    // Skip database calls during build (when DATABASE_URL contains 'dummy')
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dummy')) {
      featuredProjects = await ProjectService.getFeaturedProjects(languageCode)
      
      // Import prisma directly to avoid fetch during SSR
      const { prisma } = await import('@/lib/db')
      const homepage = await prisma.siteSettings.findUnique({
        where: { key: 'homepage_components' }
      })
      pageBuilderComponents = homepage?.value || null
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    // Return empty data if database is not available
  }
  
  return (
    <HomepageClient 
      featuredProjects={featuredProjects} 
      pageBuilderComponents={pageBuilderComponents as PageComponent[] | null}
      currentLanguage={languageCode}
    />
  )
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage searchParams={searchParams} />
    </Suspense>
  )
}
