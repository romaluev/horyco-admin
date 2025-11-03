/**
 * Products Page
 * Main page for managing products with filters and pagination
 */

'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { BaseLoading } from '@/shared/ui'
import { Button } from '@/shared/ui/base/button';
import { Input } from '@/shared/ui/base/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import PageContainer from '@/shared/ui/layout/page-container';

import { useGetCategories } from '@/entities/category';
import { useGetProducts } from '@/entities/product';
import { ProductsDataTable } from '@/entities/product/ui/products-data-table';
import { UpdateProductDialog } from '@/features/product-form';

import type { IProduct } from '@/entities/product';
import type { JSX } from 'react';

export default function ProductsPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const limit = 20;

  // Build query params
  const queryParams = {
    page,
    limit,
    ...(search && { q: search }),
    ...(categoryFilter !== 'all' && { categoryId: Number(categoryFilter) }),
    ...(availabilityFilter !== 'all' && {
      available: availabilityFilter === 'available'
    })
  };

  const { data: productsData, isLoading, error } = useGetProducts(queryParams);
  const { data: categories = [] } = useGetCategories();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="w-full">
          <BaseLoading />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="w-full">
          <div className="flex h-64 items-center justify-center rounded-lg border border-destructive">
            <div className="text-center">
              <p className="text-lg font-medium text-destructive">
                Ошибка загрузки продуктов
              </p>
              <p className="text-sm text-muted-foreground">
                {error.message || 'Неизвестная ошибка'}
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  const products = productsData?.data || [];
  const total = productsData?.total || 0;

  return (
    <PageContainer>
      <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Продукты</h2>
          <p className="text-muted-foreground">
            Управляйте продуктами вашего меню
          </p>
        </div>
        <Link href="/dashboard/menu/products/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Создать продукт
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            className="max-w-sm"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={availabilityFilter}
          onValueChange={(value) => {
            setAvailabilityFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="available">Доступные</SelectItem>
            <SelectItem value="unavailable">Недоступные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border px-6 py-4">
          <p className="text-sm font-medium text-muted-foreground">
            Всего продуктов
          </p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="rounded-lg border px-6 py-4">
          <p className="text-sm font-medium text-muted-foreground">
            Доступных (на странице)
          </p>
          <p className="text-2xl font-bold">
            {products.filter((p) => p.isAvailable).length}
          </p>
        </div>
        <div className="rounded-lg border px-6 py-4">
          <p className="text-sm font-medium text-muted-foreground">
            Недоступных (на странице)
          </p>
          <p className="text-2xl font-bold">
            {products.filter((p) => !p.isAvailable).length}
          </p>
        </div>
        <div className="rounded-lg border px-6 py-4">
          <p className="text-sm font-medium text-muted-foreground">
            Страница
          </p>
          <p className="text-2xl font-bold">
            {page} / {Math.ceil(total / limit) || 1}
          </p>
        </div>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Продукты не найдены
            </p>
            <p className="text-sm text-muted-foreground">
              Создайте первый продукт или измените фильтры
            </p>
          </div>
        </div>
      ) : (
        <ProductsDataTable
          data={products}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onEdit={(product) => setEditingProduct(product)}
        />
      )}

      {/* Update Product Dialog */}
      {editingProduct && (
        <UpdateProductDialog
          productId={editingProduct.id}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
      </div>
    </PageContainer>
  );
}
