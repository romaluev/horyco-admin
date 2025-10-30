'use client';

import { useRouter } from 'next/navigation';

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


import {
  useCreateBranch,
  useUpdateBranch
} from '@/entities/branch/model';

import type {
  ICreateBranchDto,
  IBranch,
  IUpdateBranchDto} from '@/entities/branch/model';

export default function BranchForm({ initialData }: { initialData?: IBranch }) {
  const router = useRouter();

  const { mutateAsync: createBranch, isPending: isCreatePending } =
    useCreateBranch();
  const { mutateAsync: updateBranch, isPending: isUpdatePending } =
    useUpdateBranch();

  // Form schema with validation
  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Название филиала должно содержать минимум 2 символа'
    }),
    address: z.string().min(5, {
      message: 'Адрес должен содержать минимум 5 символов'
    })
  });

  const defaultValues = {
    name: initialData?.name || '',
    address: initialData?.address || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (initialData?.id) {
        await updateBranch({
          id: initialData.id,
          data: values as IUpdateBranchDto
        });
      } else {
        await createBranch(values as ICreateBranchDto);
      }

      router.push('/dashboard/branches');
    } catch (error) {
      console.error('Error saving branches:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 items-start gap-x-2 gap-y-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название филиала</FormLabel>
                <FormControl>
                  <Input placeholder='Введите название филиала' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Адрес</FormLabel>
                <FormControl>
                  <Input placeholder='Введите адрес филиала' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' disabled={isCreatePending || isUpdatePending}>
          {initialData ? 'Обновить' : 'Создать'}
        </Button>
      </form>
    </Form>
  );
}
