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

export const ProductTypeTable = () => {
  const { data: response, isLoading } = useGetAllProductTypes();
  const { mutate: deleteProductType } = useDeleteProductType();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProductType, setCurrentProductType] =
    useState<IProductType | null>(null);

  if (isLoading) {
    return <div>Загрузка категорий...</div>;
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
            <TableHead>ID</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Действия</TableHead>
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
                ? 'Редактирование категории'
                : 'Добавление новой категории'}
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
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить категорию "
              {currentProductType?.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
