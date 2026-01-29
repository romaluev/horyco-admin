'use client'

import { IconX } from '@tabler/icons-react'

import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'

import { selectAvailableFilters, useViewBuilderStore } from '../model/store'

export function ActiveFilters() {
  const { workingConfig, removeFilter, clearFilters } = useViewBuilderStore()
  const availableFilters = useViewBuilderStore(selectAvailableFilters)

  const getFilterLabel = (field: string): string => {
    const filterDef = availableFilters.find((f) => f.field === field)
    return filterDef?.label || field
  }

  const getValueLabel = (field: string, value: unknown): string => {
    const filterDef = availableFilters.find((f) => f.field === field)

    if (Array.isArray(value)) {
      if (value.length === 0) return 'Любой'
      return value
        .map((v) => {
          const option = filterDef?.options?.find((o) => o.value === v)
          return option?.label || v
        })
        .join(', ')
    }

    if (filterDef?.options) {
      const option = filterDef.options.find((o) => o.value === value)
      return option?.label || String(value)
    }

    return String(value || 'Любой')
  }

  if (workingConfig.filters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {workingConfig.filters.map((filter, index) => (
        <Badge
          key={`${filter.field}-${index}`}
          variant="secondary"
          className="flex items-center gap-1 py-1"
        >
          <span className="font-medium">{getFilterLabel(filter.field)}</span>
          <span className="text-muted-foreground">:</span>
          <span>{getValueLabel(filter.field, filter.value)}</span>
          <button
            type="button"
            onClick={() => removeFilter(index)}
            className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
          >
            <IconX className="size-3" />
          </button>
        </Badge>
      ))}

      {workingConfig.filters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-6 px-2 text-xs"
        >
          Очистить все
        </Button>
      )}
    </div>
  )
}
