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
            nl: 'Rein Art Design',
            fr: 'Rein Art Design'
          },
          subtitle: {
            nl: 'Elegante en functionele meubels handgemaakt in onze werkplaats',
            fr: 'Meubles élégants et fonctionnels fabriqués à la main dans notre atelier'
          },
          buttonText: {
            nl: 'Bekijk Onze Projecten',
            fr: 'Voir Nos Projets'
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
            nl: '<h2>Over Rein Art Design</h2><p>Wij maken elegante en functionele meubels die afgestemd zijn op mensen die ze dagdagelijks gebruiken. Alle meubels worden in huis ontworpen en handgemaakt in onze werkplaats. We voeren zoveel mogelijk zelf uit zodat de meubels precies worden zoals we ze willen hebben. Onze geliefkoosde materialen zijn staal en hout van een duurzame oorsprong. Maar als een ontwerp nog wat extras vraagt schromen we niet om te werken met materialen zoals glas, terrazzo en messing.</p><p>Elk ontwerp wordt tot in het kleinste detail afgewerkt. We testen onze meubels grondig op levensduurte en stabiliteit, want wij willen dat ze landurig gebruikt kunnen worden en men er jaren kan van genieten.</p>',
            fr: '<h2>À Propos de Rein Art Design</h2><p>Nous créons des meubles élégants et fonctionnels adaptés aux personnes qui les utilisent quotidiennement. Tous les meubles sont conçus en interne et fabriqués à la main dans notre atelier. Nous effectuons autant que possible nous-mêmes pour que les meubles soient exactement comme nous le souhaitons. Nos matériaux préférés sont l\'acier et le bois d\'origine durable. Mais si un design demande encore quelques extras, nous n\'hésitons pas à travailler avec des matériaux comme le verre, le terrazzo et le laiton.</p><p>Chaque design est fini dans les moindres détails. Nous testons nos meubles en profondeur pour leur durabilité et leur stabilité, car nous voulons qu\'ils puissent être utilisés pendant longtemps et que l\'on puisse en profiter pendant des années.</p>'
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
            nl: 'Klaar voor Uw Op Maat Gemaakte Meubel?',
            fr: 'Prêt pour Votre Meuble sur Mesure?'
          },
          description: {
            nl: 'Neem contact met ons op voor vragen over onze meubels of voor een op maat gemaakte opdracht. We staan klaar om samen met u uw droommeubel te ontwerpen en te realiseren.',
            fr: 'Contactez-nous pour des questions sur nos meubles ou pour une commande sur mesure. Nous sommes prêts à concevoir et réaliser votre meuble de rêve avec vous.'
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