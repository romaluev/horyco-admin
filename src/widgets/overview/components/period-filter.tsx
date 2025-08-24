'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/base/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/shared/ui/base/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/base/select';
import { Calendar } from '@/shared/ui/base/calendar';

export type PeriodType = 'hour' | 'day' | 'week';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface PeriodFilterProps {
  onPeriodChange: (period: PeriodType) => void;
  onDateRangeChange: (range: DateRange) => void;
  selectedPeriod: PeriodType;
  selectedRange: DateRange;
}

export function PeriodFilter({
  onPeriodChange,
  onDateRangeChange,
  selectedPeriod,
  selectedRange
}: PeriodFilterProps) {
  return (
    <div className='flex items-center gap-2'>
      <Select
        value={selectedPeriod}
        onValueChange={(value) => onPeriodChange(value as PeriodType)}
      >
        <SelectTrigger className='w-[100px]'>
          <SelectValue placeholder='Период' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='hour'>По часам</SelectItem>
          <SelectItem value='day'>По дням</SelectItem>
          <SelectItem value='week'>По неделям</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-[120px] justify-start text-left font-normal',
              !selectedRange.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {selectedRange.from ? (
              format(selectedRange.from, 'dd.MM.yy', { locale: ru })
            ) : (
              <span>От</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={selectedRange.from}
            onSelect={(date) => {
              if (date) {
                onDateRangeChange({ from: date, to: selectedRange.to });
              }
            }}
            initialFocus
            locale={ru}
            weekStartsOn={1}
            classNames={{
              caption: 'relative flex justify-center py-2',
              nav_button:
                'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 data-[dir=previous]:left-1 data-[dir=next]:right-1',
              head_row: 'flex space-between',
              head_cell:
                'w-9 font-normal text-center text-[0.8rem] text-muted-foreground',
              row: 'flex w-full mt-1',
              cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
              day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside: 'text-muted-foreground opacity-50',
              table: 'w-full border-collapse space-y-1'
            }}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-[120px] justify-start text-left font-normal',
              !selectedRange.to && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {selectedRange.to ? (
              format(selectedRange.to, 'dd.MM.yy', { locale: ru })
            ) : (
              <span>До</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={selectedRange.to}
            onSelect={(date) => {
              if (date) {
                onDateRangeChange({ from: selectedRange.from, to: date });
              }
            }}
            initialFocus
            locale={ru}
            weekStartsOn={1}
            classNames={{
              caption: 'relative flex justify-center py-2',
              nav_button:
                'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 data-[dir=previous]:left-1 data-[dir=next]:right-1',
              head_row: 'flex space-between',
              head_cell:
                'w-9 font-normal text-center text-[0.8rem] text-muted-foreground',
              row: 'flex w-full mt-1',
              cell: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
              day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside: 'text-muted-foreground opacity-50',
              table: 'w-full border-collapse space-y-1'
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
