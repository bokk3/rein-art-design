import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createDefaultHomepage() {
  try {
    console.log('🏠 Creating default homepage components...')
    
    const defaultComponents = [
      {
        id: 'hero-1',
        type: 'hero',
        order: 0,
        data: {
          title: {
            nl: 'Welkom bij Ons Portfolio',
            fr: 'Bienvenue dans Notre Portfolio'
          },
          subtitle: {
            nl: 'Ontdek unieke handgemaakte stukken gemaakt met kwaliteitsmaterialen en aandacht voor detail.',
            fr: 'Découvrez des pièces artisanales uniques fabriquées avec des matériaux de qualité et une attention aux détails.'
          },
          buttonText: {
            nl: 'Bekijk Projecten',
            fr: 'Voir les Projets'
          },
          buttonLink: '/projects',
          backgroundColor: '#ffffff',
          textColor: '#000000'
        }
      },
      {
        id: 'gallery-1',
        type: 'gallery',
        order: 1,
        data: {
          images: [],
          backgroundColor: '#f9fafb'
        }
      },
      {
        id: 'text-1',
        type: 'text',
        order: 2,
        data: {
          content: {
            nl: '<h2>Vakmanschap Ontmoet Design</h2><p>Elk stuk dat we maken is een unieke mix van traditionele technieken en hedendaagse esthetiek. We werken nauw samen met onze klanten om hun visie tot leven te brengen, waarbij we alleen de beste materialen en tijdloze methoden gebruiken.</p>',
            fr: '<h2>L\'Artisanat Rencontre le Design</h2><p>Chaque pièce que nous créons est un mélange unique de techniques traditionnelles et d\'esthétique contemporaine. Nous travaillons en étroite collaboration avec nos clients pour donner vie à leur vision, en utilisant uniquement les meilleurs matériaux et des méthodes intemporelles.</p>'
          },
          alignment: 'left',
          backgroundColor: '#ffffff',
          textColor: '#000000'
        }
      },
      {
        id: 'cta-1',
        type: 'cta',
        order: 3,
        data: {
          heading: {
            nl: 'Klaar om Uw Project te Starten?',
            fr: 'Prêt à Commencer Votre Projet?'
          },
          description: {
            nl: 'Neem contact met ons op om uw ideeën te bespreken en te leren hoe we uw visie tot leven kunnen brengen.',
            fr: 'Contactez-nous pour discuter de vos idées et apprendre comment nous pouvons donner vie à votre vision.'
          },
          buttonText: {
            nl: 'Contact Opnemen',
            fr: 'Nous Contacter'
          },
          buttonLink: '/contact',
          backgroundColor: '#000000',
          textColor: '#ffffff'
        }
      }
    ]

    // Save components to site settings
    await prisma.siteSettings.upsert({
      where: { key: 'homepage_components' },
      update: {
        value: defaultComponents,
        category: 'page_builder',
        description: 'Homepage page builder components'
      },
      create: {
        key: 'homepage_components',
        value: defaultComponents,
        category: 'page_builder',
        description: 'Homepage page builder components'
      }
    })

    console.log('✅ Default homepage components created!')
    console.log(`Created ${defaultComponents.length} components:`)
    defaultComponents.forEach(comp => {
      console.log(`  - ${comp.type} (order: ${comp.order})`)
    })
  } catch (error) {
    console.error('❌ Error creating default homepage:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultHomepage()