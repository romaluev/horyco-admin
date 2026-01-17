/**
 * GraphQL Client with automatic authentication
 */

import {
  GraphQLClient,
  ClientError,
  type RequestDocument,
  type Variables,
} from 'graphql-request'

import { BASE_API_URL } from '@/shared/lib/axios'
import { getAccessToken, refreshAccessToken } from '@/shared/lib/token-manager'

// ============================================================================
// Configuration
// ============================================================================

const GRAPHQL_ENDPOINT = `${(BASE_API_URL ?? '').replace(/\/$/, '')}/graphql`

// ============================================================================
// Auth Error Detection
// ============================================================================

interface GraphQLError {
  message: string
  extensions?: {
    code?: string
    originalError?: { statusCode?: number }
  }
}

const isAuthError = (error: unknown): boolean => {
  if (!(error instanceof ClientError)) return false

  if (error.response.status === 401) return true

  // GraphQL can return 200 with UNAUTHENTICATED in body
  const errors = error.response.errors as GraphQLError[] | undefined
  return (
    errors?.some(
      (err) =>
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.extensions?.originalError?.statusCode === 401 ||
        err.message === 'Unauthorized'
    ) ?? false
  )
}

// ============================================================================
// Client Factory
// ============================================================================

const createClient = (): GraphQLClient => {
  const token = getAccessToken()

  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
}

// ============================================================================
// Request Executor
// ============================================================================

async function handleAuthErrorRetry<T>(
  document: RequestDocument,
  variables?: Variables
): Promise<T> {
  try {
    await refreshAccessToken(BASE_API_URL ?? '')
    return await graphqlRequest<T>(document, variables, true)
  } catch {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/sign-in'
    }
    throw new Error('Token refresh failed')
  }
}

export async function graphqlRequest<T>(
  document: RequestDocument,
  variables?: Variables,
  isRetry = false
): Promise<T> {
  try {
    return await createClient().request<T>(document, variables)
  } catch (error) {
    if (isAuthError(error) && !isRetry) {
      return handleAuthErrorRetry<T>(document, variables)
    }
    throw error
  }
}

export async function executeQuery<TData, TVariables extends Variables = Variables>(
  query: RequestDocument,
  variables?: TVariables
): Promise<TData> {
  return graphqlRequest<TData>(query, variables)
}

// Legacy export for direct client access (prefer graphqlRequest for auto-retry)
export const graphqlClient = createClient()
