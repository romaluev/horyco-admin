'use client'

import { IconCheck, IconPencil } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

import { useDashboardWidgetStore } from '@/entities/dashboard/dashboard-widget'

interface EditModeToggleProps {
  className?: string
}

export function EditModeToggle({ className }: EditModeToggleProps) {
  const { isEditMode, toggleEditMode } = useDashboardWidgetStore()

  return (
    <Button
      variant={isEditMode ? 'default' : 'outline'}
      size="sm"
      onClick={toggleEditMode}
      className={className}
    >
      {isEditMode ? (
        <>
          <IconCheck className="mr-1.5 h-4 w-4" />
          Готово
        </>
      ) : (
        <>
          <IconPencil className="mr-1.5 h-4 w-4" />
          Редактировать
        </>
      )}
    </Button>
  )
}
