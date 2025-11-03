# Admin Branch & Table Management - Frontend Guide

**Last Updated**: 2025-11-03
**API Version**: v1
**Status**: Active Development

---

## Overview

This guide covers the branch, hall, and table management workflows for the Admin Panel. The system allows restaurant owners to manage multiple branches, configure dining halls within branches, and manage table layouts.

### Key Concepts

- **Branch**: A physical restaurant location with its own address, hours, and staff
- **Hall**: A dining area within a branch (e.g., "Main Dining Room", "Terrace", "VIP Room")
- **Table**: A seating location within a hall with position, capacity, and QR code
- **Session**: An active dining session at a table (opened when customers scan QR or waiter assigns)

---

## Phase 6, Task 6.1: Safe Deletion Workflow ✅

### Business Problem

Previously, users could attempt to delete branches/halls/tables without knowing what would block the deletion. This resulted in cryptic errors and frustration. Users had no way to:
- Check if deletion is safe before attempting
- See what's blocking deletion
- Close active sessions to enable table deletion

### Solution: Pre-Deletion Validation

The API now provides validation endpoints that **must be called before showing delete buttons** or **before confirming deletion**.

---

## Branch Management

### 1. Check if Branch Can Be Deleted

**Endpoint**: `GET /admin/branches/:id/can-delete`

**When to Call**:
- Before showing the "Delete" button (disable if cannot delete)
- When user clicks "Delete" - show blocking reasons in confirmation dialog
- After resolving blockers to re-check status

**Response Schema**:
```json
{
  "canDelete": boolean,
  "blockingReasons": {
    "halls": string | null,
    "orders": string | null,
    "employees": string | null
  }
}
```

**Business Logic**:
- Checks three conditions: halls, active orders, assigned employees
- Returns descriptive messages for each blocker
- All blockers must be resolved before deletion

**User Flow**:
1. User navigates to branch list or branch details
2. Frontend calls `/can-delete` endpoint
3. If `canDelete: true` → Show enabled "Delete" button
4. If `canDelete: false` → Show disabled button with tooltip explaining why
5. When user clicks delete:
   - Show confirmation dialog
   - Display all blocking reasons from `blockingReasons` object
   - Guide user: "Please delete halls first" or "Close active orders first"

**UI/UX Recommendations**:
- **Status Badge**: Show "Can Delete" (green) or "Cannot Delete" (red) badge
- **Tooltip on Disabled Button**: "Cannot delete: 3 halls, 2 active orders"
- **Detailed Modal**: When clicked, show list of blockers with links to resolve them
- **Action Links**: "View Halls" → Navigate to halls page to delete them first

**Error Scenarios**:
- `404 Not Found` → Branch doesn't exist
- `403 Forbidden` → Branch belongs to different tenant
- `500 Internal Server Error` → Contact support

---

### 2. Delete Branch

**Endpoint**: `DELETE /admin/branches/:id`

**When to Call**:
- Only after `/can-delete` returns `canDelete: true`
- After user confirms deletion in modal

**Response**:
- `200 OK` → Deletion successful
- `400 Bad Request` → Cannot delete (blocker exists) - shows reference to `/can-delete`
- `404 Not Found` → Branch doesn't exist

**User Flow**:
1. User resolves all blockers (deletes halls, closes orders, unassigns employees)
2. Frontend re-checks `/can-delete` → `canDelete: true`
3. User clicks "Delete Branch"
4. Show final confirmation: "Are you sure? This cannot be undone."
5. Call `DELETE /admin/branches/:id`
6. On success → Redirect to branch list with success toast

**Error Handling**:
- If deletion fails with 400, show error message with link to `/can-delete` endpoint
- Suggest re-checking status: "Something changed. Please refresh and try again."

---

---

## Phase 6, Task 6.2: Get Single Resource Details ✅

### Business Problem

Previously, to view details of a single hall or table, you had to:
- Load the entire list of halls/tables
- Find the specific item in the list
- No way to deep-link directly to edit pages
- Cannot refresh single item data without reloading entire list

### Solution: Single Resource Endpoints

New GET endpoints allow fetching individual hall or table details with complete related data.

---

### 8. Get Single Hall by ID

**Endpoint**: `GET /admin/halls/:id`

