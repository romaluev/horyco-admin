/**
 * Subscription Management Types
 * Based on ADMIN_SUBSCRIPTION_MANAGEMENT.md specification
 */

/**
 * Subscription status
 */
export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'suspended'
  | 'canceled'

/**
 * Payment flow type
 */
export type PaymentFlow = 'automated' | 'manual'

/**
 * Manual payment type
 */
export type ManualPaymentType = 'cash' | 'bank_transfer' | 'card'

/**
 * Module category
 */
export type ModuleCategory = 'plan' | 'core' | 'addon'

/**
 * Invoice status
 */
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void'

/**
 * Plan information
 */
export interface IPlan {
  key: string
  name: string
  description: string
  priceMonthly: number
  pricePerLocation: boolean
}

/**
 * Module information
 */
export interface IModule {
  id: number
  key: string
  name: string
  description?: string
  category: ModuleCategory
  priceMonthly: number
  isActive: boolean
  isInTrial: boolean
  trialEndsAt?: string
  daysRemainingInTrial?: number
  enabledAt: string
}

/**
 * Billing period information
 */
export interface IBillingPeriod {
  currentPeriodStart: string
  currentPeriodEnd: string
  daysUntilRenewal: number
  billingInterval: 'monthly' | 'annual'
  billingCycleAnchor: number
}

/**
 * Trial information
 */
export interface ITrial {
  isInTrial: boolean
  trialEndsAt: string | null
  daysRemaining: number
}

/**
 * Billing summary
 */
export interface IBillingSummary {
  subtotal: number
  discount: number
  total: number
}

/**
 * Current subscription details response
 */
export interface ISubscriptionDetails {
  id: number
  status: SubscriptionStatus
  paymentFlow: PaymentFlow
  manualPaymentType: ManualPaymentType
  currentPlan: IPlan
  modules: IModule[]
  billingPeriod: IBillingPeriod
  trial: ITrial
  locationCount: number
  locationCountOverride: boolean
  requiresManualRenewal: boolean
  cancelAtPeriodEnd: boolean
  canceledAt: string | null
  billingSummary: IBillingSummary
  createdAt: string
}

/**
 * Module catalog item
 */
export interface IModuleCatalogItem {
  id: number
  key: string
  name: string
  description?: string
  category: ModuleCategory
  priceMonthly: number
  pricePerLocation?: boolean
  trialDays?: number
  iconUrl?: string
  features?: string[]
  dependencies?: string[] | null
  isSubscribed: boolean
  canActivate: boolean
  activationBlockers?: string[]
}

/**
 * Module catalog response
 */
export interface IModuleCatalog {
  plans: IModuleCatalogItem[]
  core: IModuleCatalogItem[]
  addons: IModuleCatalogItem[]
}

/**
 * Add module request
 */
export interface IAddModuleRequest {
  moduleKey: string
  startTrial: boolean
}

/**
 * Add module response
 */
export interface IAddModuleResponse {
  success: boolean
  message: string
  data: {
    moduleId: number
    moduleKey: string
    isInTrial: boolean
    trialEndsAt: string
  }
}

/**
 * Invoice line item
 */
export interface IInvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

/**
 * Invoice summary
 */
export interface IInvoiceSummary {
  id: number
  invoiceNumber: string
  status: InvoiceStatus
  amountDue: number
  amountPaid: number
  periodStart: string
  periodEnd: string
  dueDate: string
  paidAt?: string
  invoicePdfUrl?: string
  createdAt: string
}

/**
 * Invoice details
 */
export interface IInvoiceDetails extends IInvoiceSummary {
  lineItems: IInvoiceLineItem[]
  isOverdue: boolean
  daysUntilDue: number | null
}

/**
 * Invoice list response
 */
export interface IInvoiceListResponse {
  data: IInvoiceSummary[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Payment record
 */
export interface IPaymentRecord {
  id: number
  paymentType: ManualPaymentType
  amountReceived: number
  receivedAt: string
  receiptNumber: string
  appliedToPeriodStart: string
  appliedToPeriodEnd: string
  isVerified: boolean
  verifiedBy: number
  notes?: string
  receiptFileId?: number
  receiptFileUrl?: string
  createdAt: string
}

/**
 * Payment summary
 */
export interface IPaymentSummary {
  totalPaid: number
  paymentsCount: number
  lastPaymentAt: string
}

/**
 * Payment history response
 */
export interface IPaymentHistoryResponse {
  data: IPaymentRecord[]
  total: number
  summary: IPaymentSummary
}

/**
 * Cancel subscription request
 */
export interface ICancelSubscriptionRequest {
  immediate: boolean
  reason?: string
}

/**
 * Cancel subscription response
 */
export interface ICancelSubscriptionResponse {
  success: boolean
  message: string
  data: {
    canceledAt: string | null
    cancelAtPeriodEnd: boolean
    effectiveEndDate: string
  }
}
