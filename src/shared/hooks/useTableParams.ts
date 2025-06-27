'use client';

import { useCallback } from 'react';
import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';
import {
  Filter,
  Sorting,
  Pagination,
  TableParams,
  parseFiltersFromQueryString,
  parseSortingFromQueryString,
  filtersToQueryString,
  sortingToQueryString,
  tableParamsToApiParams
} from '@/shared/lib/table-params';

// Hook for managing table parameters with URL persistence
export function useTableParams(defaultPageSize: number = 10) {
  // Define query state parsers
  const [queryParams, setQueryParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(defaultPageSize),
    filter: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('')
  });

  // Parse current query params into typed objects
  const currentFilters = parseFiltersFromQueryString(queryParams.filter);
  const currentSorting = parseSortingFromQueryString(queryParams.sort);
  const currentPagination: Pagination = {
    page: queryParams.page,
    perPage: queryParams.perPage
  };

  // Combine into TableParams object
  const tableParams: TableParams = {
    filters: currentFilters,
    sorting: currentSorting,
    pagination: currentPagination
  };

  // Update filters and reset to first page
  const setFilters = useCallback(
    (filters: Filter[]) => {
      const filterString = filtersToQueryString(filters);
      setQueryParams({
        filter: filterString || null,
        page: 1 // Reset to first page when filtering
      });
    },
    [setQueryParams]
  );

  // Update sorting and reset to first page
  const setSorting = useCallback(
    (sorting: Sorting | null) => {
      const sortString = sortingToQueryString(sorting);
      setQueryParams({
        sort: sortString || null,
        page: 1 // Reset to first page when sorting
      });
    },
    [setQueryParams]
  );

  // Update pagination
  const setPagination = useCallback(
    (pagination: Partial<Pagination>) => {
      setQueryParams({
        page: pagination.page || queryParams.page,
        perPage: pagination.perPage || queryParams.perPage
      });
    },
    [setQueryParams, queryParams.page, queryParams.perPage]
  );

  // Update page only
  const setPage = useCallback(
    (page: number) => {
      setQueryParams({ page });
    },
    [setQueryParams]
  );

  // Update page size and reset to first page
  const setPageSize = useCallback(
    (size: number) => {
      setQueryParams({
        perPage: size,
        page: 1 // Reset to first page when changing page size
      });
    },
    [setQueryParams]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setQueryParams({
      filter: null,
      page: 1
    });
  }, [setQueryParams]);

  // Clear sorting
  const clearSorting = useCallback(() => {
    setQueryParams({
      sort: null,
      page: 1
    });
  }, [setQueryParams]);

  // Reset all parameters
  const resetParams = useCallback(() => {
    setQueryParams({
      page: 1,
      perPage: defaultPageSize,
      filter: null,
      sort: null
    });
  }, [setQueryParams, defaultPageSize]);

  // Get API-ready query parameters
  const getApiParams = useCallback(() => {
    return tableParamsToApiParams(tableParams);
  }, [tableParams]);

  return {
    // Current state
    tableParams,
    filters: currentFilters,
    sorting: currentSorting,
    pagination: currentPagination,

    // Setters
    setFilters,
    setSorting,
    setPagination,
    setPage,
    setPageSize,

    // Utility functions
    clearFilters,
    clearSorting,
    resetParams,
    getApiParams,

    // Raw query params (in case needed)
    rawQueryParams: queryParams
  };
}
