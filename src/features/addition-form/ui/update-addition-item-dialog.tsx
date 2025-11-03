/**
 * Update Addition Item Dialog
 * Dialog for updating an existing item within an addition group
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

import { useUpdateAdditionItem } from '@/entities/addition';

import {
  additionItemSchema,
  type AdditionItemFormValues
} from '../model/contract';

import type { IAdditionItem } from '@/entities/addition';
import type { JSX } from 'react';

interface UpdateAdditionItemDialogProps {
  item: IAdditionItem;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateAdditionItemDialog = ({
  item,
  isOpen,
  onClose
}: UpdateAdditionItemDialogProps) => {
  const { mutate: updateItem, isPending } = useUpdateAdditionItem();

  const form = useForm<AdditionItemFormValues>({
    resolver: zodResolver(additionItemSchema),
    defaultValues: {
      name: item.name,
      price: item.price,
      additionId: item.additionId,
      sortOrder: item.sortOrder || 0
    }
  });

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        price: item.price,
        additionId: item.additionId,
        sortOrder: item.sortOrder || 0
      });
    }
  }, [item, form]);

  const handleSubmit = (values: AdditionItemFormValues): void => {
    updateItem(
      { id: item.id, data: values },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать позицию</DialogTitle>
          <DialogDescription>
            Измените параметры позиции дополнения
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
                    <Input placeholder="Большая порция" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена (₽)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Дополнительная стоимость к базовой цене продукта
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    Порядок отображения позиции в списке
                  </FormDescription>
                  <FormMessage />
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
