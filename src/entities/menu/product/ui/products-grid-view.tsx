/**
 * Products Grid View Component
 * Displays products as cards with large images
 */

'use client'

import { useMemo } from 'react'

import { ChevronLeft, ChevronRight, Pencil, Trash } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { ImageCell } from '@/shared/ui/image-cell'

import { useDeleteProduct } from '@/entities/menu/product/model'

import type { IProduct } from '@/entities/menu/product/model'

interface ProductsGridViewProps {
  data: IProduct[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onEdit?: (product: IProduct) => void
}

export const ProductsGridView = ({
  data,
  total,
  page,
  limit,
  onPageChange,
  onEdit,
}: ProductsGridViewProps) => {
  const { mutate: deleteProduct } = useDeleteProduct()
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit])

  const handleDelete = (productId: number): void => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Вы уверены что хотите удалить продукт?')
    ) {
      deleteProduct(productId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2 text-base">
                {product.name}
              </CardTitle>
              <CardDescription className="line-clamp-1">
                {product.categoryName || '—'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="overflow-hidden rounded-lg bg-muted">
                <ImageCell
                  imageUrls={product.imageUrls}
                  fileId={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                  preferredVariant="medium"
                />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">
                  {product.price} UZS
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.isAvailable ? 'Доступен' : 'Недоступен'}
                </p>
              </div>
            </CardContent>
            <div className="flex gap-2 border-t px-2 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(product)}
                className="flex-1"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(product.id)}
                className="flex-1 text-destructive hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-lg border px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {page} / {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
