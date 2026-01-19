'use client'

import Link from 'next/link'

import { IconBox, IconCheck } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

interface IEmptyStockStateProps {
  hasFilters?: boolean
  onClearFilters?: () => void
}

export const EmptyStockState = ({ hasFilters, onClearFilters }: IEmptyStockStateProps) => {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <IconCheck className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Все товары в наличии</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
          По выбранным фильтрам нет товаров с низким остатком.
        </p>
        <Button variant="outline" className="mt-6" onClick={onClearFilters}>
          Сбросить фильтры
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <IconBox className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">Нет данных об остатках</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
        Остатки появятся после приёмки первого заказа на закупку.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/inventory/purchase-orders">
          Создать заказ на закупку
        </Link>
      </Button>
    </div>
  )
}
