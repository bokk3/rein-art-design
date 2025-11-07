import { prisma } from '../src/lib/db'
import * as cheerio from 'cheerio'

interface ScrapedProject {
  title: string
  description?: string
  images: string[]
  materials?: string[]
}

async function scrapeProjects() {
  try {
    console.log('🕷️  Scraping projects from https://www.reinartdesign.be/werk...')
    
    // Fetch the page
    const response = await fetch('https://www.reinartdesign.be/werk')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`)
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    console.log('✅ Page fetched successfully')
    
    // Get the default language and content type
    const defaultLanguage = await prisma.language.findFirst({
      where: { isDefault: true }
    })
    
    const contentType = await prisma.contentType.findFirst({
      where: { name: 'projects' }
    })
    
    if (!defaultLanguage || !contentType) {
      console.error('❌ Default language or content type not found')
      return
    }
    
    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { 
        userRole: { 
          role: 'admin' 
        } 
      }
    })
    
    if (!adminUser) {
      console.error('❌ Admin user not found')
      return
    }
    
    const scrapedProjects: ScrapedProject[] = []
    
    console.log('\n📋 Analyzing page structure...')
    
    // Find all project rows - each vce-row-container represents a project
    const projectRows = $('.vce-row-container')
    
    if (projectRows.length === 0) {
      console.log('\n⚠️  Could not find project rows (.vce-row-container)')
      const fs = await import('fs/promises')
      await fs.writeFile('scraped-page.html', html)
      console.log('💾 Saved HTML to scraped-page.html for inspection')
      return
    }
    
    console.log(`✅ Found ${projectRows.length} project row(s)\n`)
    
    // Extract projects from each row
    projectRows.each((index, rowElement) => {
      const $row = $(rowElement)
      
      // Find text block with title and description
      const $textBlock = $row.find('.vce-text-block')
      
      if ($textBlock.length === 0) {
        console.log(`⚠️  Row ${index + 1}: No text block found, skipping`)
        return
      }
      
      // Extract title from h1
      const title = $textBlock.find('h1').first().text().trim().replace(/\s+/g, ' ')
      
      if (!title) {
        console.log(`⚠️  Row ${index + 1}: No title found, skipping`)
        return
      }
      
      // Extract description from h6 tags (excluding those with dimensions)
      const descriptionParts: string[] = []
      const materials: string[] = []
      
      $textBlock.find('h6').each((_, h6Element) => {
        const text = $(h6Element).text().trim()
        if (!text) return
        
        // Check if it contains dimensions (Ø symbol or cm)
        if (text.includes('Ø') || text.includes('cm') || text.match(/\d+x\d+x\d+/)) {
          // This is a dimension/spec, add to materials
          materials.push(text)
        } else {
          // This is description text
          descriptionParts.push(text)
        }
      })
      
      const description = descriptionParts.join(' ').trim() || undefined
      
      // Extract images from two sources:
      // 1. Slider images (background-image in style attribute)
      const images: string[] = []
      
      $row.find('.vce-simple-image-slider-item').each((_, sliderItem) => {
        const style = $(sliderItem).find('div[style*="background-image"]').attr('style')
        if (style) {
          const match = style.match(/background-image:url\(([^)]+)\)/)
          if (match && match[1]) {
            let imageUrl = match[1].trim()
            // Remove quotes if present
            imageUrl = imageUrl.replace(/^["']|["']$/g, '')
            // Convert to https if needed
            if (imageUrl.startsWith('http://')) {
              imageUrl = imageUrl.replace('http://', 'https://')
            }
            if (imageUrl && !images.includes(imageUrl)) {
              images.push(imageUrl)
            }
          }
        }
      })
      
      // 2. Gallery images (img src)
      $row.find('.vce-image-masonry-gallery-item img').each((_, img) => {
        let src = $(img).attr('src')
        if (src) {
          // Convert to https if needed
          if (src.startsWith('http://')) {
            src = src.replace('http://', 'https://')
          }
          // Convert relative URLs to absolute
          if (!src.startsWith('http')) {
            src = `https://www.reinartdesign.be${src.startsWith('/') ? src : '/' + src}`
          }
          if (src && !images.includes(src)) {
            images.push(src)
          }
        }
      })
      
      // Also check for href in gallery links (full-size images)
      $row.find('.vce-image-masonry-gallery-item[href]').each((_, link) => {
        let href = $(link).attr('href')
        if (href) {
          // Convert to https if needed
          if (href.startsWith('http://')) {
            href = href.replace('http://', 'https://')
          }
          // Convert relative URLs to absolute
          if (!href.startsWith('http')) {
            href = `https://www.reinartdesign.be${href.startsWith('/') ? href : '/' + href}`
          }
          if (href && !images.includes(href)) {
            images.push(href)
          }
        }
      })
      
      scrapedProjects.push({
        title,
        description,
        images,
        materials: materials.length > 0 ? materials : undefined
      })
      
      console.log(`📦 Found project: ${title}`)
      if (description) {
        console.log(`   Description: ${description.substring(0, 80)}${description.length > 80 ? '...' : ''}`)
      }
      if (images.length > 0) {
        console.log(`   Images: ${images.length}`)
      }
      if (materials.length > 0) {
        console.log(`   Materials/Specs: ${materials.length} item(s)`)
      }
      console.log('')
    })
    
    if (scrapedProjects.length === 0) {
      console.log('\n⚠️  No projects found. The HTML structure might be different.')
      console.log('💾 Saving HTML to scraped-page.html for manual inspection...')
      const fs = await import('fs/promises')
      await fs.writeFile('scraped-page.html', html)
      return
    }
    
    console.log(`\n✅ Scraped ${scrapedProjects.length} projects`)
    console.log('\n💾 Creating projects in database...\n')
    
    // Create projects in database
    for (const projectData of scrapedProjects) {
      try {
        // Combine description and materials/specs
        let fullDescription = projectData.description || ''
        if (projectData.materials && projectData.materials.length > 0) {
          if (fullDescription) {
            fullDescription += '\n\n'
          }
          fullDescription += projectData.materials.join('\n')
        }
        
        // Convert description to TipTap JSON format
        const descriptionJson = fullDescription ? {
          type: 'doc',
          content: fullDescription.split('\n\n').map(paragraph => ({
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: paragraph.trim()
              }
            ]
          })).filter(p => p.content[0].text)
        } : {
          type: 'doc',
          content: []
        }
        
        const project = await prisma.project.create({
          data: {
            contentTypeId: contentType.id,
            featured: false,
            published: true,
            createdBy: adminUser.id,
            translations: {
              create: {
                languageId: defaultLanguage.id,
                title: projectData.title,
                description: descriptionJson,
                materials: projectData.materials || [] // Dimensions and specs are stored here
              }
            },
            images: projectData.images.length > 0 ? {
              create: projectData.images.map((imageUrl, idx) => ({
                originalUrl: imageUrl,
                thumbnailUrl: imageUrl, // Will be processed later if needed
                alt: projectData.title,
                order: idx
              }))
            } : undefined
          }
        })
        
        console.log(`✅ Created project: ${projectData.title}`)
        if (projectData.images.length > 0) {
          console.log(`   📷 ${projectData.images.length} image(s) added`)
        }
      } catch (error: any) {
        console.error(`❌ Error creating project "${projectData.title}":`, error.message)
      }
    }
    
    console.log('\n🎉 Scraping completed!')
    console.log(`📊 Created ${scrapedProjects.length} project(s) in the database`)
    
  } catch (error: any) {
    console.error('❌ Error scraping projects:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

scrapeProjects()

