import { PrismaClient } from '@prisma/client'
import { auth } from '../src/lib/auth'

const prisma = new PrismaClient()

async function clearAndSeed() {
  try {
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
        email: 'admin@nextjs-cms.com',
        password: 'admin123',
        name: 'Admin User'
      }
    })

    console.log('✅ Admin account created successfully!')
    console.log('📧 Email: admin@nextjs-cms.com')
    console.log('🔑 Password: admin123')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

clearAndSeed()