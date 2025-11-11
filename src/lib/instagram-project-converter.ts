/**
 * Instagram to Project Converter
 * Converts Instagram posts to Project entries
 */

import { prisma } from './db'
import { ProjectService, CreateProjectData } from './project-service'
import { InstagramService } from './instagram-service'
import { InstagramPost } from '@prisma/client'

export class InstagramProjectConverter {
  /**
   * Get system user ID from environment or find admin user
   */
  private static async getSystemUserId(): Promise<string> {
    // Try environment variable first
    const envUserId = process.env.INSTAGRAM_SYSTEM_USER_ID
    if (envUserId) {
      return envUserId
    }

    // Fallback: find first admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        userRole: {
          role: 'admin',
        },
      },
    })

    if (!adminUser) {
      throw new Error('No admin user found. Set INSTAGRAM_SYSTEM_USER_ID in environment variables.')
    }

    return adminUser.id
  }

  /**
   * Get default language ID
   */
  private static async getDefaultLanguageId(): Promise<string> {
    const defaultLanguage = await prisma.language.findFirst({
      where: {
        isDefault: true,
        isActive: true,
      },
    })

    if (!defaultLanguage) {
      throw new Error('No default language found in database')
    }

    return defaultLanguage.id
  }

  /**
   * Get projects content type ID
   */
  private static async getProjectsContentTypeId(): Promise<string> {
    const contentType = await prisma.contentType.findFirst({
      where: {
        name: 'projects',
        isActive: true,
      },
    })

    if (!contentType) {
      throw new Error('Projects content type not found in database')
    }

    return contentType.id
  }

  /**
   * Extract title from Instagram caption
   * Uses first line or first 50 characters
   */
  static extractTitleFromCaption(caption: string): string {
    if (!caption || caption.trim().length === 0) {
      return 'Instagram Post'
    }

    // Try to get first line
    const firstLine = caption.split('\n')[0].trim()

    // If first line is too long, truncate to 50 chars
    if (firstLine.length > 50) {
      return firstLine.substring(0, 47) + '...'
    }

    // If first line is empty, use first 50 chars of caption
    if (firstLine.length === 0) {
      const truncated = caption.trim().substring(0, 50)
      return truncated.length < caption.trim().length ? truncated + '...' : truncated
    }

    return firstLine
  }

  /**
   * Extract materials (hashtags) from Instagram caption
   */
  static extractMaterialsFromCaption(caption: string): string[] {
    if (!caption) {
      return []
    }

    // Extract hashtags (words starting with #)
    const hashtagRegex = /#(\w+)/g
    const matches = caption.match(hashtagRegex)

    if (!matches) {
      return []
    }

    // Remove # and return unique values
    const materials = matches
      .map((tag) => tag.substring(1))
      .filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates

    return materials
  }

  /**
   * Convert Instagram caption to TipTap JSON format
   */
  static convertCaptionToTipTap(caption: string): any {
    if (!caption || caption.trim().length === 0) {
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      }
    }

    // Split caption into paragraphs (by newlines)
    const lines = caption.split('\n').filter((line) => line.trim().length > 0)

    if (lines.length === 0) {
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      }
    }

    // Convert each line to a paragraph
    const paragraphs = lines.map((line) => ({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: line.trim(),
        },
      ],
    }))

    return {
      type: 'doc',
      content: paragraphs,
    }
  }


  /**
   * Convert an Instagram post to a Project
   * @param post Instagram post to convert
   * @param published Whether to publish the project (default: false)
   * @returns Created Project
   */
  static async convertPostToProject(
    post: InstagramPost,
    published: boolean = false
  ): Promise<any> {
    try {
      // Check if post is already converted
      if (post.projectId) {
        const existingProject = await prisma.project.findUnique({
          where: { id: post.projectId },
        })

        if (existingProject) {
          console.log(`Post ${post.instagramId} already converted to project ${post.projectId}`)
          return existingProject
        }
      }

      // Get required IDs
      const [contentTypeId, languageId, createdBy] = await Promise.all([
        this.getProjectsContentTypeId(),
        this.getDefaultLanguageId(),
        this.getSystemUserId(),
      ])

      // Extract data from caption
      const title = this.extractTitleFromCaption(post.caption)
      const materials = this.extractMaterialsFromCaption(post.caption)
      const description = this.convertCaptionToTipTap(post.caption)

      // Process image
      console.log(`Processing image for post ${post.instagramId}...`)
      const imageData = await InstagramService.processInstagramImage(
        post.imageUrl,
        title || 'Instagram Post Image'
      )

      // Prepare project data
      const projectData: CreateProjectData = {
        contentTypeId,
        published,
        featured: false,
        createdBy,
        translations: [
          {
            languageId,
            title,
            description,
            materials,
          },
        ],
        images: [
          {
            originalUrl: imageData.originalUrl,
            thumbnailUrl: imageData.thumbnailUrl,
            alt: title || 'Instagram Post Image',
            order: 0,
          },
        ],
      }

      // Create project
      console.log(`Creating project from Instagram post ${post.instagramId}...`)
      const project = await ProjectService.createProject(projectData)

      // Link Instagram post to project
      await prisma.instagramPost.update({
        where: { id: post.id },
        data: { projectId: project.id },
      })

      console.log(`✅ Successfully converted post ${post.instagramId} to project ${project.id}`)

      return project
    } catch (error) {
      console.error(`Failed to convert Instagram post ${post.instagramId} to project:`, error)
      throw error
    }
  }

  /**
   * Convert multiple Instagram posts to projects
   * @param posts Array of Instagram posts to convert
   * @param published Whether to publish the projects (default: false)
   * @returns Array of created projects
   */
  static async convertPostsToProjects(
    posts: InstagramPost[],
    published: boolean = false
  ): Promise<any[]> {
    const results: any[] = []
    const errors: string[] = []

    for (const post of posts) {
      try {
        const project = await this.convertPostToProject(post, published)
        results.push(project)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Error converting post ${post.instagramId}:`, errorMessage)
        errors.push(`Post ${post.instagramId}: ${errorMessage}`)
      }
    }

    if (errors.length > 0) {
      console.warn(`Some conversions failed: ${errors.join(', ')}`)
    }

    return results
  }
}

