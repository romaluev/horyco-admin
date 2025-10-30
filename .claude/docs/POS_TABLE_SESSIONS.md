# POS Table Sessions

## Overview

Table sessions track dining experiences from the moment customers are seated until they leave. They're separate from orders because one table session can have multiple orders (e.g., drinks first, then food, then dessert), and understanding this separation is critical for building the POS UI correctly.

This document explains what table sessions are, why they exist separately from orders, and how to manage them through the POS API.

---

## Why Table Sessions Exist Separately from Orders

### The Key Distinction: Session ≠ Order

**Table Session** = The physical dining experience (customers seated → customers leave)

**Order** = Items purchased during the session

**Why separate?**

1. **Multiple Orders Per Session**

   - Customers order drinks at 7:00 PM
   - Then order food at 7:15 PM
   - Then order dessert at 8:00 PM
   - **One session, three orders**

2. **Session Tracks Dining Context**

   - How many guests? (important for service)
   - Which server is handling the table?
   - How long have they been seated? (for turnover analytics)
   - Any special notes? (e.g., "Birthday party")

3. **Orders Track Financial Transactions**

   - What did they buy?
   - How much do they owe?
   - Payment status

4. **Table Availability Depends on Sessions**
   - Table is occupied when session starts
   - Table remains occupied until session ends (even if all orders paid)
   - Waiter might need to clear/clean table before next guests

### Real-World Scenario

```
7:00 PM - Table 5 Session Starts
          └─ Guest Count: 4
          └─ Server: John
          └─ Status: ACTIVE

7:05 PM - Order #1001 Created
          └─ 4x Cocktails = $40

7:20 PM - Order #1002 Created
          └─ 2x Steaks, 2x Pasta = $120

8:00 PM - Order #1003 Created
          └─ 2x Desserts = $20

8:15 PM - All orders paid ($180 total)
          └─ BUT session still active (customers chatting)

8:30 PM - Table 5 Session Ends
          └─ Duration: 1h 30m
          └─ Table now available for cleaning
```

**Key Insight**: Without sessions, we'd have no way to track that these 3 orders belong to the same dining experience, or know when the table is truly available for the next guests.

---

## Table Status vs Session Status

### Table Status

```typescript
enum TableStatus {
  AVAILABLE = 'AVAILABLE', // Empty, ready for guests
  RESERVED = 'RESERVED', // Reserved for future guests
  OCCUPIED = 'OCCUPIED', // Currently has dining session
  CLEANING = 'CLEANING', // Being cleaned
  OUT_OF_ORDER = 'OUT_OF_ORDER', // Broken/unavailable
}
```

### Session Status

- **ACTIVE** - Dining in progress
- **ENDED** - Session completed

**Relationship**:

- Table can be OCCUPIED without active session (temporarily, during transition)
- Active session means table is definitely OCCUPIED
- Ending session can trigger table to CLEANING status

---

## Key Concepts

### 1. **Guest Count**

Number of people dining at the table. Why track this?

- Helps servers provide appropriate service
- Analytics: Average guests per table
- Capacity planning

### 2. **Server Assignment**

Which waiter/server is handling this table. Why important?

- Servers can see "their" tables
- Tips can be attributed correctly
- Performance tracking per server

### 3. **Session Duration**

Time from session start to end. Used for:

- Table turnover analytics
- Average dining duration
- Peak hour analysis

### 4. **Estimated Duration**

Optional field when starting session (e.g., "Quick lunch, 30 minutes"). Helps with:

- Reservation planning
- Table availability forecasting

---

## API Endpoints

Base URL: `/pos/tables`

### 1. Get All Tables in Branch

**GET** `/pos/tables?branchId=1`

Retrieves all tables in a branch with current session information.

**Response (200):**

```json
[
  {
    "id": 1,
    "number": "T-01",
    "capacity": 4,
    "hallId": 1,
    "hallName": "Main Hall",
    "status": "OCCUPIED",
    "isAvailableForSeating": false,
    "activeSession": {
      "id": 101,
      "guestCount": 4,
      "serverId": 12,
      "serverName": "John Doe",
      "startedAt": "2025-01-26T19:00:00Z",
      "duration": "01:30:25"
    },
    "x": 100,
    "y": 150,
    "width": 80,
    "height": 80,
    "shape": "rectangle",
    "isActive": true
  },
  {
    "id": 2,
    "number": "T-02",
    "capacity": 2,
    "hallId": 1,
    "hallName": "Main Hall",
    "status": "AVAILABLE",
    "isAvailableForSeating": true,
    "activeSession": null,
    "x": 200,
    "y": 150,
    "width": 60,
    "height": 60,
    "shape": "circle",
    "isActive": true
  }
]
```

