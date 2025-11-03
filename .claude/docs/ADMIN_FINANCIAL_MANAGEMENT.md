# Admin Financial Management

**Purpose**: This document describes the financial management workflows for the OshLab Admin Panel, including payment sessions, transactions, revenue tracking, and financial reporting.

**Last Updated**: 2025-11-03
**API Version**: v1
**Related Endpoints**: `/admin/finance/*`

---

## Table of Contents

1. [Overview](#overview)
2. [Payment Sessions](#payment-sessions)
3. [Transactions](#transactions)
4. [Financial Reports](#financial-reports)
5. [Dashboard Metrics](#dashboard-metrics)
6. [User Flows](#user-flows)
7. [Error Handling](#error-handling)

---

## Overview

The Financial Management module provides comprehensive tools for tracking revenue, monitoring payment sessions, analyzing transactions, and generating financial reports across all branches.

### Key Concepts

- **Payment Session**: A container for multiple transactions during a shift/period
- **Transaction**: Individual payment record (order payment, refund, etc.)
- **Active Session**: Currently open session accepting transactions
- **Settlement**: End-of-day/shift reconciliation process
- **Revenue Analytics**: Aggregated financial metrics and trends

### Financial Data Hierarchy

```
Tenant
  └── Branches
      └── Payment Sessions (per shift/day)
          └── Transactions (individual payments)
```

---

## Payment Sessions

### What is a Payment Session?

A payment session represents a discrete financial period (typically a shift or day) during which transactions are recorded. Sessions must be opened before accepting payments and closed during settlement.

**Session States**:
- **Active** (`isActive: true`): Currently accepting transactions
- **Closed** (`isActive: false`): Finalized and no longer accepting transactions

### Endpoint: `GET /admin/finance/sessions/active`

**Purpose**: Retrieve all currently active payment sessions across branches.

**Query Parameters**:
- `branchId` (optional): Filter sessions for specific branch

**Response** (array of payment sessions):

```json
[
  {
    "id": 123,
    "branchId": 5,
    "isActive": true,
    "openedAt": "2025-11-03T09:00:00Z",
    "openedBy": 15,
    "closedAt": null,
    "closedBy": null,
    "transactions": [
      {
        "id": 456,
        "amount": 125000,
        "paymentMethod": "CASH",
        "createdAt": "2025-11-03T10:30:00Z"
      }
    ],
    "tenantId": 1,
    "createdAt": "2025-11-03T09:00:00Z"
  }
]
```

**Response Fields**:
- `id` - Session unique identifier
- `branchId` - Branch where session is active
- `isActive` - Whether session is currently open
- `openedAt` - When session was opened
- `openedBy` - User ID who opened session
- `closedAt` - When session was closed (null if active)
- `closedBy` - User ID who closed session (null if active)
- `transactions` - Array of transactions in this session
- `tenantId` - Tenant identifier
- `createdAt` - Record creation timestamp

**Use Cases**:
- Display active sessions dashboard
- Monitor which branches have open sessions
- Track real-time transaction counts per session
- Identify sessions that need to be closed

**UI Recommendations**:
- Card view per active session with branch name
- Show session duration (time since opened)
- Display transaction count and total amount
- "View Details" button to see full transaction list
- Alert if session open for > 24 hours

### Endpoint: `GET /admin/finance/sessions`

**Purpose**: Retrieve paginated list of all payment sessions (active and closed).

**Query Parameters**:
- `branchId` (optional): Filter by branch
- `isActive` (optional): Filter by status (true/false)
- `startDate` (optional): Filter sessions opened after this date
- `endDate` (optional): Filter sessions opened before this date
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Use Cases**:
- View session history
- Generate settlement reports
- Audit past sessions
- Reconcile daily revenue

### Endpoint: `POST /admin/finance/sessions`

**Purpose**: Open a new payment session for a branch.

**Request Body**:

```json
{
  "branchId": 5
}
```

**Response**: Created session object

**Business Rules**:
- Only one active session per branch at a time
- Must have permission to manage finances
- Session automatically includes userId as openedBy

### Endpoint: `PUT /admin/finance/sessions/:id/close`

**Purpose**: Close an active payment session (end-of-shift settlement).

**Response**: Updated session with `closedAt` and `closedBy` set

**Business Rules**:
- Can only close active sessions
- Cannot reopen closed sessions
- All transactions in session are finalized

---

## Transactions

### Endpoint: `GET /admin/finance/transactions`

**Purpose**: Retrieve paginated list of transactions.

**Query Parameters**:
- `branchId` (optional): Filter by branch
- `sessionId` (optional): Filter by payment session
- `paymentMethod` (optional): Filter by method (CASH, CARD, PAYME, etc.)
- `startDate` (optional): Filter transactions after this date
- `endDate` (optional): Filter transactions before this date
- `minAmount` (optional): Minimum transaction amount
- `maxAmount` (optional): Maximum transaction amount
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response**: Paginated transaction list

**Use Cases**:
- View transaction history
- Search for specific payments
- Audit payment records
- Generate financial reports

---

## Financial Reports

### Endpoint: `GET /admin/finance/transactions/summary`

**Purpose**: Get aggregated transaction summary for a date range.

**Query Parameters**:
- `branchId` (optional): Filter by branch
- `startDate` (required): Report start date
- `endDate` (required): Report end date

**Response Structure** (`TransactionSummaryResponseDto`):

```json
{
  "period": {
    "startDate": "2025-11-01",
    "endDate": "2025-11-03"
  },
  "totalTransactions": 1250,
  "totalRevenue": 45750000,
  "totalRefunds": 1250000,
  "netRevenue": 44500000,
  "averageTransaction": 36600,
  "byPaymentMethod": {
    "CASH": 25000000,
    "CARD": 15000000,
    "PAYME": 3500000,
    "CLICK": 1000000
  }
}
```

**Response Fields**:
- `period.startDate` / `period.endDate` - Date range for the report (ISO format)
- `totalTransactions` - Total number of transactions in period
- `totalRevenue` - Gross revenue (sum of all transactions)
- `totalRefunds` - Total amount refunded
- `netRevenue` - Net revenue (totalRevenue - totalRefunds)
- `averageTransaction` - Average transaction value (totalRevenue / totalTransactions)
- `byPaymentMethod` - Revenue breakdown by payment method (method name → amount)

**Use Cases**:
- Daily/weekly/monthly revenue reports
- Compare periods (this month vs last month)
- Identify revenue trends
- Tax reporting preparation

### Endpoint: `GET /admin/finance/payments/summary`

**Purpose**: Get payment method breakdown and summary.

**Query Parameters**:
- `branchId` (optional): Filter by branch
- `startDate` (required): Report start date
- `endDate` (required): Report end date

**Response Structure** (`PaymentSummaryResponseDto`):

```json
{
  "period": {
    "startDate": "2025-11-01",
    "endDate": "2025-11-03"
  },
  "totalPayments": 1250,
  "completedAmount": 44500000,
  "pendingAmount": 500000,
  "failedAmount": 250000,
  "averageAmount": 36000,
  "paymentMethodBreakdown": [
    {
      "method": "CASH",
      "count": 600,
      "amount": 25000000,
      "percentage": 56.18
    },
    {
      "method": "CARD",
      "count": 400,
      "amount": 15000000,
      "percentage": 33.71
    }
  ]
}
```

**Response Fields**:
- `period.startDate` / `period.endDate` - Date range for the report
- `totalPayments` - Total number of payment attempts
- `completedAmount` - Successfully processed payment amount
- `pendingAmount` - Payments still being processed
- `failedAmount` - Failed payment amount
- `averageAmount` - Average payment value (completedAmount / successful payments)
- `paymentMethodBreakdown[]` - Array of payment method statistics:
  - `method` - Payment method name (CASH, CARD, PAYME, etc.)
  - `count` - Number of transactions using this method
  - `amount` - Total amount for this method
  - `percentage` - Percentage of total revenue (calculated)

**Use Cases**:
- Understand payment method preferences
- Calculate digital vs cash revenue split
- Identify failed payment patterns
- Optimize payment gateway costs

### Endpoint: `GET /admin/finance/transactions/hourly-stats`

**Purpose**: Get transaction volume and revenue by hour of day.

**Query Parameters**:
- `branchId` (optional): Filter by branch
- `date` (required): Specific date to analyze

**Response Structure** (`HourlyStatsItemDto[]`):

```json
[
  {
    "hour": 9,
    "transactionCount": 45,
    "totalAmount": 1500000,
    "averageAmount": 33333
  },
  {
    "hour": 10,
    "transactionCount": 67,
    "totalAmount": 2300000,
    "averageAmount": 34328
  }
  // ... hours 0-23
]
```

**Response Fields** (array of 24 items, one per hour):
- `hour` - Hour of day (0-23, where 0 = midnight, 12 = noon, 23 = 11 PM)
- `transactionCount` - Number of transactions in this hour
- `totalAmount` - Total revenue in this hour
- `averageAmount` - Average transaction value in this hour (totalAmount / transactionCount)

**Use Cases**:
- Identify peak business hours
- Staff scheduling optimization
- Promotional timing decisions
- Branch performance analysis

---

## Dashboard Metrics

### Endpoint: `GET /admin/finance/dashboard`

**Purpose**: Get comprehensive financial dashboard with key metrics.

**Query Parameters**:
- `branchId` (optional): Filter by branch
- `period` (optional): 'today', 'week', 'month', 'year' (default: 'today')

**Response** (comprehensive dashboard data):

```json
{
  "period": "today",
  "dateRange": {
    "start": "2025-11-03T00:00:00Z",
    "end": "2025-11-03T23:59:59Z"
  },
  "revenue": {
    "total": 5500000,
    "cash": 3000000,
    "card": 1500000,
    "digital": 1000000
  },
  "transactions": {
    "total": 150,
    "completed": 145,
    "pending": 3,
    "failed": 2
  },
  "averages": {
    "transactionValue": 36667,
    "transactionsPerHour": 6.25
  },
  "activeSessions": 3,
  "topPaymentMethod": "CASH",
  "trends": {
    "revenueChange": "+12.5%",
    "transactionChange": "+8.3%"
  }
}
```

**Use Cases**:
- Home dashboard overview
- Quick financial health check
- Real-time monitoring
- Performance KPIs

**UI Recommendations**:
- Large metric cards for revenue, transactions, averages
- Charts for revenue trends and payment method breakdown
- Period selector (today, week, month, year, custom)
- Branch filter dropdown
- Comparison to previous period

---

## User Flows

### Flow 1: View Active Sessions Dashboard

**User Action**: Navigate to Financial Management → Active Sessions

**Steps**:
1. Call `GET /admin/finance/sessions/active`
2. Display cards for each active session
3. Show branch name, session duration, transaction count, total amount
4. Highlight sessions open > 12 hours (warning indicator)

**UI Layout**:
```
[Branch: Downtown]
  Session #123 | Active for 3h 25m
  Transactions: 45 | Total: 1,250,000 UZS
  [View Details] [Close Session]

[Branch: Airport]
  Session #124 | Active for 1h 10m
  Transactions: 23 | Total: 850,000 UZS
  [View Details] [Close Session]
```

**Interactive Actions**:
- Click "View Details" → Navigate to session detail page
- Click "Close Session" → Confirm dialog → Call `PUT /sessions/:id/close`
- Auto-refresh every 30 seconds to show live updates

### Flow 2: Generate Revenue Report

**User Action**: Navigate to Reports → Revenue Summary → Select date range

**Steps**:
1. User selects date range (e.g., "Last 7 Days")
2. Optional: User selects specific branch
3. Call `GET /admin/finance/transactions/summary?startDate=X&endDate=Y&branchId=Z`
4. Display summary metrics in cards
5. Optional: Call `GET /admin/finance/transactions/hourly-stats` for chart data
6. Render visualizations (bar chart, pie chart, line graph)

**UI Components**:
- Date range picker (presets: Today, Yesterday, Last 7 Days, Last 30 Days, Custom)
- Branch filter dropdown
- Summary cards (Total Revenue, Total Transactions, Average Transaction, Net Profit)
- Payment method pie chart
- Hourly revenue bar chart
- Export buttons (PDF, Excel)

### Flow 3: Monitor Real-Time Transactions

**User Action**: View live transaction feed during business hours

**Steps**:
1. Call `GET /admin/finance/sessions/active` to get active sessions
2. For each session, call `GET /admin/finance/transactions?sessionId=X&limit=10`
3. Display most recent transactions in chronological feed
4. Poll for updates every 10-15 seconds or use WebSocket

**UI Recommendations**:
- Transaction feed with auto-scroll
- Transaction cards showing: timestamp, amount, payment method, order ID
- Color coding by payment method (green=CASH, blue=CARD, purple=digital)
- Sound notification for new transactions (optional, toggle-able)
- Filter by payment method

### Flow 4: Close Payment Session (End of Shift)

**User Action**: Manager closes session at end of shift

**Steps**:
1. Navigate to Active Sessions
2. Click "Close Session" for target session
3. Display confirmation dialog with session summary:
   - Total transactions: 125
   - Total revenue: 4,500,000 UZS
   - Payment breakdown: CASH (60%), CARD (30%), Digital (10%)
4. User confirms closure
5. Call `PUT /admin/finance/sessions/:id/close`
6. Show success message: "Session closed successfully. Settlement report generated."
7. Optional: Download/view settlement report

**Settlement Report Contents**:
- Session details (open time, close time, duration, operator)
- Transaction summary (count, total amount)
- Payment method breakdown
- Expected cash amount (for cash register reconciliation)
- Discrepancy tracking (if implemented)

### Flow 5: Analyze Peak Hours

**User Action**: Understand busiest times to optimize staffing

**Steps**:
1. Navigate to Analytics → Hourly Performance
2. Select date (default: yesterday for complete data)
3. Optional: Select branch
4. Call `GET /admin/finance/transactions/hourly-stats?date=2025-11-02&branchId=5`
5. Display bar chart with transaction count per hour
6. Show total revenue per hour as overlay line
7. Highlight peak hours (top 3 hours by transaction count)

**Insights Display**:
- "Peak Hour: 7 PM (67 transactions, 2,300,000 UZS)"
- "Slowest Hour: 3 AM (2 transactions, 50,000 UZS)"
- "Average transactions per hour: 35"
- Recommendations: "Consider additional staff between 6 PM - 9 PM"

---

## Error Handling

### Common Error Scenarios

**1. Session Already Active (400 Bad Request)**

When trying to open a new session while one is already active for the branch:

```json
{
  "statusCode": 400,
  "message": "Branch already has an active payment session",
  "error": "Bad Request",
  "activeSessionId": 123
}
```

**User Guidance**: "This branch already has an active session. Please close the existing session before opening a new one. [Close Existing Session]"

**2. Session Not Found (404 Not Found)**

When trying to access or close a non-existent session:

```json
{
  "statusCode": 404,
  "message": "Payment session with ID 999 not found",
  "error": "Not Found"
}
```

**User Guidance**: "Session not found. It may have been already closed or deleted."

**3. Cannot Close Inactive Session (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "Cannot close session that is not active",
  "error": "Bad Request"
}
```

**User Guidance**: "This session is already closed."

**4. Invalid Date Range (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "End date must be after start date",
  "error": "Bad Request"
}
```

**User Guidance**: "Please select a valid date range. End date must be after start date."

**5. Branch Access Denied (403 Forbidden)**

```json
{
  "statusCode": 403,
  "message": "You don't have access to this branch",
  "error": "Forbidden"
}
```

**User Guidance**: "Access denied. You don't have permission to view this branch's financial data."

### Error Handling Best Practices

1. **Optimistic UI Updates**: For session closures, update UI immediately and revert if API fails
2. **Auto-Retry**: For dashboard metrics, retry failed requests silently (max 3 attempts)
3. **Graceful Degradation**: If hourly stats fail, show summary data only
4. **Clear Error Messages**: Translate technical errors to user-friendly language
5. **Action Buttons**: Provide "Close Existing Session" buttons in error messages where applicable

---

## Security and Permissions

### Required Permissions

**Recommended Permission Structure**:
- `finance.view` - View financial data (read-only)
- `finance.sessions.manage` - Open/close payment sessions
- `finance.reports.generate` - Access detailed financial reports
- `finance.transactions.view` - View transaction details
- `finance.all` - Full financial management access

**Role Recommendations**:
- **Owner/Admin**: All finance permissions
- **Manager**: View + manage sessions + generate reports
- **Accountant**: View + generate reports (no session management)
- **Cashier**: Open/close own sessions only
- **Staff**: No financial access

### Data Privacy

- **Tenant Isolation**: All endpoints automatically filter by tenant
- **Branch Filtering**: Respect user's branch access restrictions
- **Audit Logging**: All financial operations logged (who, what, when)
- **Sensitive Data**: Transaction details don't include customer PII unless necessary

---

## Performance Considerations

### Large Dataset Handling

**Pagination**:
- Always paginate transaction lists (default: 20 items)
- Increase limit carefully (max: 100 items per page)
- Use cursor-based pagination for exports

**Date Range Limits**:
- Dashboard metrics: Maximum 1 year range
- Hourly stats: Single day only (24 data points)
- Transaction lists: Maximum 90 days without pagination

**Caching**:
- Cache completed session summaries (immutable once closed)
- Cache yesterday's hourly stats (won't change)
- Do NOT cache active session data (real-time required)

### Real-Time Updates

**Polling Intervals**:
- Active sessions: Poll every 30 seconds
- Transaction feed: Poll every 10-15 seconds
- Dashboard metrics: Poll every 60 seconds

**WebSocket Alternative** (future enhancement):
- Subscribe to `finance.transactions.new` event
- Subscribe to `finance.sessions.updated` event
- Real-time push instead of polling

---

## API Endpoint Summary

| Method | Endpoint | Purpose | Pagination |
|--------|----------|---------|------------|
| `GET` | `/admin/finance/sessions/active` | Get active sessions | ❌ |
| `GET` | `/admin/finance/sessions` | List all sessions | ✅ |
| `POST` | `/admin/finance/sessions` | Open new session | ❌ |
| `PUT` | `/admin/finance/sessions/:id/close` | Close session | ❌ |
| `GET` | `/admin/finance/transactions` | List transactions | ✅ |
| `GET` | `/admin/finance/transactions/summary` | Transaction summary report | ❌ |
| `GET` | `/admin/finance/payments/summary` | Payment method summary | ❌ |
| `GET` | `/admin/finance/transactions/hourly-stats` | Hourly analytics | ❌ |
| `GET` | `/admin/finance/dashboard` | Dashboard metrics | ❌ |

---

## Changelog

### 2025-11-03 - Task 9.1 Implementation
- ✅ Implemented `getAllActiveSessions()` in PaymentSessionService
- ✅ Updated `GET /admin/finance/sessions/active` to return real data
- ✅ Removed TODO comment and empty array fallback
- ✅ Added branchId filtering support
- ✅ Enhanced Swagger documentation

### 2025-11-03 - Task 9.2 Implementation
- ✅ Added `TransactionSummaryResponseDto` with all financial summary fields
- ✅ Added `PaymentSummaryResponseDto` with payment method breakdown
- ✅ Added `HourlyStatsItemDto` for hourly analytics
- ✅ Updated all summary endpoints with typed responses
- ✅ Enhanced Swagger documentation for financial reports

### 2025-11-03 - Task 9.3 Implementation
- ✅ Created payment method categories in domain layer
- ✅ Added `PaymentMethodService.getPaymentMethodCategories()` method
- ✅ Made dashboard calculation dynamic (no hardcoded methods)
- ✅ New payment methods automatically included in calculations
- ✅ Categories: cash (CASH), card (CARD, CREDIT_CARD, DEBIT_CARD), digital (PAYME, CLICK, UZUM, PAYNET)

**Note for Frontend**: Payment method categories are now centralized. The dashboard automatically categorizes payment methods as cash, card, or digital based on domain configuration.

---

## Support and Questions

For questions about financial management implementation:
1. Review API endpoint Swagger documentation at `/api/docs`
2. Check response schemas in this document
3. Contact backend team for clarification on business rules

---

**Document Version**: 1.0
**Task Reference**: Phase 9, Task 9.1
**Related Files**: `src/applications/admin-api/controllers/admin-finance.controller.ts`
