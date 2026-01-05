/**
 * GraphQL Client for Analytics API
 * Uses graphql-request with JWT authentication from cookies
 */

import { GraphQLClient, type RequestDocument, type Variables } from 'graphql-request'
import Cookies from 'js-cookie'

import { BASE_API_URL } from '@/shared/lib/axios'

// GraphQL endpoint - remove trailing slash from BASE_API_URL if present
const getGraphQLEndpoint = () => {
  const baseUrl = BASE_API_URL || ''
  return `${baseUrl.replace(/\/$/, '')}/graphql`
}

/**
 * Create GraphQL client with auth headers
 */
function createGraphQLClient(): GraphQLClient {
  const token = Cookies.get('access_token')

  return new GraphQLClient(getGraphQLEndpoint(), {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Execute GraphQL request with automatic token handling
 * Token is read fresh on each request to handle refresh scenarios
 */
export async function graphqlRequest<T>(
  document: RequestDocument,
  variables?: Variables
): Promise<T> {
  const client = createGraphQLClient()
  return client.request<T>(document, variables)
}

/**
 * GraphQL client singleton for direct usage
 * Note: Prefer graphqlRequest() for auto token handling
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
