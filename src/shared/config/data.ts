import type { NavItem } from '../types';

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const getStatuses = () => [
  {
    value: 'active',
    label: 'Активный'
  },
  {
    value: 'archived',
    label: 'Архивирован'
  }
];

export const getNavItems = (): NavItem[] => [
  {
    title: 'Панель управления',
    url: '/dashboard/overview',
    icon: 'dashboard',
    shortcut: ['D'],
    isActive: false,
    items: []
  },
  {
    title: 'Меню',
    url: '/dashboard/menu',
    icon: 'pizza',
    shortcut: ['M'],
    isActive: false,
    items: [
      {
        title: 'Категории',
        url: '/dashboard/menu/categories'
      },
      {
        title: 'Продукты',
        url: '/dashboard/menu/products'
      },
      {
        title: 'Модификаторы',
        url: '/dashboard/menu/modifiers'
      },
      {
        title: 'Дополнения',
        url: '/dashboard/menu/additions'
      },
      {
        title: 'Шаблоны',
        url: '/dashboard/menu/templates'
      },
      {
        title: 'Переопределения филиалов',
        url: '/dashboard/menu/branch-overrides'
      }
    ]
  },
  {
    title: 'Персонал',
    shortcut: ['S'],
    url: '/dashboard/staff',
    icon: 'user',
    isActive: false,
    items: [
      {
        title: 'Сотрудники',
        url: '/dashboard/staff/employees'
      },
      {
        title: 'Роли и права',
        url: '/dashboard/staff/roles'
      }
    ]
  },
  {
    title: 'Филиалы',
    shortcut: ['B'],
    url: '/dashboard/branches',
    icon: 'hierarchy',
    isActive: false,
    items: []
  },
  {
    title: 'Залы',
    shortcut: ['H'],
    url: '/dashboard/halls',
    icon: 'kanban',
    isActive: false,
    items: []
  },
  {
    title: 'Стол менеджмент',
    shortcut: ['cmd', 'SHIFT', 'T'],
    url: '/dashboard/table',
    icon: 'layoutGrid',
    isActive: false,
    items: []
  }
];
