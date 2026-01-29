'use client'

import { useMemo } from 'react'

import { cn } from '@/shared/lib/utils'

import type {
  WidgetConfig,
  WidgetData,
} from '@/entities/dashboard/dashboard-widget'

interface ListWidgetProps {
  data: WidgetData
  config: WidgetConfig
}

interface ListItem {
  id?: string | number
  name?: string
  title?: string
  label?: string
  value?: number | string
  amount?: number | string
  count?: number
  percent?: number
}

export function ListWidget({ data, config }: ListWidgetProps) {
  const listData = useMemo(() => {
    const items = (data.listData ?? []) as ListItem[]
    return items.slice(0, config.limit ?? 10)
  }, [data.listData, config.limit])

  if (listData.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Нет данных
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto">
      {listData.map((item, index) => (
        <ListRow key={item.id ?? index} item={item} index={index} />
      ))}
    </div>
  )
}

function ListRow({ item, index }: { item: ListItem; index: number }) {
  const name = item.name ?? item.title ?? item.label ?? `#${index + 1}`
  const value = item.value ?? item.amount ?? item.count

  return (
    <div className="hover:bg-muted/50 flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-muted-foreground shrink-0 text-xs">
          {index + 1}.
        </span>
        <span className="truncate">{name}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {value !== undefined && (
          <span className="font-medium tabular-nums">
            {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
          </span>
        )}
        {item.percent !== undefined && (
          <div className="flex w-16 items-center gap-1">
            <div className="bg-muted h-1.5 flex-1 rounded-full">
              <div
                className={cn('bg-primary h-full rounded-full')}
                style={{ width: `${Math.min(item.percent, 100)}%` }}
              />
            </div>
            <span className="text-muted-foreground w-8 text-right text-xs">
              {item.percent.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
