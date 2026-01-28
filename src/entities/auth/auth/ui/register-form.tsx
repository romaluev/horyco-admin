'use client'

import React, { useState } from 'react'

import { useRouter } from '@/shared/lib/navigation'
import { useTranslation } from 'react-i18next'

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

import { authApi } from '@/entities/auth/auth/model/api'

const initialFormSchema = z.object({
  phone: z.string().min(4).max(13),
  businessName: z.string().min(3).max(100),
  email: z.string().email().optional().or(z.literal('')),
})

const otpFormSchema = z
  .object({
    otp: z.string().length(6),
    ownerName: z.string().min(2).max(100),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, {})
      .regex(/[0-9]/, {})
      .regex(/[^A-Za-z0-9]/, {}),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  })

type InitialFormValues = z.infer<typeof initialFormSchema>
type OTPFormValues = z.infer<typeof otpFormSchema>

const RegisterForm = () => {
  const router = useRouter()
  const { t } = useTranslation('auth')
  const [step, setStep] = useState<'initial' | 'otp'>('initial')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [maskedPhone, setMaskedPhone] = useState('')
  const [otpExpiry, setOtpExpiry] = useState(180)
  const [canResend, setCanResend] = useState(false)
  const [registrationData, setRegistrationData] = useState<{
    phone: string
    businessName: string
    email?: string
  } | null>(null)

  const initialForm = useForm<InitialFormValues>({
    resolver: zodResolver(initialFormSchema),
    defaultValues: {
      phone: '',
      businessName: '',
      email: '',
    },
  })

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
      ownerName: '',
      password: '',
      confirmPassword: '',
    },
  })

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

  const onSendOTP = async (data: InitialFormValues) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.sendOTP({
        phone: data.phone,
        businessName: data.businessName,
        email: data.email,
      })

      setRegistrationData(data)
      setMaskedPhone(response.maskedPhone)
      setOtpExpiry(response.expiresIn)
      setCanResend(false)
      setStep('otp')
      toast.success(response.message)
    } catch (err: unknown) {
      let errorMessage = t('register.initial.sendFailed')
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

      toast.success(t('register.otp.successMessage'))

      if (response.onboardingProgress.isCompleted) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding/business-info')
      }
    } catch (err: unknown) {
      let errorMessage = t('register.otp.verifyFailed')
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

  const handleResendOTP = async () => {
    if (!registrationData || !canResend) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.sendOTP(registrationData)

      setOtpExpiry(response.expiresIn)
      setCanResend(false)
      toast.success(t('errors.resendOTPSuccess'))
    } catch (err: unknown) {
      let errorMessage = t('register.initial.sendFailed')
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {step === 'initial' ? t('register.initial.title') : t('register.otp.title')}
        </CardTitle>
        <CardDescription>
          {step === 'initial'
            ? t('register.initial.description')
            : t('register.otp.description', { phone: maskedPhone })}
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
                    <FormLabel>{t('register.initial.phone')}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry={'UZ'}
                        placeholder={t('register.initial.phonePlaceholder')}
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
                    <FormLabel>{t('register.initial.businessName')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('register.initial.businessNamePlaceholder')}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.initial.email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('register.initial.emailPlaceholder')}
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
                    {t('register.initial.sending')}
                  </>
                ) : (
                  t('register.initial.getSMSCode')
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
                    <FormLabel>{t('register.otp.code')}</FormLabel>
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
                      {t('register.otp.codeValidUntil')} {formatTime(otpExpiry)}
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
                    <FormLabel>{t('register.otp.ownerName')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('register.otp.ownerNamePlaceholder')}
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
                    <FormLabel>{t('register.otp.password')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t('register.otp.passwordPlaceholder')}
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
                    <FormLabel>{t('register.otp.confirmPassword')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t('register.otp.confirmPasswordPlaceholder')}
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
                  {canResend ? t('register.otp.resend') : t('register.otp.waiting')}
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('register.otp.checking')}
                    </>
                  ) : (
                    t('register.otp.submit')
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
