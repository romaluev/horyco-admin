'use client';

import { useState } from 'react';

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/shared/ui/base/button';
import { Card, CardContent } from '@/shared/ui/base/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import { Label } from '@/shared/ui/base/label';
import { Switch } from '@/shared/ui/base/switch';

export function ProductFormAdditions() {
  const form = useFormContext();
  const [expandedAddition, setExpandedAddition] = useState<number | null>(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'additions'
  });

  const toggleExpanded = (index: number) => {
    if (expandedAddition === index) {
      setExpandedAddition(null);
    } else {
      setExpandedAddition(index);
    }
  };

  const addNewAddition = () => {
    append({
      name: '',
      isRequired: false,
      isMultiple: false,
      limit: 1,
      additionProducts: [
        {
          name: '',
          price: 0
        }
      ]
    });
    setExpandedAddition(fields.length);
  };

  const hasAdditionError = (index: number) => {
    // @ts-ignore
    const errors = form.formState.errors.additions?.[index];
    return errors && Object.keys(errors).length > 0;
  };

  return (
    <div className='space-y-4 md:col-span-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Дополнения</h3>
        <Button
          type='button'
          variant='outline'
          onClick={addNewAddition}
          size='sm'
        >
          <Plus className='mr-1 h-4 w-4' />
          Добавить опцию
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card
          key={field.id}
          className={`${hasAdditionError(index) ? 'border-destructive' : ''} gap-2 overflow-hidden p-2`}
        >
          <div
            className='flex cursor-pointer items-center justify-between'
            onClick={() => toggleExpanded(index)}
          >
            <span className='flex items-center gap-2 font-medium'>
              {expandedAddition === index ? (
                <ChevronUp className='mr-1 h-4 w-4' />
              ) : (
                <ChevronDown className='mr-1 h-4 w-4' />
              )}
              {form.watch(`additions.${index}.name`) ||
                `Название дополнения ${index + 1}`}
            </span>
            <Button
              variant='secondary'
              size='sm'
              type='button'
              onClick={(e) => {
                e.stopPropagation();
                remove(index);
              }}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>

          {expandedAddition === index && (
            <CardContent>
              <div className='grid grid-cols-2 items-center gap-x-2 gap-y-4'>
                <FormField
                  control={form.control}
                  name={`additions.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название дополнения</FormLabel>
                      <FormControl>
                        <Input placeholder='Например: Выбор мяса' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`additions.${index}.limit`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Лимит выбора</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='1'
                          placeholder='Максимальное количество'
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                          disabled={
                            !form.watch(`additions.${index}.isMultiple`)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`additions.${index}.isRequired`}
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Обязательный выбор</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`additions.${index}.isMultiple`}
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Множественный выбор</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <ProductAdditionItems additionIndex={index} />
            </CardContent>
          )}
        </Card>
      ))}

      {fields.length === 0 && (
        <div className='rounded-md border border-dashed p-4 text-center text-gray-500'>
          Нет дополнений. Нажмите «Добавить опцию» для создания вариаций
          продукта.
        </div>
      )}
    </div>
  );
}

function ProductAdditionItems({ additionIndex }: { additionIndex: number }) {
  const form = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: `additions.${additionIndex}.additionProducts`
  });

  const addItem = () => {
    append({
      name: '',
      price: 0
    });
  };

  return (
    <div className='mt-4 mb-2'>
      <div className='mb-3 flex items-center justify-between'>
        <Label>Элементы дополнения</Label>
        <Button type='button' variant='outline' onClick={addItem} size='sm'>
          <Plus className='mr-1 h-4 w-4' />
          Добавить элемент
        </Button>
      </div>

      <div className='space-y-3'>
        {!fields.length ? (
          <div className='rounded-md border border-dashed p-3 text-center text-gray-500'>
            Элементы не добавлены. Добавьте элементы, которые клиенты смогут
            выбрать.
          </div>
        ) : (
          fields.map((field, productIndex) => (
            <div key={field.id} className='flex gap-3'>
              <FormField
                control={form.control}
                name={`additions.${additionIndex}.additionProducts.${productIndex}.name`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='Название элемента' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`additions.${additionIndex}.additionProducts.${productIndex}.price`}
                render={({ field }) => (
                  <FormItem className='w-24'>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Цена'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => remove(productIndex)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
