import Link from 'next/link'

import { Grid, List, Plus } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

type ViewMode = 'table' | 'grid'

interface ProductsHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ProductsHeader({
  viewMode,
  onViewModeChange,
}: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Продукты</h2>
        <p className="text-muted-foreground">
          Управляйте продуктами вашего меню
        </p>
      </div>
      <div className="flex items-center gap-2">
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
        <Link href="/dashboard/menu/products/create">
          <Button>
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Создать</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
