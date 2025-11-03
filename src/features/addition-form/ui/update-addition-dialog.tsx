/**
 * Update Addition Dialog
 * Dialog for updating an existing addition group
 */

'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/base/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/base/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import { Switch } from '@/shared/ui/base/switch';
import { Textarea } from '@/shared/ui/base/textarea';

import { useUpdateAddition } from '@/entities/addition';

import { additionSchema, type AdditionFormValues } from '../model/contract';

import type { IAddition } from '@/entities/addition';
import type { JSX } from 'react';

interface UpdateAdditionDialogProps {
  addition: IAddition;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateAdditionDialog = ({
  addition,
  isOpen,
  onClose
}: UpdateAdditionDialogProps) => {
  const { mutate: updateAddition, isPending } = useUpdateAddition();

  const form = useForm<AdditionFormValues>({
    resolver: zodResolver(additionSchema),
    defaultValues: {
      name: addition.name,
      description: addition.description || '',
      productId: addition.productId,
      isRequired: addition.isRequired,
      isMultiple: addition.isMultiple,
      isCountable: addition.isCountable,
      minSelection: addition.minSelection,
      maxSelection: addition.maxSelection,
      sortOrder: addition.sortOrder || 0,
      isActive: addition.isActive ?? true
    }
  });

  // Reset form when addition changes
  useEffect(() => {
    if (addition) {
      form.reset({
        name: addition.name,
        description: addition.description || '',
        productId: addition.productId,
        isRequired: addition.isRequired,
        isMultiple: addition.isMultiple,
        isCountable: addition.isCountable,
        minSelection: addition.minSelection,
        maxSelection: addition.maxSelection,
        sortOrder: addition.sortOrder || 0,
        isActive: addition.isActive ?? true
      });
    }
  }, [addition, form]);

  const handleSubmit = (values: AdditionFormValues): void => {
    updateAddition(
      { id: addition.id, data: values },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать дополнение</DialogTitle>
          <DialogDescription>
            Измените параметры группы дополнений
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Размер порции" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Выберите размер порции"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мин. выбор</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Макс. выбор</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Порядок сортировки</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Порядок отображения дополнения
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Обязательно</FormLabel>
                    <FormDescription>
                      Клиент должен выбрать хотя бы один вариант
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isMultiple"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Множественный выбор</FormLabel>
                    <FormDescription>
                      Клиент может выбрать несколько вариантов
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isCountable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Количественный</FormLabel>
                    <FormDescription>
                      Клиент может указать количество
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Активно</FormLabel>
                    <FormDescription>
                      Дополнение доступно для заказа
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Обновление...' : 'Обновить'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
