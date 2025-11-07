'use client'

import { useT } from '@/hooks/use-t'

export function ProjectsHeader() {
  const { t } = useT({
    defaultValue: '' // Will use key as fallback if translation not found
  })

  const title = t('projects.title') || 'Our Projects'
  const subtitle = t('projects.subtitle') || 'Explore our collection of custom work and artisan projects. Each piece is crafted with attention to detail and quality materials.'

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}

