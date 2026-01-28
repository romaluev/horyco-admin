'use client'

import { IconFileText } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

interface IEmptyMovementsStateProps {
  onClearFilters?: () => void
}

export const EmptyMovementsState = ({ onClearFilters }: IEmptyMovementsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <IconFileText className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">Нет движений</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Попробуйте изменить фильтры или период.
      </p>
      {onClearFilters && (
        <Button variant="outline" className="mt-6" onClick={onClearFilters}>
          Сбросить фильтры
        </Button>
      )}
    </div>
  )
}
