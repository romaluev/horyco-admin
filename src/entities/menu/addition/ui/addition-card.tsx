/**
 * Addition Card Component
 * Card component for displaying addition information in grid view
 */

'use client'

import { CheckCircle2, ImageIcon, XCircle } from 'lucide-react'

import { Badge } from '@/shared/ui/base/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/base/card'

import type { IAddition } from '../model'

interface AdditionCardProps {
  addition: IAddition
  onClick?: () => void
}

export const AdditionCard = ({ addition, onClick }: AdditionCardProps) => {
  return (
    <Card
      className="hover:bg-accent cursor-pointer overflow-hidden transition-colors"
      onClick={onClick}
    >
      {/* Image Section */}
      {addition.image ? (
        <div className="relative aspect-video w-full">
          <img
            src={addition.image}
            alt={addition.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="bg-muted flex aspect-video w-full items-center justify-center">
          <ImageIcon className="text-muted-foreground/50 h-12 w-12" />
        </div>
      )}

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold">{addition.name}</h3>
          {addition.isActive ? (
            <CheckCircle2 className="text-success h-4 w-4" />
          ) : (
            <XCircle className="text-muted-foreground h-4 w-4" />
          )}
        </div>
        {addition.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {addition.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {addition.isRequired && (
            <Badge variant="secondary" className="text-xs">
              Обязательно
            </Badge>
          )}
          {addition.isMultiple && (
            <Badge variant="secondary" className="text-xs">
              Множественный
            </Badge>
          )}
          {addition.isCountable && (
            <Badge variant="secondary" className="text-xs">
              Количественный
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>
            Выбор: {addition.minSelection} - {addition.maxSelection}
          </span>
          <span>Позиций: {addition.itemsCount ?? 0}</span>
        </div>
      </CardContent>
    </Card>
  )
}
