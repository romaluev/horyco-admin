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
        'absolute top-2 left-2 z-10 cursor-grab p-1',
        'text-muted-foreground rounded-md transition-colors',
        'hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100',
        'active:cursor-grabbing',
        className
      )}
    >
      <IconGripVertical className="h-4 w-4" />
    </div>
  )
}
