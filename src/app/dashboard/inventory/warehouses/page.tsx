'use client'

import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { IconSearch, IconBuildingWarehouse } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { formatCurrency } from '@/shared/lib/format'
import { Badge } from '@/shared/ui/base/badge'
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
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetWarehouses,
  useWarehouseStockSummary,
} from '@/entities/inventory/warehouse'
import {
  CreateWarehouseDialog,
  DeleteWarehouseButton,
  UpdateWarehouseDialog,
} from '@/features/inventory/warehouse-form'

import type { IWarehouse } from '@/entities/inventory/warehouse'

function WarehouseItemsCell({ warehouseId }: { warehouseId: number }) {
  const { data: summary, isLoading } = useWarehouseStockSummary(warehouseId)

  if (isLoading) {
    return <Skeleton className="h-4 w-12" />
  }

  return <span>{summary?.totalItems ?? 0}</span>
}

function WarehouseValueCell({ warehouseId }: { warehouseId: number }) {
  const { data: summary, isLoading } = useWarehouseStockSummary(warehouseId)

  if (isLoading) {
    return <Skeleton className="h-4 w-20" />
  }

  return <span>{formatCurrency(summary?.totalValue ?? 0)}</span>
}

export default function WarehousesPage() {
  const { t } = useTranslation('inventory')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [editingWarehouse, setEditingWarehouse] = useState<IWarehouse | null>(
    null
  )

  const { data: warehouses, isLoading } = useGetWarehouses(
    statusFilter !== 'all' ? { isActive: statusFilter === 'active' } : undefined
  )

  const filteredWarehouses = warehouses?.filter((warehouse) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      warehouse.name.toLowerCase().includes(searchLower) ||
      warehouse.code?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={t('pages.warehouses.title')}
            description={t('pages.warehouses.description')}
          />
          <CreateWarehouseDialog />
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t('pages.warehouses.searchWarehouse')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('pages.warehouses.allStatuses')}
              </SelectItem>
              <SelectItem value="active">
                {t('pages.warehouses.active')}
              </SelectItem>
              <SelectItem value="inactive">
                {t('pages.warehouses.inactive')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !filteredWarehouses?.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <IconBuildingWarehouse className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="text-lg font-medium">
              {search
                ? t('pages.warehouses.notFound')
                : t('pages.warehouses.noWarehouses')}
            </h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {search
                ? t('pages.warehouses.tryChanging')
                : t('pages.warehouses.createFirst')}
            </p>
            {!search && <CreateWarehouseDialog />}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('pages.warehouses.columnName')}</TableHead>
                  <TableHead>{t('pages.warehouses.columnBranch')}</TableHead>
                  <TableHead className="text-right">
                    {t('pages.warehouses.columnItems')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('pages.warehouses.columnCost')}
                  </TableHead>
                  <TableHead>{t('pages.warehouses.columnStatus')}</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.map((warehouse) => (
                  <TableRow
                    key={warehouse.id}
                    className="cursor-pointer"
                    onClick={() => setEditingWarehouse(warehouse)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{warehouse.name}</p>
                        {warehouse.code && (
                          <p className="text-muted-foreground text-xs">
                            {warehouse.code}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {warehouse.branchName ||
                        `${t('pages.warehouses.branchNumber')}${warehouse.branchId}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <WarehouseItemsCell warehouseId={warehouse.id} />
                    </TableCell>
                    <TableCell className="text-right">
                      <WarehouseValueCell warehouseId={warehouse.id} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={warehouse.isActive ? 'default' : 'secondary'}
                      >
                        {warehouse.isActive
                          ? t('pages.warehouses.active')
                          : t('pages.warehouses.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to="/dashboard/inventory/stock"
                            search={{ warehouseId: warehouse.id }}
                          >
                            {t('pages.warehouses.stockLink')}
                          </Link>
                        </Button>
                        <DeleteWarehouseButton
                          warehouseId={warehouse.id}
                          warehouseName={warehouse.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {editingWarehouse && (
        <UpdateWarehouseDialog
          warehouse={editingWarehouse}
          open={!!editingWarehouse}
          onOpenChange={(open) => {
            if (!open) setEditingWarehouse(null)
          }}
        />
      )}
    </PageContainer>
  )
}
