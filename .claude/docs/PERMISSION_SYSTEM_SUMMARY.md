# Permission System Implementation Summary

## ✅ What's Been Implemented

### 1. Core Permission Utilities
- **File**: `src/shared/lib/permissions.ts`
- Enhanced with "any_branch" mode functions for admin panel:
  - `hasPermissionAnyBranch()` - Check if user has permission at ANY branch
  - `hasAllPermissionsAnyBranch()` - Check if user has ALL permissions at ANY branch
  - `hasAnyPermissionAnyBranch()` - Check if user has ANY of these permissions at ANY branch

### 2. Permission Hooks
- **File**: `src/shared/hooks/use-permissions.ts`
- React hooks for checking permissions in components:
  - `useHasPermission(permission)` - Single permission check
  - `useHasAllPermissions(permissions)` - Multiple permissions (all required)
  - `useHasAnyPermission(permissions)` - Multiple permissions (any allowed)
  - `useHasPermissionForBranch(permission, branchId)` - For POS operations
  - `useGetBranchesWithPermission(permission)` - List branches with permission
  - `useIsOwner()` - Check if user is owner

### 3. UI Components
- **ProtectedButton**: `src/shared/ui/protected-button.tsx`
  - Auto-hides or disables buttons without permission
  - Optional tooltip explaining why disabled
  - Fallback content support

- **ProtectedNavItem/ProtectedContent**: `src/shared/ui/protected-nav-item.tsx`
  - Hides entire sections without permission
  - Works with permission/permissions + permissionMode

### 4. Error Handling
- **File**: `src/shared/lib/permission-error-handler.ts`
- Utilities for handling 403 (Permission Denied) errors:
  - `isPermissionError(error)` - Check if error is permission-related
  - `getPermissionErrorDetails(error)` - Extract permission details
  - `showPermissionError(error)` - Show toast with details
  - `handlePermissionError(error, context)` - Wrapper for logging + toast

### 5. Navigation Updates
- **Updated**: `src/shared/config/data.ts`
- Added `permission` property to all navigation items:
  ```typescript
  {
    title: 'Menu',
    url: '/dashboard/menu',
    permission: PERMISSIONS.MENU_VIEW,
    items: [...]
  }
  ```

- **Updated**: `src/shared/ui/layout/app-sidebar.tsx`
- Sidebar now filters navigation items based on user permissions
- Hides entire sections and items automatically

### 6. Type Definitions
- **Updated**: `src/shared/types/index.ts`
- Extended `NavItem` interface with permission fields:
  ```typescript
  permission?: string
  permissions?: string[]
  permissionMode?: 'all' | 'any'
  ```

---

## 📋 How to Use

### Hide Sidebar Links
Links defined in `src/shared/config/data.ts` automatically hide when user lacks permission. ✅ Already configured.

### Hide Action Buttons
```typescript
import { ProtectedButton } from '@/shared/ui/protected-button'
import { PERMISSIONS } from '@/shared/lib/permissions'

<ProtectedButton
  permission={PERMISSIONS.MENU_CREATE}
  onClick={handleCreate}
>
  Create Product
</ProtectedButton>
```

### Hide Sections
```typescript
import { ProtectedContent } from '@/shared/ui/protected-nav-item'

<ProtectedContent permission={PERMISSIONS.MENU_VIEW}>
  <div>Menu Section (hidden if no permission)</div>
</ProtectedContent>
```

### Handle API Errors
```typescript
import { handlePermissionError } from '@/shared/lib/permission-error-handler'

try {
  await api.post('/admin/menu/products', data)
} catch (error) {
  handlePermissionError(error, 'Creating Product')
  // Auto-shows toast with: "You don't have required permission to perform this action"
  // + details about required permissions
}
```

---

## 🔧 Pages That Need Updates

Add to every admin page:

1. **Check View Permission**:
   ```typescript
   const canView = useHasPermission(PERMISSIONS.MENU_VIEW)
   if (!canView) return <div>No permission</div>
   ```

