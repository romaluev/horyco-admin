'use client'

import { useMemo } from 'react'

import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  title: string
  link: string
}

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Панель управления', link: '/dashboard' }],
  '/dashboard/overview': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Обзор', link: '/dashboard/overview' },
  ],
  '/dashboard/menu': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Меню', link: '/dashboard/menu' },
  ],
  '/dashboard/menu/products': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Меню', link: '/dashboard/menu' },
    { title: 'Продукты', link: '/dashboard/menu/products' },
  ],
  '/dashboard/menu/categories': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Меню', link: '/dashboard/menu' },
    { title: 'Категории', link: '/dashboard/menu/categories' },
  ],
  '/dashboard/menu/additions': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Меню', link: '/dashboard/menu' },
    { title: 'Дополнения', link: '/dashboard/menu/additions' },
  ],
  '/dashboard/menu/modifiers': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Меню', link: '/dashboard/menu' },
    { title: 'Модификаторы', link: '/dashboard/menu/modifiers' },
  ],
  '/dashboard/menu/branch-overrides': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Меню', link: '/dashboard/menu' },
    { title: 'Переопределения филиалов', link: '/dashboard/menu/branch-overrides' },
  ],
  '/dashboard/menu/templates': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Меню', link: '/dashboard/menu' },
    { title: 'Шаблоны', link: '/dashboard/menu/templates' },
  ],
  '/dashboard/staff': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Персонал', link: '/dashboard/staff' },
  ],
  '/dashboard/staff/employees': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Персонал', link: '/dashboard/staff' },
    { title: 'Сотрудники', link: '/dashboard/staff/employees' },
  ],
  '/dashboard/staff/roles': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Персонал', link: '/dashboard/staff' },
    { title: 'Роли', link: '/dashboard/staff/roles' },
  ],
  '/dashboard/branches': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Филиалы', link: '/dashboard/branches' },
  ],
  '/dashboard/halls': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Залы', link: '/dashboard/halls' },
  ],
  '/dashboard/table': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Столы', link: '/dashboard/table' },
  ],
  '/dashboard/profile': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Профиль', link: '/dashboard/profile' },
  ],
}

export function useBreadcrumbs() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname]
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      }
    })
  }, [pathname])

  return breadcrumbs
}
