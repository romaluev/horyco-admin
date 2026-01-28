'use client'

import { Link } from '@tanstack/react-router'

import { Package, Upload } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import { Card, CardContent } from '@/shared/ui/base/card'

export function EmptyInventoryState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>

        <h3 className="mb-2 text-lg font-semibold">Начните работу со складом</h3>

        <div className="mb-6 text-center text-sm text-muted-foreground">
          <ol className="space-y-1">
            <li>1. Добавьте товары на склад</li>
            <li>2. Создайте техкарты для продуктов</li>
            <li>3. Укажите начальные остатки</li>
          </ol>
        </div>

        <div className="flex gap-4">
          <Button asChild>
            <Link to={"/dashboard/inventory/items/new" as any}>
              <Package className="mr-2 h-4 w-4" />
              Добавить товар
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={"/dashboard/inventory/items?import=true" as any}>
              <Upload className="mr-2 h-4 w-4" />
              Импортировать
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
