'use client'

import { useMemo } from 'react'

import { usePathname } from 'next/navigation'

import { useViewBuilderStore } from '@/features/view-builder'

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
    {
      title: 'Переопределения филиалов',
      link: '/dashboard/menu/branch-overrides',
    },
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
  '/dashboard/views': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Представления', link: '/dashboard/views' },
  ],
  '/dashboard/views/new': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Представления', link: '/dashboard/views' },
    { title: 'Новое представление', link: '/dashboard/views/new' },
  ],
  // Inventory routes
  '/dashboard/inventory': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
  ],
  '/dashboard/inventory/warehouses': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Склады', link: '/dashboard/inventory/warehouses' },
  ],
  '/dashboard/inventory/items': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Товары', link: '/dashboard/inventory/items' },
  ],
  '/dashboard/inventory/stock': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Остатки', link: '/dashboard/inventory/stock' },
  ],
  '/dashboard/inventory/movements': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Движения', link: '/dashboard/inventory/movements' },
  ],
  '/dashboard/inventory/recipes': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Техкарты', link: '/dashboard/inventory/recipes' },
  ],
  '/dashboard/inventory/suppliers': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Поставщики', link: '/dashboard/inventory/suppliers' },
  ],
  '/dashboard/inventory/purchase-orders': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Заказы поставщикам', link: '/dashboard/inventory/purchase-orders' },
  ],
  '/dashboard/inventory/writeoffs': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Списания', link: '/dashboard/inventory/writeoffs' },
  ],
  '/dashboard/inventory/counts': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Инвентаризации', link: '/dashboard/inventory/counts' },
  ],
  '/dashboard/inventory/production': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Производство', link: '/dashboard/inventory/production' },
  ],
  '/dashboard/inventory/alerts': [
    { title: 'Панель управления', link: '/dashboard' },
    { title: 'Склад', link: '/dashboard/inventory' },
    { title: 'Уведомления', link: '/dashboard/inventory/alerts' },
  ],
}

// Inventory dynamic route configurations
const inventoryDynamicRoutes: Record<string, { parent: string; parentTitle: string }> = {
  items: { parent: '/dashboard/inventory/items', parentTitle: 'Товары' },
  recipes: { parent: '/dashboard/inventory/recipes', parentTitle: 'Техкарты' },
  suppliers: { parent: '/dashboard/inventory/suppliers', parentTitle: 'Поставщики' },
  'purchase-orders': { parent: '/dashboard/inventory/purchase-orders', parentTitle: 'Заказы поставщикам' },
  writeoffs: { parent: '/dashboard/inventory/writeoffs', parentTitle: 'Списания' },
  counts: { parent: '/dashboard/inventory/counts', parentTitle: 'Инвентаризации' },
  production: { parent: '/dashboard/inventory/production', parentTitle: 'Производство' },
}

export function useBreadcrumbs() {
  const pathname = usePathname()
  const viewName = useViewBuilderStore((state) => state.viewName)

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname]
    }

    // Handle dynamic view pages /dashboard/views/[id]
    const viewPageMatch = pathname.match(/^\/dashboard\/views\/([^/]+)$/)
    if (viewPageMatch) {
      return [
        { title: 'Панель управления', link: '/dashboard' },
        { title: 'Представления', link: '/dashboard/views' },
        { title: viewName || 'Загрузка...', link: pathname },
      ]
    }

    // Handle dynamic inventory pages /dashboard/inventory/{section}/[id] or /dashboard/inventory/{section}/[id]/receive
    const inventoryMatch = pathname.match(/^\/dashboard\/inventory\/([^/]+)\/(\d+)(\/(.+))?$/)
    if (inventoryMatch) {
      const [, section, id, , subPage] = inventoryMatch
      const config = section ? inventoryDynamicRoutes[section] : undefined

      if (config) {
        const baseBreadcrumbs = [
          { title: 'Панель управления', link: '/dashboard' },
          { title: 'Склад', link: '/dashboard/inventory' },
          { title: config.parentTitle, link: config.parent },
          { title: `#${id}`, link: `${config.parent}/${id}` },
        ]

        // Handle subpages like /receive
        if (subPage) {
          const subPageTitles: Record<string, string> = {
            receive: 'Приёмка',
            edit: 'Редактирование',
          }
          const subPageTitle = subPageTitles[subPage]
          baseBreadcrumbs.push({
            title: subPageTitle || subPage,
            link: pathname,
          })
        }

        return baseBreadcrumbs
      }
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
  }, [pathname, viewName])

  return breadcrumbs
}
