'use client'

import { useRouter } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Icons } from '@/shared/ui/icons'

import { VIEW_TYPE_CARDS } from '../model/constants'
import { useViewBuilderStore } from '../model/store'

import type { Dataset } from '@/shared/api/graphql'

interface IViewTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ViewTypeModal({ isOpen, onClose }: IViewTypeModalProps) {
  const router = useRouter()
  const { setDataset, resetConfig } = useViewBuilderStore()

  const handleSelectType = (dataset: Dataset) => {
    resetConfig()
    setDataset(dataset)
    onClose()
    router.push(`/dashboard/views/new?type=${dataset.toLowerCase()}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создать представление</DialogTitle>
          <DialogDescription>
            Выберите тип данных для нового представления
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3">
          {VIEW_TYPE_CARDS.map((card) => {
            const IconComponent =
              Icons[card.icon as keyof typeof Icons] || Icons.table

            return (
              <button
                key={card.key}
                type="button"
                onClick={() => handleSelectType(card.key)}
                className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                  <IconComponent className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{card.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
