# Admin Permission Management - Frontend Documentation

## Business Overview

### What Changed
The permission system has been **completely refactored** from a global role-based system to a **per-branch permission system**.

**Key Changes:**
- Employees can now have **different permissions at different branches**
- Roles are now **templates** (not stored with employees in the database)
- No more "active branch" concept - permissions are checked per operation
- Removed the confusing `active_branch_id` field

**Example:**
- John at Branch A: Can create orders, view menu, manage customers
- John at Branch B: Can only view orders and menu (no customer management)

---

## Business Logic

### 1. Role Templates
Roles now serve as **UI convenience templates** to quickly assign common permission sets.

**System Roles (Pre-configured):**
- **Owner/CEO**: Full access to everything (`*` permission)
- **Manager**: Orders, menu, customers, reports, settings
- **Cashier**: Create orders, process payments, view menu
- **Waiter**: Create orders, view menu, basic customer info
- **Kitchen Staff**: View orders, update kitchen tickets

**Custom Roles:**
Users can create custom role templates with any combination of permissions.

**Important:** Selecting a role during employee assignment **copies its permissions**. The role itself is NOT stored with the employee.

### 2. Permission Structure

**Format:** `category:action`

**Categories:**
- `staff` - Employee management
- `roles` - Role template management
- `branches` - Branch management
- `menu` - Products, categories, modifiers
- `orders` - Orders and shifts
- `customers` - Customer management
- `finance` - Payments, refunds, reports
- `reports` - Analytics and statistics
- `settings` - System configuration

**Actions:**
- `view` - Read-only access (GET requests)
- `create` - Create new records (POST requests)
- `update` - Modify existing records (PUT/PATCH requests)
- `delete` - Delete records (DELETE requests)
- `manage` - Full CRUD access
- `*` - All actions in category

**Examples:**
- `menu:view` - Can see products and categories
- `menu:create` - Can create new products
- `menu:*` - Can do anything with menu
- `orders:view` - Can see orders
- `orders:create` - Can create new orders
- `*` - Super admin (all permissions everywhere)

### 3. Permission Assignment Process

**When creating an employee:**
1. Select branches to assign
2. For each branch:
   - Select a role template (optional)
   - Role's permissions auto-populate checkboxes
   - Add/remove individual permissions as needed
   - Each branch can have different permissions

**When updating an employee:**
1. View employee's current permissions by branch
2. Can change permissions at each branch independently
3. Can copy permissions from one branch to another
4. Can remove access to a branch entirely

---

## UX Flows

### Flow 1: Create Employee with Permissions

```
┌─────────────────────────────────────────┐
│  Create New Employee                    │
├─────────────────────────────────────────┤
│                                         │
│  Name: [________________]               │
│  Phone: [________________]              │
│  Password: [________________]           │
│                                         │
│  ✓ Branch A                             │
│  ✓ Branch B                             │
│  ☐ Branch C                             │
│                                         │
│  [Next: Assign Permissions] ────────►   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Assign Permissions - Branch A          │
├─────────────────────────────────────────┤
│                                         │
│  Role Template: [Manager ▼]            │
│  (Auto-populates permissions below)     │
│                                         │
│  ORDERS                                 │
│  ☑ View orders                          │
│  ☑ Create orders                        │
│  ☑ Update orders                        │
│  ☑ Cancel orders                        │
│                                         │
│  MENU                                   │
│  ☑ View menu                            │
│  ☐ Create products (removed)            │
│  ☐ Update products (removed)            │
│                                         │
│  CUSTOMERS                              │
│  ☑ View customers                       │
│  ☑ Create customers                     │
│                                         │
│  FINANCE                                │
│  ☑ View payments                        │
│  ☐ Process refunds (not in template)    │
│                                         │
│  [Back] [Next: Branch B] ───────────►   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Assign Permissions - Branch B          │
├─────────────────────────────────────────┤
│                                         │
│  Role Template: [Cashier ▼]            │
│                                         │
│  Quick Actions:                         │
│  • [Copy from Branch A]                 │
│  • [Use Template Only]                  │
│                                         │
│  ORDERS                                 │
│  ☑ View orders                          │
│  ☑ Create orders                        │
│  ☐ Update orders                        │
│  ☐ Cancel orders                        │
│                                         │
│  MENU                                   │
│  ☑ View menu                            │
│  ☐ Create products                      │
│                                         │
│  [Back] [Create Employee]               │
└─────────────────────────────────────────┘
```

