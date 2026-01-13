import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { stockApi } from './api'
import { stockKeys } from './query-keys'

import type { IAdjustStockDto } from './types'

/**
 * Adjust stock level manually
 */
export const useAdjustStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IAdjustStockDto) => stockApi.adjustStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() })
      queryClient.invalidateQueries({ queryKey: stockKeys.all })
      toast.success('Остаток успешно скорректирован')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при корректировке остатка: ${error.message}`)
    },
  })
}

/**
 * Acknowledge a stock alert
 */
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => stockApi.acknowledgeAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.alerts() })
      toast.success('Уведомление подтверждено')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`)
    },
  })
}
