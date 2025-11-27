import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Grid, List, } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

type ViewMode = 'table' | 'grid'

export interface Category {
  id: number
  name: string
}

interface ProductsFiltersProps {
  search: string
  categoryFilter: string
  availabilityFilter: string
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onAvailabilityChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ProductsFilters({
  search,
  categoryFilter,
  availabilityFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onAvailabilityChange,
  viewMode,
  onViewModeChange,
}: ProductsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Все категории" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все категории</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={availabilityFilter} onValueChange={onAvailabilityChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Все статусы" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          <SelectItem value="available">Доступные</SelectItem>
          <SelectItem value="unavailable">Недоступные</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-1 rounded-lg border p-1">
        <Button
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('table')}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          <span className="hidden md:inline">Таблица</span>
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="gap-2"
        >
          <Grid className="h-4 w-4" />
          <span className="hidden md:inline">Сетка</span>
        </Button>
      </div>
    </div>
  )
}
