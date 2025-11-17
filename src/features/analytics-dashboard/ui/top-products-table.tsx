/**
 * Top Products Table Component
 * Displays top 10 products by revenue with share percentage bars
 */

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
import { formatCurrency } from '../lib/utils'

import type { IAnalyticsTopProduct } from '@/entities/analytics'

interface ITopProductsTableProps {
  products: IAnalyticsTopProduct[]
}

export const TopProductsTable = ({ products }: ITopProductsTableProps) => {
  // Find max share for bar width calculation
  const maxShare = Math.max(...products.map((p) => p.sharePct), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products (This Period)</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="w-32">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.productId} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.orders}
                  </TableCell>
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
        ) : (
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-sm text-muted-foreground">No products sold</p>
              <p className="text-xs text-muted-foreground">in this period</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
