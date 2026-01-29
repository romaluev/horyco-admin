'use client'

import { useState } from 'react'

import { IconDownload, IconSearch } from '@tabler/icons-react'
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

import { useGetStock } from '@/entities/inventory/stock'
import { useGetWarehouses } from '@/entities/inventory/warehouse'
import { categoryOptions } from '@/features/inventory/inventory-item-form'
import { AdjustStockDialog } from '@/features/inventory/stock-adjustment'
import {
  EmptyStockState,
  StockSummary,
  StockTable,
  StockTableSkeleton,
} from '@/widgets/stock-levels-table'

type StockStatus = 'all' | 'low' | 'out'

export default function StockPage() {
  const { t } = useTranslation('inventory')
  const [search, setSearch] = useState('')
  const [warehouseId, setWarehouseId] = useState<number | undefined>()
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<StockStatus>('all')

  const { data: warehouses } = useGetWarehouses()
  const { data: stockData, isLoading } = useGetStock({
    search: search || undefined,
    warehouseId,
    category: category || undefined,
  })

  const stockItems = stockData?.data ?? []
  const hasFilters = status !== 'all' || !!category

  const filteredStock = stockItems.filter((stock) => {
    if (status === 'low') {
      const minLevel = stock.item?.minStockLevel ?? 0
      return stock.quantity > 0 && stock.quantity <= minLevel
    }
    if (status === 'out') {
      return stock.quantity <= 0
    }
    return true
  })

  const summary = stockData?.summary ?? {
    totalItems: stockItems.length,
    lowStockCount: stockItems.filter(
      (s) => s.quantity > 0 && s.item?.minStockLevel && s.quantity <= s.item.minStockLevel
    ).length,
    outOfStockCount: stockItems.filter((s) => s.quantity <= 0).length,
    totalValue: stockItems.reduce((sum, s) => sum + s.quantity * s.averageCost, 0),
  }

  const handleClearFilters = () => {
    setStatus('all')
    setCategory('')
  }

  const handleExport = () => {
    // Export will be implemented in separate feature
  }

  const renderContent = () => {
    if (isLoading) return <StockTableSkeleton />
    if (!warehouseId) {
      return (
        <div className="flex items-center justify-center rounded-lg border border-dashed py-16">
          <p className="text-muted-foreground">{t('pages.stock.selectWarehouseMessage')}</p>
        </div>
      )
    }
    if (filteredStock.length === 0) {
      return <EmptyStockState hasFilters={hasFilters} onClearFilters={handleClearFilters} />
    }
    return <StockTable items={filteredStock} />
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={t('pages.stock.title')}
            description={t('pages.stock.description')}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <IconDownload className="mr-2 h-4 w-4" />
              {t('pages.stock.export')}
            </Button>
            <AdjustStockDialog />
          </div>
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
          <Select
            value={warehouseId ? String(warehouseId) : 'all'}
            onValueChange={(val) => setWarehouseId(val === 'all' ? undefined : Number(val))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('pages.stock.selectWarehouse')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('pages.stock.allWarehouses')}</SelectItem>
              {warehouses?.map((warehouse) => (
                <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={category || 'all'}
            onValueChange={(val) => setCategory(val === 'all' ? '' : val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('pages.stock.selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('pages.stock.allCategories')}</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(val) => setStatus(val as StockStatus)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('pages.stock.allProducts')}</SelectItem>
              <SelectItem value="low">{t('pages.stock.lowStock')}</SelectItem>
              <SelectItem value="out">{t('pages.stock.outOfStock')}</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('pages.stock.searchProduct')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {renderContent()}

        {warehouseId && filteredStock.length > 0 && (
          <StockSummary
            totalItems={summary.totalItems}
            lowStockCount={summary.lowStockCount}
            outOfStockCount={summary.outOfStockCount}
            totalValue={summary.totalValue}
          />
        )}
      </div>
    </PageContainer>
  )
}
