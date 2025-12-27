'use client'

import { WidgetCard, WidgetSkeleton } from '@/entities/dashboard-widget'
import {
  WidgetActions,
  WidgetDragHandle,
} from '@/features/dashboard-builder'
import {
  BarChartWidget,
  LineChartWidget,
  ListWidget,
  NumberWidget,
  PieChartWidget,
  TextWidget,
} from '@/widgets/dashboard-widgets'

import type { WidgetConfig, WidgetData, WidgetVisualization } from '@/entities/dashboard-widget'

interface WidgetRendererProps {
  widget: WidgetConfig
  data: WidgetData | null
  isLoading: boolean
  isEditMode: boolean
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
}

type VisualizationComponent = React.ComponentType<{
  data: WidgetData
  config: WidgetConfig
}>

const VISUALIZATION_COMPONENTS: Record<WidgetVisualization, VisualizationComponent> = {
  number: NumberWidget,
  'line-chart': LineChartWidget,
  'bar-chart': BarChartWidget,
  'pie-chart': PieChartWidget,
  list: ListWidget,
  text: TextWidget as VisualizationComponent,
}

export function WidgetRenderer({
  widget,
  data,
  isLoading,
  isEditMode,
  isSelected,
  onSelect,
  onEdit,
}: WidgetRendererProps) {
  const VisualizationComponent = VISUALIZATION_COMPONENTS[widget.visualization]
  const shouldShowSkeleton = isLoading || !data

  // In edit mode, always render WidgetCard so actions are available
  // Otherwise show skeleton without card wrapper when loading
  if (shouldShowSkeleton && !isEditMode) {
    return <WidgetSkeleton visualization={widget.visualization} />
  }

  return (
    <WidgetCard
      id={widget.id}
      name={widget.name}
      isEditMode={isEditMode}
      isSelected={isSelected}
      onSelect={onSelect}
      dragHandle={isEditMode ? <WidgetDragHandle /> : undefined}
      actions={isEditMode ? <WidgetActions widgetId={widget.id} onEdit={onEdit} /> : undefined}
    >
      {shouldShowSkeleton ? (
        <SkeletonContent visualization={widget.visualization} />
      ) : (
        <VisualizationComponent data={data} config={widget} />
      )}
    </WidgetCard>
  )
}

// Skeleton content for use inside WidgetCard
function SkeletonContent({ visualization }: { visualization: WidgetVisualization }) {
  if (visualization === 'number') {
    return (
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-2 h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (visualization === 'line-chart' || visualization === 'bar-chart') {
    return (
      <div className="flex flex-1 items-end gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded bg-muted"
            style={{ height: `${30 + (i * 10) % 50}%` }}
          />
        ))}
      </div>
    )
  }

  if (visualization === 'pie-chart') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (visualization === 'list') {
    return (
      <div className="flex flex-1 flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  // text
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  )
}
