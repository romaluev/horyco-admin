import { IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/base/button';
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

import { useDeleteEmployer } from '../model/mutations';


export const DeleteEmployeeButton = ({ id }: { id: number }) => {
  const { mutateAsync: deleteTable } = useDeleteEmployer();

  const handleDelete = async () => {
    try {
      await deleteTable(id);
      toast.error('Сотрудник успешно удален');
    } catch {
      toast.error('Ошибка при удалении сотрудника');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className='justify-start'>
          <IconTrash className='mr-2 h-4 w-4' /> Удалить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы уверены что хотите удалить сотрудника?</DialogTitle>
          <DialogDescription>
            Сотрудник будет полностью удален
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Отменить
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type='button' onClick={handleDelete} variant='destructive'>
              Удалить
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
