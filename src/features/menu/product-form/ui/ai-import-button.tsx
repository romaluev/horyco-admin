'use client'

import { useState } from 'react'

import { StarsIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useRouter } from '@/shared/lib/navigation'
import { Input, Textarea } from '@/shared/ui'
import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/base/dialog'
import { ScrollArea } from '@/shared/ui/base/scroll-area'
import { FileUploader } from '@/shared/ui/file-uploader'

import { useCreateProduct } from '@/entities/menu/product'
import { IMAGE_PROMPT } from '@/features/menu/product-form/config/constants'

import type { IProduct } from '@/entities/menu/product'

const MAX_USAGE = 3
const IMPORT_USAGE_KEY = 'ai_import_usage'

export const AiImportButton = () => {
  const { t } = useTranslation('menu')
  const [files, setFiles] = useState<File[]>([])
  const [usageCount, setUsageCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem(IMPORT_USAGE_KEY) || '0')
    }
    return 0
  })

  const incrementUsage = () => {
    const usageCount = parseInt(localStorage.getItem(IMPORT_USAGE_KEY) || '0')
    const newCount = usageCount + 1
    setUsageCount(newCount)
    localStorage.setItem(IMPORT_USAGE_KEY, newCount.toString())
  }
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<IProduct[]>([])
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const { mutateAsync: createProduct } = useCreateProduct()
  const router = useRouter()

  const extractProducts = async () => {
    if (files.length === 0) {
      toast.error(t('products.aiImport.messages.noImage'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const usageCount = parseInt(localStorage.getItem(IMPORT_USAGE_KEY) || '0')
      if (usageCount >= MAX_USAGE) {
        toast.error(t('products.aiImport.messages.limitReached'))
        return
      }

      const formData = new FormData()
      files.forEach((file) => formData.append('images', file))

      formData.append('prompt', IMAGE_PROMPT(''))

      const response = await fetch('/api/extract-products', {
        method: 'POST',
        body: formData,
      })
      incrementUsage()

      if (!response.ok) {
        throw new Error(t('products.aiImport.messages.extractError'))
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('products.aiImport.messages.unknownError')
      )
      toast.error(t('products.aiImport.messages.extractError'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    setCreating(true)
    try {
      for (const product of products) {
        await createProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId || 1,
          productTypeId: 1,
          isAvailable: true,
        })
      }

      toast.success(t('products.aiImport.messages.successCreate'))
      router.push('/dashboard/products')
    } catch (err) {
      toast.error(t('products.aiImport.messages.errorCreate'))
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog>
      {usageCount < MAX_USAGE ? (
        <DialogTrigger asChild>
          <Button className="relative inline-flex h-9 overflow-hidden rounded-lg p-[2px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#023055_0%,#fe4a49_50%,#023055_100%)]" />
            <span className="bg-background inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-1 text-sm font-medium text-[#023055] backdrop-blur-3xl">
              <StarsIcon size={16} />
              {t('products.aiImport.button')}
            </span>
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('products.aiImport.dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('products.aiImport.dialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {products.length === 0 && (
            <FileUploader
              value={files}
              onValueChange={setFiles}
              maxFiles={4}
              maxSize={5 * 1024 * 1024} // 5MB
              variant="image"
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
              }}
            />
          )}

          {error && <div className="text-destructive text-sm">{error}</div>}

          <ScrollArea className="max-h-[50vh] overflow-y-auto">
            {products.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {t('products.aiImport.extractedSection')}
                </h3>
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="grid gap-2">
                        <div>
                          <label className="text-sm font-medium">
                            {t('products.aiImport.fields.name')}
                          </label>
                          <Input
                            type="text"
                            value={product.name}
                            onChange={(e) => {
                              const newProducts = [...products]
                              if (newProducts[index]) {
                                newProducts[index].name = e.target.value
                              }
                              setProducts(newProducts)
                            }}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            {t('products.aiImport.fields.price')}
                          </label>
                          <Input
                            type="number"
                            value={product.price}
                            onChange={(e) => {
                              const newProducts = [...products]
                              if (newProducts[index]) {
                                newProducts[index].price = Number(
                                  e.target.value
                                )
                              }
                              setProducts(newProducts)
                            }}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            {t('products.aiImport.fields.description')}
                          </label>
                          <Textarea
                            maxLength={5}
                            value={product.description}
                            onChange={(e) => {
                              const newProducts = [...products]
                              if (newProducts[index]) {
                                newProducts[index].description = e.target.value
                              }
                              setProducts(newProducts)
                            }}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('products.aiImport.buttons.cancel')}
            </Button>
          </DialogClose>
          {products.length > 0 ? (
            <Button
              type="button"
              onClick={handleCreateProduct}
              disabled={creating}
            >
              {creating
                ? t('products.aiImport.buttons.saving')
                : t('products.aiImport.buttons.saveProducts')}
            </Button>
          ) : (
            <Button
              disabled={loading}
              type="button"
              onClick={extractProducts}
              className="relative inline-flex h-9 overflow-hidden rounded-lg p-[2px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#023055_0%,#fe4a49_50%,#023055_100%)]" />
              <span className="bg-background inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-1 text-sm font-medium text-[#023055] backdrop-blur-3xl">
                <StarsIcon size={16} />
                {loading
                  ? t('products.aiImport.buttons.processing')
                  : t('products.aiImport.buttons.startProcessing')}
              </span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
