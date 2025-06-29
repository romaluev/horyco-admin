import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/base/dialog';
import { Button } from '@/shared/ui/base/button';
import { Trash } from 'lucide-react';
import { useDeleteTable } from '@/entities/table/model';

export const DeleteTableButton = ({ id }: { id: number }) => {
  const { mutateAsync: deleteTable } = useDeleteTable();

  const handleDelete = () => {
    // ToDo: add notification
    deleteTable(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' size='sm'>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы уверены что хотите удалить стол?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Отменить
            </Button>
            <Button type='button' onClick={handleDelete} variant='destructive'>
              Удалить
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
