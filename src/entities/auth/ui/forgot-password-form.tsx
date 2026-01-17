'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
import { Input } from '@/shared/ui/base/input'

import { authApi } from '../model/api'

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Введите email адрес' })
    .email({ message: 'Введите корректный email адрес' }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

const extractErrorMessage = (err: unknown): string => {
  const defaultMessage = 'Не удалось отправить код. Попробуйте снова.'

  if (typeof err !== 'object' || err === null || !('response' in err)) {
    return defaultMessage
  }

  const errorObj = err as Record<string, unknown>
  const response = errorObj.response

  if (typeof response !== 'object' || response === null || !('data' in response)) {
    return defaultMessage
  }

  const responseData = response as Record<string, unknown>
  const data = responseData.data as Record<string, unknown> | undefined

  if (!data) return defaultMessage

  // Check for nested error object
  if ('error' in data && typeof data.error === 'object' && data.error !== null) {
    const errorData = data.error as Record<string, unknown>
    if ('message' in errorData && typeof errorData.message === 'string') {
      return errorData.message
    }
  }

  // Check for direct message
  if ('message' in data && typeof data.message === 'string') {
    return data.message
  }

  return defaultMessage
}

const ForgotPasswordForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = async (data: ForgotPasswordFormValues): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.forgotPassword({ email: data.email })

      if (response.success && response.data.success) {
        toast.success(response.data.message)
        router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`)
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Забыли пароль?</CardTitle>
        <CardDescription>
          Введите email, и мы отправим вам код для восстановления пароля
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      autoComplete="email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                'Отправить код'
              )}
            </Button>

            <Link
              href="/auth/sign-in"
              className="text-muted-foreground hover:text-primary flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Вернуться к входу
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ForgotPasswordForm
