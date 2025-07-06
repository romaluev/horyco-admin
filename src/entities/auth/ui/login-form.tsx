'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/entities/auth/model/store';
import { Button } from '@/shared/ui/base/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import { Alert, AlertDescription } from '@/shared/ui/base/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { PhoneInput } from '@/shared/ui/base/phone-input';
import PasswordInput from '@/shared/ui/base/passsword-input';

// Define the form schema with Zod
const loginFormSchema = z.object({
  phone: z
    .string()
    .min(4, { message: 'Password must be at least 6 characters' })
    .max(13, { message: 'Password must be less than 13 characters' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must be less than 100 characters' })
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError, me } = useAuthStore();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: '',
      password: ''
    }
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setGeneralError(null);
      clearError();
      await login(data.phone, data.password);
      me();

      const redirectPath = searchParams?.get('redirect');

      if (
        redirectPath &&
        redirectPath.startsWith('/') &&
        !redirectPath.startsWith('//') &&
        !redirectPath.includes(':')
      ) {
        router.push(redirectPath);
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setGeneralError(
        error.response?.data?.message || 'Failed to login. Please try again.'
      );
    }
  };

  return (
    <Card className='mx-auto w-full max-w-md'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Sign In</CardTitle>
        <CardDescription>Введите свои данные, чтобы войти</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {(error || generalError) && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error || generalError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон номер</FormLabel>
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
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      type='password'
                      placeholder='Введите свой пароль'
                      {...field}
                      autoComplete='current-password'
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
