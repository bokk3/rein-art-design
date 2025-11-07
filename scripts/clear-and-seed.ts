import { PrismaClient } from '@prisma/client'
import { auth } from '../src/lib/auth'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function clearAndSeed() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminName = process.env.ADMIN_NAME || 'Admin User'

    if (!adminEmail || !adminPassword) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local')
      process.exit(1)
    }

    console.log('🧹 Clearing all auth data...')
    
    // Clear all tables
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.verification.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('✅ All data cleared')
    
    // Now create admin account
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
    console.log('🔑 Password: [set in .env.local]')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

clearAndSeed()
