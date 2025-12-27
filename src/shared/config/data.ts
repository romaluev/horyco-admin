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
        permission: PERMISSIONS.MENU_VIEW,
      },
      {
        title: 'Продукты',
        url: '/dashboard/menu/products',
        permission: PERMISSIONS.MENU_VIEW,
      },
      {
        title: 'Модификаторы',
        url: '/dashboard/menu/modifiers',
        permission: PERMISSIONS.MENU_VIEW,
      },
      {
        title: 'Дополнения',
        url: '/dashboard/menu/additions',
        permission: PERMISSIONS.MENU_VIEW,
      },
      {
        title: 'Переопределения филиалов',
        url: '/dashboard/menu/branch-overrides',
        permission: PERMISSIONS.MENU_VIEW,
      },
    ],
  },
  {
    title: 'Персонал',
    shortcut: ['S'],
    url: '/dashboard/staff/employees',
    icon: 'user',
    isActive: false,
    permission: PERMISSIONS.STAFF_VIEW,
    items: [],
  },
  {
    title: 'Филиалы',
    shortcut: ['B'],
    url: '/dashboard/branches',
    icon: 'hierarchy',
    isActive: false,
    permission: PERMISSIONS.BRANCHES_VIEW,
    items: [],
  },
  {
    title: 'Управление залами',
    shortcut: ['H'],
    url: '/dashboard/halls',
    icon: 'layoutGrid',
    isActive: false,
    permission: PERMISSIONS.TABLES_VIEW,
    items: [],
  },
  {
    title: 'Склад',
    shortcut: ['I'],
    url: '/dashboard/inventory',
    icon: 'warehouse',
    isActive: false,
    permission: PERMISSIONS.INVENTORY_READ,
    items: [
      {
        title: 'Обзор',
        url: '/dashboard/inventory',
        permission: PERMISSIONS.INVENTORY_READ,
      },
      {
        title: 'Товары',
        url: '/dashboard/inventory/items',
        permission: PERMISSIONS.INVENTORY_READ,
      },
      {
        title: 'Остатки',
        url: '/dashboard/inventory/stock',
        permission: PERMISSIONS.INVENTORY_READ,
      },
      {
        title: 'Движения',
        url: '/dashboard/inventory/movements',
        permission: PERMISSIONS.INVENTORY_READ,
      },
      {
        title: 'Техкарты',
        url: '/dashboard/inventory/recipes',
        permission: PERMISSIONS.INVENTORY_WRITE,
      },
      {
        title: 'Поставщики',
        url: '/dashboard/inventory/suppliers',
        permission: PERMISSIONS.INVENTORY_PURCHASE,
      },
      {
        title: 'Закупки',
        url: '/dashboard/inventory/purchase-orders',
        permission: PERMISSIONS.INVENTORY_PURCHASE,
      },
      {
        title: 'Списания',
        url: '/dashboard/inventory/writeoffs',
        permission: PERMISSIONS.INVENTORY_WRITEOFF,
      },
      {
        title: 'Инвентаризации',
        url: '/dashboard/inventory/counts',
        permission: PERMISSIONS.INVENTORY_COUNT,
      },
      {
        title: 'Производство',
        url: '/dashboard/inventory/production',
        permission: PERMISSIONS.INVENTORY_PRODUCTION,
      },
    ],
  },
  {
    title: 'Настройки',
    shortcut: ['T'],
    url: '/dashboard/settings',
    icon: 'settings',
    isActive: false,
    permission: PERMISSIONS.SETTINGS_VIEW,
    items: [],
  },
]
