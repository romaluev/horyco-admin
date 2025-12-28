'use client'

import { useState, useMemo, useCallback } from 'react'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconGripVertical, IconPlus, IconX } from '@tabler/icons-react'

import { GroupBy, KpiType } from '@/shared/api/graphql'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import {
  type IDashboardConfig,
  type IDashboardWidget,
  type IKpiSlot,
  type WidgetType,
} from '@/entities/dashboard'

// ============================================
// KPI TYPE OPTIONS
// ============================================

const KPI_TYPE_OPTIONS: { value: KpiType; label: string }[] = [
  { value: KpiType.REVENUE, label: 'Выручка' },
  { value: KpiType.ORDERS, label: 'Заказы' },
  { value: KpiType.AVG_CHECK, label: 'Средний чек' },
  { value: KpiType.CUSTOMERS, label: 'Клиенты' },
  { value: KpiType.NEW_CUSTOMERS, label: 'Новые клиенты' },
  { value: KpiType.RETURNING_CUSTOMERS, label: 'Повторные' },
  { value: KpiType.TIPS, label: 'Чаевые' },
  { value: KpiType.REFUNDS, label: 'Возвраты' },
  { value: KpiType.CANCELLATIONS, label: 'Отмены' },
  { value: KpiType.MARGIN, label: 'Маржа' },
  { value: KpiType.RETENTION_RATE, label: 'Возвращаемость' },
  { value: KpiType.STAFF_PRODUCTIVITY, label: 'Продуктивность' },
]

const CHART_GROUPING_OPTIONS: { value: string; label: string }[] = [
  { value: 'auto', label: 'Авто (по периоду)' },
  { value: GroupBy.HOUR, label: 'По часам' },
  { value: GroupBy.DAY, label: 'По дням' },
  { value: GroupBy.WEEK, label: 'По неделям' },
  { value: GroupBy.MONTH, label: 'По месяцам' },
]

const WIDGET_TYPE_OPTIONS: { value: WidgetType; label: string; description: string }[] = [
  { value: 'TOP_PRODUCTS', label: 'Топ продукты', description: 'Лучшие товары по выручке' },
  { value: 'PAYMENT_METHODS', label: 'Способы оплаты', description: 'Распределение по типам оплаты' },
  { value: 'CHANNEL_SPLIT', label: 'Каналы продаж', description: 'Доставка, зал, самовывоз' },
  { value: 'STAFF_RANKING', label: 'Рейтинг сотрудников', description: 'Топ сотрудников по выручке' },
  { value: 'HOURLY_BREAKDOWN', label: 'По часам', description: 'Тепловая карта заказов' },
  { value: 'GOAL_PROGRESS', label: 'Цели', description: 'Прогресс по целям' },
  { value: 'ALERTS', label: 'Уведомления', description: 'Активные алерты' },
]

