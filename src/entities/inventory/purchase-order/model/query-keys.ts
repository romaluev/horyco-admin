import type { IGetPurchaseOrdersParams } from './types'

export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  lists: () => [...purchaseOrderKeys.all, 'list'] as const,
  list: (params?: IGetPurchaseOrdersParams) =>
    [...purchaseOrderKeys.lists(), params] as const,
  details: () => [...purchaseOrderKeys.all, 'detail'] as const,
  detail: (id: number) => [...purchaseOrderKeys.details(), id] as const,
}
