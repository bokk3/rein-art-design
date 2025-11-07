import type { JSONContent } from '@/types/content'
import { ContentPageWithTranslations, ContentPageListItem, ContentSearchResult } from '@/types/content'
import { ContentValidator } from './content-validation'

export class ContentUtils {
  /**
   * Transform content page for list display
   */
  static transformForList(page: ContentPageWithTranslations): ContentPageListItem {
    return {
      id: page.id,
      slug: page.slug,
      published: page.published,
      updatedAt: page.updatedAt,
      translations: page.translations.map(translation => ({
        languageId: translation.languageId,
        languageCode: translation.language.code,
        languageName: translation.language.name,
        title: translation.title,
        excerpt: ContentValidator.generateExcerpt(translation.content as JSONContent)
      }))
    }
  }

  /**
   * Search content pages by title and content
   */
  static searchPages(
    pages: ContentPageWithTranslations[], 
    query: string,
    languageCode?: string
  ): ContentSearchResult[] {
    const searchTerm = query.toLowerCase().trim()
    
    if (!searchTerm) {
      return []
    }

    const results: ContentSearchResult[] = []

    pages.forEach(page => {
      page.translations.forEach(translation => {
        // Filter by language if specified
        if (languageCode && translation.language.code !== languageCode) {
          return
        }

        const title = translation.title.toLowerCase()
        const content = ContentValidator.extractPlainText(translation.content as JSONContent).toLowerCase()
        
        // Check if search term matches title or content
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
          results.push({
            id: page.id,
            slug: page.slug,
            title: translation.title,
            excerpt: ContentValidator.generateExcerpt(translation.content as JSONContent),
            languageCode: translation.language.code,
            updatedAt: page.updatedAt
          })
        }
      })
    })

    // Sort by relevance (title matches first, then by update date)
    return results.sort((a, b) => {
      const aInTitle = a.title.toLowerCase().includes(searchTerm)
      const bInTitle = b.title.toLowerCase().includes(searchTerm)
      
      if (aInTitle && !bInTitle) return -1
      if (!aInTitle && bInTitle) return 1
      
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })
  }

  /**
   * Filter content pages based on criteria
   */
  static filterPages(
    pages: ContentPageWithTranslations[],
    filters: {
      published?: boolean
      languageCode?: string
      hasTranslation?: string
    }
  ): ContentPageWithTranslations[] {
    return pages.filter(page => {
      // Filter by published status
      if (filters.published !== undefined && page.published !== filters.published) {
        return false
      }

      // Filter by language availability
      if (filters.languageCode) {
        const hasLanguage = page.translations.some(
          t => t.language.code === filters.languageCode
        )
        if (!hasLanguage) {
          return false
        }
      }

      // Filter by specific translation requirement
      if (filters.hasTranslation) {
        const hasTranslation = page.translations.some(
          t => t.language.code === filters.hasTranslation
        )
        if (!hasTranslation) {
          return false
        }
      }

      return true
    })
  }

  /**
   * Sort content pages
   */
  static sortPages(
    pages: ContentPageWithTranslations[],
    sortBy: 'updatedAt' | 'slug' | 'title' = 'updatedAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    languageCode = 'nl'
  ): ContentPageWithTranslations[] {
    return [...pages].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'updatedAt':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
          break
        
        case 'slug':
          comparison = a.slug.localeCompare(b.slug)
          break
        
        case 'title':
          const aTranslation = a.translations.find(t => t.language.code === languageCode)
          const bTranslation = b.translations.find(t => t.language.code === languageCode)
          const aTitle = aTranslation?.title || a.translations[0]?.title || ''
          const bTitle = bTranslation?.title || b.translations[0]?.title || ''
          comparison = aTitle.localeCompare(bTitle)
          break
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  /**
   * Get content statistics
   */
  static getContentStats(pages: ContentPageWithTranslations[]): {
    total: number
    published: number
    unpublished: number
    byLanguage: Record<string, number>
  } {
    const stats = {
      total: pages.length,
      published: 0,
      unpublished: 0,
      byLanguage: {} as Record<string, number>
    }

    pages.forEach(page => {
      if (page.published) {
        stats.published++
      } else {
        stats.unpublished++
      }

      page.translations.forEach(translation => {
        const langCode = translation.language.code
        stats.byLanguage[langCode] = (stats.byLanguage[langCode] || 0) + 1
      })
    })

    return stats
  }

  /**
   * Check if content page has required translations
   */
  static hasRequiredTranslations(
    page: ContentPageWithTranslations,
    requiredLanguages: string[]
  ): {
    isComplete: boolean
    missing: string[]
  } {
    const availableLanguages = page.translations.map(t => t.language.code)
    const missing = requiredLanguages.filter(lang => !availableLanguages.includes(lang))
    
    return {
      isComplete: missing.length === 0,
      missing
    }
  }

  /**
   * Generate SEO-friendly URL from title
   */
  static generateSeoUrl(title: string, maxLength = 60): string {
    return title
      .toLowerCase()
      .trim()
      // Remove special characters except spaces and hyphens
      .replace(/[^\w\s-]/g, '')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Replace spaces with hyphens
      .replace(/\s/g, '-')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length
      .substring(0, maxLength)
      // Remove trailing hyphen if cut off mid-word
      .replace(/-+$/, '')
  }

  /**
   * Validate content page structure
   */
  static validatePageStructure(page: any): page is ContentPageWithTranslations {
    return (
      page &&
      typeof page.id === 'string' &&
      typeof page.slug === 'string' &&
      typeof page.published === 'boolean' &&
      Array.isArray(page.translations) &&
      page.translations.every((t: any) => 
        t &&
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        t.content &&
        t.language &&
        typeof t.language.code === 'string'
      )
    )
  }

  /**
   * Create empty TipTap content structure
   */
  static createEmptyContent(): JSONContent {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    }
  }

  /**
   * Check if TipTap content is empty
   */
  static isContentEmpty(content: JSONContent): boolean {
    const text = ContentValidator.extractPlainText(content)
    return text.trim().length === 0
  }

  /**
   * Merge content page data for updates
   */
  static mergePageData(
    existing: ContentPageWithTranslations,
    updates: Partial<ContentPageWithTranslations>
  ): ContentPageWithTranslations {
    return {
      ...existing,
      ...updates,
      translations: updates.translations || existing.translations
    }
  }

  /**
   * Get content page breadcrumbs for navigation
   */
  static getBreadcrumbs(page: ContentPageWithTranslations, languageCode = 'nl'): {
    label: string
    href: string
  }[] {
    const translation = page.translations.find(t => t.language.code === languageCode)
    const title = translation?.title || page.slug

    return [
      { label: 'Home', href: '/' },
      { label: title, href: `/${page.slug}` }
    ]
  }
}