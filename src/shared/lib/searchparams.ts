import {
  createSearchParamsCache,
  createSerializer,
  _parseAsInteger,
  parseAsString,
} from 'nuqs/server'

export const _searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: _parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  // advanced ListItems
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
}

export const searchParamsCache = createSearchParamsCache(searchParams)
export const serialize = createSerializer(searchParams)
