'use client'

import * as React from 'react'

import { IconAdjustments, IconSortAscending, IconSortDescending } from '@tabler/icons-react'

import { SortDirection } from '@/shared/api/graphql'
import { Button } from '@/shared/ui/base/button'
import { Checkbox } from '@/shared/ui/base/checkbox'
import { Label } from '@/shared/ui/base/label'
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
import { Separator } from '@/shared/ui/base/separator'

import { GROUP_BY_OPTIONS, SORT_DIRECTION_OPTIONS } from '../model/constants'
import {
  selectAvailableColumns,
  selectDatasetConfig,
  useViewBuilderStore,
} from '../model/store'

export function DisplaySettings() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { workingConfig, toggleColumn, setSorting, setGroupBy } =
    useViewBuilderStore()
  const availableColumns = useViewBuilderStore(selectAvailableColumns)
  const datasetConfig = useViewBuilderStore(selectDatasetConfig)

  const sortableColumns = availableColumns.filter((col) => col.sortable)
  const availableGroupBy = datasetConfig?.groupByOptions || []

  const handleSortFieldChange = (field: string) => {
    setSorting(field, workingConfig.sorting.direction)
  }

  const handleSortDirectionToggle = () => {
    setSorting(
      workingConfig.sorting.field,
      workingConfig.sorting.direction === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
    )
  }

  const handleGroupByChange = (value: string) => {
    if (value === 'none') {
      setGroupBy(undefined)
    } else {
      setGroupBy(value as typeof workingConfig.groupBy)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <IconAdjustments className="mr-1 size-4" />
          Отображение
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          {/* Sorting */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase text-muted-foreground">
              Сортировка
            </Label>
            <div className="flex items-center gap-2">
              <Select
                value={workingConfig.sorting.field}
                onValueChange={handleSortFieldChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Выберите поле" />
                </SelectTrigger>
                <SelectContent>
                  {sortableColumns.map((col) => (
                    <SelectItem key={col.key} value={col.key}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSortDirectionToggle}
              >
                {workingConfig.sorting.direction === SortDirection.ASC ? (
                  <IconSortAscending className="size-4" />
                ) : (
                  <IconSortDescending className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Grouping */}
          {availableGroupBy.length > 0 && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase text-muted-foreground">
                  Группировка
                </Label>
                <Select
                  value={workingConfig.groupBy || 'none'}
                  onValueChange={handleGroupByChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Без группировки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Без группировки</SelectItem>
                    {GROUP_BY_OPTIONS.filter((opt) =>
                      availableGroupBy.includes(opt.value)
                    ).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
            </>
          )}

          {/* Columns */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase text-muted-foreground">
              Отображаемые колонки
            </Label>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {availableColumns.map((col) => (
                <label
                  key={col.key}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                >
                  <Checkbox
                    checked={workingConfig.columns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  <span className="text-sm">{col.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
