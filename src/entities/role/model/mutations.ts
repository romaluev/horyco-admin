import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { roleApi } from './api'
import { roleKeys } from './query-keys'

import type { IRoleCreateDto, IRoleUpdateDto } from './types'

/**
 * Create new role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IRoleCreateDto) => roleApi.createRole(_data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all() })
      toast.success('Роль успешно создана')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при создании роли: ${error.message}`)
    },
  })
}

/**
 * Update role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IRoleUpdateDto }) =>
      roleApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all() })
      toast.success('Роль успешно обновлена')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении роли: ${error.message}`)
    },
  })
}

/**
 * Delete role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => roleApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all() })
      toast.success('Роль успешно удалена')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при удалении роли: ${error.message}`)
    },
  })
}

/**
 * Add single permission to role
 */
export const useAddPermissionToRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: number
      permissionId: number
    }) => roleApi.addPermissionToRole(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all() })
      toast.success('Разрешение успешно добавлено')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при добавлении разрешения: ${error.message}`)
    },
  })
}

/**
 * Remove single permission from role
 */
export const useRemovePermissionFromRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: number
      permissionId: number
    }) => roleApi.removePermissionFromRole(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all() })
      toast.success('Разрешение успешно удалено')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при удалении разрешения: ${error.message}`)
    },
  })
}

/**
 * Replace all permissions in role
 */
export const useReplaceRolePermissions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: number
      permissionIds: number[]
    }) => roleApi.replaceRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all() })
      toast.success('Разрешения успешно обновлены')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении разрешений: ${error.message}`)
    },
  })
}
