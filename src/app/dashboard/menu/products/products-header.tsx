import { Link } from '@tanstack/react-router'

import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/base/button'

export function ProductsHeader() {
  const { t } = useTranslation('menu')

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t('pages.products.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('pages.products.description')}
        </p>
      </div>

      <Link to="/dashboard/menu/products/create">
        <Button>
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline ml-2">
            {t('pages.products.actions.create')}
          </span>
        </Button>
      </Link>
    </div>
  )
}
