/**
 * React Query keys factory for subscription
 * Centralized query key management for cache invalidation
 */

export const subscriptionKeys = {
  all: ['subscription'] as const,
  current: () => [...subscriptionKeys.all, 'current'] as const,
  moduleCatalog: () => [...subscriptionKeys.all, 'modules', 'catalog'] as const,
  invoices: () => [...subscriptionKeys.all, 'invoices'] as const,
  invoicesList: (page: number, limit: number) => [
    ...subscriptionKeys.invoices(),
    'list',
    page,
    limit,
  ] as const,
  invoiceDetails: (invoiceId: number) => [
    ...subscriptionKeys.invoices(),
    invoiceId,
  ] as const,
  payments: () => [...subscriptionKeys.all, 'payments'] as const,
}
