'use client'

import { useState, useMemo, useCallback } from 'react'

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  IconGripVertical,
  IconX,
  IconCheck,
  IconLayoutDashboard,
  IconSettings,
  IconSparkles,
  IconChartArea,
  IconTrendingUp,
  IconCurrencyDollar,
  IconShoppingCart,
  IconReceipt,
  IconUsers,
  IconUserPlus,
  IconRefresh,
  IconCash,
  IconReceiptRefund,
  IconChartBar,
  IconPercentage,
  IconActivity,
} from '@tabler/icons-react'
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

import { KpiType } from '@/shared/api/graphql'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

import {
  type IDashboardConfig,
  type IDashboardWidget,
  type IKpiSlot,
  type WidgetType,
  type ChartType,
} from '@/entities/dashboard'

// Demo data for chart previews
const DEMO_CHART_DATA = [
  { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 },
  { value: 500 }, { value: 900 }, { value: 700 }, { value: 850 },
]

const DEMO_RADAR_DATA = [
  { subject: 'A', value: 120 },
  { subject: 'B', value: 98 },
  { subject: 'C', value: 86 },
  { subject: 'D', value: 99 },
  { subject: 'E', value: 85 },
]

const DEMO_PIE_DATA = [
  { value: 400, color: '#fe4a49' },
  { value: 300, color: '#3b82f6' },
  { value: 200, color: '#22c55e' },
]

