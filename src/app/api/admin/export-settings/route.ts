import { NextRequest, NextResponse } from 'next/server'
import { requireEditor, AuthError } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'
import archiver from 'archiver'
import fs from 'fs'
import path from 'path'

/**
 * Convert archiver to Web ReadableStream
 */
function archiverToWebStream(archive: archiver.Archiver): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      archive.on('data', (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk))
      })

      archive.on('end', () => {
        controller.close()
      })

      archive.on('error', (err: Error) => {
        controller.error(err)
      })
    },
    cancel() {
      archive.abort()
    }
  })
}

/**
 * GET /api/admin/export-settings - Export all settings, page builder data, and images as ZIP
 */
export async function GET(request: NextRequest) {
  try {
    await requireEditor(request)

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    })

    // Convert archiver to Web ReadableStream
    const webStream = archiverToWebStream(archive)

    // Start adding files to the archive asynchronously
    const addFilesPromise = (async () => {
      try {
      // 1. Export all SiteSettings
      const siteSettings = await prisma.siteSettings.findMany({
        orderBy: { key: 'asc' }
      })
      archive.append(JSON.stringify(siteSettings, null, 2), { name: 'data/site-settings.json' })

      // 2. Export Languages
      const languages = await prisma.language.findMany({
        orderBy: { code: 'asc' }
      })
      archive.append(JSON.stringify(languages, null, 2), { name: 'data/languages.json' })

      // 3. Export ContentTypes
      const contentTypes = await prisma.contentType.findMany({
        orderBy: { name: 'asc' }
      })
      archive.append(JSON.stringify(contentTypes, null, 2), { name: 'data/content-types.json' })

      // 4. Export TranslationKeys and Translations
      const translationKeys = await prisma.translationKey.findMany({
        include: {
          translations: {
            include: {
              language: true
            }
          }
        },
        orderBy: { key: 'asc' }
      })
      archive.append(JSON.stringify(translationKeys, null, 2), { name: 'data/translations.json' })

      // 5. Export ComponentTranslations
      const componentTranslations = await prisma.componentTranslation.findMany({
        include: {
          language: true
        },
        orderBy: { pageBuilderId: 'asc' }
      })
      archive.append(JSON.stringify(componentTranslations, null, 2), { name: 'data/component-translations.json' })

      // 6. Export SocialIntegrations
      const socialIntegrations = await prisma.socialIntegration.findMany({
        orderBy: { platform: 'asc' }
      })
      archive.append(JSON.stringify(socialIntegrations, null, 2), { name: 'data/social-integrations.json' })

      // 7. Export UserRoles (without sensitive data)
      const userRoles = await prisma.userRole.findMany({
        select: {
          id: true,
          role: true,
          permissions: true,
          createdAt: true,
          updatedAt: true
          // Exclude userId for privacy
        },
        orderBy: { role: 'asc' }
      })
      archive.append(JSON.stringify(userRoles, null, 2), { name: 'data/user-roles.json' })

      // 8. Export Homepage Page Builder Components
      const homepageComponents = await prisma.siteSettings.findUnique({
        where: { key: 'homepage_components' }
      })
      if (homepageComponents) {
        archive.append(JSON.stringify(homepageComponents.value, null, 2), { name: 'data/homepage-components.json' })
      }

      // 9. Export all ProjectImages metadata (for reference)
      const projectImages = await prisma.projectImage.findMany({
        orderBy: { createdAt: 'desc' }
      })
      archive.append(JSON.stringify(projectImages, null, 2), { name: 'data/project-images.json' })

      // 10. Export all images from public/uploads
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if (fs.existsSync(uploadsDir)) {
        // Add all files from uploads directory
        const files = fs.readdirSync(uploadsDir, { withFileTypes: true })
        for (const file of files) {
          const filePath = path.join(uploadsDir, file.name)
          if (file.isFile()) {
            const fileContent = fs.readFileSync(filePath)
            archive.append(fileContent, { name: `uploads/${file.name}` })
          } else if (file.isDirectory() && file.name === 'thumbnails') {
            // Add thumbnail files
            const thumbDir = path.join(uploadsDir, 'thumbnails')
            const thumbFiles = fs.readdirSync(thumbDir, { withFileTypes: true })
            for (const thumbFile of thumbFiles) {
              if (thumbFile.isFile()) {
                const thumbPath = path.join(thumbDir, thumbFile.name)
                const thumbContent = fs.readFileSync(thumbPath)
                archive.append(thumbContent, { name: `uploads/thumbnails/${thumbFile.name}` })
              }
            }
          }
        }
      }

      // 11. Create export metadata
      const exportMetadata = {
        version: '0.1.1',
        exportDate: new Date().toISOString(),
        exportedBy: 'admin', // Could be enhanced to get actual user
        includes: {
          siteSettings: siteSettings.length,
          languages: languages.length,
          contentTypes: contentTypes.length,
          translationKeys: translationKeys.length,
          componentTranslations: componentTranslations.length,
          socialIntegrations: socialIntegrations.length,
          userRoles: userRoles.length,
          projectImages: projectImages.length,
          hasHomepageComponents: !!homepageComponents
        }
      }
      archive.append(JSON.stringify(exportMetadata, null, 2), { name: 'export-metadata.json' })

      // 12. Create README with import instructions
      const readme = `# Rein Art Design Export

This ZIP file contains a complete backup of your site settings, configurations, and media files.

## Contents

- \`data/\` - All database settings and configurations
- \`uploads/\` - All uploaded images and thumbnails
- \`export-metadata.json\` - Export information and metadata

## Import Instructions

To import this backup:

1. Use the import feature in the admin panel
2. Or manually restore the JSON files to the database
3. Copy the \`uploads/\` folder to \`public/uploads/\` in your project

## Export Date

${exportMetadata.exportDate}

## Version

${exportMetadata.version}
`
      archive.append(readme, { name: 'README.md' })

        // Finalize the archive
        archive.finalize()
      } catch (error) {
        console.error('Error creating export archive:', error)
        archive.abort()
        throw error
      }
    })()

    // Set response headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/zip')
    headers.set('Content-Disposition', `attachment; filename="rein-art-export-${new Date().toISOString().split('T')[0]}.zip"`)

    // Start adding files in the background
    addFilesPromise.catch((error) => {
      console.error('Error in background file addition:', error)
    })

    return new Response(webStream, { headers })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }

    console.error('Error exporting settings:', error)
    return NextResponse.json(
      { error: 'Failed to export settings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

