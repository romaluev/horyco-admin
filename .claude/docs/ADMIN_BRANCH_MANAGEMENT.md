# Branch Management - Complete Step-by-Step Guide

This document covers every screen and case for managing restaurant branches (physical locations).

---

## Quick Summary

```
User opens Branch Management
    |
    v
[Screen 1: Branch List]
    |
    +-- Click "Add Branch" --> [Screen 2: Create Branch]
    |                              |
    |                              v
    |                         Branch created
    |                              |
    +-- Click branch card -----> [Screen 3: Branch Details]
    |                              |
    |                              +-- Click Edit --> [Screen 4: Edit Branch]
    |                              |
    |                              +-- Click Delete --> Check can delete?
    |                              |                        |
    |                              |                   +----+----+
    |                              |                   |         |
    |                              |                   v         v
    |                              |                  YES        NO
    |                              |                   |         |
    |                              |                   v         v
    |                              |            [Screen 5:  [Screen 6:
    |                              |             Confirm     Cannot
    |                              |             Delete]     Delete]
    |                              |
    |                              +-- Click Stats --> [Screen 7: Statistics]
    |
    +-- Search/Filter ----------> Filtered list
```

---

## What is a Branch?

Think of a branch as a physical restaurant location.

A branch has its own:
- Address and contact information
- Operating hours
- Staff assignments
- Halls and tables
- Statistics and reports

Hierarchy:

```
Tenant (Restaurant Chain)
    |
    +-- Branch (Physical Location)
            |
            +-- Hall (Dining Area)
                    |
                    +-- Table (Seating)
```

Why branches matter for frontend:
- Different menus, prices, hours per location
- Staff assigned to specific branches
- Reports filtered by branch
- Settings can override at branch level
- User may only have permissions for certain branches

---

## Screen 1: Branch List

### When to Show

Show this screen when:
- User navigates to /admin/branches
- User clicks "Branches" in navigation menu

Do NOT show when:
- User lacks `branch:view` permission
- Onboarding not completed

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  Branches (3)                  [+ Add Branch] |
|  -----------                                  |
|                                               |
|  +---------------------------------------+    |
|  | Search by name or address...          |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | Downtown Branch              [Active] |    |
|  | 123 Main St, Tashkent                 |    |
|  | +998 90 123 45 67                     |    |
|  | 3 halls - 25 tables                   |    |
|  | [View]  [Edit]  [Delete]              |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | Mall Branch                  [Active] |    |
|  | Mega Planet Mall, Floor 3             |    |
|  | +998 90 765 43 21                     |    |
|  | 2 halls - 15 tables                   |    |
|  | [View]  [Edit]  [Delete]              |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | Airport Branch             [Inactive] |    |
|  | Terminal 1, Airport Rd                |    |
|  | +998 90 987 65 43                     |    |
|  | 0 halls - 0 tables (not configured)   |    |
|  | [View]  [Edit]  [Delete]              |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Enter search text | Filter branches by name or address |
| Click Add Branch | GO TO: Screen 2 (Create Branch) |
| Click View | GO TO: Screen 3 (Branch Details) |
| Click Edit | GO TO: Screen 4 (Edit Branch) |
| Click Delete | Check can delete, show appropriate modal |

### API Call

```
GET /admin/branches
Authorization: Bearer {token}

Query Parameters:
- search (optional): Filter by name or address

Response (200):
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
    "email": null,
    "isActive": true,
    "hallCount": 2,
    "tableCount": 15,
    "createdAt": "2025-02-01T14:30:00Z"
  }
]
```

### Handle Response

```
Step 1: Store branches in state
-------------------------------
Store response array in branches state

Step 2: Display list
--------------------
if branches.length = 0
    Show empty state

if branches.length > 0
    Show branch cards
```

### Loading State

