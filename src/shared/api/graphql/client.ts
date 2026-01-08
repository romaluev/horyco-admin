/**
 * GraphQL Client for Analytics API
 * Uses graphql-request with JWT authentication from cookies
 */

import { GraphQLClient, ClientError, type RequestDocument, type Variables } from 'graphql-request'

import { BASE_API_URL } from '@/shared/lib/axios'
import {
  getAccessToken,
  refreshAccessToken,
} from '@/shared/lib/token-manager'

// GraphQL endpoint - remove trailing slash from BASE_API_URL if present
const getGraphQLEndpoint = () => {
  const baseUrl = BASE_API_URL || ''
  return `${baseUrl.replace(/\/$/, '')}/graphql`
}

/**
 * Check if error is a 401 Unauthorized
 */
const is401Error = (error: unknown): boolean => {
  if (error instanceof ClientError) {
    return error.response.status === 401
  }
  return false
}

/**
 * Create GraphQL client with auth headers
 */
function createGraphQLClient(): GraphQLClient {
  const token = getAccessToken()

  return new GraphQLClient(getGraphQLEndpoint(), {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Execute GraphQL request with automatic token handling and 401 retry
 * Token is read fresh on each request to handle refresh scenarios
 */
export async function graphqlRequest<T>(
  document: RequestDocument,
  variables?: Variables,
  retried = false
): Promise<T> {
  const client = createGraphQLClient()

  try {
    return await client.request<T>(document, variables)
  } catch (error) {
    // Handle 401 errors with token refresh (only retry once)
    if (is401Error(error) && !retried) {
      console.log('[GraphQL] Received 401, attempting token refresh...')

      try {
        await refreshAccessToken(BASE_API_URL || '')
        // Retry with new token
        console.log('[GraphQL] Retrying request with new token...')
        return await graphqlRequest<T>(document, variables, true)
      } catch (refreshError) {
        console.error('[GraphQL] Token refresh failed, redirecting to login...')
        // Redirect to login on refresh failure
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in'
        }
        throw refreshError
      }
    }

    throw error
  }
}

/**
 * GraphQL client singleton for direct usage
 * Note: Prefer graphqlRequest() for auto token handling with 401 retry
 */
export const graphqlClient = createGraphQLClient()

/**
 * Typed request helper with error handling
 */
export async function executeQuery<TData, TVariables extends Variables = Variables>(
  query: RequestDocument,
  variables?: TVariables
): Promise<TData> {
  try {
    return await graphqlRequest<TData>(query, variables)
  } catch (error) {
    // Handle GraphQL errors
    if (error instanceof Error) {
      console.error('GraphQL Error:', error.message)
    }
    throw error
  }
}
