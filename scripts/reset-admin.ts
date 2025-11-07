import { PrismaClient } from '@prisma/client'
import { auth } from '../src/lib/auth'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function resetAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminName = process.env.ADMIN_NAME || 'Admin User'

    if (!adminEmail || !adminPassword) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local')
      process.exit(1)
    }

    console.log('🗑️  Removing existing admin user...')
    
    // Delete the existing user
    await prisma.user.delete({
      where: { email: adminEmail }
    }).catch(() => {
      // User might not exist, that's okay
    })
    
    console.log('✅ Existing admin user removed')
    
    // Now create a proper admin account using Better Auth
    console.log('🔐 Creating new admin account...')
    
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
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdmin()
