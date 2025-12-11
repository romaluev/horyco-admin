/**
 * Operating Hours & Holidays API Client
 * Based on ADMIN_OPERATING_HOURS.md specification
 */

import api from '@/shared/lib/axios'

import type {
  OperatingHoursResponse,
  OperatingHoursRequest,
  HolidaysResponse,
  HolidayRequest,
  Holiday,
  CurrentStatusResponse,
} from './types'

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

/**
 * Get operating hours for a branch
 */
export const getOperatingHours = async (
  branchId: number
): Promise<OperatingHoursResponse> => {
  const response = await api.get<ApiResponse<OperatingHoursResponse>>(
    `/admin/operating-hours?branchId=${branchId}`
  )
  return response.data.data
}

/**
 * Update operating hours for a branch
 */
export const updateOperatingHours = async (
  branchId: number,
  data: OperatingHoursRequest
): Promise<OperatingHoursResponse> => {
  const response = await api.put<ApiResponse<OperatingHoursResponse>>(
    `/admin/operating-hours?branchId=${branchId}`,
    data
  )
  return response.data.data
}

/**
 * Get holidays for a branch
 */
export const getHolidays = async (
  branchId: number,
  year?: number
): Promise<HolidaysResponse> => {
  let url = `/admin/holidays?branchId=${branchId}`
  if (year) {
    url += `&year=${year}`
  }
  const response = await api.get<ApiResponse<HolidaysResponse>>(url)
  return response.data.data
}

/**
 * Create a holiday
 */
export const createHoliday = async (
  branchId: number,
  data: HolidayRequest
): Promise<Holiday> => {
  const response = await api.post<ApiResponse<Holiday>>(
    `/admin/holidays?branchId=${branchId}`,
    data
  )
  return response.data.data
}

/**
 * Update a holiday
 */
export const updateHoliday = async (
  holidayId: number,
  data: HolidayRequest
): Promise<Holiday> => {
  const response = await api.patch<ApiResponse<Holiday>>(
    `/admin/holidays/${holidayId}`,
    data
  )
  return response.data.data
}

/**
 * Delete a holiday
 */
export const deleteHoliday = async (holidayId: number): Promise<void> => {
  await api.delete(`/admin/holidays/${holidayId}`)
}

/**
 * Get current open/closed status for a branch
 */
export const getCurrentStatus = async (
  branchId: number
): Promise<CurrentStatusResponse> => {
  const response = await api.get<ApiResponse<CurrentStatusResponse>>(
    `/admin/operating-hours/status?branchId=${branchId}`
  )
  return response.data.data
}
