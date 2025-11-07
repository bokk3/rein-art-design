"use client"

import { useState } from "react"
import { signIn, signOut, signUp, useSession } from "../lib/auth-client"
import { useT } from "@/hooks/use-t"

export function AuthForm() {
  const { t } = useT()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session, isPending } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (isSignUp) {
        await signUp.email({
          email,
          password,
          name,
        })
      } else {
        await signIn.email({
          email,
          password,
        })
      }
      // Redirect to admin after successful login
      window.location.href = "/admin"
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('auth.welcome')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('auth.loggedInAs')} {session.user.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
        >
          {t('auth.signOut')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
        {isSignUp ? t('auth.createAccount') : t('auth.signIn')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('form.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder={t('form.name')}
              required
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('form.email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            placeholder={t('form.email')}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {t('form.password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
            placeholder={t('form.password')}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500"
        >
          {isSubmitting ? t('message.loading') : isSignUp ? t('auth.signUp') : t('auth.signIn')}
        </button>
      </form>
      
      <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.noAccount')}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            {isSignUp ? t('auth.signIn') : t('auth.signUp')}
          </button>
        </p>
      </div>
    </div>
  )
}