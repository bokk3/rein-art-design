import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed default languages
  console.log('🌍 Creating default languages...')
  const languages = [
    { code: 'nl', name: 'Nederlands', isDefault: true, isActive: true },
    { code: 'fr', name: 'Français', isDefault: false, isActive: true },
    { code: 'en', name: 'English', isDefault: false, isActive: false },
    { code: 'de', name: 'Deutsch', isDefault: false, isActive: false }
  ]

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: lang
    })
  }
  console.log('✅ Languages created')

  // Seed default content types
  console.log('📝 Creating default content types...')
  const contentTypes = [
    {
      name: 'projects',
      displayName: 'Projects',
      fields: {
        title: { type: 'string', required: true },
        description: { type: 'richtext', required: true },
        materials: { type: 'array', required: false },
        images: { type: 'images', required: false }
      },
      isActive: true
    },
    {
      name: 'services',
      displayName: 'Services',
      fields: {
        title: { type: 'string', required: true },
        description: { type: 'richtext', required: true },
        price: { type: 'string', required: false }
      },
      isActive: false
    },
    {
      name: 'products',
      displayName: 'Products',
      fields: {
        title: { type: 'string', required: true },
        description: { type: 'richtext', required: true },
        price: { type: 'string', required: false },
        availability: { type: 'string', required: false }
      },
      isActive: false
    }
  ]

  for (const contentType of contentTypes) {
    await prisma.contentType.upsert({
      where: { name: contentType.name },
      update: {},
      create: contentType
    })
  }
  console.log('✅ Content types created')

  // Seed system settings
  console.log('⚙️ Creating system settings...')
  const settings = [
    {
      key: 'site_title',
      value: { nl: 'Mijn Portfolio', fr: 'Mon Portfolio' },
      category: 'general',
      description: 'Site title in different languages'
    },
    {
      key: 'site_description',
      value: { 
        nl: 'Welkom bij mijn portfolio van handgemaakte creaties',
        fr: 'Bienvenue dans mon portfolio de créations artisanales'
      },
      category: 'general',
      description: 'Site description in different languages'
    },
    {
      key: 'contact_email',
      value: 'contact@example.com',
      category: 'contact',
      description: 'Primary contact email address'
    },
    {
      key: 'contact_phone',
      value: '+32 123 456 789',
      category: 'contact',
      description: 'Primary contact phone number'
    },
    {
      key: 'theme_colors',
      value: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#666666'
      },
      category: 'theme',
      description: 'Primary theme colors'
    },
    {
      key: 'analytics_enabled',
      value: false,
      category: 'privacy',
      description: 'Enable privacy-focused analytics'
    },
    {
      key: 'cookie_banner_enabled',
      value: true,
      category: 'privacy',
      description: 'Show GDPR cookie consent banner'
    }
  ]

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }
  console.log('✅ System settings created')

  // Seed social integrations
  console.log('📱 Creating social integrations...')
  const socialIntegrations = [
    {
      platform: 'instagram',
      displayName: 'Instagram',
      config: {
        accessToken: '',
        refreshToken: '',
        userId: '',
        syncInterval: 3600000 // 1 hour in milliseconds
      },
      isActive: false
    },
    {
      platform: 'facebook',
      displayName: 'Facebook',
      config: {
        accessToken: '',
        pageId: ''
      },
      isActive: false
    },
    {
      platform: 'twitter',
      displayName: 'Twitter',
      config: {
        bearerToken: '',
        userId: ''
      },
      isActive: false
    }
  ]

  for (const integration of socialIntegrations) {
    await prisma.socialIntegration.upsert({
      where: { platform: integration.platform },
      update: {},
      create: integration
    })
  }
  console.log('✅ Social integrations created')

  // Create default content pages
  console.log('📄 Creating default content pages...')
  const defaultLanguage = await prisma.language.findFirst({
    where: { isDefault: true }
  })
  const frenchLanguage = await prisma.language.findFirst({
    where: { code: 'fr' }
  })

  if (defaultLanguage && frenchLanguage) {
    const contentPages = [
      {
        slug: 'about',
        translations: [
          {
            languageId: defaultLanguage.id,
            title: 'Over Mij',
            content: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Welkom bij mijn portfolio. Hier vind je een overzicht van mijn handgemaakte creaties.'
                    }
                  ]
                }
              ]
            }
          },
          {
            languageId: frenchLanguage.id,
            title: 'À Propos',
            content: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Bienvenue dans mon portfolio. Vous trouverez ici un aperçu de mes créations artisanales.'
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        slug: 'contact',
        translations: [
          {
            languageId: defaultLanguage.id,
            title: 'Contact',
            content: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Neem contact met mij op voor vragen over mijn werk of voor opdrachten.'
                    }
                  ]
                }
              ]
            }
          },
          {
            languageId: frenchLanguage.id,
            title: 'Contact',
            content: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Contactez-moi pour des questions sur mon travail ou pour des commissions.'
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ]

    for (const page of contentPages) {
      const createdPage = await prisma.contentPage.upsert({
        where: { slug: page.slug },
        update: {},
        create: {
          slug: page.slug,
          published: true
        }
      })

      for (const translation of page.translations) {
        await prisma.contentPageTranslation.upsert({
          where: {
            pageId_languageId: {
              pageId: createdPage.id,
              languageId: translation.languageId
            }
          },
          update: {},
          create: {
            pageId: createdPage.id,
            languageId: translation.languageId,
            title: translation.title,
            content: translation.content
          }
        })
      }
    }
    console.log('✅ Default content pages created')
  }

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@nextjs-cms.com' }
  })

  if (existingAdmin) {
    console.log('👤 Admin user already exists')
    
    // Ensure admin has proper role
    await prisma.userRole.upsert({
      where: { userId: existingAdmin.id },
      update: {},
      create: {
        userId: existingAdmin.id,
        role: 'admin',
        permissions: {
          projects: { create: true, read: true, update: true, delete: true },
          content: { create: true, read: true, update: true, delete: true },
          messages: { read: true, update: true, delete: true },
          settings: { read: true, update: true },
          users: { create: true, read: true, update: true, delete: true },
          analytics: { read: true }
        }
      }
    })
    console.log('✅ Admin role ensured')
    return
  }

  // Create admin user (password will be set through Better Auth signup)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@nextjs-cms.com',
      emailVerified: true,
    }
  })

  // Create admin role
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      role: 'admin',
      permissions: {
        projects: { create: true, read: true, update: true, delete: true },
        content: { create: true, read: true, update: true, delete: true },
        messages: { read: true, update: true, delete: true },
        settings: { read: true, update: true },
        users: { create: true, read: true, update: true, delete: true },
        analytics: { read: true }
      }
    }
  })

  console.log('✅ Admin user created:', adminUser.email)
  console.log('📧 Email: admin@nextjs-cms.com')
  console.log('🔑 Use the signup form to set password: admin123')
  console.log('ℹ️  The user record exists, now sign up with this email to set the password')

  // Create sample contact messages for testing
  console.log('📧 Creating sample contact messages...')
  const sampleMessages = [
    {
      name: 'Marie Dubois',
      email: 'marie.dubois@example.com',
      projectType: 'Custom Jewelry',
      message: 'Bonjour, je suis intéressée par une bague personnalisée pour mon mariage. Pourriez-vous me donner plus d\'informations sur vos créations et les prix?',
      read: false,
      replied: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      name: 'Jan Janssen',
      email: 'jan.janssen@example.be',
      projectType: 'Home Decoration',
      message: 'Hallo, ik zou graag een offerte willen voor een handgemaakte wanddecoratie voor mijn woonkamer. De afmetingen zijn ongeveer 80x60cm.',
      read: true,
      replied: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
      name: 'Sophie Laurent',
      email: 'sophie.laurent@example.fr',
      projectType: 'Gift Item',
      message: 'Hello, I saw your beautiful work on Instagram. I would like to commission a special gift for my mother\'s birthday. Could we discuss the possibilities?',
      read: true,
      replied: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    },
    {
      name: 'Pieter Van Der Berg',
      email: 'pieter.vandenberg@example.nl',
      projectType: 'Repair Service',
      message: 'Goedemiddag, ik heb een oude sieraad die gerepareerd moet worden. Is dit iets wat u doet? Het gaat om een antieke broche van mijn grootmoeder.',
      read: false,
      replied: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      name: 'Emma Thompson',
      email: 'emma.thompson@example.co.uk',
      projectType: 'Workshop Inquiry',
      message: 'Hi there! I\'m visiting Belgium next month and I\'m wondering if you offer any workshops or classes? I\'d love to learn some of your techniques.',
      read: false,
      replied: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    }
  ]

  for (const message of sampleMessages) {
    await prisma.contactMessage.create({
      data: message
    })
  }
  console.log('✅ Sample contact messages created')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })