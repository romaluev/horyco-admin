import { useTranslation } from 'react-i18next'

import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { ViewModeToggler } from '@/shared/ui/view-mode-toggler'

export interface Category {
  id: number
  name: string
}

type ProductViewMode = 'table' | 'grid'

interface ProductsFiltersProps {
  search: string
  categoryFilter: string
  availabilityFilter: string
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onAvailabilityChange: (value: string) => void
  viewMode: ProductViewMode
  onViewModeChange: (mode: ProductViewMode) => void
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
  const { t } = useTranslation('menu')

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1">
        <Input
          placeholder={t('pages.products.filters.searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue
            placeholder={t('pages.products.filters.allCategories')}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t('pages.products.filters.allCategories')}
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={availabilityFilter} onValueChange={onAvailabilityChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t('pages.products.filters.allStatuses')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t('pages.products.filters.allStatuses')}
          </SelectItem>
          <SelectItem value="available">
            {t('pages.products.filters.available')}
          </SelectItem>
          <SelectItem value="unavailable">
            {t('pages.products.filters.unavailable')}
          </SelectItem>
        </SelectContent>
      </Select>
      <ViewModeToggler value={viewMode} onChange={onViewModeChange} />
    </div>
  )
}
