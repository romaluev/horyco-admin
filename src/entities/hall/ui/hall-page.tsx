'use client';

import React, { useState } from 'react';

import { IconPlus } from '@tabler/icons-react';

import { Button } from '@/shared/ui/base/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/base/dialog';

import { HallForm } from './hall-form';
import { HallTable } from './hall-table';

export const HallPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Залы</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <IconPlus className='mr-2' size={16} />
          Добавить зал
        </Button>
      </div>

      <HallTable />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавление нового зала</DialogTitle>
          </DialogHeader>
          <HallForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
