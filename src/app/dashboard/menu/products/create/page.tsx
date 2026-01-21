/**
 * Create Product Page
 * Page for creating new products
 */

'use client'


import { Link } from '@tanstack/react-router'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

import { CreateProductForm } from '@/features/menu/product-form'

import type { JSX } from 'react'

export default function CreateProductPage(): JSX.Element {
  return (
    <div className="h-full overflow-auto">
      <div className="space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/menu/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Создать продукт
            </h2>
            <p className="text-muted-foreground">
              Добавьте новый продукт в меню
            </p>
          </div>
        </div>

        <CreateProductForm />
      </div>
    </div>
  )
}
