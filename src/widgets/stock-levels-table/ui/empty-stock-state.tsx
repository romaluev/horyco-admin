'use client'

import { Link } from '@tanstack/react-router'

import { IconBox, IconCheck } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

interface IEmptyStockStateProps {
  hasFilters?: boolean
  onClearFilters?: () => void
}

export const EmptyStockState = ({
  hasFilters,
  onClearFilters,
}: IEmptyStockStateProps) => {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <IconCheck className="text-muted-foreground/50 h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">Все товары в наличии</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
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
      <IconBox className="text-muted-foreground/50 h-12 w-12" />
      <h3 className="mt-4 text-lg font-semibold">Нет данных об остатках</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
        Остатки появятся после приёмки первого заказа на закупку.
      </p>
      <Button asChild className="mt-6">
        <Link to="/dashboard/inventory/purchase-orders">
          Создать заказ на закупку
        </Link>
      </Button>
    </div>
  )
}
