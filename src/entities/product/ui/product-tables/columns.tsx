'use client';
import { DataTableColumnHeader } from '@/shared/ui/base/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { IProduct } from '../../model';

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: 'photo_url',
    header: 'Image',
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square'>
          <Image
            src={row.getValue('photo_url')}
            alt={row.getValue('name')}
            fill
            className='rounded-lg'
          />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<IProduct, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<IProduct['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search products...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  // {
  //   id: 'category',
  //   accessorKey: 'category',
  //   header: ({ column }: { column: Column<IProduct, unknown> }) => (
  //     <DataTableColumnHeader column={column} title='Category' />
  //   ),
  //   cell: ({ cell }) => {
  //     const status = cell.getValue<IProduct['createdBy']>();
  //     const Icon = status === 'active' ? CheckCircle2 : XCircle;

  //     return (
  //       <Badge variant='outline' className='capitalize'>
  //         <Icon />
  //         {status}
  //       </Badge>
  //     );
  //   },
  //   enableColumnFilter: true,
  //   meta: {
  //     label: 'categories',
  //     variant: 'multiSelect',
  //     options: CATEGORY_OPTIONS
  //   }
  // },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
