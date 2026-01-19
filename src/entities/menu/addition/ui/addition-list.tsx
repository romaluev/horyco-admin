/**
 * Addition List Component
 * Grid view of additions
 */

'use client'

import { BaseLoading } from '@/shared/ui'

import { AdditionCard } from './addition-card'

import type { IAddition } from '../model'

interface AdditionListProps {
  additions: IAddition[]
  isLoading?: boolean
  onAdditionClick?: (addition: IAddition) => void
}

export const AdditionList = ({
  additions,
  isLoading,
  onAdditionClick,
}: AdditionListProps) => {
  if (isLoading) {
    return <BaseLoading />
  }

  if (additions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground text-lg font-medium">
            Дополнения не найдены
          </p>
          <p className="text-muted-foreground text-sm">
            Выберите продукт и создайте первую группу дополнений
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {additions.map((addition) => (
        <AdditionCard
          key={addition.id}
          addition={addition}
          onClick={() => onAdditionClick?.(addition)}
        />
      ))}
    </div>
  )
}
