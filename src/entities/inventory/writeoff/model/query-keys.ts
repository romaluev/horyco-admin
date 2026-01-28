import type { IGetWriteoffsParams } from './types'

export const writeoffKeys = {
  all: ['writeoffs'] as const,
  lists: () => [...writeoffKeys.all, 'list'] as const,
  list: (params?: IGetWriteoffsParams) => [...writeoffKeys.lists(), params] as const,
  details: () => [...writeoffKeys.all, 'detail'] as const,
  detail: (id: number) => [...writeoffKeys.details(), id] as const,
}
