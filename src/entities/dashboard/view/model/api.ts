/**
 * View API - GraphQL Operations
 */

import { gql } from 'graphql-request'

import { executeQuery } from '@/shared/api/graphql'

import type {
  IView,
  IRankedItem,
  ICreateViewInput,
  IUpdateViewInput,
  IRankedListParams,
} from '@/shared/api/graphql'

// ============================================
// QUERIES
// ============================================

const GET_VIEWS = gql`
  query GetViews($pageCode: String) {
    views(pageCode: $pageCode) {
      id
      name
      pageCode
      isDefault
      isPinned
      isShared
      config {
        timeframe {
          type
          customStart
          customEnd
        }
        filters
        columns
        groupBy
        sorting {
          column
          direction
        }
        display
      }
      createdAt
      updatedAt
    }
  }
`

const GET_VIEW_BY_ID = gql`
  query GetView($id: ID!) {
    view(id: $id) {
      id
      name
      pageCode
      isDefault
      isPinned
      isShared
      config {
        timeframe {
          type
          customStart
          customEnd
        }
        filters
        columns
        groupBy
        sorting {
          column
          direction
        }
        display
      }
      createdAt
      updatedAt
    }
  }
`

const GET_RANKED_LIST = gql`
  query RankedList(
    $dataset: Dataset!
    $period: PeriodInput!
    $sortBy: SortBy
    $sortDirection: SortDirection
    $limit: Int
    $branchId: Int
  ) {
    rankedList(
      dataset: $dataset
      period: $period
      sortBy: $sortBy
      sortDirection: $sortDirection
      limit: $limit
      branchId: $branchId
    ) {
      rank
      id
      name
      value
      formattedValue
      percentage
      secondaryValue
      secondaryLabel
      color
    }
  }
`

// ============================================
// MUTATIONS
// ============================================

const CREATE_VIEW = gql`
  mutation CreateView($input: CreateViewInput!) {
    createView(input: $input) {
      id
      name
    }
  }
`

const UPDATE_VIEW = gql`
  mutation UpdateView($id: ID!, $input: UpdateViewInput!) {
    updateView(id: $id, input: $input) {
      id
      name
    }
  }
`

const DELETE_VIEW = gql`
  mutation DeleteView($id: ID!) {
    deleteView(id: $id) {
      success
    }
  }
`

// ============================================
// API FUNCTIONS
// ============================================

interface IViewsResponse {
  views: IView[]
}

interface IViewResponse {
  view: IView
}

interface IRankedListResponse {
  rankedList: IRankedItem[]
}

interface ICreateViewResponse {
  createView: { id: string; name: string }
}

interface IUpdateViewResponse {
  updateView: { id: string; name: string }
}

interface IDeleteViewResponse {
  deleteView: { success: boolean }
}

export const viewApi = {
  /**
   * Get all views, optionally filtered by pageCode
   */
  getViews: async (pageCode?: string): Promise<IView[]> => {
    const response = await executeQuery<IViewsResponse>(GET_VIEWS, { pageCode })
    return response.views
  },

  /**
   * Get a single view by ID
   */
  getViewById: async (id: string): Promise<IView> => {
    const response = await executeQuery<IViewResponse>(GET_VIEW_BY_ID, { id })
    return response.view
  },

  /**
   * Get ranked list data for a view table
   */
  getRankedList: async (params: IRankedListParams): Promise<IRankedItem[]> => {
    const response = await executeQuery<IRankedListResponse>(GET_RANKED_LIST, {
      dataset: params.dataset,
      period: params.period,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      limit: params.limit,
      branchId: params.branchId,
    })
    return response.rankedList
  },

  /**
   * Create a new view
   */
  createView: async (input: ICreateViewInput): Promise<{ id: string; name: string }> => {
    const response = await executeQuery<ICreateViewResponse>(CREATE_VIEW, { input })
    return response.createView
  },

  /**
   * Update an existing view
   */
  updateView: async (
    id: string,
    input: IUpdateViewInput
  ): Promise<{ id: string; name: string }> => {
    const response = await executeQuery<IUpdateViewResponse>(UPDATE_VIEW, { id, input })
    return response.updateView
  },

  /**
   * Delete a view
   */
  deleteView: async (id: string): Promise<{ success: boolean }> => {
    const response = await executeQuery<IDeleteViewResponse>(DELETE_VIEW, { id })
    return response.deleteView
  },
}
