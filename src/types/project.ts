import { Prisma } from '@prisma/client'

// Full project with all relations
export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    translations: {
      include: {
        language: true
      }
    }
    images: true
    contentType: true
    creator: {
      select: {
        id: true
        name: true
        email: true
      }
    }
  }
}>

// Project translation with language
export type ProjectTranslationWithLanguage = Prisma.ProjectTranslationGetPayload<{
  include: {
    language: true
  }
}>

// Project image type
export type ProjectImage = Prisma.ProjectImageGetPayload<{}>

// Content type
export type ContentType = Prisma.ContentTypeGetPayload<{}>

// Language type
export type Language = Prisma.LanguageGetPayload<{}>

// User creator info
export type ProjectCreator = {
  id: string
  name: string
  email: string
}

// Form data types for API
export interface CreateProjectRequest {
  contentTypeId: string
  featured?: boolean
  published?: boolean
  translations: {
    languageId: string
    title: string
    description: any // TipTap JSON
    materials: string[]
  }[]
  images?: {
    originalUrl: string
    thumbnailUrl: string
    alt: string
    order?: number
  }[]
}

export interface UpdateProjectRequest {
  contentTypeId?: string
  featured?: boolean
  published?: boolean
  translations?: {
    languageId: string
    title: string
    description: any // TipTap JSON
    materials: string[]
  }[]
  images?: {
    id?: string
    originalUrl: string
    thumbnailUrl: string
    alt: string
    order?: number
  }[]
}

export interface ProjectListFilters {
  published?: boolean
  featured?: boolean
  contentTypeId?: string
  languageId?: string
  search?: string
  page?: number
  limit?: number
}

// API Response types
export interface ProjectListResponse {
  projects: ProjectWithRelations[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProjectResponse {
  project: ProjectWithRelations
}

export interface ProjectDeleteResponse {
  success: boolean
  message: string
}