```
+-----------------------------------------------+
|                                               |
|  Branches                      [+ Add Branch] |
|                                               |
|  +---------------------------------------+    |
|  |                                       |    |
|  |             [Spinner]                 |    |
|  |         Loading branches...           |    |
|  |                                       |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### Empty State

```
+-----------------------------------------------+
|                                               |
|  Branches (0)                  [+ Add Branch] |
|                                               |
|  +---------------------------------------+    |
|  |                                       |    |
|  |         [Building Icon]               |    |
|  |                                       |    |
|  |       No branches yet                 |    |
|  |                                       |    |
|  |   Create your first branch to start   |    |
|  |   managing multiple locations.        |    |
|  |                                       |    |
|  |       [+ Create First Branch]         |    |
|  |                                       |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### Error State

```
+-----------------------------------------------+
|                                               |
|  Branches                      [+ Add Branch] |
|                                               |
|  +---------------------------------------+    |
|  |                                       |    |
|  |         [Error Icon]                  |    |
|  |                                       |    |
|  |     Failed to load branches           |    |
|  |                                       |    |
|  |          [Retry]                      |    |
|  |                                       |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

---

## Screen 2: Create Branch

### When to Show

Show this screen when:
- User clicks "Add Branch" button
- User has `branch:create` permission

Do NOT show when:
- User lacks `branch:create` permission

### UI Layout (Modal)

```
+-----------------------------------------------+
|  Create New Branch                        [x] |
+-----------------------------------------------+
|                                               |
|  Branch Name *                                |
|  +---------------------------------------+    |
|  | Airport Branch                        |    |
|  +---------------------------------------+    |
|                                               |
|  Address *                                    |
|  +---------------------------------------+    |
|  | Terminal 1, Airport Rd, Tashkent      |    |
|  +---------------------------------------+    |
|                                               |
|  Phone Number                                 |
|  +---------------------------------------+    |
|  | +998 | 90 987 65 43                   |    |
|  +---------------------------------------+    |
|                                               |
|  Email                                        |
|  +---------------------------------------+    |
|  | airport@restaurant.com                |    |
|  +---------------------------------------+    |
|                                               |
|  Additional Info (Optional)                   |
|  +---------------------------------------+    |
|  | Seating Capacity: [50      ]          |    |
|  | Parking Available: [x]                |    |
|  | WiFi Password: [_______________]      |    |
|  +---------------------------------------+    |
|                                               |
|  +----------------+  +--------------------+   |
|  |   [ Cancel ]   |  | [ Create Branch ]  |   |  <- Disabled until valid
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Enter branch name | Validate required, 1-100 chars |
| Enter address | Validate required, 1-200 chars |
| Enter phone | Validate phone format (optional) |
| Enter email | Validate email format (optional) |
| Enter additional info | Store in metadata object |
| Click Cancel | Close modal, discard changes |
| Click Create Branch | Validate all, call API |

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Branch Name | Required | "Branch name is required" |
| Branch Name | 1-100 characters | "Name must be 1-100 characters" |
| Branch Name | Unique per tenant | "Branch name already exists" |
| Address | Required | "Address is required" |
| Address | 1-200 characters | "Address must be 1-200 characters" |
| Phone | Valid format if provided | "Enter a valid phone number" |
| Email | Valid format if provided | "Enter a valid email address" |

### API Call

```
POST /admin/branches
Authorization: Bearer {token}

Request:
{
  "name": "Airport Branch",
  "address": "Terminal 1, Airport Rd, Tashkent",
  "phoneNumber": "+998909876543",
  "email": "airport@restaurant.com",
  "metadata": {
    "seatingCapacity": 50,
    "parkingAvailable": false,
    "wifiPassword": "guest123"
  }
}

Success Response (201):
{
  "id": 3,
  "name": "Airport Branch",
  "address": "Terminal 1, Airport Rd, Tashkent",
  "phoneNumber": "+998909876543",
  "email": "airport@restaurant.com",
  "isActive": true,
  "metadata": {
    "seatingCapacity": 50,
    "parkingAvailable": false,
    "wifiPassword": "guest123"
  },
  "hallCount": 0,
  "tableCount": 0,
  "createdAt": "2025-03-01T12:00:00Z"
}
```

### Handle Response

