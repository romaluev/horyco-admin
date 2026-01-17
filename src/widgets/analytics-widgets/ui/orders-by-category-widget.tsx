'use client'

import { useMemo } from 'react'

import {
  type IconToolsKitchen2,
  IconDotsVertical,
  IconMeat,
  IconCup,
  IconIceCream,
  IconSalad,
} from '@tabler/icons-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { Button } from '@/shared/ui/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'

interface IOrdersByCategoryWidgetProps {
  totalOrders?: number
  totalSalesLabel?: string
  weeklyPercentage?: number
  categories?: ICategoryItem[]
  isLoading?: boolean
  onViewDetails?: () => void
}

interface ICategoryItem {
  name: string
  description: string
  value: number
  color: string
  icon: typeof IconToolsKitchen2
}

const DEFAULT_CATEGORIES: ICategoryItem[] = [
  {
    name: 'Main Dishes',
    description: 'Steaks, Pasta, Rice',
    value: 3100,
    color: 'hsl(var(--foreground))',
    icon: IconMeat,
  },
  {
    name: 'Beverages',
    description: 'Coffee, Tea, Juices',
    value: 2500,
    color: 'hsl(var(--muted-foreground))',
    icon: IconCup,
  },
  {
    name: 'Desserts',
    description: 'Ice Cream, Cakes',
    value: 1230,
    color: 'hsl(var(--muted))',
    icon: IconIceCream,
  },
  {
    name: 'Appetizers',
    description: 'Salads, Soups',
    value: 822,
    color: 'hsl(var(--border))',
    icon: IconSalad,
  },
]

const CHART_COLORS = [
  'hsl(var(--foreground))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--muted))',
  'hsl(var(--border))',
]

export function OrdersByCategoryWidget({
  totalOrders = 5652,
  totalSalesLabel = '42.8K Total sales',
  weeklyPercentage = 38,
  categories = DEFAULT_CATEGORIES,
  isLoading = false,
  onViewDetails,
}: IOrdersByCategoryWidgetProps) {
  const chartData = useMemo(() => {
    return categories.map((cat, index) => ({
      name: cat.name,
      value: cat.value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
  }, [categories])

  const formattedTotal = useMemo(() => {
    if (totalOrders >= 1000) {
      return totalOrders.toLocaleString('ru-RU')
    }
    return totalOrders.toString()
  }, [totalOrders])

  if (isLoading) {
    return <OrdersByCategoryWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Total orders</h3>
          <p className="text-sm text-muted-foreground">{totalSalesLabel}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 flex items-center gap-6">
        <div>
          <span className="text-4xl font-bold">{formattedTotal}</span>
          <p className="text-sm text-muted-foreground">Total orders</p>
        </div>

        <div className="relative size-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={42}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{weeklyPercentage}%</span>
            <span className="text-[10px] text-muted-foreground">Weekly</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {categories.map((category, index) => {
          const CategoryIcon = category.icon
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <CategoryIcon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <span className="text-sm font-semibold">
                {category.value >= 1000
                  ? `${(category.value / 1000).toFixed(2)}K`
                  : category.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrdersByCategoryWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-2 flex items-start justify-between">
        <div className="space-y-1">
          <div className="h-6 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="size-8 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-4 flex items-center gap-6">
        <div className="space-y-1">
          <div className="h-10 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="size-24 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="flex-1 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 animate-pulse rounded-lg bg-muted" />
              <div className="space-y-1">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
