import { PERMISSIONS } from '@/shared/lib/permissions'

import type { NavItem } from '../types'

export const MAX_FILE_SIZE = 5000000
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const getStatuses = () => [
  {
    value: 'active',
    label: 'Активный',
  },
  {
    value: 'archived',
    label: 'Архивирован',
  },
]

export const getNavItems = (): NavItem[] => [
  {
    title: 'Панель управления',
    url: '/dashboard/overview',
    icon: 'dashboard',
    shortcut: ['D'],
    isActive: false,
    items: [],
  },
  // Note: Analytics section is handled by AnalyticsSidebarSection component
  // and is rendered right after Dashboard in app-sidebar.tsx
  {
    title: 'Меню',
    url: '/dashboard/menu',
    icon: 'pizza',
    shortcut: ['M'],
    isActive: false,
    permission: PERMISSIONS.MENU_VIEW,
    items: [
      {
        title: 'Категории',
        url: '/dashboard/menu/categories',
        icon: 'category',
        permission: PERMISSIONS.MENU_VIEW,
      },
      {
        title: 'Продукты',
        url: '/dashboard/menu/products',
        icon: 'package',
        permission: PERMISSIONS.MENU_VIEW,
      },
      {
        title: 'Модификаторы',
        url: '/dashboard/menu/modifiers',
        icon: 'adjustments',
        permission: PERMISSIONS.MENU_VIEW,
      },
      {
        title: 'Дополнения',
        url: '/dashboard/menu/additions',
        icon: 'plus',
        permission: PERMISSIONS.MENU_VIEW,
      },
    ],
  },
  {
    title: 'Организация',
    url: '/dashboard/staff/employees',
    icon: 'building',
    shortcut: ['O'],
    isActive: false,
    permissions: [PERMISSIONS.STAFF_VIEW, PERMISSIONS.BRANCHES_VIEW, PERMISSIONS.TABLES_VIEW],
    permissionMode: 'any',
    items: [
      {
        title: 'Персонал',
        url: '/dashboard/staff/employees',
        icon: 'user',
        permission: PERMISSIONS.STAFF_VIEW,
      },
      {
        title: 'Филиалы',
        url: '/dashboard/branches',
        icon: 'hierarchy',
        permission: PERMISSIONS.BRANCHES_VIEW,
      },
      {
        title: 'Залы',
        url: '/dashboard/halls',
        icon: 'layoutGrid',
        permission: PERMISSIONS.TABLES_VIEW,
      },
    ],
  },
  {
    title: 'Склад',
    shortcut: ['I'],
    url: '/dashboard/inventory',
    icon: 'warehouse',
    isActive: false,
    permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_READ],
    permissionMode: 'any',
    items: [
      {
        title: 'Обзор',
        url: '/dashboard/inventory',
        icon: 'dashboard',
        permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_READ],
        permissionMode: 'any',
      },
      {
        title: 'Товары',
        url: '/dashboard/inventory/items',
        icon: 'package',
        permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_READ],
        permissionMode: 'any',
      },
      {
        title: 'Остатки',
        url: '/dashboard/inventory/stock',
        icon: 'stack',
        permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_READ],
        permissionMode: 'any',
      },
      {
        title: 'Движения',
        url: '/dashboard/inventory/movements',
        icon: 'arrowsExchange',
        permissions: [PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_READ],
        permissionMode: 'any',
      },
      {
        title: 'Техкарты',
        url: '/dashboard/inventory/recipes',
        icon: 'receipt',
        permission: PERMISSIONS.INVENTORY_WRITE,
      },
      {
        title: 'Поставщики',
        url: '/dashboard/inventory/suppliers',
        icon: 'truck',
        permission: PERMISSIONS.INVENTORY_PURCHASE,
      },
      {
        title: 'Закупки',
        url: '/dashboard/inventory/purchase-orders',
        icon: 'shoppingCart',
        permission: PERMISSIONS.INVENTORY_PURCHASE,
      },
      {
        title: 'Списания',
        url: '/dashboard/inventory/writeoffs',
        icon: 'trash',
        permission: PERMISSIONS.INVENTORY_WRITEOFF,
      },
      {
        title: 'Инвентаризации',
        url: '/dashboard/inventory/counts',
        icon: 'listCheck',
        permission: PERMISSIONS.INVENTORY_COUNT,
      },
      {
        title: 'Производство',
        url: '/dashboard/inventory/production',
        icon: 'buildingFactory',
        permission: PERMISSIONS.INVENTORY_PRODUCTION,
      },
    ],
  },
]

export const getSettingsNavItem = (): NavItem => ({
  title: 'Настройки',
  shortcut: ['T'],
  url: '/dashboard/settings',
  icon: 'settings',
  isActive: false,
  permission: PERMISSIONS.SETTINGS_VIEW,
  items: [],
})
