'use client'

import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

interface ITopProduct {
  productId: number
  name: string
  orders: number
  revenue: number
  sharePct: number
}

interface ITopProductsProps {
  products: ITopProduct[]
}

const formatCurrency = (amount: number): string => {
  const formattedNumber = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${formattedNumber} UZS`
}

export const TopProducts = ({ products }: ITopProductsProps) => {
  const { t } = useTranslation('dashboard')

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('widgets.topProducts.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {t('widgets.topProducts.noData')}
              </p>
              <p className="text-muted-foreground text-xs">
                {t('widgets.topProducts.period')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxShare = Math.max(...products.map((p) => p.sharePct), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('widgets.topProducts.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                {t('widgets.topProducts.table.index')}
              </TableHead>
              <TableHead>{t('widgets.topProducts.table.product')}</TableHead>
              <TableHead className="text-right">
                {t('widgets.topProducts.table.orders')}
              </TableHead>
              <TableHead className="text-right">
                {t('widgets.topProducts.table.revenue')}
              </TableHead>
              <TableHead className="w-32">
                {t('widgets.topProducts.table.share')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.productId} className="hover:bg-muted/50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.orders}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.revenue)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{
                          width: `${(product.sharePct / maxShare) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground w-12 text-right text-xs">
                      {product.sharePct.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
