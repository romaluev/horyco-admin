/**
 * Stock Mutation Hooks
 * TanStack React Query hooks for modifying stock data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stockApi } from './api'
import { stockKeys } from './query-keys'
import type { IStockAdjustmentDto } from './types'

// Import movement keys for invalidation
import { stockMovementKeys } from '../../stock-movement/model/query-keys'

export const useAdjustStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IStockAdjustmentDto) => stockApi.adjustStock(data),
    onSuccess: (_, variables) => {
      // Invalidate stock queries
      queryClient.invalidateQueries({ queryKey: stockKeys.all() })
      // Invalidate movements since adjustment creates a movement
      queryClient.invalidateQueries({ queryKey: stockMovementKeys.all() })
      toast.success('Остаток успешно скорректирован')
    },
    onError: (error: Error) => {
      toast.error('Ошибка при корректировке остатка')
      console.error('Adjust stock error:', error)
    },
  })
}
