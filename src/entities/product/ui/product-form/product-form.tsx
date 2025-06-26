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
import {
  IProduct,
  productAPi,
  useAttachProductImages,
  useCreateProduct,
  useUpdateProduct
} from '@/entities/product/model';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { Check } from 'lucide-react';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  STATUSES
} from '@/shared/config/data';
import { useState } from 'react';
import { router } from 'next/client';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  image: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.'
  }),
  productTypeId: z.number().min(1),
  status: z.string(),
  price: z.number(),
  stock: z.number(),
  description: z.string(),
  // To-Do: Add
  isMultiple: z.boolean()
});

export default function ProductForm({
  initialData
}: {
  initialData?: IProduct;
}) {
  const { mutateAsync: createProductMutation } = useCreateProduct();
  const { mutateAsync: updateProductMutation } = useUpdateProduct();
  const { mutateAsync: attachImages } = useAttachProductImages();
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const router = useRouter();

  const defaultValues = {
    name: initialData?.name || '',
    productTypeId: 0,
    status: '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    description: initialData?.description || '',
    isMultiple: initialData?.isMultiple || false
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
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
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
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter price'
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
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter stock'
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
            name='status'
            render={({ field }) => (
              <FormItem className='md:col-span-2'>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='md:col-span-6'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter product description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit'>
          Add Product
          <Check />
        </Button>
      </form>
    </FormProvider>
  );
}
