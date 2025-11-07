import { prisma } from '../src/lib/db'

async function createModernHomepage() {
  try {
    console.log('🎨 Creating modern homepage components...')
    
    // Check if homepage already exists and warn user
    const existing = await prisma.siteSettings.findUnique({
      where: { key: 'homepage_components' }
    })
    
    if (existing) {
      console.log('⚠️  WARNING: A homepage already exists!')
      console.log('   This script will OVERWRITE your current homepage components.')
      console.log('   If you want to keep your current setup, cancel now (Ctrl+C)')
      console.log('   Waiting 5 seconds before proceeding...\n')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    // Define beautiful, modern homepage components
    const homepageComponents = [
      {
        id: 'hero-1',
        type: 'hero',
        order: 1,
        data: {
          title: {
            en: 'Exceptional Craftsmanship',
            nl: 'Uitzonderlijk Vakmanschap',
            fr: 'Artisanat Exceptionnel',
            de: 'Außergewöhnliche Handwerkskunst'
          },
          subtitle: {
            en: 'Where tradition meets innovation',
            nl: 'Waar traditie innovatie ontmoet',
            fr: 'Où la tradition rencontre l\'innovation',
            de: 'Wo Tradition auf Innovation trifft'
          },
          description: {
            en: 'Discover unique handcrafted pieces made with premium materials and meticulous attention to detail. Each project tells a story of passion, skill, and artistic vision.',
            nl: 'Ontdek unieke handgemaakte stukken gemaakt met premium materialen en nauwgezette aandacht voor detail. Elk project vertelt een verhaal van passie, vaardigheid en artistieke visie.',
            fr: 'Découvrez des pièces artisanales uniques fabriquées avec des matériaux de qualité et une attention méticuleuse aux détails. Chaque projet raconte une histoire de passion, de compétence et de vision artistique.',
            de: 'Entdecken Sie einzigartige handgefertigte Stücke aus hochwertigen Materialien mit akribischer Liebe zum Detail. Jedes Projekt erzählt eine Geschichte von Leidenschaft, Können und künstlerischer Vision.'
          },
          primaryButton: {
            en: 'View Portfolio',
            nl: 'Bekijk Portfolio',
            fr: 'Voir le Portfolio',
            de: 'Portfolio Ansehen'
          },
          secondaryButton: {
            en: 'Commission Work',
            nl: 'Werk Opdragen',
            fr: 'Commander un Travail',
            de: 'Arbeit Beauftragen'
          },
          // Use light gradient in light mode, dark in dark mode (via Tailwind classes)
          backgroundType: 'gradient',
          gradient: 'from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
          height: 'screen'
        }
      },
      {
        id: 'features-1',
        type: 'features',
        order: 2,
        data: {
          title: {
            en: 'Why Choose Our Craftsmanship',
            nl: 'Waarom Kiezen Voor Ons Vakmanschap',
            fr: 'Pourquoi Choisir Notre Artisanat',
            de: 'Warum Unser Handwerk Wählen'
          },
          subtitle: {
            en: 'Excellence in every detail',
            nl: 'Excellentie in elk detail',
            fr: 'Excellence dans chaque détail',
            de: 'Exzellenz in jedem Detail'
          },
          features: [
            {
              icon: 'award',
              title: {
                en: 'Premium Materials',
                nl: 'Premium Materialen',
                fr: 'Matériaux Premium',
                de: 'Premium Materialien'
              },
              description: {
                en: 'We source only the finest materials from trusted suppliers, ensuring durability and beauty in every piece.',
                nl: 'We gebruiken alleen de beste materialen van vertrouwde leveranciers, wat duurzaamheid en schoonheid in elk stuk garandeert.',
                fr: 'Nous nous approvisionnons uniquement en matériaux de la plus haute qualité auprès de fournisseurs de confiance, garantissant durabilité et beauté dans chaque pièce.',
                de: 'Wir beziehen nur die besten Materialien von vertrauenswürdigen Lieferanten und gewährleisten so Langlebigkeit und Schönheit in jedem Stück.'
              }
            },
            {
              icon: 'users',
              title: {
                en: 'Expert Artisans',
                nl: 'Expert Ambachtslieden',
                fr: 'Artisans Experts',
                de: 'Experten-Handwerker'
              },
              description: {
                en: 'Our team of skilled craftspeople brings decades of experience and passion to every project.',
                nl: 'Ons team van bekwame ambachtslieden brengt tientallen jaren ervaring en passie naar elk project.',
                fr: 'Notre équipe d\'artisans qualifiés apporte des décennies d\'expérience et de passion à chaque projet.',
                de: 'Unser Team erfahrener Handwerker bringt jahrzehntelange Erfahrung und Leidenschaft in jedes Projekt ein.'
              }
            },
            {
              icon: 'clock',
              title: {
                en: 'Timeless Design',
                nl: 'Tijdloos Design',
                fr: 'Design Intemporel',
                de: 'Zeitloses Design'
              },
              description: {
                en: 'Our designs blend classic techniques with contemporary aesthetics for pieces that endure.',
                nl: 'Onze ontwerpen combineren klassieke technieken met hedendaagse esthetiek voor stukken die blijven bestaan.',
                fr: 'Nos designs mélangent techniques classiques et esthétiques contemporaines pour des pièces qui perdurent.',
                de: 'Unsere Designs verbinden klassische Techniken mit zeitgenössischer Ästhetik für dauerhafte Stücke.'
              }
            }
          ],
          backgroundColor: 'white'
        }
      },
      {
        id: 'gallery-1',
        type: 'gallery',
        order: 3,
        data: {
          title: {
            en: 'Featured Projects',
            nl: 'Uitgelichte Projecten',
            fr: 'Projets en Vedette',
            de: 'Ausgewählte Projekte'
          },
          subtitle: {
            en: 'A showcase of our finest work',
            nl: 'Een showcase van ons beste werk',
            fr: 'Une vitrine de notre meilleur travail',
            de: 'Eine Präsentation unserer besten Arbeit'
          },
          showFeatured: true,
          maxItems: 8,
          layout: 'grid',
          columns: 4,
          backgroundColor: 'gray-50'
        }
      },
      {
        id: 'testimonials-1',
        type: 'testimonials',
        order: 4,
        data: {
          title: {
            en: 'What Our Clients Say',
            nl: 'Wat Onze Klanten Zeggen',
            fr: 'Ce Que Disent Nos Clients',
            de: 'Was Unsere Kunden Sagen'
          },
          testimonials: [
            {
              name: 'Sarah Johnson',
              role: {
                en: 'Interior Designer',
                nl: 'Interieurontwerper',
                fr: 'Architecte d\'Intérieur',
                de: 'Innenarchitektin'
              },
              content: {
                en: 'The attention to detail and quality of craftsmanship exceeded all my expectations. Every piece tells a story.',
                nl: 'De aandacht voor detail en kwaliteit van vakmanschap overtrof al mijn verwachtingen. Elk stuk vertelt een verhaal.',
                fr: 'L\'attention aux détails et la qualité de l\'artisanat ont dépassé toutes mes attentes. Chaque pièce raconte une histoire.',
                de: 'Die Liebe zum Detail und die Qualität der Handwerkskunst übertrafen alle meine Erwartungen. Jedes Stück erzählt eine Geschichte.'
              },
              rating: 5
            },
            {
              name: 'Michael Chen',
              role: {
                en: 'Architect',
                nl: 'Architect',
                fr: 'Architecte',
                de: 'Architekt'
              },
              content: {
                en: 'Professional, reliable, and incredibly talented. They brought our vision to life perfectly.',
                nl: 'Professioneel, betrouwbaar en ongelooflijk getalenteerd. Ze brachten onze visie perfect tot leven.',
                fr: 'Professionnel, fiable et incroyablement talentueux. Ils ont parfaitement donné vie à notre vision.',
                de: 'Professionell, zuverlässig und unglaublich talentiert. Sie haben unsere Vision perfekt zum Leben erweckt.'
              },
              rating: 5
            },
            {
              name: 'Emma Rodriguez',
              role: {
                en: 'Homeowner',
                nl: 'Huiseigenaar',
                fr: 'Propriétaire',
                de: 'Hausbesitzerin'
              },
              content: {
                en: 'From concept to completion, the entire process was seamless. The final result is absolutely stunning.',
                nl: 'Van concept tot voltooiing was het hele proces naadloos. Het eindresultaat is absoluut prachtig.',
                fr: 'Du concept à la réalisation, tout le processus a été fluide. Le résultat final est absolument magnifique.',
                de: 'Vom Konzept bis zur Fertigstellung war der gesamte Prozess reibungslos. Das Endergebnis ist absolut atemberaubend.'
              },
              rating: 5
            }
          ],
          backgroundColor: 'white'
        }
      },
      {
        id: 'cta-1',
        type: 'cta',
        order: 5,
        data: {
          title: {
            en: 'Ready to Create Something Beautiful?',
            nl: 'Klaar Om Iets Moois Te Creëren?',
            fr: 'Prêt à Créer Quelque Chose de Beau?',
            de: 'Bereit, Etwas Schönes zu Schaffen?'
          },
          description: {
            en: 'Let\'s discuss your project and explore how we can bring your vision to life with exceptional craftsmanship.',
            nl: 'Laten we uw project bespreken en verkennen hoe we uw visie tot leven kunnen brengen met uitzonderlijk vakmanschap.',
            fr: 'Discutons de votre projet et explorons comment nous pouvons donner vie à votre vision avec un artisanat exceptionnel.',
            de: 'Lassen Sie uns Ihr Projekt besprechen und erkunden, wie wir Ihre Vision mit außergewöhnlicher Handwerkskunst zum Leben erwecken können.'
          },
          primaryButton: {
            en: 'Start Your Project',
            nl: 'Start Uw Project',
            fr: 'Commencez Votre Projet',
            de: 'Starten Sie Ihr Projekt'
          },
          secondaryButton: {
            en: 'View Portfolio',
            nl: 'Bekijk Portfolio',
            fr: 'Voir le Portfolio',
            de: 'Portfolio Ansehen'
          },
          ctaButtonLink: '/contact',
          // No backgroundColor - will use default: light gradient in light mode, dark in dark mode
        }
      }
    ]

    // Save the homepage components to the database
    await prisma.siteSettings.upsert({
      where: { key: 'homepage_components' },
      update: { value: homepageComponents },
      create: {
        key: 'homepage_components',
        value: homepageComponents,
        category: 'page_builder',
        description: 'Homepage page builder components'
      }
    })

    console.log('✅ Modern homepage components created successfully!')
    console.log(`📄 Created ${homepageComponents.length} components:`)
    homepageComponents.forEach(comp => {
      console.log(`   - ${comp.type} (${comp.id})`)
    })
    
    console.log('\n🎉 Your modern homepage is ready!')
    console.log('🔧 You can edit it using the Page Builder at /admin/page-builder')
    
  } catch (error) {
    console.error('❌ Error creating modern homepage:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createModernHomepage()