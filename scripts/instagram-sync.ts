/**
 * Standalone Instagram Sync Script
 * Run this script to manually sync Instagram feed
 * 
 * Usage: tsx scripts/instagram-sync.ts
 */

import dotenv from 'dotenv'
import { InstagramService } from '../src/lib/instagram-service'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function main() {
  try {
    console.log('📸 Starting Instagram sync...')
    console.log('')

    // Check if sync is enabled
    const syncEnabled = process.env.INSTAGRAM_SYNC_ENABLED !== 'false'
    if (!syncEnabled) {
      console.log('⚠️  Instagram sync is disabled in environment variables')
      console.log('   Set INSTAGRAM_SYNC_ENABLED=true to enable')
      process.exit(0)
    }

    // Get auto-create option
    const autoCreateProjects = process.env.INSTAGRAM_AUTO_CREATE_PROJECTS === 'true'

    if (autoCreateProjects) {
      console.log('ℹ️  Auto-create projects is enabled')
      console.log('   New posts will be automatically converted to projects')
    } else {
      console.log('ℹ️  Auto-create projects is disabled')
      console.log('   Posts will be stored but not converted to projects')
    }

    console.log('')

    // Perform sync
    const result = await InstagramService.syncFeed(autoCreateProjects)

    console.log('')
    console.log('📊 Sync Results:')
    console.log(`   Success: ${result.success ? '✅' : '❌'}`)
    console.log(`   New posts: ${result.newPosts}`)
    console.log(`   Updated posts: ${result.updatedPosts}`)
    console.log(`   Total processed: ${result.totalProcessed}`)
    console.log(`   Errors: ${result.errors.length}`)

    if (result.errors.length > 0) {
      console.log('')
      console.log('⚠️  Errors:')
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }

    if (result.success) {
      console.log('')
      console.log('✅ Sync completed successfully!')
      process.exit(0)
    } else {
      console.log('')
      console.log('❌ Sync completed with errors')
      process.exit(1)
    }
  } catch (error) {
    console.error('')
    console.error('❌ Fatal error during sync:')
    console.error(error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

// Run the script
main()

