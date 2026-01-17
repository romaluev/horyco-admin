'use client'

import { useState } from 'react'
import Link from 'next/link'

import { IconSearch } from '@tabler/icons-react'

import { Heading } from '@/shared/ui/base/heading'
import { Button } from '@/shared/ui/base/button'
import { Input } from '@/shared/ui/base/input'
import { Separator } from '@/shared/ui/base/separator'
import { Skeleton } from '@/shared/ui/base/skeleton'
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
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetInventoryItems } from '@/entities/inventory-item'
import {
  CreateItemDialog,
  DeleteItemButton,
  categoryOptions,
} from '@/features/inventory-item-form'

export default function InventoryItemsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean | undefined>()

  const { data: items, isLoading } = useGetInventoryItems({
    search: search || undefined,
    category: category || undefined,
    isActive,
  })

  const filteredItems = items ?? []

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Товары"
            description="Управление номенклатурой складских товаров"
          />
          <CreateItemDialog />
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={category}
            onValueChange={(val) => setCategory(val === 'all' ? '' : val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={isActive === undefined ? 'all' : isActive ? 'active' : 'inactive'}
            onValueChange={(value) =>
              setIsActive(value === 'all' ? undefined : value === 'active')
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Единица</TableHead>
                  <TableHead>Мин. остаток</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Товары не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.sku || '—'}
                      </TableCell>
                      <TableCell>{item.category || '—'}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.minStockLevel}</TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? 'default' : 'secondary'}>
                          {item.isActive ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/inventory/items/${item.id}`}>
                              Открыть
                            </Link>
                          </Button>
                          <DeleteItemButton itemId={item.id} itemName={item.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
