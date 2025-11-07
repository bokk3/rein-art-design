import { describe, it, expect } from 'vitest'
import { ContentValidator } from '../content-validation'
import { JSONContent } from '@/types/content'

describe('ContentValidator', () => {
  const validContent: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This is valid content'
          }
        ]
      }
    ]
  }

  const validPageData = {
    slug: 'valid-slug',
    published: true,
    translations: [
      {
        languageId: 'lang-1',
        title: 'Valid Title',
        content: validContent
      }
    ]
  }

  describe('validateContentPage', () => {
    it('should validate correct page data', () => {
      const errors = ContentValidator.validateContentPage(validPageData)
      expect(errors).toHaveLength(0)
    })

    it('should require slug', () => {
      const invalidData = { ...validPageData, slug: '' }
      const errors = ContentValidator.validateContentPage(invalidData)
      
      expect(errors).toContainEqual({
        field: 'slug',
        message: 'Slug is required'
      })
    })

    it('should validate slug format', () => {
      const invalidData = { ...validPageData, slug: 'Invalid Slug!' }
      const errors = ContentValidator.validateContentPage(invalidData)
      
      expect(errors).toContainEqual({
        field: 'slug',
        message: 'Slug must contain only lowercase letters, numbers, and hyphens'
      })
    })

    it('should require at least one translation', () => {
      const invalidData = { ...validPageData, translations: [] }
      const errors = ContentValidator.validateContentPage(invalidData)
      
      expect(errors).toContainEqual({
        field: 'translations',
        message: 'At least one translation is required'
      })
    })

    it('should validate translation titles', () => {
      const invalidData = {
        ...validPageData,
        translations: [
          {
            languageId: 'lang-1',
            title: '',
            content: validContent
          }
        ]
      }
      const errors = ContentValidator.validateContentPage(invalidData)
      
      expect(errors).toContainEqual({
        field: 'translations[0].title',
        message: 'Title is required'
      })
    })

    it('should validate title length', () => {
      const longTitle = 'a'.repeat(201)
      const invalidData = {
        ...validPageData,
        translations: [
          {
            languageId: 'lang-1',
            title: longTitle,
            content: validContent
          }
        ]
      }
      const errors = ContentValidator.validateContentPage(invalidData)
      
      expect(errors).toContainEqual({
        field: 'translations[0].title',
        message: 'Title must be less than 200 characters'
      })
    })

    it('should validate content presence', () => {
      const invalidData = {
        ...validPageData,
        translations: [
          {
            languageId: 'lang-1',
            title: 'Valid Title',
            content: null as any
          }
        ]
      }
      const errors = ContentValidator.validateContentPage(invalidData)
      
      expect(errors).toContainEqual({
        field: 'translations[0].content',
        message: 'Content is required'
      })
    })

    it('should detect duplicate languages', () => {
      const invalidData = {
        ...validPageData,
        translations: [
          {
            languageId: 'lang-1',
            title: 'Title 1',
            content: validContent
          },
          {
            languageId: 'lang-1',
            title: 'Title 2',
            content: validContent
          }
        ]
      }
      const errors = ContentValidator.validateContentPage(invalidData)
      
      expect(errors).toContainEqual({
        field: 'translations',
        message: 'Duplicate languages are not allowed'
      })
    })
  })

  describe('isValidSlug', () => {
    it('should accept valid slugs', () => {
      expect(ContentValidator.isValidSlug('valid-slug')).toBe(true)
      expect(ContentValidator.isValidSlug('slug123')).toBe(true)
      expect(ContentValidator.isValidSlug('my-page-2024')).toBe(true)
    })

    it('should reject invalid slugs', () => {
      expect(ContentValidator.isValidSlug('Invalid Slug')).toBe(false)
      expect(ContentValidator.isValidSlug('slug!')).toBe(false)
      expect(ContentValidator.isValidSlug('UPPERCASE')).toBe(false)
      expect(ContentValidator.isValidSlug('-leading-dash')).toBe(false)
      expect(ContentValidator.isValidSlug('trailing-dash-')).toBe(false)
    })
  })

  describe('validateTipTapContent', () => {
    it('should validate correct TipTap content', () => {
      const errors = ContentValidator.validateTipTapContent(validContent)
      expect(errors).toHaveLength(0)
    })

    it('should require type property', () => {
      const invalidContent = { content: [] } as any
      const errors = ContentValidator.validateTipTapContent(invalidContent)
      
      expect(errors).toContain('Content must have a type property')
    })

    it('should reject non-object content', () => {
      const errors = ContentValidator.validateTipTapContent('invalid' as any)
      expect(errors).toContain('Content must be a valid JSON object')
    })

    it('should validate content size', () => {
      const largeContent = {
        type: 'doc',
        content: Array(10000).fill({
          type: 'paragraph',
          content: [{ type: 'text', text: 'a'.repeat(1000) }]
        })
      }
      
      const errors = ContentValidator.validateTipTapContent(largeContent)
      expect(errors).toContain('Content is too large (maximum 1MB)')
    })
  })

  describe('extractPlainText', () => {
    it('should extract text from TipTap content', () => {
      const content: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Hello ' },
              { type: 'text', text: 'world', marks: [{ type: 'bold' }] }
            ]
          }
        ]
      }
      
      const text = ContentValidator.extractPlainText(content)
      expect(text).toBe('Hello world')
    })

    it('should handle nested content', () => {
      const content: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            content: [{ type: 'text', text: 'Title' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Paragraph text' }]
          }
        ]
      }
      
      const text = ContentValidator.extractPlainText(content)
      expect(text).toBe('TitleParagraph text')
    })
  })

  describe('generateExcerpt', () => {
    it('should generate excerpt from content', () => {
      const content: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'This is a long piece of content that should be truncated to create an excerpt for preview purposes.' }
            ]
          }
        ]
      }
      
      const excerpt = ContentValidator.generateExcerpt(content, 50)
      expect(excerpt.length).toBeLessThanOrEqual(53) // 50 + '...'
      expect(excerpt).toContain('...')
    })

    it('should return full text if shorter than limit', () => {
      const content: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Short text' }]
          }
        ]
      }
      
      const excerpt = ContentValidator.generateExcerpt(content, 50)
      expect(excerpt).toBe('Short text')
    })
  })

  describe('sanitizeTipTapContent', () => {
    it('should sanitize dangerous content', () => {
      const dangerousContent: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Click here',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'javascript:alert("xss")',
                      target: '_blank'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
      
      const sanitized = ContentValidator.sanitizeTipTapContent(dangerousContent)
      const linkMark = sanitized.content?.[0]?.content?.[0]?.marks?.[0]
      
      expect(linkMark?.attrs?.href).toBeUndefined() // Should remove javascript: links
    })

    it('should preserve safe content', () => {
      const safeContent: JSONContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Safe link',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'https://example.com',
                      target: '_blank'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
      
      const sanitized = ContentValidator.sanitizeTipTapContent(safeContent)
      const linkMark = sanitized.content?.[0]?.content?.[0]?.marks?.[0]
      
      expect(linkMark?.attrs?.href).toBe('https://example.com')
      expect(linkMark?.attrs?.rel).toBe('noopener noreferrer')
    })
  })
})