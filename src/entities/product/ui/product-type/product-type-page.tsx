'use client';

import React, { useState } from 'react';
import { ProductTypeTable } from './product-type-table';
import { ProductTypeForm } from './product-type-form';
import { Button } from '@/shared/ui/base/button';
import { IconPlus } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/base/dialog';

export const ProductTypePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className='container mx-auto space-y-4 p-4'>
      <div className='flex flex-wrap items-center justify-between'>
        <h1 className='text-2xl font-bold'>Категории продуктов</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <IconPlus className='mr-2' size={18} />
          Добавить категорию
        </Button>
      </div>

      <ProductTypeTable />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавление новой категории</DialogTitle>
          </DialogHeader>
          <ProductTypeForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
