# Admin Branch Management

Manage restaurant locations (branches). Each branch represents a physical restaurant location with its own address, contact info, staff, and settings.

---

## 📋 Table of Contents

1. [Core Concepts](#core-concepts)
2. [Branch List & Details](#branch-list--details)
3. [Create Branch](#create-branch)
4. [Update Branch](#update-branch)
5. [Delete Branch](#delete-branch)
6. [Branch Statistics](#branch-statistics)
7. [Bulk Creation](#bulk-creation)
8. [UI Workflows](#ui-workflows)

---

## Core Concepts

### What is a Branch?

A branch is a physical restaurant location. Each branch has:
- Address and contact information
- Operating hours
- Staff assignments
- Halls and tables
- Own statistics and reports

**Hierarchy:**
```
Tenant (Restaurant Chain)
  └── Branch (Physical Location)
      └── Hall (Dining Area)
          └── Table (Seating)
```

**Why it matters:**
- Branches can have different menus, prices, hours
- Staff assigned to specific branches
- Reports filtered by branch
- Settings can override at branch level

---

## Branch List & Details

### Get All Branches

**Endpoint:** `GET /admin/branches`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Downtown Branch",
    "address": "123 Main St, Tashkent",
    "phoneNumber": "+998901234567",
    "email": "downtown@restaurant.com",
    "isActive": true,
    "hallCount": 3,
    "tableCount": 25,
    "createdAt": "2025-01-15T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Mall Branch",
    "address": "Mega Planet Mall, Floor 3",
    "phoneNumber": "+998907654321",
    "email": "mall@restaurant.com",
    "isActive": true,
    "hallCount": 2,
    "tableCount": 15,
    "createdAt": "2025-02-01T14:00:00Z"
  }
]
```

**Use for:** Branch list page, branch selector dropdown

### Get Single Branch

**Endpoint:** `GET /admin/branches/:id`

**Response:**
```json
{
  "id": 1,
  "name": "Downtown Branch",
  "address": "123 Main St, Tashkent",
  "phoneNumber": "+998901234567",
  "email": "downtown@restaurant.com",
  "isActive": true,
  "metadata": {
    "seatingCapacity": 80,
    "parkingAvailable": true,
    "wifiPassword": "guest123"
  },
  "hallCount": 3,
  "tableCount": 25,
  "activeSessionCount": 5,
  "employeeCount": 12,
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-20T08:30:00Z"
}
```

**Use for:** Branch detail page, edit form

---

## Create Branch

**Endpoint:** `POST /admin/branches`

**Request:**
```json
{
  "name": "Airport Branch",
  "address": "Terminal 1, Airport Rd, Tashkent",
  "phoneNumber": "+998909876543",
  "email": "airport@restaurant.com",
  "metadata": {
    "seatingCapacity": 50,
    "parkingAvailable": false
  }
}
```

**Response (201):**
```json
{
  "id": 3,
  "name": "Airport Branch",
  "address": "Terminal 1, Airport Rd, Tashkent",
  "phoneNumber": "+998909876543",
  "email": "airport@restaurant.com",
  "isActive": true,
  "metadata": {
    "seatingCapacity": 50,
    "parkingAvailable": false
  },
  "hallCount": 0,
  "tableCount": 0,
  "createdAt": "2025-03-01T12:00:00Z"
}
```

**Validation:**
- `name`: Required, 1-100 characters, must be unique per tenant
- `address`: Required, 1-200 characters
- `phoneNumber`: Optional, valid phone format
- `email`: Optional, valid email format
- `metadata`: Optional, any JSON object

**Errors:**
- 400: Validation failed (duplicate name, invalid format)
- 401: Unauthorized
- 403: Insufficient permissions

---

## Update Branch

**Endpoint:** `PATCH /admin/branches/:id`

**Request (partial update):**
```json
{
  "phoneNumber": "+998901111111",
  "metadata": {
    "seatingCapacity": 100,
    "parkingAvailable": true,
    "wifiPassword": "newpass456"
  }
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Downtown Branch",
  "address": "123 Main St, Tashkent",
  "phoneNumber": "+998901111111",
  "email": "downtown@restaurant.com",
  "isActive": true,
  "metadata": {
    "seatingCapacity": 100,
    "parkingAvailable": true,
    "wifiPassword": "newpass456"
  },
  "updatedAt": "2025-03-05T16:20:00Z"
}
```

**Note:** Only send fields you want to update.

---

## Delete Branch

### Step 1: Check if Can Delete

**Endpoint:** `GET /admin/branches/:id/can-delete`

**Response:**
```json
{
  "canDelete": false,
  "blockingReasons": {
    "halls": "Branch has 3 halls. Delete halls first.",
    "orders": null,
    "employees": "5 employees assigned. Reassign them first."
  }
}
```

**If can delete:**
```json
{
  "canDelete": true,
  "blockingReasons": {
    "halls": null,
    "orders": null,
    "employees": null
  }
}
```

### Step 2: Delete Branch

**Endpoint:** `DELETE /admin/branches/:id`

**Response (200):**
```json
{
  "id": 3,
  "message": "Branch deleted successfully"
}
```

**Deletion Rules:**
- Cannot delete if halls exist → delete halls first
- Cannot delete if employees assigned → reassign first
- Cannot delete if active orders → wait for orders to complete

---

## Branch Statistics

**Endpoint:** `GET /admin/branches/:id/statistics?period=week`

**Query Parameters:**
- `period`: `today` | `week` | `month` | `year`

**Response:**
```json
{
  "branchId": 1,
  "branchName": "Downtown Branch",
  "period": "week",
  "startDate": "2025-03-01",
  "endDate": "2025-03-07",
  "revenue": {
    "total": 5400000,
    "cash": 2100000,
    "card": 2800000,
    "digital": 500000
  },
  "orders": {
    "total": 342,
    "completed": 338,
    "cancelled": 4,
    "averageValue": 15789
  },
  "capacity": {
    "totalSeats": 80,
    "averageOccupancy": 0.68,
    "peakHour": "19:00",
    "peakOccupancy": 0.95
  },
  "topProducts": [
    {
      "productId": 15,
      "productName": "Margherita Pizza",
      "quantitySold": 125,
      "revenue": 890000
    },
    {
      "productId": 8,
      "productName": "Carbonara Pasta",
      "quantitySold": 98,
      "revenue": 745000
    }
  ]
}
```

**Use for:** Branch performance dashboard

---

## Bulk Creation

**Endpoint:** `POST /admin/branches/bulk`

**Request:**
```json
{
  "branches": [
    {
      "name": "Branch A",
      "address": "Address A",
      "phoneNumber": "+998901111111"
    },
    {
      "name": "Branch B",
      "address": "Address B",
      "phoneNumber": "+998902222222"
    },
    {
      "name": "Branch C",
      "address": "Address C",
      "phoneNumber": "+998903333333"
    }
  ]
}
```

**Response:**
```json
{
  "success": 2,
  "failed": 1,
  "results": [
    {
      "index": 0,
      "branchId": 10,
      "name": "Branch A"
    },
    {
      "index": 1,
      "error": "Duplicate name 'Branch B'",
      "name": "Branch B"
    },
    {
      "index": 2,
      "branchId": 11,
      "name": "Branch C"
    }
  ]
}
```

**Limits:**
- Minimum 1, maximum 50 branches per request
- Each branch validated individually
- Partial success: some branches created, others failed

**Use for:** CSV import, migration from another system

---

## UI Workflows

### Workflow 1: Branch List Page

**Screen: Branch List**

```
┌─────────────────────────────────────────────────┐
│  Branches (3)                    [+ Add Branch] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Downtown Branch                     ✓    │  │
│  │ 123 Main St, Tashkent                    │  │
│  │ 📞 +998901234567                         │  │
│  │ 🏠 3 halls • 25 tables                   │  │
│  │ [View] [Edit] [Delete]                   │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Mall Branch                         ✓    │  │
│  │ Mega Planet Mall, Floor 3                │  │
│  │ 📞 +998907654321                         │  │
│  │ 🏠 2 halls • 15 tables                   │  │
│  │ [View] [Edit] [Delete]                   │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Airport Branch                      ✗    │  │
│  │ Terminal 1, Airport Rd                   │  │
│  │ 📞 +998909876543                         │  │
│  │ 🏠 0 halls • 0 tables                    │  │
│  │ [View] [Edit] [Delete]                   │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Data Loading:**
1. `GET /admin/branches` on page load
2. Display list with stats
3. Show active/inactive status

### Workflow 2: Create New Branch

**Steps:**

1. **Click "+ Add Branch"** → Open form modal/page

2. **Fill form:**
```
┌─────────────────────────────────────────────────┐
│  Create New Branch                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Branch Name *                                  │
│  [_____________________________________]        │
│                                                 │
│  Address *                                      │
│  [_____________________________________]        │
│                                                 │
│  Phone Number                                   │
│  [_____________________________________]        │
│                                                 │
│  Email                                          │
│  [_____________________________________]        │
│                                                 │
│  Additional Info (Optional)                     │
│  Seating Capacity: [____]                       │
│  Parking Available: [✓]                         │
│  WiFi Password: [__________]                    │
│                                                 │
│  [Cancel]                    [Create Branch]    │
└─────────────────────────────────────────────────┘
```

3. **Submit:** `POST /admin/branches`

4. **Success:**
   - Close modal
   - Show toast: "Branch created successfully"
   - Redirect to branch detail or refresh list

5. **Error:**
   - Show validation errors inline
   - "Name already exists"
   - "Invalid phone format"

### Workflow 3: Delete Branch

**Steps:**

1. **Click "Delete" button** → Check first

2. **Call:** `GET /admin/branches/:id/can-delete`

3. **If canDelete = false:**
```
┌─────────────────────────────────────────────────┐
│  Cannot Delete Branch                           │
├─────────────────────────────────────────────────┤
│                                                 │
│  ⚠️ This branch cannot be deleted because:      │
│                                                 │
│  • 3 halls exist → [Delete Halls First]        │
│  • 5 employees assigned → [Reassign Staff]     │
│                                                 │
│  Please resolve these issues first.             │
│                                                 │
│  [Cancel]                                       │
└─────────────────────────────────────────────────┘
```

4. **If canDelete = true:**
```
┌─────────────────────────────────────────────────┐
│  Delete Branch?                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Are you sure you want to delete:              │
│                                                 │
│  Downtown Branch                                │
│  123 Main St, Tashkent                          │
│                                                 │
│  ⚠️ This action cannot be undone.               │
│                                                 │
│  [Cancel]                    [Delete Branch]    │
└─────────────────────────────────────────────────┘
```

5. **Confirm:** `DELETE /admin/branches/:id`

6. **Success:** Redirect to list, show toast

### Workflow 4: Branch Statistics

**Screen: Branch Detail → Stats Tab**

```
┌─────────────────────────────────────────────────┐
│  Downtown Branch - Statistics                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Period: [Today] [Week] [Month] [Year]          │
│                                                 │
│  Revenue (This Week)                            │
│  ┌─────────────────────────────────────────┐   │
│  │ Total: 5,400,000 UZS                    │   │
│  │ Cash:  2,100,000 UZS (39%)              │   │
│  │ Card:  2,800,000 UZS (52%)              │   │
│  │ Digital: 500,000 UZS (9%)               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Orders                                         │
│  ┌─────────────────────────────────────────┐   │
│  │ Total: 342 orders                       │   │
│  │ Completed: 338 (99%)                    │   │
│  │ Cancelled: 4 (1%)                       │   │
│  │ Avg Value: 15,789 UZS                   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Capacity                                       │
│  ┌─────────────────────────────────────────┐   │
│  │ Total Seats: 80                         │   │
│  │ Avg Occupancy: 68%                      │   │
│  │ Peak Hour: 19:00 (95%)                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Top Products                                   │
│  1. Margherita Pizza - 125 sold (890k UZS)      │
│  2. Carbonara Pasta - 98 sold (745k UZS)        │
│  3. Caesar Salad - 87 sold (520k UZS)           │
└─────────────────────────────────────────────────┘
```

**Data Loading:**
1. `GET /admin/branches/:id/statistics?period=week`
2. Display charts and stats
3. Allow period switching (today/week/month/year)

### Workflow 5: Bulk Import from CSV

**Steps:**

1. **Upload CSV file** with columns: name, address, phone, email

2. **Parse CSV** → Convert to array of branch objects

3. **Call:** `POST /admin/branches/bulk`

4. **Show results:**
```
┌─────────────────────────────────────────────────┐
│  Import Results                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✓ 18 branches created successfully             │
│  ✗ 2 branches failed                            │
│                                                 │
│  Failed Branches:                               │
│  • Row 5: "Branch B" - Duplicate name           │
│  • Row 12: "Airport" - Missing address          │
│                                                 │
│  [Download Failed Rows] [Close]                 │
└─────────────────────────────────────────────────┘
```

5. **User can:**
   - Download failed rows as CSV
   - Fix errors
   - Re-import failed rows

---

## API Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/admin/branches` | List all branches |
| `GET` | `/admin/branches/:id` | Get branch details |
| `POST` | `/admin/branches` | Create branch |
| `PATCH` | `/admin/branches/:id` | Update branch |
| `DELETE` | `/admin/branches/:id` | Delete branch |
| `GET` | `/admin/branches/:id/can-delete` | Check if can delete |
| `GET` | `/admin/branches/:id/statistics` | Get branch stats |
| `POST` | `/admin/branches/bulk` | Bulk create branches |
