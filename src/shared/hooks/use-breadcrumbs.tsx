'use client'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { usePathname } from '@/shared/lib/navigation'

import { useViewBuilderStore } from '@/features/dashboard/view-builder'

interface BreadcrumbItem {
  title: string
  link: string
}

export function useBreadcrumbs() {
  const pathname = usePathname()
  const viewName = useViewBuilderStore((state) => state.viewName)
  const { t } = useTranslation('navigation')

  const breadcrumbs = useMemo(() => {
    const routeMapping: Record<string, BreadcrumbItem[]> = {
      '/dashboard': [{ title: t('breadcrumbs.dashboard'), link: '/dashboard' }],
      '/dashboard/overview': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.overview'), link: '/dashboard/overview' },
      ],
      '/dashboard/menu': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.menu'), link: '/dashboard/menu' },
      ],
      '/dashboard/menu/products': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.menu'), link: '/dashboard/menu' },
        { title: t('breadcrumbs.products'), link: '/dashboard/menu/products' },
      ],
      '/dashboard/menu/categories': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.menu'), link: '/dashboard/menu' },
        { title: t('breadcrumbs.categories'), link: '/dashboard/menu/categories' },
      ],
      '/dashboard/menu/additions': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.menu'), link: '/dashboard/menu' },
        { title: t('breadcrumbs.additions'), link: '/dashboard/menu/additions' },
      ],
      '/dashboard/menu/modifiers': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.menu'), link: '/dashboard/menu' },
        { title: t('breadcrumbs.modifiers'), link: '/dashboard/menu/modifiers' },
      ],
      '/dashboard/menu/branch-overrides': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.menu'), link: '/dashboard/menu' },
        { title: 'Переопределения филиалов', link: '/dashboard/menu/branch-overrides' },
      ],
      '/dashboard/staff': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.staff'), link: '/dashboard/staff' },
      ],
      '/dashboard/staff/employees': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.staff'), link: '/dashboard/staff' },
        { title: t('breadcrumbs.staff'), link: '/dashboard/staff/employees' },
      ],
      '/dashboard/staff/roles': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.staff'), link: '/dashboard/staff' },
        { title: 'Роли', link: '/dashboard/staff/roles' },
      ],
      '/dashboard/branches': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.branches'), link: '/dashboard/branches' },
      ],
      '/dashboard/halls': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.halls'), link: '/dashboard/halls' },
      ],
      '/dashboard/table': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: 'Столы', link: '/dashboard/table' },
      ],
      '/dashboard/profile': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: 'Профиль', link: '/dashboard/profile' },
      ],
      '/dashboard/views': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: 'Представления', link: '/dashboard/views' },
      ],
      '/dashboard/views/new': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: 'Представления', link: '/dashboard/views' },
        { title: 'Новое представление', link: '/dashboard/views/new' },
      ],
      '/dashboard/inventory': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
      ],
      '/dashboard/inventory/warehouses': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.warehouses'), link: '/dashboard/inventory/warehouses' },
      ],
      '/dashboard/inventory/items': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.items'), link: '/dashboard/inventory/items' },
      ],
      '/dashboard/inventory/stock': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.stock'), link: '/dashboard/inventory/stock' },
      ],
      '/dashboard/inventory/movements': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.movements'), link: '/dashboard/inventory/movements' },
      ],
      '/dashboard/inventory/recipes': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.recipes'), link: '/dashboard/inventory/recipes' },
      ],
      '/dashboard/inventory/suppliers': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.suppliers'), link: '/dashboard/inventory/suppliers' },
      ],
      '/dashboard/inventory/purchase-orders': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.purchaseOrders'), link: '/dashboard/inventory/purchase-orders' },
      ],
      '/dashboard/inventory/writeoffs': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.writeoffs'), link: '/dashboard/inventory/writeoffs' },
      ],
      '/dashboard/inventory/counts': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.counts'), link: '/dashboard/inventory/counts' },
      ],
      '/dashboard/inventory/production': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.production'), link: '/dashboard/inventory/production' },
      ],
      '/dashboard/inventory/alerts': [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
        { title: t('breadcrumbs.alerts'), link: '/dashboard/inventory/alerts' },
      ],
    }

    const inventoryDynamicRoutes: Record<string, { parent: string; parentTitle: string }> = {
      items: { parent: '/dashboard/inventory/items', parentTitle: t('breadcrumbs.items') },
      recipes: { parent: '/dashboard/inventory/recipes', parentTitle: t('breadcrumbs.recipes') },
      suppliers: { parent: '/dashboard/inventory/suppliers', parentTitle: t('breadcrumbs.suppliers') },
      'purchase-orders': { parent: '/dashboard/inventory/purchase-orders', parentTitle: t('breadcrumbs.purchaseOrders') },
      writeoffs: { parent: '/dashboard/inventory/writeoffs', parentTitle: t('breadcrumbs.writeoffs') },
      counts: { parent: '/dashboard/inventory/counts', parentTitle: t('breadcrumbs.counts') },
      production: { parent: '/dashboard/inventory/production', parentTitle: t('breadcrumbs.production') },
    }

    if (routeMapping[pathname]) {
      return routeMapping[pathname]
    }

    const viewPageMatch = pathname.match(/^\/dashboard\/views\/([^/]+)$/)
    if (viewPageMatch) {
      return [
        { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
        { title: 'Представления', link: '/dashboard/views' },
        { title: viewName || t('common:loading'), link: pathname },
      ]
    }

    const inventoryMatch = pathname.match(/^\/dashboard\/inventory\/([^/]+)\/(\d+)(\/(.+))?$/)
    if (inventoryMatch) {
      const [, section, id, , subPage] = inventoryMatch
      const config = section ? inventoryDynamicRoutes[section] : undefined

      if (config) {
        const baseBreadcrumbs = [
          { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
          { title: t('breadcrumbs.inventory'), link: '/dashboard/inventory' },
          { title: config.parentTitle, link: config.parent },
          { title: `#${id}`, link: `${config.parent}/${id}` },
        ]

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

    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      }
    })
  }, [pathname, viewName, t])

  return breadcrumbs
}
