# Permission Management Implementation Guide

This guide explains how to implement permission checks throughout the admin panel. The system has been fully integrated with hooks, components, and error handling.

---

## Quick Start

### 1. Hide Sidebar Links Without Permission ✅ DONE

Navigation items now automatically filter based on permissions in `src/shared/config/data.ts`. Add permission to any nav item:

```typescript
{
  title: 'Menu',
  url: '/dashboard/menu',
  icon: 'pizza',
  permission: PERMISSIONS.MENU_VIEW,  // Will hide this section if user lacks permission
  items: [
    {
      title: 'Products',
      url: '/dashboard/menu/products',
      permission: PERMISSIONS.MENU_VIEW,
    }
  ]
}
```

---

## Core Hooks

All these hooks are available in `src/shared/hooks/use-permissions.ts`:

### Check Single Permission (Any Branch)

```typescript
import { useHasPermission } from '@/shared/hooks/use-permissions'

export function MyComponent() {
  const canEdit = useHasPermission('menu:edit')

  if (!canEdit) return <div>No permission</div>
  return <button>Edit Menu</button>
}
```

### Check Multiple Permissions

```typescript
// Check if user has ALL permissions
const canManage = useHasAllPermissions(['menu:create', 'menu:delete'])

// Check if user has ANY of these permissions
const canModify = useHasAnyPermission(['menu:edit', 'menu:create'])
```

### Check Permission for Specific Branch

```typescript
// For POS operations where branch context matters
const canCreateOrders = useHasPermissionForBranch('orders:create', branchId)
const canManageStaff = useHasAllPermissionsForBranch(['staff:create', 'staff:edit'], branchId)
```

### Get All Branches with Permission

```typescript
const branchIds = useGetBranchesWithPermission('menu:edit')
// Returns: ["1", "2", "5"]
```

### Check if User is Owner

```typescript
const isOwner = useIsOwner()  // Returns true if user has wildcard (*) permission
```

---

## UI Components

### ProtectedButton

Use `ProtectedButton` instead of `Button` to auto-hide buttons without permission:

```typescript
import { ProtectedButton } from '@/shared/ui/protected-button'
import { PERMISSIONS } from '@/shared/lib/permissions'

export function ProductsPage() {
  return (
    <>
      {/* Shows button only if user has permission */}
      <ProtectedButton
        permission={PERMISSIONS.MENU_CREATE}
        onClick={handleCreate}
      >
        Add Product
      </ProtectedButton>

      {/* Multi-permission check (all required) */}
      <ProtectedButton
        permissions={[PERMISSIONS.MENU_EDIT, PERMISSIONS.MENU_DELETE]}
        permissionMode="all"
      >
        Manage
      </ProtectedButton>

      {/* Multi-permission check (any required) */}
      <ProtectedButton
        permissions={[PERMISSIONS.MENU_EDIT, PERMISSIONS.MENU_CREATE]}
        permissionMode="any"
      >
        Edit or Create
      </ProtectedButton>

      {/* Show tooltip on denied, hidden fallback */}
      <ProtectedButton
        permission={PERMISSIONS.MENU_DELETE}
        tooltipOnDenied={true}
        deniedTooltip="You need Menu Delete permission"
      >
        Delete
      </ProtectedButton>

      {/* Show custom fallback element instead of disabled button */}
      <ProtectedButton
        permission={PERMISSIONS.STAFF_MANAGE}
        fallback={<span className="text-gray-400">Staff management unavailable</span>}
      >
        Manage Staff
      </ProtectedButton>
    </>
  )
}
```

### ProtectedNavItem / ProtectedContent

Hide entire sections based on permission:

```typescript
import { ProtectedContent } from '@/shared/ui/protected-nav-item'

export function AdminPanel() {
  return (
    <>
      <h1>Dashboard</h1>

      {/* Only show this section if user has permission */}
      <ProtectedContent permission={PERMISSIONS.MENU_VIEW}>
        <section>
          <h2>Menu Management</h2>
          {/* content */}
        </section>
      </ProtectedContent>

      <ProtectedContent permission={PERMISSIONS.STAFF_VIEW}>
        <section>
          <h2>Staff Management</h2>
          {/* content */}
        </section>
      </ProtectedContent>
    </>
  )
}
```

---

## Page Implementation Examples

### Example 1: Categories Page (with create button)

