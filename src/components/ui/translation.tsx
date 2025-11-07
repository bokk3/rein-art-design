'use client'

import { useTSync } from '@/hooks/use-t'

interface TranslationProps {
  translationKey: string
  fallback?: string
  className?: string
  as?: 'span' | 'div' | 'p' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/**
 * Translation component for easy use in JSX
 * 
 * @example
 * <Translation translationKey="button.submit" fallback="Submit" />
 */
export function Translation({ translationKey, fallback, className, as = 'span' }: TranslationProps) {
  const { t, isLoading } = useTSync(translationKey, { defaultValue: fallback || translationKey })

  const Component = as

  return (
    <Component className={className}>
      {isLoading ? fallback || translationKey : t}
    </Component>
  )
}

