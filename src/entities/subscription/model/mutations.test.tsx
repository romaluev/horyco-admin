import React, { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

import * as api from './api'
import { useAddModule, useRemoveModule, useCancelSubscription } from './mutations'

// Mock API and toast
jest.mock('./api')
jest.mock('sonner')

const mockApi = api as jest.Mocked<typeof api>
const mockToast = toast as jest.Mocked<typeof toast>

// Setup QueryClient wrapper
const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }): React.ReactElement => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Subscription Mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useAddModule', () => {
    it('should add module and show success toast', async () => {
      const mockResponse = {
        success: true,
        message: 'Module added',
        data: {
          moduleId: 5,
          moduleKey: 'crm',
          isInTrial: true,
          trialEndsAt: '2025-02-03T00:00:00.000Z',
        },
      }

      mockApi.addModule.mockResolvedValue(mockResponse)
      mockToast.success.mockImplementation(() => undefined)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useAddModule(), { wrapper })

      result.current.mutate({ moduleKey: 'crm', startTrial: true })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(mockToast.success).toHaveBeenCalled()
    })

    it('should handle add module error', async () => {
      const error = new Error('Module already subscribed')
      mockApi.addModule.mockRejectedValue(error)
      mockToast.error.mockImplementation(() => undefined)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useAddModule(), { wrapper })

      result.current.mutate({ moduleKey: 'crm', startTrial: true })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(mockToast.error).toHaveBeenCalled()
    })
  })

  describe('useRemoveModule', () => {
    it('should remove module and show success toast', async () => {
      mockApi.removeModule.mockResolvedValue(undefined)
      mockToast.success.mockImplementation(() => undefined)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useRemoveModule(), { wrapper })

      result.current.mutate('crm')

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockApi.removeModule).toHaveBeenCalledWith('crm')
      expect(mockToast.success).toHaveBeenCalledWith('Модуль удален')
    })

    it('should handle remove module error', async () => {
      const error = new Error('Cannot remove core module')
      mockApi.removeModule.mockRejectedValue(error)
      mockToast.error.mockImplementation(() => undefined)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useRemoveModule(), { wrapper })

      result.current.mutate('core_pos')

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(mockToast.error).toHaveBeenCalled()
    })
  })

  describe('useCancelSubscription', () => {
    it('should cancel subscription and show success toast', async () => {
      const mockResponse = {
        success: true,
        message: 'Subscription cancelled',
        data: {
          canceledAt: null,
          cancelAtPeriodEnd: true,
          effectiveEndDate: '2025-02-01T00:00:00.000Z',
        },
      }

      mockApi.cancelSubscription.mockResolvedValue(mockResponse)
      mockToast.success.mockImplementation(() => undefined)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useCancelSubscription(), { wrapper })

      result.current.mutate({ immediate: false, reason: 'Test' })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockResponse)
      expect(mockToast.success).toHaveBeenCalledWith('Подписка отменена')
    })

    it('should handle cancel subscription error', async () => {
      const error = new Error('Cannot cancel active subscription')
      mockApi.cancelSubscription.mockRejectedValue(error)
      mockToast.error.mockImplementation(() => undefined)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useCancelSubscription(), { wrapper })

      result.current.mutate({ immediate: false })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(mockToast.error).toHaveBeenCalled()
    })
  })
})
