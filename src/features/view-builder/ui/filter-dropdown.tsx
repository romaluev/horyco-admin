'use client'

import * as React from 'react'

import { Checkbox } from '@/shared/ui/base/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/base/popover'

import { selectAvailableFilters, useViewBuilderStore } from '../model/store'

import type { IFilter } from '@/entities/view'


interface IFilterDropdownItemProps {
  filter: IFilter
  index: number
}

function FilterDropdownItem({ filter, index }: IFilterDropdownItemProps) {
  const { updateFilter } = useViewBuilderStore()
  const availableFilters = useViewBuilderStore(selectAvailableFilters)
  const [isOpen, setIsOpen] = React.useState(false)

  const filterDef = availableFilters.find((f) => f.field === filter.field)

  if (!filterDef || filterDef.type !== 'multiSelect' || !filterDef.options) {
    return null
  }

  const selectedValues = Array.isArray(filter.value) ? filter.value : []

  const handleToggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue]

    updateFilter(index, {
      ...filter,
      value: newValues,
    })
  }

  const getLabel = () => {
    if (selectedValues.length === 0) return `${filterDef.label}: Любой`
    if (selectedValues.length === 1) {
      const option = filterDef.options?.find(
        (o) => o.value === selectedValues[0]
      )
      return `${filterDef.label}: ${option?.label || selectedValues[0]}`
    }
    return `${filterDef.label}: ${selectedValues.length} выбрано`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-md border border-border px-2 py-1 text-sm hover:bg-muted"
        >
          {getLabel()}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          {filterDef.options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onCheckedChange={() => handleToggleOption(option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function FilterDropdown() {
  const { workingConfig } = useViewBuilderStore()

  return (
    <>
      {workingConfig.filters.map((filter, index) => (
        <FilterDropdownItem
          key={`${filter.field}-${index}`}
          filter={filter}
          index={index}
        />
      ))}
    </>
  )
}
