import { auth } from '../src/lib/auth'

async function createAdmin() {
  try {
    console.log('🔐 Creating admin account...')
    
    // Use Better Auth to create the admin user properly
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
    if (error.message?.includes('already exists')) {
      console.log('👤 Admin account already exists')
    } else {
      console.error('❌ Failed to create admin:', error.message)
    }
  }
}

createAdmin()