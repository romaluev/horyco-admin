/**
 * Template Selector Contract
 * Validation schemas for template application
 */

import { z } from 'zod';

/**
 * Apply template form schema
 */
export const applyTemplateFormSchema = z.object({
  templateId: z.number({
    required_error: 'Выберите шаблон'
  }),
  applyCategories: z.boolean().default(true),
  applyProducts: z.boolean().default(true),
  applyModifiers: z.boolean().default(true),
  applyAdditions: z.boolean().default(true),
  replaceExisting: z.boolean().default(false)
});

/**
 * Apply template form type
 */
export type ApplyTemplateFormValues = z.infer<typeof applyTemplateFormSchema>;
