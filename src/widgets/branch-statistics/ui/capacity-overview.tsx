import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { ICapacityStats } from '@/entities/branch'

interface CapacityOverviewProps {
  capacity: ICapacityStats
}

export const CapacityOverview = ({ capacity }: CapacityOverviewProps) => {
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(0)}%`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Загруженность</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-bold">{capacity.totalSeats}</p>
            <p className="text-muted-foreground text-sm">Всего мест</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              {formatPercentage(capacity.averageOccupancy)}
            </p>
            <p className="text-muted-foreground text-sm">Средняя загрузка</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Час пик</span>
            <span className="font-medium">{capacity.peakHour}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Загрузка в час пик</span>
            <span className="font-medium">
              {formatPercentage(capacity.peakOccupancy)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
