'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Settings,
  LogOut,
  ArrowLeft,
  Layout,
  Image,
  ChevronDown,
  Edit3,
  BarChart3
} from 'lucide-react'
import { useSession, signOut } from '../../lib/auth-client'
import { useT } from '@/hooks/use-t'
import { useLanguage } from '@/contexts/language-context'

export function AdminNavigation() {
  const { t } = useT()
  const { currentLanguage, languages } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContentDropdownOpen, setIsContentDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleContentDropdown = () => setIsContentDropdownOpen(!isContentDropdownOpen)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsContentDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Primary navigation items (always visible)
  const primaryNavLinks = [
    { href: '/admin', label: t('admin.dashboard'), icon: Home },
    { href: '/admin/projects', label: t('admin.projects'), icon: FolderOpen },
  ]

  // Content management dropdown items
  const contentNavLinks = [
    { href: '/admin/page-builder', label: t('admin.pageBuilder'), icon: Layout },
    { href: '/admin/gallery', label: t('admin.gallery'), icon: Image },
    { href: '/admin/content', label: t('admin.content'), icon: FileText },
  ]

  // Secondary navigation items
  const secondaryNavLinks = [
    { href: '/admin/messages', label: t('admin.messages'), icon: MessageSquare },
    { href: '/admin/analytics', label: t('admin.analytics'), icon: BarChart3 },
    { href: '/admin/settings', label: t('admin.settings'), icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const isContentSectionActive = () => {
    return contentNavLinks.some(link => isActive(link.href))
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

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (!session) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <nav className="admin-nav bg-white/90 dark:bg-[#181818]/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/30 sticky top-16 z-[70] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo and Back to Site */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-shrink-0">
            <Link href={getLocalizedHref('/')} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors whitespace-nowrap">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{t('nav.backToSite') || 'Terug naar site'}</span>
            </Link>
            <div className="h-5 sm:h-6 w-px bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
            <Link href={getLocalizedHref('/admin')} className="flex items-center flex-shrink-0">
              <span className="text-base sm:text-lg md:text-xl font-bold text-black dark:text-white">Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-2 flex-1 mx-4">
            {/* Primary Navigation */}
            {primaryNavLinks.map((link) => {
              const Icon = link.icon
              const isDisabled = !session
              return (
                <Link
                  key={link.href}
                  href={isDisabled ? '#' : getLocalizedHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`group relative flex items-center p-2.5 rounded-xl transition-all duration-200 ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : isActive(link.href)
                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-sm'
                  }`}
                  title={link.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 text-xs glass border border-white/20 dark:border-gray-700/30 text-gray-900 dark:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[80] shadow-lg">
                    {link.label}
                  </span>
                </Link>
              )
            })}

            {/* Content Management Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={session ? toggleContentDropdown : undefined}
                disabled={!session}
                className={`group relative flex items-center p-2.5 rounded-xl transition-all duration-200 ${
                  !session
                    ? 'opacity-50 cursor-not-allowed'
                    : isContentSectionActive()
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-sm'
                }`}
                title="Content Management"
              >
                <Edit3 className="h-5 w-5" />
                <ChevronDown className={`h-3 w-3 ml-1 transition-transform duration-200 ${isContentDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 text-xs glass border border-white/20 dark:border-gray-700/30 text-gray-900 dark:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[80] shadow-lg">
                  Content
                </span>
              </button>
              
              {isContentDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 glass border border-white/20 dark:border-gray-700/30 rounded-xl shadow-2xl z-[60] overflow-hidden animate-fade-in">
                  <div className="py-2">
                    {contentNavLinks.map((link) => {
                      const Icon = link.icon
                      const isDisabled = !session
                      return (
                        <Link
                          key={link.href}
                          href={isDisabled ? '#' : getLocalizedHref(link.href)}
                          onClick={(e) => {
                            handleNavClick(e, link.href)
                            setIsContentDropdownOpen(false)
                          }}
                          className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : isActive(link.href)
                              ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Navigation */}
            {secondaryNavLinks.map((link) => {
              const Icon = link.icon
              const isDisabled = !session
              return (
                <Link
                  key={link.href}
                  href={isDisabled ? '#' : getLocalizedHref(link.href)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`group relative flex items-center p-2.5 rounded-xl transition-all duration-200 ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : isActive(link.href)
                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-sm'
                  }`}
                  title={link.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 text-xs glass border border-white/20 dark:border-gray-700/30 text-gray-900 dark:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[80] shadow-lg">
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {session?.user && (
              <>
                <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 max-w-24 lg:max-w-32 truncate">
                  {session.user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center text-xs lg:text-sm"
                >
                  <LogOut className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-1.5 lg:mr-2" />
                  <span className="hidden lg:inline">{t('auth.signOut')}</span>
                </Button>
              </>
            )}
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
            <div className="py-4 space-y-1">
              {/* Back to Site - Mobile */}
              <Link
                href={getLocalizedHref('/')}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-3" />
                <span className="font-medium">{t('nav.backToSite') || 'Terug naar site'}</span>
              </Link>
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              {/* Primary Navigation - Mobile */}
              {primaryNavLinks.map((link) => {
                const Icon = link.icon
                const isDisabled = !session
                return (
                  <Link
                    key={link.href}
                    href={isDisabled ? '#' : getLocalizedHref(link.href)}
                    onClick={(e) => {
                      handleNavClick(e, link.href)
                      setIsMenuOpen(false)
                    }}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : isActive(link.href)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {link.label}
                  </Link>
                )
              })}

              {/* Content Management Section - Mobile */}
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Content Management
                </div>
                <div className="space-y-1">
                  {contentNavLinks.map((link) => {
                    const Icon = link.icon
                    const isDisabled = !session
                    return (
                      <Link
                        key={link.href}
                        href={isDisabled ? '#' : getLocalizedHref(link.href)}
                        onClick={(e) => {
                          handleNavClick(e, link.href)
                          setIsMenuOpen(false)
                        }}
                        className={`flex items-center px-2 py-2 text-sm font-medium transition-colors rounded ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : isActive(link.href)
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Secondary Navigation - Mobile */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              {secondaryNavLinks.map((link) => {
                const Icon = link.icon
                const isDisabled = !session
                return (
                  <Link
                    key={link.href}
                    href={isDisabled ? '#' : getLocalizedHref(link.href)}
                    onClick={(e) => {
                      handleNavClick(e, link.href)
                      setIsMenuOpen(false)
                    }}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : isActive(link.href)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {link.label}
                  </Link>
                )
              })}
              
              {/* User Menu - Mobile */}
              {session?.user && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    {session.user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    {t('auth.signOut')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}