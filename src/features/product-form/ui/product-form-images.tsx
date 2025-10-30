'use client';

import * as React from 'react';

import { useFormContext } from 'react-hook-form';

import { MAX_FILE_SIZE } from '@/shared/config/data';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/base/form';
import { FileUploader } from '@/shared/ui/file-uploader';


import type { IFile } from '@/shared/types';


export function ProductFormImages({
  images,
  setDeletedImages
}: {
  images?: IFile[];
  setDeletedImages?: React.Dispatch<React.SetStateAction<number[]>>;
}) {
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
              setDeletedFiles={setDeletedImages}
              variant='image'
              uploadedFiles={images}
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
