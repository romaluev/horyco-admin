/**
 * React Query hooks for onboarding WRITE operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { onboardingApi } from './api';
import { onboardingKeys } from './query-keys';
import type {
  BusinessInfoRequest,
  BranchSetupRequest,
  MenuTemplateRequest,
  PaymentSetupRequest,
  StaffInviteRequest,
  SkipStepRequest
} from './types';

/**
 * Submit business information (Step 2)
 */
export const useSubmitBusinessInfo = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: BusinessInfoRequest) =>
      onboardingApi.submitBusinessInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success('Информация о бизнесе сохранена');
      router.push('/onboarding/branch-setup');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось сохранить данные'
      );
    }
  });
};

/**
 * Submit branch setup (Step 3)
 */
export const useSubmitBranchSetup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: BranchSetupRequest) =>
      onboardingApi.submitBranchSetup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success('Филиал настроен');
      router.push('/onboarding/menu-template');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось сохранить настройки'
      );
    }
  });
};

/**
 * Submit menu template selection (Step 4)
 */
export const useSubmitMenuTemplate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: MenuTemplateRequest) =>
      onboardingApi.submitMenuTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success('Меню успешно создано');
      router.push('/onboarding/payment-setup');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось применить шаблон'
      );
    }
  });
};

/**
 * Submit payment setup (Step 5 - Optional)
 */
export const useSubmitPaymentSetup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: PaymentSetupRequest) =>
      onboardingApi.submitPaymentSetup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success('Способы оплаты настроены');
      router.push('/onboarding/staff-invite');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось сохранить настройки'
      );
    }
  });
};

/**
 * Submit staff invitations (Step 6 - Optional)
 */
export const useSubmitStaffInvite = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: StaffInviteRequest) =>
      onboardingApi.submitStaffInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success('Приглашения отправлены');
      router.push('/onboarding/complete');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось отправить приглашения'
      );
    }
  });
};

/**
 * Complete onboarding (Step 7)
 */
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => onboardingApi.complete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.success('Поздравляем! Система готова к работе');
      // Navigation handled by complete page
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось завершить настройку'
      );
    }
  });
};

/**
 * Skip an optional step
 */
export const useSkipStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SkipStepRequest) => onboardingApi.skipStep(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingKeys.progress() });
      toast.info('Шаг пропущен');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Не удалось пропустить шаг');
    }
  });
};
