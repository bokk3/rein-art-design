/**
 * Image Downloader Utility
 * Downloads images from URLs and converts them to Buffer format
 */

export class ImageDownloader {
  /**
   * Download an image from a URL and return it as a Buffer
   * @param url The image URL to download
   * @returns Promise<Buffer> The image data as a Buffer
   * @throws Error if download fails
   */
  static async downloadImage(url: string): Promise<Buffer> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PortfolioCMS/1.0)',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Image download failed: ${error.message}`)
      }
      throw new Error('Image download failed: Unknown error')
    }
  }

  /**
   * Download an image with retry logic
   * @param url The image URL to download
   * @param maxRetries Maximum number of retry attempts (default: 3)
   * @param retryDelay Delay between retries in milliseconds (default: 1000)
   * @returns Promise<Buffer> The image data as a Buffer
   * @throws Error if all retries fail
   */
  static async downloadImageWithRetry(
    url: string,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<Buffer> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.downloadImage(url)
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (attempt < maxRetries) {
          // Exponential backoff: delay increases with each retry
          const delay = retryDelay * Math.pow(2, attempt - 1)
          console.warn(
            `Image download attempt ${attempt} failed for ${url}, retrying in ${delay}ms...`
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw new Error(
      `Failed to download image after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
    )
  }

  /**
   * Validate that a URL points to an image
   * @param url The URL to validate
   * @returns boolean True if URL appears to be an image
   */
  static isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname.toLowerCase()
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
      return imageExtensions.some((ext) => pathname.endsWith(ext))
    } catch {
      return false
    }
  }
}

