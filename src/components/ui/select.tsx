import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-11 w-full rounded-lg border-2 border-gray-200 dark:border-gray-700',
          'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
          'text-gray-900 dark:text-gray-100',
          'px-4 py-2.5 text-sm',
          'shadow-sm transition-all duration-200',
          'focus-visible:outline-none focus-visible:border-gray-900 dark:focus-visible:border-gray-300',
          'focus-visible:ring-2 focus-visible:ring-gray-900/10 dark:focus-visible:ring-gray-300/10',
          'focus-visible:shadow-md focus-visible:shadow-gray-900/5 dark:focus-visible:shadow-gray-300/5',
          'hover:border-gray-300 dark:hover:border-gray-600',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-900/50',
          'appearance-none bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

export { Select }