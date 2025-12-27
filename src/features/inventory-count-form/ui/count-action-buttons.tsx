'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconCheck, IconPlayerPlay, IconSend, IconX } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/base/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Textarea } from '@/shared/ui/base/textarea'

import {
  useStartCount,
  useCompleteCount,
  useSubmitCount,
  useApproveCount,
  useRejectCount,
  useCancelCount,
} from '@/entities/inventory-count'

import { rejectCountSchema } from '../model/schema'

import type { RejectCountFormValues } from '../model/schema'

interface ICountActionButtonProps {
  countId: number
  onSuccess?: () => void
}

export const StartCountButton = ({ countId, onSuccess }: ICountActionButtonProps) => {
  const { mutate: startCount, isPending } = useStartCount()

  const handleStart = () => {
    startCount(countId, { onSuccess })
  }

  return (
    <Button onClick={handleStart} disabled={isPending}>
      <IconPlayerPlay className="mr-2 h-4 w-4" />
      {isPending ? 'Запуск...' : 'Начать подсчёт'}
    </Button>
  )
}

export const CompleteCountButton = ({ countId, onSuccess }: ICountActionButtonProps) => {
  const { mutate: completeCount, isPending } = useCompleteCount()

  const handleComplete = () => {
    completeCount(countId, { onSuccess })
  }

  return (
    <Button onClick={handleComplete} disabled={isPending}>
      <IconCheck className="mr-2 h-4 w-4" />
      {isPending ? 'Завершение...' : 'Завершить подсчёт'}
    </Button>
  )
}

export const SubmitCountButton = ({ countId, onSuccess }: ICountActionButtonProps) => {
  const { mutate: submitCount, isPending } = useSubmitCount()

  const handleSubmit = () => {
    submitCount(countId, { onSuccess })
  }

  return (
    <Button onClick={handleSubmit} disabled={isPending}>
      <IconSend className="mr-2 h-4 w-4" />
      {isPending ? 'Отправка...' : 'На утверждение'}
    </Button>
  )
}

export const ApproveCountButton = ({ countId, onSuccess }: ICountActionButtonProps) => {
  const { mutate: approveCount, isPending } = useApproveCount()

  const handleApprove = () => {
    approveCount(countId, { onSuccess })
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

export const RejectCountDialog = ({ countId, onSuccess }: ICountActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: rejectCount, isPending } = useRejectCount()

  const form = useForm<RejectCountFormValues>({
    resolver: zodResolver(rejectCountSchema),
    defaultValues: { reason: '' },
  })

  const onSubmit = (data: RejectCountFormValues) => {
    rejectCount(
      { id: countId, data },
      {
        onSuccess: () => {
          setIsOpen(false)
          form.reset()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <IconX className="mr-2 h-4 w-4" />
          Отклонить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отклонить инвентаризацию</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Причина отклонения</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Укажите причину..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="destructive"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? 'Отклонение...' : 'Отклонить'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export const CancelCountButton = ({ countId, onSuccess }: ICountActionButtonProps) => {
  const { mutate: cancelCount, isPending } = useCancelCount()

  const handleCancel = () => {
    cancelCount(countId, { onSuccess })
  }

  return (
    <Button variant="outline" onClick={handleCancel} disabled={isPending}>
      {isPending ? 'Отмена...' : 'Отменить'}
    </Button>
  )
}
