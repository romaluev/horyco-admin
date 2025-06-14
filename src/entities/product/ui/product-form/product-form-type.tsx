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
import { Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { productAPi, useGetAllProductTypes } from '@/entities/product/model';
import { useQueryClient } from '@tanstack/react-query';
import { productKeys } from '../../model/query-keys';

export const ProductFormType = () => {
  const form = useFormContext();
  const queryClient = useQueryClient();
  const { data: productTypes } = useGetAllProductTypes();

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
        const res = await productAPi.createProductTypes(newType);
        queryClient.invalidateQueries({ queryKey: productKeys.productTypes() });
        clearNewCategory();
        form.setValue('productTypeId', res.id);
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
          <FormLabel>Product Type</FormLabel>
          <div className='flex gap-1'>
            {newCategory ? (
              <>
                <FormControl>
                  <Input
                    placeholder='Name'
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewName(e.target.value)
                    }
                  />
                </FormControl>
                <FormControl>
                  <Input
                    placeholder='Description'
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
                    onValueChange={(value) =>
                      form.setValue('productTypeId', Number(value))
                    }
                    defaultValue={field.value}
                    value={field.value + ''}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Enter product type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productTypes?.items.map((type) => (
                        <SelectItem key={type.id} value={type.id + ''}>
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
                  New <Plus />
                </Button>
              </>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};
