/**
 * Update Modifier Group Dialog
 * Dialog for updating an existing modifier group
 */

'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/base/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/base/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import { Switch } from '@/shared/ui/base/switch';
import { Textarea } from '@/shared/ui/base/textarea';

import { useUpdateModifierGroup } from '@/entities/modifier-group';

import {
  modifierGroupSchema,
  type ModifierGroupFormValues
} from '../model/contract';

import type { IModifierGroup } from '@/entities/modifier-group';
import type { JSX } from 'react';

interface UpdateModifierGroupDialogProps {
  group: IModifierGroup;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateModifierGroupDialog = ({
  group,
  isOpen,
  onClose
}: UpdateModifierGroupDialogProps) => {
  const { mutate: updateGroup, isPending } = useUpdateModifierGroup();

  const form = useForm<ModifierGroupFormValues>({
    resolver: zodResolver(modifierGroupSchema),
    defaultValues: {
      name: group.name,
      description: group.description || '',
      isRequired: group.isRequired,
      minSelection: group.minSelection,
      maxSelection: group.maxSelection,
      sortOrder: group.sortOrder || 0
    }
  });

  // Reset form when group changes
  useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        description: group.description || '',
        isRequired: group.isRequired,
        minSelection: group.minSelection,
        maxSelection: group.maxSelection,
        sortOrder: group.sortOrder || 0
      });
    }
  }, [group, form]);

  const handleSubmit = (values: ModifierGroupFormValues): void => {
    updateGroup(
      { id: group.id, data: values },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать группу модификаторов</DialogTitle>
          <DialogDescription>
            Измените параметры группы модификаторов
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Соусы" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Выберите соус к блюду"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мин. выбор</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Минимальное кол-во выборов
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Макс. выбор</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Максимальное кол-во выборов
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Порядок сортировки</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Порядок отображения группы
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Обязательно</FormLabel>
                    <FormDescription>
                      Клиент должен выбрать хотя бы один модификатор
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Обновление...' : 'Обновить'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
