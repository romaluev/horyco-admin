'use client';

import React from 'react';
import { Button } from '@/shared/ui/base/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { Sorting } from '@/shared/lib/table-params';

export interface SortProperty {
  value: string;
  label: string;
}

interface TableSortingProps {
  properties: SortProperty[];
  sorting: Sorting | null;
  onChange: (sorting: Sorting | null) => void;
}

export const TableSorting: React.FC<TableSortingProps> = ({
  properties,
  sorting,
  onChange
}) => {
  const handlePropertyChange = (property: string) => {
    if (sorting?.property === property) {
      // If same property, toggle direction
      const newDirection = sorting.direction === 'asc' ? 'desc' : 'asc';
      onChange({ property, direction: newDirection });
    } else {
      // New property, default to ascending
      onChange({ property, direction: 'asc' });
    }
  };

  const handleDirectionChange = (direction: 'asc' | 'desc') => {
    if (sorting) {
      onChange({ ...sorting, direction });
    }
  };

  const clearSorting = () => {
    onChange(null);
  };

  const getSortIcon = () => {
    if (!sorting) return <ArrowUpDown className='h-4 w-4' />;
    return sorting.direction === 'asc' ? (
      <ArrowUp className='h-4 w-4' />
    ) : (
      <ArrowDown className='h-4 w-4' />
    );
  };

  const getSortLabel = () => {
    if (!sorting) return 'Sort';
    const property = properties.find((p) => p.value === sorting.property);
    return `${property?.label || sorting.property} (${sorting.direction.toUpperCase()})`;
  };

  return (
    <div className='flex items-center gap-2'>
      {/* Sort property selector */}
      <Select
        value={sorting?.property || ''}
        onValueChange={handlePropertyChange}
      >
        <SelectTrigger className='w-40'>
          <div className='flex items-center gap-2'>
            {getSortIcon()}
            <span className='truncate'>{getSortLabel()}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {properties.map((property) => (
            <SelectItem key={property.value} value={property.value}>
              <div className='flex items-center gap-2'>
                {sorting?.property === property.value && getSortIcon()}
                {property.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Direction toggle (only show when sorted) */}
      {sorting && (
        <>
          <Select
            value={sorting.direction}
            onValueChange={handleDirectionChange}
          >
            <SelectTrigger className='w-20'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='asc'>
                <div className='flex items-center gap-2'>
                  <ArrowUp className='h-4 w-4' />
                  ASC
                </div>
              </SelectItem>
              <SelectItem value='desc'>
                <div className='flex items-center gap-2'>
                  <ArrowDown className='h-4 w-4' />
                  DESC
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Clear button */}
          <Button
            variant='ghost'
            size='sm'
            onClick={clearSorting}
            className='h-8 w-8 p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        </>
      )}
    </div>
  );
};
