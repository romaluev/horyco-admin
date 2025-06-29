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
import { Trash } from 'lucide-react';
import { useDeleteTable } from '@/entities/table/model';
import { toast } from 'sonner';

export const DeleteTableButton = ({ id }: { id: number }) => {
  const { mutateAsync: deleteTable } = useDeleteTable();

  const handleDelete = async () => {
    try {
      await deleteTable(id);
      toast.error('Стол успешно удален');
    } catch {
      toast.error('Ошибка при удалении стола');
    }
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
          <DialogDescription>Стол будет полностью удален</DialogDescription>
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