```typescript
// src/app/dashboard/menu/categories/page.tsx
'use client'

import { useHasPermission } from '@/shared/hooks/use-permissions'
import { ProtectedButton } from '@/shared/ui/protected-button'
import { PERMISSIONS } from '@/shared/lib/permissions'

export default function CategoriesPage() {
  const canCreate = useHasPermission(PERMISSIONS.MENU_CREATE)
  const canEdit = useHasPermission(PERMISSIONS.MENU_EDIT)
  const canDelete = useHasPermission(PERMISSIONS.MENU_DELETE)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Categories</h1>

        {/* Only show create button if user has permission */}
        <ProtectedButton
          permission={PERMISSIONS.MENU_CREATE}
          onClick={() => {/* handle create */}}
        >
          Add Category
        </ProtectedButton>
      </div>

      <CategoriesTable
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
      />
    </div>
  )
}
```

### Example 2: Employees Page (with multiple actions)

```typescript
// src/app/dashboard/staff/employees/page.tsx
'use client'

import { useHasPermission } from '@/shared/hooks/use-permissions'
import { ProtectedButton } from '@/shared/ui/protected-button'
import { ProtectedContent } from '@/shared/ui/protected-nav-item'
import { PERMISSIONS } from '@/shared/lib/permissions'

export default function EmployeesPage() {
  const canViewStaff = useHasPermission(PERMISSIONS.STAFF_VIEW)

  if (!canViewStaff) {
    return <div>You don't have permission to view staff</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Employees</h1>

        <ProtectedButton
          permission={PERMISSIONS.STAFF_CREATE}
          onClick={() => router.push('/dashboard/staff/employees/new')}
        >
          Add Employee
        </ProtectedButton>
      </div>

      <EmployeesTable
        actions={{
          canEdit: <ProtectedButton permission={PERMISSIONS.STAFF_EDIT}>Edit</ProtectedButton>,
          canDelete: <ProtectedButton permission={PERMISSIONS.STAFF_DELETE}>Delete</ProtectedButton>,
          canManagePermissions: <ProtectedButton permission={PERMISSIONS.STAFF_MANAGE}>Manage Permissions</ProtectedButton>,
        }}
      />
    </div>
  )
}
```

### Example 3: Handle API Errors (permission denied)

```typescript
// In any API call handler
import { handlePermissionError, showPermissionError } from '@/shared/lib/permission-error-handler'

async function handleCreateProduct(data: ProductData) {
  try {
    const response = await api.post('/admin/menu/products', data)
    toast.success('Product created')
  } catch (error) {
    // This will automatically show proper error toast if it's a 403
    handlePermissionError(error, 'Creating Product')

    // Or if you want custom handling:
    if (isPermissionError(error)) {
      const details = getPermissionErrorDetails(error)
      console.log('Required permissions:', details?.details?.requiredPermissions)
    }
  }
}
```

---

## Implementation Checklist for Each Page

For every admin page (Menu, Staff, Branches, etc.), add:

### 1. Check View Permission at Top of Page

```typescript
const canView = useHasPermission(PERMISSIONS.MENU_VIEW)
if (!canView) return <div>No permission</div>
```

### 2. Add Buttons with Permission Checks

```typescript
<ProtectedButton
  permission={PERMISSIONS.MENU_CREATE}
  onClick={handleCreate}
>
  Create
</ProtectedButton>

<ProtectedButton
  permission={PERMISSIONS.MENU_EDIT}
  onClick={handleEdit}
>
  Edit
</ProtectedButton>

<ProtectedButton
  permission={PERMISSIONS.MENU_DELETE}
  onClick={handleDelete}
  deniedTooltip="You need Menu Delete permission"
>
  Delete
</ProtectedButton>
```

### 3. Handle API Errors

```typescript
try {
  await api.post('/admin/menu/products', data)
} catch (error) {
  handlePermissionError(error, 'Creating Product')
}
```

### 4. Hide Sections Without Permission

```typescript
<ProtectedContent permission={PERMISSIONS.REPORTS_VIEW}>
  <ReportsSection />
</ProtectedContent>
```

---

## Permission Constants

Available in `PERMISSIONS` constant:

