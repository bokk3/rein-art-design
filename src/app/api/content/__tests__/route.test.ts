import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { GET, POST } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { JSONContent } from '@/types/content'

// Mock auth middleware
vi.mock('@/lib/auth-middleware', () => ({
  authMiddleware: vi.fn().mockResolvedValue({
    success: true,
    user: { id: 'user-1', role: 'admin' }
  })
}))

const testContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Test content' }]
    }
  ]
}

describe('/api/content', () => {
  let testLanguageId: string

  beforeEach(async () => {
    // Create test language
    const language = await prisma.language.create({
      data: {
        code: 'nl',
        name: 'Nederlands',
        isDefault: true,
        isActive: true
      }
    })
    testLanguageId = language.id
  })

  afterEach(async () => {
    // Clean up test data
    await prisma.contentPageTranslation.deleteMany()
    await prisma.contentPage.deleteMany()
    await prisma.language.deleteMany()
  })

  describe('GET /api/content', () => {
    it('should return published content pages', async () => {
      // Create test page
      await prisma.contentPage.create({
        data: {
          slug: 'test-page',
          published: true,
          translations: {
            create: {
              languageId: testLanguageId,
              title: 'Test Page',
              content: testContent
            }
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/content')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pages).toHaveLength(1)
      expect(data.pages[0].slug).toBe('test-page')
    })

    it('should exclude unpublished pages by default', async () => {
      // Create unpublished page
      await prisma.contentPage.create({
        data: {
          slug: 'draft-page',
          published: false,
          translations: {
            create: {
              languageId: testLanguageId,
              title: 'Draft Page',
              content: testContent
            }
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/content')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pages).toHaveLength(0)
    })

    it('should include unpublished pages when requested with auth', async () => {
      // Create unpublished page
      await prisma.contentPage.create({
        data: {
          slug: 'draft-page',
          published: false,
          translations: {
            create: {
              languageId: testLanguageId,
              title: 'Draft Page',
              content: testContent
            }
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/content?includeUnpublished=true')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pages).toHaveLength(1)
      expect(data.pages[0].published).toBe(false)
    })

    it('should filter by language', async () => {
      // Create second language
      const frLanguage = await prisma.language.create({
        data: {
          code: 'fr',
          name: 'Français',
          isDefault: false,
          isActive: true
        }
      })

      // Create page with multiple translations
      await prisma.contentPage.create({
        data: {
          slug: 'multilang-page',
          published: true,
          translations: {
            create: [
              {
                languageId: testLanguageId,
                title: 'Dutch Title',
                content: testContent
              },
              {
                languageId: frLanguage.id,
                title: 'French Title',
                content: testContent
              }
            ]
          }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/content?language=fr')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pages).toHaveLength(1)
    })
  })

  describe('POST /api/content', () => {
    it('should create a new content page', async () => {
      const pageData = {
        slug: 'new-page',
        published: true,
        translations: [
          {
            languageId: testLanguageId,
            title: 'New Page',
            content: testContent
          }
        ]
      }

      const request = new NextRequest('http://localhost:3000/api/content', {
        method: 'POST',
        body: JSON.stringify(pageData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.slug).toBe('new-page')
      expect(data.translations).toHaveLength(1)
      expect(data.translations[0].title).toBe('New Page')
    })

    it('should validate required fields', async () => {
      const invalidData = {
        slug: '',
        published: true,
        translations: []
      }

      const request = new NextRequest('http://localhost:3000/api/content', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toBeDefined()
    })

    it('should reject duplicate slugs', async () => {
      // Create existing page
      await prisma.contentPage.create({
        data: {
          slug: 'existing-page',
          published: true,
          translations: {
            create: {
              languageId: testLanguageId,
              title: 'Existing Page',
              content: testContent
            }
          }
        }
      })

      const duplicateData = {
        slug: 'existing-page',
        published: true,
        translations: [
          {
            languageId: testLanguageId,
            title: 'Duplicate Page',
            content: testContent
          }
        ]
      }

      const request = new NextRequest('http://localhost:3000/api/content', {
        method: 'POST',
        body: JSON.stringify(duplicateData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Slug already exists')
    })

    it('should require authentication', async () => {
      // Mock failed auth
      const { authMiddleware } = await import('@/lib/auth-middleware')
      vi.mocked(authMiddleware).mockResolvedValueOnce({
        success: false,
        error: 'Authentication required'
      })

      const pageData = {
        slug: 'new-page',
        published: true,
        translations: [
          {
            languageId: testLanguageId,
            title: 'New Page',
            content: testContent
          }
        ]
      }

      const request = new NextRequest('http://localhost:3000/api/content', {
        method: 'POST',
        body: JSON.stringify(pageData),
        headers: { 'Content-Type': 'application/json' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authentication required')
    })
  })
})