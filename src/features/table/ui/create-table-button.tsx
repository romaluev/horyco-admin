'use client';

import { Button } from '@/shared/ui/base/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/base/dialog';
import { Plus } from 'lucide-react';
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
import { useCreateTable } from '@/entities/table/model/mutations';
import { useState } from 'react';
import { toast } from 'sonner';
import { tableSchema } from '@/features/table/model/contract';
import { useGetAllHalls } from '@/entities/hall/model/queries';
import { TABLE_SHAPES } from '@/features/table/model/constants';
import { Switch } from '@/shared/ui/base/switch';

type FormValues = z.infer<typeof tableSchema>;

export const CreateTableButton = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createTable, isPending } = useCreateTable();
  const { data: halls } = useGetAllHalls();

  const form = useForm<FormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: '',
      size: 1,
      shape: 'circle',
      xPosition: 0,
      yPosition: 0,
      hallId: 1,
      isAvailable: true
    }
  });

  const onSubmit = (data: FormValues) => {
    createTable(data, {
      onSuccess: () => {
        toast.success('Стол успешно создан');
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast.error('Ошибка при создании стола: ' + error.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Добавить стол
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новый стол</DialogTitle>
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
                    <Input placeholder='Стол 1' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-2'>
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
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Выберите форму' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TABLE_SHAPES.map((shape) => (
                          <SelectItem key={shape.value} value={shape.value}>
                            {shape.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                  <Select
                    onValueChange={(value) => field.onChange(+value)}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Выберите залл' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {halls?.items.map((hall) => (
                        <SelectItem key={hall.id} value={String(hall.id)}>
                          {hall.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isAvailable'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center space-y-0 space-x-1'>
                  <FormControl>
                    <Switch
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
              {isPending ? 'Создание...' : 'Создать стол'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
