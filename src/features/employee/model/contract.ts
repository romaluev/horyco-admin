import * as z from 'zod';

export const employeeSchema = z.object({
  fullName: z.string({ message: 'Укажите имя' }).min(2, {
    message: 'Имя должно содержать минимум 2 символа'
  }),
  phone: z.string({ message: 'Укажите номер телефона' }).min(4),
  password: z.string({ message: 'Укажите пароль' }).min(4, {
    message: 'Пароль должен содержать минимум 4 символа'
  }),
  confirmPassword: z.string({ message: 'Повторите пароль' }),
  branchId: z.number({ message: 'Выберите продукт' })
});
