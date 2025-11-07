import { prisma } from './db'
import { ContentPage, ContentPageTranslation, Language } from '@prisma/client'
import type { JSONContent } from '@/types/content'
import { ContentValidator } from './content-validation'

export interface ContentPageWithTranslations extends ContentPage {
  translations: (ContentPageTranslation & {
    language: Language
  })[]
}

export interface CreateContentPageData {
  slug: string
  published?: boolean
  translations: {
    languageId: string
    title: string
    content: JSONContent
  }[]
}

export interface UpdateContentPageData {
  slug?: string
  published?: boolean
  translations?: {
    languageId: string
    title: string
    content: JSONContent
  }[]
}

export class ContentService {
  /**
   * Get all content pages with their translations
   */
  static async getAllPages(includeUnpublished = false): Promise<ContentPageWithTranslations[]> {
    return prisma.contentPage.findMany({
      where: includeUnpublished ? {} : { published: true },
      include: {
        translations: {
          include: {
            language: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  }

  /**
   * Get a content page by slug with translations
   */
  static async getPageBySlug(
    slug: string, 
    includeUnpublished = false
  ): Promise<ContentPageWithTranslations | null> {
    return prisma.contentPage.findFirst({
      where: {
        slug,
        ...(includeUnpublished ? {} : { published: true })
      },
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
  }

  /**
   * Get a content page by ID with translations
   */
  static async getPageById(
    id: string, 
    includeUnpublished = false
  ): Promise<ContentPageWithTranslations | null> {
    return prisma.contentPage.findFirst({
      where: {
        id,
        ...(includeUnpublished ? {} : { published: true })
      },
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
  }

  /**
   * Create a new content page with translations
   */
  static async createPage(data: CreateContentPageData): Promise<ContentPageWithTranslations> {
    const { translations, ...pageData } = data

    return prisma.contentPage.create({
      data: {
        ...pageData,
        translations: {
          create: translations.map(t => ({
            languageId: t.languageId,
            title: t.title,
            content: t.content as any // Cast to any for Prisma Json type
          }))
        }
      },
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
  }

  /**
   * Update a content page and its translations
   */
  static async updatePage(
    id: string, 
    data: UpdateContentPageData
  ): Promise<ContentPageWithTranslations> {
    const { translations, ...pageData } = data

    // If translations are provided, update them
    if (translations) {
      // Filter out empty translations (only keep those with title or content)
      const validTranslations = translations.filter(t => {
        const hasTitle = t.title && t.title.trim().length > 0
        const hasContent = t.content && 
          (typeof t.content === 'string' ? t.content.trim().length > 0 :
           ContentValidator.extractPlainText(t.content as any).trim().length > 0)
        return hasTitle || hasContent
      })

      // Delete existing translations and create new ones
      await prisma.contentPageTranslation.deleteMany({
        where: { pageId: id }
      })

      // Only create translations that have content
      if (validTranslations.length > 0) {
        return prisma.contentPage.update({
          where: { id },
          data: {
            ...pageData,
            translations: {
              create: validTranslations.map(t => ({
                languageId: t.languageId,
                title: t.title || '', // Ensure title is never null
                content: t.content as any // Cast to any for Prisma Json type
              }))
            }
          },
          include: {
            translations: {
              include: {
                language: true
              }
            }
          }
        })
      }
    }

    // If no valid translations or translations not provided, just update page data
    return prisma.contentPage.update({
      where: { id },
      data: pageData,
      include: {
        translations: {
          include: {
            language: true
          }
        }
      }
    })
  }

  /**
   * Delete a content page
   */
  static async deletePage(id: string): Promise<void> {
    await prisma.contentPage.delete({
      where: { id }
    })
  }

  /**
   * Get content page translation for a specific language
   */
  static async getPageTranslation(
    pageId: string, 
    languageCode: string
  ): Promise<ContentPageTranslation | null> {
    return prisma.contentPageTranslation.findFirst({
      where: {
        pageId,
        language: {
          code: languageCode
        }
      },
      include: {
        language: true
      }
    })
  }

  /**
   * Get content page with fallback language support
   */
  static async getPageWithFallback(
    slug: string, 
    preferredLanguageCode: string,
    fallbackLanguageCode = 'nl'
  ): Promise<{
    page: ContentPageWithTranslations | null
    translation: ContentPageTranslation | null
    usedLanguage: string
  }> {
    const page = await this.getPageBySlug(slug)
    
    if (!page) {
      return { page: null, translation: null, usedLanguage: preferredLanguageCode }
    }

    // Try to find translation in preferred language
    let translation = page.translations.find(t => t.language.code === preferredLanguageCode)
    let usedLanguage = preferredLanguageCode

    // If not found, try fallback language
    if (!translation) {
      translation = page.translations.find(t => t.language.code === fallbackLanguageCode)
      usedLanguage = fallbackLanguageCode
    }

    // If still not found, use the first available translation
    if (!translation && page.translations.length > 0) {
      translation = page.translations[0]
      usedLanguage = translation.language.code
    }

    return { page, translation: translation || null, usedLanguage }
  }

  /**
   * Check if a slug is available (not used by another page)
   */
  static async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const existingPage = await prisma.contentPage.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } })
      }
    })

    return !existingPage
  }

  /**
   * Generate a unique slug from a title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  /**
   * Ensure slug is unique by appending number if needed
   */
  static async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug
    let counter = 1

    while (!(await this.isSlugAvailable(slug, excludeId))) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }
}