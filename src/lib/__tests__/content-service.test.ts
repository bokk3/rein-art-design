import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ContentService } from '../content-service'
import { prisma } from '../db'
import { JSONContent } from '@/types/content'

// Test data
const createTestLanguage = (suffix = '') => ({
  code: `nl${suffix}`,
  name: 'Nederlands',
  isDefault: true,
  isActive: true
})

const testContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is test content'
        }
      ]
    }
  ]
}

const testPageData = {
  slug: 'test-page',
  published: true,
  translations: [
    {
      languageId: '',
      title: 'Test Page',
      content: testContent
    }
  ]
}

describe('ContentService', () => {
  let testLanguageId: string

  beforeEach(async () => {
    // Create test language with unique code
    const language = await prisma.language.create({
      data: createTestLanguage(`-${Date.now()}-${Math.random()}`)
    })
    testLanguageId = language.id
    testPageData.translations[0].languageId = testLanguageId
  })

  afterEach(async () => {
    // Clean up test data
    await prisma.contentPageTranslation.deleteMany()
    await prisma.contentPage.deleteMany()
    await prisma.language.deleteMany()
  })

  describe('createPage', () => {
    it('should create a content page with translations', async () => {
      const page = await ContentService.createPage(testPageData)

      expect(page).toBeDefined()
      expect(page.slug).toBe(testPageData.slug)
      expect(page.published).toBe(testPageData.published)
      expect(page.translations).toHaveLength(1)
      expect(page.translations[0].title).toBe(testPageData.translations[0].title)
      expect(page.translations[0].content).toEqual(testPageData.translations[0].content)
    })

    it('should create a page with multiple translations', async () => {
      // Create second language
      const frLanguage = await prisma.language.create({
        data: {
          code: 'fr',
          name: 'Français',
          isDefault: false,
          isActive: true
        }
      })

      const multiLangData = {
        ...testPageData,
        translations: [
          ...testPageData.translations,
          {
            languageId: frLanguage.id,
            title: 'Page de Test',
            content: testContent
          }
        ]
      }

      const page = await ContentService.createPage(multiLangData)

      expect(page.translations).toHaveLength(2)
      expect(page.translations.find(t => t.language.code === 'nl')?.title).toBe('Test Page')
      expect(page.translations.find(t => t.language.code === 'fr')?.title).toBe('Page de Test')
    })
  })

  describe('getPageBySlug', () => {
    it('should retrieve a page by slug', async () => {
      const createdPage = await ContentService.createPage(testPageData)
      const retrievedPage = await ContentService.getPageBySlug(testPageData.slug)

      expect(retrievedPage).toBeDefined()
      expect(retrievedPage?.id).toBe(createdPage.id)
      expect(retrievedPage?.slug).toBe(testPageData.slug)
    })

    it('should return null for non-existent slug', async () => {
      const page = await ContentService.getPageBySlug('non-existent-slug')
      expect(page).toBeNull()
    })

    it('should exclude unpublished pages by default', async () => {
      const unpublishedData = { ...testPageData, published: false }
      await ContentService.createPage(unpublishedData)

      const page = await ContentService.getPageBySlug(testPageData.slug)
      expect(page).toBeNull()
    })

    it('should include unpublished pages when requested', async () => {
      const unpublishedData = { ...testPageData, published: false }
      await ContentService.createPage(unpublishedData)

      const page = await ContentService.getPageBySlug(testPageData.slug, true)
      expect(page).toBeDefined()
      expect(page?.published).toBe(false)
    })
  })

  describe('updatePage', () => {
    it('should update page data', async () => {
      const createdPage = await ContentService.createPage(testPageData)
      
      const updateData = {
        slug: 'updated-slug',
        published: false,
        translations: [
          {
            languageId: testLanguageId,
            title: 'Updated Title',
            content: testContent
          }
        ]
      }

      const updatedPage = await ContentService.updatePage(createdPage.id, updateData)

      expect(updatedPage.slug).toBe('updated-slug')
      expect(updatedPage.published).toBe(false)
      expect(updatedPage.translations[0].title).toBe('Updated Title')
    })
  })

  describe('deletePage', () => {
    it('should delete a page and its translations', async () => {
      const createdPage = await ContentService.createPage(testPageData)
      
      await ContentService.deletePage(createdPage.id)

      const deletedPage = await ContentService.getPageById(createdPage.id, true)
      expect(deletedPage).toBeNull()
    })
  })

  describe('getPageWithFallback', () => {
    it('should return page in preferred language', async () => {
      await ContentService.createPage(testPageData)

      const result = await ContentService.getPageWithFallback(
        testPageData.slug,
        'nl'
      )

      expect(result.page).toBeDefined()
      expect(result.translation).toBeDefined()
      expect(result.usedLanguage).toBe('nl')
      expect(result.translation?.title).toBe('Test Page')
    })

    it('should fallback to default language when preferred not available', async () => {
      await ContentService.createPage(testPageData)

      const result = await ContentService.getPageWithFallback(
        testPageData.slug,
        'fr', // Not available
        'nl'  // Fallback
      )

      expect(result.page).toBeDefined()
      expect(result.translation).toBeDefined()
      expect(result.usedLanguage).toBe('nl')
      expect(result.translation?.title).toBe('Test Page')
    })
  })

  describe('isSlugAvailable', () => {
    it('should return true for available slug', async () => {
      const isAvailable = await ContentService.isSlugAvailable('new-slug')
      expect(isAvailable).toBe(true)
    })

    it('should return false for existing slug', async () => {
      await ContentService.createPage(testPageData)
      const isAvailable = await ContentService.isSlugAvailable(testPageData.slug)
      expect(isAvailable).toBe(false)
    })

    it('should exclude specified page ID when checking availability', async () => {
      const createdPage = await ContentService.createPage(testPageData)
      const isAvailable = await ContentService.isSlugAvailable(
        testPageData.slug,
        createdPage.id
      )
      expect(isAvailable).toBe(true)
    })
  })

  describe('generateSlug', () => {
    it('should generate slug from title', () => {
      const slug = ContentService.generateSlug('My Test Page Title')
      expect(slug).toBe('my-test-page-title')
    })

    it('should handle special characters', () => {
      const slug = ContentService.generateSlug('Title with Special! Characters@#$')
      expect(slug).toBe('title-with-special-characters')
    })

    it('should handle multiple spaces', () => {
      const slug = ContentService.generateSlug('Title   with    multiple   spaces')
      expect(slug).toBe('title-with-multiple-spaces')
    })
  })

  describe('ensureUniqueSlug', () => {
    it('should return original slug if available', async () => {
      const uniqueSlug = await ContentService.ensureUniqueSlug('unique-slug')
      expect(uniqueSlug).toBe('unique-slug')
    })

    it('should append number if slug exists', async () => {
      await ContentService.createPage(testPageData)
      const uniqueSlug = await ContentService.ensureUniqueSlug(testPageData.slug)
      expect(uniqueSlug).toBe(`${testPageData.slug}-1`)
    })
  })
})