'use client'

import { useState, useEffect, useRef } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, Check, Loader2, X } from 'lucide-react'
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
import PasswordInput from '@/shared/ui/base/passsword-input'
import { Progress } from '@/shared/ui/base/progress'

import { authApi } from '../model/api'

const OTP_LENGTH = 6
const PASSWORD_MIN_LENGTH = 8
const PROGRESS_MULTIPLIER = 25

const PASSWORD_REGEX = {
  HAS_UPPERCASE: /[A-Z]/,
  HAS_LOWERCASE: /[a-z]/,
  HAS_NUMBER: /[0-9]/,
}

const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .length(OTP_LENGTH, { message: 'Код должен содержать 6 цифр' })
      .regex(/^\d+$/, { message: 'Код должен содержать только цифры' }),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: `Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов`,
      })
      .regex(PASSWORD_REGEX.HAS_UPPERCASE, {
        message: 'Пароль должен содержать минимум 1 заглавную букву',
      })
      .regex(PASSWORD_REGEX.HAS_LOWERCASE, {
        message: 'Пароль должен содержать минимум 1 строчную букву',
      })
      .regex(PASSWORD_REGEX.HAS_NUMBER, {
        message: 'Пароль должен содержать минимум 1 цифру',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface PasswordStrength {
  score: number
  label: string
  color: string
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
  }
}

const checkPasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasUppercase: PASSWORD_REGEX.HAS_UPPERCASE.test(password),
    hasLowercase: PASSWORD_REGEX.HAS_LOWERCASE.test(password),
    hasNumber: PASSWORD_REGEX.HAS_NUMBER.test(password),
  }

  const score = Object.values(requirements).filter(Boolean).length

  const strengthMap: Record<number, { label: string; color: string }> = {
    4: { label: 'Отличный', color: 'text-green-600' },
    3: { label: 'Хороший', color: 'text-blue-600' },
    2: { label: 'Средний', color: 'text-yellow-600' },
  }

  const { label, color } = strengthMap[score] ?? {
    label: 'Очень слабый',
    color: 'text-destructive',
  }

  return { score, label, color, requirements }
}

const extractErrorMessage = (err: unknown): string => {
  const defaultMessage = 'Не удалось сбросить пароль. Попробуйте снова.'

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

  if ('error' in data && typeof data.error === 'object' && data.error !== null) {
    const errorData = data.error as Record<string, unknown>
    if ('message' in errorData && typeof errorData.message === 'string') {
      return errorData.message
    }
  }

  if ('message' in data && typeof data.message === 'string') {
    return data.message
  }

  return defaultMessage
}

interface PasswordRequirementProps {
  met: boolean
  text: string
}

const PasswordRequirement = ({ met, text }: PasswordRequirementProps) => (
  <div className="flex items-center gap-2">
    {met ? (
      <Check className="h-3 w-3 text-green-500" />
    ) : (
      <X className="text-muted-foreground h-3 w-3" />
    )}
    <span className={met ? 'text-green-600' : 'text-muted-foreground'}>
      {text}
    </span>
  </div>
)

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

const OtpInput = ({ value, onChange, disabled }: OtpInputProps) => {
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, inputValue: string) => {
    const val = inputValue.replace(/\D/g, '')

    if (val.length <= 1) {
      const newOtp = value.split('')
      newOtp[index] = val
      onChange(newOtp.join(''))

      if (val && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        otpRefs.current[index - 1]?.focus()
      } else {
        const newOtp = value.split('')
        newOtp[index] = ''
        onChange(newOtp.join(''))
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain')
    const digits = pastedData.replace(/\D/g, '').slice(0, OTP_LENGTH)

    if (digits.length > 0) {
      onChange(digits.padEnd(OTP_LENGTH, ''))
      const nextIndex = Math.min(digits.length, OTP_LENGTH - 1)
      otpRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            otpRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-12 text-center text-lg font-semibold"
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
        />
      ))}
    </div>
  )
}

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength
}

const PasswordStrengthIndicator = ({ strength }: PasswordStrengthIndicatorProps) => (
  <div className="mt-2 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm">Надёжность:</span>
      <span className={`text-sm font-medium ${strength.color}`}>
        {strength.label}
      </span>
    </div>
    <Progress value={strength.score * PROGRESS_MULTIPLIER} />
    <div className="space-y-1 text-xs">
      <PasswordRequirement
        met={strength.requirements.minLength}
        text="Минимум 8 символов"
      />
      <PasswordRequirement
        met={strength.requirements.hasUppercase}
        text="Заглавная буква"
      />
      <PasswordRequirement
        met={strength.requirements.hasLowercase}
        text="Строчная буква"
      />
      <PasswordRequirement
        met={strength.requirements.hasNumber}
        text="Цифра"
      />
    </div>
  </div>
)

const ResetPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otpValue, setOtpValue] = useState('')

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const password = form.watch('newPassword')
  const passwordStrength = password ? checkPasswordStrength(password) : null

  useEffect(() => {
    form.setValue('code', otpValue)
  }, [otpValue, form])

  useEffect(() => {
    if (!email) {
      router.push('/auth/forgot-password')
    }
  }, [email, router])

  const handleSubmit = async (data: ResetPasswordFormValues): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.resetPassword({
        email,
        code: data.code,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })

      if (response.success && response.data.success) {
        toast.success(response.data.message)
        router.push('/auth/sign-in')
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Сброс пароля</CardTitle>
        <CardDescription>
          Введите код, отправленный на {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              name="code"
              render={() => (
                <FormItem>
                  <FormLabel>Код подтверждения</FormLabel>
                  <FormControl>
                    <OtpInput
                      value={otpValue}
                      onChange={setOtpValue}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Введите новый пароль"
                      autoComplete="new-password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  {passwordStrength && (
                    <PasswordStrengthIndicator strength={passwordStrength} />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Повторите пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Повторите новый пароль"
                      autoComplete="new-password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otpValue.length !== OTP_LENGTH}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сбросить пароль'
              )}
            </Button>

            <Link
              href="/auth/forgot-password"
              className="text-muted-foreground hover:text-primary flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Отправить код повторно
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ResetPasswordForm
