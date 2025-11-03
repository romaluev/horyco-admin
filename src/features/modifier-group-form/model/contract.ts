/**
 * Modifier Group Form Contract
 * Zod validation schemas for modifier group forms
 */

import { z } from 'zod';

/**
 * Schema for creating/updating a modifier group
 */
export const modifierGroupSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  isRequired: z.boolean().default(false),
  minSelection: z.number().min(0).default(0),
  maxSelection: z.number().min(1).default(1),
  sortOrder: z.number().min(0).default(0)
});

export type ModifierGroupFormValues = z.infer<typeof modifierGroupSchema>;

/**
 * Schema for creating/updating a modifier
 */
export const modifierSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  price: z.number().min(0, 'Цена должна быть положительной'),
  modifierGroupId: z.number().positive('ID группы обязателен'),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true)
});

export type ModifierFormValues = z.infer<typeof modifierSchema>;
