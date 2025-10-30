'use client';

import * as React from 'react';

import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Badge } from '@/shared/ui/base/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import { ScrollArea } from '@/shared/ui/base/scroll-area';

// Типы данных для заказов
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
  customer?: {
    name: string;
    phone?: string;
  };
  type: 'delivery' | 'takeaway' | 'dine-in';
}

interface RecentOrdersProps {
  orders: RecentOrder[];
  isLoading?: boolean;
  compact?: boolean; // Компактный режим для отображения рядом с метриками
}

export function RecentOrders({
  orders,
  isLoading = false,
  compact = false
}: RecentOrdersProps) {
  // Форматирование суммы в узбекские сумы - используем статический формат
  const formatCurrency = (amount: number) => {
    // Форматируем вручную, чтобы избежать различий между сервером и клиентом
    const formattedNumber = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `UZS ${formattedNumber}`;
  };

  // Форматирование времени заказа
  const formatOrderTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return {
        time: format(date, 'HH:mm', { locale: ru }),
        relative: formatDistanceToNow(date, { addSuffix: true, locale: ru })
      };
    } catch (e) {
      return { time: '', relative: '' };
    }
  };

  // Получение типа заказа на русском
  const getOrderTypeText = (type: 'delivery' | 'takeaway' | 'dine-in') => {
    switch (type) {
      case 'delivery':
        return 'Доставка';
      case 'takeaway':
        return 'Самовывоз';
      case 'dine-in':
        return 'В зале';
      default:
        return 'Неизвестно';
    }
  };

  // Получение цвета бейджа в зависимости от типа заказа
  const getOrderTypeBadgeVariant = (
    type: 'delivery' | 'takeaway' | 'dine-in'
  ): 'default' | 'secondary' | 'outline' => {
    switch (type) {
      case 'delivery':
        return 'default';
      case 'takeaway':
        return 'secondary';
      case 'dine-in':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <div className='bg-muted h-6 w-40 animate-pulse rounded' />
          <div className='bg-muted h-4 w-56 animate-pulse rounded' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex animate-pulse flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <div className='bg-muted h-5 w-20 rounded' />
                  <div className='bg-muted h-5 w-16 rounded' />
                </div>
                <div className='bg-muted h-4 w-32 rounded' />
                <div className='bg-muted h-4 w-full rounded' />
                <div className='flex items-center justify-between'>
                  <div className='bg-muted h-4 w-24 rounded' />
                  <div className='bg-muted h-5 w-20 rounded' />
                </div>
                <div className='bg-muted h-px w-full' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-full'>
      <CardHeader className='pb-2'>
        <CardTitle>Последние заказы</CardTitle>
        {!compact && (
          <CardDescription>Информация о недавних заказах</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[450px]' scrollHideDelay={0}>
          <div className='space-y-2'>
            {orders.map((order) => {
              const { time, relative } = formatOrderTime(order.createdAt);

              return (
                <div key={order.id} className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <div className='font-medium'>№{order.orderNumber}</div>
                    <div className='text-muted-foreground text-sm'>{time}</div>
                  </div>

                  {order.customer && (
                    <div className='text-sm'>
                      {order.customer.name}
                      {order.customer.phone && (
                        <span className='text-muted-foreground ml-2'>
                          {order.customer.phone}
                        </span>
                      )}
                    </div>
                  )}

                  <div className='text-muted-foreground text-sm'>
                    {order.items.slice(0, 2).map((item, index) => (
                      <span key={index}>
                        {item.name} x{item.quantity}
                        {index < Math.min(order.items.length, 2) - 1
                          ? ', '
                          : ''}
                      </span>
                    ))}
                    {order.items.length > 2 && (
                      <span> и еще {order.items.length - 2}...</span>
                    )}
                  </div>

                  <div className='flex items-center justify-between'>
                    <Badge variant={getOrderTypeBadgeVariant(order.type)}>
                      {getOrderTypeText(order.type)}
                    </Badge>
                    <div className='font-medium'>
                      {formatCurrency(order.total)}
                    </div>
                  </div>

                  <div className='text-muted-foreground text-xs'>
                    {relative}
                  </div>

                  <div className='bg-border h-px w-full' />
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className='text-muted-foreground py-8 text-center'>
                Нет данных о последних заказах
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
