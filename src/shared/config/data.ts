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
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Продукты',
    url: '/dashboard/products',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Категории',
    url: '/dashboard/categories',
    icon: 'pizza',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Сотрудники',
    url: '/dashboard/employee',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Филиалы',
    url: '/dashboard/branches',
    icon: 'hierarchy',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Залы',
    url: '/dashboard/halls',
    icon: 'kanban',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Стол менеджмент',
    url: '/dashboard/table',
    icon: 'layoutGrid',
    isActive: false,
    items: [] // No child items
  }
];
