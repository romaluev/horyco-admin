'use client'

import { IconPlus } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

interface AddWidgetButtonProps {
  onClick: () => void
  className?: string
}

export function AddWidgetButton({ onClick, className }: AddWidgetButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={className}
    >
      <IconPlus className="mr-1.5 h-4 w-4" />
      Добавить виджет
    </Button>
  )
}
