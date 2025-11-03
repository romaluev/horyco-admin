/**
 * Template Preview Card
 * Card component for displaying menu template preview
 */

'use client'

import { Star, Package, FolderTree } from 'lucide-react'

import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import type { IMenuTemplate } from '@/entities/menu-template'

interface TemplatePreviewCardProps {
  template: IMenuTemplate
  onSelect: (template: IMenuTemplate) => void
}

export const TemplatePreviewCard = ({
  template,
  onSelect,
}: TemplatePreviewCardProps) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      {template.thumbnail && (
        <div className="bg-muted relative aspect-video overflow-hidden">
          <img
            src={template.thumbnail}
            alt={template.name}
            className="h-full w-full object-cover"
          />
          {template.isPremium && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              Premium
            </Badge>
          )}
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {template.name}
              {template.isPopular && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {template.businessType}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {template.description && (
          <p className="text-muted-foreground mb-4 text-sm">
            {template.description}
          </p>
        )}
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <FolderTree className="h-4 w-4" />
            <span>{template.categoryCount} категорий</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>{template.productCount} продуктов</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelect(template)} className="w-full">
          Просмотреть и применить
        </Button>
      </CardFooter>
    </Card>
  )
}
