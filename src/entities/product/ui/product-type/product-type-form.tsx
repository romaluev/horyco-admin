'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/shared/ui/base/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import { Textarea } from '@/shared/ui/base/textarea';

import {
  useCreateProductType,
  useUpdateProductType
} from '../../model/mutations-product-type';

import type { IProductType, IProductTypeRequest } from '../../model/types';

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно')
});

type FormValues = z.infer<typeof formSchema>;

interface ProductTypeFormProps {
  initialData?: IProductType | null;
  onSuccess?: () => void;
}

export const ProductTypeForm = ({
  initialData,
  onSuccess
}: ProductTypeFormProps) => {
  const { mutate: createProductType, isPending: isCreating } =
    useCreateProductType();
  const { mutate: updateProductType, isPending: isUpdating } =
    useUpdateProductType(initialData?.id?.toString() || '');

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || ''
    }
  });

  const onSubmit = (values: FormValues) => {
    const productTypeData: IProductTypeRequest = {
      name: values.name,
      description: values.description
    };

    if (initialData) {
      updateProductType(productTypeData);
    } else {
      createProductType(productTypeData);
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
                <Input placeholder='Введите название категории' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea placeholder='Введите описание категории' {...field} />
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
