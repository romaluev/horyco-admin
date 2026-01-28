/**
 * Branch Overrides Page
 * Manage branch-specific product settings
 */

'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

import { useGetAllBranches } from '@/entities/organization/branch'
import { useGetProductBranchOverrides } from '@/entities/menu/branch-override'
import { useGetProducts } from '@/entities/menu/product'
import {
  CreateBranchOverrideDialog,
  EditBranchOverrideDialog,
  DeleteBranchOverrideButton,
} from '@/features/menu/branch-override-form'

import type { JSX } from 'react'

export default function BranchOverridesPage(): JSX.Element {
  const { t } = useTranslation('menu')
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
              {t('branchOverrides.page.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('branchOverrides.page.description')}
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
                {t('branchOverrides.page.stats.totalBranches')}
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
                {t('branchOverrides.page.stats.customPrices')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customPrices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('branchOverrides.page.stats.customAvailability')}
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
                <CardTitle>{t('branchOverrides.page.table.title')}</CardTitle>
                <CardDescription>
                  {t('branchOverrides.page.table.description')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t('branchOverrides.page.table.allProducts')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('branchOverrides.page.table.allProducts')}</SelectItem>
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
                    <SelectValue placeholder={t('branchOverrides.page.table.allBranches')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('branchOverrides.page.table.allBranches')}</SelectItem>
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
                {t('branchOverrides.page.table.noProductSelected')}
              </div>
            ) : isLoadingProducts || isLoadingOverrides ? (
              <div className="text-muted-foreground py-8 text-center">
                {t('branchOverrides.page.table.loading')}
              </div>
            ) : filteredOverrides.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                {overrides.length === 0
                  ? t('branchOverrides.page.table.noOverrides')
                  : t('branchOverrides.page.table.noOverridesFiltered')}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('branchOverrides.page.table.columns.product')}</TableHead>
                    <TableHead>{t('branchOverrides.page.table.columns.branch')}</TableHead>
                    <TableHead>{t('branchOverrides.page.table.columns.price')}</TableHead>
                    <TableHead>{t('branchOverrides.page.table.columns.availability')}</TableHead>
                    <TableHead className="w-[100px]">{t('branchOverrides.page.table.columns.actions')}</TableHead>
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
                                {override.overridePrice} {t('branchOverrides.page.price.override')}
                              </span>
                              {basePrice &&
                                override.overridePrice !== basePrice && (
                                  <span className="text-muted-foreground text-xs">
                                    ({t('branchOverrides.page.price.base')} {basePrice} {t('branchOverrides.page.price.override')})
                                  </span>
                                )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              {t('branchOverrides.page.badges.default')}{basePrice ? `: ${basePrice} ${t('branchOverrides.page.price.override')}` : ''}
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
                                ? t('branchOverrides.page.badges.available')
                                : t('branchOverrides.page.badges.unavailable')}
                            </Badge>
                          ) : (
                            <Badge variant="outline">{t('branchOverrides.page.badges.default')}</Badge>
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
