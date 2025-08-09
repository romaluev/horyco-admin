import { NavItem } from '../types';

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
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Продукты',
    shortcut: ['P'],
    url: '/dashboard/products',
    icon: 'product',
    isActive: false,
    items: []
  },
  {
    title: 'Категории',
    shortcut: ['C'],
    url: '/dashboard/categories',
    icon: 'pizza',
    isActive: false,
    items: []
  },
  {
    title: 'Сотрудники',
    shortcut: ['E'],
    url: '/dashboard/employee',
    icon: 'product',
    isActive: false,
    items: []
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
