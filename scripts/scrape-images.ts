// scripts/scrape-images.ts
import * as cheerio from 'cheerio'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { ImageDownloader } from '../src/lib/image-downloader'

interface ImageInfo {
  url: string
  source: 'img-src' | 'img-data-src' | 'background-image' | 'link-href' | 'a-href'
  alt?: string
  filename?: string
}

/**
 * Scrape images from a URL and download them to a local folder
 * 
 * Usage:
 *   tsx scripts/scrape-images.ts <url> [output-folder]
 * 
 * Examples:
 *   tsx scripts/scrape-images.ts https://www.reinartdesign.be/werk ./scraped-images
 *   tsx scripts/scrape-images.ts https://www.reinartdesign.be ./images
 */

async function extractImages(html: string, baseUrl: string): Promise<ImageInfo[]> {
  const $ = cheerio.load(html)
  const images: ImageInfo[] = []
  const seenUrls = new Set<string>()

  // Helper to normalize URL
  function normalizeUrl(url: string): string {
    if (!url) return ''
    
    // Remove query parameters and fragments
    url = url.split('?')[0].split('#')[0]
    
    // Convert relative URLs to absolute
    if (url.startsWith('//')) {
      url = `https:${url}`
    } else if (url.startsWith('/')) {
      const base = new URL(baseUrl)
      url = `${base.origin}${url}`
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const base = new URL(baseUrl)
      url = `${base.origin}/${url}`
    }
    
    // Convert http to https
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://')
    }
    
    return url
  }

  // Helper to check if URL is an image
  function isImageUrl(url: string): boolean {
    if (!url) return false
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
    const lowerUrl = url.toLowerCase()
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('/wp-content/uploads/') ||
           lowerUrl.includes('/images/')
  }

  // Helper to add image if not seen
  function addImage(url: string, source: ImageInfo['source'], alt?: string) {
    const normalized = normalizeUrl(url)
    if (normalized && isImageUrl(normalized) && !seenUrls.has(normalized)) {
      seenUrls.add(normalized)
      images.push({ url: normalized, source, alt })
    }
  }

  // 1. Extract from <img src="...">
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src')
    const alt = $(el).attr('alt') || ''
    if (src) addImage(src, 'img-src', alt)
  })

  // 2. Extract from <img data-src="..."> (lazy loading)
  $('img[data-src]').each((_, el) => {
    const src = $(el).attr('data-src')
    const alt = $(el).attr('alt') || ''
    if (src) addImage(src, 'img-data-src', alt)
  })

  // 3. Extract from background-image in style attributes
  $('[style*="background-image"]').each((_, el) => {
    const style = $(el).attr('style')
    if (style) {
      const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i)
      if (match && match[1]) {
        addImage(match[1], 'background-image')
      }
    }
  })

  // 4. Extract from <link rel="image_src"> or similar
  $('link[rel*="image"], link[href*=".jpg"], link[href*=".png"], link[href*=".jpeg"]').each((_, el) => {
    const href = $(el).attr('href')
    if (href) addImage(href, 'link-href')
  })

  // 5. Extract from <a href="..."> pointing to images
  $('a[href*=".jpg"], a[href*=".png"], a[href*=".jpeg"], a[href*=".gif"], a[href*=".webp"]').each((_, el) => {
    const href = $(el).attr('href')
    if (href) addImage(href, 'a-href')
  })

  return images
}

