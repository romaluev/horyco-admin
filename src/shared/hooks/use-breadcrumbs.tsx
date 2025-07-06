'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Панель управления', link: '/dashboard' }],
  '/dashboard/overview': [
    { title: 'Панель управления', link: '/dashboard/overview' }
  ],
  '/dashboard/employee': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Сотрудники', link: '/dashboard/employee' }
  ],
  '/dashboard/categories': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Категории', link: '/dashboard/categories' }
  ],
  '/dashboard/branches': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Филиалы', link: '/dashboard/branches' }
  ],
  '/dashboard/halls': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Залы', link: '/dashboard/halls' }
  ],
  '/dashboard/products': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Продукты', link: '/dashboard/products' }
  ],
  '/dashboard/table': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Стол менеджмент', link: '/dashboard/table' }
  ],
  '/dashboard/profile': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Профиль', link: '/dashboard/profile' }
  ]
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
