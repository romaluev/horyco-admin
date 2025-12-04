import React, { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import * as api from './api'
import { useGetSubscription, useGetModuleCatalog, useGetInvoices, useGetPaymentHistory } from './queries'

// Mock API
jest.mock('./api')

const mockApi = api as jest.Mocked<typeof api>

// Setup QueryClient wrapper
const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }): React.ReactElement => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Subscription Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useGetSubscription', () => {
    it('should fetch subscription details successfully', async () => {
      const mockSubscription = {
        id: 1,
        status: 'active' as const,
        paymentFlow: 'manual' as const,
        manualPaymentType: 'cash' as const,
        currentPlan: {
          key: 'plan_core',
          name: 'Core Plan',
          description: 'Test plan',
          priceMonthly: 300000,
          pricePerLocation: true,
        },
        modules: [],
        billingPeriod: {
          currentPeriodStart: '2025-01-01T00:00:00.000Z',
          currentPeriodEnd: '2025-02-01T00:00:00.000Z',
          daysUntilRenewal: 5,
          billingInterval: 'monthly' as const,
          billingCycleAnchor: 1,
        },
        trial: {
          isInTrial: false,
          trialEndsAt: null,
          daysRemaining: 0,
        },
        locationCount: 3,
        locationCountOverride: false,
        requiresManualRenewal: true,
        cancelAtPeriodEnd: false,
        canceledAt: null,
        billingSummary: {
          subtotal: 900000,
          discount: 0,
          total: 900000,
        },
        createdAt: '2025-01-01T00:00:00.000Z',
      }

      mockApi.getCurrentSubscription.mockResolvedValue(mockSubscription)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useGetSubscription(true), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockSubscription)
      expect(mockApi.getCurrentSubscription).toHaveBeenCalled()
    })

    it('should not fetch when disabled', async () => {
      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useGetSubscription(false), { wrapper })

      await waitFor(() => {
        expect(result.current.isIdle || result.current.isPending).toBe(true)
      }, { timeout: 1000 })

      expect(mockApi.getCurrentSubscription).not.toHaveBeenCalled()
    })

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch subscription')
      mockApi.getCurrentSubscription.mockRejectedValue(error)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useGetSubscription(true), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeTruthy()
    })
  })

  describe('useGetModuleCatalog', () => {
    it('should fetch module catalog successfully', async () => {
      const mockCatalog = {
        plans: [],
        core: [],
        addons: [],
      }

      mockApi.getModuleCatalog.mockResolvedValue(mockCatalog)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useGetModuleCatalog(true), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockCatalog)
    })

    it('should not fetch when disabled', async () => {
      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useGetModuleCatalog(false), { wrapper })

      await waitFor(() => {
        expect(result.current.isIdle || result.current.isPending).toBe(true)
      }, { timeout: 1000 })

      expect(mockApi.getModuleCatalog).not.toHaveBeenCalled()
    })
  })

  describe('useGetInvoices', () => {
    it('should fetch invoices with pagination', async () => {
      const mockInvoices = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      }

      mockApi.getInvoices.mockResolvedValue(mockInvoices)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useGetInvoices(1, 10, true), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockInvoices)
      expect(mockApi.getInvoices).toHaveBeenCalledWith(1, 10)
    })
  })

  describe('useGetPaymentHistory', () => {
    it('should fetch payment history successfully', async () => {
      const mockPayments = {
        data: [],
        total: 0,
        summary: {
          totalPaid: 0,
          paymentsCount: 0,
          lastPaymentAt: new Date().toISOString(),
        },
      }

      mockApi.getPaymentHistory.mockResolvedValue(mockPayments)

      const wrapper = createQueryClientWrapper()
      const { result } = renderHook(() => useGetPaymentHistory(true), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockPayments)
    })
  })
})
