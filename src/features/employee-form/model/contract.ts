import { z } from 'zod'

/**
 * Validation schema for employee creation
 */
export const createEmployeeSchema = z.object({
  // Step 1: Basic Info
  fullName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, 'Введите номер в формате +998XXXXXXXXX'),
  email: z.string().email('Неверный формат email').optional().or(z.literal('')),
  birthDate: z.string().optional(),
  hireDate: z.string().optional(),
  notes: z.string().optional(),

  // Step 2: Roles
  roleIds: z.array(z.number()).min(1, 'Выберите хотя бы одну роль'),

  // Step 3: Branches
  branchIds: z.array(z.number()).min(1, 'Выберите хотя бы один филиал'),
  activeBranchId: z.number({
    required_error: 'Выберите активный филиал',
  }),

  // Credentials
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>

/**
 * Validation schema for employee update
 */
export const updateEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .optional(),
  email: z.string().email('Неверный формат email').optional().or(z.literal('')),
  birthDate: z.string().optional(),
  hireDate: z.string().optional(),
  notes: z.string().optional(),
  roleIds: z.array(z.number()).min(1, 'Выберите хотя бы одну роль').optional(),
  branchIds: z
    .array(z.number())
    .min(1, 'Выберите хотя бы один филиал')
    .optional(),
  activeBranchId: z.number().optional(),
})

export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>

/**
 * Step-by-step schemas for create form
 */
export const basicInfoSchema = createEmployeeSchema.pick({
  fullName: true,
  phone: true,
  email: true,
  birthDate: true,
  hireDate: true,
  notes: true,
  password: true,
})

export const rolesSchema = createEmployeeSchema.pick({
  roleIds: true,
})

export const branchesSchema = createEmployeeSchema.pick({
  branchIds: true,
  activeBranchId: true,
})
