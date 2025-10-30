# POS Shift Management

## Overview

A **shift** is a work session in the POS system that represents a period when one or more cashiers are actively processing orders at a specific branch. Every order in the POS must be associated with an active shift.

This document explains the shift lifecycle, how frontend should interact with the shift APIs, and the business logic behind shift management.

---

## Why Do Shifts Exist?

### 1. **Financial Accountability**

Shifts track who handled money during which period. When a cashier opens a shift with $100 starting cash and closes it with $500 ending cash, we can reconcile exactly what happened during their work session.

### 2. **Cash Reconciliation**

At shift closure, the system calculates:

- **Expected Cash** = Starting Cash + Cash Sales
- **Actual Cash** = Ending Cash (counted by cashier)
- **Cash Variance** = Actual Cash - Expected Cash

If there's a variance (over/short), management can investigate immediately.

### 3. **Performance Tracking**

Each shift tracks:

- Total orders processed
- Revenue by payment method (cash, card, online)
- Average order value
- Hourly sales breakdown
- Shift duration

### 4. **Audit Trail**

Every shift records:

- Who opened it (`openedById`)
- Who closed it (`closedById`)
- When it started and ended
- All orders created during the shift

### 5. **Multi-Cashier Support**

Multiple cashiers can work on the same shift by using the **resume shift** feature. This is useful when:

- Shift handover happens but cash drawer doesn't change
- Multiple cashiers work simultaneously at different POS terminals
- One cashier takes a break and another covers

---

## Shift Lifecycle

```
┌─────────────┐
│   OPENED    │ ← Cashier starts work, enters starting cash
│  (Active)   │
└──────┬──────┘
       │
       ├─────→ Orders can be created
       │
       ├─────→ Multiple cashiers can resume the same shift
       │
       ├─────→ Real-time sales tracking
       │
┌──────▼──────┐
│   CLOSED    │ ← Cashier ends work, counts cash, system calculates variance
│ (Completed) │
└─────────────┘
```

---

## Key Concepts

### 1. **Active Shift**

A shift that is currently open (`isClosed: false`). Orders can only be created within an active shift.

### 2. **Starting Cash**

The initial cash in the drawer when the shift begins. This is typically:

- Previous shift's ending cash (if cash wasn't banked)
- A fixed float amount (e.g., $100 for making change)

### 3. **Ending Cash**

The actual physical cash counted by the cashier when closing the shift. This is entered manually.

### 4. **Cash Variance**

The difference between expected and actual cash:

- **Positive variance** (over): More cash than expected
- **Negative variance** (short): Less cash than expected
- **Zero variance**: Perfect match

### 5. **Expected Cash**

Calculated automatically:

```
Expected Cash = Starting Cash + Total Cash Sales
```

### 6. **Resume Shift**

Allows a different cashier to join an existing active shift. The new cashier can process orders on the same shift without closing and reopening.

**Important**: Only one active shift per branch at a time, but multiple users can resume the same shift.

---

## API Endpoints

Base URL: `/pos/shifts`

### 1. Open Shift

**POST** `/pos/shifts/open`

Opens a new shift for the current user at a specific branch.

**Request Body:**

```json
{
  "branchId": 1,
  "startingCash": 100.0,
  "notes": "Morning shift - received $100 float from manager"
}
```

**Response (201):**

```json
{
  "id": 45,
  "branchId": 1,
  "openedById": 12,
  "closedById": null,
  "openedAt": "2025-01-26T08:00:00Z",
  "closedAt": null,
  "startingCash": 100.0,
  "endingCash": null,
  "totalOrders": 0,
  "totalCashSales": 0.0,
  "totalCardSales": 0.0,
  "totalOnlineSales": 0.0,
  "totalSales": 0.0,
  "notes": "Morning shift - received $100 float from manager",
  "closingNotes": null,
  "isClosed": false,
  "durationHours": null,
  "averageOrderValue": 0.0,
  "expectedCash": 100.0,
  "cashVariance": null,
  "canBeClosed": true,
  "createdAt": "2025-01-26T08:00:00Z",
  "updatedAt": "2025-01-26T08:00:00Z",
  "tenantId": 5
}
```

**Business Rules:**

- ❌ User cannot open a shift if they already have an active shift
- ❌ Branch cannot have multiple active shifts (only one per branch)
- ✅ Starting cash must be ≥ 0