```
Step 1: Close modal
-------------------
Close create branch modal

Step 2: Update list
-------------------
Add new branch to branches state
OR refetch branches list

Step 3: Show success
--------------------
Show toast: "Branch created successfully"

Step 4: Optional navigation
---------------------------
Ask: "Would you like to configure halls and tables?"
if YES
    GO TO: Table Management for this branch
```

### Error Handling

| Code | Response | What to Show |
|------|----------|--------------|
| 400 | `{"message": "Branch name already exists"}` | Show field error on name |
| 400 | `{"message": "Invalid phone number format"}` | Show field error on phone |
| 403 | `{"message": "Insufficient permissions"}` | Show error: "You don't have permission to create branches" |

### Loading State

```
+-----------------------------------------------+
|  Create New Branch                        [x] |
+-----------------------------------------------+
|                                               |
|  Branch Name *                                |
|  +---------------------------------------+    |
|  | Airport Branch                        |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  Address *                                    |
|  +---------------------------------------+    |
|  | Terminal 1, Airport Rd, Tashkent      |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  +----------------+  +--------------------+   |
|  |   [ Cancel ]   |  | [Spinner] Creating |   |  <- Disabled
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

---

## Screen 3: Branch Details

### When to Show

Show this screen when:
- User clicks "View" on a branch card
- User navigates to /admin/branches/:id

Do NOT show when:
- Branch ID doesn't exist (show 404)
- User lacks permission for this branch

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  <- Back to Branches                          |
|                                               |
|  Downtown Branch                    [Active]  |
|  ================                             |
|                                               |
|  +---------------------------------------+    |
|  | Address:   123 Main St, Tashkent      |    |
|  | Phone:     +998 90 123 45 67          |    |
|  | Email:     downtown@restaurant.com    |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | Additional Info                       |    |
|  | Seating Capacity: 80                  |    |
|  | Parking: Yes                          |    |
|  | WiFi: guest123                        |    |
|  +---------------------------------------+    |
|                                               |
|  Quick Stats                                  |
|  +----------+  +----------+  +----------+    |
|  | 3 Halls  |  | 25 Tables|  | 12 Staff |    |
|  +----------+  +----------+  +----------+    |
|                                               |
|  +----------+  +----------+  +----------+    |
|  |[Halls]   |  |[Stats]   |  |[Settings]|    |
|  +----------+  +----------+  +----------+    |
|                                               |
|  +----------------+  +--------------------+   |
|  |    [ Edit ]    |  |    [ Delete ]      |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Click Back | GO TO: Screen 1 (Branch List) |
| Click Halls | GO TO: Table Management for this branch |
| Click Stats | GO TO: Screen 7 (Branch Statistics) |
| Click Settings | GO TO: Branch Settings |
| Click Edit | GO TO: Screen 4 (Edit Branch) |
| Click Delete | Check can delete, show appropriate modal |

### API Call

```
GET /admin/branches/:id
Authorization: Bearer {token}

Response (200):
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

### Loading State

```
+-----------------------------------------------+
|                                               |
|  <- Back to Branches                          |
|                                               |
|  +---------------------------------------+    |
|  |                                       |    |
|  |             [Spinner]                 |    |
|  |         Loading branch...             |    |
|  |                                       |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### Error State (404)

```
+-----------------------------------------------+
|                                               |
|  <- Back to Branches                          |
|                                               |
|  +---------------------------------------+    |
|  |                                       |    |
|  |         [Not Found Icon]              |    |
|  |                                       |    |
|  |       Branch not found                |    |
|  |                                       |    |
|  |   This branch may have been deleted.  |    |
|  |                                       |    |
|  |       [Go to Branch List]             |    |
|  |                                       |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

---

## Screen 4: Edit Branch

### When to Show

Show this screen when:
- User clicks "Edit" on branch details
- User has `branch:edit` permission

### UI Layout (Modal)