**When to Call**:
- When navigating to hall edit page
- When deep-linking to hall details (e.g., from notification or email)
- When refreshing hall data after an update
- When showing hall details in a modal

**Response Schema**:
```json
{
  "id": number,
  "name": string,
  "description": string | null,
  "capacity": number,
  "floor": number,
  "isActive": boolean,
  "layout": object | null,
  "branch": {
    "id": number,
    "name": string,
    "address": string
  },
  "tableCount": number,
  "activeTableCount": number,
  "createdAt": string (ISO 8601),
  "updatedAt": string (ISO 8601)
}
```

**Business Logic**:
- Returns complete hall information
- Includes parent branch details (nested)
- Includes table statistics (total and active)
- Only returns halls belonging to current tenant

**User Flow**:
1. User clicks "Edit Hall" from hall list
2. Navigate to `/halls/:id/edit` route
3. Frontend calls `GET /admin/halls/:id`
4. Populate edit form with hall data
5. Show related info: "Part of [Branch Name]" and "[tableCount] tables"

**UI/UX Recommendations**:
- **Breadcrumb Navigation**: "Branches > [Branch Name] > Halls > [Hall Name]"
- **Quick Stats**: Show "12 tables (8 active)" prominently
- **Branch Link**: Make branch name clickable to navigate to branch details
- **Table List**: Show "View Tables" button linking to tables filtered by this hall
- **Loading State**: Show skeleton while fetching

**Error Scenarios**:
- `404 Not Found` → Hall doesn't exist, redirect to hall list
- `403 Forbidden` → Hall belongs to different tenant, show error
- `500 Internal Server Error` → Show error toast, allow retry

---

### 9. Get Single Table by ID

**Endpoint**: `GET /admin/tables/:id`

**When to Call**:
- When navigating to table edit page
- When clicking on table in floor plan
- When deep-linking to table details
- When showing table QR code modal
- When checking table status after session update

**Response Schema**:
```json
{
  "id": number,
  "number": string,
  "capacity": number,
  "status": "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING",
  "shape": "ROUND" | "SQUARE" | "RECTANGLE",
  "position": {
    "x": number,
    "y": number,
    "rotation": number
  } | null,
  "isActive": boolean,
  "notes": string | null,
  "minimumOrder": number | null,
  "hall": {
    "id": number,
    "name": string,
    "floor": number,
    "branch": {
      "id": number,
      "name": string
    }
  },
  "currentSession": {
    "id": number,
    "startedAt": string (ISO 8601),
    "orderCount": number
  } | null,
  "createdAt": string (ISO 8601),
  "updatedAt": string (ISO 8601)
}
```

**Business Logic**:
- Returns complete table information
- Includes hall and branch details (nested)
- Includes current session if table is occupied
- Only returns tables belonging to current tenant
- Position data for floor plan rendering

**User Flow - Edit Table**:
1. User clicks table on floor plan or in table list
2. Navigate to `/tables/:id/edit` or open modal
3. Frontend calls `GET /admin/tables/:id`
4. Populate form with table data
5. Show breadcrumb: "[Branch] > [Hall] > Table [Number]"
6. If `currentSession` exists, show session warning

**User Flow - View QR Code**:
1. User clicks "View QR Code" button for table
2. Frontend calls `GET /admin/tables/:id`
3. Display QR code using `table.id` (or dedicated QR field)
4. Show context: "Table [Number] - [Hall Name] - [Branch Name]"
5. Option to download or print QR code

**User Flow - Floor Plan Click**:
1. User clicks table on interactive floor plan
2. Frontend calls `GET /admin/tables/:id`
3. Show table details popover:
   - Table number and capacity
   - Current status with color indicator
   - Session info if occupied: "Active since [time] - [orderCount] orders"
   - Quick actions: "Edit", "View QR", "Change Status"

**UI/UX Recommendations**:
- **Status Badge**: Large colored badge showing current status
  - Green = AVAILABLE
  - Red = OCCUPIED (show session time)
  - Yellow = RESERVED
  - Blue = CLEANING
- **Session Warning**: If occupied, show banner: "Table has active session since [time]"
- **Floor Plan Integration**: Use `position` data to render table on layout
- **Breadcrumb Context**: Always show: Branch → Hall → Table hierarchy
- **Quick Actions**: "View Session", "Download QR", "Edit Position", "Change Status"