**Error Responses:**

```json
// 409 Conflict - User already has active shift
{
  "statusCode": 409,
  "message": "User already has an active shift"
}

// 409 Conflict - Branch already has active shift
{
  "statusCode": 409,
  "message": "Branch already has an active shift"
}
```

---

### 2. Resume Shift

**POST** `/pos/shifts/resume`

Allows a cashier to join an existing active shift. Useful for shift handovers or multi-terminal setups.

**Request Body:**

```json
{
  "shiftId": 45
}
```

**Response (200):**

```json
{
  "id": 45,
  "branchId": 1,
  "openedById": 12,
  "closedById": null,
  "openedAt": "2025-01-26T08:00:00Z",
  "closedAt": null,
  "startingCash": 100.0,
  "endingCash": null,
  "totalOrders": 15,
  "totalCashSales": 450.0,
  "totalCardSales": 250.0,
  "totalOnlineSales": 0.0,
  "totalSales": 700.0,
  "notes": "Morning shift - received $100 float from manager",
  "closingNotes": null,
  "isClosed": false,
  "durationHours": 3.5,
  "averageOrderValue": 46.67,
  "expectedCash": 550.0,
  "cashVariance": null,
  "canBeClosed": true,
  "createdAt": "2025-01-26T08:00:00Z",
  "updatedAt": "2025-01-26T11:30:00Z",
  "tenantId": 5
}
```

**Business Rules:**

- ✅ Multiple users can resume the same shift
- ❌ Cannot resume a closed shift
- ❌ User cannot resume a shift if they already have a different active shift
- ✅ If user is resuming their own active shift, just return it (idempotent)

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Shift with ID 45 not found"
}

// 400 Bad Request - Shift already closed
{
  "statusCode": 400,
  "message": "Cannot resume a closed shift. Please open a new shift."
}

// 400 Bad Request - User has different active shift
{
  "statusCode": 400,
  "message": "User already has an active shift (ID: 42). Please close it before resuming another shift."
}
```

---

### 3. Get Current Shift (for logged-in user)

**GET** `/pos/shifts/current`

Returns the currently active shift for the logged-in user, or `null` if no active shift.

**Response (200):**

```json
{
  "id": 45,
  "branchId": 1,
  "openedById": 12
  // ... (same structure as above)
}
```

**Or if no active shift:**

```json
null
```

**Use Case:**

- Check if user has an active shift before allowing POS operations
- Display shift information in POS header
- Determine whether to show "Open Shift" or "Resume Shift" button

---

### 4. Get Current Shift by Branch

**GET** `/pos/shifts/branch/:branchId/current`

Returns the currently active shift for a specific branch, or `null` if no active shift.

**Response (200):**

```json
{
  "id": 45,
  "branchId": 1
  // ... (same structure as above)
}
```

**Use Case:**

- Check if branch has an active shift before opening a new one
- Display active shift for branch managers
- Allow second cashier to see and resume the branch's active shift

---

### 5. Close Shift

**POST** `/pos/shifts/:shiftId/close`

Closes an active shift by counting the ending cash and calculating variance.

**Request Body:**

```json
{
  "endingCash": 575.5,
  "closingNotes": "Evening shift closed. $25.50 over - customer gave tip in cash drawer by mistake"
}
```

**Response (200):**

```json
{
  "id": 45,
  "branchId": 1,
  "openedById": 12,
  "closedById": 12,
  "openedAt": "2025-01-26T08:00:00Z",
  "closedAt": "2025-01-26T16:00:00Z",
  "startingCash": 100.0,
  "endingCash": 575.5,
  "totalOrders": 32,
  "totalCashSales": 450.0,
  "totalCardSales": 250.0,
  "totalOnlineSales": 0.0,
  "totalSales": 700.0,
  "notes": "Morning shift - received $100 float from manager",
  "closingNotes": "Evening shift closed. $25.50 over - customer gave tip in cash drawer by mistake",
  "isClosed": true,
  "durationHours": 8.0,
  "averageOrderValue": 21.88,
  "expectedCash": 550.0,
  "cashVariance": 25.5,
  "canBeClosed": true,
  "createdAt": "2025-01-26T08:00:00Z",
  "updatedAt": "2025-01-26T16:00:00Z",
  "tenantId": 5
}
```

**Calculations on Closure:**

```
Expected Cash = Starting Cash (100) + Total Cash Sales (450) = 550.00
Cash Variance = Ending Cash (575.50) - Expected Cash (550.00) = +25.50 (over)
Duration Hours = Closed At - Opened At = 8.0 hours
Average Order Value = Total Sales (700) / Total Orders (32) = 21.88
```

**Business Rules:**

- ❌ Cannot close an already closed shift
- ❌ Only the shift opener can close the shift (or manager with permission)
- ✅ Ending cash must be ≥ 0
- ✅ System automatically calculates totals from completed orders

**Error Responses:**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Shift with ID 45 not found"
}

// 400 Bad Request - Already closed
{
  "statusCode": 400,
  "message": "Shift is already closed"
}

// 400 Bad Request - Wrong user
{
  "statusCode": 400,
  "message": "Only the shift opener can close this shift"
}
```

