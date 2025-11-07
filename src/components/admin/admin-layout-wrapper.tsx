'use client'

import { useEffect } from 'react'
import { AuthGuard } from './auth-guard'

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add data attribute to body to hide regular nav/footer
    document.body.setAttribute('data-admin', 'true')
    
    // Cleanup when component unmounts
    return () => {
      document.body.removeAttribute('data-admin')
    }
  }, [])

  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  )
}