'use client'


import { Card, CardContent, CardHeader } from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'

import type { WidgetVisualization } from '../model/types'

interface WidgetSkeletonProps {
  visualization?: WidgetVisualization
}

export function WidgetSkeleton({ visualization = 'number' }: WidgetSkeletonProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-1">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {visualization === 'number' && <NumberSkeleton />}
        {(visualization === 'line-chart' || visualization === 'bar-chart') && (
          <ChartSkeleton />
        )}
        {visualization === 'pie-chart' && <PieSkeleton />}
        {visualization === 'list' && <ListSkeleton />}
        {visualization === 'text' && <TextSkeleton />}
      </CardContent>
    </Card>
  )
}

function NumberSkeleton() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="flex flex-1 items-end gap-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1"
          style={{ height: `${30 + Math.random() * 50}%` }}
        />
      ))}
    </div>
  )
}

function PieSkeleton() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Skeleton className="h-24 w-24 rounded-full" />
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  )
}

function TextSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}
