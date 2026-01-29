'use client'

import * as React from 'react'

import { IconFilter, IconPlus } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/base/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { ActiveFilters } from './active-filters'
import { FilterDropdown } from './filter-dropdown'
import { PERIOD_OPTIONS } from '../model/constants'
import { selectAvailableFilters, useViewBuilderStore } from '../model/store'

import type { PeriodType } from '@/shared/api/graphql'

export function FilterBar() {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const { workingConfig, setTimeframe, addFilter } = useViewBuilderStore()
  const availableFilters = useViewBuilderStore(selectAvailableFilters)

  const handlePeriodChange = (value: string) => {
    setTimeframe({
      type: value as PeriodType,
      customStart: undefined,
      customEnd: undefined,
    })
  }

  const handleAddFilter = (field: string) => {
    const filterDef = availableFilters.find((f) => f.field === field)
    if (filterDef) {
      addFilter({
        field,
        operator: filterDef.type === 'multiSelect' ? 'in' : 'eq',
        value: filterDef.type === 'multiSelect' ? [] : '',
      })
    }
    setIsFilterOpen(false)
  }

  // Get filters that haven't been added yet
  const unusedFilters = availableFilters.filter(
    (f) => !workingConfig.filters.some((wf) => wf.field === f.field)
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Period Selector */}
        <Select
          value={workingConfig.timeframe.type}
          onValueChange={handlePeriodChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите период" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Button */}
        {unusedFilters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <IconFilter className="mr-1 size-4" />
                Фильтр
                <IconPlus className="ml-1 size-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-1">
                {unusedFilters.map((filter) => (
                  <button
                    key={filter.field}
                    type="button"
                    onClick={() => handleAddFilter(filter.field)}
                    className="hover:bg-muted flex w-full items-center rounded-md px-2 py-1.5 text-sm"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters */}
      {workingConfig.filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <ActiveFilters />
          <FilterDropdown />
        </div>
      )}
    </div>
  )
}
