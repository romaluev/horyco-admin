# Admin Panel - Subscription Management

## Overview

The Subscription Management section allows tenant administrators to view and manage their subscription within the Admin Panel Settings. This includes viewing current subscription status, adding/removing modules, viewing invoices, and payment history.

**Important**: Initial subscription selection and payment happens on the **Landing Page** during signup, not in the admin panel. The admin panel is for managing an existing subscription.

---

## Access & Permissions

| Permission | Description |
|------------|-------------|
| `subscription:view` | View subscription details |
| `subscription:modules` | Add or remove subscription modules |
| `subscription:invoices` | View invoices and payment history |
| `subscription:*` | Full subscription access |

**Note**: All subscription endpoints use `any_branch` mode - no branchId required.

---

## API Endpoints

### Base URL
```
/admin/subscription
```

### 1. Current Subscription

#### Get Current Subscription
```
GET /admin/subscription/current
```

**Response:**
```json
{
  "id": 1,
  "status": "active",
  "paymentFlow": "manual",
  "manualPaymentType": "cash",
  "currentPlan": {
    "key": "plan_core",
    "name": "Core Plan",
    "description": "Complete restaurant management solution",
    "priceMonthly": 300000,
    "pricePerLocation": true
  },
  "modules": [
    {
      "id": 5,
      "key": "crm",
      "name": "CRM Module",
      "description": "Customer relationship management",
      "category": "addon",
      "priceMonthly": 100000,
      "isActive": true,
      "isInTrial": true,
      "trialEndsAt": "2025-02-03T00:00:00.000Z",
      "daysRemainingInTrial": 7,
      "enabledAt": "2025-01-27T00:00:00.000Z"
    }
  ],
  "billingPeriod": {
    "currentPeriodStart": "2025-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2025-02-01T00:00:00.000Z",
    "daysUntilRenewal": 5,
    "billingInterval": "monthly",
    "billingCycleAnchor": 1
  },
  "trial": {
    "isInTrial": false,
    "trialEndsAt": null,
    "daysRemaining": 0
  },
  "locationCount": 3,
  "locationCountOverride": false,
  "requiresManualRenewal": true,
  "cancelAtPeriodEnd": false,
  "canceledAt": null,
  "billingSummary": {
    "subtotal": 1000000,
    "discount": 0,
    "total": 1000000
  },
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**Subscription Status Values:**
- `trialing` - In 14-day trial period
- `active` - Paid and active
- `suspended` - Suspended for non-payment
- `canceled` - Subscription canceled

**Payment Flow Values:**
- `automated` - LemonSqueezy (future)
- `manual` - Cash/bank transfer

---

### 2. Module Catalog

#### Get Available Modules
```
GET /admin/subscription/modules
```

**Response:**
```json
{
  "plans": [
    {
      "id": 1,
      "key": "plan_starter",
      "name": "Starter Plan",
      "description": "Basic POS for small businesses",
      "category": "plan",
      "priceMonthly": 150000,
      "pricePerLocation": true,
      "trialDays": 14,
      "iconUrl": "https://cdn.example.com/icons/starter.svg",
      "features": ["POS", "Basic reporting", "1 branch"],
      "dependencies": null,
      "isSubscribed": false,
      "canActivate": false,
      "activationBlockers": ["Cannot change plan from settings"]
    }
  ],
  "core": [
    {
      "id": 10,
      "key": "core_pos",
      "name": "POS System",
      "category": "core",
      "priceMonthly": 0,
      "isSubscribed": true,
      "canActivate": false
    }
  ],
  "addons": [
    {
      "id": 5,
      "key": "crm",
      "name": "CRM Module",
      "description": "Customer relationship management",
      "category": "addon",
      "priceMonthly": 100000,
      "pricePerLocation": false,
      "trialDays": 7,
      "features": ["Customer database", "Loyalty program", "SMS marketing"],
      "dependencies": ["sms"],
      "isSubscribed": false,
      "canActivate": false,
      "activationBlockers": ["Module \"sms\" is required"]
    },
    {
      "id": 6,
      "key": "sms",
      "name": "SMS Module",
      "description": "SMS notifications and marketing",
      "category": "addon",
      "priceMonthly": 50000,
      "trialDays": 7,
      "dependencies": null,
      "isSubscribed": false,
      "canActivate": true
    }
  ]
}
```

---

### 3. Module Management

#### Add Module to Subscription
```
POST /admin/subscription/modules
```

**Permission Required:** `subscription:modules`

**Request Body:**
```json
{
  "moduleKey": "crm",
  "startTrial": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Module crm added successfully (trial started)",
  "data": {
    "moduleId": 5,
    "moduleKey": "crm",
    "isInTrial": true,
    "trialEndsAt": "2025-02-03T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Module already subscribed or dependencies not met
- `404` - Module not found

#### Remove Module from Subscription
```
DELETE /admin/subscription/modules/{moduleKey}
```

**Permission Required:** `subscription:modules`

**Response:**
```json
{
  "success": true,
  "message": "Module crm has been removed from your subscription"
}
```

**Error Responses:**
- `400` - Cannot remove plan or core modules
- `404` - Module not active on subscription

---

### 4. Invoice History

#### Get All Invoices
```
GET /admin/subscription/invoices?page=1&limit=10
```

**Permission Required:** `subscription:invoices`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "invoiceNumber": "INV-2025-000001",
      "status": "paid",
      "amountDue": 1000000,
      "amountPaid": 1000000,
      "periodStart": "2025-01-01T00:00:00.000Z",
      "periodEnd": "2025-02-01T00:00:00.000Z",
      "dueDate": "2025-01-15T00:00:00.000Z",
      "paidAt": "2025-01-10T00:00:00.000Z",
      "invoicePdfUrl": "https://cdn.example.com/invoices/INV-2025-000001.pdf",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

**Invoice Status Values:**
- `draft` - Not yet finalized
- `open` - Awaiting payment
- `paid` - Fully paid
- `void` - Canceled/voided

#### Get Invoice Details
```
GET /admin/subscription/invoices/{id}
```

**Response:**
```json
{
  "id": 1,
  "invoiceNumber": "INV-2025-000001",
  "status": "paid",
  "amountDue": 1000000,
  "amountPaid": 1000000,
  "periodStart": "2025-01-01T00:00:00.000Z",
  "periodEnd": "2025-02-01T00:00:00.000Z",
  "dueDate": "2025-01-15T00:00:00.000Z",
  "paidAt": "2025-01-10T00:00:00.000Z",
  "invoicePdfUrl": "https://cdn.example.com/invoices/INV-2025-000001.pdf",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "lineItems": [
    {
      "description": "Core Plan (3 locations)",
      "quantity": 3,
      "unitPrice": 300000,
      "amount": 900000
    },
    {
      "description": "CRM Module",
      "quantity": 1,
      "unitPrice": 100000,
      "amount": 100000
    }
  ],
  "isOverdue": false,
  "daysUntilDue": null
}
```

---

### 5. Payment History (Manual Payments)

#### Get Payment History
```
GET /admin/subscription/payments
```

**Permission Required:** `subscription:invoices`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "paymentType": "cash",
      "amountReceived": 1000000,
      "receivedAt": "2025-01-10T10:00:00.000Z",
      "receiptNumber": "RCP-2025-001",
      "appliedToPeriodStart": "2025-01-01T00:00:00.000Z",
      "appliedToPeriodEnd": "2025-02-01T00:00:00.000Z",
      "isVerified": true,
      "verifiedBy": 1,
      "notes": "Cash payment at office",
      "receiptFileId": 123,
      "receiptFileUrl": "https://cdn.example.com/receipts/receipt.jpg",
      "createdAt": "2025-01-10T10:00:00.000Z"
    }
  ],
  "total": 5,
  "summary": {
    "totalPaid": 5000000,
    "paymentsCount": 5,
    "lastPaymentAt": "2025-01-10T10:00:00.000Z"
  }
}
```

**Payment Type Values:**
- `cash` - Cash payment
- `bank_transfer` - Bank transfer
- `card` - Card payment (future)

---

### 6. Cancel Subscription

#### Cancel Subscription
```
POST /admin/subscription/cancel
```

**Permission Required:** `subscription:modules`

**Request Body:**
```json
{
  "immediate": false,
  "reason": "Switching to different solution"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription will be canceled at end of current period (2025-02-01)",
  "data": {
    "canceledAt": null,
    "cancelAtPeriodEnd": true,
    "effectiveEndDate": "2025-02-01T00:00:00.000Z"
  }
}
```

---

## UI Flow Recommendations

### Subscription Dashboard
1. Show subscription status badge (Active, Trial, Suspended)
2. Display current plan with pricing
3. Show billing period with countdown to renewal
4. List active modules with trial indicators
5. Display total monthly cost

### Module Catalog Page
1. Group modules by category (Plans, Core, Add-ons)
2. Show subscription status for each module
3. Disable "Add" button if dependencies not met
4. Show dependency requirements clearly
5. Indicate 7-day trial for paid modules

### Module Trial Flow
1. User clicks "Try Module" on catalog item
2. Confirm trial start (7 days free)
3. Module activates immediately
4. Show trial expiration countdown
5. After trial: module deactivates unless paid

### Invoice Page
1. List invoices with status badges
2. Allow PDF download for paid invoices
3. Show line item breakdown on detail view
4. Highlight overdue invoices

### Manual Payment Flow
1. Show payment history for manual subscription
2. Display receipt images when available
3. Show next payment due date
4. Contact information for payment

---

## Error Handling

### Common Error Codes
| Code | Description | UI Action |
|------|-------------|-----------|
| 404 | No active subscription | Redirect to signup |
| 400 | Module dependencies not met | Show required modules |
| 400 | Module already subscribed | Disable add button |
| 400 | Cannot remove core/plan modules | Show explanation |
| 403 | Insufficient permissions | Show access denied |

---

## State Management

### Recommended Store Structure

| State Field | Type | Description |
|-------------|------|-------------|
| `current` | SubscriptionDetails \| null | Current subscription data |
| `moduleCatalog` | ModuleCatalog \| null | Available modules catalog |
| `invoices` | InvoiceList | Invoice history |
| `payments` | PaymentHistory | Payment history |
| `loading.subscription` | boolean | Loading state for subscription |
| `loading.catalog` | boolean | Loading state for catalog |
| `loading.invoices` | boolean | Loading state for invoices |
| `loading.payments` | boolean | Loading state for payments |

### Key Actions
- `fetchSubscription()` - Load current subscription
- `fetchModuleCatalog()` - Load available modules
- `addModule(moduleKey)` - Add module with trial
- `removeModule(moduleKey)` - Remove module
- `fetchInvoices(page)` - Load invoice history
- `fetchPayments()` - Load payment history
- `cancelSubscription(immediate)` - Cancel subscription

---

## Notes

1. **Plans Cannot Be Changed Here**: Plan upgrades/downgrades require contacting support or using the landing page (future feature).

2. **Manual Payments**: Most tenants pay via cash or bank transfer. The admin panel shows payment history but doesn't process payments directly.

3. **Trial Periods**:
   - Initial subscription: 14-day trial
   - Individual modules: 7-day trial when added mid-cycle

4. **Location-Based Pricing**: Plan prices are multiplied by location count (branches).

5. **Module Dependencies**: Some modules require others (e.g., CRM requires SMS). Show these clearly in the UI.
