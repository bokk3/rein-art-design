import { prisma } from './db'
import { Prisma } from '@prisma/client'

export interface CreateProjectData {
  contentTypeId: string
  featured?: boolean
  published?: boolean
  createdBy: string
  translations: {
    languageId: string
    title: string
    description: any // TipTap JSON content
    materials: string[]
  }[]
  images?: {
    originalUrl: string
    thumbnailUrl: string
    alt: string
    order?: number
  }[]
}

export interface UpdateProjectData {
  contentTypeId?: string
  featured?: boolean
  published?: boolean
  translations?: {
    languageId: string
    title: string
    description: any // TipTap JSON content
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

export interface ProjectFilters {
  published?: boolean
  featured?: boolean
  contentTypeId?: string
  languageId?: string
  search?: string
}

// Include relations for full project data
const projectInclude = {
  translations: {
    include: {
      language: true
    }
  },
  images: {
    orderBy: {
      order: 'asc' as const
    }
  },
  contentType: true,
  creator: {
    select: {
      id: true,
      name: true,
      email: true
    }
  }
}

export class ProjectService {
  /**
   * Get all projects with optional filtering
   */
  static async getProjects(filters: ProjectFilters = {}) {
    const where: Prisma.ProjectWhereInput = {}

    if (filters.published !== undefined) {
      where.published = filters.published
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured
    }

    if (filters.contentTypeId) {
      where.contentTypeId = filters.contentTypeId
    }

    if (filters.search) {
      where.translations = {
        some: {
          OR: [
            {
              title: {
                contains: filters.search,
                mode: 'insensitive'
              }
            },
            {
              materials: {
                hasSome: [filters.search]
              }
            }
          ]
        }
      }
    }

    if (filters.languageId) {
      where.translations = {
        some: {
          languageId: filters.languageId
        }
      }
    }

    return await prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  /**
   * Get a single project by ID
   */
  static async getProjectById(id: string) {
    return await prisma.project.findUnique({
      where: { id },
      include: projectInclude
    })
  }

  /**
   * Create a new project with translations and images
   */
  static async createProject(data: CreateProjectData) {
    return await prisma.project.create({
      data: {
        contentTypeId: data.contentTypeId,
        featured: data.featured ?? false,
        published: data.published ?? true,
        createdBy: data.createdBy,
        translations: {
          create: data.translations
        },
        images: data.images ? {
          create: data.images
        } : undefined
      },
      include: projectInclude
    })
  }

  /**
   * Update an existing project
   */
  static async updateProject(id: string, data: UpdateProjectData) {
    // Start a transaction to handle translations and images updates
    return await prisma.$transaction(async (tx) => {
      // Update basic project data
      const project = await tx.project.update({
        where: { id },
        data: {
          contentTypeId: data.contentTypeId,
          featured: data.featured,
          published: data.published
        }
      })

      // Handle translations update
      if (data.translations) {
        // Delete existing translations
        await tx.projectTranslation.deleteMany({
          where: { projectId: id }
        })

        // Create new translations
        await tx.projectTranslation.createMany({
          data: data.translations.map(translation => ({
            projectId: id,
            ...translation
          }))
        })
      }

      // Handle images update
      if (data.images) {
        // Delete existing images
        await tx.projectImage.deleteMany({
          where: { projectId: id }
        })

        // Create new images
        await tx.projectImage.createMany({
          data: data.images.map(image => ({
            projectId: id,
            originalUrl: image.originalUrl,
            thumbnailUrl: image.thumbnailUrl,
            alt: image.alt,
            order: image.order ?? 0
          }))
        })
      }

      // Return updated project with relations
      return await tx.project.findUnique({
        where: { id },
        include: projectInclude
      })
    })
  }

  /**
   * Delete a project and all related data
   */
  static async deleteProject(id: string) {
    return await prisma.project.delete({
      where: { id },
      include: projectInclude
    })
  }

  /**
   * Get published projects for public display
   */
  static async getPublishedProjects(languageId?: string) {
    return await this.getProjects({
      published: true,
      languageId
    })
  }

  /**
   * Get featured projects
   */
  static async getFeaturedProjects(languageId?: string) {
    return await this.getProjects({
      published: true,
      featured: true,
      languageId
    })
  }

  /**
   * Toggle project featured status
   */
  static async toggleFeatured(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { featured: true }
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return await prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
      include: projectInclude
    })
  }

  /**
   * Toggle project published status
   */
  static async togglePublished(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { published: true }
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return await prisma.project.update({
      where: { id },
      data: { published: !project.published },
      include: projectInclude
    })
  }
}