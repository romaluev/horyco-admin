'use client';

import React, { useState } from 'react';
import { IProductType } from '../../model/types';
import { useDeleteProductType } from '../../model/mutations-product-type';
import { useGetAllProductTypes } from '../../model/queries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/base/table';
import { Button } from '@/shared/ui/base/button';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ProductTypeForm } from './product-type-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/base/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/shared/ui/base/alert-dialog';
import { useTranslation } from 'react-i18next';

export const ProductTypeTable = () => {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetAllProductTypes();
  const { mutate: deleteProductType } = useDeleteProductType();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProductType, setCurrentProductType] =
    useState<IProductType | null>(null);

  if (isLoading) {
    return <div>{t('dashboard.products.types.table.loading')}</div>;
  }

  const handleEdit = (productType: IProductType) => {
    setCurrentProductType(productType);
    setIsFormOpen(true);
  };

  const handleDelete = (productType: IProductType) => {
    setCurrentProductType(productType);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentProductType) {
      deleteProductType(String(currentProductType.id));
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              {t('dashboard.products.types.table.columns.id')}
            </TableHead>
            <TableHead>
              {t('dashboard.products.types.table.columns.name')}
            </TableHead>
            <TableHead>
              {t('dashboard.products.types.table.columns.description')}
            </TableHead>
            <TableHead>
              {t('dashboard.products.types.table.columns.actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {response?.items &&
            response.items.map((productType: IProductType) => (
              <TableRow key={productType.id}>
                <TableCell>{productType.id}</TableCell>
                <TableCell>{productType.name}</TableCell>
                <TableCell>{productType.description}</TableCell>
                <TableCell className='space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleEdit(productType)}
                  >
                    <IconEdit size={16} />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDelete(productType)}
                  >
                    <IconTrash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProductType
                ? t('dashboard.products.types.form.title.edit')
                : t('dashboard.products.types.form.title.create')}
            </DialogTitle>
          </DialogHeader>
          <ProductTypeForm
            initialData={currentProductType}
            onSuccess={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('dashboard.products.types.delete.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.products.types.delete.description', {
                name: currentProductType?.name
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('common.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
