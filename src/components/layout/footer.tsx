'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCookieConsent } from '@/contexts/cookie-consent-context'
import { useT } from '@/hooks/use-t'
import { useLanguage } from '@/contexts/language-context'
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Share2, Music } from 'lucide-react'

interface BusinessInfo {
  companyName: string
  legalName: string
  iban: string
  vatNumber: string
}

interface SocialLinks {
  facebook: string
  instagram: string
  linkedin: string
  twitter: string
  youtube: string
  pinterest: string
  tiktok: string
}

export function Footer() {
  const { t } = useT()
  const { currentLanguage, languages } = useLanguage()
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null)
  
  let setShowBanner: ((show: boolean) => void) | null = null
  try {
    const cookieConsent = useCookieConsent()
    setShowBanner = cookieConsent.setShowBanner
  } catch {
    // Footer used outside CookieConsentProvider - cookie preferences won't be available
  }
  
  const currentYear = new Date().getFullYear()

  // Fetch business info and social links
  useEffect(() => {
    Promise.all([
      fetch('/api/business-info').then(res => res.json()),
      fetch('/api/social-links').then(res => res.json())
    ])
      .then(([infoData, socialData]) => {
        if (infoData) {
          setBusinessInfo({
            companyName: infoData.companyName || '',
            legalName: infoData.legalName || 'Rein Art Design BVBA',
            iban: infoData.iban || 'BE 92 0018 2117 7323',
            vatNumber: infoData.vatNumber || 'BE 0682 403 611'
          })
        }
        if (socialData) {
          setSocialLinks(socialData)
        }
      })
      .catch(err => console.error('Error fetching footer data:', err))
  }, [])

  // Helper function to add language parameter to URLs
  const getLocalizedHref = (href: string) => {
    const defaultLang = languages.find(l => l.isDefault)
    if (currentLanguage === defaultLang?.code) {
      return href
    }
    const separator = href.includes('?') ? '&' : '?'
    return `${href}${separator}lang=${currentLanguage}`
  }

  // Get active social links
  const getActiveSocialLinks = () => {
    if (!socialLinks) return []
    const links = []
    if (socialLinks.facebook) links.push({ platform: 'facebook', url: socialLinks.facebook, icon: Facebook, color: '#1877F2' })
    if (socialLinks.instagram) links.push({ platform: 'instagram', url: socialLinks.instagram, icon: Instagram, color: '#E4405F' })
    if (socialLinks.linkedin) links.push({ platform: 'linkedin', url: socialLinks.linkedin, icon: Linkedin, color: '#0A66C2' })
    if (socialLinks.twitter) links.push({ platform: 'twitter', url: socialLinks.twitter, icon: Twitter, color: '#1DA1F2' })
    if (socialLinks.youtube) links.push({ platform: 'youtube', url: socialLinks.youtube, icon: Youtube, color: '#FF0000' })
    if (socialLinks.pinterest) links.push({ platform: 'pinterest', url: socialLinks.pinterest, icon: Share2, color: '#BD081C' })
    if (socialLinks.tiktok) links.push({ platform: 'tiktok', url: socialLinks.tiktok, icon: Music, color: '#000000' })
    return links
  }

  const activeSocialLinks = getActiveSocialLinks()

  return (
    <footer className="bg-white dark:bg-[#181818] border-t border-gray-200 dark:border-gray-700/50 transition-colors relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">{t('footer.brand')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('footer.tagline')}
            </p>
            {/* Social Media Links - integrated in brand section */}
            {activeSocialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {activeSocialLinks.map(({ platform, url, icon: Icon, color }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all hover:scale-110"
                    style={{ color }}
                    aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
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

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              © {currentYear} {businessInfo?.companyName || t('footer.brand')}. {t('footer.allRightsReserved')}
            </p>
            {businessInfo && (businessInfo.legalName || businessInfo.iban || businessInfo.vatNumber) && (
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                {businessInfo.legalName && <p>{businessInfo.legalName}</p>}
                {businessInfo.iban && <p>IBAN: {businessInfo.iban}</p>}
                {businessInfo.vatNumber && <p>BTW: {businessInfo.vatNumber}</p>}
              </div>
            )}
            {!businessInfo && (
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>Rein Art Design BVBA</p>
                <p>IBAN: BE 92 0018 2117 7323</p>
                <p>BTW: BE 0682 403 611</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}