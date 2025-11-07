'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Eye, 
  Users, 
  TrendingUp, 
  Download, 
  Trash2,
  Calendar,
  FileText,
  RefreshCw
} from 'lucide-react'

interface AnalyticsStats {
  totalPageViews: number
  uniqueVisitors: number
  popularPages: Array<{ path: string; views: number }>
  recentEvents: Array<{
    id: string
    pagePath: string
    pageTitle?: string
    createdAt: Date
  }>
  viewsByDay: Array<{ date: string; views: number }>
  viewsByPage: Array<{ path: string; views: number }>
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [isDeleting, setIsDeleting] = useState(false)

  const loadStats = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const startDate = getStartDate(dateRange)
      const params = new URLSearchParams()
      if (startDate) {
        params.append('startDate', startDate.toISOString())
      }

      const response = await fetch(`/api/analytics/stats?${params.toString()}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to load analytics (${response.status})`)
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics'
      setError(errorMessage)
      console.error('Analytics load error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [dateRange])

  const getStartDate = (range: string): Date | null => {
    const now = new Date()
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      default:
        return null
    }
  }

  const handleExport = async () => {
    try {
      const startDate = getStartDate(dateRange)
      const params = new URLSearchParams()
      if (startDate) {
        params.append('startDate', startDate.toISOString())
      }

      const response = await fetch(`/api/analytics/export?${params.toString()}`)
      if (!response.ok) {
        // Try to get error message from JSON response
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to export data (${response.status})`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export analytics data'
      alert(errorMessage)
      console.error('Export error:', err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete analytics data? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const startDate = getStartDate(dateRange)
      const response = await fetch('/api/analytics/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate?.toISOString(),
          endDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete data')
      }

      await loadStats()
      alert('Analytics data deleted successfully')
    } catch (err) {
      alert('Failed to delete analytics data')
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <Button onClick={loadStats} className="mt-4" variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Privacy-focused analytics that respect user consent
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range === '7d' ? '7 days' : range === '30d' ? '30 days' : range === '90d' ? '90 days' : 'All time'}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Page Views</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalPageViews.toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.uniqueVisitors.toLocaleString()}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Popular Pages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Popular Pages
        </h2>
        {stats.popularPages.length > 0 ? (
          <div className="space-y-2">
            {stats.popularPages.map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 dark:text-gray-400 font-medium w-6">
                    #{index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono text-sm">
                    {page.path}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold">
                  {page.views.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No page views in this period</p>
        )}
      </div>

      {/* Recent Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Page Views
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            (Showing last 10)
          </span>
        </h2>
        {stats.recentEvents.length > 0 ? (
          <div className="space-y-2">
            {stats.recentEvents.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-mono text-sm">
                    {event.pagePath}
                  </p>
                  {event.pageTitle && (
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                      {event.pageTitle}
                    </p>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent events</p>
        )}
      </div>
    </div>
  )
}

