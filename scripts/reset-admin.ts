import { PrismaClient } from '@prisma/client'
import { auth } from '../src/lib/auth'

const prisma = new PrismaClient()

async function resetAdmin() {
  try {
    console.log('🗑️  Removing existing admin user...')
    
    // Delete the existing user
    await prisma.user.delete({
      where: { email: 'admin@nextjs-cms.com' }
    })
    
    console.log('✅ Existing admin user removed')
    
    // Now create a proper admin account using Better Auth
    console.log('🔐 Creating new admin account...')
    
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

resetAdmin()