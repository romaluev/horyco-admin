'use client'

import { IconFileText } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

interface IEmptyMovementsStateProps {
  onClearFilters?: () => void
}

export const EmptyMovementsState = ({
  onClearFilters,
}: IEmptyMovementsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <IconFileText className="text-muted-foreground/50 h-12 w-12" />
      <h3 className="mt-4 text-lg font-semibold">Нет движений</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
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
