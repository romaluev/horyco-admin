'use client'

import { useState } from 'react'

import { Link } from '@tanstack/react-router'


import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useRouter } from '@/shared/lib/navigation'
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

import { useAuthStore } from '@/entities/auth/auth/model/store'

const loginFormSchema = z.object({
  phone: z.string().min(4).max(13),
  password: z.string().min(4).max(100),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

const LoginForm = () => {
  const router = useRouter()
  const { t } = useTranslation('auth')
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

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    try {
      setGeneralError(null)
      clearError()

      const tenantSlug = typeof window !== 'undefined'
        ? localStorage.getItem('tenantSlug') || undefined
        : undefined

      await login(data.phone, data.password, tenantSlug)

      setIsRedirecting(true)
      await me()
      void loadFullProfile().catch((e: unknown) => console.warn('Failed to load profile:', e))

      router.push('/')
    } catch (error: unknown) {
      setIsRedirecting(false)
      let errorMessage = t('signIn.loginFailed')
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
        <CardTitle className="text-2xl font-bold">{t('signIn.title')}</CardTitle>
        <CardDescription>{t('signIn.description')}</CardDescription>
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
                  <FormLabel>{t('signIn.phone')}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry={'UZ'}
                      placeholder={t('signIn.phonePlaceholder')}
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
                    <FormLabel>{t('signIn.password')}</FormLabel>
                    <Link
                      to="/auth/forgot-password"
                      className="text-muted-foreground hover:text-primary text-sm underline-offset-4 hover:underline"
                    >
                      {t('signIn.forgotPassword')}
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      type="password"
                      placeholder={t('signIn.passwordPlaceholder')}
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
                  {t('signIn.signingIn')}
                </>
              ) : (
                t('signIn.signInButton')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginForm
