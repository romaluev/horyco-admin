/**
 * Branch Override Mutations
 * React Query mutation hooks for branch overrides
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { branchOverrideApi } from './api';
import { branchOverrideKeys } from './query-keys';

import type { IUpsertBranchOverrideDto } from './types';

/**
 * Upsert branch override (create or update)
 * Uses PATCH /admin/menu/products/:id/branches/:branchId
 */
export const useUpsertBranchOverride = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      branchId,
      data
    }: {
      productId: number;
      branchId: number;
      data: IUpsertBranchOverrideDto;
    }) => branchOverrideApi.upsertBranchOverride(productId, branchId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: branchOverrideKeys.product(variables.productId)
      });
      queryClient.invalidateQueries({
        queryKey: branchOverrideKeys.branch(variables.branchId)
      });
      toast.success('Настройки филиала обновлены');
    },
    onError: () => {
      toast.error('Не удалось обновить настройки филиала');
    }
  });
};

/**
 * Delete branch override (revert to base product settings)
 * Uses DELETE /admin/menu/products/:id/branches/:branchId
 */
export const useDeleteBranchOverride = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, branchId }: { productId: number; branchId: number }) =>
      branchOverrideApi.deleteBranchOverride(productId, branchId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: branchOverrideKeys.product(variables.productId)
      });
      queryClient.invalidateQueries({
        queryKey: branchOverrideKeys.branch(variables.branchId)
      });
      toast.success('Переопределение удалено, используются базовые настройки');
    },
    onError: () => {
      toast.error('Не удалось удалить переопределение');
    }
  });
};
