/**
 * Edit Product Page
 * Page for editing existing products
 */

'use client'

import { Link } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { BaseLoading } from '@/shared/ui'
import { Button } from '@/shared/ui/base/button'

import { useGetProductById } from '@/entities/menu/product'
import { UpdateProductForm } from '@/features/menu/product-form'

import type { JSX } from 'react'

interface EditProductPageProps {
  id: string
}

export default function EditProductPage({
  id,
}: EditProductPageProps): JSX.Element {
  const { t } = useTranslation('menu')
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
    <div className="h-[calc(100dvh-52px)] overflow-auto">
      <div className="space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/menu/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t('pages.products.page.edit.title')}
            </h2>
            <p className="text-muted-foreground">
              {product?.name ||
                t('pages.products.page.edit.descriptionFallback')}
            </p>
          </div>
        </div>

        <UpdateProductForm productId={productId} />
      </div>
    </div>
  )
}