---

### 6. Get Shift by ID

**GET** `/pos/shifts/:shiftId`

Retrieves detailed information about a specific shift.

**Response (200):**

```json
{
  "id": 45,
  "branchId": 1
  // ... (same structure as above)
}
```

**Use Case:**

- View historical shift details
- Display shift information in reports
- Review past shift performance

---

### 7. Get Shift Summary (with orders and breakdowns)

**GET** `/pos/shifts/:id/summary`

Returns a comprehensive shift summary including all orders, payment breakdown, and hourly revenue.

**Response (200):**

```json
{
  "id": 45,
  "branchId": 1,
  "openedById": 12,
  "closedById": 12,
  "openedAt": "2025-01-26T08:00:00Z",
  "closedAt": "2025-01-26T16:00:00Z",
  "startingCash": 100.0,
  "endingCash": 575.5,
  "totalOrders": 32,
  "totalCashSales": 450.0,
  "totalCardSales": 250.0,
  "totalOnlineSales": 0.0,
  "totalSales": 700.0,
  "notes": "Morning shift",
  "closingNotes": "Evening shift closed",
  "isClosed": true,
  "durationHours": 8.0,
  "averageOrderValue": 21.88,
  "expectedCash": 550.0,
  "cashVariance": 25.5,
  "canBeClosed": true,
  "createdAt": "2025-01-26T08:00:00Z",
  "updatedAt": "2025-01-26T16:00:00Z",
  "tenantId": 5,

  "orders": [
    {
      "id": 101,
      "orderNumber": "ORD-1001",
      "status": "completed",
      "totalAmount": 25.5,
      "source": "pos",
      "paymentStatus": "paid",
      "createdAt": "2025-01-26T08:15:00Z",
      "completedAt": "2025-01-26T08:20:00Z"
    }
    // ... more orders
  ],

  "paymentBreakdown": {
    "cash": 450.0,
    "card": 250.0,
    "online": 0.0
  },

  "hourlyBreakdown": [
    {
      "hour": "08:00",
      "orders": 5,
      "revenue": 125.5
    },
    {
      "hour": "09:00",
      "orders": 8,
      "revenue": 195.0
    },
    {
      "hour": "10:00",
      "orders": 6,
      "revenue": 142.25
    }
    // ... more hours
  ]
}
```

**Use Case:**

- Display detailed shift report at closure
- Show shift performance analytics
- Export shift data for accounting

---

### 8. Get Shifts by Branch

**GET** `/pos/shifts/branch/:branchId`

Returns all shifts for a specific branch (paginated).

**Response (200):**

```json
[
  {
    "id": 45,
    "branchId": 1
    // ... (shift details)
  },
  {
    "id": 44,
    "branchId": 1
    // ... (shift details)
  }
]
```

**Use Case:**

- Display shift history for a branch
- Generate branch performance reports
- Review past shifts for reconciliation

---

### 9. Get User Shift History

**GET** `/pos/shifts/user/history`

Returns all shifts for the currently logged-in user.

**Response (200):**

```json
[
  {
    "id": 45,
    "branchId": 1
    // ... (shift details)
  },
  {
    "id": 42,
    "branchId": 1
    // ... (shift details)
  }
]
```

**Use Case:**

- Display cashier's shift history
- Track individual performance
- Review past work sessions

---

## UI/UX Flows

### Flow 1: Opening a Shift (First Cashier of the Day)

**Screen: POS Login / Dashboard**

1. **User logs in to POS app**

   - Frontend calls `GET /pos/shifts/current`
   - Response: `null` (no active shift)

