'use client'

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
  const formattedNumber = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${formattedNumber} UZS`
}

export const TopProducts = ({ products }: ITopProductsProps) => {
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Топ продукты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Нет данных</p>
              <p className="text-xs text-muted-foreground">за этот период</p>
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
        <CardTitle>Топ продукты</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Продукт</TableHead>
              <TableHead className="text-right">Заказы</TableHead>
              <TableHead className="text-right">Выручка</TableHead>
              <TableHead className="w-32">Доля</TableHead>
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
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(product.sharePct / maxShare) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
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
