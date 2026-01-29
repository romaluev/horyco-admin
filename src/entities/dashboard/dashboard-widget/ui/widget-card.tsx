'use client'

import { cn } from '@/shared/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { ReactNode } from 'react'

interface WidgetCardProps {
  id: string
  name: string
  isEditMode: boolean
  isSelected: boolean
  onSelect?: () => void
  children: ReactNode
  className?: string
  actions?: ReactNode
  dragHandle?: ReactNode
}

export function WidgetCard({
  name,
  isEditMode,
  isSelected,
  onSelect,
  children,
  className,
  actions,
  dragHandle,
}: WidgetCardProps) {
  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden transition-all',
        isEditMode && 'ring-dashed ring-border hover:ring-primary/50 ring-2',
        isSelected && 'ring-primary',
        className
      )}
      onClick={isEditMode ? onSelect : undefined}
    >
      {isEditMode && (
        <>
          {dragHandle}
          <div
            className={cn(
              'absolute top-2 right-2 z-10 flex gap-1',
              'opacity-0 transition-opacity group-hover:opacity-100'
            )}
          >
            {actions}
          </div>
        </>
      )}

      <CardHeader className="flex-shrink-0 pb-1">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-hidden">
        {children}
      </CardContent>
    </Card>
  )
}
