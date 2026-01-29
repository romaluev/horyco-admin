import type { IViewDataParams, IViewsQueryParams } from './types'

export const viewKeys = {
  all: () => ['views'] as const,
  list: (params?: IViewsQueryParams) =>
    [...viewKeys.all(), 'list', params] as const,
  byId: (id: string) => [...viewKeys.all(), 'detail', id] as const,
  data: (params: IViewDataParams) =>
    [...viewKeys.all(), 'data', params] as const,
} as const
