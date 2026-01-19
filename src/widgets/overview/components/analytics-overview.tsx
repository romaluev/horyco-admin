'use client'

import { useCallback, useMemo, useState } from 'react'

import { format } from 'date-fns'
import { IconCrown, IconPencil } from '@tabler/icons-react'
import { toast } from 'sonner'

import { GroupBy, PeriodType } from '@/shared/api/graphql'
import { Button } from '@/shared/ui/base/button'

import {
  getDefaultDashboardConfig,
  useDashboardConfig,
  useKpiMetrics,
  useSaveDashboardConfig,
  useTimeSeries,
  useCanCustomizeDashboard,
  type IDashboardConfig,
  type IPeriodInput,
} from '@/entities/dashboard/dashboard'

import { DashboardEditMode } from '@/features/dashboard/dashboard-builder'
import { DashboardWidgetsSection } from '@/widgets/analytics-widgets'

import { DashboardMainChart, DashboardMainChartSkeleton } from './dashboard-main-chart'
import { DashboardKpiCards } from './dashboard-kpi-cards'
import { DashboardPeriodSelector } from './dashboard-period-selector'
import { DashboardBranchSelector } from './dashboard-branch-selector'

export function AnalyticsOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(PeriodType.TODAY)
  const [customRange, setCustomRange] = useState<{ start?: string; end?: string }>({})
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined)
  const [isEditMode, setIsEditMode] = useState(false)
  const [localGroupBy, setLocalGroupBy] = useState<GroupBy | null>(null)

  const periodInput = useMemo<IPeriodInput>(() => {
    if (selectedPeriod === PeriodType.CUSTOM && customRange.start && customRange.end) {
      return {
        type: PeriodType.CUSTOM,
        customStart: customRange.start,
        customEnd: customRange.end,
      }
    }
    return { type: selectedPeriod }
  }, [selectedPeriod, customRange])

  const { data: dashboardConfig, isLoading: isConfigLoading } = useDashboardConfig()
  const config = dashboardConfig ?? getDefaultDashboardConfig()
  const canCustomize = useCanCustomizeDashboard()

  const { mutate: saveConfig, isPending: isSaving } = useSaveDashboardConfig()

  const kpiTypes = useMemo(() => {
    return config.kpiSlots
      .filter((slot) => slot.visible)
      .sort((a, b) => a.position - b.position)
      .map((slot) => slot.type)
  }, [config.kpiSlots])

  const {
    data: kpiMetrics,
    isLoading: isKpiLoading,
    error: kpiError,
  } = useKpiMetrics(
    { types: kpiTypes, period: periodInput, branchId: selectedBranchId },
    kpiTypes.length > 0 && !isEditMode
  )

  const activeGroupBy = localGroupBy ?? config.chartGroupBy ?? GroupBy.DAY

  const {
    data: timeSeries,
    isLoading: isChartLoading,
    error: chartError,
  } = useTimeSeries(
    {
      metric: config.chartMetric,
      period: periodInput,
      groupBy: activeGroupBy,
      branchId: selectedBranchId,
    },
    !isEditMode
  )

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period)
    if (period !== PeriodType.CUSTOM) {
      setCustomRange({})
    }
  }

  const handleCustomRangeChange = (start: Date, end: Date) => {
    setSelectedPeriod(PeriodType.CUSTOM)
    setCustomRange({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
    })
  }

  const handleBranchChange = (branchId: number | undefined) => {
    setSelectedBranchId(branchId)
  }

  const handleEnterEditMode = useCallback(() => {
    if (canCustomize) {
      setIsEditMode(true)
    }
  }, [canCustomize])

  const handleCancelEdit = useCallback(() => {
    setIsEditMode(false)
  }, [])

  const handleGroupByChange = useCallback((groupBy: GroupBy) => {
    setLocalGroupBy(groupBy)
  }, [])

  const handleSaveConfig = useCallback(
    (newConfig: IDashboardConfig) => {
      saveConfig(
        {
          kpiSlots: newConfig.kpiSlots,
          chartMetric: newConfig.chartMetric,
          chartGroupBy: newConfig.chartGroupBy,
          widgets: newConfig.widgets.map((w) => ({
            id: w.id,
            type: w.type,
            position: w.position,
          })),
        },
        {
          onSuccess: () => {
            toast.success('Дашборд сохранен')
            setIsEditMode(false)
            setLocalGroupBy(null)
          },
          onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка'
            if (
              errorMessage.includes('ENTITLEMENT_REQUIRED') ||
              errorMessage.includes('PRO')
            ) {
              toast.error('Кастомизация доступна только на PRO плане')
            } else {
              toast.error('Не удалось сохранить: ' + errorMessage)
            }
          },
        }
      )
    },
    [saveConfig]
  )

  const hasError = kpiError || chartError

  if (isEditMode) {
    return (
      <div className="w-full p-4 md:p-6">
        <DashboardEditMode
          config={config}
          onSave={handleSaveConfig}
          onCancel={handleCancelEdit}
          isSaving={isSaving}
        />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Аналитика</h2>
            <p className="text-muted-foreground">
              Отслеживайте ключевые показатели вашего бизнеса
            </p>
          </div>
          {canCustomize ? (
            <Button variant="outline" size="sm" onClick={handleEnterEditMode}>
              <IconPencil className="mr-1.5 h-4 w-4" />
              Настроить
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              disabled
            >
              <IconCrown className="mr-1.5 h-4 w-4" />
              PRO
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <DashboardPeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            customRange={customRange}
            onCustomRangeChange={handleCustomRangeChange}
          />
          <div className="h-8 w-px bg-border" />
          <DashboardBranchSelector
            selectedBranchId={selectedBranchId}
            onBranchChange={handleBranchChange}
          />
        </div>
      </div>

      {hasError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">
            Не удалось загрузить данные. Проверьте подключение к интернету.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <DashboardKpiCards
          metrics={kpiMetrics ?? []}
          kpiTypes={kpiTypes}
          isLoading={isKpiLoading}
        />

        <DashboardMainChart
          data={timeSeries}
          metric={config.chartMetric}
          chartType="area"
          variant="gradient"
          groupBy={activeGroupBy}
          onGroupByChange={handleGroupByChange}
          isLoading={isChartLoading}
        />

        <DashboardWidgetsSection
          widgets={config.widgets}
          period={periodInput}
          branchId={selectedBranchId}
        />
      </div>
    </div>
  )
}
