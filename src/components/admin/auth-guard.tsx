'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirect?: boolean
}

export function AuthGuard({ children, requireAuth = true, redirect = true }: AuthGuardProps) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && requireAuth && !session && redirect) {
      router.push('/')
    }
  }, [session, isPending, requireAuth, redirect, router])

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If auth required and no session, don't render (redirect will happen if redirect=true)
  if (requireAuth && !session) {
    if (redirect) {
      return null // Will redirect via useEffect
    }
    // If not redirecting, return null and let the component handle the access denied message
    return null
  }

  return <>{children}</>
}

