/**
 * Suppliers Page
 * Page for managing suppliers
 */

'use client'

import { useState } from 'react'

import { IconSearch, IconPhone, IconMail, IconMapPin } from '@tabler/icons-react'

import PageContainer from '@/shared/ui/layout/page-container'
import { Input } from '@/shared/ui/base/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useBranchStore } from '@/entities/branch'
import { useGetSuppliers, SupplierCard } from '@/entities/supplier'
import {
  CreateSupplierDialog,
  UpdateSupplierDialog,
  DeleteSupplierButton,
} from '@/features/supplier-form'

export default function SuppliersPage() {
  const { selectedBranchId } = useBranchStore()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useGetSuppliers(
    { search: search || undefined },
    { enabled: !!selectedBranchId }
  )

  const suppliers = data || []

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
            <h1 className="text-2xl font-bold tracking-tight">Поставщики</h1>
            <p className="text-muted-foreground">
              Управление поставщиками и их товарами
            </p>
          </div>
          <CreateSupplierDialog branchId={selectedBranchId} />
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Suppliers Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-md border">
            <p className="text-muted-foreground">
              {search ? 'Поставщики не найдены' : 'Нет поставщиков'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    {supplier.contactName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {supplier.contactName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <UpdateSupplierDialog supplier={supplier} />
                    <DeleteSupplierButton
                      supplierId={supplier.id}
                      supplierName={supplier.name}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconPhone className="h-4 w-4" />
                      {supplier.phone}
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconMail className="h-4 w-4" />
                      {supplier.email}
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconMapPin className="h-4 w-4" />
                      {supplier.address}
                    </div>
                  )}
                  {supplier.itemCount !== undefined && supplier.itemCount > 0 && (
                    <div className="pt-2">
                      <Badge variant="secondary">
                        {supplier.itemCount} товаров
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
