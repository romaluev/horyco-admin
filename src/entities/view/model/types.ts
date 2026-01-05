/**
 * View Entity Types
 */

import type {
  Dataset,
  GroupBy,
  IView,
  IViewConfigInput,
  IViewConfigOutput,
  PeriodType,
  SortBy,
  SortDirection,
} from '@/shared/api/graphql'

// Re-export from GraphQL types for convenience
export type { IView, IViewConfigOutput }

// ============================================
// INTERNAL TYPES (for frontend state)
// ============================================

export interface IFilter {
  field: string
  operator: FilterOperator
  value: unknown
}

export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'in'
  | 'notIn'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'between'
  | 'contains'
  | 'isEmpty'
  | 'isNotEmpty'

export interface IViewConfig {
  timeframe: {
    type: PeriodType
    customStart?: string
    customEnd?: string
  }
  filters: IFilter[]
  columns: string[]
  groupBy?: GroupBy
  sorting: {
    field: string
    direction: SortDirection
  }
  display: 'TABLE' | 'CHART'
}

// ============================================
// DTO TYPES
// ============================================

export interface ICreateViewDto {
  pageCode: Dataset
  name: string
  description?: string
  config: IViewConfigInput
  isPinned?: boolean
}

export interface IUpdateViewDto {
  name?: string
  config?: IViewConfigInput
  isPinned?: boolean
  isShared?: boolean
}

// ============================================
// QUERY PARAMS
// ============================================

export interface IViewsQueryParams {
  pageCode?: string
}

// ============================================
// DATA TABLE TYPES
// ============================================

export interface IViewDataParams {
  dataset: Dataset
  period: {
    type: PeriodType
    customStart?: string
    customEnd?: string
  }
  sortBy?: SortBy
  sortDirection?: SortDirection
  limit?: number
  branchId?: number
  filters?: IFilter[]
}

export interface IViewDataItem {
  rank: number
  id: number
  name: string
  value: number
  formattedValue?: string
  percentage: number
  secondaryValue?: number
  secondaryLabel?: string
  color?: string
  // Additional fields that vary by dataset
  [key: string]: unknown
}

// ============================================
// COLUMN DEFINITION
// ============================================

export interface IColumnDef {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'status'
  sortable?: boolean
  defaultVisible?: boolean
}

// ============================================
// FILTER DEFINITION
// ============================================

export interface IFilterDef {
  field: string
  label: string
  type: 'select' | 'multiSelect' | 'date' | 'dateRange' | 'number' | 'text'
  options?: { value: string; label: string }[]
}