**User Actions:**
1. Fill basic employee info
2. Select branches
3. For each branch:
   - (Optional) Select role template
   - Review auto-populated permissions
   - Customize by checking/unchecking boxes
4. Submit to create employee

**System Behavior:**
- Role selection auto-checks permissions from that role
- User can modify any permission
- Role itself is NOT saved - only permissions are saved
- Each branch stores its own permission set for this employee

---

### Flow 2: Update Employee Permissions

```
┌─────────────────────────────────────────┐
│  Edit Employee: John Doe                │
├─────────────────────────────────────────┤
│                                         │
│  Tabs: [Basic Info] [🔑 Permissions]    │
│                                         │
│  ┌─ Branch Selector ─────────────────┐  │
│  │ • Branch A (Downtown) [Edit]      │  │
│  │ • Branch B (Airport)  [Edit]      │  │
│  │ • Branch C (Mall)     [Not Assigned]│ │
│  │                                    │  │
│  │ [+ Assign to Branch]               │  │
│  └────────────────────────────────────┘  │
│                                         │
│  Current Permissions at Branch A:       │
│  • Orders: view, create, update         │
│  • Menu: view                           │
│  • Customers: view, create              │
│  • Finance: view                        │
│                                         │
│  [Edit Permissions]                     │
│  [Copy to Another Branch]               │
│  [Remove from Branch A]                 │
│                                         │
└─────────────────────────────────────────┘

When "Edit Permissions" clicked:

┌─────────────────────────────────────────┐
│  Edit Permissions - Branch A            │
├─────────────────────────────────────────┤
│                                         │
│  Current Role Template: Manager         │
│  (Template reference only, not stored)  │
│                                         │
│  Change Template: [Select Role ▼]      │
│  (Will replace all permissions)         │
│                                         │
│  OR modify individual permissions:      │
│                                         │
│  ORDERS                                 │
│  ☑ View orders                          │
│  ☑ Create orders                        │
│  ☑ Update orders                        │
│  ☑ Cancel orders                        │
│  ☐ Manage shifts                        │
│                                         │
│  MENU                                   │
│  ☑ View menu                            │
│  ☐ Create products ←─ Add this?         │
│  ☐ Update products                      │
│                                         │
│  [Cancel] [Save Changes]                │
└─────────────────────────────────────────┘
```

**User Actions:**
1. Navigate to employee edit page
2. Go to Permissions tab
3. Select branch to edit
4. Either:
   - Change role template (replaces all permissions)
   - OR modify individual permissions
5. Save changes

**System Behavior:**
- Shows current permissions grouped by category
- Can change role template (warns: "This will replace all current permissions")
- Can check/uncheck individual permissions
- Changes apply immediately to that branch only
- Other branches unaffected

---

### Flow 3: Copy Permissions Between Branches

```
┌─────────────────────────────────────────┐
│  Copy Permissions                       │
├─────────────────────────────────────────┤
│                                         │
│  Employee: John Doe                     │
│                                         │
│  From: [Branch A ▼]                     │
│                                         │
│  Permissions at Branch A:               │
│  ✓ Orders: view, create, update         │
│  ✓ Menu: view                           │
│  ✓ Customers: view, create              │
│  ✓ Finance: view                        │
│                                         │
│  To: [Branch B ▼]                       │
│                                         │
│  ⚠️  This will REPLACE all current      │
│     permissions at Branch B             │
│                                         │
│  [Cancel] [Copy Permissions]            │
└─────────────────────────────────────────┘
```

**User Actions:**
1. Select employee
2. Click "Copy Permissions" button
3. Select source branch (FROM)
4. Select target branch (TO)
5. Confirm replacement

**System Behavior:**
- Fetches permissions from source branch
- Shows preview of what will be copied
- Warns about replacement
- On confirm: deletes all permissions at target branch, creates new ones

---

### Flow 4: View Employee Permissions (Read-Only)

