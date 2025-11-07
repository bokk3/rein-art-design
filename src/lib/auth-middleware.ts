import { NextRequest } from 'next/server'
import { auth } from './auth'
import { prisma } from './db'

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  role?: string
  permissions?: any
}

export class AuthError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return null
    }

    // Get user role and permissions
    const userRole = await prisma.userRole.findUnique({
      where: { userId: session.user.id }
    })

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: userRole?.role,
      permissions: userRole?.permissions
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

/**
 * Require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    throw new AuthError('Authentication required')
  }

  return user
}

/**
 * Require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireAuth(request)
  
  if (user.role !== 'admin') {
    throw new AuthError('Admin access required', 403)
  }

  return user
}

/**
 * Require admin or editor role
 */
export async function requireEditor(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireAuth(request)
  
  if (!user.role || !['admin', 'editor'].includes(user.role)) {
    throw new AuthError('Editor access required', 403)
  }

  return user
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: AuthenticatedUser, permission: string): boolean {
  if (user.role === 'admin') {
    return true // Admin has all permissions
  }

  if (!user.permissions || typeof user.permissions !== 'object') {
    return false
  }

  return user.permissions[permission] === true
}

/**
 * Require specific permission
 */
export async function requirePermission(request: NextRequest, permission: string): Promise<AuthenticatedUser> {
  const user = await requireAuth(request)
  
  if (!hasPermission(user, permission)) {
    throw new AuthError(`Permission '${permission}' required`, 403)
  }

  return user
}

/**
 * Simple auth middleware that returns success/failure result
 */
export async function authMiddleware(request: NextRequest): Promise<{
  success: boolean
  user?: AuthenticatedUser
  error?: string
}> {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return { success: false, error: 'Authentication required' }
    }

    return { success: true, user }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    }
  }
}