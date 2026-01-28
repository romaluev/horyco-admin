'use client'

import { useMemo } from 'react'

import { cn } from '@/shared/lib/utils'

import type { WidgetConfig, WidgetData } from '@/entities/dashboard/dashboard-widget'

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
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
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
    <div className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="shrink-0 text-xs text-muted-foreground">
          {index + 1}.
        </span>
        <span className="truncate">{name}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {value !== undefined && (
          <span className="font-medium tabular-nums">
            {typeof value === 'number'
              ? value.toLocaleString('ru-RU')
              : value}
          </span>
        )}
        {item.percent !== undefined && (
          <div className="flex w-16 items-center gap-1">
            <div className="h-1.5 flex-1 rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full bg-primary')}
                style={{ width: `${Math.min(item.percent, 100)}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs text-muted-foreground">
              {item.percent.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
