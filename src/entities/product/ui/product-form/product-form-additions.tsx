'use client';

import { Button } from '@/shared/ui/base/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { Input } from '@/shared/ui/base/input';
import { Checkbox } from '@/shared/ui/base/checkbox';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/shared/ui/base/label';
import { Card, CardContent } from '@/shared/ui/base/card';
import { useState } from 'react';

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
      additionProducts: []
    });
    setExpandedAddition(fields.length);
  };

  return (
    <div className='space-y-4 md:col-span-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Product Additions</h3>
        <Button
          type='button'
          variant='outline'
          onClick={addNewAddition}
          size='sm'
        >
          <Plus className='mr-1 h-4 w-4' /> Add Option
        </Button>
      </div>

      {fields.map((field, index) => (
        <Card key={field.id} className='overflow-hidden'>
          <div
            className='flex cursor-pointer items-center justify-between bg-slate-50 px-4 py-3'
            onClick={() => toggleExpanded(index)}
          >
            <span className='font-medium'>
              {form.watch(`additions.${index}.name`) || `Addition ${index + 1}`}
            </span>
            <Button
              variant='ghost'
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
            <CardContent className='pt-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name={`additions.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Addition Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='E.g., Choose Meat Type'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex items-end gap-4'>
                  <FormField
                    control={form.control}
                    name={`additions.${index}.isRequired`}
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Required Selection</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`additions.${index}.isMultiple`}
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Allow Multiple</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`additions.${index}.limit`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selection Limit</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='1'
                          placeholder='Max items to select'
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
              </div>

              {/* Addition Products Section */}
              <div className='mt-6'>
                <div className='mb-3 flex items-center justify-between'>
                  <Label>Addition Items</Label>
                  <AdditionProductButtons index={index} />
                </div>
                <ProductAdditionItems additionIndex={index} />
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {fields.length === 0 && (
        <div className='rounded-md border border-dashed p-4 text-center text-gray-500'>
          No additions added. Click `&quot; `Add Option `&quot;` to create
          product variations or additions.
        </div>
      )}
    </div>
  );
}

function AdditionProductButtons({ index }: { index: number }) {
  const form = useFormContext();
  const { append } = useFieldArray({
    control: form.control,
    name: `additions.${index}.additionProducts`
  });

  const addItem = () => {
    append({ name: '', price: 0 });
  };

  return (
    <Button type='button' variant='outline' onClick={addItem} size='sm'>
      <Plus className='mr-1 h-4 w-4' /> Add Item
    </Button>
  );
}

function ProductAdditionItems({ additionIndex }: { additionIndex: number }) {
  const form = useFormContext();
  const { fields, remove } = useFieldArray({
    control: form.control,
    name: `additions.${additionIndex}.additionProducts`
  });

  if (fields.length === 0) {
    return (
      <div className='rounded-md border border-dashed p-3 text-center text-gray-500'>
        No items added yet. Add items that customers can select.
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {fields.map((field, productIndex) => (
        <div key={field.id} className='flex items-center gap-3'>
          <FormField
            control={form.control}
            name={`additions.${additionIndex}.additionProducts.${productIndex}.name`}
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormControl>
                  <Input placeholder='Item name' {...field} />
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
                    placeholder='Price'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => remove(productIndex)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ))}
    </div>
  );
}
