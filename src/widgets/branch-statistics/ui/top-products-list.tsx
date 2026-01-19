import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { ITopProduct } from '@/entities/organization/branch'

interface TopProductsListProps {
  products: ITopProduct[]
}

export const TopProductsList = ({ products }: TopProductsListProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Популярные блюда</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product, index) => (
            <div key={product.productId} className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium">{product.productName}</p>
                <p className="text-muted-foreground text-sm">
                  {product.quantitySold} заказов
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(product.revenue)}</p>
                <p className="text-muted-foreground text-sm">UZS</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
