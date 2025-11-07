import { MetadataRoute } from 'next'
import { ContentService } from '@/lib/content-service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3020'
  
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }
  ]

  try {
    // Get all published content pages
    const pages = await ContentService.getAllPages(false)
    
    // Add content pages to sitemap
    pages.forEach(page => {
      // Add main page URL
      sitemap.push({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      })

      // Add language-specific URLs
      page.translations.forEach(translation => {
        if (translation.language.code !== 'nl') { // Skip default language
          sitemap.push({
            url: `${baseUrl}/${page.slug}?lang=${translation.language.code}`,
            lastModified: page.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.6,
          })
        }
      })
    })

    // Add default pages (about, services, contact) if they don't exist as content pages
    const defaultPages = ['about', 'services', 'contact']
    const existingSlugs = pages.map(p => p.slug)
    
    defaultPages.forEach(slug => {
      if (!existingSlugs.includes(slug)) {
        sitemap.push({
          url: `${baseUrl}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return sitemap
}
