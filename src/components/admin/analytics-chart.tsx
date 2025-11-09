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

  // Calculate chart dimensions
  const padding = 40
  const chartWidth = 600
  const chartHeight = height
  const innerWidth = chartWidth - padding * 2
  const innerHeight = chartHeight - padding * 2

  // Calculate points with proper coordinates
  const points = chartData.map((d, i) => {
    // If only one point, center it. Otherwise distribute evenly.
    const x = chartData.length === 1 
      ? chartWidth / 2
      : padding + (i / Math.max(chartData.length - 1, 1)) * innerWidth
    const y = padding + innerHeight - (d.views / maxViews) * innerHeight
    return { x, y, views: d.views, date: d.date }
  })

  // Create polyline path string (only if we have more than one point)
  const pathData = points.length > 1 
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : `M ${points[0].x} ${points[0].y}`

  return (
    <div className="glass border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-xl p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      <div className="relative" style={{ height: `${height + 60}px` }}>
        <svg 
          width="100%" 
          height={height + 60} 
          viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}
          preserveAspectRatio="xMidYMid meet"
          className="overflow-visible"
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + (innerHeight / 4) * i
            return (
              <line
                key={`grid-${i}`}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
                opacity="0.5"
              />
            )
          })}

          {/* Chart line */}
          {points.length > 1 && (
            <>
              <path
                d={pathData}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600 dark:text-blue-400"
              />

              {/* Area fill under the line */}
              <path
                d={`${pathData} L ${points[points.length - 1].x} ${padding + innerHeight} L ${points[0].x} ${padding + innerHeight} Z`}
                fill="currentColor"
                className="text-blue-600 dark:text-blue-400"
                opacity="0.1"
              />
            </>
          )}

          {/* Data points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="currentColor"
              className="text-blue-600 dark:text-blue-400"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Date labels */}
          {points.map((point, i) => {
            const date = new Date(point.date)
            const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            return (
              <text
                key={`label-${i}`}
                x={point.x}
                y={chartHeight + 25}
                textAnchor="middle"
                className="text-xs fill-gray-600 dark:fill-gray-400"
              >
                {label}
              </text>
            )
          })}
        </svg>

        {/* Value labels above points */}
        {points.map((point, i) => {
          // Convert SVG coordinates to percentage for absolute positioning
          const xPercent = (point.x / chartWidth) * 100
          const yPercent = (point.y / (chartHeight + 60)) * 100
          return (
            <div
              key={`value-${i}`}
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{ 
                left: `${xPercent}%`, 
                top: `${yPercent}%`,
                marginTop: '-8px'
              }}
            >
              <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                {point.views}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

