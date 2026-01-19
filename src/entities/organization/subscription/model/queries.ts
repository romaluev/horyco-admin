/**
 * React Query hooks for subscription management
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import {
  getCurrentSubscription,
  getModuleCatalog,
  getInvoices,
  getInvoiceDetails,
  getPaymentHistory,
} from './api'
import { subscriptionKeys } from './query-keys'

import type {
  ISubscriptionDetails,
  IModuleCatalog,
  IInvoiceListResponse,
  IInvoiceDetails,
  IPaymentHistoryResponse,
} from './types'

/**
 * Cache configuration
 */
const FIVE_MINUTES_MS = 5 * 60 * 1000
const TEN_MINUTES_MS = 10 * 60 * 1000

/**
 * Hook to get current subscription details
 * Automatically refetches every 5 minutes
 *
 * @param enabled - Whether to enable the query
 * @returns Query result with subscription details
 */
export const useGetSubscription = (
  enabled = true
): UseQueryResult<ISubscriptionDetails> => {
  return useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: () => getCurrentSubscription(),
    enabled,
    staleTime: FIVE_MINUTES_MS,
    refetchInterval: FIVE_MINUTES_MS,
  })
}

/**
 * Hook to get module catalog
 * Lists all available plans, core modules, and add-ons
 *
 * @param enabled - Whether to enable the query
 * @returns Query result with module catalog
 */
export const useGetModuleCatalog = (
  enabled = true
): UseQueryResult<IModuleCatalog> => {
  return useQuery({
    queryKey: subscriptionKeys.moduleCatalog(),
    queryFn: () => getModuleCatalog(),
    enabled,
    staleTime: TEN_MINUTES_MS,
  })
}

/**
 * Hook to get invoice list with pagination
 *
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @param enabled - Whether to enable the query
 * @returns Query result with invoice list
 */
export const useGetInvoices = (
  page = 1,
  limit = 10,
  enabled = true
): UseQueryResult<IInvoiceListResponse> => {
  return useQuery({
    queryKey: subscriptionKeys.invoicesList(page, limit),
    queryFn: () => getInvoices(page, limit),
    enabled,
    staleTime: TEN_MINUTES_MS,
  })
}

/**
 * Hook to get detailed invoice information
 *
 * @param invoiceId - ID of invoice to fetch
 * @param enabled - Whether to enable the query
 * @returns Query result with invoice details
 */
export const useGetInvoiceDetails = (
  invoiceId: number | null,
  enabled = true
): UseQueryResult<IInvoiceDetails> => {
  return useQuery({
    queryKey: subscriptionKeys.invoiceDetails(invoiceId!),
    queryFn: () => getInvoiceDetails(invoiceId!),
    enabled: enabled && invoiceId !== null,
    staleTime: TEN_MINUTES_MS,
  })
}

/**
 * Hook to get payment history
 *
 * @param enabled - Whether to enable the query
 * @returns Query result with payment history
 */
export const useGetPaymentHistory = (
  enabled = true
): UseQueryResult<IPaymentHistoryResponse> => {
  return useQuery({
    queryKey: subscriptionKeys.payments(),
    queryFn: () => getPaymentHistory(),
    enabled,
    staleTime: TEN_MINUTES_MS,
  })
}
