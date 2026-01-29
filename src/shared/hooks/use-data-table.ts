'use client'

import * as React from 'react'

import { useSearch, useNavigate } from '@tanstack/react-router'
import {
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useDebouncedCallback } from '@/shared/hooks/use-debounced-callback'

import type { ExtendedColumnSort } from '@/shared/types/data-table'

const DEBOUNCE_MS = 300
const THROTTLE_MS = 50

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[]
  }
  history?: 'push' | 'replace'
  debounceMs?: number
  throttleMs?: number
  clearOnDefault?: boolean
  enableAdvancedFilter?: boolean
  scroll?: boolean
  shallow?: boolean
  startTransition?: React.TransitionStartFunction
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    history = 'replace',
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    shallow = true,
    ...tableProps
  } = props

  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as Record<string, unknown>

  // Parse URL params
  const urlPage = typeof search.page === 'number' ? search.page : 1
  const urlPerPage = typeof search.perPage === 'number' ? search.perPage : (initialState?.pagination?.pageSize ?? 10)
  const urlSort = search.sort as ExtendedColumnSort<TData>[] | undefined

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {})

  const [page, setPageState] = React.useState(urlPage)
  const [perPage, setPerPageState] = React.useState(urlPerPage)
  const [sorting, setSortingState] = React.useState<ExtendedColumnSort<TData>[]>(
    urlSort ?? initialState?.sorting ?? []
  )

  // Update URL when state changes
  const updateUrl = React.useCallback(
    (updates: Record<string, unknown>) => {
      const newSearch = { ...search, ...updates }
      // Remove null/undefined values
      Object.keys(newSearch).forEach((key) => {
        if (newSearch[key] === null || newSearch[key] === undefined) {
          delete newSearch[key]
        }
      })
      navigate({
        search: newSearch as never,
        replace: history === 'replace',
      })
    },
    [navigate, search, history]
  )

  const setPage = React.useCallback(
    (newPage: number) => {
      setPageState(newPage)
      updateUrl({ page: newPage === 1 ? undefined : newPage })
    },
    [updateUrl]
  )

  const setPerPage = React.useCallback(
    (newPerPage: number) => {
      setPerPageState(newPerPage)
      updateUrl({ perPage: newPerPage === 10 ? undefined : newPerPage })
    },
    [updateUrl]
  )

  const setSorting = React.useCallback(
    (newSorting: ExtendedColumnSort<TData>[]) => {
      setSortingState(newSorting)
      updateUrl({ sort: newSorting.length > 0 ? newSorting : undefined })
    },
    [updateUrl]
  )

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1,
      pageSize: perPage,
    }
  }, [page, perPage])

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination)
        setPage(newPagination.pageIndex + 1)
        setPerPage(newPagination.pageSize)
      } else {
        setPage(updaterOrValue.pageIndex + 1)
        setPerPage(updaterOrValue.pageSize)
      }
    },
    [pagination, setPage, setPerPage]
  )

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting)
        setSorting(newSorting as ExtendedColumnSort<TData>[])
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[])
      }
    },
    [sorting, setSorting]
  )

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])

  const debouncedSetFilterValues = useDebouncedCallback(
    (_values: Record<string, unknown>) => {
      setPage(1)
    },
    debounceMs
  )

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(prev)
            : updaterOrValue

        debouncedSetFilterValues({})
        return next
      })
    },
    [debouncedSetFilterValues]
  )

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return { table, shallow, debounceMs, throttleMs }
}
