/**
 * Purchase Order Entity Types
 * Based on Inventory Management System documentation
 */

export type POStatus = 'draft' | 'sent' | 'partial' | 'received' | 'cancelled'

export interface IPurchaseOrder {
  id: number
  warehouseId: number
  supplierId: number
  warehouseName: string
  supplierName: string
  poNumber: string
  status: POStatus
  orderDate: string
  expectedDate: string | null
  receivedDate: string | null
  subtotal: number
  discountAmount: number
  taxAmount: number
  totalAmount: number
  currency: string
  notes: string | null
  sentAt: string | null
  sentBy: number | null
  cancelledAt: string | null
  cancelledBy: number | null
  cancelReason: string | null
  createdAt: string
  updatedAt: string
  items?: IPurchaseOrderItem[]
  receives?: IPurchaseOrderReceive[]
}

export interface IPurchaseOrderItem {
  id: number
  purchaseOrderId: number
  itemId: number
  itemName: string
  itemUnit: string
  quantityOrdered: number
  quantityReceived: number
  unit: string
  unitPrice: number
  discountPct: number
  taxRate: number
  lineTotal: number
  notes: string | null
}

export interface IPurchaseOrderReceive {
  id: number
  purchaseOrderId: number
  receiveNumber: string
  receiveDate: string
  notes: string | null
  receivedBy: number
  createdAt: string
  items?: IPurchaseOrderReceiveItem[]
}

export interface IPurchaseOrderReceiveItem {
  id: number
  receiveId: number
  poItemId: number
  quantityReceived: number
  unitPrice: number
  notes: string | null
}

export interface ICreatePurchaseOrderDto {
  warehouseId: number
  supplierId: number
  orderDate: string
  expectedDate?: string
  discountAmount?: number
  taxAmount?: number
  currency?: string
  notes?: string
  items?: ICreatePOItemDto[]
}

export interface IUpdatePurchaseOrderDto {
  expectedDate?: string
  discountAmount?: number
  taxAmount?: number
  notes?: string
}

export interface ICreatePOItemDto {
  itemId: number
  quantityOrdered: number
  unit: string
  unitPrice: number
  discountPct?: number
  taxRate?: number
  notes?: string
}

export interface IUpdatePOItemDto {
  quantityOrdered?: number
  unit?: string
  unitPrice?: number
  discountPct?: number
  taxRate?: number
  notes?: string
}

export interface IReceivePODto {
  receiveDate: string
  receiveNumber?: string
  notes?: string
  items: IReceivePOItemDto[]
}

export interface IReceivePOItemDto {
  poItemId: number
  quantityReceived: number
  unitPrice?: number
  notes?: string
}

export interface ICancelPODto {
  reason: string
}

export interface IGetPurchaseOrdersParams {
  status?: POStatus
  supplierId?: number
  warehouseId?: number
  from?: string
  to?: string
}

export const PO_STATUS_LABELS: Record<POStatus, string> = {
  draft: 'Черновик',
  sent: 'Отправлен',
  partial: 'Частично получен',
  received: 'Получен',
  cancelled: 'Отменён',
}

export const PO_STATUS_COLORS: Record<POStatus, string> = {
  draft: 'secondary',
  sent: 'warning',
  partial: 'default',
  received: 'success',
  cancelled: 'destructive',
}
