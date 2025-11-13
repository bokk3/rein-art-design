/**
 * Instagram Service
 * Handles all interactions with the Instagram Graph API
 */

import { prisma } from './db'
import { ImageDownloader } from './image-downloader'
import { ImageProcessor } from './image-processing'

const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com'

export interface InstagramMedia {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  timestamp: string
  thumbnail_url?: string
}

export interface InstagramMediaDetails extends InstagramMedia {
  username?: string
}

export interface InstagramPostData {
  instagramId: string
  imageUrl: string
  caption: string
  postedAt: Date
}

export interface SyncResult {
  success: boolean
  newPosts: number
  updatedPosts: number
  errors: string[]
  totalProcessed: number
}

export class InstagramService {
  /**
   * Get Instagram API credentials from environment variables
   */
  private static getCredentials() {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const userId = process.env.INSTAGRAM_USER_ID

    if (!accessToken) {
      throw new Error('INSTAGRAM_ACCESS_TOKEN is not set in environment variables')
    }

    if (!userId) {
      throw new Error('INSTAGRAM_USER_ID is not set in environment variables')
    }

    return { accessToken, userId }
  }

  /**
   * Fetch media from Instagram Graph API
   * @param accessToken Instagram access token
   * @param userId Instagram user ID
   * @param limit Maximum number of posts to fetch (default: 25)
   * @returns Promise<InstagramMedia[]> Array of media items
   */
  static async fetchMedia(
    accessToken: string,
    userId: string,
    limit: number = 25
  ): Promise<InstagramMedia[]> {
    try {
      const fields = [
        'id',
        'caption',
        'media_type',
        'media_url',
        'permalink',
        'timestamp',
        'thumbnail_url',
      ].join(',')

      const url = `${INSTAGRAM_GRAPH_API}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PortfolioCMS/1.0',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Instagram API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message || 'Unknown error'}`)
      }

