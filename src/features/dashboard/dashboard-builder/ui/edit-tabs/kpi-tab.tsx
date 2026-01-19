'use client'

import { useCallback, useMemo } from 'react'

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
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { IconTrendingUp } from '@tabler/icons-react'

import { KpiType } from '@/shared/api/graphql'
import { cn } from '@/shared/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import { KPI_CONFIG, type IKpiSlot } from '@/entities/dashboard/dashboard'

import { MiniSparkline } from '../chart-previews'
import { SortableKpiCard, KpiCardOverlay } from '../sortable-cards'

interface IKpiTabProps {
  kpiSlots: IKpiSlot[]
  onKpiSlotsChange: (slots: IKpiSlot[]) => void
  activeKpiId: string | null
  onActiveKpiIdChange: (id: string | null) => void
}

export function KpiTab({
  kpiSlots,
  onKpiSlotsChange,
  activeKpiId,
  onActiveKpiIdChange,
}: IKpiTabProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const kpiIds = useMemo(() => kpiSlots.map((s) => s.type), [kpiSlots])
  const usedKpiTypes = useMemo(() => new Set(kpiSlots.map((s) => s.type)), [kpiSlots])
  const canAddKpi = kpiSlots.length < 6

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      onActiveKpiIdChange(event.active.id as string)
    },
    [onActiveKpiIdChange]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      onActiveKpiIdChange(null)
      const { active, over } = event
      if (over && active.id !== over.id) {
        const oldIndex = kpiSlots.findIndex((item) => item.type === active.id)
        const newIndex = kpiSlots.findIndex((item) => item.type === over.id)
        if (oldIndex === -1 || newIndex === -1) return
        const newItems = arrayMove(kpiSlots, oldIndex, newIndex)
        onKpiSlotsChange(newItems.map((item, idx) => ({ ...item, position: idx })))
      }
    },
    [kpiSlots, onKpiSlotsChange, onActiveKpiIdChange]
  )

  const handleRemoveKpi = useCallback(
    (type: KpiType) => {
      const newItems = kpiSlots.filter((item) => item.type !== type)
      onKpiSlotsChange(newItems.map((item, idx) => ({ ...item, position: idx })))
    },
    [kpiSlots, onKpiSlotsChange]
  )

  const handleAddKpi = useCallback(
    (type: KpiType) => {
      if (kpiSlots.length >= 6) return
      if (kpiSlots.some((item) => item.type === type)) return
      onKpiSlotsChange([...kpiSlots, { position: kpiSlots.length, type, visible: true }])
    },
    [kpiSlots, onKpiSlotsChange]
  )

  const activeKpiSlot = activeKpiId ? kpiSlots.find((s) => s.type === activeKpiId) : null

  return (
    <div className="space-y-6">
      {/* Active KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Активные KPI карточки</CardTitle>
          <CardDescription>Перетащите для изменения порядка</CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
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
            <DragOverlay>{activeKpiSlot && <KpiCardOverlay slot={activeKpiSlot} />}</DragOverlay>
          </DndContext>
        </CardContent>
      </Card>

      {/* Available KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Добавить KPI</CardTitle>
          <CardDescription>Выберите показатели для отображения</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(KPI_CONFIG).filter(([type]) => !usedKpiTypes.has(type as KpiType))
            .length === 0 ? (
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
                      type="button"
                      onClick={() => canAddKpi && handleAddKpi(kpiType)}
                      disabled={!canAddKpi}
                      className={cn(
                        'group relative overflow-hidden rounded-xl border bg-card p-4 text-left transition-all',
                        !canAddKpi
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:border-primary hover:shadow-md'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn('rounded-lg p-2', config.bgColor)}>
                            <Icon className={cn('size-4', config.color)} />
                          </div>
                          <div>
                            <p className="font-medium">{config.label}</p>
                            <p className="text-xs text-muted-foreground">Нажмите для добавления</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 h-8">
                        <MiniSparkline color={config.color} />
                      </div>
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
    </div>
  )
}
