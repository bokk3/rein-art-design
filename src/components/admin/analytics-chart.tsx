'use client'

interface AnalyticsChartProps {
  data: Array<{ date: string; views: number }>
  title: string
  height?: number
}

export function AnalyticsChart({ data, title, height = 200 }: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  // Reverse to show most recent first, then take last 7 days
  const chartData = [...data].reverse().slice(0, 7).reverse()
  const maxViews = Math.max(...chartData.map(d => d.views), 1)

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      <div className="relative pt-8" style={{ height: `${height + 40}px` }}>
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = (height / 4) * i
            return (
              <line
                key={`grid-${i}`}
                x1="0"
                y1={y}
                x2="100%"
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
                opacity="0.5"
              />
            )
          })}

          {/* Chart area */}
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-600 dark:text-blue-400"
            points={chartData.map((d, i) => {
              const x = (i / (chartData.length - 1 || 1)) * 100
              const y = height - (d.views / maxViews) * height
              return `${x}%,${y}`
            }).join(' ')}
          />

          {/* Data points */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1 || 1)) * 100
            const y = height - (d.views / maxViews) * height
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={y}
                r="4"
                fill="currentColor"
                className="text-blue-600 dark:text-blue-400"
              />
            )
          })}

          {/* Labels */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1 || 1)) * 100
            const date = new Date(d.date)
            const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            return (
              <text
                key={`label-${i}`}
                x={`${x}%`}
                y={height + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                {label}
              </text>
            )
          })}
        </svg>

        {/* Value labels above points */}
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1 || 1)) * 100
          const y = height - (d.views / maxViews) * height
          return (
            <div
              key={`value-${i}`}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${x}%`, top: `${y - 25}px` }}
            >
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                {d.views}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

