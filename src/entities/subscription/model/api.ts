/**
 * Subscription Management API Client
 * Based on ADMIN_SUBSCRIPTION_MANAGEMENT.md specification
 *
 * All endpoints under /admin/subscription
 * Uses any_branch mode - no branchId required
 */

import api from '@/shared/lib/axios'

import type {
  ISubscriptionDetails,
  IModuleCatalog,
  IAddModuleRequest,
  IAddModuleResponse,
  IInvoiceListResponse,
  IInvoiceDetails,
  IPaymentHistoryResponse,
  ICancelSubscriptionRequest,
  ICancelSubscriptionResponse,
} from './types'

/**
 * API Response wrapper from backend
 */
interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

/**
 * Get current subscription details
 * Uses any_branch mode - works across all branches
 *
 * @returns Promise with current subscription information
 */
export const getCurrentSubscription = async (): Promise<ISubscriptionDetails> => {
  const response = await api.get<ApiResponse<ISubscriptionDetails>>(
    '/admin/subscription/current'
  )
  return response.data.data
}

/**
 * Get available modules catalog
 * Lists all plans, core modules, and add-ons
 *
 * @returns Promise with module catalog grouped by category
 */
export const getModuleCatalog = async (): Promise<IModuleCatalog> => {
  const response = await api.get<ApiResponse<IModuleCatalog>>(
    '/admin/subscription/modules'
  )
  return response.data.data
}

/**
 * Add module to subscription
 * Requires subscription:modules permission
 *
 * @param request - Module key and trial start flag
 * @returns Promise with module activation response
 */
export const addModule = async (
  request: IAddModuleRequest
): Promise<IAddModuleResponse> => {
  const response = await api.post<IAddModuleResponse>(
    '/admin/subscription/modules',
    request
  )
  return response.data
}

/**
 * Remove module from subscription
 * Requires subscription:modules permission
 * Cannot remove plan or core modules
 *
 * @param moduleKey - Key of module to remove
 * @returns Promise that resolves on success
 */
export const removeModule = async (moduleKey: string): Promise<void> => {
  await api.delete(`/admin/subscription/modules/${moduleKey}`)
}

/**
 * Get invoice history with pagination
 * Requires subscription:invoices permission
 *
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @returns Promise with paginated invoice list
 */
export const getInvoices = async (
  page = 1,
  limit = 10
): Promise<IInvoiceListResponse> => {
  const response = await api.get<ApiResponse<IInvoiceListResponse>>(
    '/admin/subscription/invoices',
    {
      params: { page, limit },
    }
  )
  return response.data.data
}

/**
 * Get detailed invoice information
 * Requires subscription:invoices permission
 *
 * @param invoiceId - ID of invoice
 * @returns Promise with detailed invoice information
 */
export const getInvoiceDetails = async (invoiceId: number): Promise<IInvoiceDetails> => {
  const response = await api.get<ApiResponse<IInvoiceDetails>>(
    `/admin/subscription/invoices/${invoiceId}`
  )
  return response.data.data
}

/**
 * Get payment history for manual subscriptions
 * Requires subscription:invoices permission
 * Shows cash/bank transfer payment records
 *
 * @returns Promise with payment history and summary
 */
export const getPaymentHistory = async (): Promise<IPaymentHistoryResponse> => {
  const response = await api.get<ApiResponse<IPaymentHistoryResponse>>(
    '/admin/subscription/payments'
  )
  return response.data.data
}

/**
 * Cancel subscription
 * Requires subscription:modules permission
 *
 * @param request - Cancellation details (immediate or at period end)
 * @returns Promise with cancellation confirmation
 */
export const cancelSubscription = async (
  request: ICancelSubscriptionRequest
): Promise<ICancelSubscriptionResponse> => {
  const response = await api.post<ICancelSubscriptionResponse>(
    '/admin/subscription/cancel',
    request
  )
  return response.data
}
