'use client'

import { IconSend, IconX } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

import { useSendToSupplier, useCancelPurchaseOrder } from '@/entities/purchase-order'

interface IPOActionButtonProps {
  poId: number
  onSuccess?: () => void
}

export const SendToSupplierButton = ({ poId, onSuccess }: IPOActionButtonProps) => {
  const { mutate: sendToSupplier, isPending } = useSendToSupplier()

  const handleSend = () => {
    sendToSupplier(poId, { onSuccess })
  }

  return (
    <Button onClick={handleSend} disabled={isPending}>
      <IconSend className="mr-2 h-4 w-4" />
      {isPending ? 'Отправка...' : 'Отправить поставщику'}
    </Button>
  )
}

export const CancelPOButton = ({ poId, onSuccess }: IPOActionButtonProps) => {
  const { mutate: cancelPO, isPending } = useCancelPurchaseOrder()

  const handleCancel = () => {
    cancelPO(poId, { onSuccess })
  }

  return (
    <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
      <IconX className="mr-2 h-4 w-4" />
      {isPending ? 'Отмена...' : 'Отменить заказ'}
    </Button>
  )
}
