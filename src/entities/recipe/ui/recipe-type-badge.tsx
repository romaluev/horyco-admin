'use client'

import { Package, Layers, Box } from 'lucide-react'

import { Badge } from '@/shared/ui/base/badge'

interface IRecipeTypeBadgeProps {
  productId: number | null
  modifierId: number | null
  itemId: number | null
}

export function RecipeTypeBadge({ productId, modifierId, itemId }: IRecipeTypeBadgeProps) {
  if (productId) {
    return (
      <Badge variant="default" className="gap-1">
        <Package className="h-3 w-3" />
        Продукт
      </Badge>
    )
  }

  if (modifierId) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Layers className="h-3 w-3" />
        Модификатор
      </Badge>
    )
  }

  if (itemId) {
    return (
      <Badge variant="outline" className="gap-1">
        <Box className="h-3 w-3" />
        Полуфабрикат
      </Badge>
    )
  }

  return null
}
