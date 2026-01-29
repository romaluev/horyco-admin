/**
 * Tax & Pricing Configuration API Client
 * Based on ADMIN_TAX_AND_PRICING.md specification
 */

import api from '@/shared/lib/axios'

import type {
  PricingConfig,
  TaxConfig,
  ServiceChargeConfig,
  CreateTaxRequest,
  CreateServiceChargeRequest,
  UpdateConfigRequest,
  ConfigListResponse,
  OrderCalculationRequest,
  OrderCalculationResponse,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

/**
 * Get all tax and service charge configs for a tenant/branch
 */
export const getConfigs = async (
  branchId?: number,
  tenantLevel: boolean = false
): Promise<ConfigListResponse> => {
  let url = '/admin/pricing/configs'
  if (tenantLevel) {
    url += '?tenantLevel=true'
  } else if (branchId) {
    url += `?branchId=${branchId}`
  }

  const response = await api.get<ApiResponse<ConfigListResponse>>(url)
  return response.data.data
}

/**
 * Get a specific config
 */
export const getConfig = async (configId: number): Promise<PricingConfig> => {
  const response = await api.get<ApiResponse<PricingConfig>>(
    `/admin/pricing/configs/${configId}`
  )
  return response.data.data
}

/**
 * Create a tax configuration
 */
export const createTax = async (data: CreateTaxRequest): Promise<TaxConfig> => {
  const response = await api.post<ApiResponse<TaxConfig>>(
    '/admin/pricing/taxes',
    data
  )
  return response.data.data
}

/**
 * Create a service charge configuration
 */
export const createServiceCharge = async (
  data: CreateServiceChargeRequest
): Promise<ServiceChargeConfig> => {
  const response = await api.post<ApiResponse<ServiceChargeConfig>>(
    '/admin/pricing/service-charges',
    data
  )
  return response.data.data
}

/**
 * Update a config
 */
export const updateConfig = async (
  configId: number,
  data: UpdateConfigRequest
): Promise<PricingConfig> => {
  const response = await api.patch<ApiResponse<PricingConfig>>(
    `/admin/pricing/configs/${configId}`,
    data
  )
  return response.data.data
}

/**
 * Delete a config
 */
export const deleteConfig = async (configId: number): Promise<void> => {
  await api.delete(`/admin/pricing/configs/${configId}`)
}

/**
 * Toggle config active/inactive
 */
export const toggleConfigStatus = async (
  configId: number,
  isActive: boolean
): Promise<PricingConfig> => {
  const response = await api.patch<ApiResponse<PricingConfig>>(
    `/admin/pricing/configs/${configId}`,
    { isActive }
  )
  return response.data.data
}

/**
 * Calculate taxes and service charges for an order
 */
export const calculateOrderPrice = async (
  data: OrderCalculationRequest
): Promise<OrderCalculationResponse> => {
  const response = await api.post<ApiResponse<OrderCalculationResponse>>(
    '/admin/pricing/calculate',
    data
  )
  return response.data.data
}

/**
 * Get tax rate for a specific order type
 */
export const getTaxRate = async (
  orderType: string,
  branchId?: number
): Promise<{ rate: number; configs: TaxConfig[] }> => {
  let url = `/admin/pricing/tax-rate?orderType=${orderType}`
  if (branchId) {
    url += `&branchId=${branchId}`
  }

  const response =
    await api.get<ApiResponse<{ rate: number; configs: TaxConfig[] }>>(url)
  return response.data.data
}

/**
 * Preview pricing calculation
 */
export const previewCalculation = async (
  subtotal: number,
  orderType: string,
  branchId?: number
): Promise<OrderCalculationResponse> => {
  const response = await api.post<ApiResponse<OrderCalculationResponse>>(
    '/admin/pricing/preview',
    {
      subtotal,
      orderType,
      branchId,
    }
  )
  return response.data.data
}
