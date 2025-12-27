'use client'

import { IconSend } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

import { useSubmitWriteoff } from '@/entities/writeoff'

interface ISubmitWriteoffButtonProps {
  writeoffId: number
  onSuccess?: () => void
}

export const SubmitWriteoffButton = ({
  writeoffId,
  onSuccess,
}: ISubmitWriteoffButtonProps) => {
  const { mutate: submitWriteoff, isPending } = useSubmitWriteoff()

  const handleSubmit = () => {
    submitWriteoff(writeoffId, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  return (
    <Button onClick={handleSubmit} disabled={isPending}>
      <IconSend className="mr-2 h-4 w-4" />
      {isPending ? 'Отправка...' : 'На утверждение'}
    </Button>
  )
}
