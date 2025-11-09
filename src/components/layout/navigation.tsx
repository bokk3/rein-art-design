'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useT } from '@/hooks/use-t'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const { t } = useT()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [showThemeToggle, setShowThemeToggle] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const { currentLanguage, languages, setLanguage, isLoading } = useLanguage()
  const languageButtonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Check if we're on the homepage
  const isHomepage = pathname === '/'

  // Check if component is mounted (for portal)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track scroll position to show/hide border
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 0)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if theme toggle should be shown
  useEffect(() => {
    const checkThemeSettings = async () => {
      try {
        const response = await fetch('/api/admin/theme-settings')
        if (response.ok) {
          const settings = await response.json()
          setShowThemeToggle(settings.mode === 'user-choice' && settings.allowUserToggle)
        }
      } catch (error) {
        // Default to showing theme toggle if settings can't be loaded
        setShowThemeToggle(true)
      }
    }
    
    checkThemeSettings()
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleLanguageMenu = () => {
    if (!isLanguageMenuOpen && languageButtonRef.current) {
      // Calculate position for fixed dropdown
      const rect = languageButtonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 8, // 8px = mt-2 equivalent
        right: window.innerWidth - rect.right
      })
    }
    setIsLanguageMenuOpen(!isLanguageMenuOpen)
  }

  // Helper function to add language parameter to URLs
  const getLocalizedHref = (href: string) => {
    const defaultLang = languages.find(l => l.isDefault)
    if (currentLanguage === defaultLang?.code) {
      return href
    }
    const separator = href.includes('?') ? '&' : '?'
    return `${href}${separator}lang=${currentLanguage}`
  }

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ]

  // Determine nav background based on scroll state and homepage
  const getNavBackground = () => {
    // If scrolled, show background with consistent dark mode color
    if (isScrolled) {
      return 'bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md'
    }
    
    // If on homepage and not scrolled, make it transparent to blend with hero
    if (isHomepage && !isScrolled) {
      return 'bg-transparent backdrop-blur-none'
    }
    
    // Default background for other pages - lighter when not scrolled
    return 'bg-white/90 dark:bg-[#181818]/85 backdrop-blur-md'
  }

  return (
    <nav className={`main-nav sticky top-0 z-[60] transition-all duration-300 ${getNavBackground()} ${
      isScrolled 
        ? 'border-b border-gray-200/50 dark:border-gray-700/30 shadow-sm' 
        : 'border-b-0 shadow-none'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'h-16 lg:h-18' : 'h-20 lg:h-24'
        }`}>
          {/* Logo */}
          <Link href={getLocalizedHref('/')} className="flex items-center justify-center group flex-shrink-0 min-w-0 h-full py-2">
            <Image
              src="/logo.png"
              alt="Rein Art Design"
              width={140}
              height={50}
              className={`w-auto object-contain dark:brightness-0 dark:invert transition-all duration-300 group-hover:opacity-80 ${
                isScrolled
                  ? 'h-8 sm:h-9 md:h-10 max-w-[80px] sm:max-w-[90px] md:max-w-[100px]'
                  : 'h-10 sm:h-12 md:h-14 lg:h-16 max-w-[100px] sm:max-w-[120px] md:max-w-[140px]'
              }`}
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={getLocalizedHref(link.href)}
                className={`relative px-5 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium rounded-lg hover:bg-gray-100/50 dark:hover:bg-[#1a1a1a]/50 group ${
                  isScrolled ? 'text-base' : 'text-lg lg:text-xl'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </Link>
            ))}
            
            <div className="flex items-center gap-3 lg:gap-4 ml-2">
              {/* Theme Toggle - only show if enabled in settings */}
              {showThemeToggle && <ThemeToggle />}
              
              {/* Language Dropdown */}
              {!isLoading && languages.length > 1 && (
                <div className="relative">
                  <Button
                    ref={languageButtonRef}
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguageMenu}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="uppercase font-medium">
                      {currentLanguage}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  
                  {isLanguageMenuOpen && mounted && createPortal(
                    <>
                      {/* Backdrop to close on click outside */}
                      <div 
                        className="fixed inset-0 z-[85]" 
                        onClick={() => setIsLanguageMenuOpen(false)}
                      />
                      {/* Dropdown with fixed positioning */}
                      <div 
                        className="fixed w-48 bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-2xl z-[90] overflow-hidden animate-fade-in"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          right: `${dropdownPosition.right}px`
                        }}
                      >
                        <div className="py-2">
                          {languages.map((language) => (
                            <button
                              key={language.code}
                              onClick={() => {
                                setLanguage(language.code)
                                setIsLanguageMenuOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
                                currentLanguage === language.code
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-gray-700/50 dark:to-gray-600/50 text-blue-700 dark:text-blue-300 font-semibold'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/30'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{language.name}</span>
                                <span className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
                                  {language.code}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>,
                    document.body
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="py-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={getLocalizedHref(link.href)}
                  className="block px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Theme Toggle - only show if enabled in settings */}
              {showThemeToggle && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('nav.theme')}</span>
                    <ThemeToggle />
                  </div>
                </div>
              )}
              
              {/* Mobile Language Selector */}
              {!isLoading && languages.length > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 mt-3">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('nav.language')}</div>
                  <div className="space-y-1">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setLanguage(language.code)
                          setIsMenuOpen(false)
                        }}
                        className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                          currentLanguage === language.code
                            ? 'bg-blue-50 dark:bg-gray-700/50 text-blue-700 dark:text-blue-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{language.name}</span>
                          <span className="text-xs uppercase text-gray-500 dark:text-gray-400">
                            {language.code}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}