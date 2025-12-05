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
    url: '/dashboard/staff',
    icon: 'user',
    isActive: false,
    permission: PERMISSIONS.STAFF_VIEW,
    items: [
      {
        title: 'Сотрудники',
        url: '/dashboard/staff/employees',
        permission: PERMISSIONS.STAFF_VIEW,
      },
    ],
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
    title: 'Настройки',
    shortcut: ['T'],
    url: '/dashboard/settings',
    icon: 'settings',
    isActive: false,
    permission: PERMISSIONS.SETTINGS_VIEW,
    items: [],
  },
]
