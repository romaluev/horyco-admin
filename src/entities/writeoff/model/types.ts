/**
 * Writeoff Entity Types
 * Types for inventory writeoff management
 */

import type { WriteoffReason, WriteoffStatus } from '@/shared/types/inventory'

export interface IWriteoffItem {
  id: number
  writeoffId: number
  inventoryItemId: number
  inventoryItemName: string
  inventoryItemSku: string | null
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
  createdAt: string
  updatedAt: string
}

export interface IWriteoff {
  id: number
  branchId: number
  warehouseId: number
  warehouseName: string
  reason: WriteoffReason
  status: WriteoffStatus
  notes: string | null
  totalItems: number
  totalCost: number
  createdById: number
  createdByName: string
  submittedAt: string | null
  approvedById: number | null
  approvedByName: string | null
  approvedAt: string | null
  rejectionReason: string | null
  items: IWriteoffItem[]
  createdAt: string
  updatedAt: string
}

export interface IWriteoffListItem {
  id: number
  branchId: number
  warehouseId: number
  warehouseName: string
  reason: WriteoffReason
  status: WriteoffStatus
  notes: string | null
  totalItems: number
  totalCost: number
  createdById: number
  createdByName: string
  submittedAt: string | null
  approvedById: number | null
  approvedByName: string | null
  approvedAt: string | null
  createdAt: string
  updatedAt: string
}

// DTOs

export interface ICreateWriteoffItemDto {
  inventoryItemId: number
  quantity: number
  unitCost?: number
}

export interface ICreateWriteoffDto {
  warehouseId: number
  reason: WriteoffReason
  notes?: string
  items: ICreateWriteoffItemDto[]
}

export interface IUpdateWriteoffItemDto {
  inventoryItemId?: number
  quantity?: number
  unitCost?: number
}

export interface IUpdateWriteoffDto {
  reason?: WriteoffReason
  notes?: string
}

export interface IAddWriteoffItemDto {
  inventoryItemId: number
  quantity: number
  unitCost?: number
}

export interface IRejectWriteoffDto {
  reason: string
}

// Query params

export interface IWriteoffListParams {
  warehouseId?: number
  status?: WriteoffStatus
  reason?: WriteoffReason
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}
