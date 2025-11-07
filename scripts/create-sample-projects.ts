import { prisma } from '../src/lib/db'

async function createSampleProjects() {
  try {
    console.log('🎨 Creating sample featured projects...')

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

    // Sample projects data (in Dutch, the default language)
    const sampleProjects = [
      {
        title: 'Handgemaakte Eiken Eettafel',
        description: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Een prachtige massief eiken eettafel gemaakt van duurzaam hout. Met handgesneden details en een natuurlijke olie-afwerking die de prachtige nerfpatronen benadrukt. Biedt plaats aan 8 personen en gebouwd om generaties mee te gaan.'
                }
              ]
            }
          ]
        },
        materials: ['Massief Eiken', 'Natuurlijke Olie-afwerking', 'Handgesmeed Hardware']
      },
      {
        title: 'Op Maat Gemaakte Keukenkasten',
        description: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Op maat gemaakte keukenkasten ontworpen om ruimte en functionaliteit te maximaliseren. Met zachte sluitladen, verborgen opslagoplossingen en een tijdloos shaker-stijl ontwerp in geverfd hardhout.'
                }
              ]
            }
          ]
        },
        materials: ['Geverfd Hardhout', 'Zachte Sluit Hardware', 'Kwarts Werkbladen']
      },
      {
        title: 'Ambachtelijke Boekenkast',
        description: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Van vloer tot plafond boekenkast met verstelbare planken en geïntegreerde verlichting. Gemaakt van gerecycled walnotenhout met traditionele verbindingstechnieken voor een stuk dat zowel functioneel als mooi is.'
                }
              ]
            }
          ]
        },
        materials: ['Gerecycled Walnotenhout', 'LED Strip Verlichting', 'Messing Accenten']
      },
      {
        title: 'Live Edge Salontafel',
        description: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Unieke live edge salontafel die de natuurlijke schoonheid van het hout toont. Elk stuk is uniek, met de organische rand van de boom en ondersteund door strakke stalen poten.'
                }
              ]
            }
          ]
        },
        materials: ['Live Edge Esdoorn', 'Stalen Basis', 'Beschermende Afwerking']
      }
    ]

    // Create the projects
    for (const projectData of sampleProjects) {
      const project = await prisma.project.create({
        data: {
          contentTypeId: contentType.id,
          featured: true,
          published: true,
          createdBy: adminUser.id,
          translations: {
            create: {
              languageId: defaultLanguage.id,
              title: projectData.title,
              description: projectData.description,
              materials: projectData.materials
            }
          }
        }
      })

      console.log(`✅ Created project: ${projectData.title}`)
    }

    console.log('🎉 Sample projects created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating sample projects:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleProjects()