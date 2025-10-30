'use client'

import { useState } from 'react'

import Link from 'next/link'

import { IconPlus } from '@tabler/icons-react'

import { cn } from '@/shared/lib/utils'
import { buttonVariants } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { ProductList } from '@/entities/product'
import { useGetAllProducts } from '@/entities/product/model'
import { DeleteProductButton } from '@/features/product-form'
import { AiImportButton } from '@/features/product-form/ui/ai-import-button'
import { BaseFilter } from '@/widgets/ListItems'

const filterProperties: { value: string; label: string }[] = [
  {
    value: 'name',
    label: 'Название',
  },
]

export default function Page() {
  const [_filters, setFilters] = useState('')

  const products = useGetAllProducts()

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex flex-wrap-reverse items-start justify-between gap-2">
          <Heading
            title="Продукты"
            description="Управление продуктами (Серверные функции таблицы.)"
          />
          <div className="flex flex-wrap gap-2">
            <AiImportButton />
            <Link
              href="/dashboard/products/new"
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className="mr-2 h-4 w-4" /> Добавить новый
            </Link>
            <BaseFilter
              properties={filterProperties.map((prop) => ({
                ...prop,
                label: 'Фильтры',
              }))}
              onChange={(value) => setFilters(value)}
            />
          </div>
        </div>
        <Separator />
        <ProductList DeleteButton={DeleteProductButton} products={products} />
      </div>
    </PageContainer>
  )
}
