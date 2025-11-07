"use client"

import { useState, useEffect } from 'react'
import { useSession } from "../lib/auth-client"
import Link from "next/link"
import { VisitsTicker } from './admin/visits-ticker'
import { StatsCard } from './admin/stats-card'
import { AnalyticsChart } from './admin/analytics-chart'
import { ServerStats } from './admin/server-stats'

interface DashboardStats {
  projects: {
    total: number
    published: number
    unpublished: number
    recent: number
  }
  content: {
    total: number
    published: number
    unpublished: number
    recent: number
  }
  messages: {
    total: number
    unread: number
    read: number
    recent: number
  }
  users: {
    total: number
  }
  analytics: {
    totalPageViews: number
    uniqueVisitors: number
    viewsByDay: Array<{ date: string; views: number }>
    popularPages: Array<{ path: string; views: number }>
  }
  server: {
    uptime: string
    uptimeSeconds: number
    nodeVersion: string
    platform: string
    memory: {
      used: number
      total: number
      rss: number
    }
  }
}

export function AdminDashboard() {
  const { data: session, isPending } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if session check is complete and we have a session
    if (!isPending) {
      if (session) {
        fetchStats()
        // Refresh stats every 30 seconds
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
      } else {
        // If no session and not pending, stop loading
        setLoading(false)
      }
    }
  }, [session, isPending])

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to access the admin panel.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's an overview of your system.
        </p>
      </div>

      {/* Visits Ticker with Clock */}
      {stats && (
        <VisitsTicker initialCount={stats.analytics.totalPageViews} />
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {stats && (
          <>
            <StatsCard
              title="Projects"
              value={stats.projects.total}
              subtitle={`${stats.projects.published} published, ${stats.projects.unpublished} drafts`}
              trend={stats.projects.recent > 0 ? { value: stats.projects.recent, label: 'this week', positive: true } : undefined}
              icon={
                <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            <StatsCard
              title="Content Pages"
              value={stats.content.total}
              subtitle={`${stats.content.published} published, ${stats.content.unpublished} drafts`}
              trend={stats.content.recent > 0 ? { value: stats.content.recent, label: 'this week', positive: true } : undefined}
              icon={
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatsCard
              title="Messages"
              value={stats.messages.total}
              subtitle={`${stats.messages.unread} unread, ${stats.messages.read} read`}
              trend={stats.messages.unread > 0 ? { value: stats.messages.unread, label: 'unread', positive: false } : undefined}
              icon={
                <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatsCard
              title="Users"
              value={stats.users.total}
              subtitle="Total registered users"
              icon={
                <svg className="h-8 w-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Analytics and Server Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats && (
          <>
            <AnalyticsChart
              data={stats.analytics.viewsByDay}
              title="Page Views (Last 7 Days)"
            />
            <ServerStats
              uptime={stats.server.uptime}
              memory={stats.server.memory}
              nodeVersion={stats.server.nodeVersion}
              platform={stats.server.platform}
            />
          </>
        )}
      </div>

      {/* Popular Pages */}
      {stats && stats.analytics.popularPages.length > 0 && (
        <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/50">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Popular Pages (30 days)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Most visited pages on your site
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats.analytics.popularPages.map((page, index) => (
                <div 
                  key={page.path} 
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent hover:from-gray-100/50 hover:to-gray-50/50 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 transition-all duration-200 border border-gray-200/30 dark:border-gray-700/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {page.path}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-600/50">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Jump to common management tasks
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/projects"
              className="inline-flex items-center px-5 py-3 border-2 border-gray-200 dark:border-gray-700 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Manage Projects
            </Link>
            <Link
              href="/admin/content"
              className="inline-flex items-center px-5 py-3 border-2 border-gray-200 dark:border-gray-700 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Manage Content
            </Link>
            <Link
              href="/admin/messages"
              className="inline-flex items-center px-5 py-3 border-2 border-gray-200 dark:border-gray-700 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Contact Messages
            </Link>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center px-5 py-3 border-2 border-gray-200 dark:border-gray-700 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="inline-flex items-center px-5 py-3 border-2 border-gray-200 dark:border-gray-700 shadow-sm text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}