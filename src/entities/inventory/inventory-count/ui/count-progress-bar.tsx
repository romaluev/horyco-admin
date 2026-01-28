'use client'

import { Progress } from '@/shared/ui/base/progress'

interface ICountProgressBarProps {
  counted: number
  total: number
}

export function CountProgressBar({ counted, total }: ICountProgressBarProps) {
  const percentage = total > 0 ? (counted / total) * 100 : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Прогресс</span>
        <span className="font-medium">
          {counted} / {total} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <Progress value={percentage} />
    </div>
  )
}
