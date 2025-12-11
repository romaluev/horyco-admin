/**
 * React Query mutations for subscription management
 */

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'

import { addModule, removeModule, cancelSubscription } from './api'
import { subscriptionKeys } from './query-keys'

import type {
  IAddModuleRequest,
  IAddModuleResponse,
  ICancelSubscriptionRequest,
  ICancelSubscriptionResponse,
} from './types'

/**
 * Hook to add module to subscription
 * Shows toast on success/error and invalidates subscription cache
 *
 * @returns Mutation result for adding module
 */
export const useAddModule = (): UseMutationResult<
  IAddModuleResponse,
  Error,
  IAddModuleRequest
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: IAddModuleRequest) => addModule(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.moduleCatalog() })

      const message = data.data.isInTrial
        ? `Модуль добавлен (пробный период: 7 дней)`
        : 'Модуль добавлен'

      toast.success(message)
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`)
    },
  })
}

/**
 * Hook to remove module from subscription
 * Shows toast on success/error and invalidates subscription cache
 *
 * @returns Mutation result for removing module
 */
export const useRemoveModule = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (moduleKey: string) => removeModule(moduleKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.moduleCatalog() })
      toast.success('Модуль удален')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`)
    },
  })
}

/**
 * Hook to cancel subscription
 * Shows toast on success/error and invalidates subscription cache
 *
 * @returns Mutation result for canceling subscription
 */
export const useCancelSubscription = (): UseMutationResult<
  ICancelSubscriptionResponse,
  Error,
  ICancelSubscriptionRequest
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ICancelSubscriptionRequest) =>
      cancelSubscription(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() })
      toast.success('Подписка отменена')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`)
    },
  })
}
