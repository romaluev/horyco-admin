import * as z from 'zod'

export const hallFormSchema = z.object({
  branchId: z.number().min(1, 'Выберите филиал'),
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  capacity: z.number().min(1, 'Вместимость должна быть больше 0'),
  floor: z.number().int().min(1, 'Этаж должен быть больше 0'),
})

export type HallFormValues = z.infer<typeof hallFormSchema>
