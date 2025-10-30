import {
  useMutation,
  useQueryClient,
  UseMutationOptions
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { onboardingApi } from './api';
import { onboardingKeys } from './query-keys';
import type {
  BusinessInfoRequest,
  BusinessInfoResponse,
  BranchSetupRequest,
  BranchSetupResponse,
  ApplyMenuTemplateRequest,
  ApplyMenuTemplateResponse,
  StaffInviteRequest,
  StaffInviteResponse,
  CompleteOnboardingResponse,
  SkipStepRequest,
  SkipStepResponse
} from './types';

// Submit business info
export const useSubmitBusinessInfo = (
  options?: Omit<
    UseMutationOptions<BusinessInfoResponse, Error, BusinessInfoRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BusinessInfoRequest) =>
      onboardingApi.submitBusinessInfo(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success('Информация о бизнесе сохранена');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось сохранить информацию'
      );
    },
    ...options
  });
};

// Submit branch setup
export const useSubmitBranchSetup = (
  options?: Omit<
    UseMutationOptions<BranchSetupResponse, Error, BranchSetupRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchSetupRequest) =>
      onboardingApi.submitBranchSetup(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success('Филиал настроен');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось настроить филиал'
      );
    },
    ...options
  });
};

// Apply menu template
export const useApplyMenuTemplate = (
  options?: Omit<
    UseMutationOptions<
      ApplyMenuTemplateResponse,
      Error,
      ApplyMenuTemplateRequest
    >,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyMenuTemplateRequest) =>
      onboardingApi.applyMenuTemplate(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось применить шаблон'
      );
    },
    ...options
  });
};

// Submit staff invite
export const useSubmitStaffInvite = (
  options?: Omit<
    UseMutationOptions<StaffInviteResponse, Error, StaffInviteRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StaffInviteRequest) =>
      onboardingApi.submitStaffInvite(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      const count = data.progress.invitationsSent || 0;
      toast.success(
        count > 0 ? `Отправлено ${count} приглашений` : 'Приглашения отправлены'
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось отправить приглашения'
      );
    },
    ...options
  });
};

// Complete onboarding
export const useCompleteOnboarding = (
  options?: Omit<
    UseMutationOptions<CompleteOnboardingResponse, Error, void>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => onboardingApi.complete(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось завершить онбординг'
      );
    },
    ...options
  });
};

// Skip step
export const useSkipStep = (
  options?: Omit<
    UseMutationOptions<SkipStepResponse, Error, SkipStepRequest>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SkipStepRequest) => onboardingApi.skipStep(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.info('Шаг пропущен');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Не удалось пропустить шаг');
    },
    ...options
  });
};
