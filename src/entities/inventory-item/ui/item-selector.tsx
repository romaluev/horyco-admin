'use client'

import { useState, useMemo } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/base/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/base/popover'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useGetInventoryItems } from '../model/queries'
import type { IInventoryItem } from '../model/types'

interface ItemSelectorProps {
  value?: number
  onValueChange: (value: number, item?: IInventoryItem) => void
  placeholder?: string
  disabled?: boolean
  excludeIds?: number[]
  onlyActive?: boolean
  onlySemiFinished?: boolean
  className?: string
}

export function ItemSelector({
  value,
  onValueChange,
  placeholder = 'Выберите товар...',
  disabled = false,
  excludeIds = [],
  onlyActive = true,
  onlySemiFinished,
  className,
}: ItemSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useGetInventoryItems({
    search: search || undefined,
    isActive: onlyActive ? true : undefined,
    isSemiFinished: onlySemiFinished,
    limit: 50,
  })

  const items = useMemo(() => {
    const allItems = data ?? []
    return allItems.filter((item: IInventoryItem) => !excludeIds.includes(item.id))
  }, [data, excludeIds])

  const selectedItem = useMemo(
    () => items.find((item) => item.id === value),
    [items, value]
  )

  if (isLoading && !data) {
    return <Skeleton className="h-9 w-full" />
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between font-normal', className)}
        >
          {selectedItem ? (
            <span className="truncate">
              {selectedItem.name}
              {selectedItem.sku && (
                <span className="ml-2 text-muted-foreground">
                  ({selectedItem.sku})
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск товара..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Товар не найден</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id.toString()}
                  onSelect={() => {
                    onValueChange(item.id, item)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.isSemiFinished && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
                          П/Ф
                        </span>
                      )}
                    </div>
                    {item.sku && (
                      <span className="text-xs text-muted-foreground">
                        {item.sku}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.unit}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
