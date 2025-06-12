'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/store';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import PasswordInput from '@/components/ui/passsword-input';

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

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Initialize the form
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

      // Check if there's a redirect parameter and use it for navigation
      const redirectPath = searchParams?.get('redirect');

      // Validate the redirect path to prevent open redirect vulnerabilities
      // Only allow redirects to relative paths within our application
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
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
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
                  <FormLabel>Phone number</FormLabel>
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
                    <PasswordInput
                      type='password'
                      placeholder='Enter your password'
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center'>
        <p className='text-muted-foreground text-sm'>
          Don&#39;t have an account?{' '}
          <Button
            variant='link'
            className='p-0'
            onClick={() => router.push('/auth/sign-up')}
          >
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
