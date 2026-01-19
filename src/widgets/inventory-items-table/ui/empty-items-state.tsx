'use client'

import { IconPackage, IconUpload } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

import { CreateItemDialog } from '@/features/inventory/inventory-item-form'

interface IEmptyItemsStateProps {
  onImportCSV: () => void
}

export const EmptyItemsState = ({ onImportCSV }: IEmptyItemsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <IconPackage className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">Нет товаров в номенклатуре</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Добавьте сырьё и полуфабрикаты для начала учёта запасов.
      </p>
      <div className="mt-6 flex gap-2">
        <CreateItemDialog />
        <Button variant="outline" onClick={onImportCSV}>
          <IconUpload className="mr-2 h-4 w-4" />
          Импорт из CSV
        </Button>
      </div>
    </div>
  )
}