      return data.data || []
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch Instagram media: ${error.message}`)
      }
      throw new Error('Failed to fetch Instagram media: Unknown error')
    }
  }

  /**
   * Fetch details for a specific media item
   * @param mediaId Instagram media ID
   * @param accessToken Instagram access token
   * @returns Promise<InstagramMediaDetails> Media details
   */
  static async fetchMediaDetails(
    mediaId: string,
    accessToken: string
  ): Promise<InstagramMediaDetails> {
    try {
      const fields = [
        'id',
        'caption',
        'media_type',
        'media_url',
        'permalink',
        'timestamp',
        'thumbnail_url',
        'username',
      ].join(',')

      const url = `${INSTAGRAM_GRAPH_API}/${mediaId}?fields=${fields}&access_token=${accessToken}`

      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Instagram API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Instagram API error: ${data.error.message || 'Unknown error'}`)
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch media details: ${error.message}`)
      }
      throw new Error('Failed to fetch media details: Unknown error')
    }
  }

  /**
   * Get all stored Instagram post IDs from database
   * @returns Promise<string[]> Array of Instagram post IDs
   */
  static async getStoredPostIds(): Promise<string[]> {
    const posts = await prisma.instagramPost.findMany({
      select: {
        instagramId: true,
      },
    })

    return posts.map((post) => post.instagramId)
  }

  /**
   * Download and process an image from Instagram
   * @param imageUrl URL of the image to download
   * @param altText Alt text for the image
   * @returns Promise with originalUrl and thumbnailUrl
   */
  static async processInstagramImage(
    imageUrl: string,
    altText: string
  ): Promise<{ originalUrl: string; thumbnailUrl: string }> {
    try {
      // Download image
      const imageBuffer = await ImageDownloader.downloadImageWithRetry(imageUrl)

      // Process image using existing ImageProcessor
      const processed = await ImageProcessor.processImage(
        imageBuffer,
        `instagram-${Date.now()}.jpg`,
        {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 92,
          format: 'jpeg',
        }
      )

      return {
        originalUrl: processed.originalUrl,
        thumbnailUrl: processed.thumbnailUrl,
      }
    } catch (error) {
      console.error(`Failed to process Instagram image ${imageUrl}:`, error)
      throw error
    }
  }

  /**
   * Store an Instagram post in the database
   * @param postData Post data to store
   * @returns Promise<InstagramPost> Created post
   */
  static async storePost(postData: InstagramPostData) {
    try {
      // Check if post already exists
      const existing = await prisma.instagramPost.findUnique({
        where: {
          instagramId: postData.instagramId,
        },
      })

      if (existing) {
        // Update existing post
        return await prisma.instagramPost.update({
          where: {
            instagramId: postData.instagramId,
          },
          data: {
            imageUrl: postData.imageUrl,
            caption: postData.caption,
            postedAt: postData.postedAt,
            syncedAt: new Date(),
            isActive: true,
          },
        })
      }

      // Create new post
      return await prisma.instagramPost.create({
        data: {
          instagramId: postData.instagramId,
          imageUrl: postData.imageUrl,
          caption: postData.caption,
          postedAt: postData.postedAt,
          syncedAt: new Date(),
          isActive: true,
        },
      })
    } catch (error) {
      console.error('Failed to store Instagram post:', error)
      throw error
    }
  }

  /**
   * Sync Instagram feed - fetch new posts and store them
   * @param autoCreateProjects Whether to automatically create projects from new posts
   * @returns Promise<SyncResult> Sync results
   */
  static async syncFeed(autoCreateProjects: boolean = false): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      newPosts: 0,
      updatedPosts: 0,
      errors: [],
      totalProcessed: 0,
    }

    try {
      const { accessToken, userId } = this.getCredentials()

      // Check if sync is enabled
      const syncEnabled = process.env.INSTAGRAM_SYNC_ENABLED !== 'false'
      if (!syncEnabled) {
        result.errors.push('Instagram sync is disabled in environment variables')
        result.success = false
        return result
      }

      // Fetch media from Instagram
      console.log('Fetching Instagram media...')
      const media = await this.fetchMedia(accessToken, userId, 25)

      // Get existing post IDs
      const existingIds = await this.getStoredPostIds()

      // Process each media item
      for (const item of media) {
        result.totalProcessed++

        try {
          // Skip videos and carousels for now (only process single images)
          if (item.media_type !== 'IMAGE') {
            console.log(`Skipping ${item.media_type} post: ${item.id}`)
            continue
          }

          const isNew = !existingIds.includes(item.id)

          // Prepare post data
          const postData: InstagramPostData = {
            instagramId: item.id,
            imageUrl: item.media_url,
            caption: item.caption || '',
            postedAt: new Date(item.timestamp),
          }

          // Store post
          const storedPost = await this.storePost(postData)

          if (isNew) {
            result.newPosts++
            console.log(`New post stored: ${item.id}`)

            // If auto-create is enabled, convert to project
            if (autoCreateProjects) {
              try {
                const { InstagramProjectConverter } = await import('./instagram-project-converter')
                await InstagramProjectConverter.convertPostToProject(storedPost)
                console.log(`Auto-converted post ${item.id} to project`)
              } catch (convertError) {
                console.error(`Failed to auto-convert post ${item.id}:`, convertError)
                result.errors.push(`Failed to auto-convert post ${item.id}: ${convertError instanceof Error ? convertError.message : 'Unknown error'}`)
              }
            }
          } else {
            result.updatedPosts++
            console.log(`Post updated: ${item.id}`)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.error(`Error processing post ${item.id}:`, errorMessage)
          result.errors.push(`Post ${item.id}: ${errorMessage}`)
        }
      }

      console.log(`Sync completed: ${result.newPosts} new, ${result.updatedPosts} updated, ${result.errors.length} errors`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Instagram sync failed:', errorMessage)
      result.success = false
      result.errors.push(`Sync failed: ${errorMessage}`)
    }

    return result
  }

  /**
   * Refresh Instagram access token
   * Note: This requires a long-lived token setup
   * @returns Promise<string> New access token
   */
  static async refreshAccessToken(): Promise<string> {
    try {
      const { accessToken } = this.getCredentials()
      const appSecret = process.env.INSTAGRAM_APP_SECRET

      if (!appSecret) {
        throw new Error('INSTAGRAM_APP_SECRET is not set in environment variables')
      }

      const url = `${INSTAGRAM_GRAPH_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`

      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Token refresh failed: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Token refresh error: ${data.error.message || 'Unknown error'}`)
      }

      return data.access_token
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to refresh access token: ${error.message}`)
      }
      throw new Error('Failed to refresh access token: Unknown error')
    }
  }
}

