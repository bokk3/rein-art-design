'use client'

interface ServerStatsProps {
  uptime: string
  memory: {
    used: number
    total: number
    rss: number
  }
  nodeVersion: string
  platform: string
}

export function ServerStats({ uptime, memory, nodeVersion, platform }: ServerStatsProps) {
  const memoryPercent = Math.round((memory.used / memory.total) * 100)

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Server Information
        </h3>
        
        <div className="space-y-4">
          {/* Uptime */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{uptime}</span>
            </div>
          </div>

          {/* Memory Usage */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {memory.used}MB / {memory.total}MB ({memoryPercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  memoryPercent > 80 ? 'bg-red-500' : memoryPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${memoryPercent}%` }}
              />
            </div>
          </div>

          {/* RSS Memory */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">RSS Memory</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{memory.rss}MB</span>
            </div>
          </div>

          {/* Node Version */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Node.js Version</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{nodeVersion}</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Platform</span>
              <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{platform}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

