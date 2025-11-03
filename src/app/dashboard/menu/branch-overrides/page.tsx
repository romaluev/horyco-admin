/**
 * Branch Overrides Page
 * Manage branch-specific product settings
 */

'use client'

import { useMemo, useState } from 'react'

import { Building2 } from 'lucide-react'

import { Badge } from '@/shared/ui/base/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
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
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetAllBranches } from '@/entities/branch'
import { useGetProductBranchOverrides } from '@/entities/branch-override'
import { useGetProducts } from '@/entities/product'
import {
  CreateBranchOverrideDialog,
  EditBranchOverrideDialog,
  DeleteBranchOverrideButton,
} from '@/features/branch-override-form'


export default function BranchOverridesPage(): JSX.Element {
  const [selectedProduct, setSelectedProduct] = useState<string>('all')
  const [selectedBranch, setSelectedBranch] = useState<string>('all')

  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts()

  const products = productsData?.data || []

  // Fetch all branches
  const { data: branchesData } = useGetAllBranches()

  const branches = branchesData?.items || []

  // Only fetch overrides when a product is selected
  const { data: overrides = [], isLoading: isLoadingOverrides } =
    useGetProductBranchOverrides(
      selectedProduct !== 'all' ? Number(selectedProduct) : 0
    )

  // Filter overrides
  const filteredOverrides = useMemo(() => {
    return overrides.filter((override) => {
      const isBranchMatch =
        selectedBranch === 'all' || override.branchId === Number(selectedBranch)
      return isBranchMatch
    })
  }, [overrides, selectedBranch])

  // Statistics
  const stats = useMemo(() => {
    return {
      total: overrides.length,
      branches: new Set(overrides.map((o) => o.branchId)).size,
      customPrices: overrides.filter((o) => o.overridePrice !== null).length,
      customAvailability: overrides.filter(
        (o) => o.overrideAvailability !== null
      ).length,
    }
  }, [overrides])

  const productsWithPrices = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
  }))

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Переопределения филиалов
            </h2>
            <p className="text-muted-foreground">
              Настройте индивидуальные цены и доступность для каждого филиала
            </p>
          </div>
          <CreateBranchOverrideDialog
            products={productsWithPrices}
            branches={branches}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего филиалов
              </CardTitle>
              <Building2 className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.branches}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Индивид. цены
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customPrices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Индивид. доступность
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.customAvailability}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Список переопределений</CardTitle>
                <CardDescription>
                  Управление настройками продуктов для филиалов
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Все продукты" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все продукты</SelectItem>
                    {products.map((product) => (
                      <SelectItem
                        key={product.id}
                        value={product.id.toString()}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Все филиалы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все филиалы</SelectItem>
                    {branches.map((branch: { id: number; name: string }) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedProduct === 'all' ? (
              <div className="text-muted-foreground py-8 text-center">
                Выберите продукт для просмотра переопределений филиалов
              </div>
            ) : isLoadingProducts || isLoadingOverrides ? (
              <div className="text-muted-foreground py-8 text-center">
                Загрузка...
              </div>
            ) : filteredOverrides.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                {overrides.length === 0
                  ? 'Нет переопределений для этого продукта'
                  : 'Нет переопределений с выбранными фильтрами'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Продукт</TableHead>
                    <TableHead>Филиал</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Доступность</TableHead>
                    <TableHead className="w-[100px]">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOverrides.map((override) => {
                    const product = products.find(
                      (p) => p.id === override.productId
                    )
                    const basePrice = override.basePrice || product?.price || 0

                    return (
                      <TableRow
                        key={`${override.productId}-${override.branchId}`}
                      >
                        <TableCell className="font-medium">
                          {override.productName ||
                            `Продукт #${override.productId}`}
                        </TableCell>
                        <TableCell>{override.branchName}</TableCell>
                        <TableCell>
                          {override.overridePrice !== null ? (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {override.overridePrice} сум
                              </span>
                              {basePrice &&
                                override.overridePrice !== basePrice && (
                                  <span className="text-muted-foreground text-xs">
                                    (базовая: {basePrice} сум)
                                  </span>
                                )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Базовая{basePrice ? `: ${basePrice} сум` : ''}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {override.overrideAvailability !== null ? (
                            <Badge
                              variant={
                                override.overrideAvailability
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {override.overrideAvailability
                                ? 'Доступен'
                                : 'Недоступен'}
                            </Badge>
                          ) : (
                            <Badge variant="outline">По умолчанию</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <EditBranchOverrideDialog
                              override={override}
                              basePrice={basePrice}
                            />
                            {override.productId && (
                              <DeleteBranchOverrideButton
                                productId={override.productId}
                                branchId={override.branchId}
                                productName={override.productName}
                                branchName={override.branchName}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
