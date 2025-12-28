'use client'

import { useCallback, useMemo, useState } from 'react'

import { format } from 'date-fns'
import { IconCrown, IconPencil } from '@tabler/icons-react'
import { toast } from 'sonner'

import { PeriodType } from '@/shared/api/graphql'
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
} from '@/entities/dashboard'

import { DashboardEditMode } from '@/features/dashboard-builder'
import { DashboardWidgetsSection } from '@/widgets/analytics-widgets'

import { DashboardChart } from './dashboard-chart'
import { DashboardKpiCards } from './dashboard-kpi-cards'
import { DashboardPeriodSelector } from './dashboard-period-selector'
import { DashboardBranchSelector } from './dashboard-branch-selector'

export function AnalyticsOverview() {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(PeriodType.TODAY)
  const [customRange, setCustomRange] = useState<{ start?: string; end?: string }>({})
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(undefined)
  const [isEditMode, setIsEditMode] = useState(false)

  // Build period input for GraphQL
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

  // Dashboard config (determines which KPIs and widgets to show)
  const { data: dashboardConfig, isLoading: isConfigLoading } = useDashboardConfig()
  const config = dashboardConfig ?? getDefaultDashboardConfig()
  const canCustomize = useCanCustomizeDashboard()

  // Save mutation
  const { mutate: saveConfig, isPending: isSaving } = useSaveDashboardConfig()

  // Get KPI types from config
  const kpiTypes = useMemo(() => {
    return config.kpiSlots
      .filter((slot) => slot.visible)
      .sort((a, b) => a.position - b.position)
      .map((slot) => slot.type)
  }, [config.kpiSlots])

  // Fetch KPI metrics
  const {
    data: kpiMetrics,
    isLoading: isKpiLoading,
    error: kpiError,
  } = useKpiMetrics(
    { types: kpiTypes, period: periodInput, branchId: selectedBranchId },
    kpiTypes.length > 0 && !isEditMode
  )

  // Fetch time series for chart
  const {
    data: timeSeries,
    isLoading: isChartLoading,
    error: chartError,
  } = useTimeSeries({
    metric: config.chartMetric,
    period: periodInput,
    groupBy: config.chartGroupBy ?? undefined,
    branchId: selectedBranchId,
  }, !isEditMode)

  // Handle period change
  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period)
    if (period !== PeriodType.CUSTOM) {
      setCustomRange({})
    }
  }

  // Handle custom range change
  const handleCustomRangeChange = (start: Date, end: Date) => {
    setSelectedPeriod(PeriodType.CUSTOM)
    setCustomRange({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
    })
  }

  // Handle branch change
  const handleBranchChange = (branchId: number | undefined) => {
    setSelectedBranchId(branchId)
  }

  // Handle edit mode
  const handleEnterEditMode = useCallback(() => {
    if (canCustomize) {
      setIsEditMode(true)
    }
  }, [canCustomize])

  const handleCancelEdit = useCallback(() => {
    setIsEditMode(false)
  }, [])

  const handleSaveConfig = useCallback((newConfig: IDashboardConfig) => {
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
        },
        onError: (error) => {
          // Check for entitlement error
          const errorMessage = error instanceof Error ? error.message : 'Ошибка'
          if (errorMessage.includes('ENTITLEMENT_REQUIRED') || errorMessage.includes('PRO')) {
            toast.error('Кастомизация доступна только на PRO плане')
          } else {
            toast.error('Не удалось сохранить: ' + errorMessage)
          }
        },
      }
    )
  }, [saveConfig])

  const isLoading = isConfigLoading || isKpiLoading || isChartLoading
  const hasError = kpiError || chartError

  // Edit Mode View
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

  // Normal Dashboard View
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Аналитика</h2>
          {canCustomize ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnterEditMode}
            >
              <IconPencil className="mr-1.5 h-4 w-4" />
              Редактировать
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              disabled
            >
              <IconCrown className="mr-1.5 h-4 w-4" />
              Upgrade to edit
            </Button>
          )}
        </div>

        {/* Filters */}
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

      {/* Error State */}
      {hasError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">
            Не удалось загрузить данные. Проверьте подключение к интернету.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !hasError && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-72 animate-pulse rounded-lg bg-muted" />
            <div className="h-72 animate-pulse rounded-lg bg-muted" />
          </div>
        </>
      )}

      {/* Data Display */}
      {!isLoading && !hasError && (
        <>
          {/* KPI Cards */}
          <DashboardKpiCards
            metrics={kpiMetrics ?? []}
            kpiTypes={kpiTypes}
          />

          {/* Main Chart */}
          <DashboardChart
            data={timeSeries}
            metric={config.chartMetric}
          />

          {/* Widgets */}
          <DashboardWidgetsSection
            widgets={config.widgets}
            period={periodInput}
            branchId={selectedBranchId}
          />
        </>
      )}
    </div>
  )
}
