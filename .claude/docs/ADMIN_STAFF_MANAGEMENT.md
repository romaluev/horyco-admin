# Admin Panel — Staff Management

This document explains how staff management works in Horyco, including employee management, role-based access control (RBAC), and permission-based access control (PBAC).

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Concepts](#key-concepts)
3. [Employee Management](#employee-management)
4. [Role & Permission System](#role--permission-system)
5. [Frontend Implementation Guide](#frontend-implementation-guide)
6. [API Endpoints](#api-endpoints)

---

## Overview

### 🎯 Purpose

The staff management system allows restaurant owners to:
- Add and manage employees across multiple branches
- Control what employees can do using roles and permissions
- Track employee activity and access
- Support multi-branch operations with flexible access control

### 🏢 Multi-Tenant Architecture

**Important**: Every employee belongs to a specific **tenant** (restaurant brand). Employees can:
- Work at multiple **branches** within the same tenant
- Have different roles at different branches (future feature)
- Only see data from their own tenant (automatic isolation)

---

## Key Concepts

### 1. Employee vs User

**Employee** = A person who works at the restaurant
- Has personal information (name, phone, email)
- Can be assigned to one or more branches
- Has one or more roles
- Can be active or inactive

**Not every employee needs to login**:
- Kitchen staff might not need system access
- Delivery drivers might only use a separate app
- Only cashiers, waiters, and managers typically need POS/Admin access

### 2. Roles (Templates)

**Role** = A template collection of permissions for quick employee setup

**IMPORTANT: Roles are UI templates only**:
- When you select a role during employee creation, its permissions are **copied** to the employee
- The role itself is **NOT stored** with the employee record
- Changing a role template does NOT affect existing employees
- See `03-roles-permissions.md` for detailed architecture

**Default Role Templates** (pre-configured):
- **Owner/CEO** - Full access to everything (`*` permission)
- **Manager** - Branch management, reports, menu editing
- **Cashier** - POS operations, payments, customer management
- **Waiter** - Order taking, table management
- **Kitchen** - View orders, kitchen display
- **Barista** - View orders, create orders

**Custom Role Templates**:
- Owners can create custom templates with specific permission combinations
- Example: "Kitchen Manager" with menu editing + inventory access
- Example: "Senior Cashier" with cashier permissions + refund capability

### 3. Permissions

**Permission** = A specific action that can be performed in the system

Permissions are organized by **category**:

```
orders.*        → Order management
  ├─ orders.create      → Create new orders
  ├─ orders.edit        → Modify existing orders
  ├─ orders.delete      → Cancel orders
  └─ orders.view        → View order history

menu.*          → Menu management
  ├─ menu.create        → Add products/categories
  ├─ menu.edit          → Update menu items
  ├─ menu.delete        → Remove menu items
  └─ menu.view          → View menu

staff.*         → Staff management
  ├─ staff.create       → Add employees
  ├─ staff.edit         → Update employee info
  ├─ staff.delete       → Remove employees
  └─ staff.view         → View employee list

settings.*      → System configuration
  ├─ settings.edit      → Change settings
  └─ settings.view      → View settings

finance.*       → Financial operations
  ├─ finance.view       → View reports
  └─ finance.refund     → Process refunds
```

**Why separate permissions?**
- Fine-grained access control
- Example: A waiter can `orders.create` but not `orders.delete`
- Example: A cashier can `finance.view` but not `settings.edit`

### 4. Branch Assignment

**Why assign branches to employees?**
- Multi-location restaurants need to control which employees work where
- Security: Employees should only access data from their assigned branches
- Reporting: Track performance per branch

**How it works**:
- An employee can be assigned to multiple branches
- One branch is marked as "active branch" (current working location)
- POS filters data based on active branch automatically

---

## Employee Management

### Employee Lifecycle

```
1. Creation (via onboarding or staff invite)
   ↓
2. Permission Assignment (per branch)
   - Role template pre-fills permissions
   - Owner customizes as needed
   ↓
3. Branch Assignment
   ↓
4. Credentials Shared (auto-generated password)
   ↓
5. First Login + Password Change (mustChangePassword: true)
   ↓
6. PIN Setup (optional, for fast POS login)
   ↓
7. Active (working)
   ↓
8. Deactivated (suspended, not deleted)
```

### Staff Invitation Flow

**Two entry points for creating staff:**

1. **During Onboarding (Step 4)**: `POST /admin/onboarding/steps/staff-invite`
2. **After Onboarding**: `POST /admin/staff/employees/invite`

**Key Flow:**
```
Owner fills form → Backend creates Employee → Returns temp password → Owner shares manually → Staff logs in → Forces password change
```

**Important:**
- Employees are created **immediately** (not via invitation links)
- Auto-generated password (8 chars) shown **once** - owner must copy it
- `mustChangePassword: true` set on employee
- Staff **must** change password on first login via `POST /auth/force-change-password`

### Employee Fields Explained

**Required Fields**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+998901234567",  // Used for login
  "password": "secure123"     // Initial password
}
```

**Optional Fields**:
```json
{
  "email": "john@example.com",
  "birthDate": "1990-01-15",
  "hireDate": "2024-01-01",
  "avatar": "https://...",     // Profile picture URL
  "notes": "Works evening shifts"
}
```

**System Fields** (managed automatically):
```json
{
  "id": 123,
  "tenantId": 5,              // Restaurant brand
  "activeBranchId": 10,       // Current working location
  "isActive": true,           // Can login?
  "isOwner": false,           // Is this the business owner? (protected)
  "mustChangePassword": false, // Must change password on next login?
  "status": "active",         // active | inactive | suspended
  "lastLoginAt": "2024-01-20T10:30:00Z",
  "createdAt": "2024-01-01T08:00:00Z",
  "createdBy": 1              // Who created this employee
}
```

**`mustChangePassword` Field:**
- `true` when employee created via staff invitation with auto-generated password
- `false` after employee changes their password
- When `true`, login response includes `mustChangePassword: true`
- Frontend must redirect to password change screen before allowing access

### Owner Protection

**The `isOwner` field** marks the business owner employee. This field provides special protections:

| Protection | Description |
|------------|-------------|
| **Cannot Delete** | Owner employee cannot be deleted (soft or hard) |
| **Cannot Deactivate** | Owner cannot be deactivated via API |
| **Cannot Remove** | Owner cannot be removed from any branch |
| **Automatic Assignment** | Set automatically during onboarding for first employee |

**Why Owner Protection?**
- Prevents accidental lockout of business owners
- Ensures at least one account always has full access
- Protects against malicious removal by other admins

**UI Implications:**
- Hide "Delete" and "Deactivate" buttons for owner employee
- Show "Owner" badge on employee card
- Disable role/permission changes for owner (always has full access)

### Employee Status vs isActive

**Why two fields?**

**`isActive`** (boolean):
- Simple on/off switch
- `false` = Cannot login to system
- Used for temporary suspension

**`status`** (enum):
- More detailed state
- Values: `active`, `inactive`, `suspended`, `terminated`
- Used for reporting and audit

**Example scenarios**:
- Employee on vacation → `isActive: false`, `status: active`
- Employee fired → `isActive: false`, `status: terminated`
- Employee working → `isActive: true`, `status: active`

---

## Role & Permission System

### How RBAC + PBAC Works

**RBAC** (Role-Based Access Control):
- Employees are assigned **roles**
- Roles contain a set of permissions
- Easy to manage groups of permissions

**PBAC** (Permission-Based Access Control):
- Individual permissions can be checked
- Allows fine-grained access control in the UI

**Example**:
- Frontend checks if user has permission (e.g., `orders.delete`)
- If permission exists, show relevant UI elements (e.g., "Cancel Order" button)
- Backend automatically validates permission using guards and decorators

### Default Roles Breakdown

**Admin Role** permissions:
```
ALL permissions (*)
```

**Manager Role** typical permissions:
```
orders.* (all order operations)
menu.view, menu.edit (menu management)
staff.view (view employees)
finance.view (view reports)
settings.view (view settings)
```

**Cashier Role** typical permissions:
```
orders.create, orders.edit, orders.view
payments.* (all payment operations)
customers.* (customer management)
```

**Waiter Role** typical permissions:
```
orders.create, orders.edit, orders.view
tables.* (table management)
customers.view (see customer info)
```

### Creating Custom Roles

**When to create custom roles?**
- You need a combination not covered by defaults
- You want to restrict access more than default roles
- You have specialized staff (e.g., inventory manager)

**Example: Kitchen Manager Role**
```json
{
  "name": "Kitchen Manager",
  "description": "Manages kitchen operations and menu",
  "permissions": [
    "orders.view",           // See incoming orders
    "menu.create",           // Add new dishes
    "menu.edit",             // Update recipes
    "menu.delete",           // Remove items
    "inventory.view",        // (future) See stock levels
    "inventory.edit"         // (future) Update inventory
  ]
}
```

---

## Frontend Implementation Guide

### 1. Employee List Page

**What to show**:
```
┌─────────────────────────────────────────────────┐
│  Employees (12)               [+ Add Employee]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Filter by:                                     │
│  [All Branches ▼] [All Roles ▼] [Active ▼]    │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │ 📷 John Doe                           │    │
│  │    Cashier · Branch A                 │    │
│  │    +998 90 123 45 67                  │    │
│  │    Last login: 2 hours ago            │    │
│  │    [Edit] [Deactivate]                │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │ 📷 Jane Smith                         │    │
│  │    Manager · Branch A, Branch B       │    │
│  │    +998 90 987 65 43                  │    │
│  │    Last login: Yesterday              │    │
│  │    [Edit] [Deactivate]                │    │
│  └───────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Call**:
```
GET /admin/staff/employees

Response:
{
  "employees": [
    {
      "id": 123,
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+998901234567",
      "email": "john@example.com",
      "isActive": true,
      "roles": ["Cashier"],
      "branches": [
        { "id": 10, "name": "Branch A" }
      ],
      "activeBranch": { "id": 10, "name": "Branch A" },
      "lastLoginAt": "2024-01-20T14:30:00Z"
    }
  ]
}
```

### 2. Add/Edit Employee Form

**Step 1: Basic Information**
```
Personal Details:
- First Name *
- Last Name *
- Phone Number * (format: +998XXXXXXXXX)
- Email (optional)
- Birth Date (optional)
- Hire Date (optional)
```

**Step 2: Role Assignment**
```
Select Role(s):
☑ Cashier
☐ Waiter
☐ Manager
☐ Admin
☐ Kitchen Manager (custom)

[View Permissions] ← Shows what each role can do
```

**Step 3: Branch Assignment**
```
Assign to Branches:
☑ Branch A (Main Branch)
☑ Branch B (Downtown)
☐ Branch C (Airport)

Active Branch: [Branch A ▼]
```

**Step 4: Login Credentials**
```
Authentication:
- Password: [**********]
- Enable PIN Login: ☑
  PIN: [1234] (4 digits)
```

**API Call**:
```
POST /admin/staff/employees

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+998901234567",
  "email": "john@example.com",
  "password": "secure123",
  "roleIds": [2, 3],          // Cashier, Waiter
  "branchIds": [10, 11],      // Branch A, Branch B
  "activeBranchId": 10,       // Branch A
  "pin": "1234",              // Optional
  "notes": "Works evening shifts"
}

Response:
{
  "success": true,
  "employee": { ... },
  "message": "Employee created successfully"
}
```

### 3. Role Management Page

**What to show**:
```
┌─────────────────────────────────────────────────┐
│  Roles (4 system + 2 custom)  [+ Create Role]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  System Roles (cannot delete):                 │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ 👑 Admin                            │      │
│  │    Full system access               │      │
│  │    Permissions: All (*)             │      │
│  │    Employees: 2                     │      │
│  │    [View Details]                   │      │
│  └─────────────────────────────────────┘      │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ 👔 Manager                          │      │
│  │    Branch management & reports      │      │
│  │    Permissions: 15                  │      │
│  │    Employees: 3                     │      │
│  │    [View Details]                   │      │
│  └─────────────────────────────────────┘      │
│                                                 │
│  Custom Roles:                                 │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ 🍳 Kitchen Manager                  │      │
│  │    Manages kitchen and menu         │      │
│  │    Permissions: 8                   │      │
│  │    Employees: 1                     │      │
│  │    [Edit] [Delete]                  │      │
│  └─────────────────────────────────────┘      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Create Custom Role Flow**:
```
Step 1: Basic Info
- Role Name: [Kitchen Manager]
- Description: [Manages kitchen operations and menu]

Step 2: Select Permissions (grouped)
📋 Orders
  ☐ Create orders
  ☑ View orders
  ☐ Edit orders
  ☐ Delete orders

🍔 Menu
  ☑ Create menu items
  ☑ Edit menu items
  ☑ Delete menu items
  ☑ View menu

👥 Staff
  ☐ Create employees
  ☐ Edit employees
  ☐ Delete employees
  ☑ View employees

[Cancel] [Create Role]
```

**API Calls**:
```
GET /admin/staff/roles

GET /admin/staff/permissions/grouped
Response:
{
  "orders": [
    { "id": 1, "name": "orders.create", "description": "Create orders" },
    { "id": 2, "name": "orders.view", "description": "View orders" }
  ],
  "menu": [ ... ],
  "staff": [ ... ]
}

POST /admin/staff/roles
Request Body:
{
  "name": "Kitchen Manager",
  "description": "Manages kitchen operations and menu",
  "permissionIds": [2, 5, 6, 7, 8]  // Selected permission IDs
}
```

### 4. Permission Checking in Frontend

**Show/Hide UI Elements**:

**Implementation Notes**:
- Get current user and their permissions from authentication context
- Show "Cancel Order" button only if user has `orders.delete` permission
- Show entire sections (e.g., Financial Reports) only if user has `finance.view` permission
- Disable input fields if user lacks `menu.edit` permission
- Use conditional rendering based on permission checks

**Why check permissions in frontend?**
- Better UX (don't show buttons user can't use)
- Security happens on backend (frontend is just for UX)
- Even if user modifies frontend code, backend will reject unauthorized requests

---

## API Endpoints

### Employee Management

```
// List all employees with search, filtering, and pagination
GET /admin/staff/employees
Query params:
  - search: string (search by name or phone)
  - roleId: number (filter by role)
  - isActive: boolean (filter by active status)
  - branchId: number (filter by assigned branch)
  - page: number (default: 1)
  - limit: number (default: 20, max: 100)
Response: {
  data: Employee[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}

// Get employee details
GET /admin/staff/employees/:id

// Create employee (standard - requires password)
POST /admin/staff/employees
Body: CreateEmployeeDto
Note: Validates branchIds exist and role allows multi-branch assignment

// Invite employee (auto-generates password, must change on first login)
POST /admin/staff/employees/invite
Body: {
  fullName: string,          // Required
  phone: string,             // Required, Uzbekistan format
  email?: string,            // Optional
  branchId: number,          // Required, which branch to assign
  permissionIds: number[],   // Required, at least 1 permission
  password?: string          // Optional, auto-generated if not provided
}
Response: {
  employee: {
    id: number,
    fullName: string,
    phone: string,
    branchId: number
  },
  temporaryPassword: string,  // SHOWN ONLY ONCE - owner must copy!
  permissionsApplied: string[],
  loginInstructions: string
}
Notes:
  - Creates Employee immediately with mustChangePassword: true
  - Returns auto-generated password (8 chars) if not provided
  - Assigns permissions to specified branch
  - Staff must change password on first login via POST /auth/force-change-password

// Bulk import employees from CSV
POST /admin/staff/employees/bulk-import
Content-Type: multipart/form-data
Body: file (CSV with columns: fullName, phone, password, roleIds, branchIds)
Response: {
  total: number,
  success: number,
  failed: number,
  results: [
    { row: number, success: boolean, employeeId?: number, error?: string }
  ]
}
Limits:
  - Max file size: 5MB
  - Max rows: 1000 employees per import
  - Partial success supported (some can succeed while others fail)

// Update employee
PATCH /admin/staff/employees/:id
Body: UpdateEmployeeDto

// Delete employee (soft delete)
DELETE /admin/staff/employees/:id
Note: Returns 403 if attempting to delete owner employee

// Activate employee
PATCH /admin/staff/employees/:id/activate

// Deactivate employee
PATCH /admin/staff/employees/:id/deactivate
Note: Returns 403 if attempting to deactivate owner employee

// Assign branches to employee
PATCH /admin/staff/employees/:id/branches
Body: { branchIds: [10, 11] }
Note: Validates all branchIds exist and role allows multi-branch assignment

// Set active branch
PATCH /admin/staff/employees/:id/active-branch/:branchId

// Change password
PATCH /admin/staff/employees/:id/password
Body: { currentPassword, newPassword }
Security: Requires current password if changing own password,
         or admin permission to change another employee's password

// Get employees by branch (DEPRECATED)
GET /admin/staff/employees/branch/:branchId
Use instead: GET /admin/staff/employees?branchId=:id
```

### Role Management

```
// List all roles with optional pagination
GET /admin/staff/roles
Query params:
  - page: number (optional, default: returns all)
  - limit: number (optional, default: 50, max: 100)
Response (without pagination): Role[]
Response (with pagination): {
  data: Role[],
  meta: { total, page, limit, totalPages, hasNextPage, hasPreviousPage }
}

// Get role details
GET /admin/staff/roles/:id

// Create custom role
POST /admin/staff/roles
Body: {
  name: string,
  description: string,
  permissionIds: number[],
  branchRestriction?: 'single' | 'multiple' (default: 'multiple')
}
Note: branchRestriction controls whether employees with this role
      can be assigned to multiple branches

// Update role
PATCH /admin/staff/roles/:id
Body: { name?, description?, permissionIds?, branchRestriction? }

// Delete role
DELETE /admin/staff/roles/:id

// Add single permission to role
POST /admin/staff/roles/:id/permissions/:permissionId
Response: Updated role with all permissions

// Remove single permission from role
DELETE /admin/staff/roles/:id/permissions/:permissionId
Response: Updated role with all permissions

// Replace all permissions in role
PATCH /admin/staff/roles/:id/permissions
Body: { permissionIds: number[] }
Response: Updated role with new permission set
```

### Permission Management

```
// List all permissions
GET /admin/staff/permissions

// Get permissions grouped by category
GET /admin/staff/permissions/grouped
Returns: { orders: [...], menu: [...], staff: [...] }

// Get system permissions only
GET /admin/staff/permissions/system
```

---

## New Features (Phase 7 Updates)

### 1. Employee Search, Filtering, and Pagination (Task 7.2)

**Purpose**: Efficiently manage large employee lists with search and filtering capabilities.

**Features**:
- **Search**: Find employees by name or phone number (case-insensitive)
- **Filter by Role**: Show only employees with specific role
- **Filter by Status**: Show only active or inactive employees
- **Filter by Branch**: Show only employees assigned to specific branch
- **Pagination**: Load employees in chunks (default 20 per page)

**Example Workflow**:
```
1. Initial Load:
   GET /admin/staff/employees?page=1&limit=20
   → Shows first 20 employees

2. Search for "John":
   GET /admin/staff/employees?search=John&page=1
   → Shows all employees with "John" in name or phone

3. Filter by role and branch:
   GET /admin/staff/employees?roleId=2&branchId=10&page=1
   → Shows all Cashiers at Branch A

4. Combined filters:
   GET /admin/staff/employees?search=John&roleId=2&isActive=true
   → Shows active Cashiers named John
```

**Response Structure**:
```json
{
  "data": [
    {
      "id": 123,
      "fullName": "John Doe",
      "phone": "+998901234567",
      "isActive": true,
      "roles": [{ "id": 2, "name": "Cashier" }],
      "branches": [{ "id": 10, "name": "Branch A" }]
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Frontend Implementation**:
```
┌─────────────────────────────────────────────────────────┐
│  Employees (150)                      [+ Add Employee]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [🔍 Search by name or phone    ]                      │
│                                                         │
│  Filter: [All Roles ▼] [All Branches ▼] [Active ▼]    │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │ Results: 1-20 of 150                        │      │
│  │                                             │      │
│  │ [Employee cards shown here...]              │      │
│  │                                             │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  [◀ Previous] Page 1 of 8 [Next ▶]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 2. Branch Assignment Validation (Task 7.3)

**Purpose**: Prevent invalid branch assignments and enforce role-based restrictions.

**Validation Rules**:

1. **Branch Existence**: All branch IDs must exist and belong to the current tenant
2. **Role Restrictions**: Roles can have branch restrictions:
   - `'multiple'` - Employee can be assigned to many branches (default)
   - `'single'` - Employee can only be assigned to one branch at a time

**Error Messages**:
```json
// Invalid branch ID
{
  "statusCode": 400,
  "message": "Branch with ID 999 not found or does not belong to your organization"
}

// Role restriction violation
{
  "statusCode": 400,
  "message": "Cannot assign multiple branches to employee. The following role(s) have single-branch restriction: Cashier. Please either assign the employee to a single branch or change their role to one that allows multi-branch access."
}
```

**When Validation Happens**:
- Creating new employee with `POST /admin/staff/employees`
- Updating employee branches with `PATCH /admin/staff/employees/:id/branches`
- Updating employee with new role that has stricter restrictions

**Example Scenarios**:

**Scenario 1: Creating Cashier (single-branch role)**
```
POST /admin/staff/employees
{
  "fullName": "John Doe",
  "phone": "+998901234567",
  "password": "secure123",
  "roleIds": [2],        // Cashier role (single-branch)
  "branchIds": [10, 11]  // ❌ Multiple branches
}

Response: 400 Bad Request
"Cannot assign multiple branches - Cashier role has single-branch restriction"
```

**Scenario 2: Creating Manager (multi-branch role)**
```
POST /admin/staff/employees
{
  "fullName": "Jane Smith",
  "phone": "+998909876543",
  "password": "secure456",
  "roleIds": [3],        // Manager role (multiple-branch)
  "branchIds": [10, 11]  // ✅ Multiple branches allowed
}

Response: 201 Created
Employee created successfully
```

---

### 3. Granular Permission Management (Task 7.3)

**Purpose**: Manage role permissions individually without editing entire permission set.

**New Endpoints**:

**Add Single Permission**:
```
POST /admin/staff/roles/5/permissions/12

Use Case: Toggle permission checkbox ON in UI
Response: Updated role with all permissions
```

**Remove Single Permission**:
```
DELETE /admin/staff/roles/5/permissions/12

Use Case: Toggle permission checkbox OFF in UI
Response: Updated role with all permissions
```

**Replace All Permissions**:
```
PATCH /admin/staff/roles/5/permissions
Body: { "permissionIds": [1, 2, 5, 8, 10] }

Use Case: Save button after selecting multiple permissions
Response: Updated role with new permission set
```

**Frontend UI Example**:
```
┌─────────────────────────────────────────────────────┐
│  Edit Role: Manager                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Permissions (toggle individual):                  │
│                                                     │
│  📋 Orders                                          │
│    ☑ Create orders    ← POST .../:id/permissions/1 │
│    ☑ View orders      ← Already has                │
│    ☐ Edit orders      ← POST .../:id/permissions/3 │
│    ☐ Delete orders    ← POST .../:id/permissions/4 │
│                                                     │
│  🍔 Menu                                            │
│    ☑ Create menu      ← DELETE .../:id/permissions/5│
│    ☑ Edit menu                                      │
│    ☑ View menu                                      │
│                                                     │
│  [Save All] ← PATCH .../:id/permissions             │
│             (with all selected IDs)                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Implementation Approaches**:

**Approach A: Immediate Save (Recommended for Simple UI)**
- Each checkbox toggle calls POST or DELETE immediately
- User sees instant feedback
- No need for "Save" button
- Role updates in real-time

**Approach B: Batch Save (Recommended for Complex Forms)**
- User selects multiple permissions
- Clicks "Save" when done
- Calls PATCH with all selected permissionIds
- Better for forms with many permissions

---

### 4. Bulk Employee Import (Task 7.4)

**Purpose**: Import multiple employees at once from CSV file instead of creating them one-by-one.

**Use Cases**:
- Onboarding large restaurant with 50+ existing employees
- Migrating from another system
- Adding seasonal staff in bulk

**CSV Format**:
```csv
fullName,phone,password,roleIds,branchIds
John Doe,+998901234567,password123,"1,2","10,11,12"
Jane Smith,+998909876543,password456,2,10
Bob Wilson,+998909999999,password789,"1,3",11
```

**Field Specifications**:
- `fullName` - Employee's full name (required)
- `phone` - Phone in international format, must be unique (required)
- `password` - Initial password (required)
- `roleIds` - Comma-separated role IDs (required)
  - Single role: `2`
  - Multiple roles: `"1,2,3"` (use quotes)
- `branchIds` - Comma-separated branch IDs (required)
  - Single branch: `10`
  - Multiple branches: `"10,11,12"` (use quotes)

**Limits**:
- Maximum file size: 5MB
- Maximum rows: 1000 employees per import
- Supported format: CSV only

**Response Structure**:
```json
{
  "total": 50,
  "success": 48,
  "failed": 2,
  "results": [
    {
      "row": 1,
      "success": true,
      "employeeId": 100,
      "fullName": "John Doe",
      "phone": "+998901234567"
    },
    {
      "row": 15,
      "success": false,
      "fullName": "Invalid User",
      "phone": "+998900000000",
      "error": "Employee with phone +998900000000 already exists"
    },
    {
      "row": 23,
      "success": false,
      "fullName": "Bad Data",
      "phone": "+998901111111",
      "error": "Role ID 999 not found"
    }
  ]
}
```

**Partial Success**:
- Import continues even if some rows fail
- Each row processed independently
- Successful employees are created
- Failed rows reported with errors
- Response includes both successes and failures

**Frontend Workflow**:
```
Step 1: User clicks "Import Employees"
        → Show file upload dialog

Step 2: User selects CSV file
        → Validate file type and size
        → Show preview (first 5 rows)

Step 3: User confirms import
        → POST /admin/staff/employees/bulk-import
        → Show progress indicator

Step 4: Show results
        ┌────────────────────────────────────────┐
        │  Import Complete                       │
        ├────────────────────────────────────────┤
        │  ✅ 48 employees created successfully  │
        │  ❌ 2 employees failed                 │
        │                                        │
        │  Errors:                               │
        │  • Row 15: Phone already exists        │
        │  • Row 23: Role ID 999 not found       │
        │                                        │
        │  [Download Error Report]               │
        │  [View Imported Employees]             │
        └────────────────────────────────────────┘
```

**Validation Performed**:
- Phone number format and uniqueness
- Role IDs exist and belong to tenant
- Branch IDs exist and belong to tenant
- Required fields present
- CSV format correct

**Error Handling**:
- Row number included for easy debugging
- Specific error message per failure
- Option to download error report for correction

---

### 5. Role Pagination (Task 7.4)

**Purpose**: Paginate role list for tenants with many custom roles.

**Backward Compatible**:
- Without query params: Returns all roles (existing behavior)
- With query params: Returns paginated response

**Usage**:
```
// Get all roles (backward compatible)
GET /admin/staff/roles
Response: Role[]

// Get paginated roles
GET /admin/staff/roles?page=1&limit=20
Response: {
  data: Role[],
  meta: { total, page, limit, totalPages, hasNextPage, hasPreviousPage }
}
```

**When to Use Pagination**:
- Tenant has 50+ custom roles
- Performance concerns with large role lists
- Consistency with other paginated endpoints (employees, products)

**Default Values**:
- Default limit: 50 (roles are typically fewer than employees)
- Maximum limit: 100
- Default page: 1

---

## Common Questions

### Q: Can an employee have multiple roles?

**Yes**. An employee can be assigned multiple roles, and they will have the **union of all permissions** from all their roles.

Example:
- Employee has "Cashier" role (can process payments)
- Employee also has "Waiter" role (can manage tables)
- Employee can do both: process payments AND manage tables

### Q: What's the difference between deactivate and delete?

**Deactivate**:
- Employee record stays in database
- Employee cannot login
- Employee's past orders/shifts are preserved
- Can be reactivated later
- Use case: Temporary suspension, vacation

**Delete** (soft delete):
- Employee record marked as deleted
- Employee cannot login
- Employee data preserved for audit
- Cannot be reactivated (must create new employee)
- Use case: Employee left the company

### Q: Why do I need to set an "active branch"?

**Active branch** determines:
- Which branch's data the employee sees when they login to POS
- Which branch's orders they can create
- Which branch's reports they can access

**Example**:
- Employee works at Branch A (Mon-Fri) and Branch B (Sat-Sun)
- When they login on Monday, active branch = Branch A
- They only see Branch A's menu, orders, customers
- When they login on Saturday, they switch to Branch B

### Q: Can I restrict an employee to specific branches?

**Yes**. When you assign branches to an employee:
- Employee can only access data from assigned branches
- If employee is not assigned to a branch, they cannot see that branch's data
- This is enforced automatically by the backend

### Q: What happens if I delete a role that employees are using?

**The system will prevent deletion** if the role is assigned to any employees.

You must either:
1. Reassign employees to a different role
2. Delete the employees first
3. System roles (Admin, Manager, Cashier, Waiter) cannot be deleted ever

---

## Security Notes

### Backend Validation

**All permission checks happen on the backend**:
- Frontend hiding the button is just UX
- Backend will reject if user lacks permission
- Guards and decorators enforce permission requirements
- Method will not execute if user lacks the required permission

### Tenant Isolation

**Employees can only access their own tenant's data**:
- Employee from Tenant A cannot see Tenant B's data
- This is enforced automatically by `TenantAwareRepository`
- No manual tenantId filtering needed in code

### JWT Tokens

**User's permissions are included in JWT per branch**:
```json
{
  "sub": 123,
  "phone": "+998901234567",
  "tenantId": 5,
  "tenantSlug": "burger-house",
  "branchPermissions": {
    "1": ["orders:view", "orders:create", "orders:edit", "menu:view"],
    "2": ["orders:view", "menu:view"]
  },
  "type": "access"
}
```

**Important Notes**:
- `branchPermissions` contains permission arrays per branch (NOT role names)
- Roles are templates only and are NOT included in JWT
- Each branch can have different permissions for the same employee
- Use `branchPermissions` for authorization checks
- See `03-roles-permissions.md` for the roles-as-templates architecture

---

## Next Steps

After setting up employees:
1. Employees can login using their phone + password
2. Optionally setup PIN login for fast POS access (see `/auth/generate-pin`)
3. Test permissions by having employees login and verify they see correct UI
4. Review audit logs to track who did what

For POS workflow documentation, see:
- `POS_WORKFLOW_NOW.md` - Current POS operations
- `POS_AUTHENTICATION.md` - Login and PIN setup
