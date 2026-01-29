'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useRouter } from '@/shared/lib/navigation'
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
import { Input } from '@/shared/ui/base/input'

import { useDuplicateRecipe } from '@/entities/inventory/recipe/model/mutations'

import type { IRecipe } from '@/entities/inventory/recipe/model/types'

const duplicateSchema = z.object({
  name: z.string().min(1, 'Введите название'),
})

type DuplicateFormValues = z.infer<typeof duplicateSchema>

interface DuplicateRecipeDialogProps {
  recipe: IRecipe
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DuplicateRecipeDialog({
  recipe,
  open,
  onOpenChange,
  onSuccess,
}: DuplicateRecipeDialogProps) {
  const router = useRouter()
  const duplicateMutation = useDuplicateRecipe()

  const form = useForm<DuplicateFormValues>({
    resolver: zodResolver(duplicateSchema),
    defaultValues: {
      name: `${recipe.name} (копия)`,
    },
  })

  const handleSubmit = (values: DuplicateFormValues) => {
    duplicateMutation.mutate(
      {
        id: recipe.id,
        data: { name: values.name },
      },
      {
        onSuccess: (newRecipe) => {
          onOpenChange(false)
          form.reset()
          onSuccess?.()
          // Navigate to the new recipe
          if (newRecipe?.id) {
            router.push(`/dashboard/inventory/recipes/${newRecipe.id}`)
          }
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Дублировать техкарту</DialogTitle>
          <DialogDescription>
            Создать копию техкарты со всеми ингредиентами
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название новой техкарты</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted space-y-1 rounded-md p-3 text-sm">
              <p className="text-muted-foreground">Будут скопированы:</p>
              <ul className="text-muted-foreground list-inside list-disc">
                <li>Все параметры техкарты</li>
                <li>Все ингредиенты ({recipe.ingredients?.length ?? 0})</li>
              </ul>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={duplicateMutation.isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={duplicateMutation.isPending}>
                {duplicateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Дублировать
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