**Error Scenarios**:
- `404 Not Found` → Table doesn't exist, redirect to table list
- `403 Forbidden` → Table belongs to different tenant
- `500 Internal Server Error` → Show error, allow retry

---

## Hall Management

### 3. Check if Hall Can Be Deleted

**Endpoint**: `GET /admin/halls/:id/can-delete`

**When to Call**:
- Before showing delete button for hall
- In confirmation dialog before deletion

**Response Schema**:
```json
{
  "canDelete": boolean,
  "reason": string | null,
  "tableCount": number | null
}
```

**Business Logic**:
- Only checks if hall has tables
- Simpler than branch validation (single blocker)
- Returns count of tables that need to be deleted first

**User Flow**:
1. User views hall list or hall details
2. Frontend calls `/can-delete` for each hall
3. If `canDelete: true` → Enable delete button
4. If `canDelete: false`:
   - Disable delete button
   - Show tooltip: "Cannot delete: 5 tables in this hall"
   - Provide "View Tables" link

**UI/UX Recommendations**:
- **Table Count Badge**: Show "5 tables" next to hall name
- **Quick Action**: "Delete All Tables" button → Bulk delete tables, then delete hall
- **Visual Feedback**: If hall is empty (0 tables), highlight delete button in green

---

### 4. Delete Hall

**Endpoint**: `DELETE /admin/halls/:id`

**When to Call**:
- After `/can-delete` confirms `canDelete: true`
- After user confirmation

**User Flow**:
1. User deletes all tables in hall OR creates hall with no tables
2. Frontend checks `/can-delete` → `canDelete: true`
3. User clicks "Delete Hall"
4. Confirm: "Delete [Hall Name]?"
5. Call `DELETE /admin/halls/:id`
6. Success → Remove hall from list, show toast

---

## Table Management

### 5. Check Table Session Status

**Endpoint**: `GET /admin/tables/:id/session-status`

**When to Call**:
- Before showing delete button on table
- When user attempts to delete table
- In table status dashboard (show active sessions)

**Response Schema**:
```json
{
  "hasActiveSession": boolean,
  "session": {
    "id": number,
    "startedAt": string (ISO 8601),
    "orderCount": number
  } | null
}
```

**Business Logic**:
- Checks if table has an active dining session
- Session is "active" if customers are seated or orders are open
- Returns session details including how many orders exist

**User Flow**:
1. User views table layout or table list
2. Frontend calls `/session-status` for tables with "OCCUPIED" status
3. If `hasActiveSession: true`:
   - Show session badge: "Active since 2:30 PM (2 orders)"
   - Disable delete button
   - Show "Close Session" button
4. If `hasActiveSession: false`:
   - Enable delete button (if table is AVAILABLE)

**UI/UX Recommendations**:
- **Visual Indicator**: Tables with active sessions highlighted in red on floor plan
- **Session Duration**: Show "Active for 45 minutes"
- **Order Count**: Show "2 orders • $125.50 total"
- **Action Required**: "Close session before deleting table"

---

### 6. Close Table Session

**Endpoint**: `POST /admin/tables/:id/close-session`

**When to Call**:
- When admin needs to close active session to delete table
- When customers have finished and paid (normally done via POS, but admin override)
- Emergency situation: table reassignment

**Response**:
- `200 OK` → Session closed successfully, table status set to CLEANING
- `404 Not Found` → Table or session doesn't exist
- `400 Bad Request` → No active session to close

**Business Logic**:
- Closes the active session (sets endedAt timestamp)
- Updates table status to "CLEANING" (not AVAILABLE)
- Clears table's reference to session
- **Does not** finalize payments (should be done separately)

**User Flow**:
1. User sees table with active session
2. Clicks "Close Session" button
3. Warning modal: "Are you sure? This will end the dining session. Ensure all payments are complete."
4. User confirms
5. Call `POST /admin/tables/:id/close-session`
6. Success:
   - Session ends
   - Table status → CLEANING
   - Show toast: "Session closed. Table is now in cleaning status."
7. Admin or waiter can now:
   - Change status to AVAILABLE when cleaned
   - Delete table if needed

