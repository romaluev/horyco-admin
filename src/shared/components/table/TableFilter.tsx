'use client';

import React, { useState, useMemo } from 'react';
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
import { X, Filter, Plus } from 'lucide-react';
import {
  Filter as FilterType,
  FilterRule,
  getFilterRuleDisplayName
} from '@/shared/lib/table-params';

// Property definition for filter dropdown
export interface FilterProperty {
  value: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: { value: string; label: string }[];
}

interface TableFilterProps {
  properties: FilterProperty[];
  filters: FilterType[];
  onChange: (filters: FilterType[]) => void;
  onClear: () => void;
}

// Filter rules that don't require a value
const NULL_RULES = [FilterRule.IS_NULL, FilterRule.IS_NOT_NULL];

export const TableFilter: React.FC<TableFilterProps> = ({
  properties,
  filters,
  onChange,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Available filter rules
  const filterRules = useMemo(() => {
    return Object.values(FilterRule).map((rule) => ({
      value: rule,
      label: getFilterRuleDisplayName(rule)
    }));
  }, []);

  // Add new filter
  const addFilter = () => {
    const newFilter: FilterType = {
      property: properties[0]?.value || '',
      rule: FilterRule.EQUALS,
      value: ''
    };
    onChange([...filters, newFilter]);
  };

  // Update filter at specific index
  const updateFilter = (index: number, updatedFilter: Partial<FilterType>) => {
    const newFilters = filters.map((filter, i) =>
      i === index ? { ...filter, ...updatedFilter } : filter
    );
    onChange(newFilters);
  };

  // Remove filter at specific index
  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    onChange(newFilters);
  };

  // Get property definition by value
  const getPropertyByValue = (value: string): FilterProperty | undefined => {
    return properties.find((prop) => prop.value === value);
  };

  // Render filter value input based on property type and rule
  const renderValueInput = (filter: FilterType, index: number) => {
    const property = getPropertyByValue(filter.property);
    const requiresValue = !NULL_RULES.includes(filter.rule);

    if (!requiresValue) {
      return null;
    }

    // Handle select type properties
    if (property?.type === 'select' && property.options) {
      return (
        <Select
          value={filter.value || ''}
          onValueChange={(value) => updateFilter(index, { value })}
        >
          <SelectTrigger className='w-32'>
            <SelectValue placeholder='Select value' />
          </SelectTrigger>
          <SelectContent>
            {property.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Handle IN and NOT_IN rules (comma-separated values)
    const isMultiValue = [FilterRule.IN, FilterRule.NOT_IN].includes(
      filter.rule
    );
    const placeholder = isMultiValue ? 'value1,value2,value3' : 'Enter value';

    return (
      <Input
        type={property?.type === 'number' ? 'number' : 'text'}
        placeholder={placeholder}
        value={filter.value || ''}
        onChange={(e) => updateFilter(index, { value: e.target.value })}
        className='w-32'
      />
    );
  };

  const hasActiveFilters = filters.length > 0;

  return (
    <div className='flex items-center gap-2'>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={hasActiveFilters ? 'default' : 'outline'}
            size='sm'
            className='h-8 border-dashed'
          >
            <Filter className='mr-2 h-4 w-4' />
            Filter
            {hasActiveFilters && (
              <span className='bg-background ml-1 rounded px-1 py-0.5 font-mono text-xs'>
                {filters.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80 p-4' align='start'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h4 className='font-medium'>Filter Options</h4>
              {hasActiveFilters && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>

            {filters.map((filter, index) => (
              <div
                key={index}
                className='flex items-center gap-2 rounded border p-2'
              >
                {/* Property selector */}
                <Select
                  value={filter.property}
                  onValueChange={(value) =>
                    updateFilter(index, { property: value })
                  }
                >
                  <SelectTrigger className='w-24'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.value} value={property.value}>
                        {property.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Rule selector */}
                <Select
                  value={filter.rule}
                  onValueChange={(value) =>
                    updateFilter(index, { rule: value as FilterRule })
                  }
                >
                  <SelectTrigger className='w-28'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterRules.map((rule) => (
                      <SelectItem key={rule.value} value={rule.value}>
                        {rule.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Value input */}
                {renderValueInput(filter, index)}

                {/* Remove button */}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => removeFilter(index)}
                  className='h-8 w-8 p-0'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ))}

            {/* Add filter button */}
            <Button
              variant='outline'
              size='sm'
              onClick={addFilter}
              className='w-full'
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Filter
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-1'>
          {filters.map((filter, index) => {
            const property = getPropertyByValue(filter.property);
            const ruleLabel = getFilterRuleDisplayName(filter.rule);
            const requiresValue = !NULL_RULES.includes(filter.rule);

            return (
              <div
                key={index}
                className='flex items-center gap-1 rounded-md border px-2 py-1 text-xs'
              >
                <span className='font-medium'>
                  {property?.label || filter.property}
                </span>
                <span className='text-muted-foreground'>{ruleLabel}</span>
                {requiresValue && filter.value && (
                  <span className='font-mono'>{filter.value}</span>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => removeFilter(index)}
                  className='h-4 w-4 p-0'
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
