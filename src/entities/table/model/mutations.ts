import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { tableApi } from './api'
import { tableKeys } from './query-keys'

import type {
  ICreateTableDto,
  IUpdateTableDto,
  IUpdateTablePositionDto,
  ICloseSessionDto,
} from './types'

/**
 * Create a new table
 */
export const useCreateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateTableDto) => tableApi.createTable(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tableKeys.list(data.hallId) })
      toast.success('Table created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Error creating table: ${error.message}`)
    },
  })
}

/**
 * Update a table
 */
export const useUpdateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateTableDto }) =>
      tableApi.updateTable(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tableKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: tableKeys.list(data.hallId) })
      toast.success('Table updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Error updating table: ${error.message}`)
    },
  })
}

/**
 * Update table position (for drag & drop)
 */
export const useUpdateTablePosition = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateTablePositionDto }) =>
      tableApi.updateTablePosition(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tableKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: tableKeys.list(data.hallId) })
    },
    onError: (error: Error) => {
      toast.error(`Error updating table position: ${error.message}`)
    },
  })
}

/**
 * Delete a table
 */
export const useDeleteTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => tableApi.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() })
      toast.success('Table deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Error deleting table: ${error.message}`)
    },
  })
}

/**
 * Close table session
 */
export const useCloseSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ICloseSessionDto }) =>
      tableApi.closeSession(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: tableKeys.session(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: tableKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() })
      toast.success('Session closed successfully')
    },
    onError: (error: Error) => {
      toast.error(`Error closing session: ${error.message}`)
    },
  })
}