**UI/UX Recommendations**:
- **Warning**: Big red warning that payments should be finalized first
- **Payment Check**: Show "Check POS for pending payments" link
- **Status Transition**: Visual feedback showing OCCUPIED → CLEANING
- **Next Actions**: Show button "Mark as Available" after closing session

---

### 7. Delete Table

**Endpoint**: `DELETE /admin/tables/:id`

**When to Call**:
- After confirming no active session via `/session-status`
- After closing session if needed via `/close-session`
- After user confirms deletion

**User Flow**:
1. Check session status → No active session
2. User clicks "Delete Table"
3. Confirm: "Delete Table 5? This will also delete the QR code."
4. Call `DELETE /admin/tables/:id`
5. Success → Remove from floor plan, update table count

**Error Handling**:
- If 400 error received, check error message for guidance
- Message will reference `/session-status` and `/close-session` endpoints
- Show clear steps to resolve

---

## Complete Deletion Workflow Examples

### Example 1: Delete Empty Hall

**Scenario**: Admin wants to delete "Terrace" hall (has no tables)

**Steps**:
1. Navigate to hall list
2. Frontend calls `GET /admin/halls/:id/can-delete`
   - Response: `{ "canDelete": true, "reason": null, "tableCount": 0 }`
3. "Delete" button is enabled (green)
4. User clicks delete
5. Confirmation: "Delete Terrace hall?"
6. User confirms
7. Call `DELETE /admin/halls/:id`
8. Success toast: "Terrace hall deleted"

---

### Example 2: Delete Hall with Tables

**Scenario**: Admin wants to delete "VIP Room" hall (has 3 tables)

**Steps**:
1. Navigate to hall details
2. Frontend calls `GET /admin/halls/:id/can-delete`
   - Response: `{ "canDelete": false, "reason": "Cannot delete hall with tables", "tableCount": 3 }`
3. "Delete" button is disabled (gray)
4. Tooltip shows: "Cannot delete: 3 tables in this hall"
5. User clicks "View Tables" or "Delete All Tables"
6. For each table:
   - Check session status
   - Close sessions if needed
   - Delete table
7. After all tables deleted, re-check `/can-delete`
   - Response: `{ "canDelete": true, ... }`
8. "Delete" button now enabled
9. User deletes hall successfully

---

### Example 3: Delete Table with Active Session

**Scenario**: Admin needs to remove Table 8 (has active dining session)

**Steps**:
1. View table in floor plan (status: OCCUPIED)
2. User clicks table, sees "Active Session" badge
3. Frontend calls `GET /admin/tables/8/session-status`
   - Response: `{ "hasActiveSession": true, "session": { "id": 123, "startedAt": "2025-11-03T14:30:00Z", "orderCount": 2 } }`
4. UI shows:
   - "Active since 2:30 PM"
   - "2 orders in progress"
   - Delete button disabled
   - "Close Session" button enabled
5. User clicks "Close Session"
6. Warning: "Ensure all payments are complete. This will end the dining session."
7. User confirms
8. Call `POST /admin/tables/8/close-session`
9. Success:
   - Table status → CLEANING
   - Session ended
10. User (or waiter) marks table as AVAILABLE when cleaned
11. Now user can delete table if still needed
12. Call `DELETE /admin/tables/8`
13. Table removed from floor plan

---

### Example 4: Delete Branch with Dependencies

**Scenario**: Admin wants to delete "Downtown Branch" (has halls, orders, employees)

**Steps**:
1. Navigate to branch details
2. Frontend calls `GET /admin/branches/:id/can-delete`
   - Response:
   ```json
   {
     "canDelete": false,
     "blockingReasons": {
       "halls": "Cannot delete branch with 2 halls",
       "orders": "Cannot delete branch with 5 active orders",
       "employees": "Cannot delete branch with 8 assigned employees"
     }
   }
   ```
3. "Delete" button is disabled
4. UI shows all blocking reasons in expandable list:
   - ❌ 2 halls → "View Halls" link
   - ❌ 5 active orders → "View Orders" link
   - ❌ 8 employees → "View Staff" link
5. Admin must resolve all blockers:
   - Complete/cancel all active orders
   - Unassign or delete employees
   - Delete all halls (which requires deleting tables first)
6. After resolving blockers, re-check `/can-delete`
   - Response: `{ "canDelete": true, "blockingReasons": {} }`