2. **Show "Open Shift" dialog**

   - Prompt for branch selection (if user assigned to multiple branches)
   - Input field: Starting Cash Amount
   - Input field (optional): Opening Notes
   - Default starting cash from settings (e.g., $100)

3. **User enters starting cash and clicks "Open Shift"**

   - Frontend calls `POST /pos/shifts/open`

   ```json
   {
     "branchId": 1,
     "startingCash": 100.0,
     "notes": "Morning shift"
   }
   ```

4. **Success response**

   - Store shift ID in local state/context
   - Navigate to POS main screen
   - Display shift info in header (e.g., "Shift #45 | Started: 8:00 AM | $100.00")

5. **Error handling**
   - If 409 (user has active shift): Show "Resume Shift" dialog instead
   - If 409 (branch has active shift): Show "Resume Branch Shift" option

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Open Shift                         ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Branch: [Downtown Branch     ▼]       │
│                                         │
│  Starting Cash Amount *                 │
│  ┌─────────────────────────────────┐   │
│  │ $100.00                         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Opening Notes (Optional)              │
│  ┌─────────────────────────────────┐   │
│  │ Morning shift - received float  │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [Cancel]  [Open Shift]         │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 2: Resuming an Existing Shift (Second Cashier)

**Screen: POS Login / Dashboard**

1. **User logs in to POS app**

   - Frontend calls `GET /pos/shifts/current`
   - Response: `null` (no active shift for this user)

2. **Check if branch has active shift**

   - Frontend calls `GET /pos/shifts/branch/:branchId/current`
   - Response: Shift #45 (opened by another user)

3. **Show "Resume Shift" dialog**

   - Display message: "Branch has an active shift opened by [User Name] at [Time]"
   - Show shift details: Starting Cash, Current Sales, Orders Count
   - Buttons: "Resume This Shift" or "Cancel"

4. **User clicks "Resume This Shift"**

   - Frontend calls `POST /pos/shifts/resume`

   ```json
   {
     "shiftId": 45
   }
   ```

5. **Success response**
   - Store shift ID in local state/context
   - Navigate to POS main screen
   - Display shift info in header with indicator (e.g., "Shift #45 (Resumed) | Started by John D.")

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Active Shift Found                 ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Branch Downtown already has an         │
│  active shift:                          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Shift #45                       │   │
│  │ Opened by: John Doe             │   │
│  │ Started: 8:00 AM (3h 30m ago)   │   │
│  │                                 │   │
│  │ Starting Cash: $100.00          │   │
│  │ Current Sales: $450.00          │   │
│  │ Orders: 15                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [Cancel]  [Resume Shift]       │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 3: Closing a Shift

**Screen: POS Dashboard (with active shift)**

1. **User clicks "Close Shift" button**

   - Show confirmation dialog

2. **Frontend fetches current shift summary**

   - Call `GET /pos/shifts/:id/summary`
   - Display shift statistics:
     - Total Orders
     - Total Sales
     - Cash Sales, Card Sales
     - Expected Cash = Starting Cash + Cash Sales

3. **User counts physical cash and enters amount**

   - Input field: Ending Cash Amount
   - System calculates variance in real-time:
     ```
     Expected: $550.00
     You Counted: $575.50
     Variance: +$25.50 (Over)
     ```
   - Input field (optional): Closing Notes
   - If variance exists, encourage user to add notes explaining why

4. **User clicks "Close Shift"**

   - Frontend calls `POST /pos/shifts/:shiftId/close`

   ```json
   {
     "endingCash": 575.5,
     "closingNotes": "Customer gave tip in cash drawer by mistake"
   }
   ```

5. **Success response**
   - Show shift closure summary screen
   - Display final stats, variance, duration
   - Option to print/export shift report
   - Clear shift from local state
   - Return to login/open shift screen

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Close Shift #45                    ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Shift Summary                          │
│  ┌─────────────────────────────────┐   │
│  │ Started: 8:00 AM                │   │
│  │ Duration: 8h 0m                 │   │
│  │                                 │   │
│  │ Total Orders: 32                │   │
│  │ Total Sales: $700.00            │   │
│  │                                 │   │
│  │ Cash Sales: $450.00             │   │
│  │ Card Sales: $250.00             │   │
│  │                                 │   │
│  │ Starting Cash: $100.00          │   │
│  │ Expected Cash: $550.00          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Count Your Cash Drawer *               │
│  ┌─────────────────────────────────┐   │
│  │ $575.50                         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚠️  Variance: +$25.50 (Over)          │
│                                         │
│  Closing Notes (Optional)              │
│  ┌─────────────────────────────────┐   │
│  │ Customer gave tip in drawer     │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [Cancel]  [Close Shift]        │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 4: Viewing Shift Summary (After Closure)

