import { notFound } from 'next/navigation'
import { ContentService } from '@/lib/content-service'
import { ContentValidator } from '@/lib/content-validation'
import { Metadata } from 'next'
import { JSONContent } from '@/types/content'
import { ContentPageTranslation, Language } from '@prisma/client'

type TranslationWithLanguage = ContentPageTranslation & {
  language: Language
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    lang?: string
  }>
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const languageCode = resolvedSearchParams.lang || 'nl'
  
  try {
    const { page, translation } = await ContentService.getPageWithFallback(
      resolvedParams.slug,
      languageCode
    )

    if (!page || !translation) {
      return {
        title: 'Page Not Found'
      }
    }

    const excerpt = ContentValidator.generateExcerpt(translation.content as JSONContent)

    return {
      title: translation.title,
      description: excerpt,
      openGraph: {
        title: translation.title,
        description: excerpt,
        type: 'article',
        locale: (translation as TranslationWithLanguage).language?.code || 'nl',
        url: `/${resolvedParams.slug}`,
      },
      alternates: {
        canonical: `/${resolvedParams.slug}`,
        languages: page.translations.reduce((acc, t) => {
          const translation = t as TranslationWithLanguage
          if (translation.language) {
            acc[translation.language.code] = `/${resolvedParams.slug}?lang=${translation.language.code}`
          }
          return acc
        }, {} as Record<string, string>)
      }
    }
  } catch (error) {
    return {
      title: 'Page Not Found'
    }
  }
}

// Convert TipTap JSON to HTML for rendering
function renderTipTapContent(content: JSONContent): string {
  const renderNode = (node: JSONContent): string => {
    if (node.text) {
      let text = node.text
      
      // Apply marks (formatting)
      if (node.marks) {
        node.marks.forEach(mark => {
          switch (mark.type) {
            case 'bold':
              text = `<strong>${text}</strong>`
              break
            case 'italic':
              text = `<em>${text}</em>`
              break
            case 'strike':
              text = `<s>${text}</s>`
              break
            case 'code':
              text = `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">${text}</code>`
              break
            case 'link':
              const href = mark.attrs?.href || '#'
              text = `<a href="${href}" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">${text}</a>`
              break
          }
        })
      }
      
      return text
    }

    let html = ''
    
    // Render child content
    if (node.content) {
      const childContent = node.content.map(child => renderNode(child)).join('')
      
      switch (node.type) {
        case 'doc':
          html = childContent
          break
        case 'paragraph':
          html = `<p class="mb-4">${childContent}</p>`
          break
        case 'heading':
          const level = node.attrs?.level || 1
          const headingClasses: Record<number, string> = {
            1: 'text-3xl font-bold mb-6 mt-8',
            2: 'text-2xl font-semibold mb-4 mt-6',
            3: 'text-xl font-semibold mb-3 mt-5',
            4: 'text-lg font-semibold mb-2 mt-4',
            5: 'text-base font-semibold mb-2 mt-3',
            6: 'text-sm font-semibold mb-2 mt-2'
          }
          const headingClass = headingClasses[level] || 'text-lg font-semibold mb-2 mt-4'
          html = `<h${level} class="${headingClass}">${childContent}</h${level}>`
          break
        case 'bulletList':
          html = `<ul class="list-disc list-inside mb-4 space-y-1">${childContent}</ul>`
          break
        case 'orderedList':
          html = `<ol class="list-decimal list-inside mb-4 space-y-1">${childContent}</ol>`
          break
        case 'listItem':
          html = `<li>${childContent}</li>`
          break
        case 'blockquote':
          html = `<blockquote class="border-l-4 border-gray-300 pl-4 italic mb-4">${childContent}</blockquote>`
          break
        case 'codeBlock':
          html = `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code>${childContent}</code></pre>`
          break
        case 'hardBreak':
          html = '<br>'
          break
        default:
          html = childContent
      }
    } else if (node.type === 'image') {
      const src = node.attrs?.src || ''
      const alt = node.attrs?.alt || ''
      html = `<img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-lg mb-4" />`
    }

    return html
  }

  return renderNode(content)
}

export default async function ContentPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const languageCode = resolvedSearchParams.lang || 'nl'
  
  try {
    const { page, translation, usedLanguage } = await ContentService.getPageWithFallback(
      resolvedParams.slug,
      languageCode
    )

    if (!page || !translation) {
      notFound()
    }

    const contentHtml = renderTipTapContent(translation.content as JSONContent)
    const availableLanguages = page.translations.map(t => {
      const trans = t as TranslationWithLanguage
      return {
        code: trans.language.code,
        name: trans.language.name,
        url: `/${resolvedParams.slug}?lang=${trans.language.code}`
      }
    })

    return (
      <div className="min-h-screen bg-white">
        {/* Main content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{translation.title}</span>
          </nav>

          {/* Page header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {translation.title}
            </h1>
            
            {/* Language indicator if fallback was used */}
            {usedLanguage !== languageCode && translation && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  This page is not available in your selected language. 
                  Showing content in {(translation as TranslationWithLanguage).language?.name || 'default language'} instead.
                </p>
              </div>
            )}
          </header>

          {/* Page content */}
          <article 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

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

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: translation.title,
              description: ContentValidator.generateExcerpt(translation.content as JSONContent),
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3020'}/${resolvedParams.slug}`,
              inLanguage: (translation as TranslationWithLanguage).language?.code || 'nl',
              isPartOf: {
                '@type': 'WebSite',
                name: 'Portfolio Website',
                url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3020'
              }
            })
          }}
        />
      </div>
    )
  } catch (error) {
    console.error('Error loading content page:', error)
    notFound()
  }
}
