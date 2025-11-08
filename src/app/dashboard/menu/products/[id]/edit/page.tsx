/**
 * Edit Product Page
 * Page for editing existing products
 */

'use client'


import { use } from 'react'

import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { BaseLoading } from '@/shared/ui'
import { Button } from '@/shared/ui/base/button'

import { useGetProductById } from '@/entities/product'
import { UpdateProductForm } from '@/features/product-form'

import type { JSX } from 'react'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({
  params,
}: EditProductPageProps): JSX.Element {
  const { id } = use(params)
  const productId = parseInt(id)

  const { data: product, isLoading } = useGetProductById(productId)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <BaseLoading />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/menu/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Редактировать продукт
            </h2>
            <p className="text-muted-foreground">
              {product?.name || 'Измените информацию о продукте'}
            </p>
          </div>
        </div>

        <UpdateProductForm productId={productId} />
      </div>
    </div>
  )
}
