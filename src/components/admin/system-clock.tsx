'use client'

import { useState, useEffect } from 'react'

export function SystemClock() {
  const [time, setTime] = useState(new Date())
  const [date, setDate] = useState(new Date())

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              System Clock
            </h3>
            <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
              {formatTime(time)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(date)}
            </div>
          </div>
          <div className="text-4xl">
            🕐
          </div>
        </div>
      </div>
    </div>
  )
}

