/**
 * Create Addition Item Dialog
 * Dialog for creating a new item within an addition group
 */

'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/base/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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

import { useCreateAdditionItem } from '@/entities/addition';

import {
  additionItemSchema,
  type AdditionItemFormValues
} from '../model/contract';

import type { JSX } from 'react';

interface CreateAdditionItemDialogProps {
  additionId: number;
  trigger?: React.ReactNode;
}

export const CreateAdditionItemDialog = ({
  additionId,
  trigger
}: CreateAdditionItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: createItem, isPending } = useCreateAdditionItem();

  const form = useForm<AdditionItemFormValues>({
    resolver: zodResolver(additionItemSchema),
    defaultValues: {
      name: '',
      price: 0,
      additionId,
      sortOrder: 0
    }
  });

  const handleSubmit = (values: AdditionItemFormValues): void => {
    createItem(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button size="sm">Добавить позицию</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить позицию</DialogTitle>
          <DialogDescription>
            Создайте новую позицию в группе дополнений
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
                onClick={() => setOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Создание...' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
