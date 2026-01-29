'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'

import { useDashboardWidgetStore } from '@/entities/dashboard/dashboard-widget'
import {
  AddWidgetButton,
  AddWidgetModal,
  EditModeToggle,
  useWidgetData,
  WidgetConfigModal,
} from '@/features/dashboard/dashboard-builder'

import { DashboardGrid } from './dashboard-grid'
import { WidgetRenderer } from './widget-renderer'

import type { IDashboardAnalyticsResponse } from '@/entities/dashboard/analytics'
import type { WidgetLayoutItem } from '@/entities/dashboard/dashboard-widget'

interface CustomizableDashboardProps {
  analyticsData?: IDashboardAnalyticsResponse | null
  isLoading?: boolean
  className?: string
}

export function CustomizableDashboard({
  analyticsData,
  isLoading = false,
  className,
}: CustomizableDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [configModalWidgetId, setConfigModalWidgetId] = useState<string | null>(
    null
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const {
    config,
    isEditMode,
    selectedWidgetId,
    hasHydrated,
    selectWidget,
    updateLayout,
  } = useDashboardWidgetStore()

  // Measure container width - runs after hydration when ref is available
  useEffect(() => {
    if (!hasHydrated) return

    const container = containerRef.current
    if (!container) return

    // Set initial width immediately
    setContainerWidth(container.getBoundingClientRect().width)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setContainerWidth(entry.contentRect.width)
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [hasHydrated])

  const handleLayoutChange = useCallback(
    (newLayout: WidgetLayoutItem[]) => {
      updateLayout(newLayout)
    },
    [updateLayout]
  )

  const handleWidgetSelect = useCallback(
    (widgetId: string) => {
      selectWidget(selectedWidgetId === widgetId ? null : widgetId)
    },
    [selectWidget, selectedWidgetId]
  )

  const handleEditWidget = useCallback((widgetId: string) => {
    setConfigModalWidgetId(widgetId)
  }, [])

  const widgets = useMemo(() => Object.values(config.widgets), [config.widgets])

  // Wait for Zustand to hydrate from localStorage before rendering
  if (!hasHydrated) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <div className="bg-muted h-7 w-24 animate-pulse rounded" />
          <div className="bg-muted h-9 w-32 animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (widgets.length === 0 && !isEditMode) {
    return (
      <div
        className={cn(
          'rounded-xl border border-dashed p-8 text-center',
          className
        )}
      >
        <p className="text-muted-foreground mb-4">Виджеты пока не добавлены</p>
        <EditModeToggle />
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Виджеты</h3>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <AddWidgetButton onClick={() => setIsAddModalOpen(true)} />
          )}
          <EditModeToggle />
        </div>
      </div>

      {/* Grid */}
      {containerWidth > 0 && widgets.length > 0 && (
        <DashboardGrid
          layout={config.layout}
          onLayoutChange={handleLayoutChange}
          isEditMode={isEditMode}
          width={containerWidth}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              data-grid={config.layout.find((l) => l.i === widget.id)}
            >
              <WidgetItem
                widget={widget}
                analyticsData={analyticsData}
                isLoading={isLoading}
                isEditMode={isEditMode}
                isSelected={selectedWidgetId === widget.id}
                onSelect={() => handleWidgetSelect(widget.id)}
                onEdit={() => handleEditWidget(widget.id)}
              />
            </div>
          ))}
        </DashboardGrid>
      )}

      {/* Empty state in edit mode */}
      {isEditMode && widgets.length === 0 && (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Нажмите &quot;Добавить виджет&quot; чтобы начать
          </p>
          <AddWidgetButton onClick={() => setIsAddModalOpen(true)} />
        </div>
      )}

      {/* Modals */}
      <WidgetConfigModal
        widgetId={configModalWidgetId}
        isOpen={configModalWidgetId !== null}
        onClose={() => setConfigModalWidgetId(null)}
      />

      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}

// Separate component for widget items to use hook
interface WidgetItemProps {
  widget: ReturnType<
    typeof useDashboardWidgetStore.getState
  >['config']['widgets'][string]
  analyticsData?: IDashboardAnalyticsResponse | null
  isLoading: boolean
  isEditMode: boolean
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
}

function WidgetItem({
  widget,
  analyticsData,
  isLoading,
  isEditMode,
  isSelected,
  onSelect,
  onEdit,
}: WidgetItemProps) {
  const data = useWidgetData({ widget, analyticsData })

  return (
    <WidgetRenderer
      widget={widget}
      data={data}
      isLoading={isLoading}
      isEditMode={isEditMode}
      isSelected={isSelected}
      onSelect={onSelect}
      onEdit={onEdit}
    />
  )
}
