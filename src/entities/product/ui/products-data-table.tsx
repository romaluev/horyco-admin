/**
 * Products Data Table Component
 * DataTable with inline editing for price and availability
 */

'use client';

import { useMemo, useState } from 'react';

import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef
} from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { Button } from '@/shared/ui/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/base/dropdown-menu';
import { Switch } from '@/shared/ui/base/switch';
import { DataTable } from '@/shared/ui/base/table/data-table';

import {
  useUpdateProductPrice,
  useUpdateProductAvailability,
  useDeleteProduct,
  type IProduct
} from '@/entities/product';

import type { JSX } from 'react';

interface ProductsDataTableProps {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onEdit?: (product: IProduct) => void;
}

export const ProductsDataTable = ({
  data,
  total,
  page,
  limit,
  onPageChange,
  onEdit
}: ProductsDataTableProps) => {
  const { mutate: updatePrice } = useUpdateProductPrice();
  const { mutate: updateAvailability } = useUpdateProductAvailability();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [editingPrice, setEditingPrice] = useState<number | null>(null);
  const [priceValue, setPriceValue] = useState<string>('');

  const handlePriceEdit = (product: IProduct): void => {
    setEditingPrice(product.id);
    setPriceValue(product.price.toString());
  };

  const handlePriceSave = (productId: number): void => {
    const newPrice = parseFloat(priceValue);
    if (!isNaN(newPrice) && newPrice >= 0) {
      updatePrice({ id: productId, data: { price: newPrice } });
    }
    setEditingPrice(null);
  };

  const handleAvailabilityToggle = (
    productId: number,
    isAvailable: boolean
  ): void => {
    updateAvailability({ id: productId, data: { isAvailable } });
  };

  const columns: ColumnDef<IProduct>[] = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: 'Фото',
        cell: ({ row }) => {
          const image = row.original.image;
          return image ? (
            <img
              src={image}
              alt={row.original.name}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-muted" />
          );
        }
      },
      {
        accessorKey: 'name',
        header: 'Название'
      },
      {
        accessorKey: 'categoryName',
        header: 'Категория',
        cell: ({ row }) => {
          return row.original.categoryName || '—';
        }
      },
      {
        accessorKey: 'price',
        header: 'Цена',
        cell: ({ row }) => {
          const product = row.original;
          const isEditing = editingPrice === product.id;

          if (isEditing) {
            return (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  onBlur={() => handlePriceSave(product.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePriceSave(product.id);
                    if (e.key === 'Escape') setEditingPrice(null);
                  }}
                  className="w-20 rounded border px-2 py-1 text-sm"
                  autoFocus
                />
                <span>₽</span>
              </div>
            );
          }

          return (
            <button
              onClick={() => handlePriceEdit(product)}
              className="hover:text-primary"
            >
              {product.price} ₽
            </button>
          );
        }
      },
      {
        accessorKey: 'isAvailable',
        header: 'Доступность',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <Switch
              checked={product.isAvailable}
              onCheckedChange={(checked) =>
                handleAvailabilityToggle(product.id, checked)
              }
            />
          );
        }
      },
      {
        accessorKey: 'preparationTime',
        header: 'Время',
        cell: ({ row }) => {
          const time = row.original.preparationTime;
          return time ? `${time} мин` : '—';
        }
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const product = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(product)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteProduct(product.id)}
                  className="text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
      }
    ],
    [editingPrice, priceValue, onEdit, updatePrice, updateAvailability, deleteProduct]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / limit),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: page - 1, pageSize: limit });
        onPageChange(newState.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true
  });

  return <DataTable table={table} />;
};
