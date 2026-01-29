'use client'

import type { WidgetData } from '@/entities/dashboard/dashboard-widget'

interface TextWidgetProps {
  data: WidgetData
}

export function TextWidget({ data }: TextWidgetProps) {
  if (!data.text) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Нет текста
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <p className="text-foreground text-sm whitespace-pre-wrap">{data.text}</p>
    </div>
  )
}