// ============================================
// MAIN COMPONENT
// ============================================

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
  // Local state for editing
  const [kpiSlots, setKpiSlots] = useState<IKpiSlot[]>(initialConfig.kpiSlots)
  const [chartMetric, setChartMetric] = useState<KpiType>(initialConfig.chartMetric)
  const [chartGroupBy, setChartGroupBy] = useState<GroupBy | null>(initialConfig.chartGroupBy)
  const [widgets, setWidgets] = useState<IDashboardWidget[]>(initialConfig.widgets)
  const [showWidgetPicker, setShowWidgetPicker] = useState(false)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // KPI slot handlers
  const handleKpiDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setKpiSlots((items) => {
        const oldIndex = items.findIndex((item) => `kpi-${item.position}` === active.id)
        const newIndex = items.findIndex((item) => `kpi-${item.position}` === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        // Update positions
        return newItems.map((item, idx) => ({ ...item, position: idx }))
      })
    }
  }, [])

  const handleRemoveKpi = useCallback((position: number) => {
    setKpiSlots((items) => {
      const newItems = items.filter((item) => item.position !== position)
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

  // Widget handlers
  const handleWidgetDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
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
      return [
        ...items,
        { id: newId, type, position: items.length, config: null },
      ]
    })
    setShowWidgetPicker(false)
  }, [])

  // Save handler
  const handleSave = useCallback(() => {
    onSave({
      kpiSlots,
      chartMetric,
      chartGroupBy,
      widgets,
    })
  }, [kpiSlots, chartMetric, chartGroupBy, widgets, onSave])

  // Available KPI types (not already selected)
  const availableKpiTypes = useMemo(() => {
    const usedTypes = new Set(kpiSlots.map((s) => s.type))
    return KPI_TYPE_OPTIONS.filter((opt) => !usedTypes.has(opt.value))
  }, [kpiSlots])

  const canAddKpi = kpiSlots.length < 6 && availableKpiTypes.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">Редактировать дашборд</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          KPI карточки (перетащите для изменения порядка)
        </h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleKpiDragEnd}
        >
          <SortableContext
            items={kpiSlots.map((s) => `kpi-${s.position}`)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-2">
              {kpiSlots.map((slot) => (
                <SortableKpiSlot
                  key={`kpi-${slot.position}`}
                  slot={slot}
                  onRemove={() => handleRemoveKpi(slot.position)}
                />
              ))}
              {canAddKpi && (
                <AddKpiButton
                  availableTypes={availableKpiTypes}
                  onAdd={handleAddKpi}
                />
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Chart Metric Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Метрика графика
        </h3>
        <Select
          value={chartMetric}
          onValueChange={(v) => setChartMetric(v as KpiType)}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KPI_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart Grouping Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Группировка графика
        </h3>
        <Select
          value={chartGroupBy ?? 'auto'}
          onValueChange={(v) => setChartGroupBy(v === 'auto' ? null : (v as GroupBy))}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHART_GROUPING_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Widgets Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Виджеты (перетащите для изменения порядка)
        </h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleWidgetDragEnd}
        >
          <SortableContext
            items={widgets.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {widgets.map((widget) => (
                <SortableWidget
                  key={widget.id}
                  widget={widget}
                  onRemove={() => handleRemoveWidget(widget.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add Widget */}
        {showWidgetPicker ? (
          <WidgetPicker
            onSelect={handleAddWidget}
            onCancel={() => setShowWidgetPicker(false)}
            existingTypes={widgets.map((w) => w.type)}
          />
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowWidgetPicker(true)}
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Добавить виджет
          </Button>
        )}
      </div>
    </div>
  )
}

// ============================================
// SORTABLE KPI SLOT
// ============================================

interface SortableKpiSlotProps {
  slot: IKpiSlot
  onRemove: () => void
}

function SortableKpiSlot({ slot, onRemove }: SortableKpiSlotProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `kpi-${slot.position}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const label = KPI_TYPE_OPTIONS.find((o) => o.value === slot.type)?.label ?? slot.type

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-1 rounded-lg border bg-background px-3 py-2',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <button
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 text-muted-foreground hover:text-destructive"
      >
        <IconX className="h-4 w-4" />
      </button>
    </div>
  )
}

// ============================================
// ADD KPI BUTTON
// ============================================

interface AddKpiButtonProps {
  availableTypes: { value: KpiType; label: string }[]
  onAdd: (type: KpiType) => void
}

function AddKpiButton({ availableTypes, onAdd }: AddKpiButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-1 rounded-lg border border-dashed px-3 text-muted-foreground hover:border-primary hover:text-primary"
      >
        <IconPlus className="h-4 w-4" />
        <span className="text-sm">Добавить</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border bg-popover p-1 shadow-lg">
            {availableTypes.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onAdd(opt.value)
                  setIsOpen(false)
                }}
                className="w-full rounded px-3 py-1.5 text-left text-sm hover:bg-muted"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// SORTABLE WIDGET
// ============================================

interface SortableWidgetProps {
  widget: IDashboardWidget
  onRemove: () => void
}

function SortableWidget({ widget, onRemove }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const config = WIDGET_TYPE_OPTIONS.find((o) => o.value === widget.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center justify-between rounded-lg border bg-background p-3',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <IconGripVertical className="h-5 w-5" />
        </button>
        <div>
          <span className="font-medium">{config?.label ?? widget.type}</span>
          <p className="text-xs text-muted-foreground">{config?.description}</p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive"
      >
        <IconX className="h-5 w-5" />
      </button>
    </div>
  )
}

// ============================================
// WIDGET PICKER
// ============================================

interface WidgetPickerProps {
  onSelect: (type: WidgetType) => void
  onCancel: () => void
  existingTypes: WidgetType[]
}

function WidgetPicker({ onSelect, onCancel, existingTypes }: WidgetPickerProps) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Выберите виджет</h4>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <IconX className="h-5 w-5" />
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {WIDGET_TYPE_OPTIONS.map((opt) => {
          const isUsed = existingTypes.includes(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => !isUsed && onSelect(opt.value)}
              disabled={isUsed}
              className={cn(
                'flex flex-col items-start rounded-lg border bg-background p-3 text-left',
                isUsed
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:border-primary hover:bg-primary/5'
              )}
            >
              <span className="font-medium">{opt.label}</span>
              <span className="text-xs text-muted-foreground">{opt.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
