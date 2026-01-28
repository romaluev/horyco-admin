/**
 * Inventory Item Selector Component
 * Searchable dropdown for selecting inventory items
 */

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

import { useGetInventoryItems } from '../model/queries'

interface ItemSelectorProps {
  value?: number
  onChange: (value: number | undefined) => void
  placeholder?: string
  disabled?: boolean
  excludeIds?: number[]
}

export const ItemSelector = ({
  value,
  onChange,
  placeholder = 'Выберите товар',
  disabled = false,
  excludeIds = [],
}: ItemSelectorProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: items = [], isLoading } = useGetInventoryItems({
    isActive: true,
  })

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => !excludeIds.includes(item.id))
      .filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.sku?.toLowerCase().includes(search.toLowerCase())
      )
  }, [items, excludeIds, search])

  const selectedItem = items.find((item) => item.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || isLoading}
        >
          {selectedItem ? (
            <span className="truncate">
              {selectedItem.name}
              {selectedItem.sku && (
                <span className="text-muted-foreground ml-2">
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
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск товара..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Товары не найдены</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id.toString()}
                  onSelect={() => {
                    onChange(item.id === value ? undefined : item.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.sku && `SKU: ${item.sku} • `}
                      {item.unit}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
