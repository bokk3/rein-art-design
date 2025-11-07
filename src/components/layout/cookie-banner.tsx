'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Settings, Check } from 'lucide-react'
import { useCookieConsent } from '@/contexts/cookie-consent-context'
import Link from 'next/link'

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, savePreferences, setShowBanner } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  })

  if (!showBanner) return null

  const handleSavePreferences = async () => {
    await savePreferences(preferences)
  }

  const handleAcceptAll = async () => {
    await acceptAll()
  }

  const handleRejectAll = async () => {
    await rejectAll()
  }

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {!showDetails ? (
          // Simple banner view
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cookie Preferences
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                By clicking "Accept All", you consent to our use of cookies. You can also customize your preferences 
                or{' '}
                <Link 
                  href="/privacy" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  learn more about our cookie policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          // Detailed preferences view
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cookie Preferences
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Essential Cookies - Always enabled */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Essential Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Required for the website to function properly
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Always Active</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  These cookies are necessary for the website to function and cannot be switched off. 
                  They include authentication, session management, and security features.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Help us understand how visitors interact with our website
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      preferences.analytics ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  These cookies collect anonymous information about how you use our website, 
                  which helps us improve our services and user experience.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Used to deliver personalized advertisements and track campaign performance
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      preferences.marketing ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  These cookies track your browsing habits to show you relevant advertisements 
                  and measure the effectiveness of our marketing campaigns.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
              >
                Reject All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPreferences({ essential: true, analytics: true, marketing: true })
                }}
              >
                Accept All
              </Button>
              <Button
                size="sm"
                onClick={handleSavePreferences}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

