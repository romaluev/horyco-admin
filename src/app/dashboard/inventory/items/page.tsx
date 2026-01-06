/**
 * Inventory Items Page
 * Page for managing inventory items (raw materials, ingredients)
 */

'use client'

import { useState } from 'react'

import { IconSearch } from '@tabler/icons-react'

import PageContainer from '@/shared/ui/layout/page-container'
import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { Badge } from '@/shared/ui/base/badge'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useBranchStore } from '@/entities/branch'
import { useGetInventoryItems, ItemStatusBadge } from '@/entities/inventory-item'
import {
  CreateItemDialog,
  UpdateItemDialog,
  DeleteItemButton,
} from '@/features/inventory-item-form'
import {
  ITEM_CATEGORIES,
  ITEM_CATEGORY_LABELS,
  UNIT_LABELS,
  type ItemCategory,
  type InventoryUnit,
} from '@/shared/types/inventory'

export default function InventoryItemsPage() {
  const { selectedBranchId } = useBranchStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const { data, isLoading } = useGetInventoryItems(
    {
      search: search || undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
    },
    { enabled: !!selectedBranchId }
  )

  const items = data || []

  if (!selectedBranchId) {
    return (
      <PageContainer>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Выберите филиал</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Товары</h1>
            <p className="text-muted-foreground">
              Сырьё, ингредиенты и расходные материалы
            </p>
          </div>
          <CreateItemDialog branchId={selectedBranchId} />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или артикулу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {ITEM_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {ITEM_CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Артикул</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Единица</TableHead>
                <TableHead>Мин. остаток</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">Товары не найдены</p>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.sku || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {ITEM_CATEGORY_LABELS[item.category as ItemCategory] || item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {UNIT_LABELS[item.unit as InventoryUnit] || item.unit}
                    </TableCell>
                    <TableCell>
                      {item.minStock ? `${item.minStock} ${UNIT_LABELS[item.unit as InventoryUnit] || item.unit}` : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <UpdateItemDialog item={item} />
                        <DeleteItemButton
                          itemId={item.id}
                          itemName={item.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  )
}
