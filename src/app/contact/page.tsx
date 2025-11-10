'use client'

import { ContactForm } from '@/components/contact-form'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useT } from '@/hooks/use-t'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BusinessHours {
  monday: { open: string; close: string; closed: boolean }
  tuesday: { open: string; close: string; closed: boolean }
  wednesday: { open: string; close: string; closed: boolean }
  thursday: { open: string; close: string; closed: boolean }
  friday: { open: string; close: string; closed: boolean }
  saturday: { open: string; close: string; closed: boolean }
  sunday: { open: string; close: string; closed: boolean }
}

interface BusinessInfo {
  contactEmail: string
  contactPhone: string
  address: string
  city: string
  postalCode: string
}

export default function ContactPage() {
  const { t } = useT()
  const { currentLanguage, languages } = useLanguage()
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null)

  // Fetch business hours and info from API
  useEffect(() => {
    Promise.all([
      fetch('/api/business-hours').then(res => res.json()),
      fetch('/api/business-info').then(res => res.json())
    ])
      .then(([hoursData, infoData]) => {
        if (hoursData.businessHours) {
          setBusinessHours(hoursData.businessHours)
        }
        if (infoData) {
          setBusinessInfo({
            contactEmail: infoData.contactEmail || 'contact@reinartdesign.be',
            contactPhone: infoData.contactPhone || '+ 32 (0) 487 837 041',
            address: infoData.address || 'Bornestraat 285',
            city: infoData.city || 'Wilsele',
            postalCode: infoData.postalCode || '3012'
          })
        }
      })
      .catch(err => console.error('Error fetching business data:', err))
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

  // Format time from HH:mm to readable format
  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Get day name - with fallback if translation key doesn't exist
  const getDayName = (day: string): string => {
    const dayMap: Record<string, { key: string; fallback: Record<string, string> }> = {
      monday: { 
        key: 'contact.monday', 
        fallback: { nl: 'Maandag', en: 'Monday', fr: 'Lundi', de: 'Montag' }
      },
      tuesday: { 
        key: 'contact.tuesday', 
        fallback: { nl: 'Dinsdag', en: 'Tuesday', fr: 'Mardi', de: 'Dienstag' }
      },
      wednesday: { 
        key: 'contact.wednesday', 
        fallback: { nl: 'Woensdag', en: 'Wednesday', fr: 'Mercredi', de: 'Mittwoch' }
      },
      thursday: { 
        key: 'contact.thursday', 
        fallback: { nl: 'Donderdag', en: 'Thursday', fr: 'Jeudi', de: 'Donnerstag' }
      },
      friday: { 
        key: 'contact.friday', 
        fallback: { nl: 'Vrijdag', en: 'Friday', fr: 'Vendredi', de: 'Freitag' }
      },
      saturday: { 
        key: 'contact.saturday', 
        fallback: { nl: 'Zaterdag', en: 'Saturday', fr: 'Samedi', de: 'Samstag' }
      },
      sunday: { 
        key: 'contact.sunday', 
        fallback: { nl: 'Zondag', en: 'Sunday', fr: 'Dimanche', de: 'Sonntag' }
      }
    }
    
    const dayInfo = dayMap[day]
    if (!dayInfo) return day
    
    // Try to get translation
    const translated = t(dayInfo.key)
    
    // If translation is empty or equals the key, use fallback based on current language
    if (!translated || translated === dayInfo.key || translated === '') {
      return dayInfo.fallback[currentLanguage] || dayInfo.fallback.nl || day
    }
    
    return translated
  }

  // Group days with same opening hours
  const groupBusinessHours = (hours: BusinessHours) => {
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
    
    // Create a key for each day's hours
    const getHoursKey = (dayHours: { open: string; close: string; closed: boolean }) => {
      if (dayHours.closed) return 'closed'
      return `${dayHours.open}-${dayHours.close}`
    }
    
    // Group consecutive days with same hours
    const groups: Array<{
      startDay: string
      endDay: string
      hours: { open: string; close: string; closed: boolean }
    }> = []
    
    let currentGroup: { startDay: string; endDay: string; hours: { open: string; close: string; closed: boolean } } | null = null
    
    dayOrder.forEach((day) => {
      const dayHours = hours[day]
      if (!dayHours) return
      
      const hoursKey = getHoursKey(dayHours)
      
      if (!currentGroup || getHoursKey(currentGroup.hours) !== hoursKey) {
        // Start new group
        if (currentGroup) {
          groups.push(currentGroup)
        }
        currentGroup = {
          startDay: day,
          endDay: day,
          hours: dayHours
        }
      } else {
        // Extend current group
        currentGroup.endDay = day
      }
    })
    
    // Add last group
    if (currentGroup) {
      groups.push(currentGroup)
    }
    
    return groups
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in">
          <Link href={getLocalizedHref('/')} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">{t('nav.home')}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">{t('nav.contact')}</span>
        </nav>

        {/* Page header */}
        <header className="mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            {t('contact.subtitle')}
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 animate-fade-in">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-8">
                <MessageCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('contact.sendMessage')}
                </h2>
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {t('contact.contactInformation')}
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] shrink-0">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('contact.email')}</div>
                    {businessInfo ? (
                      <a href={`mailto:${businessInfo.contactEmail}`} className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                        {businessInfo.contactEmail}
                      </a>
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100 font-medium">contact@reinartdesign.be</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] shrink-0">
                    <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('contact.phone')}</div>
                    {businessInfo ? (
                      <a href={`tel:${businessInfo.contactPhone.replace(/\s/g, '')}`} className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                        {businessInfo.contactPhone}
                      </a>
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100 font-medium">+ 32 (0) 487 837 041</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] shrink-0">
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('contact.location')}</div>
                    {businessInfo ? (
                      <span className="text-gray-900 dark:text-gray-100 font-medium whitespace-pre-line">
                        {businessInfo.address}{'\n'}{businessInfo.postalCode} {businessInfo.city}
                      </span>
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100 font-medium whitespace-pre-line">
                        Bornestraat 285{'\n'}3012 Wilsele
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {t('contact.businessHours')}
              </h3>
              <div className="space-y-3">
                {businessHours ? (
                  groupBusinessHours(businessHours).map((group, index, array) => {
                    const isLast = index === array.length - 1
                    const startDayKey = getDayName(group.startDay)
                    const endDayKey = getDayName(group.endDay)
                    const dayLabel = group.startDay === group.endDay
                      ? t(startDayKey)
                      : `${t(startDayKey)} - ${t(endDayKey)}`
                    
                    return (
                      <div key={`${group.startDay}-${group.endDay}`} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {dayLabel}
                        </span>
                        {group.hours.closed ? (
                          <span className="text-gray-500 dark:text-gray-400 font-semibold">{t('contact.closed')}</span>
                        ) : (
                          <span className="text-gray-900 dark:text-gray-100 font-semibold">
                            {formatTime(group.hours.open)} - {formatTime(group.hours.close)}
                          </span>
                        )}
                      </div>
                    )
                  })
                ) : (
                  // Fallback while loading
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{t('contact.mondayFriday')}</span>
                      <span className="text-gray-900 dark:text-gray-100 font-semibold">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{t('contact.saturday')}</span>
                      <span className="text-gray-900 dark:text-gray-100 font-semibold">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{t('contact.sunday')}</span>
                      <span className="text-gray-500 dark:text-gray-400 font-semibold">{t('contact.closed')}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="glass border border-blue-200/50 dark:border-blue-800/50 rounded-2xl shadow-xl p-8 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10">
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                    {t('contact.quickResponse')}
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    {t('contact.quickResponseText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
          <Link 
            href={getLocalizedHref('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors font-medium"
          >
            {t('contact.backToHome')}
          </Link>
        </div>
      </main>
    </div>
  )
}