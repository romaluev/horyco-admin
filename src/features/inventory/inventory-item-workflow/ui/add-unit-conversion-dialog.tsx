'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { useAddUnitConversion } from '@/entities/inventory/inventory-item/model/mutations'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Button } from '@/shared/ui/base/button'
import { Input } from '@/shared/ui/base/input'
import { Textarea } from '@/shared/ui/base/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/shared/ui/base/form'

const addConversionSchema = z.object({
  fromUnit: z.string().min(1, 'Укажите исходную единицу'),
  toUnit: z.string().min(1, 'Укажите целевую единицу'),
  conversionFactor: z.number().min(0.0001, 'Коэффициент должен быть больше 0'),
  notes: z.string().optional(),
})

type AddConversionFormValues = z.infer<typeof addConversionSchema>

interface AddUnitConversionDialogProps {
  itemId: number
  baseUnit: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddUnitConversionDialog({
  itemId,
  baseUnit,
  open,
  onOpenChange,
  onSuccess,
}: AddUnitConversionDialogProps) {
  const addMutation = useAddUnitConversion()

  const form = useForm<AddConversionFormValues>({
    resolver: zodResolver(addConversionSchema),
    defaultValues: {
      fromUnit: baseUnit,
      toUnit: '',
      conversionFactor: 1,
      notes: '',
    },
  })

  const fromUnit = form.watch('fromUnit')
  const toUnit = form.watch('toUnit')
  const factor = form.watch('conversionFactor')

  const handleSubmit = (values: AddConversionFormValues) => {
    addMutation.mutate(
      {
        id: itemId,
        data: {
          fromUnit: values.fromUnit,
          toUnit: values.toUnit,
          conversionFactor: values.conversionFactor,
          notes: values.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset({ fromUnit: baseUnit, toUnit: '', conversionFactor: 1, notes: '' })
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить конверсию единиц</DialogTitle>
          <DialogDescription>
            Настройте преобразование между единицами измерения для этого товара
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Из единицы</FormLabel>
                    <FormControl>
                      <Input placeholder="кг" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>В единицу</FormLabel>
                    <FormControl>
                      <Input placeholder="г" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="conversionFactor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Коэффициент конверсии</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0.0001}
                      step="0.0001"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Сколько {toUnit || 'целевых единиц'} в 1 {fromUnit || 'исходной единице'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fromUnit && toUnit && factor > 0 && (
              <div className="bg-muted rounded-md p-3 text-sm">
                <p className="font-medium">Результат:</p>
                <p className="text-muted-foreground mt-1">
                  1 {fromUnit} = {factor} {toUnit}
                </p>
                <p className="text-muted-foreground">
                  1 {toUnit} = {(1 / factor).toFixed(4)} {fromUnit}
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечания</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация о конверсии..."
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
                disabled={addMutation.isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Добавить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
