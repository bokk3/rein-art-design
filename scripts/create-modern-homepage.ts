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
            en: 'Rein Art Design',
            nl: 'Rein Art Design',
            fr: 'Rein Art Design',
            de: 'Rein Art Design'
          },
          subtitle: {
            en: 'Elegant and functional furniture handmade in our workshop',
            nl: 'Elegante en functionele meubels handgemaakt in onze werkplaats',
            fr: 'Meubles élégants et fonctionnels fabriqués à la main dans notre atelier',
            de: 'Elegante und funktionale Möbel handgefertigt in unserer Werkstatt'
          },
          description: {
            en: 'We create elegant and functional furniture tailored to people who use them daily. All furniture is designed in-house and handmade in our workshop. We prefer steel and wood from sustainable sources, but we don\'t hesitate to work with materials like glass, terrazzo, and brass when a design requires it.',
            nl: 'Wij maken elegante en functionele meubels die afgestemd zijn op mensen die ze dagdagelijks gebruiken. Alle meubels worden in huis ontworpen en handgemaakt in onze werkplaats. Onze geliefkoosde materialen zijn staal en hout van een duurzame oorsprong. Maar als een ontwerp nog wat extras vraagt schromen we niet om te werken met materialen zoals glas, terrazzo en messing.',
            fr: 'Nous créons des meubles élégants et fonctionnels adaptés aux personnes qui les utilisent quotidiennement. Tous les meubles sont conçus en interne et fabriqués à la main dans notre atelier. Nos matériaux préférés sont l\'acier et le bois d\'origine durable. Mais si un design demande encore quelques extras, nous n\'hésitons pas à travailler avec des matériaux comme le verre, le terrazzo et le laiton.',
            de: 'Wir schaffen elegante und funktionale Möbel, die auf Menschen zugeschnitten sind, die sie täglich nutzen. Alle Möbel werden intern entworfen und in unserer Werkstatt handgefertigt. Unsere bevorzugten Materialien sind Stahl und Holz aus nachhaltiger Herkunft. Aber wenn ein Design noch etwas Extras erfordert, zögern wir nicht, mit Materialien wie Glas, Terrazzo und Messing zu arbeiten.'
          },
          primaryButton: {
            en: 'View Projects',
            nl: 'Bekijk Projecten',
            fr: 'Voir les Projets',
            de: 'Projekte Ansehen'
          },
          secondaryButton: {
            en: 'Contact Us',
            nl: 'Contact Opnemen',
            fr: 'Nous Contacter',
            de: 'Kontakt Aufnehmen'
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
            en: 'Why Choose Rein Art Design',
            nl: 'Waarom Kiezen Voor Rein Art Design',
            fr: 'Pourquoi Choisir Rein Art Design',
            de: 'Warum Rein Art Design Wählen'
          },
          subtitle: {
            en: 'Quality and durability in every piece',
            nl: 'Kwaliteit en duurzaamheid in elk stuk',
            fr: 'Qualité et durabilité dans chaque pièce',
            de: 'Qualität und Langlebigkeit in jedem Stück'
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
                en: 'We prefer steel and wood from sustainable sources, and we don\'t hesitate to work with materials like glass, terrazzo, and brass when a design requires it.',
                nl: 'Onze geliefkoosde materialen zijn staal en hout van een duurzame oorsprong. Maar als een ontwerp nog wat extras vraagt schromen we niet om te werken met materialen zoals glas, terrazzo en messing.',
                fr: 'Nos matériaux préférés sont l\'acier et le bois d\'origine durable. Mais si un design demande encore quelques extras, nous n\'hésitons pas à travailler avec des matériaux comme le verre, le terrazzo et le laiton.',
                de: 'Unsere bevorzugten Materialien sind Stahl und Holz aus nachhaltiger Herkunft. Aber wenn ein Design noch etwas Extras erfordert, zögern wir nicht, mit Materialien wie Glas, Terrazzo und Messing zu arbeiten.'
              }
            },
            {
              icon: 'users',
              title: {
                en: 'In-House Design & Production',
                nl: 'In-Huis Ontwerp & Productie',
                fr: 'Conception et Production Internes',
                de: 'In-House Design & Produktion'
              },
              description: {
                en: 'All furniture is designed in-house and handmade in our workshop. We do as much as possible ourselves so the furniture becomes exactly as we want it.',
                nl: 'Alle meubels worden in huis ontworpen en handgemaakt in onze werkplaats. We voeren zoveel mogelijk zelf uit zodat de meubels precies worden zoals we ze willen hebben.',
                fr: 'Tous les meubles sont conçus en interne et fabriqués à la main dans notre atelier. Nous effectuons autant que possible nous-mêmes pour que les meubles soient exactement comme nous le souhaitons.',
                de: 'Alle Möbel werden intern entworfen und in unserer Werkstatt handgefertigt. Wir führen so viel wie möglich selbst aus, damit die Möbel genau so werden, wie wir sie haben wollen.'
              }
            },
            {
              icon: 'clock',
              title: {
                en: 'Durability & Testing',
                nl: 'Duurzaamheid & Testen',
                fr: 'Durabilité & Tests',
                de: 'Langlebigkeit & Tests'
              },
              description: {
                en: 'Each design is finished to the smallest detail. We thoroughly test our furniture for durability and stability, because we want them to be used for a long time and enjoyed for years.',
                nl: 'Elk ontwerp wordt tot in het kleinste detail afgewerkt. We testen onze meubels grondig op levensduurte en stabiliteit, want wij willen dat ze landurig gebruikt kunnen worden en men er jaren kan van genieten.',
                fr: 'Chaque design est fini dans les moindres détails. Nous testons nos meubles en profondeur pour leur durabilité et leur stabilité, car nous voulons qu\'ils puissent être utilisés pendant longtemps et que l\'on puisse en profiter pendant des années.',
                de: 'Jedes Design wird bis ins kleinste Detail fertiggestellt. Wir testen unsere Möbel gründlich auf Langlebigkeit und Stabilität, denn wir möchten, dass sie lange genutzt werden können und man jahrelang Freude daran hat.'
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
            en: 'Discover our custom-made furniture',
            nl: 'Ontdek onze op maat gemaakte meubels',
            fr: 'Découvrez nos meubles sur mesure',
            de: 'Entdecken Sie unsere maßgeschneiderten Möbel'
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
            en: 'Ready for Your Custom-Made Furniture?',
            nl: 'Klaar voor Uw Op Maat Gemaakte Meubel?',
            fr: 'Prêt pour Votre Meuble sur Mesure?',
            de: 'Bereit für Ihr Maßgeschneidertes Möbel?'
          },
          description: {
            en: 'Contact us for questions about our furniture or for a custom-made order. We are ready to design and realize your dream furniture together with you.',
            nl: 'Neem contact met ons op voor vragen over onze meubels of voor een op maat gemaakte opdracht. We staan klaar om samen met u uw droommeubel te ontwerpen en te realiseren.',
            fr: 'Contactez-nous pour des questions sur nos meubles ou pour une commande sur mesure. Nous sommes prêts à concevoir et réaliser votre meuble de rêve avec vous.',
            de: 'Kontaktieren Sie uns für Fragen zu unseren Möbeln oder für eine maßgeschneiderte Bestellung. Wir sind bereit, gemeinsam mit Ihnen Ihr Traummöbel zu entwerfen und zu realisieren.'
          },
          primaryButton: {
            en: 'Contact Us',
            nl: 'Contact Opnemen',
            fr: 'Nous Contacter',
            de: 'Kontakt Aufnehmen'
          },
          secondaryButton: {
            en: 'View Projects',
            nl: 'Bekijk Projecten',
            fr: 'Voir les Projets',
            de: 'Projekte Ansehen'
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