```
┌─────────────────────────────────────────┐
│  Employee: Jane Smith                   │
├─────────────────────────────────────────┤
│                                         │
│  Status Badges:                         │
│  🟢 Active  📍 2 Branches               │
│                                         │
│  Permissions by Branch:                 │
│                                         │
│  ┌─ Branch A (Downtown) ──────────────┐ │
│  │ Role: Manager (reference)          │ │
│  │                                    │ │
│  │ Orders:     ✓ view, create, update│ │
│  │ Menu:       ✓ view                │ │
│  │ Customers:  ✓ view, create        │ │
│  │ Finance:    ✓ view                │ │
│  │ Reports:    ✓ view                │ │
│  │ Settings:   ✓ view                │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Branch B (Airport) ────────────────┐│
│  │ Role: Cashier (reference)          ││
│  │                                    ││
│  │ Orders:     ✓ view, create         ││
│  │ Menu:       ✓ view                 ││
│  │ Customers:  ✓ view                 ││
│  │ Finance:    ✓ view                 ││
│  └────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 5: Remove Employee from Branch

```
┌─────────────────────────────────────────┐
│  Remove Access                          │
├─────────────────────────────────────────┤
│                                         │
│  Remove John Doe from Branch A?         │
│                                         │
│  This will:                             │
│  • Remove all permissions at Branch A   │
│  • Employee will no longer see Branch A │
│  • Does NOT affect other branches       │
│                                         │
│  ⚠️  Current permissions at Branch A:   │
│     Orders, Menu, Customers, Finance    │
│                                         │
│  [Cancel] [Remove Access]               │
└─────────────────────────────────────────┘
```

---

## API Integration

### Base URL
```
POST   /admin/employees/:employeeId/branches/:branchId/permissions
GET    /admin/employees/:employeeId/branches/:branchId/permissions
PUT    /admin/employees/:employeeId/branches/:branchId/permissions
DELETE /admin/employees/:employeeId/branches/:branchId/permissions
```

### 1. Assign Permissions from Role Template

**Endpoint:** `POST /admin/employees/:employeeId/branches/:branchId/permissions/assign-from-role`

**Use Case:** When user selects a role template during employee creation/edit

**Request:**
```json
{
  "roleId": 5,
  "additionalPermissionIds": [12, 15]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permissions assigned successfully",
  "data": {
    "employeeId": 10,
    "branchId": 1,
    "permissions": [
      {
        "id": 101,
        "permissionId": 1,
        "permissionName": "orders:view",
        "category": "orders",
        "grantedAt": "2025-01-15T10:30:00Z"
      },
      {
        "id": 102,
        "permissionId": 2,
        "permissionName": "orders:create",
        "category": "orders",
        "grantedAt": "2025-01-15T10:30:00Z"
      },
      {
        "id": 103,
        "permissionId": 12,
        "permissionName": "finance:refund",
        "category": "finance",
        "grantedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "totalPermissions": 15
  }
}
```

**UI Flow:**
1. User selects "Manager" role from dropdown
2. Frontend calls this endpoint with `roleId: 5`
3. Backend copies all permissions from Manager role
4. Response shows which permissions were assigned
5. Frontend updates UI with permission checkboxes (all checked)

---

### 2. Assign Permissions Directly (Custom Selection)

**Endpoint:** `POST /admin/employees/:employeeId/branches/:branchId/permissions`

**Use Case:** When user manually selects permissions without role template

**Request:**
```json
{
  "permissionIds": [1, 2, 5, 8, 12]
}
```

**Response:**
```json
{
  "success": true,
  "message": "5 permissions assigned",
  "data": {
    "employeeId": 10,
    "branchId": 1,
    "permissions": [
      {
        "id": 104,
        "permissionId": 1,
        "permissionName": "orders:view",
        "grantedAt": "2025-01-15T10:35:00Z"
      },
      {
        "id": 105,
        "permissionId": 2,
        "permissionName": "orders:create",
        "grantedAt": "2025-01-15T10:35:00Z"
      }
    ]
  }
}
```

**UI Flow:**
1. User checks individual permission boxes
2. On save, frontend sends array of selected permission IDs
3. Backend assigns those permissions
4. Response confirms what was assigned

---

### 3. Get Employee Permissions at Branch

**Endpoint:** `GET /admin/employees/:employeeId/branches/:branchId/permissions`

**Use Case:** Load current permissions when viewing/editing employee

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": 10,
    "branchId": 1,
    "branchName": "Downtown Branch",
    "permissions": [
      {
        "id": 101,
        "permissionId": 1,
        "permissionName": "orders:view",
        "category": "orders",
        "description": "View orders",
        "grantedAt": "2025-01-15T10:30:00Z"
      },
      {
        "id": 102,
        "permissionId": 2,
        "permissionName": "orders:create",
        "category": "orders",
        "description": "Create new orders",
        "grantedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "totalPermissions": 15,
    "groupedByCategory": {
      "orders": ["view", "create", "update", "cancel"],
      "menu": ["view"],
      "customers": ["view", "create"],
      "finance": ["view"]
    }
  }
}
```

**UI Flow:**
1. User opens employee edit page
2. Frontend fetches permissions for each branch
3. Displays permissions grouped by category
4. Pre-checks boxes based on current permissions

---

### 4. Get All Employee Permissions (All Branches)

**Endpoint:** `GET /admin/employees/:employeeId/permissions`

**Use Case:** Overview of employee's permissions across all branches

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": 10,
    "employeeName": "John Doe",
    "branches": [
      {
        "branchId": 1,
        "branchName": "Downtown",
        "permissions": ["orders:view", "orders:create", "menu:view"],
        "totalPermissions": 15
      },
      {
        "branchId": 2,
        "branchName": "Airport",
        "permissions": ["orders:view", "menu:view"],
        "totalPermissions": 5
      }
    ]
  }
}
```

**UI Flow:**
1. User views employee detail page
2. Shows permissions summary by branch
3. Quick overview without drilling into details

---

### 5. Update Permissions (Replace All)

**Endpoint:** `PUT /admin/employees/:employeeId/branches/:branchId/permissions`

**Use Case:** User changes permission selection (replaces all existing)

**Request:**
```json
{
  "permissionIds": [1, 2, 3, 5, 8]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permissions updated successfully",
  "data": {
    "employeeId": 10,
    "branchId": 1,
    "removed": 10,
    "added": 5,
    "permissions": [
      {
        "id": 110,
        "permissionId": 1,
        "permissionName": "orders:view"
      }
    ]
  }
}
```

**UI Flow:**
1. User modifies permission checkboxes
2. On save, frontend sends new full list of permission IDs
3. Backend removes old permissions, adds new ones
4. Response shows what changed

---

### 6. Revoke Specific Permissions

**Endpoint:** `DELETE /admin/employees/:employeeId/branches/:branchId/permissions`

**Use Case:** Remove specific permissions without replacing all

**Request:**
```json
{
  "permissionIds": [2, 5]
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 permissions revoked",
  "data": {
    "employeeId": 10,
    "branchId": 1,
    "revokedPermissions": ["orders:create", "menu:update"],
    "remainingPermissions": 13
  }
}
```

---

### 7. Copy Permissions Between Branches

**Endpoint:** `POST /admin/employees/:employeeId/permissions/copy`

**Use Case:** User clicks "Copy from Branch A" button

**Request:**
```json
{
  "fromBranchId": 1,
  "toBranchId": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permissions copied successfully",
  "data": {
    "employeeId": 10,
    "fromBranch": {
      "id": 1,
      "name": "Downtown"
    },
    "toBranch": {
      "id": 2,
      "name": "Airport"
    },
    "copiedPermissions": 15,
    "replacedPermissions": 5
  }
}
```

**UI Flow:**
1. User clicks "Copy Permissions" button
2. Selects source and target branches
3. Frontend calls this endpoint
4. Backend copies all permissions
5. Shows success message

---

### 8. Remove All Permissions at Branch

**Endpoint:** `DELETE /admin/employees/:employeeId/branches/:branchId/permissions/all`

**Use Case:** Remove employee from branch completely

**Response:**
```json
{
  "success": true,
  "message": "All permissions removed from branch",
  "data": {
    "employeeId": 10,
    "branchId": 1,
    "removedPermissions": 15
  }
}
```

---

## Error Responses

### 403 Forbidden - Missing Permission
```json
{
  "statusCode": 403,
  "message": "Missing required permissions at branch 1: staff:manage",
  "error": "Forbidden"
}
```

**UI Handling:** Show error toast, don't allow action

### 400 Bad Request - Missing Branch ID
```json
{
  "statusCode": 400,
  "message": "Branch ID is required for permission checking. Include branchId in request params, body, or query.",
  "error": "Bad Request"
}
```

**UI Handling:** Ensure branchId is always in URL or request body

### 404 Not Found - Employee or Permission Not Found
```json
{
  "statusCode": 404,
  "message": "Employee not found",
  "error": "Not Found"
}
```

### 409 Conflict - Permission Already Exists
```json
{
  "statusCode": 200,
  "message": "Permission already granted (idempotent)",
  "data": {
    "alreadyHad": true
  }
}
```

**UI Handling:** Treat as success, no need to show error

---

## UI Components

### Permission Checkbox Grid

```
┌─────────────────────────────────────────┐
│  ORDERS                                 │
│  ☑ View orders                          │
│  ☑ Create orders                        │
│  ☑ Update orders                        │
│  ☐ Cancel orders                        │
│  ☐ Manage shifts                        │
├─────────────────────────────────────────┤
│  MENU                                   │
│  ☑ View menu                            │
│  ☐ Create products                      │
│  ☐ Update products                      │
│  ☐ Delete products                      │
├─────────────────────────────────────────┤
│  CUSTOMERS                              │
│  ☑ View customers                       │
│  ☑ Create customers                     │
│  ☐ Update customers                     │
│  ☐ Delete customers                     │
├─────────────────────────────────────────┤
│  [Select All] [Deselect All]           │
└─────────────────────────────────────────┘
```

**Data Structure:**
```json
{
  "orders": {
    "view": true,
    "create": true,
    "update": true,
    "cancel": false,
    "manage": false
  },
  "menu": {
    "view": true,
    "create": false,
    "update": false,
    "delete": false
  }
}
```

---

### Role Template Selector

```
┌─────────────────────────────────────────┐
│  Quick Start with Role Template         │
│                                         │
│  [Select Role ▼]                        │
│  • Owner (All permissions)              │
│  • Manager (Orders, Menu, Customers)    │
│  • Cashier (Orders, Payments)           │
│  • Waiter (Orders, View Menu)           │
│  • Kitchen Staff (Kitchen Tickets)      │
│  • Custom...                            │
│                                         │
│  ℹ️  Selecting a role auto-fills        │
│     permissions. You can customize      │
│     after selection.                    │
└─────────────────────────────────────────┘
```

**On Selection:**
- Fetches role's permissions: `GET /admin/roles/:roleId`
- Auto-checks corresponding permission boxes
- User can then modify

---

### Branch Permission Summary Card

```
┌───────────────────────────────────────┐
│ 📍 Downtown Branch                    │
├───────────────────────────────────────┤
│ Role: Manager (reference)             │
│                                       │
│ Permissions: 15                       │
│ • Orders: Full access                 │
│ • Menu: View only                     │
│ • Customers: View, Create             │
│ • Finance: View only                  │
│                                       │
│ [Edit] [Copy to...] [Remove]          │
└───────────────────────────────────────┘
```

---

## Best Practices

### For Frontend Developers

1. **Always Include Branch ID**
   - In URL params: `/branches/:branchId/...`
   - In request body: `{ branchId: 1, ... }`
   - In query params: `?branchId=1`

2. **Handle Permission Errors Gracefully**
   - Show clear error messages
   - Don't show actions user can't perform
   - Check permissions before rendering buttons

3. **Use Role Templates for UX**
   - Show role selector first
   - Auto-populate permissions
   - Let user customize after

4. **Group Permissions by Category**
   - Makes UI cleaner
   - Easier to understand
   - Follows API response structure

5. **Provide Permission Preview**
   - Show what permissions will be assigned before saving
   - Especially important when copying between branches

---

## Testing Scenarios

### Scenario 1: Create Employee with Different Permissions per Branch
1. Create employee "John"
2. Assign to Branch A with Manager permissions
3. Assign to Branch B with Cashier permissions
4. Verify John sees different menus at each branch
5. Verify John can create products at Branch A but not Branch B

### Scenario 2: Update Permissions
1. Edit existing employee
2. Change Branch A from Manager to Cashier
3. Verify permissions updated
4. Verify Branch B permissions unchanged

### Scenario 3: Copy Permissions
1. John has full permissions at Branch A
2. Copy from Branch A to Branch B
3. Verify Branch B now has same permissions
4. Modify Branch B permissions
5. Verify Branch A unchanged

### Scenario 4: Remove Access
1. Employee assigned to 3 branches
2. Remove from Branch B
3. Verify no permissions at Branch B
4. Verify other branches unchanged
5. Verify employee can't access Branch B

---

## Migration from Old System

### For Existing Employees

**Old System:**
- Employee had roles: ["Manager", "Cashier"]
- Had active_branch_id: 1
- Permissions were global

**New System:**
- Employee has permissions per branch
- No active_branch_id
- No role relationship in database

**Migration Steps:**
1. For each employee with roles
2. For each branch they're assigned to
3. Copy permissions from their first role
4. Save to employee_branch_permissions table

**Frontend Impact:**
- Update employee creation forms
- Update employee edit forms
- Remove "active branch" selector
- Add "permissions by branch" view

---

## Permission Modes: Admin Panel vs POS

### Overview

The backend uses two permission checking modes to handle different application contexts:

| Mode | Application | Branch Required? | How It Checks |
|------|-------------|------------------|---------------|
| `any_branch` | **Admin Panel** | No | User has permission at ANY branch |
| `branch` | **POS** | Yes | User has permission at SPECIFIC branch |

### Why Two Modes?

**Admin Panel (`any_branch` mode):**
- Menu is **shared across all branches** (tenant-wide)
- Settings affect the whole tenant
- Reports can view all branches
- User only needs the permission **somewhere** to access

**POS (`branch` mode):**
- Operations are **branch-specific**
- User must have permission at the branch they're working at
- Requires `branchId` in request (params, body, or query)

### Frontend Impact

**For Admin Panel:**
- No need to pass `branchId` for permission checking
- Backend automatically checks if user has permission at any of their branches
- User sees features based on their combined permissions across all branches

**For POS:**
- Always include `branchId` in requests
- User sees features based on permissions at their current branch
- Different menus/capabilities at different branches

### Error Handling

**Admin Panel (any_branch mode):**
```json
{
  "statusCode": 403,
  "message": "Missing required permissions: menu:edit. You need these permissions at least at one branch.",
  "error": "Forbidden"
}
```

**POS (branch mode):**
```json
{
  "statusCode": 403,
  "message": "Missing required permissions at branch 5: orders:create",
  "error": "Forbidden"
}
```

### Endpoint Permission Reference

All Admin Panel endpoints now use the following permission requirements:

| Controller | View Permission | Write Permission |
|------------|-----------------|------------------|
| Staff | `staff:view` | `staff:create`, `staff:edit`, `staff:delete`, `staff:permissions` |
| Menu | `menu:view` | `menu:create`, `menu:edit`, `menu:delete` |
| Branch | `branches:view` | `branches:edit`, `branches:halls`, `tables:manage` |
| Customer | `customers:view` | `customers:create`, `customers:edit` |
| Finance | `finance:view` | `finance:transactions`, `finance:cash`, `finance:reports` |
| Settings | `settings:view` | `settings:edit` |
| Analytics | `reports:sales` | - |

---

## Summary

### Key Points
1. **Permissions are per-branch** - same employee, different permissions at each branch
2. **Roles are templates** - used in UI only, not stored with employees
3. **Admin Panel uses `any_branch` mode** - no branchId needed, checks all branches
4. **POS uses `branch` mode** - requires branchId, checks specific branch
5. **Flexible assignment** - can use role template or fully customize

### Frontend Checklist
- [ ] Update employee creation form with branch permission selector
- [ ] Add permission checkbox grid component
- [ ] Implement role template dropdown
- [ ] Add "Copy permissions" feature
- [ ] Show permissions by branch in employee detail view
- [ ] Handle 403 errors for missing permissions
- [ ] Test permission assignment at multiple branches
- [ ] Admin Panel: No need to pass branchId for most operations
- [ ] POS: Always include branchId in requests
