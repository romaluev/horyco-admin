/**
 * Menu Template Queries
 * React Query hooks for fetching menu templates
 */

import { useQuery } from '@tanstack/react-query'

import { menuTemplateApi } from './api'
import { menuTemplateKeys } from './query-keys'

import type { IGetTemplatesParams } from './types'

/**
 * Get all menu templates with optional filters
 */
export const useGetTemplates = (params?: IGetTemplatesParams) => {
  return useQuery({
    queryKey: menuTemplateKeys.list(params),
    queryFn: () => menuTemplateApi.getTemplates(params),
  })
}

/**
 * Get a specific template by ID with full details
 */
export const useGetTemplateById = (id: number) => {
  return useQuery({
    queryKey: menuTemplateKeys.detail(id),
    queryFn: () => menuTemplateApi.getTemplateById(id),
    enabled: !!id,
  })
}

/**
 * Get business types
 */
export const useGetBusinessTypes = () => {
  return useQuery({
    queryKey: menuTemplateKeys.businessTypes(),
    queryFn: () => menuTemplateApi.getBusinessTypes(),
  })
}

/**
 * Get templates by business type
 */
export const useGetTemplatesByBusinessType = (type: string) => {
  return useQuery({
    queryKey: menuTemplateKeys.byBusinessType(type),
    queryFn: () => menuTemplateApi.getTemplatesByBusinessType(type),
    enabled: !!type,
  })
}
