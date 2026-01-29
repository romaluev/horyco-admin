'use client'

import { Link } from '@tanstack/react-router'

import { formatPrice } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import { DeleteItemButton } from '@/features/inventory/inventory-item-form'

import type { IInventoryItem } from '@/entities/inventory/inventory-item'

interface IItemsTableProps {
  items: IInventoryItem[]
}

export const ItemsTable = ({ items }: IItemsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Единица</TableHead>
            <TableHead className="text-right">В наличии</TableHead>
            <TableHead className="text-right">Мин. остаток</TableHead>
            <TableHead className="text-right">Себестоимость</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  to={`/dashboard/inventory/items/${item.id}` as any}
                  className="hover:underline"
                >
                  {item.name}
                  {item.isSemiFinished && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      ПФ
                    </Badge>
                  )}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.sku || '—'}
              </TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell className="text-right">
                {item.totalStock !== null ? (
                  <span
                    className={
                      item.totalStock <= item.minStockLevel
                        ? 'text-destructive font-medium'
                        : ''
                    }
                  >
                    {item.totalStock}
                  </span>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-right">
                {item.minStockLevel}
              </TableCell>
              <TableCell className="text-right">
                {item.avgCost !== null ? formatPrice(item.avgCost) : '—'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/inventory/items/${item.id}` as any}>
                      Открыть
                    </Link>
                  </Button>
                  <DeleteItemButton itemId={item.id} itemName={item.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