**Use Case:**

- Display floor plan with table status
- Show which tables are occupied vs available
- Display session info for occupied tables

---

### 2. Get Available Tables

**GET** `/pos/tables/available?branchId=1&capacity=4`

Retrieves only available tables, optionally filtered by minimum capacity.

**Query Parameters:**

- `branchId` (required) - Branch ID
- `capacity` (optional) - Minimum capacity needed

**Response (200):**

```json
[
  {
    "id": 2,
    "number": "T-02",
    "capacity": 4,
    "hallId": 1,
    "hallName": "Main Hall",
    "status": "AVAILABLE",
    "isAvailableForSeating": true
  },
  {
    "id": 5,
    "number": "T-05",
    "capacity": 6,
    "hallId": 1,
    "hallName": "Main Hall",
    "status": "AVAILABLE",
    "isAvailableForSeating": true
  }
]
```

**Use Case:**

- Quick seating: "Find table for 4 people"
- Shows tables sorted by capacity (smallest first)
- Efficient table allocation

---

### 3. Start Table Session

**POST** `/pos/tables/:id/start-session`

Starts a new dining session at a table.

**Request Body:**

```json
{
  "guestCount": 4,
  "serverId": 12,
  "notes": "Birthday celebration, requested corner table",
  "estimatedDuration": 90
}
```

**Response (201):**

```json
{
  "id": 101,
  "tableId": 1,
  "tableNumber": "T-01",
  "guestCount": 4,
  "serverId": 12,
  "serverName": "John Doe",
  "startedAt": "2025-01-26T19:00:00Z",
  "endedAt": null,
  "duration": "00:00:00",
  "status": "ACTIVE",
  "notes": "Birthday celebration, requested corner table",
  "estimatedDuration": 90,
  "createdAt": "2025-01-26T19:00:00Z",
  "tenantId": 5
}
```

**Business Rules:**

- ✅ Guest count must be ≥ 1
- ✅ Table must be AVAILABLE or RESERVED
- ❌ Cannot start session if table already has active session
- ✅ Server ID is optional (can assign later)
- ✅ Table status automatically changes to OCCUPIED

**Error Responses:**

```json
// 409 Conflict - Table already has session
{
  "statusCode": 409,
  "message": "Table already has an active session"
}

// 400 Bad Request - Invalid guest count
{
  "statusCode": 400,
  "message": "Guest count must be at least 1"
}

// 400 Bad Request - Table not available
{
  "statusCode": 400,
  "message": "Table is not available for seating (current status: CLEANING)"
}
```

---

### 4. Update Table Session

**PATCH** `/pos/tables/:id/session`

Updates details of the current active session (guest count, server, notes).

**Request Body:**

```json
{
  "guestCount": 5,
  "serverId": 15,
  "notes": "Added one more guest, switched to Sarah's section"
}
```

**Response (200):**

```json
{
  "id": 101,
  "tableId": 1,
  "tableNumber": "T-01",
  "guestCount": 5,
  "serverId": 15,
  "serverName": "Sarah Smith",
  "startedAt": "2025-01-26T19:00:00Z",
  "duration": "00:45:12",
  "status": "ACTIVE",
  "notes": "Added one more guest, switched to Sarah's section",
  "updatedAt": "2025-01-26T19:45:12Z"
}
```

**Use Case:**

- Guest count changes (friend joins party)
- Server change (shift handover or section reassignment)
- Add notes about customer preferences

**Business Rules:**

- ✅ All fields are optional (update only what changes)
- ❌ Cannot update ended session
- ✅ Must have active session to update

---

### 5. End Table Session

**POST** `/pos/tables/:id/end-session`

Ends the current dining session at a table.

**Response (200):**

