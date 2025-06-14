import { Icons } from '@/shared/ui/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

/**
 * Sorting parameters for list requests
 */
export interface SortingParams {
  field: string;
  order: 'ASC' | 'DESC';
}

/**
 * Filtering parameters for list requests
 */
export interface FilteringParams {
  field: string;
  value: string | number | boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  size: number;
}
