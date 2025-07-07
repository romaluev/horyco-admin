import { toast } from 'sonner';
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
import { useDeleteProduct } from '@/entities/product/model';

export const DeleteProductButton = ({ id }: { id: number }) => {
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      toast.error('Продукт успешно удален');
    } catch {
      toast.error('Ошибка при удалении продукта');
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
          <DialogTitle>Вы уверены что хотите удалить продукт?</DialogTitle>
          <DialogDescription>Продукт будет полностью удален</DialogDescription>
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
