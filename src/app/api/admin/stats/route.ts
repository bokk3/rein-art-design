import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'
import { getAnalyticsStats } from '@/lib/analytics-service'

/**
 * GET /api/admin/stats - Get dashboard statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)

    // Get all stats in parallel
    const [
      totalProjects,
      publishedProjects,
      totalContentPages,
      publishedContentPages,
      totalMessages,
      unreadMessages,
      totalUsers,
      analyticsStats,
    ] = await Promise.all([
      // Projects
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      
      // Content pages
      prisma.contentPage.count(),
      prisma.contentPage.count({ where: { published: true } }),
      
      // Contact messages
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      
      // Users
      prisma.user.count(),
      
      // Analytics (last 30 days)
      getAnalyticsStats(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    ])

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const [recentProjects, recentMessages, recentContent] = await Promise.all([
      prisma.project.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.contactMessage.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.contentPage.count({
        where: { updatedAt: { gte: sevenDaysAgo } },
      }),
    ])

    // Get server uptime (process uptime in seconds)
    const uptimeSeconds = process.uptime()
    const uptimeHours = Math.floor(uptimeSeconds / 3600)
    const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60)
    const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m`

    return NextResponse.json({
      projects: {
        total: totalProjects,
        published: publishedProjects,
        unpublished: totalProjects - publishedProjects,
        recent: recentProjects,
      },
      content: {
        total: totalContentPages,
        published: publishedContentPages,
        unpublished: totalContentPages - publishedContentPages,
        recent: recentContent,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        read: totalMessages - unreadMessages,
        recent: recentMessages,
      },
      users: {
        total: totalUsers,
      },
      analytics: {
        totalPageViews: analyticsStats.totalPageViews,
        uniqueVisitors: analyticsStats.uniqueVisitors,
        viewsByDay: analyticsStats.viewsByDay,
        popularPages: analyticsStats.popularPages.slice(0, 5),
      },
      server: {
        uptime: uptimeFormatted,
        uptimeSeconds,
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024), // MB
        },
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

