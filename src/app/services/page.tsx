import { notFound, redirect } from 'next/navigation'
import { ContentService } from '@/lib/content-service'

interface ServicesPageProps {
  searchParams: {
    lang?: string
  }
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const languageCode = searchParams.lang || 'nl'
  
  try {
    // Try to find a "services" content page
    const { page } = await ContentService.getPageWithFallback('services', languageCode)
    
    if (page) {
      // Redirect to the dynamic content page
      const langParam = languageCode !== 'nl' ? `?lang=${languageCode}` : ''
      redirect(`/services${langParam}`)
    }
    
    // If no content page exists, show a default services page
    return (
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Services</span>
          </nav>

          {/* Page header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h1>
          </header>

          {/* Default content */}
          <article className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Discover the services we offer. This page is currently being set up.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Content Management
              </h2>
              <p className="text-blue-800">
                This page can be customized through the admin panel. 
                Create a "services" content page to replace this default content.
              </p>
            </div>
          </article>

          {/* Back to home */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <a 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              ← Back to Home
            </a>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading services page:', error)
    notFound()
  }
}