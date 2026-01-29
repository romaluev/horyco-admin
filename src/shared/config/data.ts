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
    permissions: [
      PERMISSIONS.STAFF_VIEW,
      PERMISSIONS.BRANCHES_VIEW,
      PERMISSIONS.TABLES_VIEW,
    ],
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
    url: '/dashboard/inventory',
    icon: 'package',
    shortcut: ['I'],
    isActive: false,
    permission: PERMISSIONS.INVENTORY_VIEW,
    items: [
      {
        title: 'Обзор',
        url: '/dashboard/inventory',
        icon: 'dashboard',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Склады',
        url: '/dashboard/inventory/warehouses',
        icon: 'warehouse',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Товары',
        url: '/dashboard/inventory/items',
        icon: 'package',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Остатки',
        url: '/dashboard/inventory/stock',
        icon: 'stack',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Движения',
        url: '/dashboard/inventory/movements',
        icon: 'transfer',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Поставщики',
        url: '/dashboard/inventory/suppliers',
        icon: 'truck',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Техкарты',
        url: '/dashboard/inventory/recipes',
        icon: 'chefHat',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Закупки',
        url: '/dashboard/inventory/purchase-orders',
        icon: 'shoppingCart',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Списания',
        url: '/dashboard/inventory/writeoffs',
        icon: 'trash',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Инвентаризации',
        url: '/dashboard/inventory/counts',
        icon: 'clipboardList',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Производство',
        url: '/dashboard/inventory/production',
        icon: 'buildingFactory',
        permission: PERMISSIONS.INVENTORY_VIEW,
      },
      {
        title: 'Уведомления',
        url: '/dashboard/inventory/alerts',
        icon: 'bell',
        permission: PERMISSIONS.INVENTORY_VIEW,
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
