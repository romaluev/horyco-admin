import * as z from 'zod';

export const profileSchema = z
  .object({
    fullName: z.string().min(2, {
      message: 'Имя должно содержать минимум 2 символа'
    }),
    password: z
      .string()
      .min(8, {
        message: 'Пароль должен содержать минимум 8 символов'
      })
      .optional(),
    confirmPassword: z.string().optional()
  })
  .refine(
    (data) => {
      if (!data.password) return true;
      return data.password === data.confirmPassword;
    },
    {
      message: 'Пароли не совпадают',
      path: ['confirmPassword']
    }
  );
