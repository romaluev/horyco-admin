'use client'

import { useState } from 'react'
import Link from 'next/link'

import { IconSearch } from '@tabler/icons-react'

import { formatCurrency } from '@/shared/lib/format'
import { Heading } from '@/shared/ui/base/heading'
import { Input } from '@/shared/ui/base/input'
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
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetSuppliers } from '@/entities/supplier'
import {
  CreateSupplierDialog,
  DeleteSupplierButton,
} from '@/features/supplier-form'

export default function SuppliersPage() {
  const [search, setSearch] = useState('')

  const { data: suppliers, isLoading } = useGetSuppliers({
    search: search || undefined,
  })

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

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск поставщика..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
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
                  <TableHead>Поставщик</TableHead>
                  <TableHead>Контакт</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead className="text-center">Срок доставки</TableHead>
                  <TableHead className="text-right">Заказов</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!suppliers?.length ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Поставщики не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          {supplier.code && (
                            <p className="text-sm text-muted-foreground">{supplier.code}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {supplier.contactName || '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {supplier.phone || '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        {supplier.leadTimeDays} дн.
                      </TableCell>
                      <TableCell className="text-right">
                        {supplier.totalOrders}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(supplier.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
                          {supplier.isActive ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/inventory/suppliers/${supplier.id}`}>
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