2. **Wrap Action Buttons**:
   ```typescript
   <ProtectedButton permission={PERMISSIONS.MENU_CREATE}>
     Create
   </ProtectedButton>
   ```

3. **Handle API Errors**:
   ```typescript
   catch (error) {
     handlePermissionError(error, 'Action Name')
   }
   ```

### Pages to Update:
- `/dashboard/menu/categories` - MENU_VIEW, MENU_CREATE, MENU_EDIT, MENU_DELETE
- `/dashboard/menu/products` - MENU_VIEW, MENU_CREATE, MENU_EDIT, MENU_DELETE
- `/dashboard/menu/modifiers` - MENU_VIEW, MENU_CREATE, MENU_EDIT, MENU_DELETE
- `/dashboard/menu/additions` - MENU_VIEW, MENU_CREATE, MENU_EDIT, MENU_DELETE
- `/dashboard/staff/employees` - STAFF_VIEW, STAFF_CREATE, STAFF_EDIT, STAFF_DELETE
- `/dashboard/staff/roles` - STAFF_VIEW (roles/permissions management)
- `/dashboard/branches` - BRANCHES_VIEW, BRANCHES_EDIT, BRANCHES_MANAGE
- `/dashboard/halls` - TABLES_VIEW, TABLES_MANAGE
- `/dashboard/settings` - SETTINGS_VIEW, SETTINGS_EDIT

---

## 🛡️ Permission Modes

### Admin Panel Mode (Default - Use This)
For menu, settings, and shared resources that span all branches:

```typescript
// User has permission if they have it at ANY of their branches
useHasPermission(PERMISSIONS.MENU_EDIT)

// Sidebar uses this automatically
```

### POS/Branch Mode
For operations specific to a branch:

```typescript
// User must have permission at SPECIFIC branch
useHasPermissionForBranch(PERMISSIONS.ORDERS_CREATE, branchId)
```

---

## 📝 Error Messages

When API returns 403, Sonner toast shows:

```
Title: "You don't have the required permissions at any of your assigned branches."
Description:
  "Required: menu:edit
   This action requires the following permission(s): menu:edit. Contact your manager to request access."
```

Fully automatic - just use `handlePermissionError()`.

---

## ✨ Features

✅ **Sidebar auto-filtering** - Links hide without permission (already done)
✅ **Button auto-hiding** - ProtectedButton component ready
✅ **Error handling** - 403 errors show proper toasts with details
✅ **Permission utilities** - Full hook suite available
✅ **Multiple permission modes** - "all" and "any" logic
✅ **Branch-specific checks** - For POS operations
✅ **Owner detection** - Check for wildcard (*) permission
✅ **Permission suggestions** - Error toast includes helpful hints

---

## 📖 Complete Guide

See: `PERMISSION_IMPLEMENTATION_GUIDE.md` for detailed examples and patterns.

---

## Quick Reference

```typescript
// Import what you need
import { useHasPermission } from '@/shared/hooks/use-permissions'
import { ProtectedButton } from '@/shared/ui/protected-button'
import { ProtectedContent } from '@/shared/ui/protected-nav-item'
import { handlePermissionError } from '@/shared/lib/permission-error-handler'
import { PERMISSIONS } from '@/shared/lib/permissions'

// Use in components
const canCreate = useHasPermission(PERMISSIONS.MENU_CREATE)
if (!canCreate) return null

// Use buttons
<ProtectedButton permission={PERMISSIONS.MENU_DELETE}>Delete</ProtectedButton>

// Use sections
<ProtectedContent permission={PERMISSIONS.REPORTS_VIEW}>
  <ReportSection />
</ProtectedContent>

// Handle errors
catch (error) {
  handlePermissionError(error, 'Operation Name')
}
```

---

## Status

- ✅ Sidebar links auto-hide (already configured)
- ⏳ Individual pages need ProtectedButton additions
- ⏳ API error handlers need integration in pages
- ✅ All infrastructure ready to go

**You're ready to add ProtectedButton to your action buttons!**
