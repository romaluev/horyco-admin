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
import { useTranslation } from 'react-i18next';

export const ProductTypePage = () => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className='container mx-auto space-y-4 p-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>
          {t('dashboard.products.types.title')}
        </h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <IconPlus className='mr-2' size={18} />
          {t('dashboard.products.types.addNew')}
        </Button>
      </div>

      <ProductTypeTable />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('dashboard.products.types.form.title.create')}
            </DialogTitle>
          </DialogHeader>
          <ProductTypeForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
