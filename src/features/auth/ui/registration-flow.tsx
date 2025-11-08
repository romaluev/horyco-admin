'use client'

import React, { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Check, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Checkbox } from '@/shared/ui/base/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import PasswordInput from '@/shared/ui/base/passsword-input'
import { PhoneInput } from '@/shared/ui/base/phone-input'
import { Progress } from '@/shared/ui/base/progress'

import { authApi } from '@/entities/auth/model/api'
import { useAuthStore } from '@/entities/auth/model/store'

import {
  checkPasswordStrength,
  registrationStep1Schema,
  registrationStep3Schema,
  type RegistrationStep1FormValues,
  type RegistrationStep3FormValues,
  OTP_CONFIG,
} from '../model'

type RegistrationStep = 'initial' | 'otp' | 'profile'

// Helper function to extract error message from unknown error
const getErrorMessage = (error: unknown): string | undefined => {
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
        return data.message
      }
    }
  }
  return undefined
}

export const RegistrationFlow = () => {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [step, setStep] = useState<RegistrationStep>('initial')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [maskedPhone, setMaskedPhone] = useState('')
  const [otpExpiry, setOtpExpiry] = useState(OTP_CONFIG.EXPIRY_SECONDS)
  const [canResend, setCanResend] = useState(false)

  // OTP attempt tracking (max 3 attempts)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const MAX_OTP_ATTEMPTS = 3
  const COOLDOWN_SECONDS = 300 // 5 minutes cooldown after max attempts

  // Store data across steps
  const [step1Data, setStep1Data] =
    useState<RegistrationStep1FormValues | null>(null)
  const [otpValue, setOtpValue] = useState('')

  // Refs for OTP inputs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Step 1: Phone & Business Name form
  const step1Form = useForm<RegistrationStep1FormValues>({
    resolver: zodResolver(registrationStep1Schema),
    defaultValues: {
      phone: '',
      businessName: '',
    },
  })

  // Step 3: Profile completion form
  const step3Form = useForm<RegistrationStep3FormValues>({
    resolver: zodResolver(registrationStep3Schema),
    defaultValues: {
      fullName: '',
      password: '',
      confirmPassword: '',
      email: '',
      agreeToTerms: false,
    },
  })

  // Watch password for strength indicator
  const password = step3Form.watch('password')
  const passwordStrength = password ? checkPasswordStrength(password) : null

  // Countdown timer for OTP expiry
  useEffect(() => {
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

  // Cooldown timer after max attempts
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (cooldownTime === 0 && maxAttemptsReached) {
      // Reset attempts after cooldown
      setMaxAttemptsReached(false)
      setOtpAttempts(0)
      setCanResend(true)
    }
    return undefined
  }, [cooldownTime, maxAttemptsReached])

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otpValue.length === 6 && !isLoading && !maxAttemptsReached) {
      handleVerifyOTP()
    }
  }, [otpValue, maxAttemptsReached])

  // Helper to mask phone number
  const maskPhoneNumber = (phone: string): string => {
    // +998901234567 -> +998 90 ***-**-67
    if (phone.length >= 13) {
      return `${phone.slice(0, 7)} ***-**-${phone.slice(-2)}`
    }
    return phone
  }

  // Helper to calculate expiry seconds from ISO date
  const calculateExpirySeconds = (expiresAt: string): number => {
    try {
      const expiryTime = new Date(expiresAt).getTime()
      const currentTime = new Date().getTime()
      const diffSeconds = Math.floor((expiryTime - currentTime) / 1000)
      return Math.max(0, diffSeconds)
    } catch {
      return OTP_CONFIG.EXPIRY_SECONDS // Fallback to 3 minutes
    }
  }

  // Step 1: Send OTP (Phone + Business Name only)
  const onSubmitStep1 = async (data: RegistrationStep1FormValues) => {
    try {
      setIsLoading(true)
      setError(null)

      // Send OTP
      const response = await authApi.sendOTP({
        phone: data.phone,
        businessName: data.businessName,
      })

      // Store step 1 data
      setStep1Data(data)

      // Calculate masked phone and expiry
      const masked = maskPhoneNumber(data.phone)
      setMaskedPhone(masked)

      const expirySeconds = calculateExpirySeconds(response.data.expiresAt)
      setOtpExpiry(expirySeconds)

      setCanResend(false)
      setStep('otp')
      toast.success(response.data.message)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err)

      if (
        errorMessage?.includes('уже зарегистрирован') ||
        errorMessage?.includes('already exists')
      ) {
        setError('Этот номер уже зарегистрирован. Попробуйте войти в систему.')
      } else {
        setError(errorMessage || 'Не удалось отправить код. Попробуйте снова.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Verify OTP (just verification, no registration yet)
  const handleVerifyOTP = async () => {
    if (!step1Data || otpValue.length !== 6 || maxAttemptsReached) return

    try {
      setIsLoading(true)
      setError(null)

      // Call API to verify OTP
      const response = await authApi.verifyOTP({
        phone: step1Data.phone,
        code: otpValue,
      })

      // Check if verification was successful
      // Handle different possible response structures
      const isVerified =
        response.verified === true ||
        (response as any).success === true ||
        response.message?.toLowerCase().includes('success')

      if (isVerified) {
        // Move to profile completion step
        setStep('profile')
        toast.success(response.message || 'Код подтверждён!')
        // Reset attempts on success
        setOtpAttempts(0)
      } else {
        // If verified is false, show error
        setError(response.message || 'Неверный код верификации')
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err)

      // Increment attempt counter
      const newAttempts = otpAttempts + 1
      setOtpAttempts(newAttempts)

      if (newAttempts >= MAX_OTP_ATTEMPTS) {
        // Max attempts reached - start cooldown
        setMaxAttemptsReached(true)
        setCooldownTime(COOLDOWN_SECONDS)
        setError(
          `Превышено максимальное количество попыток (${MAX_OTP_ATTEMPTS}). Попробуйте снова через ${Math.floor(COOLDOWN_SECONDS / 60)} минут.`
        )
        setOtpValue('')
        // Clear all OTP inputs
        otpRefs.current.forEach((ref) => {
          if (ref) ref.value = ''
        })
      } else {
        // Show error with remaining attempts
        const attemptsLeft = MAX_OTP_ATTEMPTS - newAttempts
        if (errorMessage?.includes('OTP') || errorMessage?.includes('код')) {
          setError(
            `Неверный код или истёк срок действия. Осталось попыток: ${attemptsLeft}`
          )
        } else {
          setError(
            errorMessage ||
              `Ошибка верификации. Осталось попыток: ${attemptsLeft}`
          )
        }
        setOtpValue('') // Clear OTP on error
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Complete registration with profile data
  const onSubmitStep3 = async (data: RegistrationStep3FormValues) => {
    if (!step1Data) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.completeRegistration({
        phone: step1Data.phone,
        fullName: data.fullName,
        email: data.email || undefined,
        password: data.password,
      })

      // Update auth store with employee data from nested structure
      if (response.success && response.data?.employee) {
        setUser(response.data.employee as any)
      }

      toast.success('Регистрация успешно завершена!')

      // Always redirect to onboarding after registration
      router.push('/onboarding/business-info')
    } catch (err: unknown) {
      console.error('Registration error:', err)
      const errorMessage = getErrorMessage(err)
      setError(errorMessage || 'Ошибка регистрации. Попробуйте снова.')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (!step1Data || !canResend) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await authApi.sendOTP({
        phone: step1Data.phone,
        businessName: step1Data.businessName,
      })

      const expirySeconds = calculateExpirySeconds(response.data.expiresAt)
      setOtpExpiry(expirySeconds)
      setCanResend(false)
      setOtpValue('') // Clear OTP input

      // Reset attempts counter when new OTP is sent
      setOtpAttempts(0)
      setMaxAttemptsReached(false)
      setCooldownTime(0)

      // Focus first input
      otpRefs.current[0]?.focus()

      toast.success('Код повторно отправлен')
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage || 'Не удалось отправить код. Попробуйте снова.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, '')

    if (val.length <= 1) {
      const newOtp = otpValue.split('')
      newOtp[index] = val
      const newOtpValue = newOtp.join('')
      setOtpValue(newOtpValue)

      // Auto-focus next input
      if (val && index < 5) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  // Handle OTP input keydown
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (!otpValue[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        otpRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newOtp = otpValue.split('')
        newOtp[index] = ''
        setOtpValue(newOtp.join(''))
      }
    }
  }

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6) // Only take digits, max 6

    if (digits.length > 0) {
      // Pad with empty strings if less than 6 digits
      const paddedDigits = digits.padEnd(6, '')
      setOtpValue(paddedDigits)

      // Focus the last filled input or the first empty one
      const nextIndex = Math.min(digits.length, 5)
      otpRefs.current[nextIndex]?.focus()
    }
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get step titles and descriptions
  const getStepInfo = () => {
    switch (step) {
      case 'initial':
        return {
          title: 'Добро пожаловать в OshLab!',
          description: 'Создайте аккаунт для вашего ресторана',
        }
      case 'otp':
        return {
          title: 'Введите код из SMS',
          description: `Код отправлен на ${maskedPhone}`,
        }
      case 'profile':
        return {
          title: 'Завершите регистрацию',
          description: 'Заполните данные профиля',
        }
      default:
        return { title: '', description: '' }
    }
  }

  const stepInfo = getStepInfo()

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{stepInfo.title}</CardTitle>
        <CardDescription>{stepInfo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'initial' && (
          // STEP 1: Phone & Business Name ONLY
          <Form {...step1Form}>
            <form
              onSubmit={step1Form.handleSubmit(onSubmitStep1)}
              className="space-y-4"
            >
              <FormField
                control={step1Form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон *</FormLabel>
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
                control={step1Form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название бизнеса *</FormLabel>
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
        )}

        {step === 'otp' && (
          // STEP 2: OTP Verification
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="h-12 w-12 text-center text-lg font-semibold"
                  value={otpValue[index] || ''}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  disabled={isLoading || maxAttemptsReached}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Cooldown timer */}
            {maxAttemptsReached && cooldownTime > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Превышено максимальное количество попыток. Повторите через{' '}
                  {formatTime(cooldownTime)}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center">
              {canResend && !maxAttemptsReached ? (
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-primary hover:text-primary/80 text-sm font-medium underline-offset-4 hover:underline disabled:opacity-50"
                >
                  Отправить код повторно
                </button>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {!maxAttemptsReached &&
                    `Код действителен: ${formatTime(otpExpiry)}`}
                </p>
              )}
            </div>

            <Button
              onClick={handleVerifyOTP}
              className="w-full"
              disabled={
                isLoading || otpValue.length !== 6 || maxAttemptsReached
              }
            >
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
        )}

        {step === 'profile' && (
          // STEP 3: Complete Profile (Full Name, Password, Email)
          <Form {...step3Form}>
            <form
              onSubmit={step3Form.handleSubmit(onSubmitStep3)}
              className="space-y-4"
            >
              <FormField
                control={step3Form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше полное имя *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Акмал Каримов"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step3Form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль *</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Создайте надежный пароль"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    {passwordStrength && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Надёжность:</span>
                          <span
                            className={`text-sm font-medium ${passwordStrength.color}`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <Progress value={(passwordStrength.score / 5) * 100} />
                        <div className="space-y-1 text-xs">
                          <PasswordRequirement
                            met={passwordStrength.requirements.minLength}
                            text="Минимум 8 символов"
                          />
                          <PasswordRequirement
                            met={passwordStrength.requirements.hasUppercase}
                            text="Заглавная буква"
                          />
                          <PasswordRequirement
                            met={passwordStrength.requirements.hasNumber}
                            text="Цифра"
                          />
                          <PasswordRequirement
                            met={passwordStrength.requirements.hasSpecial}
                            text="Специальный символ"
                          />
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step3Form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Повторите пароль *</FormLabel>
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

              <FormField
                control={step3Form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>Необязательно</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step3Form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Я согласен с условиями использования
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Завершение регистрации...
                  </>
                ) : (
                  'Завершить регистрацию'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}

// Helper component for password requirements
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
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
