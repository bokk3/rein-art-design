import { prisma } from '../src/lib/db'

async function checkTranslationTables() {
  try {
    console.log('🔍 Checking translation tables in database...\n')

    // Check if translation_keys table exists and has data
    try {
      const translationKeys = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM translation_keys
      `
      console.log(`✅ translation_keys table exists`)
      console.log(`   Records: ${translationKeys[0].count}`)
    } catch (error: any) {
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        console.log(`❌ translation_keys table does NOT exist`)
      } else {
        throw error
      }
    }

    // Check if translations table exists
    try {
      const translations = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM translations
      `
      console.log(`✅ translations table exists`)
      console.log(`   Records: ${translations[0].count}`)
    } catch (error: any) {
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        console.log(`❌ translations table does NOT exist`)
      } else {
        throw error
      }
    }

    // Check if component_translations table exists
    try {
      const componentTranslations = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM component_translations
      `
      console.log(`✅ component_translations table exists`)
      console.log(`   Records: ${componentTranslations[0].count}`)
    } catch (error: any) {
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        console.log(`❌ component_translations table does NOT exist`)
      } else {
        throw error
      }
    }

    // Check if analytics_events table exists
    try {
      const analyticsEvents = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM analytics_events
      `
      console.log(`✅ analytics_events table exists`)
      console.log(`   Records: ${analyticsEvents[0].count}`)
    } catch (error: any) {
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        console.log(`❌ analytics_events table does NOT exist`)
      } else {
        throw error
      }
    }

    // Check migration history
    console.log('\n📋 Checking _prisma_migrations table...')
    try {
      const migrations = await prisma.$queryRaw<Array<{
        migration_name: string
        finished_at: Date | null
      }>>`
        SELECT migration_name, finished_at 
        FROM _prisma_migrations 
        WHERE migration_name IN ('20250115000000_add_analytics_events', '20251106074904_add_translation_system')
        ORDER BY migration_name
      `
      
      if (migrations.length === 0) {
        console.log('⚠️  No migration records found for these migrations')
      } else {
        migrations.forEach(m => {
          const status = m.finished_at ? '✅ Applied' : '⏳ Pending'
          console.log(`   ${status}: ${m.migration_name}`)
        })
      }
    } catch (error: any) {
      console.log(`⚠️  Could not check migration history: ${error.message}`)
    }

  } catch (error) {
    console.error('❌ Error checking tables:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTranslationTables()

