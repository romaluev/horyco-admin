'use client'

import { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from '@/shared/lib/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  Phone,
  XCircle,
} from 'lucide-react'
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

import { authApi } from '@/entities/auth/auth/model/api'
import { useAuthStore } from '@/entities/auth/auth/model/store'

import type { VerifyInviteResponse } from '@/entities/auth/auth/model/types'

// Helper to extract error message from API response
const extractErrorMessage = (
  err: unknown,
  defaultMessage: string
): string => {
  if (typeof err !== 'object' || err === null || !('response' in err)) {
    return defaultMessage
  }

  const errorObj = err as Record<string, unknown>
  const response = errorObj.response
  if (typeof response !== 'object' || response === null || !('data' in response)) {
    return defaultMessage
  }

  const responseData = response as Record<string, unknown>
  const data = responseData.data
  if (typeof data !== 'object' || data === null || !('message' in data)) {
    return defaultMessage
  }

  const dataObj = data as Record<string, unknown>
  return typeof dataObj.message === 'string' ? dataObj.message : defaultMessage
}

// Password schema matching API requirements
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
    .max(50, { message: 'Пароль должен содержать максимум 50 символов' })
    .regex(/[A-Z]/, {
      message: 'Пароль должен содержать хотя бы одну заглавную букву',
    })
    .regex(/[a-z]/, {
      message: 'Пароль должен содержать хотя бы одну строчную букву',
    })
    .regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

type InviteState = 'loading' | 'invalid' | 'valid' | 'completing' | 'success'

const InviteForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { me, loadFullProfile } = useAuthStore()

  const [state, setState] = useState<InviteState>('loading')
  const [inviteData, setInviteData] = useState<VerifyInviteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Токен приглашения не найден')
        setState('invalid')
        return
      }

      try {
        const response = await authApi.verifyInvite({ token })

        if (response.valid) {
          setInviteData(response)
          setState('valid')
        } else {
          setError(response.message || 'Недействительный или истекший токен приглашения')
          setState('invalid')
        }
      } catch {
        setError('Не удалось проверить приглашение. Попробуйте позже.')
        setState('invalid')
      }
    }

    verifyToken()
  }, [token])

  // Handle password form submission
  const onSubmit = async (data: PasswordFormValues): Promise<void> => {
    if (!token) return

    try {
      setError(null)
      setState('completing')

      const response = await authApi.completeInvite({
        token,
        password: data.password,
      })

      if (response.success) {
        setState('success')

        // Load user data
        setIsRedirecting(true)
        await me()
        void loadFullProfile().catch((e: unknown) =>
          console.warn('Failed to load profile:', e)
        )

        // Redirect to onboarding or dashboard
        router.push('/onboarding/business-info')
      } else {
        setError('Не удалось завершить регистрацию')
        setState('valid')
      }
    } catch (err: unknown) {
      setState('valid')
      const errorMessage = extractErrorMessage(
        err,
        'Не удалось завершить регистрацию. Попробуйте снова.'
      )
      setError(errorMessage)
    }
  }

  // Full-screen loading overlay
  if (isRedirecting) {
    return (
      <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <BaseLoading />
        </div>
      </div>
    )
  }

  // Loading state
  if (state === 'loading') {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-4">Проверка приглашения...</p>
        </CardContent>
      </Card>
    )
  }

  // Invalid token state
  if (state === 'invalid') {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Приглашение недействительно</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" onClick={() => router.push('/auth/sign-in')}>
            Перейти к входу
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Success state
  if (state === 'success') {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Добро пожаловать!</CardTitle>
          <CardDescription>
            Ваш аккаунт успешно активирован. Перенаправляем...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  // Valid token - show password form
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Добро пожаловать в Horyco!
        </CardTitle>
        <CardDescription>
          Установите пароль для вашего аккаунта
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invitation info */}
        {inviteData && (
          <div className="bg-muted/50 space-y-3 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Building2 className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">{inviteData.tenantName}</p>
                <p className="text-muted-foreground text-xs">Ваш бизнес</p>
              </div>
            </div>
            {inviteData.ownerPhone && (
              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">{inviteData.ownerPhone}</p>
                  <p className="text-muted-foreground text-xs">Номер телефона</p>
                </div>
              </div>
            )}
            {inviteData.daysRemaining !== undefined && (
              <div className="flex items-center gap-3">
                <Clock className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">
                    {inviteData.daysRemaining} дн.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Срок действия приглашения
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Password form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Введите пароль"
                      autoComplete="new-password"
                      disabled={state === 'completing'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтвердите пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Повторите пароль"
                      autoComplete="new-password"
                      disabled={state === 'completing'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password requirements hint */}
            <div className="text-muted-foreground text-xs">
              <p className="mb-1 font-medium">Требования к паролю:</p>
              <ul className="list-inside list-disc space-y-0.5">
                <li>Минимум 8 символов</li>
                <li>Хотя бы одна заглавная буква</li>
                <li>Хотя бы одна строчная буква</li>
                <li>Хотя бы одна цифра</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={state === 'completing'}
            >
              {state === 'completing' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Активация...
                </>
              ) : (
                'Активировать аккаунт'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default InviteForm