```
+-----------------------------------------------+
|  Edit Branch                              [x] |
+-----------------------------------------------+
|                                               |
|  Branch Name *                                |
|  +---------------------------------------+    |
|  | Downtown Branch                       |    |
|  +---------------------------------------+    |
|                                               |
|  Address *                                    |
|  +---------------------------------------+    |
|  | 123 Main St, Tashkent                 |    |
|  +---------------------------------------+    |
|                                               |
|  Phone Number                                 |
|  +---------------------------------------+    |
|  | +998 | 90 123 45 67                   |    |
|  +---------------------------------------+    |
|                                               |
|  Email                                        |
|  +---------------------------------------+    |
|  | downtown@restaurant.com               |    |
|  +---------------------------------------+    |
|                                               |
|  Status                                       |
|  +---------------------------------------+    |
|  | [x] Active   [ ] Inactive             |    |
|  +---------------------------------------+    |
|                                               |
|  Additional Info                              |
|  +---------------------------------------+    |
|  | Seating Capacity: [80     ]           |    |
|  | Parking Available: [x]                |    |
|  | WiFi Password: [guest123____]         |    |
|  +---------------------------------------+    |
|                                               |
|  +----------------+  +--------------------+   |
|  |   [ Cancel ]   |  |  [ Save Changes ]  |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### API Call

```
PUT /admin/branches/:id
Authorization: Bearer {token}

Request:
{
  "name": "Downtown Branch",
  "address": "123 Main St, Tashkent",
  "phoneNumber": "+998901111111",
  "email": "downtown@restaurant.com",
  "isActive": true,
  "metadata": {
    "seatingCapacity": 100,
    "parkingAvailable": true,
    "wifiPassword": "newpass456"
  }
}

Success Response (200):
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

### Handle Response

```
Step 1: Close modal
-------------------
Close edit modal

Step 2: Update state
--------------------
Update branch in state with response data

Step 3: Show success
--------------------
Show toast: "Branch updated successfully"
```

---

## Screen 5: Confirm Delete Modal

### When to Show

Show this screen when:
- User clicks "Delete" on a branch
- AND can-delete check returns `canDelete: true`

### Check Can Delete First

```
GET /admin/branches/:id/can-delete
Authorization: Bearer {token}

Response (Can Delete):
{
  "canDelete": true,
  "blockingReasons": {
    "halls": null,
    "orders": null,
    "employees": null
  }
}
```

### UI Layout

```
+-----------------------------------------------+
|  Delete Branch?                           [x] |
+-----------------------------------------------+
|                                               |
|  Are you sure you want to delete:             |
|                                               |
|  Downtown Branch                              |
|  123 Main St, Tashkent                        |
|                                               |
|  [!] This action cannot be undone.            |
|                                               |
|  +----------------+  +--------------------+   |
|  |   [ Cancel ]   |  |  [ Delete Branch ] |   |  <- Red button
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### API Call

```
DELETE /admin/branches/:id
Authorization: Bearer {token}

Success Response (200):
{
  "id": 3,
  "message": "Branch deleted successfully"
}
```

### Handle Response

```
Step 1: Close modal
-------------------
Close delete modal

Step 2: Update list
-------------------
Remove branch from state
OR refetch branches list

Step 3: Navigate
----------------
GO TO: Screen 1 (Branch List)

Step 4: Show success
--------------------
Show toast: "Branch deleted successfully"
```

---

## Screen 6: Cannot Delete Modal

### When to Show

Show this screen when:
- User clicks "Delete" on a branch
- AND can-delete check returns `canDelete: false`

### Check Can Delete

```
GET /admin/branches/:id/can-delete
Authorization: Bearer {token}

Response (Cannot Delete):
{
  "canDelete": false,
  "blockingReasons": {
    "halls": "Branch has 3 halls. Delete halls first.",
    "orders": null,
    "employees": "5 employees assigned. Reassign them first."
  }
}
```

### UI Layout

```
+-----------------------------------------------+
|  Cannot Delete Branch                     [x] |
+-----------------------------------------------+
|                                               |
|  This branch cannot be deleted because:       |
|                                               |
|  +---------------------------------------+    |
|  | [x] 3 halls exist         [Go to Halls]|   |
|  +---------------------------------------+    |
|  | [x] 5 employees assigned  [Go to Staff]|   |
|  +---------------------------------------+    |
|                                               |
|  Please resolve these issues first.           |
|                                               |
|  +---------------------------------------+    |
|  |              [ Close ]                |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Click Go to Halls | GO TO: Table Management for this branch |
| Click Go to Staff | GO TO: Staff Management filtered by branch |
| Click Close | Close modal |