const KPI_CONFIG: Record<KpiType, { label: string; icon: typeof IconCurrencyDollar; color: string; bgColor: string }> = {
  [KpiType.REVENUE]: { label: 'Выручка', icon: IconCurrencyDollar, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  [KpiType.ORDERS]: { label: 'Заказы', icon: IconShoppingCart, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  [KpiType.AVG_CHECK]: { label: 'Средний чек', icon: IconReceipt, color: 'text-violet-600', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  [KpiType.CUSTOMERS]: { label: 'Клиенты', icon: IconUsers, color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
  [KpiType.NEW_CUSTOMERS]: { label: 'Новые клиенты', icon: IconUserPlus, color: 'text-teal-600', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  [KpiType.RETURNING_CUSTOMERS]: { label: 'Постоянные', icon: IconRefresh, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  [KpiType.TIPS]: { label: 'Чаевые', icon: IconCash, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  [KpiType.REFUNDS]: { label: 'Возвраты', icon: IconReceiptRefund, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  [KpiType.CANCELLATIONS]: { label: 'Отмены', icon: IconX, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  [KpiType.MARGIN]: { label: 'Маржа', icon: IconChartBar, color: 'text-lime-600', bgColor: 'bg-lime-100 dark:bg-lime-900/30' },
  [KpiType.RETENTION_RATE]: { label: 'Удержание', icon: IconPercentage, color: 'text-pink-600', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  [KpiType.STAFF_PRODUCTIVITY]: { label: 'Продуктивность', icon: IconActivity, color: 'text-fuchsia-600', bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
}

const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: 'area', label: 'Область' },
  { value: 'bar', label: 'Столбцы' },
  { value: 'line', label: 'Линия' },
  { value: 'radial', label: 'Радиальный' },
  { value: 'radar', label: 'Радар' },
]

// Primary color for charts (hardcoded for proper rendering)
const PRIMARY_COLOR = '#fe4a49'

type WidgetPreviewType = 'area' | 'bar' | 'line' | 'pie' | 'donut' | 'radar' | 'list' | 'funnel' | 'heatmap'

const WIDGET_TYPE_OPTIONS: {
  value: WidgetType
  label: string
  description: string
  category: 'analytics' | 'charts' | 'data' | 'insights'
  preview: WidgetPreviewType
}[] = [
  { value: 'REVENUE_OVERVIEW', label: 'Обзор дохода', description: 'График с суммарной статистикой', category: 'charts', preview: 'area' },
  { value: 'TRANSACTIONS_SUMMARY', label: 'Сводка транзакций', description: 'Анализ транзакций', category: 'charts', preview: 'bar' },
  { value: 'INCOME_EXPENSE', label: 'Доходы и расходы', description: 'Финансовый отчет', category: 'charts', preview: 'bar' },
  { value: 'DAILY_COMPARISON', label: 'Дневное сравнение', description: 'Сравнение с предыдущим днем', category: 'charts', preview: 'line' },
  { value: 'CUSTOMER_RATINGS', label: 'Рейтинг клиентов', description: 'Звездный рейтинг с графиком', category: 'charts', preview: 'line' },
  { value: 'PERFORMANCE_RADAR', label: 'Эффективность', description: 'Radar-анализ показателей', category: 'analytics', preview: 'radar' },
  { value: 'CONVERSION_FUNNEL', label: 'Конверсионная воронка', description: 'Воронка продаж', category: 'analytics', preview: 'funnel' },
  { value: 'GOAL_RADIAL', label: 'Прогресс целей', description: 'Радиальный прогресс', category: 'analytics', preview: 'donut' },
  { value: 'HOURLY_BREAKDOWN', label: 'По часам', description: 'Тепловая карта', category: 'analytics', preview: 'heatmap' },
  { value: 'GOAL_PROGRESS', label: 'Цели', description: 'Прогресс по целям', category: 'analytics', preview: 'donut' },
  { value: 'TOP_PRODUCTS', label: 'Топ продукты', description: 'Лучшие товары по выручке', category: 'data', preview: 'list' },
  { value: 'PAYMENT_METHODS', label: 'Способы оплаты', description: 'Распределение по типам', category: 'data', preview: 'pie' },
  { value: 'CHANNEL_SPLIT', label: 'Каналы продаж', description: 'Доставка, зал, самовывоз', category: 'data', preview: 'donut' },
  { value: 'STAFF_RANKING', label: 'Рейтинг сотрудников', description: 'Топ сотрудников', category: 'data', preview: 'list' },
  { value: 'ORDERS_BY_CATEGORY', label: 'Заказы по категориям', description: 'Пончиковая диаграмма', category: 'data', preview: 'donut' },
  { value: 'VISITORS_TRAFFIC', label: 'Трафик посетителей', description: 'Разбивка по устройствам', category: 'data', preview: 'bar' },
  { value: 'ANOMALY_DETECTION', label: 'Обнаружение аномалий', description: 'Выявление отклонений', category: 'insights', preview: 'bar' },
  { value: 'SALES_METRICS', label: 'Метрики продаж', description: 'Комплексная аналитика', category: 'insights', preview: 'donut' },
]

interface DashboardEditModeProps {
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
}: DashboardEditModeProps) {
  const [kpiSlots, setKpiSlots] = useState<IKpiSlot[]>(initialConfig.kpiSlots)
  const [chartMetric, setChartMetric] = useState<KpiType>(initialConfig.chartMetric)
  const [chartType, setChartType] = useState<ChartType>(initialConfig.chartType ?? 'area')
  const [widgets, setWidgets] = useState<IDashboardWidget[]>(initialConfig.widgets)
  const [activeTab, setActiveTab] = useState('kpi')
  const [activeKpiId, setActiveKpiId] = useState<string | null>(null)
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // KPI IDs based on type (stable)
  const kpiIds = useMemo(() => kpiSlots.map((s) => s.type), [kpiSlots])
  const widgetIds = useMemo(() => widgets.map((w) => w.id), [widgets])

  const handleKpiDragStart = useCallback((event: DragStartEvent) => {
    setActiveKpiId(event.active.id as string)
  }, [])

  const handleKpiDragEnd = useCallback((event: DragEndEvent) => {
    setActiveKpiId(null)
    const { active, over } = event
    if (over && active.id !== over.id) {
      setKpiSlots((items) => {
        const oldIndex = items.findIndex((item) => item.type === active.id)
        const newIndex = items.findIndex((item) => item.type === over.id)
        if (oldIndex === -1 || newIndex === -1) return items
        const newItems = arrayMove(items, oldIndex, newIndex)
        return newItems.map((item, idx) => ({ ...item, position: idx }))
      })
    }
  }, [])

  const handleRemoveKpi = useCallback((type: KpiType) => {
    setKpiSlots((items) => {
      const newItems = items.filter((item) => item.type !== type)
      return newItems.map((item, idx) => ({ ...item, position: idx }))
    })
  }, [])

  const handleAddKpi = useCallback((type: KpiType) => {
    setKpiSlots((items) => {
      if (items.length >= 6) return items
      if (items.some((item) => item.type === type)) return items
      return [...items, { position: items.length, type, visible: true }]
    })
  }, [])

  const handleWidgetDragStart = useCallback((event: DragStartEvent) => {
    setActiveWidgetId(event.active.id as string)
  }, [])

  const handleWidgetDragEnd = useCallback((event: DragEndEvent) => {
    setActiveWidgetId(null)
    const { active, over } = event
    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return items
        const newItems = arrayMove(items, oldIndex, newIndex)
        return newItems.map((item, idx) => ({ ...item, position: idx }))
      })
    }
  }, [])

  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets((items) => {
      const newItems = items.filter((item) => item.id !== id)
      return newItems.map((item, idx) => ({ ...item, position: idx }))
    })
  }, [])

  const handleAddWidget = useCallback((type: WidgetType) => {
    setWidgets((items) => {
      const newId = `w${Date.now()}`
      return [...items, { id: newId, type, position: items.length, config: null }]
    })
  }, [])

  // Get active items for DragOverlay
  const activeKpiSlot = activeKpiId ? kpiSlots.find((s) => s.type === activeKpiId) : null
  const activeWidget = activeWidgetId ? widgets.find((w) => w.id === activeWidgetId) : null

  const handleSave = useCallback(() => {
    onSave({
      kpiSlots,
      chartMetric,
      chartType,
      chartGroupBy: initialConfig.chartGroupBy,
      widgets
    })
  }, [kpiSlots, chartMetric, chartType, widgets, onSave, initialConfig.chartGroupBy])

  const usedKpiTypes = useMemo(() => new Set(kpiSlots.map((s) => s.type)), [kpiSlots])
  const canAddKpi = kpiSlots.length < 6

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <IconLayoutDashboard className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Настройка дашборда</h2>
            <p className="text-sm text-muted-foreground">Визуальный редактор с превью</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>Отмена</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
            {!isSaving && <IconCheck className="ml-1 size-4" />}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kpi" className="gap-2">
            <IconSparkles className="size-4" />
            KPI карточки
          </TabsTrigger>
          <TabsTrigger value="chart" className="gap-2">
            <IconChartArea className="size-4" />
            Основной график
          </TabsTrigger>
          <TabsTrigger value="widgets" className="gap-2">
            <IconSettings className="size-4" />
            Виджеты
          </TabsTrigger>
        </TabsList>

        {/* KPI Tab with Visual Preview */}
        <TabsContent value="kpi" className="space-y-6">
          {/* Active KPIs with visual cards */}
          <Card>
            <CardHeader>
              <CardTitle>Активные KPI карточки</CardTitle>
              <CardDescription>Перетащите для изменения порядка</CardDescription>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleKpiDragStart}
                onDragEnd={handleKpiDragEnd}
              >
                <SortableContext items={kpiIds} strategy={rectSortingStrategy}>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {kpiSlots.map((slot) => (
                      <SortableKpiCard
                        key={slot.type}
                        slot={slot}
                        onRemove={() => handleRemoveKpi(slot.type)}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeKpiSlot && <KpiCardOverlay slot={activeKpiSlot} />}
                </DragOverlay>
              </DndContext>
            </CardContent>
          </Card>

          {/* Available KPIs - only show unused ones */}
          <Card>
            <CardHeader>
              <CardTitle>Добавить KPI</CardTitle>
              <CardDescription>Выберите показатели для отображения</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(KPI_CONFIG).filter(([type]) => !usedKpiTypes.has(type as KpiType)).length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">Все KPI уже добавлены</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Object.entries(KPI_CONFIG)
                    .filter(([type]) => !usedKpiTypes.has(type as KpiType))
                    .map(([type, config]) => {
                      const kpiType = type as KpiType
                      const Icon = config.icon
                      return (
                        <button
                          key={type}
                          onClick={() => canAddKpi && handleAddKpi(kpiType)}
                          disabled={!canAddKpi}
                          className={cn(
                            'group relative overflow-hidden rounded-xl border bg-card p-4 text-left transition-all',
                            !canAddKpi ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:shadow-md'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={cn('rounded-lg p-2', config.bgColor)}>
                                <Icon className={cn('size-4', config.color)} />
                              </div>
                              <div>
                                <p className="font-medium">{config.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  Нажмите для добавления
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Mini sparkline preview */}
                          <div className="mt-3 h-8">
                            <MiniSparklinePreview color={config.color} />
                          </div>
                          {/* Demo values */}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-lg font-bold">1,234,567</span>
                            <span className="flex items-center gap-0.5 text-xs text-emerald-600">
                              <IconTrendingUp className="size-3" />
                              +12.5%
                            </span>
                          </div>
                        </button>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart Tab with LIVE Chart Previews */}
        <TabsContent value="chart" className="space-y-6">
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
                      onClick={() => setChartType(opt.value)}
                      className={cn(
                        'group flex flex-col items-center rounded-xl border-2 p-4 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-transparent bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      {/* Live Chart Preview */}
                      <div className="mb-3 h-20 w-full overflow-hidden rounded-lg bg-background p-2">
                        <ChartTypePreview type={opt.value} isSelected={isSelected} />
                      </div>
                      <span className={cn('text-sm font-semibold', isSelected ? 'text-primary' : 'text-foreground')}>
                        {opt.label}
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
              <CardDescription>Так будет выглядеть ваш основной график</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-xl border bg-background p-4">
                <MainChartPreview type={chartType} />
              </div>
            </CardContent>
          </Card>

          {/* Chart Settings - Only Metric */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Метрика для графика</CardTitle>
              <CardDescription>Выберите показатель для отображения на графике</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={chartMetric} onValueChange={(v) => setChartMetric(v as KpiType)}>
                <SelectTrigger className="w-full max-w-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(KPI_CONFIG).map(([type, config]) => (
                    <SelectItem key={type} value={type}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Widgets Tab with Visual Previews */}
        <TabsContent value="widgets" className="space-y-6">
          {/* Active Widgets - Grid Layout */}
          <Card>
            <CardHeader>
              <CardTitle>Активные виджеты</CardTitle>
              <CardDescription>Перетащите для изменения порядка</CardDescription>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleWidgetDragStart}
                onDragEnd={handleWidgetDragEnd}
              >
                <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
                  {widgets.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-12 text-center">
                      <p className="text-muted-foreground">Нет активных виджетов. Добавьте из галереи ниже.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {widgets.map((widget) => (
                        <SortableWidgetGridCard
                          key={widget.id}
                          widget={widget}
                          onRemove={() => handleRemoveWidget(widget.id)}
                        />
                      ))}
                    </div>
                  )}
                </SortableContext>
                <DragOverlay>
                  {activeWidget && <WidgetCardOverlay widget={activeWidget} />}
                </DragOverlay>
              </DndContext>
            </CardContent>
          </Card>

          {/* Widget Gallery with Visual Previews */}
          <Card>
            <CardHeader>
              <CardTitle>Галерея виджетов</CardTitle>
              <CardDescription>Выберите виджеты с визуальным превью</CardDescription>
            </CardHeader>
            <CardContent>
              {(['charts', 'analytics', 'data', 'insights'] as const).map((category) => {
                const categoryWidgets = WIDGET_TYPE_OPTIONS.filter((w) => w.category === category)
                const categoryLabels = {
                  charts: 'Графики и диаграммы',
                  analytics: 'Аналитика',
                  data: 'Данные',
                  insights: 'Аналитические выводы',
                }
                return (
                  <div key={category} className="mb-6 last:mb-0">
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {categoryLabels[category]}
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categoryWidgets.map((opt) => {
                        const isUsed = widgets.some((w) => w.type === opt.value)
                        return (
                          <button
                            key={opt.value}
                            onClick={() => !isUsed && handleAddWidget(opt.value)}
                            disabled={isUsed}
                            className={cn(
                              'group overflow-hidden rounded-xl border bg-card text-left transition-all',
                              isUsed ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:shadow-lg'
                            )}
                          >
                            {/* Widget Preview */}
                            <div className="h-24 border-b bg-muted/30 p-3">
                              <WidgetPreviewChart type={opt.preview} />
                            </div>
                            <div className="p-3">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{opt.label}</span>
                                {isUsed && <span className="rounded bg-muted px-1.5 py-0.5 text-xs">Добавлен</span>}
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mini Sparkline for KPI preview
function MiniSparklinePreview({ color }: { color: string }) {
  const data = useMemo(() => [
    { v: 30 }, { v: 45 }, { v: 32 }, { v: 60 }, { v: 45 }, { v: 75 }, { v: 55 }, { v: 80 },
  ], [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`kpi-sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke="currentColor"
          strokeWidth={1.5}
          fill={`url(#kpi-sparkline-${color})`}
          dot={false}
          className={color}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Chart Type Preview (for selection)
function ChartTypePreview({ type, isSelected }: { type: ChartType; isSelected: boolean }) {
  const stroke = isSelected ? PRIMARY_COLOR : '#9ca3af'
  const fill = isSelected ? `${PRIMARY_COLOR}40` : '#e5e7eb'

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'area' ? (
        <AreaChart data={DEMO_CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id={`preview-area-${isSelected}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} fill={`url(#preview-area-${isSelected})`} dot={false} />
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
          <Pie data={DEMO_PIE_DATA} cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" dataKey="value" strokeWidth={0}>
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
          <Area type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} fill={fill} dot={false} />
        </AreaChart>
      )}
    </ResponsiveContainer>
  )
}

// Main Chart Preview (large)
function MainChartPreview({ type }: { type: ChartType }) {
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
          <Area type="monotone" dataKey="value" stroke={PRIMARY_COLOR} strokeWidth={3} fill="url(#main-area-gradient)" dot={false} />
        </AreaChart>
      ) : type === 'bar' ? (
        <BarChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Bar dataKey="value" fill={PRIMARY_COLOR} radius={[6, 6, 0, 0]} />
        </BarChart>
      ) : type === 'line' ? (
        <LineChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Line type="monotone" dataKey="value" stroke={PRIMARY_COLOR} strokeWidth={3} dot={{ r: 4, fill: PRIMARY_COLOR }} />
        </LineChart>
      ) : type === 'radial' || type === 'donut' || type === 'pie' ? (
        <PieChart>
          <Pie data={DEMO_PIE_DATA} cx="50%" cy="50%" innerRadius="50%" outerRadius="80%" dataKey="value" strokeWidth={0} label>
            {DEMO_PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
        </PieChart>
      ) : type === 'radar' ? (
        <RadarChart data={DEMO_RADAR_DATA} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" />
          <Radar dataKey="value" stroke={PRIMARY_COLOR} fill={PRIMARY_COLOR} fillOpacity={0.3} />
        </RadarChart>
      ) : (
        <AreaChart data={DEMO_CHART_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Area type="monotone" dataKey="value" stroke={PRIMARY_COLOR} strokeWidth={3} fill={PRIMARY_COLOR} fillOpacity={0.2} dot={false} />
        </AreaChart>
      )}
    </ResponsiveContainer>
  )
}

// Widget Preview Chart
function WidgetPreviewChart({ type }: { type: WidgetPreviewType }) {
  const stroke = '#9ca3af'
  const fill = '#e5e7eb'

  if (type === 'list') {
    return (
      <div className="flex h-full flex-col justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="size-2 rounded-full" style={{ backgroundColor: `${PRIMARY_COLOR}99` }} />
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
          const hex = Math.floor(opacity * 255).toString(16).padStart(2, '0')
          return (
            <div
              key={i}
              className="rounded-sm"
              style={{ backgroundColor: `${PRIMARY_COLOR}${hex}` }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'bar' ? (
        <BarChart data={DEMO_CHART_DATA.slice(0, 5)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Bar dataKey="value" fill={PRIMARY_COLOR} radius={[2, 2, 0, 0]} />
        </BarChart>
      ) : type === 'pie' || type === 'donut' ? (
        <PieChart>
          <Pie data={DEMO_PIE_DATA} cx="50%" cy="50%" innerRadius={type === 'donut' ? '40%' : 0} outerRadius="80%" dataKey="value" strokeWidth={0}>
            {DEMO_PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
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
          <Area type="monotone" dataKey="value" stroke={PRIMARY_COLOR} strokeWidth={2} fill="url(#widget-area-gradient)" dot={false} />
        </AreaChart>
      )}
    </ResponsiveContainer>
  )
}

// Sortable KPI Card
function SortableKpiCard({ slot, onRemove }: { slot: IKpiSlot; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slot.type })
  const config = KPI_CONFIG[slot.type]
  const Icon = config.icon

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm',
        isDragging && 'opacity-0'
      )}
    >
      <button
        onClick={onRemove}
        className="absolute right-1 top-1 z-10 flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
      >
        <IconX className="size-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <button className="cursor-grab touch-none" {...attributes} {...listeners}>
          <IconGripVertical className="size-4 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={cn('rounded-lg p-1.5', config.bgColor)}>
              <Icon className={cn('size-4', config.color)} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold">1,234,567</span>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
              <IconTrendingUp className="size-3" />
              +12.5%
            </div>
          </div>
        </div>
        <div className="h-12 w-20">
          <MiniSparklinePreview color={config.color} />
        </div>
      </div>
    </div>
  )
}

// KPI Card Overlay (shown when dragging)
function KpiCardOverlay({ slot }: { slot: IKpiSlot }) {
  const config = KPI_CONFIG[slot.type]
  const Icon = config.icon

  return (
    <div className="overflow-hidden rounded-xl border bg-card p-4 shadow-xl ring-2 ring-primary">
      <div className="flex items-start gap-3">
        <IconGripVertical className="size-4 text-muted-foreground" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={cn('rounded-lg p-1.5', config.bgColor)}>
              <Icon className={cn('size-4', config.color)} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold">1,234,567</span>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
              <IconTrendingUp className="size-3" />
              +12.5%
            </div>
          </div>
        </div>
        <div className="h-12 w-20">
          <MiniSparklinePreview color={config.color} />
        </div>
      </div>
    </div>
  )
}

// Sortable Widget Grid Card
function SortableWidgetGridCard({ widget, onRemove }: { widget: IDashboardWidget; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id })
  const config = WIDGET_TYPE_OPTIONS.find((o) => o.value === widget.type)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card shadow-sm',
        isDragging && 'opacity-0'
      )}
    >
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          className="cursor-grab touch-none rounded-lg bg-background/80 p-1.5 text-muted-foreground backdrop-blur-sm hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <IconGripVertical className="size-4" />
        </button>
        <button
          onClick={onRemove}
          className="rounded-lg bg-background/80 p-1.5 text-muted-foreground backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive"
        >
          <IconX className="size-4" />
        </button>
      </div>

      <div className="border-b p-4">
        <h4 className="font-semibold">{config?.label ?? widget.type}</h4>
        <p className="text-sm text-muted-foreground">{config?.description}</p>
      </div>

      <div className="h-48 p-4">
        {config && <WidgetPreviewChart type={config.preview} />}
      </div>
    </div>
  )
}

// Widget Card Overlay (shown when dragging)
function WidgetCardOverlay({ widget }: { widget: IDashboardWidget }) {
  const config = WIDGET_TYPE_OPTIONS.find((o) => o.value === widget.type)

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xl ring-2 ring-primary">
      <div className="border-b p-4">
        <h4 className="font-semibold">{config?.label ?? widget.type}</h4>
        <p className="text-sm text-muted-foreground">{config?.description}</p>
      </div>
      <div className="h-48 p-4">
        {config && <WidgetPreviewChart type={config.preview} />}
      </div>
    </div>
  )
}
