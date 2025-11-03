/**
 * Menu Template Query Keys
 * Query key factory for menu templates
 */

import type { IGetTemplatesParams } from './types'

/**
 * Query keys for menu templates
 */
export const menuTemplateKeys = {
  all: ['menu-templates'] as const,
  lists: () => [...menuTemplateKeys.all, 'list'] as const,
  list: (params?: IGetTemplatesParams) =>
    [...menuTemplateKeys.lists(), params] as const,
  details: () => [...menuTemplateKeys.all, 'detail'] as const,
  detail: (id: number) => [...menuTemplateKeys.details(), id] as const,
  businessTypes: () => [...menuTemplateKeys.all, 'business-types'] as const,
  byBusinessType: (type: string) =>
    [...menuTemplateKeys.all, 'business-type', type] as const,
}
