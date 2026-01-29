/**
 * Operating Hours Store
 */

import { create } from 'zustand'

import * as operatingHoursApi from './api'

import type {
  OperatingHoursResponse,
  HolidaysResponse,
  Holiday,
  OperatingHoursRequest,
} from './types'

interface OperatingHoursState {
  operatingHours: OperatingHoursResponse | null
  holidays: HolidaysResponse | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchOperatingHours: (branchId: number) => Promise<void>
  updateOperatingHours: (
    branchId: number,
    data: OperatingHoursRequest
  ) => Promise<void>
  fetchHolidays: (branchId: number, year?: number) => Promise<void>
  createHoliday: (
    branchId: number,
    date: string,
    name: string,
    openTime?: string | null,
    closeTime?: string | null
  ) => Promise<void>
  deleteHoliday: (holidayId: number) => Promise<void>
  clearError: () => void
}

export const useOperatingHoursStore = create<OperatingHoursState>()((set) => ({
  operatingHours: null,
  holidays: null,
  isLoading: false,
  error: null,

  fetchOperatingHours: async (branchId: number) => {
    try {
      set({ isLoading: true, error: null })
      const data = await operatingHoursApi.getOperatingHours(branchId)
      set({ operatingHours: data, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch operating hours'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  updateOperatingHours: async (
    branchId: number,
    data: OperatingHoursRequest
  ) => {
    try {
      set({ isLoading: true, error: null })
      const result = await operatingHoursApi.updateOperatingHours(
        branchId,
        data
      )
      set({ operatingHours: result, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update operating hours'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  fetchHolidays: async (branchId: number, year?: number) => {
    try {
      set({ isLoading: true, error: null })
      const data = await operatingHoursApi.getHolidays(branchId, year)
      set({ holidays: data, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch holidays'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  createHoliday: async (
    branchId: number,
    date: string,
    name: string,
    openTime?: string | null,
    closeTime?: string | null
  ) => {
    try {
      set({ isLoading: true, error: null })
      const holiday = await operatingHoursApi.createHoliday(branchId, {
        date,
        name,
        openTime,
        closeTime,
      })
      set((state) => ({
        holidays: state.holidays
          ? {
              ...state.holidays,
              holidays: [...state.holidays.holidays, holiday],
            }
          : null,
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create holiday'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  deleteHoliday: async (holidayId: number) => {
    try {
      set({ isLoading: true, error: null })
      await operatingHoursApi.deleteHoliday(holidayId)
      set((state) => ({
        holidays: state.holidays
          ? {
              ...state.holidays,
              holidays: state.holidays.holidays.filter(
                (h) => h.id !== holidayId
              ),
            }
          : null,
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete holiday'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
