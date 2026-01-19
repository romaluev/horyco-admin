/**
 * Supplier Entity Types
 * Based on Inventory Management System documentation
 */

export interface ISupplier {
  id: number
  name: string
  code: string | null
  legalName: string | null
  taxId: string | null
  contactName: string | null
  phone: string | null
  email: string | null
  address: string | null
  bankName: string | null
  bankAccount: string | null
  paymentTerms: string | null
  leadTimeDays: number
  minimumOrder: number | null
  isActive: boolean
  isPreferred?: boolean
  notes: string | null
  itemCount: number
  totalOrders: number
  totalAmount: number
  lastOrderAt: string | null
  averageOrderValue: number
  createdAt: string
  updatedAt: string
  items?: ISupplierItem[]
}

export interface ISupplierItem {
  id: number
  supplierId: number
  itemId: number
  itemName: string
  itemUnit: string
  supplierSku: string | null
  unitPrice: number
  minOrderQuantity: number
  isPreferred: boolean
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface IPriceHistory {
  id: number
  supplierId: number
  itemId: number
  itemName: string
  oldPrice: number
  newPrice: number
  priceChange: number
  priceChangePct: number
  effectiveDate: string
  source: string
  purchaseOrderId: number | null
  notes: string | null
  createdAt: string
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
  bankName?: string
  bankAccount?: string
  paymentTerms?: string
  leadTimeDays?: number
  minimumOrder?: number
  isActive?: boolean
  notes?: string
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
  bankName?: string
  bankAccount?: string
  paymentTerms?: string
  leadTimeDays?: number
  minimumOrder?: number
  isActive?: boolean
  notes?: string
}

export interface IGetSuppliersParams {
  isActive?: boolean
  search?: string
}

export interface ICreateSupplierItemDto {
  itemId: number
  supplierSku?: string
  unitPrice: number
  minOrderQuantity?: number
  isPreferred?: boolean
  notes?: string
}

export interface IUpdateSupplierItemDto {
  supplierSku?: string
  unitPrice?: number
  minOrderQuantity?: number
  isPreferred?: boolean
  notes?: string
}

export interface IGetPriceHistoryParams {
  itemId?: number
}
