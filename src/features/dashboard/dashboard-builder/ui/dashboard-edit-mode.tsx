'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  IconLayoutDashboard,
  IconSparkles,
  IconChartArea,
  IconSettings,
  IconCheck,
} from '@tabler/icons-react'

import { KpiType } from '@/shared/api/graphql'
import { Button } from '@/shared/ui/base/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

import type { IDashboardConfig, IKpiSlot, IDashboardWidget, ChartType } from '@/entities/dashboard/dashboard'

import { KpiTab, ChartTab, WidgetsTab } from './edit-tabs'

interface IDashboardEditModeProps {
  config: IDashboardConfig
  onSave: (config: IDashboardConfig) => void
  onCancel: () => void
  isSaving?: boolean
}

export function DashboardEditMode({
  config: initialConfig,
  onSave,
  onCancel,
  isSaving = false,
}: IDashboardEditModeProps) {
  const { t } = useTranslation('dashboard')
  // State
  const [kpiSlots, setKpiSlots] = useState<IKpiSlot[]>(initialConfig.kpiSlots)
  const [chartMetric, setChartMetric] = useState<KpiType>(initialConfig.chartMetric)
  const [chartType, setChartType] = useState<ChartType>('area')
  const [widgets, setWidgets] = useState<IDashboardWidget[]>(initialConfig.widgets)
  const [activeTab, setActiveTab] = useState('kpi')

  // DnD state
  const [activeKpiId, setActiveKpiId] = useState<string | null>(null)
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null)

  // Handlers
  const handleSave = useCallback(() => {
    onSave({
      kpiSlots,
      chartMetric,
      chartGroupBy: initialConfig.chartGroupBy,
      widgets,
    })
  }, [kpiSlots, chartMetric, widgets, onSave, initialConfig.chartGroupBy])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <IconLayoutDashboard className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t('dashboard.editMode.title')}</h2>
            <p className="text-sm text-muted-foreground">{t('dashboard.editMode.description')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t('dashboard.editMode.saving') : t('dashboard.editMode.save')}
            {!isSaving && <IconCheck className="ml-1 size-4" />}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kpi" className="gap-2">
            <IconSparkles className="size-4" />
            {t('dashboard.editMode.tabs.kpi')}
          </TabsTrigger>
          <TabsTrigger value="chart" className="gap-2">
            <IconChartArea className="size-4" />
            {t('dashboard.editMode.tabs.chart')}
          </TabsTrigger>
          <TabsTrigger value="widgets" className="gap-2">
            <IconSettings className="size-4" />
            {t('dashboard.editMode.tabs.widgets')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kpi">
          <KpiTab
            kpiSlots={kpiSlots}
            onKpiSlotsChange={setKpiSlots}
            activeKpiId={activeKpiId}
            onActiveKpiIdChange={setActiveKpiId}
          />
        </TabsContent>

        <TabsContent value="chart">
          <ChartTab
            chartType={chartType}
            chartMetric={chartMetric}
            onChartTypeChange={setChartType}
            onChartMetricChange={setChartMetric}
          />
        </TabsContent>

        <TabsContent value="widgets">
          <WidgetsTab
            widgets={widgets}
            onWidgetsChange={setWidgets}
            activeWidgetId={activeWidgetId}
            onActiveWidgetIdChange={setActiveWidgetId}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