```json
{
  "id": 101,
  "tableId": 1,
  "tableNumber": "T-01",
  "guestCount": 4,
  "serverId": 12,
  "startedAt": "2025-01-26T19:00:00Z",
  "endedAt": "2025-01-26T20:30:00Z",
  "duration": "01:30:00",
  "status": "ENDED",
  "notes": "Birthday celebration",
  "createdAt": "2025-01-26T19:00:00Z",
  "tenantId": 5
}
```

**Business Rules:**

- ✅ Table must have active session
- ❌ Cannot end session if there are unpaid orders (optional enforcement)
- ✅ Table status may change to CLEANING or AVAILABLE
- ✅ Duration automatically calculated

**Error Responses:**

```json
// 404 Not Found - No active session
{
  "statusCode": 404,
  "message": "No active session found for table ID 1"
}

// 400 Bad Request - Unpaid orders (if enforced)
{
  "statusCode": 400,
  "message": "Cannot end session with unpaid orders. Please complete payment first."
}
```

---

### 6. Get Table Status

**GET** `/pos/tables/:id/status`

Gets detailed status of a specific table including active session.

**Response (200):**

```json
{
  "id": 1,
  "number": "T-01",
  "capacity": 4,
  "status": "OCCUPIED",
  "isAvailableForSeating": false,
  "activeSession": {
    "id": 101,
    "guestCount": 4,
    "serverId": 12,
    "serverName": "John Doe",
    "startedAt": "2025-01-26T19:00:00Z",
    "duration": "01:15:30"
  },
  "activeOrders": [
    {
      "id": 1001,
      "orderNumber": "ORD-1001",
      "totalAmount": 40.0,
      "status": "COMPLETED",
      "paymentStatus": "paid"
    },
    {
      "id": 1002,
      "orderNumber": "ORD-1002",
      "totalAmount": 120.0,
      "status": "COOKING",
      "paymentStatus": "pending"
    }
  ],
  "totalUnpaidAmount": 120.0
}
```

**Use Case:**

- View full table details when tapping table on floor plan
- Check before ending session
- Display to server on their table list

---

### 7. Reserve Table

**POST** `/pos/tables/:id/reserve`

Marks table as reserved (for future guests).

**Response (200):**

```json
{
  "id": 1,
  "number": "T-01",
  "status": "RESERVED",
  "reservedBy": 12,
  "reservedAt": "2025-01-26T18:00:00Z"
}
```

**Use Case:**

- Phone reservation: "Hold table 5 for Smith party at 7 PM"
- Walk-in: "Give us 10 minutes to finish meal, table will be ready"

---

### 8. Occupy Table (Manual)

**POST** `/pos/tables/:id/occupy`

Manually marks table as occupied (alternative to starting session).

**Response (200):**

```json
{
  "id": 1,
  "number": "T-01",
  "status": "OCCUPIED"
}
```

**When to use:**

