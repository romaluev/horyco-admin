import { z } from 'zod';

/**
 * Validation schema for role creation
 */
export const createRoleSchema = z.object({
  name: z.string().min(2, 'Название роли должно содержать минимум 2 символа'),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).min(1, 'Выберите хотя бы одно разрешение'),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;

/**
 * Validation schema for role update
 */
export const updateRoleSchema = z.object({
  name: z.string().min(2, 'Название роли должно содержать минимум 2 символа').optional(),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).min(1, 'Выберите хотя бы одно разрешение').optional(),
});

export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