**Screen: Shift Closure Success**

1. **Display comprehensive shift report**

   - Call `GET /pos/shifts/:id/summary`
   - Show all statistics from response

2. **Report sections:**

   - **Header**: Shift #, Date, Duration, User
   - **Financial Summary**: Sales breakdown, cash reconciliation
   - **Order Statistics**: Total orders, average order value
   - **Payment Breakdown**: Cash, card, online (pie chart)
   - **Hourly Performance**: Revenue by hour (bar chart)
   - **Order List**: All orders processed during shift

3. **Actions:**
   - Print Shift Report
   - Export to PDF/Email
   - Close and return to login

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Shift #45 Summary                      │
│  January 26, 2025 | 8:00 AM - 4:00 PM   │
├─────────────────────────────────────────┤
│                                         │
│  ✅ Shift Closed Successfully            │
│                                         │
│  Financial Summary                      │
│  ┌─────────────────────────────────┐   │
│  │ Total Sales:      $700.00       │   │
│  │ Cash:            $450.00 (64%)  │   │
│  │ Card:            $250.00 (36%)  │   │
│  │ Online:            $0.00 (0%)   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Cash Reconciliation                    │
│  ┌─────────────────────────────────┐   │
│  │ Starting Cash:    $100.00       │   │
│  │ Cash Sales:      +$450.00       │   │
│  │ Expected Cash:    $550.00       │   │
│  │ Actual Cash:      $575.50       │   │
│  │ ⚠️ Variance:      +$25.50       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Performance                            │
│  ┌─────────────────────────────────┐   │
│  │ Orders: 32                      │   │
│  │ Avg Order: $21.88               │   │
│  │ Duration: 8h 0m                 │   │
│  │ Orders/Hour: 4.0                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Print Report] [Export PDF] [Done]    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Common Questions

### Q1: Why can't I create orders without a shift?

**A:** Shifts provide financial accountability. Every order must be tracked within a shift so we know which cashier handled the transaction and can reconcile cash at the end of the shift.

### Q2: What happens if I forget to close my shift?

**A:** The shift remains open indefinitely. Next time you log in, you'll see your active shift and can continue using it or close it. However, it's best practice to close shifts at the end of each work session for accurate reporting.

### Q3: Can two cashiers work on the same shift?

**A:** Yes! The second cashier uses the "Resume Shift" feature to join the existing shift. All orders are tracked under the same shift, but the system records which user created each order.

### Q4: What if my cash drawer count doesn't match?

**A:** This creates a cash variance. You should add closing notes explaining the discrepancy (e.g., "Voided transaction", "Change fund added", "Tip received"). Managers can review variances in reports.

### Q5: Can I reopen a closed shift?

**A:** No. Once closed, a shift is final. You must open a new shift to continue operations.

### Q6: What's the difference between "Open Shift" and "Resume Shift"?

- **Open Shift**: Creates a brand new shift with fresh starting cash (use this when starting your workday)
- **Resume Shift**: Joins an existing active shift opened by someone else (use this for shift handovers)

### Q7: Do online orders (WebApp, Telegram) require a shift?

**A:** No. Only POS orders require an active shift. Online orders have `shiftId: null` because they're not handled by cashiers.

### Q8: What happens to orders if I close the shift before completing them?

**A:** You should complete or cancel all orders before closing a shift. The shift closure calculates totals based on **completed orders** only. Pending orders are not included in shift totals.

### Q9: How is "Expected Cash" calculated?

```
Expected Cash = Starting Cash + Total Cash Sales
```

For example:

- Starting Cash: $100
- Cash Sales during shift: $450
- Expected Cash: $550

This assumes all cash goes into the drawer and nothing is removed (except returns/voids which reduce cash sales).

### Q10: What if I need to remove cash during the shift (bank deposit)?

**A:** Currently, the system doesn't track mid-shift cash removals. Best practice is to note this in the closing notes:

```
"Closing Notes: Deposited $300 to bank at 2pm. Ending cash includes deposit."
```