### Deletion Rules

```
Branch deletion is blocked when:
--------------------------------
- halls exist --> Must delete all halls first
- employees assigned --> Must reassign employees first
- active orders exist --> Must wait for orders to complete
- active payment session --> Must close session first
```

---

## Screen 7: Branch Statistics

### When to Show

Show this screen when:
- User clicks "Stats" on branch details
- User navigates to /admin/branches/:id/statistics

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  <- Back to Branch                            |
|                                               |
|  Downtown Branch - Statistics                 |
|  ----------------------------                 |
|                                               |
|  Period: [Today] [Week] [Month] [Custom]      |
|                                               |
|  +------------------+  +------------------+   |
|  | Revenue          |  | Orders           |   |
|  | 5,400,000 UZS    |  | 342 orders       |   |
|  | +12% vs last     |  | Avg: 15,789 UZS  |   |
|  +------------------+  +------------------+   |
|                                               |
|  +------------------+  +------------------+   |
|  | Tables           |  | Employees        |   |
|  | 15/25 active     |  | 12 assigned      |   |
|  | 68% occupancy    |  | 8 working now    |   |
|  +------------------+  +------------------+   |
|                                               |
|  Top Products This Period:                    |
|  +---------------------------------------+    |
|  | 1. Margherita Pizza                   |    |
|  |    125 sold - 890,000 UZS             |    |
|  +---------------------------------------+    |
|  | 2. Carbonara Pasta                    |    |
|  |    98 sold - 745,000 UZS              |    |
|  +---------------------------------------+    |
|  | 3. Caesar Salad                       |    |
|  |    87 sold - 520,000 UZS              |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Click Back | GO TO: Screen 3 (Branch Details) |
| Click period button | Reload statistics for selected period |
| Click Custom | Show date range picker |

### API Call

```
GET /admin/branches/:id/statistics?period=week
Authorization: Bearer {token}

Query Parameters:
- period: "today" | "week" | "month"
- startDate: ISO date (for custom)
- endDate: ISO date (for custom)

Response (200):
{
  "period": "week",
  "revenue": {
    "total": 5400000,
    "change": 12,
    "previousTotal": 4821428
  },
  "orders": {
    "count": 342,
    "averageValue": 15789
  },
  "tables": {
    "total": 25,
    "active": 15,
    "occupancyRate": 68
  },
  "employees": {
    "assigned": 12,
    "workingNow": 8
  },
  "topProducts": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "quantitySold": 125,
      "revenue": 890000
    },
    {
      "id": 2,
      "name": "Carbonara Pasta",
      "quantitySold": 98,
      "revenue": 745000
    }
  ]
}
```

---

## Screen 8: Bulk Import (Optional)

### When to Show

Show this screen when:
- User clicks "Import Branches" from branch list
- User has `branch:create` permission

### UI Layout

```
+-----------------------------------------------+
|  Import Branches                          [x] |
+-----------------------------------------------+
|                                               |
|  Upload a CSV file to import multiple         |
|  branches at once.                            |
|                                               |
|  [Download Template CSV]                      |
|                                               |
|  +---------------------------------------+    |
|  |                                       |    |
|  |     [Upload Icon]                     |    |
|  |                                       |    |
|  |     Drag and drop CSV file here       |    |
|  |     or click to browse                |    |
|  |                                       |    |
|  +---------------------------------------+    |
|                                               |
|  +----------------+  +--------------------+   |
|  |   [ Cancel ]   |  |    [ Import ]      |   |  <- Disabled until file
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### Import Results

```
+-----------------------------------------------+
|  Import Results                           [x] |
+-----------------------------------------------+
|                                               |
|  [v] 18 branches created successfully         |
|  [x] 2 branches failed                        |
|                                               |
|  Failed:                                      |
|  +---------------------------------------+    |
|  | Row 5: "Branch B" - Duplicate name    |    |
|  | Row 12: "Airport" - Missing address   |    |
|  +---------------------------------------+    |
|                                               |
|  +------------------+  +-----------------+    |
|  |[Download Failed] |  |    [ Close ]    |    |
|  +------------------+  +-----------------+    |
|                                               |
+-----------------------------------------------+
```

### API Call

```
POST /admin/branches/bulk
Authorization: Bearer {token}

