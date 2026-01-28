'use client'

import { IconGripVertical } from '@tabler/icons-react'

import { cn } from '@/shared/lib/utils'

interface WidgetDragHandleProps {
  className?: string
}

export function WidgetDragHandle({ className }: WidgetDragHandleProps) {
  return (
    <div
      className={cn(
        'widget-drag-handle',
        'absolute left-2 top-2 z-10 cursor-grab p-1',
        'rounded-md text-muted-foreground transition-colors',
        'opacity-0 hover:bg-muted hover:text-foreground group-hover:opacity-100',
        'active:cursor-grabbing',
        className
      )}
    >
      <IconGripVertical className="h-4 w-4" />
    </div>
  )
}
