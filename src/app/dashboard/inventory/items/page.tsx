'use client'

import { useState } from 'react'

import { IconSearch, IconUpload } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetInventoryItems } from '@/entities/inventory-item'
import { CreateItemDialog, categoryOptions } from '@/features/inventory-item-form'
import {
  EmptyItemsState,
  ItemsTable,
  ItemsTableSkeleton,
} from '@/widgets/inventory-items-table'

type ItemType = 'all' | 'raw' | 'semi-finished'

export default function InventoryItemsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean | undefined>()
  const [itemType, setItemType] = useState<ItemType>('all')

  const isSemiFinished = itemType === 'all' ? undefined : itemType === 'semi-finished'

  const { data: items, isLoading } = useGetInventoryItems({
    search: search || undefined,
    category: category || undefined,
    isActive,
    isSemiFinished,
  })

  const filteredItems = items ?? []

  const handleImportCSV = () => {
    // CSV import will be implemented in separate feature
  }

  const renderContent = () => {
    if (isLoading) return <ItemsTableSkeleton />
    if (filteredItems.length === 0) return <EmptyItemsState onImportCSV={handleImportCSV} />
    return <ItemsTable items={filteredItems} />
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Номенклатура товаров"
            description="Управление номенклатурой сырья и полуфабрикатов"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportCSV}>
              <IconUpload className="mr-2 h-4 w-4" />
              Импорт CSV
            </Button>
            <CreateItemDialog />
          </div>
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, SKU, штрихкоду..."
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
            onValueChange={(val) => setIsActive(val === 'all' ? undefined : val === 'active')}
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
          <Select
            value={itemType}
            onValueChange={(value) => setItemType(value as ItemType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Тип товара" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="raw">Сырьё</SelectItem>
              <SelectItem value="semi-finished">Полуфабрикаты</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderContent()}
      </div>
    </PageContainer>
  )
}
