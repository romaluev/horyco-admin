'use client';

import { useState } from 'react';

import { Check, Plus, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/shared/ui/base/button';
import {
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


import {
  useCreateProductType,
  useGetAllProductTypes
} from '@/entities/product';

export const ProductFormType = () => {
  const form = useFormContext();
  const { data: productTypes, refetch: refetchProductTypes } =
    useGetAllProductTypes();
  const { mutateAsync: createProductType } = useCreateProductType();

  const [newCategory, setNewCategory] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleNewCategory = async () => {
    if (!newCategory) {
      setNewCategory(true);
    } else {
      if (!newName || !newDescription) return;

      const newType = { name: newName, description: newDescription };
      try {
        const res = await createProductType(newType);
        await refetchProductTypes();
        clearNewCategory();
        form.setValue('productTypeId', res.id);
        form.trigger('productTypeId');
      } catch {}
    }
  };

  const clearNewCategory = () => {
    setNewCategory(false);
    setNewName('');
    setNewDescription('');
  };

  return (
    <FormField
      control={form.control}
      name='productTypeId'
      render={({ field }) => (
        <FormItem className='md:col-span-3'>
          <FormLabel>Тип продукта</FormLabel>
          <div className='flex gap-1'>
            {newCategory ? (
              <>
                <FormControl>
                  <Input
                    placeholder='Название'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewName(e.target.value)
                    }
                  />
                </FormControl>
                <FormControl>
                  <Input
                    placeholder='Описание'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewDescription(e.target.value)
                    }
                  />
                </FormControl>

                <Button
                  type='button'
                  onClick={clearNewCategory}
                  variant='outline'
                >
                  <X />
                </Button>
                <Button
                  type='button'
                  onClick={handleNewCategory}
                  variant='outline'
                >
                  <Check />
                </Button>
              </>
            ) : (
              <>
                <div className='w-full'>
                  <Select
                    onValueChange={(value) => {
                      form.setValue('productTypeId', Number(value));
                      form.trigger('productTypeId');
                    }}
                    defaultValue={field.value ? `${field.value  }` : undefined}
                    value={field.value ? `${field.value  }` : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Выберите категорию' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productTypes?.items.map((type) => (
                        <SelectItem key={type.id} value={`${type.id  }`}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </div>

                <Button
                  type='button'
                  onClick={handleNewCategory}
                  variant='outline'
                >
                  Новая <Plus />
                </Button>
              </>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};
