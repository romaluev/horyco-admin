'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconX } from '@tabler/icons-react'
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

import { useRejectWriteoff } from '@/entities/writeoff'

import { rejectWriteoffSchema } from '../model/schema'

import type { RejectWriteoffFormValues } from '../model/schema'

interface IRejectWriteoffDialogProps {
  writeoffId: number
  onSuccess?: () => void
}

export const RejectWriteoffDialog = ({
  writeoffId,
  onSuccess,
}: IRejectWriteoffDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: rejectWriteoff, isPending } = useRejectWriteoff()

  const form = useForm<RejectWriteoffFormValues>({
    resolver: zodResolver(rejectWriteoffSchema),
    defaultValues: {
      reason: '',
    },
  })

  const onSubmit = (data: RejectWriteoffFormValues) => {
    rejectWriteoff(
      { id: writeoffId, data },
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
          <DialogTitle>Отклонить списание</DialogTitle>
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
                      placeholder="Укажите причину отклонения..."
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
              {isPending ? 'Отклонение...' : 'Отклонить списание'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