Request:
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
    }
  ]
}

Response (200):
{
  "success": 18,
  "failed": 2,
  "results": [
    {
      "index": 0,
      "branchId": 10,
      "name": "Branch A",
      "status": "created"
    },
    {
      "index": 1,
      "error": "Duplicate name 'Branch B'",
      "name": "Branch B",
      "status": "failed"
    }
  ]
}
```

### Limits

| Rule | Value |
|------|-------|
| Min branches per request | 1 |
| Max branches per request | 50 |
| Partial success allowed | Yes |

---

## Complete Flow Chart

```
                    +------------------+
                    | Branch List      |
                    | Screen 1         |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
         v                   v                   v
    Add Branch          View Branch         Search
         |                   |                   |
         v                   v                   v
    +----+----+         +----+----+         Filter
    | Screen 2|         | Screen 3|         results
    | Create  |         | Details |
    +----+----+         +----+----+
         |                   |
         v              +----+----+----+----+
    Branch           Edit  Delete  Stats  Halls
    Created            |      |      |      |
         |             v      v      v      v
         |        +----+  +--+-+  +--+-+  Table
         |        |Scr 4| |Can | |Scr 7|  Mgmt
         |        |Edit | |Del?| |Stats|
         |        +----++ +--+-+ +-----+
         |             |     |
         |             v     +--------+
         |        Save       |        |
         |        Changes   YES       NO
         |             |     |        |
         |             v     v        v
         |        Updated  +--+-+  +--+-+
         |        Branch   |Scr 5| |Scr 6|
         |             |   |Conf | |Can't|
         +-------------+   |Del  | |Del  |
                       |   +--+--+ +-----+
                       |      |
                       v      v
                    Branch  Deleted
                    List    Branch
```

---

## API Reference

| Endpoint | Method | When | Auth |
|----------|--------|------|------|
| `/admin/branches` | GET | Load branch list | Yes |
| `/admin/branches/:id` | GET | View branch details | Yes |
| `/admin/branches` | POST | Create new branch | Yes |
| `/admin/branches/:id` | PUT | Update branch | Yes |
| `/admin/branches/:id` | DELETE | Delete branch | Yes |
| `/admin/branches/:id/can-delete` | GET | Check before delete | Yes |
| `/admin/branches/:id/statistics` | GET | View statistics | Yes |
| `/admin/branches/bulk` | POST | Import multiple | Yes |

---

## Storage Reference

| Key | Type | Where | Set When | Clear When |
|-----|------|-------|----------|------------|
| `branches` | array | Memory | GET /branches | Logout, refetch |
| `currentBranch` | object | Memory | GET /branches/:id | Navigate away |
| `branchStats` | object | Memory | GET /statistics | Period change |

---

## FAQ

**Q: Can I delete a branch with active orders?**
A: No. Wait for orders to complete or cancel them first.

**Q: What happens to staff when branch is deleted?**
A: Staff must be reassigned to other branches before deletion is allowed.

**Q: Can I have duplicate branch names?**
A: No. Branch names must be unique within a tenant.

**Q: What is the metadata field for?**
A: Store custom information like seating capacity, parking, wifi password, etc.

**Q: Can I deactivate a branch instead of deleting?**
A: Yes. Edit the branch and set `isActive: false`. Inactive branches don't appear in POS.

**Q: How do I restore a deleted branch?**
A: Deleted branches cannot be restored. Create a new branch with the same details.

**Q: Can staff work at multiple branches?**
A: Yes. Staff can be assigned to multiple branches with different permissions per branch.

**Q: What statistics are tracked per branch?**
A: Revenue, order count, table occupancy, employee activity, and top products.
