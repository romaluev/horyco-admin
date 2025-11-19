/**
 * Addition Card Component
 * Card component for displaying addition information in grid view
 */

'use client'

import { CheckCircle2, XCircle } from 'lucide-react'

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
      className="cursor-pointer transition-colors hover:bg-accent"
      onClick={onClick}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold">{addition.name}</h3>
          {addition.isActive ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <XCircle className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        {addition.description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
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
          <span>
            Позиций: {addition.itemsCount ?? 0}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
