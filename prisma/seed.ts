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
      value: { nl: 'Rein Art Design', fr: 'Rein Art Design', en: 'Rein Art Design' },
      category: 'general',
      description: 'Site title in different languages'
    },
    {
      key: 'site_description',
      value: { 
        nl: 'Elegante en functionele meubels handgemaakt in onze werkplaats',
        fr: 'Meubles élégants et fonctionnels fabriqués à la main dans notre atelier',
        en: 'Elegant and functional furniture handmade in our workshop'
      },
      category: 'general',
      description: 'Site description in different languages'
    },
    {
      key: 'company_name',
      value: 'Rein Art Design',
      category: 'company',
      description: 'Company name'
    },
    {
      key: 'company_owner',
      value: 'Rein De Keyser',
      category: 'company',
      description: 'Company owner name'
    },
    {
      key: 'company_address',
      value: 'Bornestraat 285\n3012 Wilsele',
      category: 'company',
      description: 'Company address'
    },
    {
      key: 'company_details',
      value: {
        legalName: 'Rein Art Design BVBA',
        iban: 'BE 92 0018 2117 7323',
        vat: 'BE 0682 403 611'
      },
      category: 'company',
      description: 'Company legal details (IBAN, VAT, etc.)'
    },
    {
      key: 'site_url',
      value: 'https://www.reinartdesign.be/',
      category: 'general',
      description: 'Site URL when deployed'
    },
    {
      key: 'contact_email',
      value: 'contact@reinartdesign.be',
      category: 'contact',
      description: 'Primary contact email address'
    },
    {
      key: 'contact_phone',
      value: '+ 32 (0) 487 837 041',
      category: 'contact',
      description: 'Primary contact phone number'
    },
    {
      key: 'footer_copyright',
      value: '© {year} Rein Art Design. Designed with <3 by truyens.pro',
      category: 'footer',
      description: 'Footer copyright text with year placeholder'
    },
    {
      key: 'instagram_url',
      value: 'https://www.instagram.com/rein_art_design/',
      category: 'social',
      description: 'Instagram profile URL'
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
        syncInterval: 3600000, // 1 hour in milliseconds
        profileUrl: 'https://www.instagram.com/rein_art_design/'
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
            title: 'Over Ons',
            content: {
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Wij maken elegante en functionele meubels die afgestemd zijn op mensen die ze dagdagelijks gebruiken. Alle meubels worden in huis ontworpen en handgemaakt in onze werkplaats. We voeren zoveel mogelijk zelf uit zodat de meubels precies worden zoals we ze willen hebben. Onze geliefkoosde materialen zijn staal en hout van een duurzame oorsprong. Maar als een ontwerp nog wat extras vraagt schromen we niet om te werken met materialen zoals glas, terrazzo en messing.'
                    }
                  ]
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Elk ontwerp wordt tot in het kleinste detail afgewerkt. We testen onze meubels grondig op levensduurte en stabiliteit, want wij willen dat ze landurig gebruikt kunnen worden en men er jaren kan van genieten. Voor ons is het belangrijk dat bij het op maat ontwerpen er rekening gehouden wordt met de ruimte waar het werk terecht zal komen. Onze meubels zijn zowel een praktische als esthetische toevoeging aan de plaats waar ze zullen staan.'
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
                      text: 'Nous créons des meubles élégants et fonctionnels adaptés aux personnes qui les utilisent quotidiennement. Tous les meubles sont conçus en interne et fabriqués à la main dans notre atelier. Nous effectuons autant que possible nous-mêmes pour que les meubles soient exactement comme nous le souhaitons. Nos matériaux préférés sont l\'acier et le bois d\'origine durable. Mais si un design demande encore quelques extras, nous n\'hésitons pas à travailler avec des matériaux comme le verre, le terrazzo et le laiton.'
                    }
                  ]
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Chaque design est fini dans les moindres détails. Nous testons nos meubles en profondeur pour leur durabilité et leur stabilité, car nous voulons qu\'ils puissent être utilisés pendant longtemps et que l\'on puisse en profiter pendant des années. Pour nous, il est important que lors de la conception sur mesure, on tienne compte de l\'espace où l\'œuvre sera placée. Nos meubles sont à la fois un ajout pratique et esthétique à l\'endroit où ils seront placés.'
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
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nextjs-cms.com' // Fallback for backwards compat
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
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
      name: process.env.ADMIN_NAME || 'Admin User',
      email: adminEmail,
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
  console.log(`📧 Email: ${adminEmail}`)
  console.log('ℹ️  Use the signup form or create-admin script to set the password')

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