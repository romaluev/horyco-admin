/**
 * Apply Template Dialog
 * Dialog for applying a menu template with options
 */

'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import { Checkbox } from '@/shared/ui/base/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/shared/ui/base/form'
import { ScrollArea } from '@/shared/ui/base/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

import {
  useGetTemplateById,
  useApplyTemplate,
  type IMenuTemplate,
} from '@/entities/menu-template'

import {
  applyTemplateFormSchema,
  type ApplyTemplateFormValues,
} from '../model/contract'


interface ApplyTemplateDialogProps {
  template: IMenuTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ApplyTemplateDialog = ({
  template,
  open,
  onOpenChange,
}: ApplyTemplateDialogProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const { data: templateDetail, isLoading } = useGetTemplateById(
    template?.id || 0
  )
  const { mutate: applyTemplate, isPending } = useApplyTemplate()

  const form = useForm<ApplyTemplateFormValues>({
    resolver: zodResolver(applyTemplateFormSchema),
    defaultValues: {
      templateId: template?.id || 0,
      applyCategories: true,
      applyProducts: true,
      applyModifiers: true,
      applyAdditions: true,
      replaceExisting: false,
    },
  })

  useEffect(() => {
    if (template && open) {
      form.setValue('templateId', template.id)
      setShowConfirmation(false)
    }
  }, [template, open, form])

  const onSubmit = (data: ApplyTemplateFormValues): void => {
    if (!showConfirmation && data.replaceExisting) {
      setShowConfirmation(true)
      return
    }

    applyTemplate(
      { id: data.templateId, data },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
          setShowConfirmation(false)
        },
      }
    )
  }

  if (!template) return <></>

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>
            {template.businessType} • {template.categoryCount} категорий •{' '}
            {template.productCount} продуктов
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            Загрузка деталей...
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
                <TabsTrigger value="options">Параметры</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  {templateDetail && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 font-semibold">Категории</h3>
                        <div className="space-y-2">
                          {templateDetail.categories.map((category) => (
                            <div
                              key={category.id}
                              className="rounded-lg border p-3"
                            >
                              <p className="font-medium">{category.name}</p>
                              {category.description && (
                                <p className="text-muted-foreground text-sm">
                                  {category.description}
                                </p>
                              )}
                              <p className="text-muted-foreground mt-1 text-xs">
                                {category.products.length} продуктов
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 font-semibold">
                          Примеры продуктов
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {templateDetail.categories
                            .flatMap((c) => c.products)
                            .slice(0, 6)
                            .map((product) => (
                              <div
                                key={product.id}
                                className="rounded-lg border p-3"
                              >
                                <p className="text-sm font-medium">
                                  {product.name}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {product.price} сум
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="options">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="applyCategories"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Применить категории</FormLabel>
                              <FormDescription>
                                Импортировать структуру категорий
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="applyProducts"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Применить продукты</FormLabel>
                              <FormDescription>
                                Импортировать все продукты
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="applyModifiers"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Применить модификаторы</FormLabel>
                              <FormDescription>
                                Импортировать группы модификаторов
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="applyAdditions"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-y-0 space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Применить дополнения</FormLabel>
                              <FormDescription>
                                Импортировать группы дополнений
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="replaceExisting"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-y-0 space-x-3 border-t pt-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-destructive">
                                Заменить существующее меню
                              </FormLabel>
                              <FormDescription>
                                Удалить текущие данные перед импортом
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {showConfirmation && form.watch('replaceExisting') && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Все существующие категории, продукты, модификаторы и
                          дополнения будут удалены. Это действие нельзя
                          отменить!
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end gap-3 border-t pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                      >
                        Отмена
                      </Button>
                      <Button type="submit" disabled={isPending}>
                        {isPending ? (
                          'Применение...'
                        ) : showConfirmation ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Подтвердить применение
                          </>
                        ) : (
                          'Применить шаблон'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
