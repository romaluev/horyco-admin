export type TableShape = 'round' | 'square' | 'rectangle' | 'oval'

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'INACTIVE'

export interface ITablePosition {
  x: number
  y: number
  rotation: number
  width?: number
  height?: number
}

export interface ITable {
  id: number
  number: number
  capacity: number
  hallId: number
  hallName?: string
  position: ITablePosition
  shape: TableShape
  status: TableStatus
  hasActiveSession?: boolean
  qrCode?: string
  qrCodeUrl?: string
  metadata?: Record<string, unknown>
  isActive: boolean
  createdAt: string
  // Backend response fields (flat)
  xPosition: number | null
  yPosition: number | null
  rotation: number
  notes?: string | null
  updatedAt?: string
}

export interface ICreateTableDto {
  hallId: number
  number: number
  capacity: number
  xPosition: number
  yPosition: number
  rotation: number
  shape: TableShape
  metadata?: Record<string, unknown>
}

export interface IUpdateTableDto {
  number?: number
  capacity?: number
  shape?: TableShape
  metadata?: Record<string, unknown>
}

export interface IUpdateTablePositionDto {
  xPosition: number
  yPosition: number
  rotation: number
}

export interface ITableSession {
  hasActiveSession: boolean
  sessionId: number | null
  startedAt?: string
  guestCount?: number
  waiterName?: string
  orderCount?: number
  totalAmount?: number
  isPaid?: boolean
  canClose?: boolean
}

export interface ICloseSessionDto {
  reason: string
  finalizePayment?: boolean
}

export interface ICloseSessionResponse {
  sessionId: number
  closedAt: string
  duration: number
  totalAmount: number
  message: string
}