async function downloadImage(
  imageInfo: ImageInfo,
  outputFolder: string,
  baseUrl: string
): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    // Generate filename from URL
    const urlPath = new URL(imageInfo.url).pathname
    const originalFilename = path.basename(urlPath) || 'image'
    
    // Clean filename (remove query params, etc.)
    let filename = originalFilename
      .replace(/[?&#].*$/, '') // Remove query params
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    
    // Ensure it has an extension
    if (!filename.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
      // Try to detect from URL or default to jpg
      const ext = urlPath.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)?.[1] || 'jpg'
      filename = `${filename}.${ext}`
    }
    
    // Make filename unique if it already exists
    let finalFilename = filename
    let counter = 1
    while (existsSync(path.join(outputFolder, finalFilename))) {
      const ext = path.extname(filename)
      const name = path.basename(filename, ext)
      finalFilename = `${name}_${counter}${ext}`
      counter++
    }
    
    const filePath = path.join(outputFolder, finalFilename)
    
    // Download image
    const buffer = await ImageDownloader.downloadImageWithRetry(imageInfo.url, 3, 1000)
    
    // Save to file
    await writeFile(filePath, buffer)
    
    // Save metadata (optional - for reference)
    const metadataPath = path.join(outputFolder, `${finalFilename}.json`)
    await writeFile(metadataPath, JSON.stringify({
      originalUrl: imageInfo.url,
      source: imageInfo.source,
      alt: imageInfo.alt,
      downloadedAt: new Date().toISOString()
    }, null, 2))
    
    return { success: true, filename: finalFilename }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function main() {
  const url = process.argv[2]
  const outputFolder = process.argv[3] || './scraped-images'
  
  if (!url) {
    console.error('❌ Please provide a URL to scrape')
    console.error('   Usage: tsx scripts/scrape-images.ts <url> [output-folder]')
    console.error('   Example: tsx scripts/scrape-images.ts https://www.reinartdesign.be/werk ./scraped-images')
    process.exit(1)
  }
  
  // Validate URL
  try {
    new URL(url)
  } catch {
    console.error(`❌ Invalid URL: ${url}`)
    process.exit(1)
  }
  
  console.log(`🕷️  Scraping images from: ${url}`)
  console.log(`📁 Output folder: ${outputFolder}\n`)
  
  try {
    // Create output folder
    if (!existsSync(outputFolder)) {
      await mkdir(outputFolder, { recursive: true })
      console.log(`✅ Created output folder: ${outputFolder}`)
    }
    
    // Fetch the page
    console.log('📥 Fetching page...')
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageScraper/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`)
    }
    
    const html = await response.text()
    console.log('✅ Page fetched successfully\n')
    
    // Extract image URLs
    console.log('🔍 Extracting image URLs...')
    const images = await extractImages(html, url)
    console.log(`✅ Found ${images.length} unique image(s)\n`)
    
    if (images.length === 0) {
      console.log('⚠️  No images found on the page')
      console.log('💾 Saving HTML for inspection...')
      await writeFile(path.join(outputFolder, 'page.html'), html)
      process.exit(0)
    }
    
    // Show summary
    console.log('📋 Image sources:')
    const sourceCounts = images.reduce((acc, img) => {
      acc[img.source] = (acc[img.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(sourceCounts).forEach(([source, count]) => {
      console.log(`   ${source}: ${count}`)
    })
    console.log()
    
    // Download images
    console.log('⬇️  Downloading images...\n')
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const progress = `[${i + 1}/${images.length}]`
      
      process.stdout.write(`${progress} Downloading: ${image.url.substring(0, 60)}... `)
      
      const result = await downloadImage(image, outputFolder, url)
      
      if (result.success) {
        console.log(`✅ ${result.filename}`)
        successCount++
      } else {
        console.log(`❌ Failed: ${result.error}`)
        errorCount++
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 Summary:')
    console.log(`   ✅ Successfully downloaded: ${successCount}`)
    console.log(`   ❌ Failed: ${errorCount}`)
    console.log(`   📁 Output folder: ${path.resolve(outputFolder)}`)
    console.log('='.repeat(60))
    
    // Save list of all URLs (for reference)
    const urlsList = images.map(img => ({
      url: img.url,
      source: img.source,
      alt: img.alt,
      downloaded: images.findIndex(i => i.url === img.url) < successCount
    }))
    
    await writeFile(
      path.join(outputFolder, 'urls.json'),
      JSON.stringify(urlsList, null, 2)
    )
    
    console.log('\n💾 Saved image URLs list to: urls.json')
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
