'use client'

import { useCallback } from 'react'

import GridLayout from 'react-grid-layout'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { cn } from '@/shared/lib/utils'

import {
  GRID_COLS,
  GRID_MARGIN,
  GRID_ROW_HEIGHT,
} from '@/entities/dashboard/dashboard-widget'

import type { WidgetLayoutItem } from '@/entities/dashboard/dashboard-widget'
import type { ReactElement } from 'react'

interface DashboardGridProps {
  layout: WidgetLayoutItem[]
  onLayoutChange: (layout: WidgetLayoutItem[]) => void
  isEditMode: boolean
  width: number
  children: ReactElement[]
  className?: string
}

export function DashboardGrid({
  layout,
  onLayoutChange,
  isEditMode,
  width,
  children,
  className,
}: DashboardGridProps) {
  const handleLayoutChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newLayout: any[]) => {
      const mappedLayout: WidgetLayoutItem[] = newLayout.map((item) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        maxW: item.maxW,
        minH: item.minH,
        maxH: item.maxH,
        static: item.static,
      }))
      onLayoutChange(mappedLayout)
    },
    [onLayoutChange]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GridLayoutComponent = GridLayout as any

  return (
    <div className={cn('dashboard-grid', className)}>
      <GridLayoutComponent
        className="layout"
        layout={layout}
        cols={GRID_COLS}
        rowHeight={GRID_ROW_HEIGHT}
        width={width}
        margin={GRID_MARGIN}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".widget-drag-handle"
        compactType="vertical"
        preventCollision={false}
        useCSSTransforms
      >
        {children}
      </GridLayoutComponent>
      <style jsx global>{`
        .react-grid-item.react-grid-placeholder {
          background: hsl(var(--primary) / 0.2);
          border: 2px dashed hsl(var(--primary));
          border-radius: var(--radius);
        }

        .react-grid-item > .react-resizable-handle {
          background: transparent;
        }

        .react-grid-item > .react-resizable-handle::after {
          content: '';
          position: absolute;
          right: 4px;
          bottom: 4px;
          width: 8px;
          height: 8px;
          border-right: 2px solid hsl(var(--muted-foreground) / 0.4);
          border-bottom: 2px solid hsl(var(--muted-foreground) / 0.4);
        }

        .react-grid-item:hover > .react-resizable-handle::after {
          border-color: hsl(var(--primary));
        }
      `}</style>
    </div>
  )
}
