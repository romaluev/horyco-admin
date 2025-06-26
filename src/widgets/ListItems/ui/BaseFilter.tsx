'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/shared/ui/base/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { Input } from '@/shared/ui/base/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/ui/base/popover';
import { X, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Filter rules matching backend FilterRule enum
const filterRules = [
  { value: 'eq', label: 'Equals' },
  { value: 'neq', label: 'Not Equals' },
  { value: 'gt', label: 'Greater Than' },
  { value: 'gte', label: 'Greater Than or Equals' },
  { value: 'lt', label: 'Less Than' },
  { value: 'lte', label: 'Less Than or Equals' },
  { value: 'like', label: 'Like' },
  { value: 'nlike', label: 'Not Like' },
  { value: 'in', label: 'In' },
  { value: 'nin', label: 'Not In' },
  { value: 'isnull', label: 'Is Null' },
  { value: 'isnotnull', label: 'Is Not Null' }
];

// Type for individual ListItems
interface Filter {
  property: string;
  rule: string;
  value: string;
}

// Props for the FilterComponent
interface FilterComponentProps {
  properties: string[] | { value: string; label: string }[];
  onChange: (filterString: string, filters: Filter[]) => void;
}

export const BaseFilter: React.FC<FilterComponentProps> = ({
  properties,
  onChange
}) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Normalize properties to { value, label } format
  const normalizedProperties = properties.map((prop) =>
    typeof prop === 'string' ? { value: prop, label: prop } : prop
  );

  // Emit ListItems string to parent via onChange
  const emitFilterString = useCallback(
    (filters: Filter[]) => {
      const validFilters = filters.filter(
        (f) =>
          f.property &&
          f.rule &&
          (f.value || f.rule === 'isnull' || f.rule === 'isnotnull')
      );
      const filterString = validFilters
        .map((f) =>
          f.rule === 'isnull' || f.rule === 'isnotnull'
            ? `${f.property}:${f.rule}`
            : `${f.property}:${f.rule}:${f.value}`
        )
        .join(';');

      const params = new URLSearchParams(window.location.search);
      if (filterString) {
        params.set('filter', filterString);
      } else {
        params.delete('filter');
      }
      router.push(`?${params.toString()}`);

      onChange(filterString, validFilters);
    },
    [onChange, router]
  );

  // Update filters when initialFilters change (e.g., on URL change)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');
    if (filterParam) {
      try {
        const parsedFilters = filterParam.split(';').map((filter) => {
          const [property, rule, value] = filter.split(':');
          return {
            property,
            rule,
            value: value || '' // Empty string for isnull/isnotnull
          };
        });
        setFilters(parsedFilters);
      } catch (error) {
        console.error('Invalid ListItems parameter in URL:', error);
      }
    }
  }, []);

  // Add a new ListItems
  const addFilter = () => {
    const newFilters = [...filters, { property: '', rule: '', value: '' }];
    setFilters(newFilters);
    emitFilterString(newFilters);
  };

  // Remove a ListItems by index
  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    emitFilterString(newFilters);
  };

  // Update a ListItems field
  const updateFilter = (index: number, field: keyof Filter, value: string) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
    emitFilterString(newFilters);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <Filter className='h-4 w-4' />
          Filters {filters.length > 0 && `(${filters.length})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mr-5 w-[600px] p-4'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h4 className='font-medium'>Filters</h4>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                setFilters([]);
                onChange('', []);
              }}
            >
              Clear All
            </Button>
          </div>
          {filters.length === 0 ? (
            <p className='text-muted-foreground text-sm'>
              No filters applied. Click &#34;Add Filter&#34; to start.
            </p>
          ) : (
            filters.map((filter, index) => (
              <div key={index} className='flex items-center gap-2'>
                <Select
                  value={filter.property}
                  onValueChange={(value) =>
                    updateFilter(index, 'property', value)
                  }
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Property' />
                  </SelectTrigger>
                  <SelectContent>
                    {normalizedProperties.map((prop) => (
                      <SelectItem key={prop.value} value={prop.value}>
                        {prop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filter.rule}
                  onValueChange={(value) => updateFilter(index, 'rule', value)}
                >
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Rule' />
                  </SelectTrigger>
                  <SelectContent>
                    {filterRules.map((rule) => (
                      <SelectItem key={rule.value} value={rule.value}>
                        {rule.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filter.rule !== 'isnull' && filter.rule !== 'isnotnull' && (
                  <Input
                    placeholder='Value'
                    value={filter.value}
                    onChange={(e) =>
                      updateFilter(index, 'value', e.target.value)
                    }
                    className='w-[180px]'
                  />
                )}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => removeFilter(index)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ))
          )}
          <div className='flex gap-2'>
            <Button variant='outline' onClick={addFilter}>
              Add Filter
            </Button>
            <Button onClick={() => setIsOpen(false)}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
