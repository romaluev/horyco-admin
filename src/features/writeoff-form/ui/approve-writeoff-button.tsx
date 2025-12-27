'use client'

import { IconCheck } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

import { useApproveWriteoff } from '@/entities/writeoff'

interface IApproveWriteoffButtonProps {
  writeoffId: number
  onSuccess?: () => void
}

export const ApproveWriteoffButton = ({
  writeoffId,
  onSuccess,
}: IApproveWriteoffButtonProps) => {
  const { mutate: approveWriteoff, isPending } = useApproveWriteoff()

  const handleApprove = () => {
    approveWriteoff(writeoffId, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  return (
    <Button
      onClick={handleApprove}
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700"
    >
      <IconCheck className="mr-2 h-4 w-4" />
      {isPending ? 'Утверждение...' : 'Утвердить'}
    </Button>
  )
}
