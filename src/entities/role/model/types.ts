/**
 * Role entity types
 * Based on ADMIN_STAFF_MANAGEMENT.md documentation
 */

export interface IRole {
  id: number;
  name: string;
  description?: string;
  isSystem: boolean; // true for default roles (Admin, Manager, Cashier, Waiter)
  permissions?: IPermission[];
}

export interface IPermission {
  id: number;
  name: string; // e.g., "orders.create"
  description: string;
  category: string; // e.g., "orders", "menu", "staff"
}

export interface IRoleCreateDto {
  name: string;
  description?: string;
  permissionIds: number[];
}

export interface IRoleUpdateDto {
  name?: string;
  description?: string;
  permissionIds?: number[];
}
