/**
 * Purchase Order Entity Types
 * Based on /api/admin/inventory/purchase-orders endpoints
 */

import { POStatus } from '@/shared/types/inventory'

export interface IPurchaseOrder {
  id: number
  tenantId: number
  branchId: number
  poNumber: string
  supplierId: number
  supplier?: {
    id: number
    name: string
    code?: string
  }
  warehouseId: number
  warehouse?: {
    id: number
    name: string
  }
  status: POStatus
  expectedDate?: string
  receivedDate?: string
  subtotal: number
  taxAmount: number
  total: number
  notes?: string
  items: IPurchaseOrderItem[]
  createdBy?: number
  createdByUser?: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
  // Convenience flat fields for list views
  supplierName?: string
  warehouseName?: string
  totalItems?: number
  totalAmount?: number
}

export interface IPurchaseOrderItem {
  id: number
  purchaseOrderId: number
  itemId: number
  item?: {
    id: number
    name: string
    sku?: string
    unit: string
  }
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  receivedQuantity: number
  actualPrice?: number
  // Convenience flat field
  inventoryItemName?: string
}

export interface ICreatePurchaseOrderDto {
  branchId: number
  supplierId: number
  warehouseId: number
  expectedDate?: string
  notes?: string
  items: ICreatePOItemDto[]
}

export interface IUpdatePurchaseOrderDto {
  expectedDate?: string
  notes?: string
}

export interface ICreatePOItemDto {
  itemId: number
  quantity: number
  unit: string
  unitPrice: number
}

export interface IUpdatePOItemDto {
  quantity?: number
  unit?: string
  unitPrice?: number
}

export interface IReceivePODto {
  receiveDate: string
  notes?: string
  items: IReceivePOItemDto[]
}

export interface IReceivePOItemDto {
  poItemId: number
  quantityReceived: number
  actualPrice?: number
}

export interface IGetPurchaseOrdersParams {
  branchId?: number
  status?: POStatus
  supplierId?: number
  warehouseId?: number
  from?: string
  to?: string
  page?: number
  limit?: number
}

// API returns purchase orders array directly
export type IPurchaseOrdersResponse = IPurchaseOrder[]
