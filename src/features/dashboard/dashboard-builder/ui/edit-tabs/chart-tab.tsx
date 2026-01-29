'use client'

import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import {
  KPI_CONFIG,
  CHART_TYPE_OPTIONS,
  type ChartType,
} from '@/entities/dashboard/dashboard'

import { ChartTypePreview, MainChartPreview } from '../chart-previews'

import type { KpiType } from '@/shared/api/graphql'

interface IChartTabProps {
  chartType: ChartType
  chartMetric: KpiType
  onChartTypeChange: (type: ChartType) => void
  onChartMetricChange: (metric: KpiType) => void
}

export function ChartTab({
  chartType,
  chartMetric,
  onChartTypeChange,
  onChartMetricChange,
}: IChartTabProps) {
  const { t } = useTranslation('dashboard')

  return (
    <div className="space-y-6">
      {/* Chart Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Выберите тип графика</CardTitle>
          <CardDescription>Нажмите для выбора визуализации</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CHART_TYPE_OPTIONS.map((opt) => {
              const isSelected = chartType === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChartTypeChange(opt.value)}
                  className={cn(
                    'group flex flex-col items-center rounded-xl border-2 p-4 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'bg-muted/30 hover:border-primary/50 hover:bg-muted/50 border-transparent'
                  )}
                >
                  <div className="bg-background mb-3 h-20 w-full overflow-hidden rounded-lg p-2">
                    <ChartTypePreview
                      type={opt.value}
                      isSelected={isSelected}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {t(opt.labelKey)}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chart Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Предпросмотр графика</CardTitle>
          <CardDescription>
            Так будет выглядеть ваш основной график
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background h-64 rounded-xl border p-4">
            <MainChartPreview type={chartType} />
          </div>
        </CardContent>
      </Card>

      {/* Chart Metric */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Метрика для графика</CardTitle>
          <CardDescription>
            Выберите показатель для отображения на графике
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={chartMetric}
            onValueChange={(v) => onChartMetricChange(v as KpiType)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(KPI_CONFIG).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  {t(config.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
