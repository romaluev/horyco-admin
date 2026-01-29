'use client'

import * as React from 'react'

import {
  IconAdjustments,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react'

import { SortBy, SortDirection } from '@/shared/api/graphql'
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

import { GROUP_BY_OPTIONS } from '../model/constants'
import {
  selectAvailableColumns,
  selectDatasetConfig,
  useViewBuilderStore,
} from '../model/store'

const SORT_BY_LABELS: Record<SortBy, string> = {
  [SortBy.REVENUE]: 'Выручка',
  [SortBy.ORDERS]: 'Заказы',
  [SortBy.QUANTITY]: 'Количество',
  [SortBy.PERCENTAGE]: 'Доля',
  [SortBy.AVG_CHECK]: 'Средний чек',
  [SortBy.CUSTOMERS]: 'Клиенты',
  [SortBy.GROWTH]: 'Рост',
}

export function DisplaySettings() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { workingConfig, toggleColumn, setSorting, setGroupBy } =
    useViewBuilderStore()
  const availableColumns = useViewBuilderStore(selectAvailableColumns)
  const datasetConfig = useViewBuilderStore(selectDatasetConfig)

  const availableSortOptions = datasetConfig?.sortOptions || []
  const availableGroupBy = datasetConfig?.groupByOptions || []

  const handleSortFieldChange = (value: SortBy) => {
    setSorting(value, workingConfig.sorting.direction)
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
            <Label className="text-muted-foreground text-xs font-medium uppercase">
              Сортировка
            </Label>
            <div className="flex items-center gap-2">
              <Select
                value={workingConfig.sorting.field}
                onValueChange={(v) => handleSortFieldChange(v as SortBy)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Выберите поле" />
                </SelectTrigger>
                <SelectContent>
                  {availableSortOptions.map((sortOption) => (
                    <SelectItem key={sortOption} value={sortOption}>
                      {SORT_BY_LABELS[sortOption]}
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
                <Label className="text-muted-foreground text-xs font-medium uppercase">
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
            <Label className="text-muted-foreground text-xs font-medium uppercase">
              Отображаемые колонки
            </Label>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {availableColumns.map((col) => (
                <label
                  key={col.key}
                  className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5"
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
