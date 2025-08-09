'use client';

import {
  productAPi,
  useAttachProductImages,
  useGetProductById,
  useUpdateProduct
} from '@/entities/product';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../model/contract';

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
import { getChangedAdditions } from '@/features/product-form/lib/get-changed-additions';

export const UpdateProductForm = ({ productId }: { productId: number }) => {
  const { mutateAsync: updateProductMutation } = useUpdateProduct();
  const { mutateAsync: attachImages } = useAttachProductImages();
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const router = useRouter();

  const { data: product } = useGetProductById(productId);

  const defaultValues = {
    image: product?.files || [],
    name: product?.name || '',
    productTypeId: product?.productTypeId || 0,
    status: '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    description: product?.description || '',
    additions: product?.additions || []
  };

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    values: defaultValues
  });

  const onSubmit = async () => {
    const values = form.getValues();
    const body: any = { ...form.getValues(), id: productId };
    delete body.image;

    const changedAdditions = getChangedAdditions(
      product?.additions || [],
      values.additions || [],
      productId
    );
    if (changedAdditions.length > 0) {
      body.additions = changedAdditions;
    } else {
      delete body.additions;
    }

    await updateProductMutation({
      id: productId,
      data: body
    });

    if (deletedImageIds.length) {
      deletedImageIds.forEach((id) => {
        productAPi.deleteFile(productId, id);
      });
    }
    const images = (values.image || []).filter(
      (image: any) => image instanceof File
    );
    if (images.length) {
      await attachImages({ id: productId, files: images });
    }

    router.push('/dashboard/products');
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 items-start gap-x-2 gap-y-4 md:grid-cols-6'>
          <ProductFormImages
            images={
              product?.files.filter((f) => !deletedImageIds.includes(f.id)) ||
              []
            }
            setDeletedImages={setDeletedImageIds}
          />

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

          <Button type='submit' className='w-full px-4 md:w-auto'>
            Обновить продукт
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
