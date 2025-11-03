import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from '@/shared/ui';

import { useCreateRole } from '@/entities/role';

import { PermissionSelector } from './permission-selector';
import { createRoleSchema } from '../model/contract';

import type { CreateRoleFormData } from '../model/contract';

export const CreateRoleDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissionIds: [],
    },
  });

  const { mutate: createRole, isPending } = useCreateRole();

  const onSubmit = (data: CreateRoleFormData): void => {
    createRole(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='h-4 w-4' />
          Создать роль
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Создать роль</DialogTitle>
          <DialogDescription>
            Создайте новую роль с определенными разрешениями
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-6 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>
                Название <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='name'
                {...form.register('name')}
                placeholder='Например: Менеджер зала'
                className='text-base md:text-sm'
              />
              {form.formState.errors.name && (
                <p className='text-destructive text-sm'>{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Описание</Label>
              <Textarea
                id='description'
                {...form.register('description')}
                placeholder='Краткое описание роли'
                className='min-h-[80px] text-base md:text-sm'
              />
            </div>

            <PermissionSelector form={form} />
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isPending ? 'Создание...' : 'Создать роль'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
