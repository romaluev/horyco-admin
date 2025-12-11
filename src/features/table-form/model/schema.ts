import * as z from 'zod'

// Canvas dimensions from visual-floor-plan.tsx
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 800

export const tableFormSchema = z.object({
  hallId: z.number().min(1, 'Select a hall'),
  number: z.number().min(1, 'Table number is required'),
  capacity: z.number().min(1, 'Capacity must be greater than 0'),
  shape: z.enum(['round', 'square', 'rectangle', 'oval']),
  xPosition: z.number().min(0, 'X position must be at least 0').max(CANVAS_WIDTH, `X position cannot exceed ${CANVAS_WIDTH}`),
  yPosition: z.number().min(0, 'Y position must be at least 0').max(CANVAS_HEIGHT, `Y position cannot exceed ${CANVAS_HEIGHT}`),
  rotation: z.number().min(0).max(360),
})

export type TableFormValues = z.infer<typeof tableFormSchema>

export const tableShapes = [
  { value: 'round' as const, label: 'Round' },
  { value: 'square' as const, label: 'Square' },
  { value: 'rectangle' as const, label: 'Rectangle' },
  { value: 'oval' as const, label: 'Oval' },
]
