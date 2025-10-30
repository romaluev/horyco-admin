# Admin Panel — Staff Management

This document explains how staff management works in OshLab, including employee management, role-based access control (RBAC), and permission-based access control (PBAC).

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

### 2. Roles

**Role** = A collection of permissions that define what an employee can do

**Default Roles** (created automatically for every new tenant):

- **Admin** - Full access to everything (owner)
- **Manager** - Branch management, reports, menu editing
- **Cashier** - POS operations, payments, customer management
- **Waiter** - Order taking, table management

**Custom Roles**:

- Owners can create custom roles with specific permission combinations
- Example: "Kitchen Manager" with menu editing + inventory access
- Example: "Senior Waiter" with waiter permissions + shift management

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
1. Creation
   ↓
2. Role Assignment
   ↓
3. Branch Assignment
   ↓
4. PIN Setup (optional, for fast POS login)
   ↓
5. Active (working)
   ↓
6. Deactivated (suspended, not deleted)
```

### Employee Fields Explained

**Required Fields**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+998901234567", // Used for login
  "password": "secure123" // Initial password
}
```

**Optional Fields**:

```json
{
  "email": "john@example.com",
  "birthDate": "1990-01-15",
  "hireDate": "2024-01-01",
  "avatar": "https://...", // Profile picture URL
  "notes": "Works evening shifts"
}
```

**System Fields** (managed automatically):

```json
{
  "id": 123,
  "tenantId": 5, // Restaurant brand
  "activeBranchId": 10, // Current working location
  "isActive": true, // Can login?
  "status": "active", // active | inactive | suspended
  "lastLoginAt": "2024-01-20T10:30:00Z",
  "createdAt": "2024-01-01T08:00:00Z",
  "createdBy": 1 // Who created this employee
}
```

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

```typescript
// Frontend checks if user has permission
if (user.permissions.includes('orders.delete')) {
  // Show "Cancel Order" button
}

// Backend automatically validates
@RequirePermissions('orders.delete')
async cancelOrder() { ... }
```

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
    "orders.view", // See incoming orders
    "menu.create", // Add new dishes
    "menu.edit", // Update recipes
    "menu.delete", // Remove items
    "inventory.view", // (future) See stock levels
    "inventory.edit" // (future) Update inventory
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

```typescript
// Get all employees
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

```typescript
// Create employee
POST /admin/staff/employees
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

```typescript
// Get all roles
GET /admin/staff/roles

// Get permissions grouped by category
GET /admin/staff/permissions/grouped
{
  "orders": [
    { "id": 1, "name": "orders.create", "description": "Create orders" },
    { "id": 2, "name": "orders.view", "description": "View orders" }
  ],
  "menu": [ ... ],
  "staff": [ ... ]
}

// Create custom role
POST /admin/staff/roles
{
  "name": "Kitchen Manager",
  "description": "Manages kitchen operations and menu",
  "permissionIds": [2, 5, 6, 7, 8]  // Selected permission IDs
}
```

### 4. Permission Checking in Frontend

**Show/Hide UI Elements**:

```typescript
// In your component
const user = useAuth(); // Get current user from context

// Show "Cancel Order" button only if user has permission
{user.permissions.includes('orders.delete') && (
  <Button onClick={handleCancelOrder}>
    Cancel Order
  </Button>
)}

// Show entire section based on permission
{user.permissions.includes('finance.view') && (
  <FinancialReportsSection />
)}

// Disable field if no edit permission
<Input
  disabled={!user.permissions.includes('menu.edit')}
  value={productName}
/>
```

**Why check permissions in frontend?**

- Better UX (don't show buttons user can't use)
- Security happens on backend (frontend is just for UX)
- Even if user modifies frontend code, backend will reject unauthorized requests

---

## API Endpoints

### Employee Management

```typescript
// List all employees
GET /admin/staff/employees
Query params: ?branchId=10&roleId=2&status=active

// Get employee details
GET /admin/staff/employees/:id

// Create employee
POST /admin/staff/employees
Body: CreateEmployeeDto

// Update employee
PATCH /admin/staff/employees/:id
Body: UpdateEmployeeDto

// Delete employee (soft delete)
DELETE /admin/staff/employees/:id

// Activate employee
PATCH /admin/staff/employees/:id/activate

// Deactivate employee
PATCH /admin/staff/employees/:id/deactivate

// Assign branches to employee
PATCH /admin/staff/employees/:id/branches
Body: { branchIds: [10, 11] }

// Set active branch
PATCH /admin/staff/employees/:id/active-branch/:branchId

// Change password
PATCH /admin/staff/employees/:id/password
Body: { currentPassword, newPassword }

// Get employees by branch
GET /admin/staff/employees/branch/:branchId
```

### Role Management

```typescript
// List all roles
GET /admin/staff/roles

// Get role details
GET /admin/staff/roles/:id

// Create custom role
POST /admin/staff/roles
Body: { name, description, permissionIds }

// Update role
PATCH /admin/staff/roles/:id
Body: { name?, description?, permissionIds? }

// Delete role
DELETE /admin/staff/roles/:id
```

### Permission Management

```typescript
// List all permissions
GET /admin/staff/permissions

// Get permissions grouped by category
GET /admin/staff/permissions/grouped
Returns: { orders: [...], menu: [...], staff: [...] }

// Get system permissions only
GET /admin/staff/permissions/system
```

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

```typescript
// Frontend hiding the button is just UX
// Backend will reject if no permission
@UseGuards(PermissionGuard)
@RequirePermissions('orders.delete')
async cancelOrder() {
  // This will not execute if user lacks permission
}
```

### Tenant Isolation

**Employees can only access their own tenant's data**:

- Employee from Tenant A cannot see Tenant B's data
- This is enforced automatically by `TenantAwareRepository`
- No manual tenantId filtering needed in code

### JWT Tokens

**User's permissions are included in JWT**:

```json
{
  "sub": 123,                // Employee ID
  "phone": "+998901234567",
  "tenantId": 5,
  "roles": ["Cashier", "Waiter"],
  "permissions": ["orders.create", "orders.view", ...],
  "activeBranchId": 10
}
```

This allows frontend to check permissions without extra API calls.

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
