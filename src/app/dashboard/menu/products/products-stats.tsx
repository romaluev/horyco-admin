import { useTranslation } from 'react-i18next'

import type { IProduct } from '@/entities/menu/product'

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
  const { t } = useTranslation('menu')
  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="rounded-lg border px-6 py-4">
        <p className="text-muted-foreground text-sm font-medium">
          {t('pages.products.stats.total')}
        </p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="rounded-lg border px-6 py-4">
        <p className="text-muted-foreground text-sm font-medium">
          {t('pages.products.stats.available')}
        </p>
        <p className="text-2xl font-bold">
          {products.filter((p) => p.isAvailable).length}
        </p>
      </div>
      <div className="rounded-lg border px-6 py-4">
        <p className="text-muted-foreground text-sm font-medium">
          {t('pages.products.stats.unavailable')}
        </p>
        <p className="text-2xl font-bold">
          {products.filter((p) => !p.isAvailable).length}
        </p>
      </div>
      <div className="rounded-lg border px-6 py-4">
        <p className="text-muted-foreground text-sm font-medium">
          {t('pages.products.stats.page')}
        </p>
        <p className="text-2xl font-bold">
          {page} / {totalPages}
        </p>
      </div>
    </div>
  )
}
