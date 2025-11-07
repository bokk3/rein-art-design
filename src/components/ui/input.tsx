import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border-2 border-gray-200 dark:border-gray-700',
          'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
          'text-gray-900 dark:text-gray-100',
          'px-4 py-2.5 text-sm',
          'shadow-sm transition-all duration-200',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'focus-visible:outline-none focus-visible:border-gray-900 dark:focus-visible:border-gray-300',
          'focus-visible:ring-2 focus-visible:ring-gray-900/10 dark:focus-visible:ring-gray-300/10',
          'focus-visible:shadow-md focus-visible:shadow-gray-900/5 dark:focus-visible:shadow-gray-300/5',
          'hover:border-gray-300 dark:hover:border-gray-600',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-900/50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }