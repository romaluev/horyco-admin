/**
 * Category Parent Selector Component
 * Dropdown for selecting parent category
 */

'use client'

import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useGetCategories } from '@/entities/menu/category'

interface CategoryParentSelectorProps {
  value?: number
  onChange: (value: number | null) => void
  excludeId?: number
}

export const CategoryParentSelector = ({
  value,
  onChange,
  excludeId,
}: CategoryParentSelectorProps) => {
  const { t } = useTranslation('menu')
  const { data: categories, isLoading } = useGetCategories({
    includeProducts: false,
  })

  const availableCategories =
    categories?.filter((cat) => cat.id !== excludeId && !cat.parentId) || []

  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => onChange(val === 'null' ? null : Number(val))}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={t('components.categoryParentSelector.placeholder')}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="null">
          {t('components.categoryParentSelector.noParent')}
        </SelectItem>
        {availableCategories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
