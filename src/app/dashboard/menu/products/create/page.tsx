/**
 * Create Product Page
 * Page for creating new products
 */

'use client'

import type { JSX } from 'react'

import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'

import { CreateProductForm } from '@/features/product-form'

export default function CreateProductPage(): JSX.Element {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/menu/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Создать продукт</h2>
          <p className="text-muted-foreground">Добавьте новый продукт в меню</p>
        </div>
      </div>

      <CreateProductForm />
    </div>
  )
}
