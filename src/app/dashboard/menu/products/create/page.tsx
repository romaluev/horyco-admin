/**
 * Create Product Page
 * Page for creating new products
 */

'use client'

import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

import { CreateProductForm } from '@/features/menu/product-form'

import type { JSX } from 'react'

export default function CreateProductPage(): JSX.Element {
  const { t } = useTranslation('menu')

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
              {t('pages.products.page.create.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.products.page.create.description')}
            </p>
          </div>
        </div>

        <CreateProductForm />
      </div>
    </div>
  )
}
