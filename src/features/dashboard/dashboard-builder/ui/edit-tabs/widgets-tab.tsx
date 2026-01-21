'use client'

import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

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

import { cn } from '@/shared/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import {
  WIDGET_CONFIG,
  WIDGET_CATEGORY_LABELS,
  type IDashboardWidget,
  type WidgetType,
  type WidgetCategory,
} from '@/entities/dashboard/dashboard'

import { WidgetPreviewChart } from '../chart-previews'
import { SortableWidgetCard, WidgetCardOverlay } from '../sortable-cards'

interface IWidgetsTabProps {
  widgets: IDashboardWidget[]
  onWidgetsChange: (widgets: IDashboardWidget[]) => void
  activeWidgetId: string | null
  onActiveWidgetIdChange: (id: string | null) => void
}

const WIDGET_CATEGORIES: WidgetCategory[] = ['charts', 'analytics', 'data', 'insights']

// Get displayable widget options (exclude legacy/internal widgets)
const WIDGET_OPTIONS = (Object.entries(WIDGET_CONFIG) as [WidgetType, typeof WIDGET_CONFIG[WidgetType]][])
  .filter(([type]) => !['CUSTOMER_SEGMENTS', 'BRANCH_COMPARISON', 'RECENT_ORDERS'].includes(type))
  .map(([type, config]) => ({ type, ...config }))

export function WidgetsTab({
  widgets,
  onWidgetsChange,
  activeWidgetId,
  onActiveWidgetIdChange,
}: IWidgetsTabProps) {
  const { t } = useTranslation('dashboard')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const widgetIds = useMemo(() => widgets.map((w) => w.id), [widgets])

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      onActiveWidgetIdChange(event.active.id as string)
    },
    [onActiveWidgetIdChange]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      onActiveWidgetIdChange(null)
      const { active, over } = event
      if (over && active.id !== over.id) {
        const oldIndex = widgets.findIndex((item) => item.id === active.id)
        const newIndex = widgets.findIndex((item) => item.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return
        const newItems = arrayMove(widgets, oldIndex, newIndex)
        onWidgetsChange(newItems.map((item, idx) => ({ ...item, position: idx })))
      }
    },
    [widgets, onWidgetsChange, onActiveWidgetIdChange]
  )

  const handleRemoveWidget = useCallback(
    (id: string) => {
      const newItems = widgets.filter((item) => item.id !== id)
      onWidgetsChange(newItems.map((item, idx) => ({ ...item, position: idx })))
    },
    [widgets, onWidgetsChange]
  )

  const handleAddWidget = useCallback(
    (type: WidgetType) => {
      const newId = `w${Date.now()}`
      onWidgetsChange([...widgets, { id: newId, type, position: widgets.length, config: null }])
    },
    [widgets, onWidgetsChange]
  )

  const activeWidget = activeWidgetId ? widgets.find((w) => w.id === activeWidgetId) : null

  return (
    <div className="space-y-6">
      {/* Active Widgets */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.widgets.widgetsTab.activeWidgets')}</CardTitle>
          <CardDescription>{t('dashboard.widgets.widgetsTab.reorderHint')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
              {widgets.length === 0 ? (
                <div className="rounded-xl border border-dashed p-12 text-center">
                  <p className="text-muted-foreground">
                    {t('dashboard.widgets.widgetsTab.noActiveWidgets')}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {widgets.map((widget) => (
                    <SortableWidgetCard
                      key={widget.id}
                      widget={widget}
                      onRemove={() => handleRemoveWidget(widget.id)}
                    />
                  ))}
                </div>
              )}
            </SortableContext>
            <DragOverlay>{activeWidget && <WidgetCardOverlay widget={activeWidget} />}</DragOverlay>
          </DndContext>
        </CardContent>
      </Card>

      {/* Widget Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.widgets.widgetsTab.widgetGallery')}</CardTitle>
          <CardDescription>{t('dashboard.widgets.widgetsTab.selectWidgets')}</CardDescription>
        </CardHeader>
        <CardContent>
          {WIDGET_CATEGORIES.map((category) => {
            const categoryWidgets = WIDGET_OPTIONS.filter((w) => w.category === category)
            if (categoryWidgets.length === 0) return null

            return (
              <div key={category} className="mb-6 last:mb-0">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {WIDGET_CATEGORY_LABELS[category]}
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryWidgets.map((opt) => {
                    const isUsed = widgets.some((w) => w.type === opt.type)
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => !isUsed && handleAddWidget(opt.type)}
                        disabled={isUsed}
                        className={cn(
                          'group overflow-hidden rounded-xl border bg-card text-left transition-all',
                          isUsed
                            ? 'cursor-not-allowed opacity-50'
                            : 'hover:border-primary hover:shadow-lg'
                        )}
                      >
                        <div className="h-24 border-b bg-muted/30 p-3">
                          <WidgetPreviewChart type={opt.preview} />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{opt.title}</span>
                            {isUsed && (
                              <span className="rounded bg-muted px-1.5 py-0.5 text-xs">
                                {t('dashboard.widgets.widgetsTab.added')}
                              </span>
                            )}
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
    </div>
  )
}
