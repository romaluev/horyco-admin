/**
 * View Mode Toggler Component
 * Reusable component for switching between list/table/tree and grid views
 */

import { GitBranch, Grid, List } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

import type { LucideIcon } from 'lucide-react'

export type ViewMode = 'table' | 'grid' | 'tree'

interface ViewModeOption {
  value: ViewMode
  label: string
  icon: LucideIcon
}

interface ViewModeTogglerProps<T extends ViewMode = ViewMode> {
  value: T
  onChange: (mode: T) => void
  options?: ViewModeOption[]
  showLabels?: boolean
}

const defaultOptions: ViewModeOption[] = [
  { value: 'table', label: 'Таблица', icon: List },
  { value: 'grid', label: 'Сетка', icon: Grid },
]

const treeGridOptions: ViewModeOption[] = [
  { value: 'tree', label: 'Дерево', icon: GitBranch },
  { value: 'grid', label: 'Сетка', icon: Grid },
]

export function ViewModeToggler<T extends ViewMode = ViewMode>({
  value,
  onChange,
  options,
  showLabels = true,
}: ViewModeTogglerProps<T>) {
  // Determine which options to use
  const modeOptions =
    options ?? (value === 'tree' ? treeGridOptions : defaultOptions)

  return (
    <div className="flex w-fit gap-1 rounded-lg border p-1">
      {modeOptions.map((option) => {
        const Icon = option.icon
        return (
          <Button
            key={option.value}
            variant={value === option.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange(option.value as T)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {showLabels && (
              <span className="hidden md:inline">{option.label}</span>
            )}
          </Button>
        )
      })}
    </div>
  )
}
