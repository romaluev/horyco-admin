import { z } from 'zod';
import { PASSWORD_REGEX, PHONE_CONFIG } from './constants';

/**
 * Authentication validation schemas (Zod)
 * All validation logic for auth features
 */

/**
 * Login form schema
 */
export const loginSchema = z.object({
  phone: z
    .string()
    .min(PHONE_CONFIG.MIN_LENGTH, {
      message: 'Введите корректный номер телефона'
    })
    .max(PHONE_CONFIG.MAX_LENGTH, {
      message: 'Номер телефона слишком длинный'
    })
    .regex(PHONE_CONFIG.FORMAT_PATTERN, {
      message: 'Формат: +998 XX XXX XX XX'
    }),
  password: z.string().min(1, { message: 'Введите пароль' })
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Registration - Step 1: Phone & Business Name
 * Per ADMIN_BUSINESS_SIGNUP.md - Initial step before OTP
 */
export const registrationStep1Schema = z.object({
  phone: z
    .string()
    .min(PHONE_CONFIG.MIN_LENGTH, {
      message: 'Введите корректный номер телефона'
    })
    .max(PHONE_CONFIG.MAX_LENGTH, {
      message: 'Номер телефона слишком длинный'
    })
    .regex(PHONE_CONFIG.FORMAT_PATTERN, {
      message: 'Формат: +998 XX XXX XX XX'
    }),
  businessName: z
    .string()
    .min(3, { message: 'Название должно содержать минимум 3 символа' })
    .max(100, { message: 'Название слишком длинное' })
});

export type RegistrationStep1FormValues = z.infer<typeof registrationStep1Schema>;

/**
 * Registration - Step 2: OTP verification
 * OTP is handled separately, not in a form schema
 * since it's 6 individual inputs
 */
export const otpSchema = z.object({
  otp: z.string().length(6, { message: 'Код должен содержать 6 цифр' })
});

export type OTPFormValues = z.infer<typeof otpSchema>;

/**
 * Registration - Step 3: Complete Profile (After OTP verification)
 * Per ADMIN_BUSINESS_SIGNUP.md - Full name, password, email
 */
export const registrationStep3Schema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Введите ваше полное имя' })
      .max(100, { message: 'Имя слишком длинное' }),
    password: z
      .string()
      .min(PASSWORD_REGEX.MIN_LENGTH, {
        message: `Пароль должен содержать минимум ${PASSWORD_REGEX.MIN_LENGTH} символов`
      })
      .max(100, { message: 'Пароль слишком длинный' })
      .regex(PASSWORD_REGEX.HAS_UPPERCASE, {
        message: 'Пароль должен содержать минимум 1 заглавную букву'
      })
      .regex(PASSWORD_REGEX.HAS_NUMBER, {
        message: 'Пароль должен содержать минимум 1 цифру'
      })
      .regex(PASSWORD_REGEX.HAS_SPECIAL, {
        message: 'Пароль должен содержать минимум 1 специальный символ'
      }),
    confirmPassword: z.string(),
    email: z
      .string()
      .email({ message: 'Введите корректный email' })
      .optional()
      .or(z.literal('')),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'Вы должны согласиться с условиями'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  });

export type RegistrationStep3FormValues = z.infer<typeof registrationStep3Schema>;
