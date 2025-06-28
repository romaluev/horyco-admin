'use client';

import React from 'react';
import { IProductType, IProductTypeRequest } from '../../model/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useCreateProductType,
  useUpdateProductType
} from '../../model/mutations-product-type';
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
import { Button } from '@/shared/ui/base/button';
import { useTranslation } from 'react-i18next';

const formSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t('dashboard.products.types.form.name.validation')),
    description: z
      .string()
      .min(1, t('dashboard.products.types.form.description.validation'))
  });

type FormValues = z.infer<ReturnType<typeof formSchema>>;

interface ProductTypeFormProps {
  initialData?: IProductType | null;
  onSuccess?: () => void;
}

export const ProductTypeForm = ({
  initialData,
  onSuccess
}: ProductTypeFormProps) => {
  const { t } = useTranslation();
  const { mutate: createProductType, isPending: isCreating } =
    useCreateProductType();
  const { mutate: updateProductType, isPending: isUpdating } =
    useUpdateProductType(initialData?.id?.toString() || '');

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
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
              <FormLabel>
                {t('dashboard.products.types.form.name.label')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'dashboard.products.types.form.name.placeholder'
                  )}
                  {...field}
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
            <FormItem>
              <FormLabel>
                {t('dashboard.products.types.form.description.label')}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    'dashboard.products.types.form.description.placeholder'
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? t('common.actions.saving')
            : initialData
              ? t('common.actions.update')
              : t('common.actions.create')}
        </Button>
      </form>
    </Form>
  );
};
