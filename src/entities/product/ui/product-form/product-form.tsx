'use client';

import { Button } from '@/shared/ui/base/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import { Textarea } from '@/shared/ui/base/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { ProductFormType } from './product-form-type';
import ProductFormImages from './product-form-images';
import { ProductFormAdditions } from './product-form-additions';
import {
  IProduct,
  productAPi,
  useAttachProductImages,
  useCreateProduct,
  useUpdateProduct
} from '@/entities/product/model';
import {
  ACCEPTED_IMAGE_TYPES,
  getStatuses,
  MAX_FILE_SIZE
} from '@/shared/config/data';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { productKeys } from '@/entities/product/model/query-keys';

const additionProductSchema = z.object({
  name: z.string().min(1, { message: 'Название элемента обязательно' }),
  price: z.number().min(0, { message: 'Цена должна быть положительным числом' })
});

const additionSchema = z.object({
  name: z.string().min(2, {
    message: 'Название дополнения должно содержать минимум 2 символа'
  }),
  isRequired: z.boolean(),
  isMultiple: z.boolean(),
  limit: z.number().min(1, { message: 'Лимит должен быть не менее 1' }),
  additionProducts: z.array(additionProductSchema).min(0)
});

const formSchema = z.object({
  image: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Максимальный размер файла 5MB.'
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Допускаются файлы .jpg, .jpeg, .png и .webp'
    ),
  name: z.string().min(2, {
    message: 'Название должно содержать минимум 2 символа'
  }),
  productTypeId: z.number().min(1),
  status: z.string(),
  price: z.number(),
  stock: z.number(),
  description: z.string(),
  additions: z.array(additionSchema).optional().default([])
});

export default function ProductForm({
  initialData
}: {
  initialData?: IProduct;
}) {
  const { mutateAsync: createProductMutation } = useCreateProduct();
  const { mutateAsync: updateProductMutation } = useUpdateProduct();
  const { mutateAsync: attachImages } = useAttachProductImages();
  const [deletedImageIds] = useState<number[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const defaultValues = {
    name: initialData?.name || '',
    productTypeId: 0,
    status: '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    description: initialData?.description || '',
    additions: initialData?.additions || []
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const body = { ...values };
    delete body.image;

    // Update
    const productId = initialData?.id;
    if (productId) {
      await updateProductMutation({
        id: productId,
        data: body
      });

      if (deletedImageIds.length) {
        deletedImageIds.forEach((id) => {
          productAPi.deleteFile(productId, id);
        });
      }
      if (values.image.length) {
        await attachImages({ id: productId, files: values.image });
      }
    }
    // Create
    else {
      const res = await createProductMutation(body);

      if (values.image.length && res) {
        await attachImages({ id: res.id, files: values.image });
      }
    }

    queryClient.invalidateQueries({ queryKey: productKeys.all() });
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
              <FormItem className='md:col-span-2'>
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
              <FormItem className='md:col-span-2'>
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

          <Button type='submit' className='w-full md:w-auto'>
            {initialData ? 'Обновить продукт' : 'Создать продукт'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