Future versions may support cash drop tracking.

---

## Frontend Implementation Guide

### 1. **Shift Context Provider**

Create a React context to manage shift state globally:

```typescript
interface ShiftContextType {
  currentShift: ShiftResponseDto | null
  isLoading: boolean
  openShift: (data: OpenShiftDto) => Promise<void>
  resumeShift: (shiftId: number) => Promise<void>
  closeShift: (shiftId: number, data: CloseShiftDto) => Promise<void>
  refreshShift: () => Promise<void>
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined)
```

### 2. **Check Shift on App Launch**

```typescript
useEffect(() => {
  async function checkActiveShift() {
    const shift = await api.get('/pos/shifts/current')
    if (shift) {
      setCurrentShift(shift)
    } else {
      // Check if branch has active shift
      const branchShift = await api.get(
        `/pos/shifts/branch/${branchId}/current`
      )
      if (branchShift) {
        // Show resume shift dialog
        showResumeShiftDialog(branchShift)
      } else {
        // Show open shift dialog
        showOpenShiftDialog()
      }
    }
  }
  checkActiveShift()
}, [])
```

### 3. **Display Shift Info in Header**

```typescript
<Header>
  {currentShift && (
    <ShiftIndicator>
      Shift #{currentShift.id} |
      Started: {formatTime(currentShift.openedAt)} |
      Sales: ${currentShift.totalSales.toFixed(2)}
    </ShiftIndicator>
  )}
</Header>
```

### 4. **Prevent Operations Without Active Shift**

```typescript
function createOrder() {
  if (!currentShift) {
    showAlert('Please open or resume a shift before creating orders')
    return
  }
  // Proceed with order creation
}
```

### 5. **Real-time Cash Variance Calculation**

```typescript
function ClosureDialog({ shift }: { shift: ShiftResponseDto }) {
  const [endingCash, setEndingCash] = useState('');

  const expectedCash = shift.startingCash + shift.totalCashSales;
  const variance = parseFloat(endingCash || '0') - expectedCash;

  return (
    <div>
      <Input
        label="Ending Cash"
        value={endingCash}
        onChange={(e) => setEndingCash(e.target.value)}
        type="number"
      />

      <VarianceDisplay>
        Expected: ${expectedCash.toFixed(2)} |
        You Counted: ${endingCash} |
        Variance: {variance >= 0 ? '+' : ''}{variance.toFixed(2)}
        ({variance > 0 ? 'Over' : variance < 0 ? 'Short' : 'Perfect'})
      </VarianceDisplay>
    </div>
  );
}
```

### 6. **Polling for Shift Updates (Multi-Cashier)**

If multiple cashiers are working on the same shift, poll for updates:

```typescript
useEffect(() => {
  if (!currentShift || currentShift.isClosed) return

  const interval = setInterval(async () => {
    const updated = await api.get(`/pos/shifts/${currentShift.id}`)
    setCurrentShift(updated)
  }, 30000) // Poll every 30 seconds

  return () => clearInterval(interval)
}, [currentShift])
```

---

## Testing Checklist

- [ ] Open shift with valid data
- [ ] Open shift with negative starting cash (should fail)
- [ ] Open shift when user already has active shift (should fail)
- [ ] Open shift when branch already has active shift (should fail)
- [ ] Resume an active shift
- [ ] Resume a closed shift (should fail)
- [ ] Resume shift when user has different active shift (should fail)
- [ ] Close shift with matching cash count (zero variance)
- [ ] Close shift with over variance
- [ ] Close shift with short variance
- [ ] Close shift by different user (should fail unless manager)
- [ ] Close already closed shift (should fail)
- [ ] View shift summary with orders and breakdowns
- [ ] Multi-cashier scenario: two users resuming same shift
- [ ] Shift duration calculation
- [ ] Average order value calculation
- [ ] Hourly breakdown generation

---

## Summary

Shifts are the foundation of POS financial accountability. They track cash flow, provide audit trails, and enable accurate reconciliation. Frontend must:

1. Check for active shift on app launch
2. Prevent order creation without active shift
3. Allow opening new shifts or resuming existing ones
4. Display real-time shift statistics in UI
5. Guide users through closure process with variance calculation
6. Support multi-cashier scenarios via resume functionality

Key business rule: **One active shift per branch at a time, but multiple users can resume it.**
