import { useTranslation } from 'react-i18next'

import { PERMISSIONS } from '@/shared/lib/permissions'

import type { NavItem } from '../types'

export function useNavItems() {
  const { t } = useTranslation('navigation')

  const navItems: NavItem[] = [
    {
      title: t('dashboard'),
      url: '/dashboard/overview',
      icon: 'dashboard',
      shortcut: ['D'],
      isActive: false,
      items: [],
    },
    {
      title: t('menu'),
      url: '/dashboard/menu',
      icon: 'pizza',
      shortcut: ['M'],
      isActive: false,
      permission: PERMISSIONS.MENU_VIEW,
      items: [
        {
          title: t('items.categories'),
          url: '/dashboard/menu/categories',
          icon: 'category',
          permission: PERMISSIONS.MENU_VIEW,
        },
        {
          title: t('items.products'),
          url: '/dashboard/menu/products',
          icon: 'package',
          permission: PERMISSIONS.MENU_VIEW,
        },
        {
          title: t('items.modifiers'),
          url: '/dashboard/menu/modifiers',
          icon: 'adjustments',
          permission: PERMISSIONS.MENU_VIEW,
        },
        {
          title: t('items.additions'),
          url: '/dashboard/menu/additions',
          icon: 'plus',
          permission: PERMISSIONS.MENU_VIEW,
        },
      ],
    },
    {
      title: t('organization'),
      url: '/dashboard/staff/employees',
      icon: 'building',
      shortcut: ['O'],
      isActive: false,
      permissions: [
        PERMISSIONS.STAFF_VIEW,
        PERMISSIONS.BRANCHES_VIEW,
        PERMISSIONS.TABLES_VIEW,
      ],
      permissionMode: 'any',
      items: [
        {
          title: t('items.staff'),
          url: '/dashboard/staff/employees',
          icon: 'user',
          permission: PERMISSIONS.STAFF_VIEW,
        },
        {
          title: t('items.branches'),
          url: '/dashboard/branches',
          icon: 'hierarchy',
          permission: PERMISSIONS.BRANCHES_VIEW,
        },
        {
          title: t('items.halls'),
          url: '/dashboard/halls',
          icon: 'layoutGrid',
          permission: PERMISSIONS.TABLES_VIEW,
        },
      ],
    },
    {
      title: t('inventory'),
      url: '/dashboard/inventory',
      icon: 'package',
      shortcut: ['I'],
      isActive: false,
      permission: PERMISSIONS.INVENTORY_VIEW,
      items: [
        {
          title: t('items.overview'),
          url: '/dashboard/inventory',
          icon: 'dashboard',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.warehouses'),
          url: '/dashboard/inventory/warehouses',
          icon: 'warehouse',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.items'),
          url: '/dashboard/inventory/items',
          icon: 'package',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.stock'),
          url: '/dashboard/inventory/stock',
          icon: 'stack',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.movements'),
          url: '/dashboard/inventory/movements',
          icon: 'transfer',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.suppliers'),
          url: '/dashboard/inventory/suppliers',
          icon: 'truck',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.recipes'),
          url: '/dashboard/inventory/recipes',
          icon: 'chefHat',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.purchaseOrders'),
          url: '/dashboard/inventory/purchase-orders',
          icon: 'shoppingCart',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.writeoffs'),
          url: '/dashboard/inventory/writeoffs',
          icon: 'trash',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.inventoryCounts'),
          url: '/dashboard/inventory/counts',
          icon: 'clipboardList',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.production'),
          url: '/dashboard/inventory/production',
          icon: 'buildingFactory',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
        {
          title: t('items.alerts'),
          url: '/dashboard/inventory/alerts',
          icon: 'bell',
          permission: PERMISSIONS.INVENTORY_VIEW,
        },
      ],
    },
  ]

  const settingsNavItem: NavItem = {
    title: t('common:settings'),
    shortcut: ['T'],
    url: '/dashboard/settings',
    icon: 'settings',
    isActive: false,
    permission: PERMISSIONS.SETTINGS_VIEW,
    items: [],
  }

  return { navItems, settingsNavItem }
}
