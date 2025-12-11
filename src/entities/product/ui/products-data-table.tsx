/**
 * Products Data Table Component
 * DataTable with inline editing for price and availability
 */

'use client'

import { useMemo, useState } from 'react'

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Trash } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Switch } from '@/shared/ui/base/switch'
import { DataTable } from '@/shared/ui/base/table/data-table'
import { ImageCell } from '@/shared/ui/image-cell'

import {
  type IProduct,
  useDeleteProduct,
  useUpdateProductAvailability,
  useUpdateProduct,
} from '@/entities/product'

interface ProductsDataTableProps {
  data: IProduct[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onEdit?: (product: IProduct) => void
}

export const ProductsDataTable = ({
  data,
  total,
  page,
  limit,
  onPageChange,
  onEdit,
}: ProductsDataTableProps) => {
  const { mutate: updateProduct } = useUpdateProduct()
  const { mutate: updateAvailability } = useUpdateProductAvailability()
  const { mutate: deleteProduct } = useDeleteProduct()

  const [editingPrice, setEditingPrice] = useState<number | null>(null)
  const [priceValue, setPriceValue] = useState<string>('')
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)

  const handlePriceEdit = (product: IProduct): void => {
    setEditingPrice(product.id)
    setPriceValue(product.price.toString())
  }

  const handlePriceSave = (productId: number): void => {
    const newPrice = parseFloat(priceValue)
    if (!isNaN(newPrice) && newPrice >= 0) {
      updateProduct({ id: productId, data: { price: newPrice } })
    }
    setEditingPrice(null)
  }

  const handleAvailabilityToggle = (
    productId: number,
    isAvailable: boolean
  ): void => {
    updateAvailability({ id: productId, data: { isAvailable } })
  }

  const columns: ColumnDef<IProduct>[] = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: 'Фото',
        cell: ({ row }) => (
          <ImageCell
            imageUrls={row.original.imageUrls}
            fileId={row.original.image}
            alt={row.original.name}
            preferredVariant="thumb"
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Название',
      },
      {
        accessorKey: 'categoryName',
        header: 'Категория',
        cell: ({ row }) => {
          return row.original.categoryName || '—'
        },
      },
      {
        accessorKey: 'price',
        header: 'Цена',
        cell: ({ row }) => {
          const product = row.original
          const isEditing = editingPrice === product.id

          if (isEditing) {
            return (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  onBlur={() => handlePriceSave(product.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePriceSave(product.id)
                    if (e.key === 'Escape') setEditingPrice(null)
                  }}
                  className="w-20 rounded border px-2 py-1 text-sm"
                />
                <span>₽</span>
              </div>
            )
          }

          return (
            <button
              onClick={() => handlePriceEdit(product)}
              className="hover:text-primary"
            >
              {product.price} ₽
            </button>
          )
        },
      },
      {
        accessorKey: 'isAvailable',
        header: 'Доступность',
        cell: ({ row }) => {
          const product = row.original
          return (
            <Switch
              checked={product.isAvailable}
              onCheckedChange={(checked) =>
                handleAvailabilityToggle(product.id, checked)
              }
            />
          )
        },
      },
      {
        accessorKey: 'preparationTime',
        header: 'Время',
        cell: ({ row }) => {
          const time = row.original.preparationTime
          return time ? `${time} мин` : '—'
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const product = row.original

          return (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                onClick={() => setDeleteProductId(product.id)}
                className="text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => onEdit?.(product)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [
      editingPrice,
      priceValue,
      onEdit,
      updateProduct,
      updateAvailability,
      deleteProduct,
    ]
  )

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / limit),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: page - 1, pageSize: limit })
        onPageChange(newState.pageIndex + 1)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  return (
    <>
      <DataTable table={table} />
      <Dialog open={deleteProductId !== null} onOpenChange={() => setDeleteProductId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить продукт?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Продукт будет полностью удален.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отменить
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (deleteProductId !== null) {
                  deleteProduct(deleteProductId)
                  setDeleteProductId(null)
                }
              }}
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
