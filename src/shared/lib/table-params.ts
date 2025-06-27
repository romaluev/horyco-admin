// Filter rules matching backend FilterRule enum
export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull'
}

// Types for filtering, sorting, and pagination
export interface Filter {
  property: string;
  rule: FilterRule;
  value?: string;
}

export interface Sorting {
  property: string;
  direction: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  perPage: number;
}

export interface TableParams {
  filters: Filter[];
  sorting: Sorting | null;
  pagination: Pagination;
}

// Convert filters array to backend query string format
export function filtersToQueryString(filters: Filter[]): string {
  if (!filters || filters.length === 0) return '';

  return filters
    .map((filter) => {
      if (
        filter.rule === FilterRule.IS_NULL ||
        filter.rule === FilterRule.IS_NOT_NULL
      ) {
        return `${filter.property}:${filter.rule}`;
      }
      return `${filter.property}:${filter.rule}:${filter.value}`;
    })
    .join(';');
}

// Convert sorting object to backend query string format
export function sortingToQueryString(sorting: Sorting | null): string {
  if (!sorting) return '';
  return `${sorting.property}:${sorting.direction}`;
}

// Parse query string filters back to Filter array
export function parseFiltersFromQueryString(filterString: string): Filter[] {
  if (!filterString) return [];

  const filters = filterString.split(';');
  return filters.map((filter) => {
    const parts = filter.split(':');
    const [property, rule, value] = parts;

    return {
      property,
      rule: rule as FilterRule,
      value: value || undefined
    };
  });
}

// Parse query string sorting back to Sorting object
export function parseSortingFromQueryString(
  sortString: string
): Sorting | null {
  if (!sortString) return null;

  const [property, direction] = sortString.split(':');
  return {
    property,
    direction: direction as 'asc' | 'desc'
  };
}

// Convert table parameters to API query parameters
export function tableParamsToApiParams(params: TableParams) {
  const queryParams: Record<string, string | number> = {
    page: params.pagination.page - 1,
    size: params.pagination.perPage
  };

  const filterString = filtersToQueryString(params.filters);
  if (filterString) {
    queryParams.filter = filterString;
  }

  const sortString = sortingToQueryString(params.sorting);
  if (sortString) {
    queryParams.sort = sortString;
  }

  return queryParams;
}

// Validate filter property against allowed properties
export function validateFilterProperty(
  property: string,
  allowedProperties: string[]
): boolean {
  return allowedProperties.includes(property);
}

// Validate filter rule
export function validateFilterRule(rule: string): rule is FilterRule {
  return Object.values(FilterRule).includes(rule as FilterRule);
}

// Get display name for filter rule
export function getFilterRuleDisplayName(rule: FilterRule): string {
  const ruleDisplayNames: Record<FilterRule, string> = {
    [FilterRule.EQUALS]: 'Equals',
    [FilterRule.NOT_EQUALS]: 'Not Equals',
    [FilterRule.GREATER_THAN]: 'Greater Than',
    [FilterRule.GREATER_THAN_OR_EQUALS]: 'Greater Than or Equals',
    [FilterRule.LESS_THAN]: 'Less Than',
    [FilterRule.LESS_THAN_OR_EQUALS]: 'Less Than or Equals',
    [FilterRule.LIKE]: 'Like',
    [FilterRule.NOT_LIKE]: 'Not Like',
    [FilterRule.IN]: 'In',
    [FilterRule.NOT_IN]: 'Not In',
    [FilterRule.IS_NULL]: 'Is Null',
    [FilterRule.IS_NOT_NULL]: 'Is Not Null'
  };

  return ruleDisplayNames[rule];
}
