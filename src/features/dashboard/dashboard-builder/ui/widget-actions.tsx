'use client'

import { IconCopy, IconPencil, IconTrash } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/base/tooltip'

import { useDashboardWidgetStore } from '@/entities/dashboard/dashboard-widget'

interface WidgetActionsProps {
  widgetId: string
  onEdit?: () => void
}

export function WidgetActions({ widgetId, onEdit }: WidgetActionsProps) {
  const { removeWidget, duplicateWidget } = useDashboardWidgetStore()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeWidget(widgetId)
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateWidget(widgetId)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.()
  }

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={handleEdit}
          >
            <IconPencil className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Редактировать</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={handleDuplicate}
          >
            <IconCopy className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Дублировать</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleDelete}
          >
            <IconTrash className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Удалить</TooltipContent>
      </Tooltip>
    </div>
  )
}
