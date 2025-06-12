'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import {
  employeeAPi,
  IEmployee,
  IEmployeeRequest,
  useEmployeeStore
} from '../model';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useBranchStore } from '@/features/branch/model';
import { PhoneInput } from '@/components/ui/phone-input';
import PasswordInput from '@/components/ui/passsword-input';
import { FileUploader } from '@/components/file-uploader';
import { useEffect } from 'react';

// Form schema with validation
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Branch name must be at least 2 characters.'
  }),
  phone: z.string().min(4),
  password: z.string().min(4),
  confirmPassword: z.string(),
  branchId: z.number()
  //   To-Do: Add photo
  //   photo: z
  //     .any()
  //     .optional()
  //     .refine((files) => !files?.[0] || files[0].size <= MAX_FILE_SIZE, {
  //       message: 'Max file size is 5MB.'
  //     })
  //     .refine(
  //       (files) => !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
  //       { message: '.jpg, .jpeg, .png and .webp files are accepted.' }
  //     )
  // })
  // .refine((data) => data.password === data.confirmPassword, {
  //   path: ['confirmPassword'],
  //   message: 'Passwords do not match'
});

export default function EmployeeForm({
  initialData
}: {
  initialData: IEmployee | null;
}) {
  const router = useRouter();

  const { branches, fetchBranches } = useBranchStore();
  const { createEmployee, updateEmployee, isLoading } = useEmployeeStore();

  useEffect(() => {
    fetchBranches({ page: 0, size: 100 });
  }, []);

  const defaultValues = {
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    password: '',
    branchId: initialData?.branchId || undefined
    // photo: initialData?.photoUrl || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const body: IEmployeeRequest = {
        fullName: values.fullName,
        branchId: values.branchId,
        password: values.password,
        phone: values.phone
      };

      if (initialData) {
        const result = await updateEmployee(initialData.id, body);
        if (result) {
          router.push('/dashboard/employee');
        }
      } else {
        const result = await createEmployee(body);
        if (result) {
          router.push('/dashboard/employee');
        }
      }
    } catch (error) {
      console.error('Error saving branch:', error);
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
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter full name'
                    {...field}
                    disabled={isLoading}
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry={'UZ'}
                    placeholder={'90 123 45 67'}
                    limitMaxLength={true}
                    countries={['UZ']}
                    {...field}
                    disabled={isLoading}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} disabled={isLoading} />
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
                <FormLabel>Repeat password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} disabled={isLoading} />
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
                <FormLabel>Branch</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  defaultValue={String(field.value || '')}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select the branch' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map((branch) => (
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

          {/*<FormField*/}
          {/*  control={form.control}*/}
          {/*  name='photo'*/}
          {/*  render={({ field }) => (*/}
          {/*    <FormItem>*/}
          {/*      <FormLabel>Profile photo</FormLabel>*/}
          {/*      <FormControl>*/}
          {/*        <FileUploader*/}
          {/*          variant='image'*/}
          {/*          value={field.value}*/}
          {/*          onValueChange={field.onChange}*/}
          {/*          maxFiles={1}*/}
          {/*          maxSize={MAX_FILE_SIZE}*/}
          {/*        />*/}
          {/*      </FormControl>*/}
          {/*      <FormMessage />*/}
          {/*    </FormItem>*/}
          {/*  )}*/}
          {/*/>*/}
        </div>
        <Button type='submit' disabled={isLoading}>
          {initialData ? 'Update employer info' : 'Create employer'}
        </Button>
      </form>
    </Form>
  );
}