7. "Delete" button now enabled
8. User clicks delete
9. Final warning: "This will permanently delete Downtown Branch. This cannot be undone."
10. User confirms
11. Call `DELETE /admin/branches/:id`
12. Redirect to branch list with success message

---

## Phase 6, Task 6.3: HTTP Method Standardization ✅

### Business Problem

Inconsistent use of HTTP methods for table updates:
- `PUT /tables/:id` for general updates (full replacement semantics)
- `PATCH /tables/:id/layout` for position updates (partial update semantics)

This violates REST conventions and confuses API consumers.

### Solution: Standardize to PATCH for Partial Updates

Both endpoints now use **PATCH** for partial updates, following REST best practices.

---

### 10. Update Table Information

**Endpoint**: `PATCH /admin/tables/:id` (Changed from PUT)

**When to Call**:
- When updating table properties (name, capacity, status, notes, etc.)
- When changing table configuration
- When toggling table active/inactive

**HTTP Method Change**:
- **Before**: `PUT /tables/:id` (implied full replacement)
- **After**: `PATCH /tables/:id` (explicit partial update)
- **Benefit**: Semantically correct - only provided fields are updated

**Request Body** (all fields optional):
```json
{
  "number": string,
  "capacity": number,
  "status": "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING",
  "shape": "ROUND" | "SQUARE" | "RECTANGLE",
  "isActive": boolean,
  "notes": string,
  "minimumOrder": number
}
```

**Business Logic**:
- Partial updates supported - send only fields you want to change
- Other fields remain unchanged
- Tenant isolation enforced
- Validation applied to provided fields

**User Flow**:
1. User edits table in form (e.g., changes capacity from 4 to 6)
2. Frontend sends only changed field: `{ "capacity": 6 }`
3. Call `PATCH /admin/tables/:id` with partial data
4. Backend updates only capacity, other fields unchanged
5. Returns updated table data

**UI/UX Recommendations**:
- **Dirty Field Tracking**: Only send changed fields in PATCH request
- **Optimistic Updates**: Update UI immediately, rollback on error
- **Validation Feedback**: Show field-level errors if validation fails
- **Confirmation**: For status changes, show "Change status to CLEANING?" modal

---

### 11. Update Table Layout Position

**Endpoint**: `PATCH /admin/tables/:id/layout` (Already PATCH, unchanged)

**When to Call**:
- When dragging table on floor plan
- When rotating table
- When repositioning table via UI

**Purpose**:
- Specialized endpoint for **position-only updates** (x, y, rotation)
- Optimized for drag-and-drop operations
- Prevents accidental changes to other fields during layout editing

**Request Body**:
```json
{
  "position": {
    "x": number,
    "y": number,
    "rotation": number
  }
}
```

**Business Logic**:
- Updates only position data
- Leaves all other table properties unchanged (capacity, status, etc.)
- Ideal for floor plan editors with frequent position updates

**User Flow - Drag and Drop**:
1. User drags Table 5 from position (100, 100) to (150, 200)
2. On drag end, frontend calls `PATCH /admin/tables/:id/layout`
3. Send only: `{ "position": { "x": 150, "y": 200, "rotation": 0 } }`
4. Backend updates position only
5. Table capacity, status, and other fields unchanged

**UI/UX Recommendations**:
- **Batch Updates**: For multiple table moves, consider batching (future enhancement)
- **Auto-Save**: Save position changes automatically on drag end
- **Undo/Redo**: Implement undo for layout changes
- **Grid Snapping**: Snap to grid on frontend, send snapped coordinates
- **Collision Detection**: Check for table overlaps before saving

---

### When to Use Which Endpoint?

| Scenario | Endpoint | Fields Updated |
|----------|----------|----------------|
| Change table capacity | `PATCH /tables/:id` | `{ "capacity": 6 }` |
| Change table status | `PATCH /tables/:id` | `{ "status": "CLEANING" }` |
| Drag table on floor plan | `PATCH /tables/:id/layout` | `{ "position": {...} }` |
| Rotate table in layout | `PATCH /tables/:id/layout` | `{ "position": { ...rotation } }` |
| Edit multiple table properties | `PATCH /tables/:id` | `{ "capacity": 6, "notes": "..." }` |
| Position + other changes | `PATCH /tables/:id` | `{ "capacity": 6, "position": {...} }` |

