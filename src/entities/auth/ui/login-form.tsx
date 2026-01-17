'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { BaseLoading } from '@/shared/ui'
import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import PasswordInput from '@/shared/ui/base/passsword-input'
import { PhoneInput } from '@/shared/ui/base/phone-input'

import { useAuthStore } from '@/entities/auth/model/store'

// Define the form schema with Zod
const loginFormSchema = z.object({
  phone: z
    .string()
    .min(4, { message: 'Password must be at least 6 characters' })
    .max(13, { message: 'Password must be less than 13 characters' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must be less than 100 characters' }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

const LoginForm = () => {
  const router = useRouter()
  const { login, isLoading, error, clearError, me, loadFullProfile } = useAuthStore()
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  // Handle form submission
  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    try {
      setGeneralError(null)
      clearError()

      // Get tenantSlug from stored context or URL
      const tenantSlug = typeof window !== 'undefined'
        ? localStorage.getItem('tenantSlug') || undefined
        : undefined

      // Step 1: Login and save tokens
      await login(data.phone, data.password, tenantSlug)

      // Step 2: Show loading immediately and fetch user data
      setIsRedirecting(true)
      await me()
      // Load full profile with avatar on background
      void loadFullProfile().catch((e: unknown) => console.warn('Failed to load profile:', e))

      // TODO: Uncomment when API is ready
      // Check onboarding status
      // try {
      //   const onboardingProgress = await onboardingApi.getProgress();
      //
      //   // If onboarding is not completed, redirect to appropriate step
      //   if (!onboardingProgress.isCompleted) {
      //     const currentStep = onboardingProgress.currentStep;
      //
      //     // Map backend step names to routes
      //     const stepRoutes: Record<string, string> = {
      //       'REGISTRATION_COMPLETE': '/onboarding/business-info',
      //       'BUSINESS_INFO_VERIFIED': '/onboarding/branch-setup',
      //       'BRANCH_SETUP': '/onboarding/menu-template',
      //       'MENU_TEMPLATE': '/onboarding/payment-setup',
      //       'PAYMENT_SETUP': '/onboarding/staff-invite',
      //       'STAFF_INVITED': '/onboarding/complete',
      //       'GO_LIVE': '/dashboard'
      //     };
      //
      //     const nextRoute = stepRoutes[currentStep] || '/onboarding/business-info';
      //     router.push(nextRoute);
      //     return;
      //   }
      // } catch (err) {
      //   // If onboarding check fails, proceed to normal redirect
      //   console.log('Could not check onboarding status:', err);
      // }

      // Step 3: Redirect after user data is loaded
      router.push('/')

      // Normal redirect logic for completed onboarding (currently unreachable)
      // const redirectPath = searchParams?.get('redirect');
      // if (
      //   redirectPath &&
      //   redirectPath.startsWith('/') &&
      //   !redirectPath.startsWith('//') &&
      //   !redirectPath.includes(':')
      // ) {
      //   router.push(redirectPath);
      // } else {
      //   router.push('/dashboard');
      // }
    } catch (error: unknown) {
      setIsRedirecting(false)
      let errorMessage = 'Failed to login. Please try again.'
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const errorObj = error as Record<string, unknown>
        const response = errorObj.response
        if (
          typeof response === 'object' &&
          response !== null &&
          'data' in response
        ) {
          const data = response as Record<string, unknown>
          if ('message' in data && typeof data.message === 'string') {
            errorMessage = data.message
          }
        }
      }
      setGeneralError(errorMessage)
    }
  }

  // Show full-screen loading overlay while fetching user data
  if (isRedirecting) {
    return (
      <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <BaseLoading />
        </div>
      </div>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>Введите свои данные, чтобы войти</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {(error || generalError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error || generalError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон номер</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry={'UZ'}
                      placeholder={'90 123 45 67'}
                      limitMaxLength
                      countries={['UZ']}
                      {...field}
                      disabled={isLoading || isRedirecting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Пароль</FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="text-muted-foreground hover:text-primary text-sm underline-offset-4 hover:underline"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      type="password"
                      placeholder="Введите свой пароль"
                      {...field}
                      autoComplete="current-password"
                      disabled={isLoading || isRedirecting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isRedirecting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
  )
}

export default LoginForm
