'use client';

import React from 'react';
import { IHall, IHallRequest } from '../model/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateHall, useUpdateHall } from '../model/mutations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import { Button } from '@/shared/ui/base/button';

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  floor: z.number().int().min(1, 'Этаж должен быть положительным числом')
});

type FormValues = z.infer<typeof formSchema>;

interface HallFormProps {
  initialData?: IHall | null;
  onSuccess?: () => void;
}

export const HallForm = ({ initialData, onSuccess }: HallFormProps) => {
  const { mutate: createHall, isPending: isCreating } = useCreateHall();
  const { mutate: updateHall, isPending: isUpdating } = useUpdateHall(
    initialData?.id?.toString() || ''
  );

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      floor: initialData?.floor || 1
    }
  });

  const onSubmit = (values: FormValues) => {
    const hallData: IHallRequest = {
      name: values.name,
      floor: values.floor
    };

    if (initialData) {
      updateHall(hallData);
    } else {
      createHall(hallData);
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder='Введите название зала' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='floor'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Этаж</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Введите номер этажа'
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? 'Сохранение...'
            : initialData
              ? 'Обновить'
              : 'Создать'}
        </Button>
      </form>
    </Form>
  );
};