**Recommendation**:
- Use `/layout` for **position-only updates** (floor plan editor)
- Use general `/tables/:id` for **all other updates** (forms, status changes, etc.)

---

## Phase 6, Task 6.4: Branch Statistics and Bulk Creation ✅

### Business Problem

**Statistics**: No way to see branch performance metrics (revenue, orders, capacity utilization).

**Bulk Creation**: Restaurant chains must create branches one-by-one, making onboarding slow for multi-location businesses.

### Solution: Performance Metrics and Bulk Operations

New endpoints provide branch analytics and batch operations for faster onboarding.

---

### 12. Get Branch Statistics

**Endpoint**: `GET /admin/branches/:id/statistics?period=week`

**When to Call**:
- Branch dashboard/overview page
- Performance reports
- Manager analytics view
- Periodic refresh (every 5 minutes)

**Query Parameters**:
- `period` (optional): `today` | `week` | `month` (default: `week`)

**Response Schema**:
```json
{
  "ordersCount": number,        // Total orders in period
  "revenue": number,            // Total revenue in UZS
  "capacity": number,           // Total seating capacity
  "employeeCount": number,      // Assigned employees
  "tableCount": number,         // Total tables
  "activeTableCount": number,   // Currently occupied tables
  "period": string              // Period used for calculation
}
```

**Business Logic**:
- **Orders & Revenue**: Counted from completed orders in date range
- **Capacity**: Sum of all table capacities across all halls
- **Employees**: Count of assigned employees (active only)
- **Tables**: Total and currently occupied (real-time)
- **Period Calculation**:
  - `today`: From 00:00:00 today to now
  - `week`: Last 7 days
  - `month`: Last 30 days

**User Flow - Branch Dashboard**:
1. User navigates to branch details page
2. Frontend calls `GET /admin/branches/:id/statistics?period=week`
3. Display KPI cards:
   - "150 Orders" (this week)
   - "7.5M UZS Revenue"
   - "120 Seat Capacity"
   - "25 Employees"
   - "30 Tables (15 occupied)"
4. Add period selector: [Today] [This Week] [This Month]
5. When period changes, refetch with new period parameter

**User Flow - Performance Report**:
1. Manager opens performance dashboard
2. Fetch statistics for all branches in parallel
3. Display comparison table:
   | Branch | Orders | Revenue | Occupancy |
   |--------|--------|---------|-----------|
   | Downtown | 150 | 7.5M | 50% (15/30) |
   | Airport | 120 | 6.2M | 60% (18/30) |
4. Sort by revenue to identify top performers
5. Identify underperforming branches (low occupancy)

**UI/UX Recommendations**:
- **KPI Cards**: Large numbers with trend indicators (↑ 15% vs last week)
- **Charts**: Revenue line chart, orders bar chart
- **Occupancy Gauge**: Visual indicator of table utilization (50% = half full)
- **Employee Efficiency**: Revenue per employee calculation
- **Period Comparison**: Show change from previous period
- **Real-Time Tables**: Update active table count via WebSocket or polling

**Error Scenarios**:
- `404 Not Found` → Branch doesn't exist
- `403 Forbidden` → Branch belongs to different tenant
- `400 Bad Request` → Invalid period parameter

---

### 13. Bulk Create Branches

**Endpoint**: `POST /admin/branches/bulk`

**When to Call**:
- Onboarding restaurant chains with multiple locations
- Importing branches from CSV
- Migrating from another system
- Quick setup for franchises

**Request Body**:
```json
{
  "branches": [
    {
      "name": "Downtown Branch",
      "address": "123 Main St, City",
      "phoneNumber": "+998901234567",
      "email": "downtown@restaurant.com"
    },
    {
      "name": "Airport Branch",
      "address": "Terminal 1, Airport Rd",
      "phoneNumber": "+998907654321",
      "email": "airport@restaurant.com"
    }
  ]
}
```

**Validation**:
- Minimum 1 branch, maximum 50 per request
- Each branch follows same validation as single creation
- Duplicate names within batch detected and rejected
- Duplicate names in existing branches detected