- Legacy support (some restaurants don't use sessions)
- Quick occupy without full session details

**Note**: Prefer using "Start Session" for full functionality.

---

### 9. Release Table

**POST** `/pos/tables/:id/release`

Releases table back to AVAILABLE status.

**Response (200):**

```json
{
  "id": 1,
  "number": "T-01",
  "status": "AVAILABLE"
}
```

**Use Case:**

- Cancel reservation
- Free table without formal session end

---

### 10. Set Table to Cleaning

**POST** `/pos/tables/:id/cleaning`

Marks table as being cleaned (after guests leave).

**Response (200):**

```json
{
  "id": 1,
  "number": "T-01",
  "status": "CLEANING",
  "lastCleanedBy": 12,
  "lastCleanedAt": "2025-01-26T20:35:00Z"
}
```

**Use Case:**

- After session ends, busser cleans table
- Table shows as "cleaning" on floor plan
- Once cleaned, staff can release to AVAILABLE

---

### 11. Get Branch Table Overview

**GET** `/pos/tables/branch/:branchId/overview`

Gets complete overview of all tables across all halls in branch.

**Response (200):**

```json
{
  "halls": [
    {
      "id": 1,
      "name": "Main Hall",
      "floor": 1,
      "capacity": 80,
      "occupancy": {
        "totalTables": 15,
        "availableTables": 8,
        "occupiedTables": 5,
        "reservedTables": 1,
        "cleaningTables": 1,
        "occupancyRate": 46.67
      }
    },
    {
      "id": 2,
      "name": "Patio",
      "floor": 1,
      "capacity": 40,
      "occupancy": {
        "totalTables": 8,
        "availableTables": 5,
        "occupiedTables": 3,
        "reservedTables": 0,
        "cleaningTables": 0,
        "occupancyRate": 37.5
      }
    }
  ],
  "totalTables": 23,
  "activeTables": 23
}
```

**Use Case:**

- Dashboard summary for manager
- Quick glance at restaurant capacity
- Decide which hall to seat next guests

---

## UI/UX Flows

### Flow 1: Seating Guests (Start Session)

**Screen: Floor Plan / Table List**

1. **Host/hostess sees party of 4 arrive**

2. **Tap "Find Table" or search available tables**

   - Frontend calls `GET /pos/tables/available?branchId=1&capacity=4`
   - Shows available tables with capacity ≥ 4

3. **Select Table T-05 (capacity 6)**

   - Show table details
   - Highlight on floor plan

4. **Tap "Seat Guests"**

   - Show session start dialog

5. **Fill session details**

   - Guest Count: 4
   - Server: [Select from dropdown] → John Doe
   - Notes: (Optional) "Requested window seat"
   - Estimated Duration: (Optional) 90 minutes

6. **Confirm and start session**

   - Frontend calls `POST /pos/tables/5/start-session`

   ```json
   {
     "guestCount": 4,
     "serverId": 12,
     "notes": "Requested window seat",
     "estimatedDuration": 90
   }
   ```

7. **Session started**
   - Table status changes to OCCUPIED on floor plan
   - Show toast: "Table T-05 session started"
   - Navigate to table detail or back to floor plan

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Start Session - Table T-05         ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Table: T-05 (Capacity: 6)              │
│  Current Status: AVAILABLE              │
│                                         │
│  Guest Count: *                         │
│  ┌─────────────────────────────────┐   │
│  │ 4                               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Assign Server:                         │
│  ┌─────────────────────────────────┐   │
│  │ John Doe                    ▼   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Notes: (Optional)                      │
│  ┌─────────────────────────────────┐   │
│  │ Requested window seat           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Estimated Duration: (Optional)         │
│  ┌─────────────────────────────────┐   │
│  │ 90 minutes                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [Cancel]  [Start Session]      │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 2: Updating Session (Guest Count Changes)

**Screen: Table Detail View**

1. **Server realizes one more guest joined table**

   - Currently: 4 guests
   - Need to update to: 5 guests

2. **Tap table T-05 to view details**

   - Show active session info
   - Guest count: 4
   - Duration: 45 minutes

3. **Tap "Edit Session"**

   - Show update dialog with current values pre-filled

4. **Update guest count**

   - Change from 4 to 5
   - Optionally add note: "Friend joined party"

5. **Save changes**

   - Frontend calls `PATCH /pos/tables/5/session`

   ```json
   {
     "guestCount": 5,
     "notes": "Friend joined party"
   }
   ```

6. **Session updated**
   - Display refreshed with new guest count
   - Show toast: "Session updated"

---

### Flow 3: Ending Session

**Screen: Table Detail View**

1. **Guests finished dining and paid**

   - Server checks table T-05
   - All orders paid: ✓
   - Ready to clear table

2. **Tap "End Session"**

   - Show confirmation dialog
   - Display session summary:
     - Duration: 1h 30m
     - Total spent: $180
     - Guest count: 4

3. **Confirm end session**

   - Warning: "Table will be available for cleaning"
   - Frontend calls `POST /pos/tables/5/end-session`

4. **Session ended**
   - Table status changes to CLEANING (or AVAILABLE)
   - Show summary: "Session ended. Duration: 1h 30m"
   - Option to print summary report

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  End Session - Table T-05           ✕   │
├─────────────────────────────────────────┤
│                                         │
│  ⚠️  Are you sure you want to end      │
│     this session?                       │
│                                         │
│  Session Summary:                       │
│  ┌─────────────────────────────────┐   │
│  │ Started:    7:00 PM             │   │
│  │ Duration:   1h 30m              │   │
│  │ Guests:     4                   │   │
│  │ Server:     John Doe            │   │
│  │                                 │   │
│  │ Orders:     3                   │   │
│  │ Total:      $180.00             │   │
│  │ Payment:    ✓ Paid              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Table will be set to CLEANING status   │
│                                         │
│         [Cancel]  [End Session]        │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 4: Floor Plan View with Sessions

**Screen: POS Dashboard - Floor Plan**

1. **Display all tables in branch**

   - Frontend calls `GET /pos/tables?branchId=1`

2. **Render floor plan**

   - Each table positioned using x, y coordinates
   - Table shape (rectangle, circle) from data
   - Color-coded by status:
     - Green: AVAILABLE
     - Blue: RESERVED
     - Red: OCCUPIED
     - Yellow: CLEANING
     - Gray: OUT_OF_ORDER

3. **Show session info on occupied tables**

   - Guest count badge (e.g., "4 👥")
   - Duration timer (e.g., "1h 23m")
   - Server initial (e.g., "JD")

4. **Tap any table**
   - Show table detail modal:
     - Table info (number, capacity, hall)
     - Active session (if any)
     - Active orders (if any)
     - Actions: Start Session, End Session, View Orders, etc.

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Floor Plan - Main Hall             🔍  │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────┐   ┌──────┐   ⭕ T-03       │
│  │ T-01 │   │ T-02 │   (2👥)         │
│  │ 4👥  │   AVAIL   1h 15m          │
│  │1h 30m│   6 seats  JD              │
│  │  JD  │                             │
│  └──────┘   └──────┘                   │
│                                         │
│  ┌──────┐   ┌──────┐   ⭕ T-06       │
│  │ T-04 │   │ T-05 │   CLEAN         │
│  │ 2👥  │   │ 4👥  │                 │
│  │ 45m  │   │2h 10m│                 │
│  │  SM  │   │  JD  │                 │
│  └──────┘   └──────┘                   │
│                                         │
│  Legend: 🟢 Available 🔵 Reserved      │
│          🔴 Occupied  🟡 Cleaning       │
│                                         │
│  Occupancy: 3/6 tables (50%)            │
│                                         │
└─────────────────────────────────────────┘
```

---

## Common Questions

### Q1: Why not automatically start a session when creating an order?

**A:** Because:

- Session should start when guests are seated, not when first order is placed
- Multiple orders can belong to the same session
- Session tracks dining context (guests, server), not just purchases
- Guest might be seated but browse menu for 10 minutes before ordering

### Q2: Can I have an order without a session?

**A:** Yes! Takeaway and delivery orders don't have table sessions. Only dine-in orders with tables have sessions.

### Q3: Should I always end the session immediately after payment?

**A:** Not necessarily. Guests might linger after paying (chatting, finishing coffee). End session when they actually leave and table is ready for turnover.

### Q4: What if I forget to end a session?

**A:** Session remains active indefinitely. Best practice: Train staff to end sessions promptly. Can build reports to find "long-running sessions" (>3 hours?) for cleanup.

### Q5: Can two tables share one session (for large parties)?

**A:** Not directly. Current design: one session per table. For large parties spanning multiple tables, you'd create separate sessions but link orders to one payment. (This could be enhanced in future versions.)

### Q6: What happens to the session if an order is cancelled?

**A:** Nothing. Session is independent. You can cancel all orders and session remains active (guests might order something else, or just leave).

### Q7: Can I change the server mid-session?

**A:** Yes! Use `PATCH /pos/tables/:id/session` to update `serverId`. Common during shift changes or section reassignments.

### Q8: How do I track session duration in real-time?

**A:** Frontend should display live timer using `startedAt` field:

```typescript
const duration = Date.now() - new Date(session.startedAt).getTime()
const hours = Math.floor(duration / 3600000)
const minutes = Math.floor((duration % 3600000) / 60000)
// Display: "1h 23m"
```

### Q9: What if a table has unpaid orders when ending session?

**A:** The API may return an error (depending on business rules). Best practice: Check order payment status before allowing session end. Or warn user: "This table has unpaid orders. Continue anyway?"

### Q10: Why track estimated duration?

**A:** Helps with capacity planning:

- "Quick lunch" (30 min) vs "Dinner date" (2 hours)
- Reservation system can forecast table availability
- Manager can optimize table turnover

---

## Frontend Implementation Guide

### 1. **Session Context Provider**

```typescript
interface SessionContextType {
  activeSessions: TableSession[]
  startSession: (tableId: number, data: StartSessionDto) => Promise<void>
  updateSession: (tableId: number, data: UpdateSessionDto) => Promise<void>
  endSession: (tableId: number) => Promise<void>
  getTableStatus: (tableId: number) => Promise<TableStatus>
  refreshSessions: () => Promise<void>
}
```

### 2. **Live Session Duration Display**

```typescript
function SessionDuration({ startedAt }: { startedAt: Date }) {
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const updateDuration = () => {
      const now = Date.now();
      const start = new Date(startedAt).getTime();
      const diff = now - start;

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      setDuration(`${hours}h ${minutes}m`);
    };

    updateDuration();
    const interval = setInterval(updateDuration, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [startedAt]);

  return <span>{duration}</span>;
}
```

### 3. **Table Status Badge Component**

```typescript
function TableStatusBadge({ status }: { status: TableStatus }) {
  const styles = {
    AVAILABLE: { color: 'green', icon: '✓' },
    RESERVED: { color: 'blue', icon: '🕐' },
    OCCUPIED: { color: 'red', icon: '👥' },
    CLEANING: { color: 'yellow', icon: '🧹' },
    OUT_OF_ORDER: { color: 'gray', icon: '⚠️' }
  };

  const style = styles[status];

  return (
    <Badge color={style.color}>
      {style.icon} {status}
    </Badge>
  );
}
```

### 4. **Floor Plan Table Component**

```typescript
function FloorPlanTable({ table }: { table: Table }) {
  const style = {
    position: 'absolute',
    left: table.x,
    top: table.y,
    width: table.width,
    height: table.height,
    borderRadius: table.shape === 'circle' ? '50%' : '4px',
    backgroundColor: getColorForStatus(table.status),
    cursor: 'pointer'
  };

  return (
    <div style={style} onClick={() => openTableDetail(table.id)}>
      <div className="table-number">{table.number}</div>
      {table.activeSession && (
        <>
          <div className="guest-count">
            {table.activeSession.guestCount} 👥
          </div>
          <SessionDuration startedAt={table.activeSession.startedAt} />
          <div className="server">{table.activeSession.serverName}</div>
        </>
      )}
    </div>
  );
}
```

### 5. **Session Validator Before End**

```typescript
async function validateSessionEnd(tableId: number): Promise<boolean> {
  const status = await api.get(`/pos/tables/${tableId}/status`)

  if (status.totalUnpaidAmount > 0) {
    const confirmed = await confirmDialog({
      title: 'Unpaid Orders',
      message: `This table has $${status.totalUnpaidAmount.toFixed(2)} in unpaid orders. End session anyway?`,
      confirmLabel: 'End Anyway',
      cancelLabel: 'Cancel',
    })
    return confirmed
  }

  return true
}

async function endSession(tableId: number) {
  const canEnd = await validateSessionEnd(tableId)
  if (!canEnd) return

  await api.post(`/pos/tables/${tableId}/end-session`)
  showToast('Session ended successfully')
  refreshTables()
}
```

---

## Testing Checklist

- [ ] Start session with valid data
- [ ] Start session with guest count < 1 (should fail)
- [ ] Start session on table with active session (should fail)
- [ ] Start session on unavailable table (should fail)
- [ ] Update session guest count
- [ ] Update session server assignment
- [ ] Update session notes
- [ ] End session with no unpaid orders
- [ ] Try to end session with unpaid orders (if validation enabled)
- [ ] End session twice (second should fail)
- [ ] Get table status with active session
- [ ] Get table status without session
- [ ] Get available tables with capacity filter
- [ ] Reserve table
- [ ] Release reserved table
- [ ] Set table to cleaning after session end
- [ ] View floor plan with multiple session states
- [ ] Verify session duration calculation
- [ ] Verify table availability logic

---

## Summary

Table sessions are the glue between physical dining and digital orders. They:

1. **Track dining context** separate from financial transactions
2. **Enable multiple orders** within one dining experience
3. **Provide valuable analytics** (duration, turnover, server performance)
4. **Manage table availability** accurately (not just based on payment)
5. **Support real-time floor plan** visualization for hosts and managers

Frontend must clearly distinguish between session management (seating, duration, server) and order management (items, payment). The two work together but serve different purposes.
