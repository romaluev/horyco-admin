'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/base/dialog';
import { Button } from '@/shared/ui/base/button';
import { StarsIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FileUploader } from '@/shared/ui/file-uploader';
import {
  IProduct,
  useCreateProduct,
  useGetAllProductTypes
} from '@/entities/product';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/shared/ui/base/scroll-area';
import { IMAGE_PROMPT } from '@/features/product-form/config/constants';
import { Input, Textarea } from '@/shared/ui';

const MAX_USAGE = 5;
const AI_USAGE_KEY = 'ai_import_usage';

export const AiImportButton = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [usageCount, setUsageCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem(AI_USAGE_KEY) || '0');
    }
    return 0;
  });

  const incrementUsage = () => {
    const usageCount = parseInt(localStorage.getItem(AI_USAGE_KEY) || '0');
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem(AI_USAGE_KEY, newCount.toString());
  };
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { mutateAsync: createProduct } = useCreateProduct();
  const { data: productTypes } = useGetAllProductTypes();
  const router = useRouter();

  const extractProducts = async () => {
    if (files.length === 0) {
      toast.error('Добавьте хотя бы одно изображение');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const usageCount = parseInt(localStorage.getItem(AI_USAGE_KEY) || '0');
      if (usageCount >= MAX_USAGE) {
        toast.error('Достигнут лимит использования AI импорта');
        return;
      }

      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const categories =
        productTypes?.items
          .map((type) => `{name: ${type.name}, id: ${type.id}}`)
          .join(', ') || '';
      formData.append('prompt', IMAGE_PROMPT(categories));

      const response = await fetch('/api/extract-products', {
        method: 'POST',
        body: formData
      });
      incrementUsage();

      if (!response.ok) {
        throw new Error('Ошибка при извлечении данных');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      toast.error('Ошибка при извлечении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    setCreating(true);
    try {
      for (const product of products) {
        await createProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock || 10,
          status: product.status || 'active',
          productTypeId: product.productTypeId || 1,
          additions: product.additions || []
        });
      }

      toast.success('Товары успешно созданы');
      router.push('/dashboard/products');
    } catch (err) {
      toast.error('Ошибка при создании товаров');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog>
      {usageCount < MAX_USAGE ? (
        <DialogTrigger asChild>
          <Button className='relative inline-flex h-9 overflow-hidden rounded-lg p-[2px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none'>
            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#023055_0%,#fe4a49_50%,#023055_100%)]' />
            <span className='bg-background inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-1 text-sm font-medium text-[#023055] backdrop-blur-3xl'>
              <StarsIcon size={16} />
              Добавить с AI
            </span>
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Импортируйте меню прямо из фото</DialogTitle>
          <DialogDescription>
            Загрузите до 4 изображений меню или товаров для автоматического
            извлечения данных с помощью AI
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {products.length === 0 && (
            <FileUploader
              value={files}
              onValueChange={setFiles}
              maxFiles={4}
              maxSize={5 * 1024 * 1024} // 5MB
              variant='image'
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png', '.webp']
              }}
            />
          )}

          {error && <div className='text-destructive text-sm'>{error}</div>}

          <ScrollArea className='max-h-[50vh] overflow-y-auto'>
            {products.length > 0 && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Извлеченные товары</h3>
                <div className='space-y-4'>
                  {products.map((product, index) => (
                    <div key={index} className='rounded-lg border p-4'>
                      <div className='grid gap-2'>
                        <div>
                          <label className='text-sm font-medium'>
                            Название
                          </label>
                          <Input
                            type='text'
                            value={product.name}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[index].name = e.target.value;
                              setProducts(newProducts);
                            }}
                            className='mt-1 w-full rounded-md border px-3 py-2'
                          />
                        </div>
                        <div>
                          <label className='text-sm font-medium'>Цена</label>
                          <Input
                            type='number'
                            value={product.price}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[index].price = Number(e.target.value);
                              setProducts(newProducts);
                            }}
                            className='mt-1 w-full rounded-md border px-3 py-2'
                          />
                        </div>
                        <div>
                          <label className='text-sm font-medium'>
                            Описание
                          </label>
                          <Textarea
                            maxLength={5}
                            value={product.description}
                            onChange={(e) => {
                              const newProducts = [...products];
                              newProducts[index].description = e.target.value;
                              setProducts(newProducts);
                            }}
                            className='mt-1 w-full rounded-md border px-3 py-2'
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

        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Отмена
            </Button>
          </DialogClose>
          {products.length > 0 ? (
            <Button
              type='button'
              onClick={handleCreateProduct}
              disabled={creating}
            >
              {creating ? 'Сохранение...' : 'Сохранить товары'}
            </Button>
          ) : (
            <Button
              disabled={loading}
              type='button'
              onClick={extractProducts}
              className='relative inline-flex h-9 overflow-hidden rounded-lg p-[2px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none'
            >
              <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#023055_0%,#fe4a49_50%,#023055_100%)]' />
              <span className='bg-background inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-1 text-sm font-medium text-[#023055] backdrop-blur-3xl'>
                <StarsIcon size={16} />
                {loading ? 'Обработка...' : 'Начать обработку'}
              </span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
