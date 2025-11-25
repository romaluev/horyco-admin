# Admin Panel — PIN Management

**Complete guide to employee PIN generation, management, and security**

**Version:** 1.0
**Last Updated:** 2025-11-24
**Related Modules:** Staff Management, Authentication

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Business Logic](#business-logic)
3. [Core Concepts](#core-concepts)
4. [PIN Workflows](#pin-workflows)
5. [UI/UX Implementation Guide](#uiux-implementation-guide)
6. [API Endpoints](#api-endpoints)
7. [Security & Rate Limiting](#security--rate-limiting)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

---

## Overview

### Purpose

PIN management allows managers and administrators to:

- ✅ Generate secure 4-digit PINs for fast POS authentication
- ✅ View PIN status and expiration dates
- ✅ Regenerate expired or compromised PINs
- ✅ Track PIN usage and failed attempts
- ✅ Enable/disable PIN authentication per employee

### Why PINs?

**PINs provide fast, secure access for POS operations:**

- 🚀 **Speed**: 4-digit PIN faster than phone + password
- 🔐 **Security**: Hashed with bcrypt, 30-day expiration
- 🎯 **Convenience**: No need to remember complex passwords for daily shifts
- 📊 **Auditability**: Track who generated/used PINs

### Multi-Tenant Architecture

**Important**: PIN management respects tenant isolation:

- Every PIN belongs to a specific tenant (restaurant brand)
- Managers can only manage PINs for employees within their tenant
- PIN attempts are tracked per tenant automatically
- Backend enforces tenant context via `AsyncLocalStorage`

---

## Business Logic

### PIN Lifecycle

```
1. Employee Created (no PIN)
   ↓
2. Manager/Admin Generates PIN
   ↓
3. PIN Shown ONCE to Manager
   ↓
4. Manager Shares PIN with Employee (manual, phone call, SMS, etc.)
   ↓
5. Employee Uses PIN for POS Login
   ↓
6. PIN Valid for 30 Days
   ↓
7. PIN Expires or Compromised
   ↓
8. Manager Regenerates PIN (returns to step 2)
```

### PIN Security Model

**Key Principles:**

- **One-Time Display**: PIN shown only once after generation (security best practice)
- **Hashed Storage**: Never stored in plain text (bcrypt with 10 salt rounds)
- **Time-Limited**: 30-day expiration (configurable via business rules)
- **Rate Limited**: 3 failed attempts per 15 minutes (prevents brute force)
- **Tenant Isolated**: Employees can only use PINs within their tenant

---

## Core Concepts

### 1. PIN Generation

**Who Can Generate PINs?**

- ✅ Admin users (all employees)
- ✅ Managers (employees within their branches)
- ❌ Cashiers/Waiters cannot generate PINs

**When to Generate?**

- After creating a new employee
- When employee loses/forgets their PIN
- When PIN is compromised (security incident)
- When PIN expires (30 days)

**What Happens During Generation?**

1. System generates random 4-digit PIN (1000-9999)
2. PIN hashed with bcrypt (10 salt rounds)
3. Expiration date set (30 days from now)
4. PIN returned **once** in API response
5. **Manager must immediately share with employee**

### 2. PIN Status

**3 PIN States:**

| Status      | Description                            | Actions Available                |
| ----------- | -------------------------------------- | -------------------------------- |
| **No PIN**  | Employee never had PIN or PIN disabled | Generate PIN                     |
| **Active**  | PIN exists and not expired             | View Status, Regenerate, Disable |
| **Expired** | PIN expiration date passed             | Regenerate PIN                   |

**How to Check Status:**

```http
GET /auth/pin-status/:employeeId

Response:
{
  "hasPin": true,
  "pinEnabled": true,
  "isExpired": false,
  "expiresAt": "2025-12-24T10:30:00Z",
  "daysUntilExpiration": 15
}
```

### 3. PIN vs Password

**When to Use Each:**

| Scenario                       | Use PIN | Use Password |
| ------------------------------ | ------- | ------------ |
| POS Login (fast shifts)        | ✅ Yes  | ❌ No        |
| Admin Panel Login              | ❌ No   | ✅ Yes       |
| First-time Setup               | ❌ No   | ✅ Yes       |
| Sensitive Operations (refunds) | ❌ No   | ✅ Yes       |

**Why Both?**

- **PIN**: Fast, daily operations (taking orders, processing payments)
- **Password**: Secure, administrative tasks (changing settings, viewing reports)

### 4. Rate Limiting

**Protection Against Brute Force:**

- **3 failed attempts** allowed within 15-minute window
- After 3 failures → **15-minute lockout**
- Tracked by: IP address, User-Agent, Employee ID
- Counter resets after successful login

**Example Timeline:**

```
10:00 AM - Attempt 1: Wrong PIN (2 attempts left)
10:02 AM - Attempt 2: Wrong PIN (1 attempt left)
10:05 AM - Attempt 3: Wrong PIN (LOCKED OUT)
10:06 AM - Attempt 4: Blocked (HTTP 429)
10:20 AM - Lockout expires, can try again
```

---

## PIN Workflows

### Workflow 1: Generate PIN for New Employee

**Scenario:** Manager creates new cashier and needs to set up PIN for POS access.

**Step-by-Step Flow:**

```
Step 1: Create Employee
   ↓
   POST /admin/staff/employees
   {
     "fullName": "John Doe",
     "phone": "+998901234567",
     "password": "SecurePassword123",
     "roleIds": [3],        // Cashier
     "branchIds": [10]
   }
   ↓
   Response: { "id": 123, ... }

Step 2: Generate PIN Immediately After Creation
   ↓
   POST /auth/generate-pin
   {
     "employeeId": 123
   }
   ↓
   Response: {
     "pin": "5847",  ← SHOWN ONLY ONCE
     "expiresAt": "2025-12-24T10:30:00Z",
     "message": "PIN generated successfully. Save this PIN securely."
   }

Step 3: Manager Shares PIN with Employee
   ↓
   Options:
   - 📱 SMS (future feature, not yet implemented)
   - 📞 Phone call
   - 💬 In-person
   - 📧 Encrypted email

Step 4: Employee Logs into POS
   ↓
   POST /auth/pin-login
   {
     "employeeId": 123,
     "pin": "5847"
   }
   ↓
   Success! Employee can start shift
```

**UI Mockup:**

```
┌─────────────────────────────────────────────────┐
│  Employee Created Successfully                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✅ John Doe has been added to your team       │
│                                                 │
│  📍 Branch: Downtown                            │
│  👔 Role: Cashier                               │
│  📞 Phone: +998 90 123 45 67                    │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │                                       │    │
│  │  🔐 Generate PIN for POS Access?     │    │
│  │                                       │    │
│  │  This will create a 4-digit PIN for  │    │
│  │  fast login at the POS system.       │    │
│  │                                       │    │
│  │  [Skip for Now]  [Generate PIN] ←    │    │
│  │                                       │    │
│  └───────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

**After Generating PIN:**

```
┌─────────────────────────────────────────────────┐
│  🎉 PIN Generated Successfully                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Employee: John Doe                             │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │                                       │    │
│  │        PIN:  5 8 4 7                  │    │
│  │                                       │    │
│  │  ⚠️ SAVE THIS PIN NOW                 │    │
│  │  It will not be shown again.          │    │
│  │                                       │    │
│  │  Valid until: Dec 24, 2025            │    │
│  │                                       │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  📋 [Copy PIN]  📱 [Send SMS] (future)         │
│                                                 │
│  [I've Saved the PIN]                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Workflow 2: Regenerate Expired PIN

**Scenario:** Employee's PIN expired after 30 days, needs new one.

**Step-by-Step Flow:**

```
Step 1: Manager Checks PIN Status
   ↓
   GET /auth/pin-status/123
   ↓
   Response: {
     "hasPin": true,
     "pinEnabled": true,
     "isExpired": true,  ← Expired!
     "expiresAt": "2025-10-24T10:30:00Z"
   }

Step 2: Manager Regenerates PIN
   ↓
   POST /auth/generate-pin
   {
     "employeeId": 123
   }
   ↓
   Response: {
     "pin": "9234",  ← New PIN
     "expiresAt": "2025-12-24T10:30:00Z",
     "message": "PIN regenerated successfully"
   }

Step 3: Manager Shares New PIN
   ↓
   (Same as Workflow 1, Step 3)

Step 4: Employee Uses New PIN
   ↓
   Old PIN no longer works
   New PIN valid for 30 days
```

**UI Mockup:**

```
┌─────────────────────────────────────────────────┐
│  Employee Details - John Doe                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  PIN Status                                     │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │  ⚠️ PIN Expired                       │    │
│  │                                       │    │
│  │  Expired on: Oct 24, 2025            │    │
│  │                                       │    │
│  │  Employee cannot login to POS until   │    │
│  │  a new PIN is generated.              │    │
│  │                                       │    │
│  │  [Regenerate PIN]                     │    │
│  │                                       │    │
│  └───────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Workflow 3: Disable/Enable PIN Authentication

**Scenario:** Temporarily disable PIN for an employee (e.g., security concern).

**Step-by-Step Flow:**

```
Step 1: Manager Disables PIN
   ↓
   PATCH /admin/staff/employees/123
   {
     "pinEnabled": false
   }
   ↓
   Response: { "pinEnabled": false }

Step 2: Employee Cannot Login with PIN
   ↓
   POST /auth/pin-login
   {
     "employeeId": 123,
     "pin": "5847"
   }
   ↓
   Response: 400 Bad Request
   "PIN authentication is disabled for this employee"

Step 3: Manager Re-enables PIN (when safe)
   ↓
   PATCH /admin/staff/employees/123
   {
     "pinEnabled": true
   }
   ↓
   Employee can use PIN again
```

**UI Mockup:**

```
┌─────────────────────────────────────────────────┐
│  Employee Details - John Doe                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  PIN Authentication                             │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │  Status: ● Active                     │    │
│  │  Expires: Nov 30, 2025                │    │
│  │  Days remaining: 6                    │    │
│  │                                       │    │
│  │  ☑ Enable PIN Authentication          │    │
│  │                                       │    │
│  │  [Regenerate PIN]  [View History]     │    │
│  │                                       │    │
│  └───────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Workflow 4: Handle Rate Limit Lockout

**Scenario:** Employee forgot PIN, tried 3 times, got locked out.

**What Happened:**

```
Attempt 1: Wrong PIN → "Invalid PIN (2 attempts remaining)"
Attempt 2: Wrong PIN → "Invalid PIN (1 attempt remaining)"
Attempt 3: Wrong PIN → "Too many failed attempts. Try again in 15 minutes."
Attempt 4: Locked Out → HTTP 429 "Too many requests"
```

**Manager Actions:**

```
Option 1: Wait 15 Minutes
   ↓
   Lockout automatically expires
   Employee can try again

Option 2: Regenerate PIN Immediately
   ↓
   POST /auth/generate-pin
   {
     "employeeId": 123
   }
   ↓
   New PIN bypasses lockout
   Old attempts reset
```

**UI Mockup (POS Login Screen):**

```
┌─────────────────────────────────────────────────┐
│  🔒 Account Temporarily Locked                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Too many failed PIN attempts.                  │
│                                                 │
│  You can try again in: 12 minutes              │
│                                                 │
│  ───────────────────────────────────────       │
│                                                 │
│  Need help?                                     │
│  • Contact your manager to reset PIN           │
│  • Use password login instead                  │
│                                                 │
│  [Use Password Instead]                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## UI/UX Implementation Guide

### 1. PIN Generation Dialog

**When to Show:**

- Immediately after creating new employee (optional prompt)
- From employee detail page (action button)
- From employee list (quick action)

**Design Pattern: Modal Dialog**

```
┌─────────────────────────────────────────────────┐
│  Generate PIN for John Doe              [×]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  This will create a 4-digit PIN for fast       │
│  authentication at the POS system.              │
│                                                 │
│  ⚠️ Important:                                  │
│  • PIN will be shown only once                 │
│  • Copy it immediately and share securely      │
│  • Valid for 30 days                           │
│                                                 │
│  [Cancel]              [Generate PIN] ←        │
│                                                 │
└─────────────────────────────────────────────────┘
```

**After Generation:**

```
┌─────────────────────────────────────────────────┐
│  PIN Generated Successfully             [×]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Employee: John Doe                             │
│  Phone: +998 90 123 45 67                      │
│                                                 │
│  ┌─────────────────────────────────┐          │
│  │                                 │          │
│  │    PIN:  ████  5 8 4 7         │          │
│  │                                 │          │
│  │    [👁 Show]  [📋 Copy]         │          │
│  │                                 │          │
│  └─────────────────────────────────┘          │
│                                                 │
│  Valid until: December 24, 2025                │
│                                                 │
│  ⚠️ This PIN will not be shown again.          │
│  Please save it securely.                       │
│                                                 │
│  ─────────────────────────────────────         │
│                                                 │
│  How to share with employee:                   │
│  • 📱 Send via SMS (coming soon)               │
│  • 📞 Tell them over phone                     │
│  • 💬 Share in person                          │
│                                                 │
│  ☑ I have securely shared this PIN            │
│                                                 │
│  [Close]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Implementation Notes:**

- Default PIN to masked (e.g., `• • • •`)
- Require clicking "Show" or "Copy" to reveal
- Show warning before closing without confirming
- Log who generated PIN and when (audit trail)

---

### 2. Employee List - PIN Status Indicators

**Show PIN Status at a Glance:**

```
┌─────────────────────────────────────────────────────────┐
│  Employees (12)                      [+ Add Employee]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │ 📷 John Doe                                   │    │
│  │    Cashier · Branch A                         │    │
│  │    +998 90 123 45 67                          │    │
│  │                                               │    │
│  │    PIN: ✅ Active (expires in 15 days)        │    │
│  │                                               │    │
│  │    [Edit] [View Details] [Regenerate PIN]    │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │ 📷 Jane Smith                                 │    │
│  │    Manager · Branch A, Branch B               │    │
│  │    +998 90 987 65 43                          │    │
│  │                                               │    │
│  │    PIN: ⚠️ Expired                            │    │
│  │                                               │    │
│  │    [Edit] [View Details] [Regenerate PIN]    │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │ 📷 Bob Wilson                                 │    │
│  │    Waiter · Branch A                          │    │
│  │    +998 90 555 55 55                          │    │
│  │                                               │    │
│  │    PIN: ❌ Not Set                            │    │
│  │                                               │    │
│  │    [Edit] [View Details] [Generate PIN]      │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Status Colors:**

- ✅ Green: Active, >7 days until expiration
- 🟡 Yellow: Active, <7 days until expiration (warning)
- ⚠️ Orange: Expired (action needed)
- ❌ Red: Not set or disabled

---

### 3. Employee Detail Page - PIN Section

```
┌─────────────────────────────────────────────────────┐
│  Employee: John Doe                                 │
│  ───────────────────────────────────────────────   │
│                                                     │
│  🔐 PIN Authentication                              │
│                                                     │
│  ┌─────────────────────────────────────────┐      │
│  │  Status: ● Active                       │      │
│  │                                         │      │
│  │  Created: Nov 20, 2025                  │      │
│  │  Expires: Dec 20, 2025                  │      │
│  │  Days remaining: 15                     │      │
│  │                                         │      │
│  │  ☑ Enable PIN Authentication            │      │
│  │                                         │      │
│  │  ─────────────────────────────────      │      │
│  │                                         │      │
│  │  Recent Activity:                       │      │
│  │  • Last used: Today at 9:30 AM          │      │
│  │  • Failed attempts: 0                   │      │
│  │                                         │      │
│  │  [Regenerate PIN]  [View Full History]  │      │
│  │                                         │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 4. Expiration Warning (Proactive)

**Show Warning When PIN Expires Soon:**

```
┌─────────────────────────────────────────────────┐
│  ⚠️ PIN Expiring Soon                           │
├─────────────────────────────────────────────────┤
│                                                 │
│  John Doe's PIN will expire in 3 days          │
│  (Dec 20, 2025)                                │
│                                                 │
│  Employee will not be able to login to POS     │
│  after expiration.                              │
│                                                 │
│  [Remind Me Later]  [Regenerate Now]           │
│                                                 │
└─────────────────────────────────────────────────┘
```

**When to Show:**

- Dashboard widget (PINs expiring in next 7 days)
- Employee detail page (banner at top)
- Before starting shift (POS login screen)

---

## API Endpoints

### Base URL

All PIN endpoints are under `/auth` (not `/admin`):

```
POST   /auth/generate-pin
POST   /auth/refresh-pin
GET    /auth/pin-status/:employeeId
POST   /auth/pin-login
```

**Authentication**: All endpoints require `Authorization: Bearer {token}` except `/auth/pin-login`

---

### 1. Generate PIN

**Endpoint**: `POST /auth/generate-pin`

**Who Can Use:**

- ✅ Admin users (any employee)
- ✅ Managers (employees in their branches)
- ❌ Regular employees cannot generate PINs for others

**Request**:

```http
POST /auth/generate-pin
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "employeeId": 123
}
```

**Response (Success)**:

```json
{
  "pin": "5847",
  "expiresAt": "2025-12-24T10:30:00.000Z",
  "message": "PIN generated successfully. Please save this PIN securely as it will not be shown again."
}
```

**Important Notes:**

- ⚠️ PIN shown **only once** in this response
- Backend immediately hashes PIN after generation
- If employee already has active PIN, it will be replaced
- Old PIN becomes invalid immediately

**Response (Error - Forbidden)**:

```json
{
  "statusCode": 403,
  "message": "You do not have permission to generate PIN for this employee",
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**Response (Error - Rate Limited)**:

```json
{
  "statusCode": 429,
  "message": "Too many PIN generation requests. Please try again in 5 minutes.",
  "timestamp": "2025-11-24T10:00:00Z"
}
```

---

### 2. Refresh Own PIN

**Endpoint**: `POST /auth/refresh-pin`

**Who Can Use:**

- ✅ Any authenticated employee (for their own PIN)
- Use case: Employee lost PIN, wants to reset

**Request**:

```http
POST /auth/refresh-pin
Authorization: Bearer {employee_token}
Content-Type: application/json

{
  "currentPassword": "SecurePassword123"
}
```

**Why Require Password?**

- Security: Prevents unauthorized PIN reset if device left unlocked
- Proof of identity: Ensures employee is legitimate owner

**Response (Success)**:

```json
{
  "pin": "9234",
  "expiresAt": "2025-12-24T10:30:00.000Z",
  "message": "PIN refreshed successfully. Save this PIN securely."
}
```

**Response (Error - Invalid Password)**:

```json
{
  "statusCode": 401,
  "message": "Current password is incorrect",
  "timestamp": "2025-11-24T10:00:00Z"
}
```

---

### 3. Get PIN Status

**Endpoint**: `GET /auth/pin-status/:employeeId`

**Who Can Use:**

- ✅ Admin/Manager (any employee)
- ✅ Employee (their own status only)
- Note: Rate limited to prevent enumeration attacks

**Request**:

```http
GET /auth/pin-status/123
Authorization: Bearer {token}
```

**Response (Has Active PIN)**:

```json
{
  "employeeId": 123,
  "hasPin": true,
  "pinEnabled": true,
  "isExpired": false,
  "expiresAt": "2025-12-24T10:30:00.000Z",
  "daysUntilExpiration": 15,
  "lastUsedAt": "2025-11-24T09:30:00.000Z",
  "failedAttempts": 0
}
```

**Response (Expired PIN)**:

```json
{
  "employeeId": 123,
  "hasPin": true,
  "pinEnabled": true,
  "isExpired": true,
  "expiresAt": "2025-10-24T10:30:00.000Z",
  "daysUntilExpiration": -30,
  "lastUsedAt": "2025-10-20T14:00:00.000Z",
  "failedAttempts": 0
}
```

**Response (No PIN)**:

```json
{
  "employeeId": 123,
  "hasPin": false,
  "pinEnabled": false,
  "isExpired": false,
  "expiresAt": null,
  "daysUntilExpiration": null,
  "lastUsedAt": null,
  "failedAttempts": 0
}
```

**Response (PIN Disabled)**:

```json
{
  "employeeId": 123,
  "hasPin": true,
  "pinEnabled": false,
  "isExpired": false,
  "expiresAt": "2025-12-24T10:30:00.000Z",
  "daysUntilExpiration": 15,
  "lastUsedAt": "2025-11-20T09:00:00.000Z",
  "failedAttempts": 0
}
```

---

### 4. PIN Login (POS)

**Endpoint**: `POST /auth/pin-login`

**Who Can Use:**

- ✅ Anyone (unauthenticated endpoint)
- Used by POS devices for fast login

**Request**:

```http
POST /auth/pin-login
Content-Type: application/json

{
  "employeeId": 123,
  "pin": "5847"
}
```

**Response (Success)**:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id": 123,
    "fullName": "John Doe",
    "phone": "+998901234567",
    "tenantId": 1,
    "roles": ["Cashier"],
    "permissions": ["orders.create", "orders.view", "payments.*"],
    "activeBranchId": 10
  }
}
```

**Response (Error - Invalid PIN)**:

```json
{
  "statusCode": 401,
  "message": "Invalid PIN. 2 attempts remaining.",
  "attemptsRemaining": 2,
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**Response (Error - PIN Expired)**:

```json
{
  "statusCode": 401,
  "message": "PIN has expired. Please contact your manager to generate a new PIN.",
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**Response (Error - PIN Disabled)**:

```json
{
  "statusCode": 400,
  "message": "PIN authentication is disabled for this employee. Please use password login.",
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**Response (Error - Rate Limited)**:

```json
{
  "statusCode": 429,
  "message": "Too many failed attempts. Please try again in 12 minutes.",
  "retryAfter": 720,
  "timestamp": "2025-11-24T10:00:00Z"
}
```

---

### 5. Enable/Disable PIN

**Endpoint**: `PATCH /admin/staff/employees/:id`

**Request**:

```http
PATCH /admin/staff/employees/123
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "pinEnabled": false
}
```

**Response**:

```json
{
  "id": 123,
  "fullName": "John Doe",
  "pinEnabled": false,
  "pin": "$2b$10$...", // Hashed, not visible
  "pinExpiresAt": "2025-12-24T10:30:00.000Z"
}
```

---

## Security & Rate Limiting

### Rate Limiting Rules

#### PIN Login Attempts

- **Limit**: 3 failed attempts per 15 minutes
- **Scope**: Per employee + IP address + User-Agent
- **Lockout**: 15 minutes after 3rd failure
- **Reset**: After successful login or 15 minutes pass

**Tracking Mechanism:**

```typescript
// Backend tracks attempts in database
PinAttempt {
  id: number
  employeeId: number
  tenantId: number
  ipAddress: string       // e.g., "192.168.1.100"
  userAgent: string       // e.g., "Mozilla/5.0..."
  success: boolean        // true = login succeeded, false = failed
  attemptedAt: Date
}

// Query to check rate limit:
SELECT COUNT(*) FROM pin_attempts
WHERE employeeId = 123
  AND tenantId = 1
  AND ipAddress = '192.168.1.100'
  AND success = false
  AND attemptedAt > NOW() - INTERVAL '15 minutes'

// If count >= 3 → Block with HTTP 429
```

#### PIN Generation Requests

- **Limit**: 10 generations per hour (per manager)
- **Purpose**: Prevent abuse (regenerating PINs repeatedly)
- **Scope**: Per admin/manager user

#### PIN Status Checks

- **Limit**: 100 requests per hour (per user)
- **Purpose**: Prevent enumeration attacks
- **Scope**: Per user

### Security Best Practices

**Backend Enforcements:**
✅ PIN hashed with bcrypt (10 salt rounds)
✅ PIN never stored in plain text
✅ PIN shown only once after generation
✅ Expired PINs rejected automatically
✅ Disabled PINs rejected automatically
✅ Tenant isolation enforced (cannot use PIN from another tenant)
✅ Rate limiting prevents brute force
✅ Audit trail logs all PIN operations

**Frontend Best Practices:**
✅ Mask PIN by default (show on click)
✅ Warn before closing PIN dialog (unsaved PIN)
✅ Copy to clipboard with auto-clear (30 seconds)
✅ Show expiration warnings (7 days before)
✅ Display rate limit errors clearly
✅ Log who generated/viewed PIN (audit)

---

## Error Handling

### Common Errors

| Status  | Error                       | Cause                            | Solution                              |
| ------- | --------------------------- | -------------------------------- | ------------------------------------- |
| **400** | PIN authentication disabled | Employee has `pinEnabled: false` | Enable PIN via employee settings      |
| **401** | Invalid PIN                 | Wrong PIN entered                | Check PIN and retry (2 attempts left) |
| **401** | PIN expired                 | PIN older than 30 days           | Regenerate PIN via admin panel        |
| **403** | Permission denied           | User lacks admin/manager role    | Login as manager or admin             |
| **404** | Employee not found          | Invalid employee ID              | Verify employee exists                |
| **429** | Too many attempts           | Rate limit exceeded (3 failures) | Wait 15 minutes or regenerate PIN     |

### Error Response Format

```json
{
  "statusCode": 429,
  "message": "Too many failed PIN attempts. Try again in 12 minutes.",
  "error": "Too Many Requests",
  "retryAfter": 720,
  "attemptsRemaining": 0,
  "timestamp": "2025-11-24T10:00:00Z",
  "path": "/auth/pin-login"
}
```

### User-Friendly Error Messages

**Display to End Users:**

| Backend Error      | User-Friendly Message                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| Invalid PIN        | "Incorrect PIN. You have 2 attempts remaining."                                |
| PIN expired        | "Your PIN has expired. Please ask your manager for a new one."                 |
| PIN disabled       | "PIN login is currently disabled. Please use your password instead."           |
| Rate limited       | "Too many incorrect attempts. Please wait 12 minutes or contact your manager." |
| Employee not found | "Employee not found. Please check your Employee ID."                           |

---

## Best Practices

### For Admin Panel Developers

✅ **DO:**

- Show PIN immediately after generation in modal/dialog
- Mask PIN by default, reveal on explicit user action (click "Show")
- Warn user before closing PIN dialog ("Did you save the PIN?")
- Provide "Copy to Clipboard" functionality
- Show expiration date and days remaining prominently
- Display warning when PIN expires in <7 days
- Log all PIN operations (who generated, when, for whom)
- Cache PIN status to reduce API calls (with 5-minute TTL)

❌ **DON'T:**

- Don't store PIN in frontend state/localStorage (security risk)
- Don't auto-close PIN dialog (user might not have saved it)
- Don't allow PIN regeneration without confirmation
- Don't show raw employee passwords alongside PINs
- Don't skip rate limit error handling

### For POS Developers

✅ **DO:**

- Implement numeric keypad for PIN entry (faster than keyboard)
- Show remaining attempts after failed login
- Display lockout timer clearly ("Try again in 12 minutes")
- Provide "Use Password Instead" fallback option
- Clear PIN input after failed attempt (security)
- Vibrate/beep on failed attempt (tactile feedback)

❌ **DON'T:**

- Don't show PIN in plain text on screen (shoulder surfing risk)
- Don't cache employee PINs locally (security violation)
- Don't allow unlimited retry attempts (bypass rate limiting)

### For Managers

✅ **DO:**

- Generate PINs immediately after creating employees
- Share PINs securely (phone call, SMS, in-person)
- Regenerate PINs regularly (every 30 days automatic)
- Monitor failed PIN attempts (potential security issue)
- Disable PINs for inactive employees

❌ **DON'T:**

- Don't share PINs via email or public chat (insecure)
- Don't write PINs on paper left in public areas
- Don't reuse the same PIN across multiple employees
- Don't ignore expiration warnings

---

## Future Enhancements (Not Yet Implemented)

### 1. SMS Notification for PINs

**Planned Feature:**

- Automatically send PIN via SMS after generation
- Include expiration date in message
- Resend PIN on request (rate limited)

**API Design (Future)**:

```http
POST /auth/generate-pin
{
  "employeeId": 123,
  "sendSms": true  // ← New parameter
}

Response:
{
  "pin": "5847",
  "expiresAt": "2025-12-24T10:30:00Z",
  "smsSent": true,
  "smsDeliveredAt": "2025-11-24T10:01:00Z"
}
```

**SMS Message Template:**

```
Your Horyco POS PIN: 5847
Valid until: Dec 24, 2025
Do not share this PIN.
- Horyco Team
```

### 2. Custom PIN Length

**Planned Feature:**

- Allow tenants to choose PIN length (4 or 6 digits)
- Configurable via tenant settings

### 3. PIN Complexity Rules

**Planned Feature:**

- Prevent sequential PINs (e.g., 1234, 9876)
- Prevent repeated digits (e.g., 1111, 5555)
- Blacklist common PINs (e.g., 0000, 1234)

### 4. PIN History

**Planned Feature:**

- Track all PIN generations/regenerations
- Show who generated PIN and when
- Prevent reusing recent PINs

---

## Testing Checklist

### Functional Tests

- [ ] Generate PIN for new employee → Returns 4-digit PIN
- [ ] Generate PIN for employee with existing PIN → Replaces old PIN
- [ ] Refresh own PIN with correct password → Returns new PIN
- [ ] Refresh own PIN with wrong password → Returns 401
- [ ] Login with correct PIN → Returns JWT token
- [ ] Login with wrong PIN (3 times) → Returns 429 after 3rd attempt
- [ ] Login with expired PIN → Returns 401 "PIN expired"
- [ ] Login with disabled PIN → Returns 400 "PIN disabled"
- [ ] Check PIN status for employee with active PIN → Returns correct status
- [ ] Check PIN status for employee without PIN → Returns `hasPin: false`
- [ ] Enable PIN via employee update → `pinEnabled: true`
- [ ] Disable PIN via employee update → `pinEnabled: false`

### Security Tests

- [ ] PIN is hashed in database (not plain text)
- [ ] PIN shown only once after generation
- [ ] Rate limiting works (3 attempts, 15-minute lockout)
- [ ] Cannot generate PIN for employee in different tenant
- [ ] Cannot login with PIN from different tenant
- [ ] Expired PINs rejected automatically
- [ ] Disabled PINs rejected automatically

### UI/UX Tests

- [ ] PIN generation modal shows PIN prominently
- [ ] Copy to clipboard works
- [ ] Warning shown before closing unsaved PIN dialog
- [ ] Expiration warning shown when <7 days remaining
- [ ] Employee list shows correct PIN status badges
- [ ] Rate limit errors displayed clearly on login screen
- [ ] Failed attempt counter decrements correctly

---

## Common Questions

### Q: Can I retrieve a PIN after it's been generated?

**No.** PINs are hashed immediately after generation using bcrypt. The plain-text PIN is shown **only once** in the API response. If you lose the PIN, you must **regenerate** it.

### Q: Why not allow 6-digit PINs for better security?

**Currently fixed at 4 digits** for speed (POS use case prioritizes convenience). 6-digit PINs may be added as an option in future updates. The 30-day expiration and rate limiting mitigate brute-force risks.

### Q: Can employees see their own PIN?

**No.** Employees cannot retrieve their PIN via API. If they forget it, they must:

1. Ask manager to regenerate (recommended)
2. Use "Refresh PIN" with current password (self-service)

### Q: What happens to old PINs when regenerating?

**Old PIN becomes invalid immediately.** The system does not maintain a history of previous PINs (single active PIN per employee).

### Q: Can I disable PINs for all employees at once?

**Not currently.** You must disable PIN per employee via `PATCH /admin/staff/employees/:id`. Bulk operations may be added in future.

### Q: Does PIN login grant full system access?

**No.** PIN login grants same permissions as password login, but typically used for POS access. Admin panel operations still require password authentication (double verification for sensitive actions).

### Q: How is tenant isolation enforced for PINs?

**Automatic via AsyncLocalStorage.** When you login with a PIN, the backend:

1. Validates PIN belongs to employee
2. Validates employee belongs to authenticated tenant
3. Rejects if tenant mismatch

You never need to manually filter by tenant.

---

## Support

**Issues with PIN management?**

- Check employee has `pinEnabled: true`
- Verify PIN not expired (check `expiresAt`)
- Check rate limits (wait 15 minutes after 3 failures)
- Verify JWT token is valid (not expired)

**Security concerns?**

- Contact your security team immediately
- Regenerate all affected PINs
- Review audit logs for suspicious activity
- Consider temporarily disabling PIN auth

**Questions?**

- Swagger UI: http://localhost:3000/api/docs
- Slack: #backend-api
- Email: dev@horyco.com

---

**Last Updated:** November 24, 2025
**Document Version:** 1.0
**API Version:** 4.0
