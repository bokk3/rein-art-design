import type { JSONContent } from '@/types/content'
import DOMPurify from 'isomorphic-dompurify'

export interface ContentValidationError {
  field: string
  message: string
}

export interface ContentPageValidationData {
  slug: string
  published?: boolean
  translations: {
    languageId: string
    title: string
    content: JSONContent
  }[]
}

export class ContentValidator {
  /**
   * Validate content page data
   */
  static validateContentPage(data: ContentPageValidationData): ContentValidationError[] {
    const errors: ContentValidationError[] = []

    // Validate slug
    if (!data.slug || data.slug.trim().length === 0) {
      errors.push({ field: 'slug', message: 'Slug is required' })
    } else if (!this.isValidSlug(data.slug)) {
      errors.push({ 
        field: 'slug', 
        message: 'Slug must contain only lowercase letters, numbers, and hyphens' 
      })
    }

    // Validate translations
    if (!data.translations || data.translations.length === 0) {
      errors.push({ field: 'translations', message: 'At least one translation is required' })
    } else {
      data.translations.forEach((translation: any, index: number) => {
        const prefix = `translations[${index}]`

        // Validate language ID (always required)
        if (!translation.languageId || translation.languageId.trim().length === 0) {
          errors.push({ 
            field: `${prefix}.languageId`, 
            message: 'Language ID is required' 
          })
        }

        // Validate title structure (if provided, must be valid)
        if (translation.title !== undefined && translation.title !== null) {
          if (typeof translation.title !== 'string') {
            errors.push({ 
              field: `${prefix}.title`, 
              message: 'Title must be a string' 
            })
          } else if (translation.title.length > 200) {
            errors.push({ 
              field: `${prefix}.title`, 
              message: 'Title must be less than 200 characters' 
            })
          }
        }

        // Validate content structure (if provided, must be valid)
        if (translation.content !== undefined && translation.content !== null) {
          const contentErrors = this.validateTipTapContent(translation.content)
          contentErrors.forEach(error => {
            errors.push({ 
              field: `${prefix}.content`, 
              message: error 
            })
          })
        }
      })

      // Check for duplicate languages
      const languageIds = data.translations.map(t => t.languageId)
      const duplicates = languageIds.filter((id, index) => languageIds.indexOf(id) !== index)
      if (duplicates.length > 0) {
        errors.push({ 
          field: 'translations', 
          message: 'Duplicate languages are not allowed' 
        })
      }
    }

    return errors
  }

  /**
   * Validate slug format
   */
  static isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugRegex.test(slug)
  }

  /**
   * Validate TipTap JSON content
   */
  static validateTipTapContent(content: JSONContent): string[] {
    const errors: string[] = []

    if (!content || typeof content !== 'object') {
      errors.push('Content must be a valid JSON object')
      return errors
    }

    // Check if content has required structure
    if (!content.type) {
      errors.push('Content must have a type property')
    }

    // Validate content size (prevent extremely large content)
    const contentString = JSON.stringify(content)
    if (contentString.length > 1000000) { // 1MB limit
      errors.push('Content is too large (maximum 1MB)')
    }

    // Recursively validate content structure
    const validateNode = (node: JSONContent, path = 'content'): void => {
      if (node.type && typeof node.type !== 'string') {
        errors.push(`Invalid type at ${path}: must be a string`)
      }

      if (node.attrs && typeof node.attrs !== 'object') {
        errors.push(`Invalid attrs at ${path}: must be an object`)
      }

      if (node.content && Array.isArray(node.content)) {
        node.content.forEach((child: JSONContent, index: number) => {
          validateNode(child, `${path}.content[${index}]`)
        })
      }

      if (node.marks && Array.isArray(node.marks)) {
        node.marks.forEach((mark: any, index: number) => {
          if (!mark.type || typeof mark.type !== 'string') {
            errors.push(`Invalid mark type at ${path}.marks[${index}]: must be a string`)
          }
        })
      }
    }

    validateNode(content)

    return errors
  }

  /**
   * Sanitize HTML content (for display purposes)
   */
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
      ALLOW_DATA_ATTR: false
    })
  }

  /**
   * Sanitize TipTap content by removing potentially dangerous attributes
   */
  static sanitizeTipTapContent(content: JSONContent): JSONContent {
    const sanitizeNode = (node: JSONContent): JSONContent => {
      const sanitized: JSONContent = {
        type: node.type
      }

      // Sanitize attributes
      if (node.attrs) {
        sanitized.attrs = this.sanitizeAttributes(node.attrs, node.type)
      }

      // Sanitize text content
      if (node.text) {
        sanitized.text = node.text
      }

      // Recursively sanitize child content
      if (node.content && Array.isArray(node.content)) {
        sanitized.content = node.content.map((child: JSONContent) => sanitizeNode(child))
      }

      // Sanitize marks
      if (node.marks && Array.isArray(node.marks)) {
        sanitized.marks = node.marks.map((mark: any) => ({
          type: mark.type,
          ...(mark.attrs && { attrs: this.sanitizeAttributes(mark.attrs, mark.type) })
        }))
      }

      return sanitized
    }

    return sanitizeNode(content)
  }

  /**
   * Sanitize node attributes based on node type
   */
  private static sanitizeAttributes(attrs: Record<string, any>, nodeType?: string): Record<string, any> {
    const sanitized: Record<string, any> = {}

    // Define allowed attributes per node type
    const allowedAttrs: Record<string, string[]> = {
      link: ['href', 'target', 'rel'],
      image: ['src', 'alt', 'title', 'width', 'height'],
      heading: ['level'],
      textStyle: ['color', 'fontSize', 'fontFamily'],
      default: ['class', 'id']
    }

    const allowed = allowedAttrs[nodeType || 'default'] || allowedAttrs.default

    Object.keys(attrs).forEach(key => {
      if (allowed.includes(key)) {
        // Additional sanitization for specific attributes
        if (key === 'href' && typeof attrs[key] === 'string') {
          // Only allow http, https, and mailto links
          const url = attrs[key]
          if (url.match(/^(https?:\/\/|mailto:)/)) {
            sanitized[key] = url
          }
        } else if (key === 'src' && typeof attrs[key] === 'string') {
          // Only allow http and https for images
          const url = attrs[key]
          if (url.match(/^https?:\/\//)) {
            sanitized[key] = url
          }
        } else if (key === 'target' && attrs[key] === '_blank') {
          sanitized[key] = '_blank'
          // Add rel="noopener noreferrer" for security
          sanitized.rel = 'noopener noreferrer'
        } else {
          sanitized[key] = attrs[key]
        }
      }
    })

    return sanitized
  }

  /**
   * Extract plain text from TipTap content for search/preview
   */
  static extractPlainText(content: JSONContent): string {
    const extractText = (node: JSONContent): string => {
      let text = ''

      if (node.text) {
        text += node.text
      }

      if (node.content && Array.isArray(node.content)) {
        text += node.content.map((child: JSONContent) => extractText(child)).join('')
      }

      return text
    }

    return extractText(content).trim()
  }

  /**
   * Generate content excerpt for previews
   */
  static generateExcerpt(content: JSONContent, maxLength = 150): string {
    const plainText = this.extractPlainText(content)
    
    if (plainText.length <= maxLength) {
      return plainText
    }

    // Find the last complete word within the limit
    const truncated = plainText.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + '...'
    }

    return truncated + '...'
  }
}