**Response Schema**:
```json
{
  "success": number,            // Count of successfully created
  "failed": number,             // Count of failed creations
  "results": [
    {
      "index": number,          // Position in input array (0-based)
      "branchId": number,       // Created branch ID (if success)
      "name": string,           // Branch name for reference
      "error": string           // Error message (if failed)
    }
  ]
}
```

**Business Logic - Partial Success**:
- Validates all branches first
- Creates only valid branches
- Invalid branches return errors with array index
- Returns mixed results (some success, some fail)
- Transaction ensures atomic creation of valid branches

**User Flow - CSV Import**:
1. User uploads CSV with 20 branches
2. Frontend parses CSV into array of CreateBranchDto
3. Call `POST /admin/branches/bulk` with all branches
4. Response: `{ success: 18, failed: 2, results: [...] }`
5. Display success toast: "18 branches created, 2 failed"
6. Show error table:
   | Row | Name | Error |
   |-----|------|-------|
   | 5 | Main Branch | Duplicate name |
   | 12 | Airport | Missing address |
7. User fixes errors and retries failed branches

**User Flow - Manual Bulk Entry**:
1. User clicks "Add Multiple Branches"
2. Form shows repeatable branch input (5 rows by default)
3. User fills in 3 branches, leaves 2 empty
4. Frontend sends only 3 filled branches
5. Call `POST /admin/branches/bulk`
6. All 3 succeed → Redirect to branch list
7. Show success: "3 branches created successfully"

**User Flow - Migration from Another System**:
1. Developer exports branches from old system as JSON
2. Transforms to CreateBranchDto format
3. Splits into batches of 50 (API limit)
4. Sends batch 1 → 45 success, 5 failed
5. Logs errors for manual review
6. Sends batch 2 → 50 success, 0 failed
7. Final report: "95 branches migrated, 5 require manual creation"

**UI/UX Recommendations**:
- **Progress Indicator**: Show "Creating branches... 15/20 complete"
- **Results Summary**: "18 ✓ created, 2 ✗ failed"
- **Error Mapping**: Use `index` field to highlight failed rows in UI
- **Retry Failed**: Button to retry only failed branches
- **Batch Size**: Split large imports into multiple requests (50 max)
- **Validation Preview**: Show validation errors before submission
- **Success List**: Display created branch IDs for verification

**Error Handling**:
```json
// Example partial failure response
{
  "success": 2,
  "failed": 2,
  "results": [
    { "index": 0, "branchId": 5, "name": "Downtown Branch" },
    { "index": 1, "error": "Branch with name 'Main' already exists", "name": "Main" },
    { "index": 2, "error": "Address is required", "name": "Airport" },
    { "index": 3, "branchId": 6, "name": "Mall Branch" }
  ]
}
```

**Frontend Error Display**:
```
✓ Row 1: Downtown Branch created (ID: 5)
✗ Row 2: Main - Already exists
✗ Row 3: Airport - Missing address
✓ Row 4: Mall Branch created (ID: 6)

[Retry Failed Branches]
```

**Performance Considerations**:
- Limit to 50 branches per request
- For 100+ branches, split into multiple batches
- Show batch progress: "Batch 1/3 complete"
- Transaction ensures data consistency
- Validation happens before creation (fail fast)

---

## API Endpoint Summary

### Branch Endpoints
| Method | Endpoint | Purpose | Phase |
|--------|----------|---------|-------|
| GET | `/admin/branches/:id/can-delete` | Check if branch can be deleted | 6.1 ✅ |
| GET | `/admin/branches/:id/statistics?period=week` | Get branch performance metrics | 6.4 ✅ |
| POST | `/admin/branches/bulk` | Bulk create branches (1-50) | 6.4 ✅ |
| DELETE | `/admin/branches/:id` | Delete branch (after validation) | Existing |

### Hall Endpoints
| Method | Endpoint | Purpose | Phase |
|--------|----------|---------|-------|
| GET | `/admin/halls/:id` | Get single hall with details | 6.2 ✅ |
| GET | `/admin/halls/:id/can-delete` | Check if hall can be deleted | 6.1 ✅ |
| DELETE | `/admin/halls/:id` | Delete hall (after validation) | Existing |

