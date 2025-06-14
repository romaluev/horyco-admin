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
import { IEmployee, IEmployeeDto } from '../model';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PhoneInput } from '@/components/ui/phone-input';
import PasswordInput from '@/components/ui/passsword-input';
import {
  useCreateEmployer,
  useUpdateEmployer,
  useGetAllEmployee
} from '../model';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Branch name must be at least 2 characters.'
  }),
  phone: z.string().min(4),
  password: z.string().min(4),
  confirmPassword: z.string(),
  branchId: z.number()
});

export default function EmployeeForm({
  initialData
}: {
  initialData?: IEmployee;
}) {
  const router = useRouter();

  const { data: employee } = useGetAllEmployee();
  const { mutateAsync: createEmployer, isPending } = useCreateEmployer();
  const { mutateAsync: updateEmployer } = useUpdateEmployer();

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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry={'UZ'}
                    placeholder={'90 123 45 67'}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
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
                  <PasswordInput {...field} />
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
                    {employee?.items.map((employer) => (
                      <SelectItem
                        key={employer.id}
                        value={employer.id.toString()}
                      >
                        {employer.fullName}
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
