import React, { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { SubscriptionDashboard } from './subscription-dashboard'
import * as subscriptionQueries from '@/entities/subscription'

// Mock the useGetSubscription hook
jest.mock('@/entities/subscription', () => ({
  ...jest.requireActual('@/entities/subscription'),
  useGetSubscription: jest.fn(),
}))

const mockUseGetSubscription = subscriptionQueries.useGetSubscription as jest.MockedFunction<
  typeof subscriptionQueries.useGetSubscription
>

const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }): React.ReactElement => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

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
  modules: [
    {
      id: 5,
      key: 'crm',
      name: 'CRM Module',
      description: 'Customer relationship management',
      category: 'addon' as const,
      priceMonthly: 100000,
      isActive: true,
      isInTrial: true,
      trialEndsAt: '2025-02-03T00:00:00.000Z',
      daysRemainingInTrial: 7,
      enabledAt: '2025-01-27T00:00:00.000Z',
    },
  ],
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

describe('SubscriptionDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state', () => {
    mockUseGetSubscription.mockReturnValue({
      isLoading: true,
      isPending: true,
      isSuccess: false,
      isError: false,
      data: undefined,
      error: null,
    } as any)

    const wrapper = createQueryClientWrapper()
    render(<SubscriptionDashboard />, { wrapper })

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should render error state', () => {
    mockUseGetSubscription.mockReturnValue({
      isLoading: false,
      isPending: false,
      isSuccess: false,
      isError: true,
      data: undefined,
      error: new Error('Failed to fetch'),
    } as any)

    const wrapper = createQueryClientWrapper()
    render(<SubscriptionDashboard />, { wrapper })

    expect(screen.getByText(/Ошибка загрузки подписки/)).toBeInTheDocument()
  })

  it('should render subscription details', () => {
    mockUseGetSubscription.mockReturnValue({
      isLoading: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      data: mockSubscription,
      error: null,
    } as any)

    const wrapper = createQueryClientWrapper()
    render(<SubscriptionDashboard />, { wrapper })

    expect(screen.getByText('Core Plan')).toBeInTheDocument()
    expect(screen.getByText('Ручной платеж')).toBeInTheDocument()
    expect(screen.getByText('CRM Module')).toBeInTheDocument()
  })

  it('should display status badge', () => {
    mockUseGetSubscription.mockReturnValue({
      isLoading: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      data: mockSubscription,
      error: null,
    } as any)

    const wrapper = createQueryClientWrapper()
    render(<SubscriptionDashboard />, { wrapper })

    expect(screen.getByText('Активна')).toBeInTheDocument()
  })

  it('should display billing period information', () => {
    mockUseGetSubscription.mockReturnValue({
      isLoading: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      data: mockSubscription,
      error: null,
    } as any)

    const wrapper = createQueryClientWrapper()
    render(<SubscriptionDashboard />, { wrapper })

    expect(screen.getByText('Период биллинга')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // daysUntilRenewal
  })
})
