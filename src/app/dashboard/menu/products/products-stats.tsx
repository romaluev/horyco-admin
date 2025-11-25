import type { IProduct } from '@/entities/product'

interface ProductsStatsProps {
  total: number
  products: IProduct[]
  page: number
  limit: number
}

export function ProductsStats({
  total,
  products,
  page,
  limit,
}: ProductsStatsProps) {
  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="rounded-lg border px-6 py-4">
        <p className="text-sm font-medium text-muted-foreground">
          Всего продуктов
        </p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="rounded-lg border px-6 py-4">
        <p className="text-sm font-medium text-muted-foreground">
          Доступных (на странице)
        </p>
        <p className="text-2xl font-bold">
          {products.filter((p) => p.isAvailable).length}
        </p>
      </div>
      <div className="rounded-lg border px-6 py-4">
        <p className="text-sm font-medium text-muted-foreground">
          Недоступных (на странице)
        </p>
        <p className="text-2xl font-bold">
          {products.filter((p) => !p.isAvailable).length}
        </p>
      </div>
      <div className="rounded-lg border px-6 py-4">
        <p className="text-sm font-medium text-muted-foreground">Страница</p>
        <p className="text-2xl font-bold">
          {page} / {totalPages}
        </p>
      </div>
    </div>
  )
}
