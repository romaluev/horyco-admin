'use client'

import { useMemo } from 'react'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

import {
  DEMO_CHART_DATA,
  DEMO_PIE_DATA,
  DEMO_RADAR_DATA,
  PRIMARY_COLOR,
  type WidgetPreviewType,
  type ChartType,
} from '@/entities/dashboard/dashboard'

// ============================================
// MINI SPARKLINE (for KPI cards)
// ============================================

const SPARKLINE_DATA = [
  { v: 30 },
  { v: 45 },
  { v: 32 },
  { v: 60 },
  { v: 45 },
  { v: 75 },
  { v: 55 },
  { v: 80 },
]

interface IMiniSparklineProps {
  color: string
}

export function MiniSparkline({ color }: IMiniSparklineProps) {
  const gradientId = useMemo(() => `sparkline-${color.replace(/[^a-zA-Z0-9]/g, '')}`, [color])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={SPARKLINE_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke="currentColor"
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          className={color}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ============================================
// CHART TYPE PREVIEW (for chart type selection)
// ============================================

interface IChartTypePreviewProps {
  type: ChartType
  isSelected: boolean
}

export function ChartTypePreview({ type, isSelected }: IChartTypePreviewProps) {
  const stroke = isSelected ? PRIMARY_COLOR : '#9ca3af'
  const fill = isSelected ? `${PRIMARY_COLOR}40` : '#e5e7eb'
  const gradientId = `preview-${type}-${isSelected}`

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'area' ? (
        <AreaChart data={DEMO_CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
          />
        </AreaChart>
      ) : type === 'bar' ? (
        <BarChart data={DEMO_CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Bar dataKey="value" fill={isSelected ? stroke : fill} radius={[3, 3, 0, 0]} />
        </BarChart>
      ) : type === 'line' ? (
        <LineChart data={DEMO_CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Line type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} dot={false} />
        </LineChart>
      ) : type === 'radial' || type === 'donut' || type === 'pie' ? (
        <PieChart>
          <Pie
            data={DEMO_PIE_DATA}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="80%"
            dataKey="value"
            strokeWidth={0}
          >
            {DEMO_PIE_DATA.map((entry, i) => (
              <Cell key={i} fill={isSelected ? entry.color : '#e5e7eb'} />
            ))}
          </Pie>
        </PieChart>
      ) : type === 'radar' ? (
        <RadarChart data={DEMO_RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke={isSelected ? '#e5e7eb' : '#f3f4f6'} />
          <PolarAngleAxis dataKey="subject" tick={false} />
          <Radar dataKey="value" stroke={stroke} fill={fill} fillOpacity={0.6} />
        </RadarChart>
      ) : (
        <AreaChart data={DEMO_CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            fill={fill}
            dot={false}
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  )
}

// ============================================
// MAIN CHART PREVIEW (large preview)
// ============================================

interface IMainChartPreviewProps {
  type: ChartType
}

export function MainChartPreview({ type }: IMainChartPreviewProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'area' ? (
        <AreaChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="main-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity={0.5} />
              <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={PRIMARY_COLOR}
            strokeWidth={3}
            fill="url(#main-area-gradient)"
            dot={false}
          />
        </AreaChart>
      ) : type === 'bar' ? (
        <BarChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Bar dataKey="value" fill={PRIMARY_COLOR} radius={[6, 6, 0, 0]} />
        </BarChart>
      ) : type === 'line' ? (
        <LineChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={PRIMARY_COLOR}
            strokeWidth={3}
            dot={{ r: 4, fill: PRIMARY_COLOR }}
          />
        </LineChart>
      ) : type === 'radial' || type === 'donut' || type === 'pie' ? (
        <PieChart>
          <Pie
            data={DEMO_PIE_DATA}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
            dataKey="value"
            strokeWidth={0}
            label
          >
            {DEMO_PIE_DATA.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      ) : type === 'radar' ? (
        <RadarChart data={DEMO_RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" />
          <Radar
            dataKey="value"
            stroke={PRIMARY_COLOR}
            fill={PRIMARY_COLOR}
            fillOpacity={0.3}
          />
        </RadarChart>
      ) : (
        <AreaChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Area
            type="monotone"
            dataKey="value"
            stroke={PRIMARY_COLOR}
            strokeWidth={3}
            fill={PRIMARY_COLOR}
            fillOpacity={0.2}
            dot={false}
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  )
}

// ============================================
// WIDGET PREVIEW CHART (for widget gallery)
// ============================================

interface IWidgetPreviewChartProps {
  type: WidgetPreviewType
}

export function WidgetPreviewChart({ type }: IWidgetPreviewChartProps) {
  const stroke = '#9ca3af'
  const fill = '#e5e7eb'

  if (type === 'list') {
    return (
      <div className="flex h-full flex-col justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: `${PRIMARY_COLOR}99` }}
            />
            <div className="h-2 flex-1 rounded" style={{ backgroundColor: fill }} />
            <div className="h-2 w-8 rounded" style={{ backgroundColor: `${stroke}4d` }} />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'funnel') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1.5">
        <div className="h-3 w-full rounded" style={{ backgroundColor: `${PRIMARY_COLOR}99` }} />
        <div className="h-3 w-3/4 rounded" style={{ backgroundColor: `${PRIMARY_COLOR}73` }} />
        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: `${PRIMARY_COLOR}4d` }} />
        <div className="h-3 w-1/4 rounded" style={{ backgroundColor: `${PRIMARY_COLOR}33` }} />
      </div>
    )
  }

  if (type === 'heatmap') {
    const heatmapOpacities = [0.15, 0.25, 0.35, 0.45, 0.55, 0.65]
    return (
      <div className="grid h-full grid-cols-7 gap-1 p-1">
        {Array.from({ length: 21 }).map((_, i) => {
          const opacity = heatmapOpacities[i % heatmapOpacities.length] ?? 0.3
          const hex = Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, '0')
          return (
            <div key={i} className="rounded-sm" style={{ backgroundColor: `${PRIMARY_COLOR}${hex}` }} />
          )
        })}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'bar' ? (
        <BarChart
          data={DEMO_CHART_DATA.slice(0, 5)}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <Bar dataKey="value" fill={PRIMARY_COLOR} radius={[2, 2, 0, 0]} />
        </BarChart>
      ) : type === 'pie' || type === 'donut' ? (
        <PieChart>
          <Pie
            data={DEMO_PIE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={type === 'donut' ? '40%' : 0}
            outerRadius="80%"
            dataKey="value"
            strokeWidth={0}
          >
            {DEMO_PIE_DATA.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      ) : type === 'radar' ? (
        <RadarChart data={DEMO_RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <Radar dataKey="value" stroke={PRIMARY_COLOR} fill={PRIMARY_COLOR} fillOpacity={0.3} />
        </RadarChart>
      ) : type === 'line' ? (
        <LineChart data={DEMO_CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Line type="monotone" dataKey="value" stroke={PRIMARY_COLOR} strokeWidth={2} dot={false} />
        </LineChart>
      ) : (
        <AreaChart data={DEMO_CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="widget-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity={0.3} />
              <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={PRIMARY_COLOR}
            strokeWidth={2}
            fill="url(#widget-area-gradient)"
            dot={false}
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  )
}
