import { prisma } from '../src/lib/db'

async function addProjectImages() {
  try {
    console.log('🖼️ Adding placeholder images to projects...')

    // Get all projects
    const projects = await prisma.project.findMany({
      include: {
        translations: true,
        images: true
      }
    })

    // Sample placeholder images - black & white style, no faces, artisan aesthetic
    // Using Unsplash with grayscale filter for monochrome black/white aesthetic
    // Focused on textures, materials, patterns, and abstract designs
    const placeholderImages = [
      {
        originalUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=600&fit=crop&q=80&grayscale',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop&q=80&grayscale',
        alt: 'Wood grain texture detail'
      },
      {
        originalUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80&grayscale',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&q=80&grayscale',
        alt: 'Textured surface pattern'
      },
      {
        originalUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&q=80&grayscale',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&q=80&grayscale',
        alt: 'Minimalist geometric pattern'
      },
      {
        originalUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=600&fit=crop&q=80&grayscale',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop&q=80&grayscale',
        alt: 'Architectural texture detail'
      },
      {
        originalUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&h=600&fit=crop&q=80&grayscale',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&q=80&grayscale',
        alt: 'Metal surface texture'
      },
      {
        originalUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&q=80&grayscale',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&q=80&grayscale',
        alt: 'Abstract material texture'
      }
    ]

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i]
      
      // Delete existing images if any (to replace with new ones)
      if (project.images.length > 0) {
        await prisma.projectImage.deleteMany({
          where: { projectId: project.id }
        })
        console.log(`🔄 Replaced ${project.images.length} existing image(s) for: ${project.translations[0]?.title}`)
      }

      // Add placeholder image
      const imageData = placeholderImages[i % placeholderImages.length]
      
      await prisma.projectImage.create({
        data: {
          projectId: project.id,
          originalUrl: imageData.originalUrl,
          thumbnailUrl: imageData.thumbnailUrl,
          alt: imageData.alt,
          order: 0
        }
      })

      console.log(`✅ Added image to: ${project.translations[0]?.title}`)
    }

    console.log('🎉 Project images added successfully!')
    console.log('📝 Note: These are placeholder images from Unsplash. Replace with actual project photos.')
    
  } catch (error) {
    console.error('❌ Error adding project images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addProjectImages()