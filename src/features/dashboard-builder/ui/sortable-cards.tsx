'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconGripVertical, IconX, IconTrendingUp } from '@tabler/icons-react'

import { cn } from '@/shared/lib/utils'
import {
  KPI_CONFIG,
  WIDGET_CONFIG,
  type IKpiSlot,
  type IDashboardWidget,
} from '@/entities/dashboard'

import { MiniSparkline, WidgetPreviewChart } from './chart-previews'

// ============================================
// SORTABLE KPI CARD
// ============================================

interface ISortableKpiCardProps {
  slot: IKpiSlot
  onRemove: () => void
}

export function SortableKpiCard({ slot, onRemove }: ISortableKpiCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slot.type,
  })

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
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 z-10 flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
      >
        <IconX className="size-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <button type="button" className="cursor-grab touch-none" {...attributes} {...listeners}>
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
          <MiniSparkline color={config.color} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// KPI CARD OVERLAY (for drag overlay)
// ============================================

interface IKpiCardOverlayProps {
  slot: IKpiSlot
}

export function KpiCardOverlay({ slot }: IKpiCardOverlayProps) {
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
          <MiniSparkline color={config.color} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// SORTABLE WIDGET CARD
// ============================================

interface ISortableWidgetCardProps {
  widget: IDashboardWidget
  onRemove: () => void
}

export function SortableWidgetCard({ widget, onRemove }: ISortableWidgetCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  })

  const config = WIDGET_CONFIG[widget.type]

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
          type="button"
          className="cursor-grab touch-none rounded-lg bg-background/80 p-1.5 text-muted-foreground backdrop-blur-sm hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <IconGripVertical className="size-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg bg-background/80 p-1.5 text-muted-foreground backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive"
        >
          <IconX className="size-4" />
        </button>
      </div>

      <div className="border-b p-4">
        <h4 className="font-semibold">{config?.title ?? widget.type}</h4>
        <p className="text-sm text-muted-foreground">{config?.description}</p>
      </div>

      <div className="h-48 p-4">
        {config && <WidgetPreviewChart type={config.preview} />}
      </div>
    </div>
  )
}

// ============================================
// WIDGET CARD OVERLAY (for drag overlay)
// ============================================

interface IWidgetCardOverlayProps {
  widget: IDashboardWidget
}

export function WidgetCardOverlay({ widget }: IWidgetCardOverlayProps) {
  const config = WIDGET_CONFIG[widget.type]

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xl ring-2 ring-primary">
      <div className="border-b p-4">
        <h4 className="font-semibold">{config?.title ?? widget.type}</h4>
        <p className="text-sm text-muted-foreground">{config?.description}</p>
      </div>
      <div className="h-48 p-4">
        {config && <WidgetPreviewChart type={config.preview} />}
      </div>
    </div>
  )
}