```typescript
// Orders
PERMISSIONS.ORDERS_CREATE
PERMISSIONS.ORDERS_VIEW
PERMISSIONS.ORDERS_EDIT
PERMISSIONS.ORDERS_DELETE

// Menu
PERMISSIONS.MENU_CREATE
PERMISSIONS.MENU_VIEW
PERMISSIONS.MENU_EDIT
PERMISSIONS.MENU_DELETE
PERMISSIONS.MENU_MANAGE

// Staff
PERMISSIONS.STAFF_CREATE
PERMISSIONS.STAFF_VIEW
PERMISSIONS.STAFF_EDIT
PERMISSIONS.STAFF_DELETE
PERMISSIONS.STAFF_MANAGE

// And many more...
PERMISSIONS.FINANCE_VIEW
PERMISSIONS.REPORTS_VIEW
PERMISSIONS.SETTINGS_EDIT
// etc.
```

---

## Error Handling

### Permission Error Response Format

When an API returns a 403 (Permission Denied), it looks like:

```json
{
  "success": false,
  "error": {
    "code": {
      "code": "PERMISSION_DENIED",
      "message": "You don't have the required permissions at any of your assigned branches.",
      "details": {
        "requiredPermissions": ["menu:edit"]
      },
      "suggestion": "This action requires: menu:edit. Contact your manager to request access."
    },
    "message": "Permission Denied Exception",
    "details": {
      "statusCode": 403
    }
  },
  "path": "/admin/menu/products/1",
  "timestamp": "2025-12-04T18:10:49.572Z",
  "requestId": "c15b4cff-55d4-441e-8e4d-e3acfe968d83",
  "statusCode": 403
}
```

### Error Handling Functions

```typescript
import {
  isPermissionError,
  getPermissionErrorDetails,
  showPermissionError,
  handlePermissionError,
} from '@/shared/lib/permission-error-handler'

// Check if error is a permission error
if (isPermissionError(error)) {
  // Get details
  const details = getPermissionErrorDetails(error)
  console.log(details.message)
  console.log(details.details?.requiredPermissions)
  console.log(details.suggestion)

  // Show automatic toast
  showPermissionError(error)

  // Or use the wrapper function
  handlePermissionError(error, 'Creating Product')
}
```

---

## Multi-Branch Admin Panel Architecture

The admin panel uses **"any_branch" mode**:

- **No specific branch required** in URL or request
- Permission check: User has permission **at ANY of their branches**
- Example: If user is Menu Editor at Branch A, they can edit menu (affects all branches)

This is different from POS which uses "branch mode":

```typescript
// Admin Panel (any_branch mode) - use these
useHasPermission(PERMISSIONS.MENU_EDIT)           // ✅ Check any branch
useHasAllPermissions([...])                        // ✅ Check any branch
useHasAnyPermission([...])                         // ✅ Check any branch

// POS Operations (branch mode) - use these
useHasPermissionForBranch(perm, branchId)         // ✅ Check specific branch
useHasAllPermissionsForBranch([...], branchId)    // ✅ Check specific branch
```

---

## Files Modified

### New Files Created:
- `src/shared/hooks/use-permissions.ts` - All permission checking hooks
- `src/shared/ui/protected-button.tsx` - Button component with permission check
- `src/shared/ui/protected-nav-item.tsx` - Container for conditional rendering
- `src/shared/lib/permission-error-handler.ts` - Error handling utilities

### Files Updated:
- `src/shared/lib/permissions.ts` - Added "any_branch" functions
- `src/shared/types/index.ts` - Added permission properties to NavItem
- `src/shared/config/data.ts` - Added permission requirements to nav items
- `src/shared/ui/layout/app-sidebar.tsx` - Added permission filtering
- `src/shared/lib/axios.ts` - Added 403 handling (logged warning)

---

## Testing Permission Checks

To test permission implementation:

1. **Test View Permission**: Access page without permission - should see "No permission" message
2. **Test Create Button**: Create button should only show if user has `PERMISSION.X_CREATE`
3. **Test Edit Button**: Edit button should only show if user has `PERMISSION.X_EDIT`
4. **Test Delete Button**: Delete button should only show if user has `PERMISSION.X_DELETE`
5. **Test API Error**: Try API call without permission - should show error toast with suggestion

---

## Next Steps

1. Add permission checks to all admin pages
2. Add ProtectedButton to all action buttons
3. Test 403 error scenarios
4. Verify sidebar filtering works correctly

Sidebar navigation is already filtering automatically. Just add ProtectedButton to your action buttons!
