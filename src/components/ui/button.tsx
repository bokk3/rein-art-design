import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98] transform-gpu',
          {
            // Default - Beautiful gradient with depth
            'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-white dark:to-gray-100 text-white dark:text-gray-900 shadow-lg shadow-gray-900/20 dark:shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-900/30 dark:hover:shadow-gray-100/30 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 dark:hover:from-gray-50 dark:hover:via-gray-100 dark:hover:to-gray-50': variant === 'default',
            // Destructive - Elegant red with glow
            'bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:from-red-500 hover:via-red-400 hover:to-red-500': variant === 'destructive',
            // Outline - Refined border with subtle hover
            'border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md': variant === 'outline',
            // Secondary - Soft and elegant
            'bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-gray-900 dark:text-gray-100 shadow-sm hover:from-gray-200 hover:via-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:via-gray-600 dark:hover:to-gray-700 hover:shadow-md': variant === 'secondary',
            // Ghost - Minimal with smooth hover
            'hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-900 dark:text-gray-100 hover:shadow-sm': variant === 'ghost',
            // Link - Clean underline effect
            'text-gray-900 dark:text-gray-100 underline-offset-4 hover:underline hover:text-gray-700 dark:hover:text-gray-300': variant === 'link',
          },
          {
            'h-10 px-6 py-2.5 rounded-lg text-sm': size === 'default',
            'h-8 px-4 py-1.5 rounded-md text-xs': size === 'sm',
            'h-12 px-8 py-3 rounded-lg text-base': size === 'lg',
            'h-10 w-10 rounded-lg': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }