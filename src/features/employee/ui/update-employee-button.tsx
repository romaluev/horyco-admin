'use client';

import { Button } from '@/shared/ui/base/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/base/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { useState } from 'react';
import { PhoneInput } from '@/shared/ui/base/phone-input';
import PasswordInput from '@/shared/ui/base/passsword-input';
import { useGetAllBranches } from '@/entities/branch/model';
import { employeeSchema } from '../model/contract';
import { useUpdateEmployer } from '../model/mutations';
import { IEmployeeDto, useGetEmployerById } from '@/entities/employee/model';

type UpdateEmployeeButtonProps = {
  id: number;
  Trigger: React.ReactNode;
};

export const UpdateEmployeeButton = ({
  id: employerId,
  Trigger
}: UpdateEmployeeButtonProps) => {
  const [open, setOpen] = useState(false);
  const { data: employer } = useGetEmployerById(employerId);

  const { data: branches } = useGetAllBranches();
  const { mutateAsync: updateEmployer, isPending } = useUpdateEmployer();

  const defaultValues = {
    fullName: employer?.fullName || '',
    phone: employer?.phone || '',
    password: '',
    branchId: employer?.branchId || undefined
  };

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof employeeSchema>) {
    try {
      const body: IEmployeeDto = {
        fullName: values.fullName,
        branchId: values.branchId,
        password: values.password,
        phone: values.phone
      };

      const response = await updateEmployer({ id: employerId, data: body });

      if (response) {
        setOpen(false);
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Обновить сотрудника</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 items-start gap-x-2 gap-y-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Полное имя</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Введите полное имя'
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
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry={'UZ'}
                        placeholder='90 123 45 67'
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
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='Введите пароль' {...field} />
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
                    <FormLabel>Повторите пароль</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Повторите пароль'
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
                    <FormLabel>Филиал</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      defaultValue={String(field.value || '')}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Выберите филиал' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches?.items.map((branch) => (
                          <SelectItem
                            key={branch.id}
                            value={branch.id.toString()}
                          >
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
              Обновить
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
