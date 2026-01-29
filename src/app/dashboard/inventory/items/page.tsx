'use client'

import { useState } from 'react'

import { IconSearch, IconUpload } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

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

import { useGetInventoryItems } from '@/entities/inventory/inventory-item'
import {
  CreateItemDialog,
  categoryOptions,
} from '@/features/inventory/inventory-item-form'
import {
  EmptyItemsState,
  ItemsTable,
  ItemsTableSkeleton,
} from '@/widgets/inventory-items-table'

type ItemType = 'all' | 'raw' | 'semi-finished'

export default function InventoryItemsPage() {
  const { t } = useTranslation('inventory')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean | undefined>()
  const [itemType, setItemType] = useState<ItemType>('all')

  const isSemiFinished =
    itemType === 'all' ? undefined : itemType === 'semi-finished'

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
    if (filteredItems.length === 0)
      return <EmptyItemsState onImportCSV={handleImportCSV} />
    return <ItemsTable items={filteredItems} />
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={t('pages.items.title')}
            description={t('pages.items.description')}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportCSV}>
              <IconUpload className="mr-2 h-4 w-4" />
              {t('pages.items.import')}
            </Button>
            <CreateItemDialog />
          </div>
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t('pages.items.searchItems')}
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
              <SelectValue placeholder={t('pages.items.allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('pages.items.allCategories')}
              </SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={
              isActive === undefined ? 'all' : isActive ? 'active' : 'inactive'
            }
            onValueChange={(val) =>
              setIsActive(val === 'all' ? undefined : val === 'active')
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('pages.items.all')}</SelectItem>
              <SelectItem value="active">{t('pages.items.active')}</SelectItem>
              <SelectItem value="inactive">
                {t('pages.items.inactive')}
              </SelectItem>
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
              <SelectItem value="all">{t('pages.items.allTypes')}</SelectItem>
              <SelectItem value="raw">{t('pages.items.raw')}</SelectItem>
              <SelectItem value="semi-finished">
                {t('pages.items.semiFinished')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderContent()}
      </div>
    </PageContainer>
  )
}
