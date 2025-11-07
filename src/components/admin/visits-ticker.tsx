'use client'

import { useState, useEffect } from 'react'

interface VisitsTickerProps {
  initialCount: number
  refreshInterval?: number
}

export function VisitsTicker({ initialCount, refreshInterval = 60000 }: VisitsTickerProps) {
  const [count, setCount] = useState(initialCount)
  const [isIncreasing, setIsIncreasing] = useState(false)
  const [time, setTime] = useState(new Date())
  const [date, setDate] = useState(new Date())

  // Update visits count
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics/stats?startDate=' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        if (response.ok) {
          const data = await response.json()
          const newCount = data.totalPageViews || 0
          
          if (newCount > count) {
            setIsIncreasing(true)
            setTimeout(() => setIsIncreasing(false), 500)
          }
          
          setCount(newCount)
        }
      } catch (error) {
        console.error('Error fetching visits:', error)
      }
    }

    const interval = setInterval(fetchStats, refreshInterval)
    fetchStats() // Initial fetch

    return () => clearInterval(interval)
  }, [count, refreshInterval])

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setTime(now)
      setDate(now)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden shadow rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Visits (30 days)
            </h3>
            <div className={`text-4xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300 ${isIncreasing ? 'scale-110' : 'scale-100'}`}>
              {count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Page views from visitors
            </div>
          </div>
          <div className="text-right border-l border-blue-200 dark:border-blue-800 pl-6 ml-6">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              System Time
            </div>
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
              {formatTime(time)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(date)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

