import * as z from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/shared/config/data';

export type ProductFormValues = {
  name: string;
  productTypeId: number;
  status: string;
  price?: number;
  stock?: number;
  description: string;
  additions: z.infer<typeof additionSchema>[];
  image?: File[];
};

const additionProductSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: 'Название элемента обязательно' }),
  price: z
    .number()
    .min(0, { message: 'Цена должна быть положительным числом' }),
  additionId: z.number().optional(),
  isDeleted: z.boolean().optional()
});

const additionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'Название дополнения должно содержать минимум 2 символа'
  }),
  isRequired: z.boolean(),
  isMultiple: z.boolean(),
  limit: z.number().min(1, { message: 'Лимит должен быть не менее 1' }),
  additionProducts: z.array(additionProductSchema).min(1),
  productId: z.number().optional(),
  isDeleted: z.boolean().optional()
});

export const productSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length, 'Добавьте картинки к продукту')
    .refine((files) => {
      if (!files?.length) return true;
      return files[0]?.size <= MAX_FILE_SIZE;
    }, 'Максимальный размер файла 5MB.')
    .refine((files) => {
      if (!files?.length) return true;
      const file = files[0];
      return (
        ACCEPTED_IMAGE_TYPES.includes(file?.type) ||
        ACCEPTED_IMAGE_TYPES.includes(file?.mimeType)
      );
    }, 'Допускаются файлы .jpg, .jpeg, .png и .webp'),
  name: z.string().min(2, {
    message: 'Название должно содержать минимум 2 символа'
  }),
  productTypeId: z.number().min(1, { message: 'Укажите тип продукта' }),
  status: z.string(),
  price: z.number({ message: 'Укажите цену' }),
  stock: z.number({ message: 'Укажите количество' }),
  description: z.string(),
  additions: z.array(additionSchema).optional().default([])
});
