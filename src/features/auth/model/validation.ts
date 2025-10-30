import { z } from 'zod';

import { PASSWORD_REGEX, PHONE_CONFIG } from './constants';

// Step 1: Initial registration form
export const initialFormSchema = z.object({
  phone: z
    .string()
    .min(PHONE_CONFIG.MIN_LENGTH, { message: 'Введите корректный номер телефона' })
    .max(PHONE_CONFIG.MAX_LENGTH, { message: 'Номер телефона слишком длинный' })
    .regex(PHONE_CONFIG.FORMAT_PATTERN, {
      message: 'Формат: +998 XX XXX XX XX'
    }),
  businessName: z
    .string()
    .min(3, { message: 'Название должно содержать минимум 3 символа' })
    .max(100, { message: 'Название слишком длинное' })
});

// Step 2: OTP verification form
export const otpFormSchema = z
  .object({
    otp: z.string().length(6, { message: 'Код должен содержать 6 цифр' }),
    ownerName: z
      .string()
      .min(2, { message: 'Введите ваше имя' })
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
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  });

export type InitialFormValues = z.infer<typeof initialFormSchema>;
export type OTPFormValues = z.infer<typeof otpFormSchema>;

// Password strength checker
export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    minLength: password.length >= PASSWORD_REGEX.MIN_LENGTH,
    hasUppercase: PASSWORD_REGEX.HAS_UPPERCASE.test(password),
    hasLowercase: PASSWORD_REGEX.HAS_LOWERCASE.test(password),
    hasNumber: PASSWORD_REGEX.HAS_NUMBER.test(password),
    hasSpecial: PASSWORD_REGEX.HAS_SPECIAL.test(password)
  };

  const score = Object.values(requirements).filter(Boolean).length;

  let label = 'Очень слабый';
  let color = 'text-red-500';

  if (score === 5) {
    label = 'Отличный';
    color = 'text-green-500';
  } else if (score === 4) {
    label = 'Хороший';
    color = 'text-blue-500';
  } else if (score === 3) {
    label = 'Средний';
    color = 'text-yellow-500';
  } else if (score === 2) {
    label = 'Слабый';
    color = 'text-orange-500';
  }

  return { score, label, color, requirements };
};
