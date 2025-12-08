import Link from 'next/link'

import { Plus } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

export function ProductsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Продукты</h2>
        <p className="text-muted-foreground">
          Управляйте продуктами вашего меню
        </p>
      </div>

      <Link href="/dashboard/menu/products/create">
        <Button>
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline ml-2">Создать</span>
        </Button>
      </Link>
    </div>
  )
}
