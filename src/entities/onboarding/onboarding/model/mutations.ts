import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'

import { onboardingApi } from './api'
import { onboardingKeys } from './query-keys'

import type {
  BusinessInfoRequest,
  BusinessInfoResponse,
  BranchSetupRequest,
  BranchSetupResponse,
  MenuSetupRequest,
  MenuSetupResponse,
  StaffInviteRequest,
  StaffInviteResponse,
  CompleteOnboardingResponse,
  SkipStepRequest,
  SkipStepResponse,
} from './types'
import type { UseMutationOptions } from '@tanstack/react-query'

// Helper function to extract error message from unknown error type
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const errorObj = error as Record<string, unknown>
    const response = errorObj.response
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
      const data = response as Record<string, unknown>
      if ('message' in data && typeof data.message === 'string') {
        return data.message
      }
    }
  }
  return defaultMessage
}

// Submit business info
export const useSubmitBusinessInfo = (
  options?: Omit<
    UseMutationOptions<BusinessInfoResponse, Error, BusinessInfoRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BusinessInfoRequest) => {
      const result = await onboardingApi.submitBusinessInfo(data)
      // Wait for query invalidation to complete before returning
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() })
      return result
    },
    onSuccess: () => {
      toast.success('Информация о бизнесе сохранена')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Не удалось сохранить информацию'))
    },
    ...options,
  })
}

// Submit branch setup
export const useSubmitBranchSetup = (
  options?: Omit<
    UseMutationOptions<BranchSetupResponse, Error, BranchSetupRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BranchSetupRequest) => {
      const result = await onboardingApi.submitBranchSetup(data)
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() })
      return result
    },
    onSuccess: () => {
      toast.success('Филиал настроен')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Не удалось настроить филиал'))
    },
    ...options,
  })
}

// Submit menu setup
export const useSubmitMenuSetup = (
  options?: Omit<
    UseMutationOptions<MenuSetupResponse, Error, MenuSetupRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: MenuSetupRequest) => {
      const result = await onboardingApi.submitMenuSetup(data)
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() })
      return result
    },
    onSuccess: (data) => {
      toast.success(
        `Меню создано: ${data.categoriesCreated} категорий, ${data.productsCreated} блюд`
      )
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Не удалось создать меню'))
    },
    ...options,
  })
}

// Submit staff invite
export const useSubmitStaffInvite = (
  options?: Omit<
    UseMutationOptions<StaffInviteResponse, Error, StaffInviteRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: StaffInviteRequest) => {
      const result = await onboardingApi.submitStaffInvite(data)
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() })
      return result
    },
    onSuccess: (data) => {
      const count = data.progress.invitationsSent || 0
      toast.success(
        count > 0 ? `Отправлено ${count} приглашений` : 'Приглашения отправлены'
      )
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Не удалось отправить приглашения'))
    },
    ...options,
  })
}

// Complete onboarding
export const useCompleteOnboarding = (
  options?: Omit<
    UseMutationOptions<CompleteOnboardingResponse, Error, void>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const result = await onboardingApi.complete()
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() })
      return result
    },
    onSuccess: () => {
      toast.success('Onboarding completed successfully')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Не удалось завершить онбординг'))
    },
    ...options,
  })
}

// Skip step
export const useSkipStep = (
  options?: Omit<
    UseMutationOptions<SkipStepResponse, Error, SkipStepRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SkipStepRequest) => {
      const result = await onboardingApi.skipStep(data)
      await queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() })
      return result
    },
    onSuccess: () => {
      toast.info('Шаг пропущен')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Не удалось пропустить шаг'))
    },
    ...options,
  })
}
