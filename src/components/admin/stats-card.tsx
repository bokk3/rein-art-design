'use client'

import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  subtitle?: string
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  className?: string
}

export function StatsCard({ title, value, icon, subtitle, trend, className = '' }: StatsCardProps) {
  return (
    <div className={`glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${className} animate-fade-in`}>
      <div className="p-6 bg-gradient-to-br from-white/80 via-white/60 to-gray-50/80 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/80">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              {title}
            </dt>
            <dd className="flex items-baseline gap-3 mb-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              {trend && (
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  trend.positive !== false 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  <span>{trend.positive !== false ? '+' : ''}{trend.value}</span>
                  <span className="text-gray-600 dark:text-gray-400 font-normal">
                    {trend.label}
                  </span>
                </div>
              )}
            </dd>
            {subtitle && (
              <dd className="text-xs font-medium text-gray-500 dark:text-gray-500 mt-1">
                {subtitle}
              </dd>
            )}
          </div>
          <div className="flex-shrink-0 ml-4 p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 shadow-lg">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

