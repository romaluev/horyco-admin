/**
 * Operating Hours Management Types
 */

export interface OperatingHour {
  id?: number
  dayOfWeek: number // 0=Sunday, 1=Monday, ..., 6=Saturday
  dayName: string
  openTime: string | null // HH:MM format
  closeTime: string | null // HH:MM format
  isClosed: boolean
}

export interface OperatingHoursResponse {
  branchId: number
  hours: OperatingHour[]
}

export interface OperatingHoursRequest {
  hours: OperatingHour[]
}

export interface HolidayRequest {
  date: string // YYYY-MM-DD
  name: string
  openTime?: string | null // null = fully closed
  closeTime?: string | null
  description?: string
}

export interface Holiday {
  id: number
  branchId: number
  date: string
  name: string
  openTime: string | null
  closeTime: string | null
  isClosed: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface HolidaysResponse {
  branchId: number
  holidays: Holiday[]
}

export interface CurrentStatusResponse {
  branchId: number
  isOpen: boolean
  nextOpenTime?: string
  nextCloseTime?: string
  currentDay: string
  currentTime: string
}
