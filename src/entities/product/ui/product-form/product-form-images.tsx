'use client';

import { FileUploader } from '@/shared/ui/file-uploader';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { useFormContext } from 'react-hook-form';
import { MAX_FILE_SIZE } from '@/shared/config/data';

export default function ProductFormImages() {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name='image'
      render={({ field }) => (
        <FormItem className='md:col-span-6'>
          <FormLabel>Картинки продукта</FormLabel>
          <FormControl>
            <FileUploader
              variant='image'
              value={field.value}
              onValueChange={field.onChange}
              maxFiles={4}
              maxSize={MAX_FILE_SIZE}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
