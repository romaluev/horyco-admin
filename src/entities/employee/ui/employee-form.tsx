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
import { IEmployee, IEmployeeDto } from '../model';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { PhoneInput } from '@/shared/ui/base/phone-input';
import PasswordInput from '@/shared/ui/base/passsword-input';
import { useCreateEmployer, useUpdateEmployer } from '../model';
import { useGetAllBranches } from '@/entities/branch/model/queries';
import { useTranslation } from 'react-i18next';

export default function EmployeeForm({
  initialData
}: {
  initialData?: IEmployee;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: branches } = useGetAllBranches();
  const { mutateAsync: createEmployer, isPending } = useCreateEmployer();
  const { mutateAsync: updateEmployer } = useUpdateEmployer();

  const formSchema = z.object({
    fullName: z.string().min(2, {
      message: t('dashboard.employee.form.fields.fullName.validation')
    }),
    phone: z.string().min(4),
    password: z.string().min(4, {
      message: t('dashboard.employee.form.fields.password.validation')
    }),
    confirmPassword: z.string(),
    branchId: z.number()
  });

  const defaultValues = {
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    password: '',
    branchId: initialData?.branchId || undefined
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const body: IEmployeeDto = {
        fullName: values.fullName,
        branchId: values.branchId,
        password: values.password,
        phone: values.phone
      };

      let response;

      if (initialData) {
        response = await updateEmployer({ id: initialData.id, data: body });
      } else {
        response = await createEmployer(body);
      }

      if (response) {
        router.push('/dashboard/employee');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 items-start gap-x-2 gap-y-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('dashboard.employee.form.fields.fullName.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      'dashboard.employee.form.fields.fullName.placeholder'
                    )}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('dashboard.employee.form.fields.phone.label')}
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry={'UZ'}
                    placeholder={t(
                      'dashboard.employee.form.fields.phone.placeholder'
                    )}
                    limitMaxLength={true}
                    countries={['UZ']}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('dashboard.employee.form.fields.password.label')}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t(
                      'dashboard.employee.form.fields.password.placeholder'
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
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('dashboard.employee.form.fields.confirmPassword.label')}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t(
                      'dashboard.employee.form.fields.confirmPassword.placeholder'
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
            name='branchId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('dashboard.employee.form.fields.branch.label')}
                </FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  defaultValue={String(field.value || '')}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={t(
                          'dashboard.employee.form.fields.branch.placeholder'
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches?.items.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' disabled={isPending}>
          {initialData
            ? t('dashboard.employee.form.submit.update')
            : t('dashboard.employee.form.submit.create')}
        </Button>
      </form>
    </Form>
  );
}
