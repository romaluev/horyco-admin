'use client'

import { IconCheck, IconPlayerPlay, IconX } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

import {
  useStartProduction,
  useCompleteProduction,
  useCancelProduction,
} from '@/entities/production-order'

interface IProductionActionButtonProps {
  productionId: number
  onSuccess?: () => void
}

export const StartProductionButton = ({
  productionId,
  onSuccess,
}: IProductionActionButtonProps) => {
  const { mutate: startProduction, isPending } = useStartProduction()

  const handleStart = () => {
    startProduction(productionId, { onSuccess })
  }

  return (
    <Button onClick={handleStart} disabled={isPending}>
      <IconPlayerPlay className="mr-2 h-4 w-4" />
      {isPending ? 'Запуск...' : 'Начать производство'}
    </Button>
  )
}

export const CompleteProductionButton = ({
  productionId,
  onSuccess,
}: IProductionActionButtonProps) => {
  const { mutate: completeProduction, isPending } = useCompleteProduction()

  const handleComplete = () => {
    completeProduction({ id: productionId }, { onSuccess })
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700"
    >
      <IconCheck className="mr-2 h-4 w-4" />
      {isPending ? 'Завершение...' : 'Завершить производство'}
    </Button>
  )
}

export const CancelProductionButton = ({
  productionId,
  onSuccess,
}: IProductionActionButtonProps) => {
  const { mutate: cancelProduction, isPending } = useCancelProduction()

  const handleCancel = () => {
    cancelProduction(productionId, { onSuccess })
  }

  return (
    <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
      <IconX className="mr-2 h-4 w-4" />
      {isPending ? 'Отмена...' : 'Отменить'}
    </Button>
  )
}
