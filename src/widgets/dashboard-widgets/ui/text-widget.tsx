'use client'

import type { WidgetData } from '@/entities/dashboard/dashboard-widget'

interface TextWidgetProps {
  data: WidgetData
}

export function TextWidget({ data }: TextWidgetProps) {
  if (!data.text) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Нет текста
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <p className="whitespace-pre-wrap text-sm text-foreground">{data.text}</p>
    </div>
  )
}
