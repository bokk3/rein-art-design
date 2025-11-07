import { auth } from '../src/lib/auth'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function createAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminName = process.env.ADMIN_NAME || 'Admin User'

    if (!adminEmail || !adminPassword) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local')
      process.exit(1)
    }

    console.log('🔐 Creating admin account...')
    
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName
      }
    })

    console.log('✅ Admin account created successfully!')
    console.log(`📧 Email: ${adminEmail}`)
    
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log('👤 Admin account already exists')
    } else {
      console.error('❌ Failed to create admin:', error.message)
    }
  }
}

createAdmin()
