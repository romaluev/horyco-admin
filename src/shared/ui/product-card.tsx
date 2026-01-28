'use client'

import { Plus, Check } from 'lucide-react'

import { Badge } from './base/badge'
import { Button } from './base/button'
import { Card, CardContent } from './base/card'
import { ImageCell } from './image-cell'
import { cn } from '../lib/utils'

export interface ProductCardData {
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  imageUrls?: {
    thumb?: string
    medium?: string
    large?: string
    original?: string
  }
}

interface ProductCardProps {
  product: ProductCardData
  isSelected?: boolean
  onAdd?: () => void
  _onClick?: () => void
}

export function ProductCard({
  product,
  isSelected,
  onAdd,
  _onClick,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `${new Intl.NumberFormat('ru-RU').format(price)} сум`
  }

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden p-0 transition-all hover:shadow-lg',
        isSelected && 'ring-primary ring-2'
      )}
      onClick={_onClick}
    >
      {isSelected && (
        <Badge className="bg-primary absolute top-2 right-2 z-10">
          <Check className="h-3 w-3" />
        </Badge>
      )}

      <div className="bg-muted relative h-40 w-full overflow-hidden">
        <ImageCell
          imageUrls={product.imageUrls}
          fileId={product.image}
          alt={product.name}
          className="h-40 w-full object-cover transition-transform group-hover:scale-105"
          preferredVariant="medium"
        />
      </div>

      <CardContent className="p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold">{product.name}</h3>
          <span className="text-primary shrink-0 text-xs font-bold">
            {formatPrice(product.price)}
          </span>
        </div>

        <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">
          {product.description}
        </p>

        <Button
          size="sm"
          variant={isSelected ? 'secondary' : 'default'}
          className="h-8 w-full text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onAdd?.()
          }}
        >
          {isSelected ? (
            <>
              <Check className="mr-1 h-3 w-3" />
              Добавлено
            </>
          ) : (
            <>
              <Plus className="mr-1 h-3 w-3" />
              Добавить
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
