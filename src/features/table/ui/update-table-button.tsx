'use client';

import { Button } from '@/shared/ui/base/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/base/dialog';
import { Pen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { useUpdateTable } from '@/entities/table/model/mutations';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Checkbox } from '@/shared/ui/base/checkbox';
import { useTableById } from '@/entities/table/model';
import { tableSchema } from '../model/contract';

type FormValues = z.infer<typeof tableSchema>;

export const UpdateTableButton = ({ id }: { id: number }) => {
  const [open, setOpen] = useState(false);
  const { data: table } = useTableById(id);
  const { mutate: updateTable, isPending } = useUpdateTable();

  const form = useForm<FormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: table?.name,
      size: table?.size,
      shape: table?.shape,
      xPosition: table?.xPosition,
      yPosition: table?.yPosition,
      hallId: table?.hallId,
      isAvailable: table?.isAvailable
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: table?.name,
        size: table?.size,
        shape: table?.shape,
        xPosition: table?.xPosition,
        yPosition: table?.yPosition,
        hallId: table?.hallId,
        isAvailable: table?.isAvailable
      });
    }
  }, [open, table, form]);

  const onSubmit = (data: FormValues) => {
    if (table?.id) {
      updateTable(
        { id: table?.id, data },
        {
          onSuccess: () => {
            toast.success('Стол успешно обновлен');
            setOpen(false);
          },
          onError: (error) => {
            toast.error('Ошибка при обновлении стола: ' + error.message);
          }
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='sm'>
          <Pen className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Обновить стол</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='size'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Размер</FormLabel>
                  <FormControl>
                    <Input type='number' min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='shape'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Форма</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='circle'>Круглый</SelectItem>
                      <SelectItem value='square'>Квадратный</SelectItem>
                      <SelectItem value='rectangle'>Прямоугольный</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='xPosition'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Позиция X</FormLabel>
                    <FormControl>
                      <Input type='number' min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='yPosition'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Позиция Y</FormLabel>
                    <FormControl>
                      <Input type='number' min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='hallId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Зал</FormLabel>
                  <FormControl>
                    <Input type='number' min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isAvailable'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Доступен</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? 'Обновление...' : 'Обновить стол'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
