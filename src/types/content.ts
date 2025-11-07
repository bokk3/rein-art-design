import { ContentPage, ContentPageTranslation, Language } from '@prisma/client'
// TipTap JSONContent type definition
export interface JSONContent {
  type?: string
  attrs?: Record<string, any>
  content?: JSONContent[]
  marks?: {
    type: string
    attrs?: Record<string, any>
  }[]
  text?: string
}

export interface ContentPageWithTranslations extends ContentPage {
  translations: (ContentPageTranslation & {
    language: Language
  })[]
}

export interface ContentPageFormData {
  slug: string
  published: boolean
  translations: ContentTranslationFormData[]
}

export interface ContentTranslationFormData {
  languageId: string
  title: string
  content: JSONContent
}

export interface ContentPageListItem {
  id: string
  slug: string
  published: boolean
  updatedAt: Date
  translations: {
    languageId: string
    languageCode: string
    languageName: string
    title: string
    excerpt: string
  }[]
}

export interface ContentPagePreview {
  id: string
  slug: string
  published: boolean
  translation: {
    title: string
    content: JSONContent
    language: {
      code: string
      name: string
    }
  } | null
}

export interface ContentSearchResult {
  id: string
  slug: string
  title: string
  excerpt: string
  languageCode: string
  updatedAt: Date
}

export interface ContentPageHistory {
  id: string
  pageId: string
  version: number
  data: JSONContent
  createdAt: Date
  createdBy: string
}

export interface ContentValidationResult {
  isValid: boolean
  errors: {
    field: string
    message: string
  }[]
}

export interface ContentPageFilters {
  published?: boolean
  languageCode?: string
  search?: string
  sortBy?: 'updatedAt' | 'title' | 'slug'
  sortOrder?: 'asc' | 'desc'
}

export interface ContentPageStats {
  total: number
  published: number
  unpublished: number
  byLanguage: Record<string, number>
}

// TipTap editor configuration types
export interface EditorConfig {
  placeholder?: string
  editable?: boolean
  content?: JSONContent
  onUpdate?: (content: JSONContent) => void
  onFocus?: () => void
  onBlur?: () => void
}

export interface EditorToolbarConfig {
  showHeadings?: boolean
  showFormatting?: boolean
  showLists?: boolean
  showLinks?: boolean
  showImages?: boolean
  showCode?: boolean
}

// Content management permissions
export type ContentPermission = 
  | 'content:view'
  | 'content:create'
  | 'content:edit'
  | 'content:delete'
  | 'content:publish'
  | 'content:manage_all'

export interface ContentUserPermissions {
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canPublish: boolean
  canManageAll: boolean
}