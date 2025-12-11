/**
 * React Query mutations for PIN management
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { generatePin, refreshOwnPin, togglePinEnabled } from './api'
import { pinKeys } from './query-keys'

/**
 * Hook to generate PIN for an employee
 * Invalidates PIN status cache on success
 */
export const useGeneratePin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (employeeId: number) => generatePin(employeeId),
    onSuccess: (_, employeeId) => {
      // Invalidate PIN status cache
      queryClient.invalidateQueries({ queryKey: pinKeys.status(employeeId) })
    },
    onError: (error: Error) => {
      console.error('Generate PIN error:', error)
      toast.error(error.message || 'Не удалось сгенерировать PIN')
    },
  })
}

/**
 * Hook to refresh own PIN (self-service)
 */
export const useRefreshOwnPin = () => {
  return useMutation({
    mutationFn: (currentPassword: string) => refreshOwnPin(currentPassword),
    onSuccess: () => {
      toast.success('PIN успешно обновлен')
    },
    onError: (error: Error) => {
      console.error('Refresh PIN error:', error)
      toast.error(error.message || 'Не удалось обновить PIN')
    },
  })
}

/**
 * Hook to toggle PIN enabled status
 */
export const useTogglePinEnabled = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ employeeId, enabled }: { employeeId: number; enabled: boolean }) =>
      togglePinEnabled(employeeId, enabled),
    onSuccess: (data, { employeeId, enabled }) => {
      queryClient.invalidateQueries({ queryKey: pinKeys.status(employeeId) })
      // Update cache with returned data
      queryClient.setQueryData(pinKeys.status(employeeId), data)
      toast.success(
        enabled
          ? 'PIN аутентификация включена'
          : 'PIN аутентификация отключена'
      )
    },
    onError: (error: Error) => {
      console.error('Toggle PIN error:', error)
      toast.error(error.message || 'Не удалось изменить статус PIN')
    },
  })
}
