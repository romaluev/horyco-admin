'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/shared/ui/base/input-otp'
import PasswordInput from '@/shared/ui/base/passsword-input'
import { PhoneInput } from '@/shared/ui/base/phone-input'

import { authApi } from '@/entities/auth/model/api'

// Step 1: Initial registration form
const initialFormSchema = z.object({
  phone: z
    .string()
    .min(4, { message: 'Введите корректный номер телефона' })
    .max(13, { message: 'Номер телефона слишком длинный' }),
  businessName: z
    .string()
    .min(3, { message: 'Название должно содержать минимум 3 символа' })
    .max(100, { message: 'Название слишком длинное' }),
})

// Step 2: OTP verification form
const otpFormSchema = z
  .object({
    otp: z.string().length(6, { message: 'Код должен содержать 6 цифр' }),
    ownerName: z
      .string()
      .min(2, { message: 'Введите ваше имя' })
      .max(100, { message: 'Имя слишком длинное' }),
    password: z
      .string()
      .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
      .max(100, { message: 'Пароль слишком длинный' })
      .regex(/[A-Z]/, {
        message: 'Пароль должен содержать минимум 1 заглавную букву',
      })
      .regex(/[0-9]/, { message: 'Пароль должен содержать минимум 1 цифру' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Пароль должен содержать минимум 1 специальный символ',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type InitialFormValues = z.infer<typeof initialFormSchema>
type OTPFormValues = z.infer<typeof otpFormSchema>

const RegisterForm = () => {
  const router = useRouter()
  const [step, setStep] = useState<'initial' | 'otp'>('initial')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [maskedPhone, setMaskedPhone] = useState('')
  const [otpExpiry, setOtpExpiry] = useState(180) // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [registrationData, setRegistrationData] = useState<{
    phone: string
    businessName: string
  } | null>(null)

  // Initial form
  const initialForm = useForm<InitialFormValues>({
    resolver: zodResolver(initialFormSchema),
    defaultValues: {
      phone: '',
      businessName: '',
    },
  })

  // OTP form
  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
      ownerName: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Countdown timer for OTP expiry
  React.useEffect(() => {
    if (step === 'otp' && otpExpiry > 0) {
      const timer = setTimeout(() => {
        setOtpExpiry((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (otpExpiry === 0) {
      setCanResend(true)
    }
    return undefined
  }, [step, otpExpiry])

  // Handle initial form submission (send OTP)
  const onSendOTP = async (data: InitialFormValues) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.sendOTP({
        phone: data.phone,
        businessName: data.businessName,
      })

      setRegistrationData(data)
      setMaskedPhone(response.maskedPhone)
      setOtpExpiry(response.expiresIn)
      setCanResend(false)
      setStep('otp')
      toast.success(response.message)
    } catch (err: unknown) {
      let errorMessage = 'Не удалось отправить код. Попробуйте снова.'
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errObj = err as Record<string, unknown>
        const response = errObj.response
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
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP verification and complete registration
  const onVerifyOTP = async (data: OTPFormValues) => {
    if (!registrationData) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.verifyOTP({
        phone: registrationData.phone,
        otp: data.otp,
        businessName: registrationData.businessName,
        ownerName: data.ownerName,
        password: data.password,
      })

      toast.success('Регистрация успешно завершена!')

      // Redirect to onboarding
      if (response.onboardingProgress.isCompleted) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding/business-info')
      }
    } catch (err: unknown) {
      let errorMessage =
        'Неверный код или истёк срок действия. Попробуйте снова.'
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errObj = err as Record<string, unknown>
        const response = errObj.response
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
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (!registrationData || !canResend) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.sendOTP(registrationData)

      setOtpExpiry(response.expiresIn)
      setCanResend(false)
      toast.success('Код повторно отправлен')
    } catch (err: unknown) {
      let errorMessage = 'Не удалось отправить код. Попробуйте снова.'
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errObj = err as Record<string, unknown>
        const response = errObj.response
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
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {step === 'initial' ? 'Регистрация' : 'Подтверждение'}
        </CardTitle>
        <CardDescription>
          {step === 'initial'
            ? 'Создайте аккаунт для вашего ресторана'
            : `Введите код из SMS, отправленный на ${maskedPhone}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'initial' ? (
          <Form {...initialForm}>
            <form
              onSubmit={initialForm.handleSubmit(onSendOTP)}
              className="space-y-4"
            >
              <FormField
                control={initialForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер телефона</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry={'UZ'}
                        placeholder={'90 123 45 67'}
                        limitMaxLength
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
                control={initialForm.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название вашего бизнеса</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Например: Пицца Хаус"
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
                  'Получить код по SMS'
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onVerifyOTP)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код подтверждения</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        disabled={isLoading}
                        containerClassName="justify-center"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <div className="text-muted-foreground mt-2 text-center text-sm">
                      Код действителен: {formatTime(otpExpiry)}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={otpForm.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше имя</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Иван Иванов"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={otpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Создайте надежный пароль"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={otpForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите пароль</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Повторите пароль"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleResendOTP}
                  disabled={!canResend || isLoading}
                >
                  {canResend ? 'Отправить повторно' : 'Ожидание...'}
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    'Подтвердить'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

export default RegisterForm
