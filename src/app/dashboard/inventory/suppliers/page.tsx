'use client'

import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { IconSearch, IconTruck } from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

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

import { useGetSuppliers } from '@/entities/inventory/supplier'
import {
  CreateSupplierDialog,
  DeleteSupplierButton,
} from '@/features/inventory/supplier-form'

type StatusFilter = 'all' | 'active' | 'inactive'

export default function SuppliersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const { data: suppliers, isLoading } = useGetSuppliers({
    search: search || undefined,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
  })

  const hasFilters = Boolean(search || statusFilter !== 'all')

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Поставщики"
            description="Управление поставщиками и их каталогами товаров"
          />
          <CreateSupplierDialog />
        </div>
        <Separator />

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск поставщика..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="inactive">Неактивные</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !suppliers?.length ? (
          <EmptySuppliersState hasFilters={hasFilters} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Поставщик</TableHead>
                  <TableHead>Контакт</TableHead>
                  <TableHead className="text-right">Товаров</TableHead>
                  <TableHead className="text-right">Заказов</TableHead>
                  <TableHead>Последний заказ</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        {supplier.code && (
                          <p className="text-muted-foreground text-sm">
                            {supplier.code}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {supplier.phone || supplier.contactName || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {supplier.itemCount ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {supplier.totalOrders}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {supplier.lastOrderAt
                        ? format(new Date(supplier.lastOrderAt), 'd MMM yyyy', {
                            locale: ru,
                          })
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={
                              `/dashboard/inventory/suppliers/${supplier.id}` as any
                            }
                          >
                            Открыть
                          </Link>
                        </Button>
                        <DeleteSupplierButton
                          supplierId={supplier.id}
                          supplierName={supplier.name}
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
    </PageContainer>
  )
}

const EmptySuppliersState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
    <IconTruck className="text-muted-foreground/50 h-12 w-12" />
    <h3 className="mt-4 text-lg font-semibold">
      {hasFilters ? 'Поставщики не найдены' : 'Нет поставщиков'}
    </h3>
    <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">
      {hasFilters
        ? 'Попробуйте изменить параметры поиска или фильтры.'
        : 'Добавьте поставщиков для управления закупками и ценами на товары.'}
    </p>
    {!hasFilters && (
      <div className="mt-6">
        <CreateSupplierDialog />
      </div>
    )}
  </div>
)
