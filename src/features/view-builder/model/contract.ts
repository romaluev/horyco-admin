/**
 * View Builder Form Schemas
 * Zod validation schemas for view forms
 */

import { z } from 'zod'

import { Dataset, GroupBy, PeriodType, SortDirection } from '@/shared/api/graphql'

// ============================================
// FILTER SCHEMA
// ============================================

export const filterSchema = z.object({
  field: z.string().min(1, 'Поле обязательно'),
  operator: z.enum([
    'eq',
    'ne',
    'in',
    'notIn',
    'gt',
    'lt',
    'gte',
    'lte',
    'between',
    'contains',
    'isEmpty',
    'isNotEmpty',
  ]),
  value: z.unknown(),
})

export type FilterFormData = z.infer<typeof filterSchema>

// ============================================
// TIMEFRAME SCHEMA
// ============================================

export const timeframeSchema = z
  .object({
    type: z.nativeEnum(PeriodType),
    customStart: z.string().optional(),
    customEnd: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === PeriodType.CUSTOM) {
        return Boolean(data.customStart) && Boolean(data.customEnd)
      }
      return true
    },
    {
      message: 'Укажите даты для произвольного периода',
      path: ['customStart'],
    }
  )

export type TimeframeFormData = z.infer<typeof timeframeSchema>

// ============================================
// SORTING SCHEMA
// ============================================

export const sortingSchema = z.object({
  field: z.string().min(1, 'Поле сортировки обязательно'),
  direction: z.nativeEnum(SortDirection),
})

export type SortingFormData = z.infer<typeof sortingSchema>

// ============================================
// VIEW CONFIG SCHEMA
// ============================================

export const viewConfigSchema = z.object({
  timeframe: timeframeSchema,
  filters: z.array(filterSchema),
  columns: z.array(z.string()),
  groupBy: z.nativeEnum(GroupBy).optional(),
  sorting: sortingSchema,
  display: z.enum(['TABLE', 'CHART']),
})

export type ViewConfigFormData = z.infer<typeof viewConfigSchema>

// ============================================
// CREATE VIEW SCHEMA
// ============================================

export const createViewSchema = z.object({
  name: z
    .string()
    .min(2, 'Название должно содержать минимум 2 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  description: z.string().max(500, 'Описание не должно превышать 500 символов').optional(),
  pageCode: z.nativeEnum(Dataset),
  isPinned: z.boolean().optional(),
})

export type CreateViewFormData = z.infer<typeof createViewSchema>

// ============================================
// UPDATE VIEW SCHEMA
// ============================================

export const updateViewSchema = z.object({
  name: z
    .string()
    .min(2, 'Название должно содержать минимум 2 символа')
    .max(100, 'Название не должно превышать 100 символов')
    .optional(),
  isPinned: z.boolean().optional(),
  isShared: z.boolean().optional(),
})

export type UpdateViewFormData = z.infer<typeof updateViewSchema>
