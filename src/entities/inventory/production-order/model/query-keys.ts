import type { IGetProductionOrdersParams } from './types'

export const productionOrderKeys = {
  all: ['production-orders'] as const,
  lists: () => [...productionOrderKeys.all, 'list'] as const,
  list: (params?: IGetProductionOrdersParams) =>
    [...productionOrderKeys.lists(), params] as const,
  details: () => [...productionOrderKeys.all, 'detail'] as const,
  detail: (id: number) => [...productionOrderKeys.details(), id] as const,
}
