'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Languages, 
  Palette, 
  Mail, 
  Search, 
  Share2, 
  Building2,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react'

const settingsNavItems = [
  {
    id: 'languages',
    label: 'Languages & Localization',
    href: '/admin/settings',
    icon: Languages,
    description: 'Manage languages and translations'
  },
  {
    id: 'appearance',
    label: 'Appearance & Theme',
    href: '/admin/settings/appearance',
    icon: Palette,
    description: 'Customize theme and colors'
  },
  {
    id: 'email',
    label: 'Email Configuration',
    href: '/admin/settings/email',
    icon: Mail,
    description: 'SMTP and email settings'
  },
  {
    id: 'seo',
    label: 'SEO & Meta Settings',
    href: '/admin/settings/seo',
    icon: Search,
    description: 'Meta tags and search optimization'
  },
  {
    id: 'social',
    label: 'Social Media',
    href: '/admin/settings/social',
    icon: Share2,
    description: 'Social links and sharing'
  },
  {
    id: 'business',
    label: 'Business Information',
    href: '/admin/settings/business',
    icon: Building2,
    description: 'Company details and contact info'
  }
]

export function SettingsSidebar() {
  const pathname = usePathname()
  
  const getActiveId = (): string => {
    if (!pathname) return 'languages'
    const normalizedPath = pathname.split('?')[0].replace(/\/$/, '') || ''
    
    if (normalizedPath === '/admin/settings') return 'languages'
    if (normalizedPath.includes('/admin/settings/appearance')) return 'appearance'
    if (normalizedPath.includes('/admin/settings/email')) return 'email'
    if (normalizedPath.includes('/admin/settings/seo')) return 'seo'
    if (normalizedPath.includes('/admin/settings/social')) return 'social'
    if (normalizedPath.includes('/admin/settings/business')) return 'business'
    return 'languages'
  }

  const activeId = getActiveId()

  // Ensure we have items to render
  if (!settingsNavItems || settingsNavItems.length === 0) {
    return (
      <aside className="w-64 flex-shrink-0">
        <div className="sticky top-20 pr-6 border-r border-gray-200 dark:border-gray-700/50">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure your system
            </p>
          </div>
          <div className="text-sm text-red-500 p-3">No navigation items available</div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-20 pr-6 border-r border-gray-200 dark:border-gray-700/50">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure your system
          </p>
        </div>

        <nav className="admin-nav space-y-1">
          {settingsNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeId === item.id

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                  }
                `}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${isActive ? 'text-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-white'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
