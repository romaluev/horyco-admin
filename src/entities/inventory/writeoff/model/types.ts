/**
 * Writeoff Entity Types
 * Based on Inventory Management System documentation
 */

export type WriteoffReason =
  | 'spoilage'
  | 'theft'
  | 'damage'
  | 'staff_meal'
  | 'sample'
  | 'expired'
  | 'production'
  | 'other'

export type WriteoffStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface IWriteoff {
  id: number
  warehouseId: number
  warehouseName: string
  writeoffNumber: string
  reason: WriteoffReason
  status: WriteoffStatus
  totalValue: number
  itemCount?: number
  notes: string | null
  submittedAt: string | null
  submittedBy: number | null
  approvedAt: string | null
  approvedBy: number | null
  rejectedAt: string | null
  rejectedBy: number | null
  rejectReason: string | null
  createdAt: string
  updatedAt: string
  items?: IWriteoffItem[]
}

export interface IWriteoffItem {
  id: number
  writeoffId: number
  itemId: number
  itemName: string
  itemUnit: string
  quantity: number
  unitCost: number
  totalCost: number
  notes: string | null
}

export interface ICreateWriteoffDto {
  warehouseId: number
  reason: WriteoffReason
  notes?: string
  items?: ICreateWriteoffItemDto[]
}

export interface IUpdateWriteoffDto {
  reason?: WriteoffReason
  notes?: string
}

export interface ICreateWriteoffItemDto {
  itemId: number
  quantity: number
  notes?: string
}

export interface IUpdateWriteoffItemDto {
  quantity?: number
  notes?: string
}

export interface IRejectWriteoffDto {
  reason: string
}

export interface IGetWriteoffsParams {
  status?: WriteoffStatus
  reason?: WriteoffReason
  warehouseId?: number
  from?: string
  to?: string
}

export const WRITEOFF_REASON_LABELS: Record<WriteoffReason, string> = {
  spoilage: 'Порча',
  theft: 'Кража',
  damage: 'Повреждение',
  staff_meal: 'Питание персонала',
  sample: 'Дегустация',
  expired: 'Истёк срок',
  production: 'Производство',
  other: 'Другое',
}

export const WRITEOFF_STATUS_LABELS: Record<WriteoffStatus, string> = {
  draft: 'Черновик',
  pending: 'На согласовании',
  approved: 'Одобрено',
  rejected: 'Отклонено',
}
