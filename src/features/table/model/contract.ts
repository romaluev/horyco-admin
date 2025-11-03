import * as z from 'zod'

export const tableSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  size: z.coerce.number().min(1, 'Размер должен быть больше 0'),
  shape: z.string().min(1, 'Форма обязательна'),
  xPosition: z.coerce
    .number()
    .min(0, 'Позиция X должна быть больше или равна 0'),
  yPosition: z.coerce
    .number()
    .min(0, 'Позиция Y должна быть больше или равна 0'),
  hallId: z.coerce.number().min(1, 'Зал обязателен'),
  number: z.coerce.number().min(1),
  isAvailable: z.boolean(),
})
