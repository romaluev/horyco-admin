import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { employeeApi } from './api'
import { employeeKeys } from './query-keys'

import type {
  IChangePasswordDto,
  ICreateEmployeeDto,
  IUpdateEmployeeDto,
} from './types'

/**
 * Create new employee
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateEmployeeDto) => employeeApi.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      toast.success('Сотрудник успешно создан')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при создании сотрудника: ${error.message}`)
    },
  })
}

/**
 * Bulk import employees from CSV
 */
export const useBulkImportEmployees = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => employeeApi.bulkImportEmployees(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      if (result.failed === 0) {
        toast.success(`Успешно импортировано ${result.success} сотрудников`)
      } else {
        toast.warning(
          `Импортировано ${result.success} из ${result.total} сотрудников. ${result.failed} ошибок.`
        )
      }
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при импорте сотрудников: ${error.message}`)
    },
  })
}

/**
 * Update employee
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateEmployeeDto }) =>
      employeeApi.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      toast.success('Сотрудник успешно обновлен')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении сотрудника: ${error.message}`)
    },
  })
}

/**
 * Delete employee
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => employeeApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      toast.success('Сотрудник успешно удален')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при удалении сотрудника: ${error.message}`)
    },
  })
}

/**
 * Activate employee
 */
export const useActivateEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => employeeApi.activateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      toast.success('Сотрудник активирован')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при активации сотрудника: ${error.message}`)
    },
  })
}

/**
 * Deactivate employee
 */
export const useDeactivateEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => employeeApi.deactivateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      toast.success('Сотрудник деактивирован')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при деактивации сотрудника: ${error.message}`)
    },
  })
}

/**
 * Assign branches to employee
 */
export const useAssignBranches = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, branchIds }: { id: number; branchIds: number[] }) =>
      employeeApi.assignBranches(id, branchIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      toast.success('Филиалы успешно назначены')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при назначении филиалов: ${error.message}`)
    },
  })
}

/**
 * Set active branch for employee
 */
export const useSetActiveBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, branchId }: { id: number; branchId: number }) =>
      employeeApi.setActiveBranch(id, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      toast.success('Активный филиал установлен')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при установке активного филиала: ${error.message}`)
    },
  })
}

/**
 * Change employee password
 */
export const useChangePassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IChangePasswordDto }) =>
      employeeApi.changePassword(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all() })
      toast.success('Пароль успешно изменен')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при изменении пароля: ${error.message}`)
    },
  })
}
