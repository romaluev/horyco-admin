import type { IGetSuppliersParams, IGetPriceHistoryParams } from './types'

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (params?: IGetSuppliersParams) => [...supplierKeys.lists(), params] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: number) => [...supplierKeys.details(), id] as const,
  items: (id: number) => [...supplierKeys.detail(id), 'items'] as const,
  priceHistory: (id: number, params?: IGetPriceHistoryParams) =>
    [...supplierKeys.detail(id), 'price-history', params] as const,
}
