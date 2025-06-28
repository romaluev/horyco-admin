'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import {
  ICreateBranchDto,
  IBranch,
  IUpdateBranchDto,
  useCreateBranch,
  useUpdateBranch
} from '@/entities/branch/model';
import { useTranslation } from 'react-i18next';

export default function BranchForm({ initialData }: { initialData?: IBranch }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { mutateAsync: createBranch, isPending: isCreatePending } =
    useCreateBranch();
  const { mutateAsync: updateBranch, isPending: isUpdatePending } =
    useUpdateBranch();

  // Form schema with validation
  const formSchema = z.object({
    name: z.string().min(2, {
      message: t('dashboard.branches.form.fields.name.validation')
    }),
    address: z.string().min(5, {
      message: t('dashboard.branches.form.fields.address.validation')
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
      let result;

      if (initialData) {
        result = await updateBranch({
          id: initialData.id,
          data: values as IUpdateBranchDto
        });
      } else {
        await createBranch(values as ICreateBranchDto);
      }

      if (result) {
        router.push('/dashboard/branches');
      }
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
                <FormLabel>
                  {t('dashboard.branches.form.fields.name.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      'dashboard.branches.form.fields.name.placeholder'
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
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('dashboard.branches.form.fields.address.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      'dashboard.branches.form.fields.address.placeholder'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' disabled={isCreatePending || isUpdatePending}>
          {initialData
            ? t('common.actions.update')
            : t('common.actions.create')}
        </Button>
      </form>
    </Form>
  );
}
