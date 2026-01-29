'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import { useRejectWriteoff } from '@/entities/inventory/writeoff/model/mutations'

const rejectSchema = z.object({
  reason: z.string().min(1, 'Укажите причину отклонения'),
})

type RejectFormValues = z.infer<typeof rejectSchema>

interface RejectWriteoffDialogProps {
  writeoffId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RejectWriteoffDialog({
  writeoffId,
  open,
  onOpenChange,
  onSuccess,
}: RejectWriteoffDialogProps) {
  const rejectMutation = useRejectWriteoff()

  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      reason: '',
    },
  })

  const handleSubmit = (values: RejectFormValues) => {
    rejectMutation.mutate(
      {
        id: writeoffId,
        data: { reason: values.reason },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отклонить списание?</DialogTitle>
          <DialogDescription>
            Списание будет возвращено на доработку. Укажите причину отклонения.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Причина отклонения</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите, что нужно исправить..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={rejectMutation.isPending}
              >
                Назад
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Отклонить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
