/**
 * Supplier Entity Types
 * Based on /api/admin/inventory/suppliers endpoints
 */

export interface ISupplier {
  id: number
  tenantId: number
  name: string
  code?: string
  legalName?: string
  taxId?: string
  contactName?: string
  phone?: string
  email?: string
  address?: string
  paymentTerms?: string
  leadTimeDays?: number
  minimumOrder?: number
  notes?: string
  isActive: boolean
  totalOrders?: number
  totalSpent?: number
  createdAt: string
  updatedAt: string
  // Convenience flat field for list views
  itemCount?: number
}

export interface ISupplierItem {
  id: number
  supplierId: number
  itemId: number
  item?: {
    id: number
    name: string
    sku?: string
    unit: string
  }
  supplierSku?: string
  unitPrice: number
  minOrderQuantity?: number
  isPreferred: boolean
  lastOrderDate?: string
  createdAt: string
  updatedAt: string
}

export interface ISupplierPriceHistory {
  id: number
  supplierId: number
  itemId: number
  item?: {
    id: number
    name: string
  }
  oldPrice: number
  newPrice: number
  changedAt: string
  changedBy?: number
}

export interface ICreateSupplierDto {
  name: string
  code?: string
  legalName?: string
  taxId?: string
  contactName?: string
  phone?: string
  email?: string
  address?: string
  paymentTerms?: string
  leadTimeDays?: number
  minimumOrder?: number
  notes?: string
  isActive?: boolean
}

export interface IUpdateSupplierDto {
  name?: string
  code?: string
  legalName?: string
  taxId?: string
  contactName?: string
  phone?: string
  email?: string
  address?: string
  paymentTerms?: string
  leadTimeDays?: number
  minimumOrder?: number
  notes?: string
  isActive?: boolean
}

export interface ICreateSupplierItemDto {
  itemId: number
  supplierSku?: string
  unitPrice: number
  minOrderQuantity?: number
  isPreferred?: boolean
}

export interface IUpdateSupplierItemDto {
  supplierSku?: string
  unitPrice?: number
  minOrderQuantity?: number
  isPreferred?: boolean
}

export interface IGetSuppliersParams {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
}

// API returns suppliers array directly
export type ISuppliersResponse = ISupplier[]

export interface IGetPriceHistoryParams {
  itemId?: number
  from?: string
  to?: string
  page?: number
  limit?: number
}

// API returns price history array directly
export type IPriceHistoryResponse = ISupplierPriceHistory[]
