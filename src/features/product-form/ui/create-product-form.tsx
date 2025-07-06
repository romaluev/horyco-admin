'use client';

import { useAttachProductImages, useCreateProduct } from '@/entities/product';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ProductFormType } from './product-form-type';
import { ProductFormAdditions } from './product-form-additions';
import { ProductFormImages } from './product-form-images';
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea
} from '@/shared/ui';
import { ProductFormValues, productSchema } from '../model/contract';
import { useState } from 'react';

export const CreateProductForm = () => {
  const { mutateAsync: createProductMutation } = useCreateProduct();
  const { mutateAsync: attachImages } = useAttachProductImages();
  const router = useRouter();
  const [sending, setSending] = useState(false);

  const defaultValues = {
    name: '',
    productTypeId: 0,
    status: '',
    description: '',
    additions: [],
    image: []
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    values: defaultValues
  });

  const onSubmit = async (values: ProductFormValues) => {
    const body = { ...values, price: values.price || 0 };
    delete body.image;
    setSending(true);

    try {
      const res = await createProductMutation(body);

      if (values.image?.length && res) {
        await attachImages({ id: res.id, files: values.image });
      }
      setSending(false);
      toast.success('Продукт успешно создан');
    } catch (e) {
      toast.error('Что-то пошло не так');
    }

    router.push('/dashboard/products');
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 items-start gap-x-2 gap-y-4 md:grid-cols-6'>
          <ProductFormImages />

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='md:col-span-3'>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder='Введите название продукта' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProductFormType />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='md:col-span-3'>
                <FormLabel>Цена</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Введите цену'
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
            name='stock'
            render={({ field }) => (
              <FormItem className='md:col-span-3'>
                <FormLabel>Количество</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Введите количество'
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
            name='description'
            render={({ field }) => (
              <FormItem className='md:col-span-6'>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Введите описание продукта'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProductFormAdditions />

          <Button type='submit' className='w-full md:w-auto' disabled={sending}>
            Создать продукт
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateProductForm;
