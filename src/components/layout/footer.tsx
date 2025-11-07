'use client'

import Link from 'next/link'
import { useCookieConsent } from '@/contexts/cookie-consent-context'
import { useT } from '@/hooks/use-t'
import { useLanguage } from '@/contexts/language-context'

export function Footer() {
  const { t } = useT()
  const { currentLanguage, languages } = useLanguage()
  let setShowBanner: ((show: boolean) => void) | null = null
  try {
    const cookieConsent = useCookieConsent()
    setShowBanner = cookieConsent.setShowBanner
  } catch {
    // Footer used outside CookieConsentProvider - cookie preferences won't be available
  }
  
  const currentYear = new Date().getFullYear()

  // Helper function to add language parameter to URLs
  const getLocalizedHref = (href: string) => {
    const defaultLang = languages.find(l => l.isDefault)
    if (currentLanguage === defaultLang?.code) {
      return href
    }
    const separator = href.includes('?') ? '&' : '?'
    return `${href}${separator}lang=${currentLanguage}`
  }

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">{t('footer.brand')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={getLocalizedHref('/')} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/projects')} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/about')} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/contact')} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {t('footer.termsOfService')}
                </Link>
              </li>
              {setShowBanner && (
                <li>
                  <button
                    onClick={() => setShowBanner(true)}
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors text-left"
                  >
                    {t('footer.cookiePreferences')}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © {currentYear} {t('footer.brand')}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}