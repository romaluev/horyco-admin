# Admin Table Management

Manage dining halls and tables within branches. Halls represent dining areas (main room, terrace, VIP), and tables are seating locations with QR codes for customer orders.

---

## 📋 Table of Contents

1. [Core Concepts](#core-concepts)
2. [Hall Management](#hall-management)
3. [Table Management](#table-management)
4. [Table Sessions](#table-sessions)
5. [Floor Plan & Layout](#floor-plan--layout)
6. [QR Codes](#qr-codes)
7. [UI Workflows](#ui-workflows)

---

## Core Concepts

### Hierarchy

```
Branch (Physical Location)
  └── Hall (Dining Area)
      └── Table (Seating Location)
          └── Session (Active dining)
```

### What is a Hall?

A hall is a dining area within a branch. Examples:
- Main Dining Room
- Terrace
- VIP Room
- Bar Area
- Private Room

Each hall has:
- Name and description
- Capacity (total seats)
- Floor number
- Tables
- Layout configuration

### What is a Table?

A table is a physical seating location. Each table has:
- Number/name (T1, T2, VIP-1)
- Capacity (how many guests)
- Position on floor plan (x, y coordinates)
- QR code for customer orders
- Current status (available, occupied, reserved)

### What is a Session?

A session represents active dining at a table:
- Started when customers scan QR or waiter opens it
- Linked to orders and payments
- Closed when customers leave

---

## Hall Management

### Get All Halls

**Endpoint:** `GET /admin/halls?branchId=1`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Main Dining Room",
    "description": "Ground floor main area",
    "capacity": 80,
    "floor": 1,
    "branchId": 1,
    "branchName": "Downtown Branch",
    "tableCount": 15,
    "isActive": true
  },
  {
    "id": 2,
    "name": "Terrace",
    "description": "Outdoor seating area",
    "capacity": 40,
    "floor": 1,
    "branchId": 1,
    "branchName": "Downtown Branch",
    "tableCount": 8,
    "isActive": true
  }
]
```

### Get Single Hall

**Endpoint:** `GET /admin/halls/:id`

**Response:**
```json
{
  "id": 1,
  "name": "Main Dining Room",
  "description": "Ground floor main area",
  "capacity": 80,
  "floor": 1,
  "branchId": 1,
  "branch": {
    "id": 1,
    "name": "Downtown Branch",
    "address": "123 Main St"
  },
  "tableCount": 15,
  "activeTableCount": 5,
  "layout": {
    "width": 800,
    "height": 600,
    "gridSize": 10
  },
  "isActive": true,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Create Hall

**Endpoint:** `POST /admin/halls`

**Request:**
```json
{
  "branchId": 1,
  "name": "VIP Room",
  "description": "Private dining area",
  "capacity": 20,
  "floor": 2
}
```

**Response (201):**
```json
{
  "id": 3,
  "name": "VIP Room",
  "description": "Private dining area",
  "capacity": 20,
  "floor": 2,
  "branchId": 1,
  "tableCount": 0,
  "isActive": true,
  "createdAt": "2025-03-01T12:00:00Z"
}
```

### Update Hall

**Endpoint:** `PATCH /admin/halls/:id`

**Request:**
```json
{
  "capacity": 30,
  "description": "Updated VIP area with extended capacity"
}
```

### Delete Hall

**Step 1:** Check if can delete

**Endpoint:** `GET /admin/halls/:id/can-delete`

**Response:**
```json
{
  "canDelete": false,
  "blockingReasons": {
    "tables": "Hall has 8 tables. Delete tables first."
  }
}
```

**Step 2:** Delete hall

**Endpoint:** `DELETE /admin/halls/:id`

**Rule:** Cannot delete hall if tables exist. Delete tables first.

---

## Table Management

### Get All Tables

**Endpoint:** `GET /admin/tables?hallId=1`

**Response:**
```json
[
  {
    "id": 1,
    "number": "T1",
    "capacity": 4,
    "hallId": 1,
    "hallName": "Main Dining Room",
    "position": {
      "x": 100,
      "y": 150,
      "rotation": 0
    },
    "status": "AVAILABLE",
    "hasActiveSession": false,
    "qrCode": "QR_TABLE_1_ABC123"
  },
  {
    "id": 2,
    "number": "T2",
    "capacity": 6,
    "hallId": 1,
    "hallName": "Main Dining Room",
    "position": {
      "x": 300,
      "y": 150,
      "rotation": 90
    },
    "status": "OCCUPIED",
    "hasActiveSession": true,
    "qrCode": "QR_TABLE_2_DEF456"
  }
]
```

**Table Status:**
- `AVAILABLE` - Free to use
- `OCCUPIED` - Has active session
- `RESERVED` - Reserved for future
- `INACTIVE` - Temporarily disabled

### Get Single Table

**Endpoint:** `GET /admin/tables/:id`

**Response:**
```json
{
  "id": 1,
  "number": "T1",
  "capacity": 4,
  "hallId": 1,
  "hall": {
    "id": 1,
    "name": "Main Dining Room",
    "branchId": 1,
    "branchName": "Downtown Branch"
  },
  "position": {
    "x": 100,
    "y": 150,
    "rotation": 0,
    "width": 80,
    "height": 80
  },
  "shape": "SQUARE",
  "status": "AVAILABLE",
  "hasActiveSession": false,
  "qrCode": "QR_TABLE_1_ABC123",
  "qrCodeUrl": "https://api.oshlab.uz/qr/tables/1",
  "metadata": {
    "preferredFor": "couples",
    "nearWindow": true
  },
  "isActive": true,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Create Table

**Endpoint:** `POST /admin/tables`

**Request:**
```json
{
  "hallId": 1,
  "number": "T10",
  "capacity": 4,
  "position": {
    "x": 500,
    "y": 300,
    "rotation": 0
  },
  "shape": "ROUND",
  "metadata": {
    "nearWindow": true
  }
}
```

**Response (201):**
```json
{
  "id": 10,
  "number": "T10",
  "capacity": 4,
  "hallId": 1,
  "position": {
    "x": 500,
    "y": 300,
    "rotation": 0
  },
  "shape": "ROUND",
  "status": "AVAILABLE",
  "qrCode": "QR_TABLE_10_XYZ789",
  "qrCodeUrl": "https://api.oshlab.uz/qr/tables/10",
  "createdAt": "2025-03-01T12:00:00Z"
}
```

**QR code generated automatically on creation.**

### Update Table

**Endpoint:** `PATCH /admin/tables/:id`

**Request (update capacity and metadata):**
```json
{
  "capacity": 6,
  "metadata": {
    "nearWindow": false,
    "preferredFor": "families"
  }
}
```

### Update Table Position (Drag & Drop)

**Endpoint:** `PATCH /admin/tables/:id/layout`

**Request:**
```json
{
  "x": 250,
  "y": 400,
  "rotation": 45
}
```

**Use when:** User drags table on floor plan

### Delete Table

**Step 1:** Check session status

**Endpoint:** `GET /admin/tables/:id/session-status`

**Response:**
```json
{
  "hasActiveSession": true,
  "sessionId": 42,
  "startedAt": "2025-03-01T18:30:00Z",
  "guestCount": 4,
  "totalAmount": 125000,
  "canClose": true
}
```

**If active session exists, must close it first.**

**Step 2:** Close session (if needed)

**Endpoint:** `POST /admin/tables/:id/close-session`

**Request:**
```json
{
  "reason": "Manual closure by admin"
}
```

**Step 3:** Delete table

**Endpoint:** `DELETE /admin/tables/:id`

**Rule:** Cannot delete if active session. Close session first.

---

## Table Sessions

### What is a Session?

A session represents active dining at a table:
- Starts when customer scans QR or waiter opens it
- Links all orders and payments for that table
- Tracks guest count and duration
- Ends when customers leave and bill is paid

### Session Lifecycle

```
CREATED → ACTIVE → PAYMENT_PENDING → COMPLETED
```

### Check Session Status

**Endpoint:** `GET /admin/tables/:id/session-status`

**Response (active session):**
```json
{
  "hasActiveSession": true,
  "sessionId": 42,
  "startedAt": "2025-03-01T18:30:00Z",
  "guestCount": 4,
  "waiterName": "John Doe",
  "orderCount": 2,
  "totalAmount": 125000,
  "isPaid": false,
  "canClose": false
}
```

**Response (no session):**
```json
{
  "hasActiveSession": false,
  "sessionId": null
}
```

### Close Session

**Endpoint:** `POST /admin/tables/:id/close-session`

**Request:**
```json
{
  "reason": "Customers left",
  "finalizePayment": true
}
```

**Response:**
```json
{
  "sessionId": 42,
  "closedAt": "2025-03-01T20:15:00Z",
  "duration": 105,
  "totalAmount": 125000,
  "message": "Session closed successfully"
}
```

**Use when:**
- Admin manually closes table
- Customers leave without closing properly
- Need to free up table for new customers

---

## Floor Plan & Layout

### Hall Layout Configuration

Each hall can have a floor plan with positioned tables.

**Layout Object:**
```json
{
  "width": 800,
  "height": 600,
  "gridSize": 10,
  "backgroundImage": "https://..."
}
```

**Table Position:**
```json
{
  "x": 100,
  "y": 150,
  "rotation": 0,
  "width": 80,
  "height": 80
}
```

### Update Multiple Table Positions

When user rearranges floor plan, update all positions in batch:

```javascript
// For each moved table:
PATCH /admin/tables/{id}/layout
{
  "x": newX,
  "y": newY,
  "rotation": newRotation
}
```

---

## QR Codes

### QR Code Generation

QR codes are generated automatically when table is created.

**QR Code Contains:**
- Table ID
- Branch ID
- Unique token

**Format:** `QR_TABLE_{id}_{token}`

**URL:** `https://app.oshlab.uz/scan/{qrCode}`

### Get QR Code Image

**Endpoint:** `GET /admin/tables/:id/qr-code`

**Response:** PNG image (downloadable)

**Use for:** Print and place on table

### Regenerate QR Code

**Endpoint:** `POST /admin/tables/:id/regenerate-qr`

**Response:**
```json
{
  "qrCode": "QR_TABLE_1_NEW123",
  "qrCodeUrl": "https://api.oshlab.uz/qr/tables/1"
}
```

**Use when:** QR code compromised or damaged

---

## UI Workflows

### Workflow 1: Hall List

**Screen: Halls Page**

```
┌─────────────────────────────────────────────────┐
│  Halls - Downtown Branch          [+ Add Hall]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Main Dining Room                 Floor 1 │  │
│  │ Ground floor main area                   │  │
│  │ Capacity: 80 • 15 tables (5 occupied)    │  │
│  │ [View Floor Plan] [Edit] [Delete]        │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Terrace                          Floor 1 │  │
│  │ Outdoor seating area                     │  │
│  │ Capacity: 40 • 8 tables (2 occupied)     │  │
│  │ [View Floor Plan] [Edit] [Delete]        │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ VIP Room                         Floor 2 │  │
│  │ Private dining area                      │  │
│  │ Capacity: 20 • 4 tables (0 occupied)     │  │
│  │ [View Floor Plan] [Edit] [Delete]        │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Workflow 2: Floor Plan Editor

**Screen: Hall Floor Plan**

```
┌─────────────────────────────────────────────────┐
│  Main Dining Room - Floor Plan                  │
│  [Save Layout] [Add Table] [Delete Mode]        │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  │   ┌────┐      ┌────┐        ┌────┐       │ │
│  │   │ T1 │      │ T2 │        │ T3 │       │ │
│  │   │ 4  │      │ 6  │        │ 4  │       │ │
│  │   └────┘      └────┘        └────┘       │ │
│  │   ✓ Free     🔴 Busy        ✓ Free       │ │
│  │                                           │ │
│  │     ┌──────┐           ┌────┐            │ │
│  │     │  T4  │           │ T5 │            │ │
│  │     │  8   │           │ 2  │            │ │
│  │     └──────┘           └────┘            │ │
│  │     ✓ Free             ✓ Free            │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Legend:                                        │
│  ✓ Available  🔴 Occupied  🟡 Reserved          │
│                                                 │
│  Selected: Table T2 (Capacity: 6)               │
│  Status: Occupied • 4 guests • 35 min           │
│  [View Session] [Close Table]                   │
└─────────────────────────────────────────────────┘
```

**Features:**
- Drag tables to move
- Click to select
- Add new tables
- Change capacity
- View session info
- Close active sessions

### Workflow 3: Add New Table

**Steps:**

1. **Click "+ Add Table"** on floor plan

2. **Fill form:**
```
┌─────────────────────────────────────────────────┐
│  Add New Table                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Table Number *                                 │
│  [T__]                                          │
│                                                 │
│  Capacity *                                     │
│  [4] guests                                     │
│                                                 │
│  Shape                                          │
│  ○ Square  ○ Round  ● Rectangle                │
│                                                 │
│  Position (click on map or enter)               │
│  X: [500]  Y: [300]                             │
│                                                 │
│  [Cancel]                    [Create Table]     │
└─────────────────────────────────────────────────┘
```

3. **Submit:** `POST /admin/tables`

4. **QR code generated automatically**

5. **Table appears on floor plan**

### Workflow 4: Close Active Session

**Steps:**

1. **Click occupied table** on floor plan

2. **View session details:**
```
┌─────────────────────────────────────────────────┐
│  Table T2 - Active Session                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Session started: 18:30 (35 minutes ago)        │
│  Guests: 4                                      │
│  Waiter: John Doe                               │
│                                                 │
│  Orders:                                        │
│  • Order #1234 - 85,000 UZS                     │
│  • Order #1235 - 40,000 UZS                     │
│                                                 │
│  Total: 125,000 UZS                             │
│  Payment Status: Not Paid                       │
│                                                 │
│  [View Full Details]         [Close Session]    │
└─────────────────────────────────────────────────┘
```

3. **Click "Close Session"** → Confirm

4. **Call:** `POST /admin/tables/:id/close-session`

5. **Table becomes available**

### Workflow 5: Print QR Codes

**Steps:**

1. **Select tables** to print

2. **Click "Print QR Codes"**

3. **Generate PDF:**
```
┌─────────────────────────────────────────────────┐
│  QR Code Print Sheet                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐      ┌──────────┐                │
│  │ [QR CODE]│      │ [QR CODE]│                │
│  │  Table 1 │      │  Table 2 │                │
│  │ Capacity 4│      │ Capacity 6│               │
│  └──────────┘      └──────────┘                │
│                                                 │
│  ┌──────────┐      ┌──────────┐                │
│  │ [QR CODE]│      │ [QR CODE]│                │
│  │  Table 3 │      │  Table 4 │                │
│  │ Capacity 4│      │ Capacity 8│               │
│  └──────────┘      └──────────┘                │
│                                                 │
│  [Download PDF] [Print]                         │
└─────────────────────────────────────────────────┘
```

4. **Print and laminate**

5. **Place on tables**

---

## API Summary

### Hall Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/admin/halls?branchId=1` | List halls |
| `GET` | `/admin/halls/:id` | Get hall details |
| `POST` | `/admin/halls` | Create hall |
| `PATCH` | `/admin/halls/:id` | Update hall |
| `DELETE` | `/admin/halls/:id` | Delete hall |
| `GET` | `/admin/halls/:id/can-delete` | Check if can delete |

### Table Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/admin/tables?hallId=1` | List tables |
| `GET` | `/admin/tables/:id` | Get table details |
| `POST` | `/admin/tables` | Create table |
| `PATCH` | `/admin/tables/:id` | Update table |
| `PATCH` | `/admin/tables/:id/layout` | Update position |
| `DELETE` | `/admin/tables/:id` | Delete table |
| `GET` | `/admin/tables/:id/session-status` | Check session |
| `POST` | `/admin/tables/:id/close-session` | Close session |
| `GET` | `/admin/tables/:id/qr-code` | Get QR code image |
| `POST` | `/admin/tables/:id/regenerate-qr` | Regenerate QR |