### Table Endpoints
| Method | Endpoint | Purpose | Phase |
|--------|----------|---------|-------|
| GET | `/admin/tables/:id` | Get single table with details | 6.2 ✅ |
| PATCH | `/admin/tables/:id` | Update table (partial update) | 6.3 ✅ (Changed from PUT) |
| PATCH | `/admin/tables/:id/layout` | Update table position (drag-drop) | 6.3 ✅ (Already PATCH) |
| GET | `/admin/tables/:id/session-status` | Check for active session | 6.1 ✅ |
| POST | `/admin/tables/:id/close-session` | Close active session | 6.1 ✅ |
| DELETE | `/admin/tables/:id` | Delete table (after validation) | Existing |

---

## Response Schemas

### Branch Deletion Status
```json
{
  "canDelete": boolean,
  "blockingReasons": {
    "halls": string | null,      // e.g., "Cannot delete branch with 2 halls"
    "orders": string | null,      // e.g., "Cannot delete branch with 5 active orders"
    "employees": string | null    // e.g., "Cannot delete branch with 8 assigned employees"
  }
}
```

### Hall Deletion Status
```json
{
  "canDelete": boolean,
  "reason": string | null,        // e.g., "Cannot delete hall with tables"
  "tableCount": number | null     // e.g., 3
}
```

### Table Session Status
```json
{
  "hasActiveSession": boolean,
  "session": {
    "id": number,                 // Session ID
    "startedAt": string,          // ISO 8601 timestamp
    "orderCount": number          // Number of orders in session
  } | null
}
```

---

## Error Handling Guide

### Common HTTP Status Codes

- **200 OK**: Request successful
- **400 Bad Request**: Cannot delete due to blockers (check error message for details)
- **403 Forbidden**: Resource belongs to different tenant
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server error (contact support)

### Error Message Patterns

When deletion fails with 400, the error message will reference validation endpoints:
- "Cannot delete branch. Check /admin/branches/:id/can-delete for details"
- "Cannot delete hall. Check /admin/halls/:id/can-delete for details"
- "Cannot delete table with active session. Check /admin/tables/:id/session-status"

**Frontend Action**: Parse error message and guide user to appropriate validation endpoint.

---

## UI/UX Best Practices

### 1. Proactive Validation
- **Always** check `/can-delete` before showing delete buttons
- Don't wait for delete to fail - check first

### 2. Clear Visual Feedback
- Green "Delete" button → Safe to delete
- Gray disabled button → Cannot delete (show why in tooltip)
- Red warning → Active session or critical blocker

### 3. Helpful Error Messages
- Don't just show "Cannot delete"
- Show what's blocking: "Cannot delete: 3 halls, 5 active orders"
- Provide action links: "View Halls" → Navigate to fix the issue

### 4. Guided Resolution
- Show checklist of blockers with status (✓ resolved, ❌ pending)
- Update checklist in real-time as user resolves blockers
- Auto-enable delete button when all resolved

### 5. Confirmation Modals
- Always confirm destructive actions
- Show what will be deleted (name, details)
- For sessions: Warn about payment finalization
- Use red "Delete" button in modal

### 6. Success Feedback
- Toast notification: "Branch deleted successfully"
- Redirect to list view
- Update counts (e.g., "2 branches" → "1 branch")

---

## Migration Notes

### Changes from Previous Implementation
- **New**: Validation endpoints added (can-delete, session-status)
- **Improved**: Error messages now reference validation endpoints
- **No Breaking Changes**: Existing delete endpoints work the same

### Frontend Updates Required
1. Add calls to `/can-delete` endpoints before showing delete buttons
2. Add session status checks for table deletion
3. Implement "Close Session" functionality for tables
4. Update error handling to parse new error message formats
5. Add UI for displaying blocking reasons

---

## Testing Checklist for Frontend

- [ ] Branch deletion disabled when halls exist
- [ ] Hall deletion disabled when tables exist
- [ ] Table deletion disabled when session active
- [ ] "Close Session" button appears for occupied tables
- [ ] Blocking reasons displayed in user-friendly format
- [ ] Delete buttons enable after blockers resolved
- [ ] Success toasts shown after deletion
- [ ] Error messages guide user to validation endpoints
- [ ] Confirmation modals prevent accidental deletion
- [ ] Navigation after deletion works correctly

---

## Next Phase Updates

Task 6.2, 6.3, 6.4 will be documented here as they are implemented.

---

**Questions or Issues?**
Contact the backend team or check Swagger documentation at `/api/docs`
