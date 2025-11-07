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
    
    // Try to find project containers - adjust selectors based on actual HTML structure
    // Common patterns to look for:
    // - Article tags
    // - Divs with class names containing "project", "werk", "item", "card", "gallery"
    // - List items
    
    // First, let's log the HTML structure to help identify the right selectors
    console.log('\n📋 Analyzing page structure...')
    
    // Try multiple common selectors
    const possibleSelectors = [
      'article',
      '[class*="project"]',
      '[class*="werk"]',
      '[class*="item"]',
      '[class*="card"]',
      '[class*="gallery"]',
      '.project',
      '.werk',
      '.portfolio-item',
      '.gallery-item'
    ]
    
    let projectElements: cheerio.Cheerio<cheerio.Element> | null = null
    let usedSelector = ''
    
    for (const selector of possibleSelectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        projectElements = elements
        usedSelector = selector
        console.log(`✅ Found ${elements.length} elements using selector: ${selector}`)
        break
      }
    }
    
    if (!projectElements || projectElements.length === 0) {
      console.log('\n⚠️  Could not automatically detect project structure.')
      console.log('📝 Please inspect the HTML and update the selectors in the script.')
      console.log('\n💡 Common HTML structure to look for:')
      console.log('   - Project containers (article, div, li)')
      console.log('   - Title elements (h1, h2, h3, .title, .name)')
      console.log('   - Image elements (img, picture)')
      console.log('   - Description elements (p, .description, .text)')
      
      // Save HTML to file for inspection
      const fs = await import('fs/promises')
      await fs.writeFile('scraped-page.html', html)
      console.log('\n💾 Saved HTML to scraped-page.html for inspection')
      return
    }
    
    console.log(`\n🔍 Extracting projects using selector: ${usedSelector}\n`)
    
    // Extract projects
    projectElements.each((index, element) => {
      const $element = $(element)
      
      // Try to find title - common patterns
      const title = 
        $element.find('h1, h2, h3, h4, .title, .name, [class*="title"], [class*="name"]').first().text().trim() ||
        $element.find('a').first().text().trim() ||
        $element.attr('title') ||
        $element.attr('data-title') ||
        `Project ${index + 1}`
      
      // Try to find description
      const description = 
        $element.find('p, .description, .text, [class*="description"], [class*="text"]').first().text().trim() ||
        $element.find('p').first().text().trim() ||
        ''
      
      // Find images
      const images: string[] = []
      $element.find('img, picture img').each((_, img) => {
        const src = $(img).attr('src') || $(img).attr('data-src') || $(img).attr('data-lazy-src')
        if (src) {
          // Convert relative URLs to absolute
          const imageUrl = src.startsWith('http') ? src : `https://www.reinartdesign.be${src.startsWith('/') ? src : '/' + src}`
          images.push(imageUrl)
        }
      })
      
      // Try to find materials (might be in description or separate elements)
      const materials: string[] = []
      $element.find('[class*="material"], [class*="materiaal"]').each((_, el) => {
        const material = $(el).text().trim()
        if (material) materials.push(material)
      })
      
      if (title && title !== `Project ${index + 1}`) {
        scrapedProjects.push({
          title,
          description: description || undefined,
          images,
          materials: materials.length > 0 ? materials : undefined
        })
        
        console.log(`📦 Found project: ${title}`)
        if (images.length > 0) console.log(`   Images: ${images.length}`)
        if (description) console.log(`   Description: ${description.substring(0, 50)}...`)
      }
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
        // Convert description to TipTap JSON format
        const descriptionJson = projectData.description ? {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: projectData.description
                }
              ]
            }
          ]
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
                materials: projectData.materials || []
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

