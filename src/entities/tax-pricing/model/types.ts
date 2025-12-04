/**
 * Tax & Pricing Configuration Types
 * Based on ADMIN_TAX_AND_PRICING.md specification
 */

export type ConfigurationType = 'percentage' | 'fixed'
export type AppliesTo = 'subtotal' | 'subtotal_with_service_charge'
export type OrderType = 'dine_in' | 'takeaway' | 'delivery'
export type ConfigType = 'tax' | 'service_charge'

export interface TaxConfig {
  id: number
  tenantId: number
  branchId: number | null // null = tenant-level
  name: string
  description?: string
  type: ConfigurationType // 'percentage' | 'fixed'
  value: number // 15.0 for 15%, or 15000 for fixed amount
  isActive: boolean
  configType: 'tax' // Always 'tax' for tax configs
  orderTypes: OrderType[] // Which order types this applies to
  appliesTo: AppliesTo // What to calculate from
  createdAt: string
  updatedAt: string
}

export interface ServiceChargeConfig {
  id: number
  tenantId: number
  branchId: number | null // null = tenant-level
  name: string
  description?: string
  type: ConfigurationType
  value: number
  isActive: boolean
  configType: 'service_charge' // Always 'service_charge'
  orderTypes: OrderType[]
  appliesTo: AppliesTo
  createdAt: string
  updatedAt: string
}

export type PricingConfig = TaxConfig | ServiceChargeConfig

export interface CreateTaxRequest {
  name: string
  description?: string
  type: ConfigurationType
  value: number
  isActive?: boolean
  orderTypes: OrderType[]
  appliesTo?: AppliesTo
  branchId?: number
}

export interface CreateServiceChargeRequest {
  name: string
  description?: string
  type: ConfigurationType
  value: number
  isActive?: boolean
  orderTypes: OrderType[]
  appliesTo?: AppliesTo
  branchId?: number
}

export interface UpdateConfigRequest {
  name?: string
  description?: string
  value?: number
  isActive?: boolean
  orderTypes?: OrderType[]
  appliesTo?: AppliesTo
}

export interface ConfigListResponse {
  configs: PricingConfig[]
  total: number
}

export interface OrderCalculationRequest {
  subtotal: number
  orderType: OrderType
  branchId?: number
}

export interface CalculatedCharge {
  name: string
  type: ConfigurationType
  value: number
  amount: number // Calculated amount
  appliesTo: AppliesTo
}

export interface OrderCalculationResponse {
  subtotal: number
  charges: CalculatedCharge[] // All taxes and service charges
  total: number
  breakdown: {
    subtotal: number
    taxAmount: number
    serviceChargeAmount: number
    total: number
  }
}

// UI Form Data
export interface TaxConfigFormData {
  name: string
  description: string
  type: ConfigurationType
  value: number
  isActive: boolean
  orderTypes: OrderType[]
  appliesTo: AppliesTo
  isTenantLevel: boolean
}

export interface ServiceChargeFormData {
  name: string
  description: string
  type: ConfigurationType
  value: number
  isActive: boolean
  orderTypes: OrderType[]
  appliesTo: AppliesTo
  isTenantLevel: boolean
}
