# POS Payment Processing

## Overview

Payment processing is the final critical step in the order lifecycle. The POS system supports multiple payment methods, split payments (when customers want separate bills), tips, cash change calculation, voids, and refunds.

This document explains how payment processing works, the different payment scenarios, and how frontend should interact with the payment APIs.

---

## Why Payments Are Structured This Way

### 1. **Multiple Payment Methods**

The system supports various payment methods common in Uzbekistan:

- **CASH** - Physical cash
- **CREDIT** - Credit/debit card via POS terminal
- **PAYME** - Popular Uzbek mobile wallet
- **CLICK** - Another Uzbek mobile wallet
- **UZUM** - Uzum Bank payment
- **BANK_TRANSFER** - Direct bank transfer
- **MIXED** - Combination of multiple methods (handled via split payments)

### 2. **Split Payments**

Customers often want to divide a bill. The system supports four split types:

- **EQUAL** - Divide total evenly (e.g., 3 people split $150 → $50 each)
- **BY_AMOUNT** - Custom amounts per person (e.g., Person 1: $60, Person 2: $90)
- **BY_ITEM** - Assign specific items to each person (e.g., Person 1 pays for burger and fries)
- **BY_PERSON** - Named persons with their amounts

### 3. **Tips**

Tips are tracked separately from order amount for:

- Accurate employee compensation
- Tax reporting (tips may have different tax treatment)
- Analytics (average tip percentage)

### 4. **Cash Change Calculation**

For cash payments, system calculates change automatically:

```
Cash Received: $200
Order Total: $150
Tip: $10
Change to Give: $40
```

### 5. **Void vs Refund**

- **Void**: Same-day cancellation (as if payment never happened)
- **Refund**: Returns money after payment completed (can be partial)

**Why separate?**

- Voids simplify accounting (payment erased from records)
- Refunds create audit trail (original payment + refund transaction)

---

## Payment Lifecycle

```
┌──────────────┐
│ Order Ready  │ ← Order created and confirmed
└──────┬───────┘
       │
       ├─────→ Single Payment
       │       └─→ Process → Complete
       │
       ├─────→ Split Payment
       │       ├─→ Initiate Split
       │       ├─→ Pay Split 1/3
       │       ├─→ Pay Split 2/3
       │       └─→ Pay Split 3/3 → Complete
       │
┌──────▼───────┐
│ Payment Done │ ← Order marked as paid
└──────┬───────┘
       │
       ├─────→ Void (same day only)
       │
       ├─────→ Refund (full or partial)
       │
┌──────▼───────┐
│   Finalized  │
└──────────────┘
```

---

## Key Concepts

### 1. **Payment Number**

Every payment gets a unique identifier: `PAY-20250126-0001`

Format: `PAY-{date}-{sequence}`

**Why?** Easier for cashiers and customers to reference than numeric IDs.

### 2. **Payment Status**

- **pending** - Payment initiated but not completed
- **completed** - Payment successful
- **failed** - Payment failed (e.g., card declined)
- **cancelled** - Payment voided
- **refunded** - Payment refunded

### 3. **Split Payment Group**

When initiating a split, the system creates a `SplitPaymentGroup` with:

- `splitGroupId` - UUID for tracking
- `splitCount` - How many splits (e.g., 3)
- `completedSplits` - How many paid so far (e.g., 2/3)
- `remainingAmount` - Still unpaid amount
- `status` - PENDING, IN_PROGRESS, COMPLETED, CANCELLED

### 4. **Change Amount**

For cash payments, automatically calculated:

```typescript
changeAmount = cashReceived - (amount + tipAmount)
```

If `cashReceived` < `amount + tipAmount`, payment fails with error.

### 5. **Card Details**

For card payments, store:

- `cardLast4` - Last 4 digits (e.g., "1234")
- `cardBrand` - Brand (e.g., "Visa", "Mastercard", "UzCard")
- `approvalCode` - Bank approval code (e.g., "AUTH123456")

**Security**: Never store full card number or CVV.

### 6. **Voided Payments**

Voiding marks payment as `isVoided: true` and status becomes `cancelled`.

**Business Rules:**

- Can only void same-day payments
- Cannot void if already refunded
- Voided payments don't count toward shift totals

### 7. **Refunds**

Refunds create new payment records with negative amounts:

- `parentPaymentId` - Links to original payment
- `amount` - Refund amount (positive, but reduces paid amount)
- `refundedAmount` - Tracked on original payment

**Business Rules:**

- Cannot refund more than remaining refundable amount
- Can do multiple partial refunds
- Cannot refund voided payments

---

## API Endpoints

Base URL: `/pos/payments`

### 1. Process Single Payment

**POST** `/pos/payments/process`

Processes a complete payment for an order.

**Request Body (Cash):**

```json
{
  "orderId": 1001,
  "amount": 40.46,
  "paymentMethod": "CASH",
  "branchId": 1,
  "tipAmount": 5.0,
  "cashReceived": 50.0,
  "customerId": 123,
  "notes": "Table 5 payment"
}
```

**Request Body (Card):**

```json
{
  "orderId": 1001,
  "amount": 40.46,
  "paymentMethod": "CREDIT",
  "branchId": 1,
  "tipAmount": 5.0,
  "cardLast4": "1234",
  "cardBrand": "Visa",
  "approvalCode": "AUTH789456",
  "customerId": 123
}
```

**Request Body (Mobile Wallet):**

```json
{
  "orderId": 1001,
  "amount": 40.46,
  "paymentMethod": "PAYME",
  "branchId": 1,
  "tipAmount": 2.0,
  "customerId": 123
}
```

**Response (201):**

```json
{
  "id": 501,
  "orderId": 1001,
  "amount": 40.46,
  "tipAmount": 5.0,
  "changeAmount": 4.54,
  "paymentMethod": "CASH",
  "paymentNumber": "PAY-20250126-0501",
  "status": "completed",
  "cashReceived": 50.0,
  "cardLast4": null,
  "cardBrand": null,
  "approvalCode": null,
  "customerId": 123,
  "branchId": 1,
  "sessionId": null,
  "notes": "Table 5 payment",
  "isVoided": false,
  "refundedAmount": 0.0,
  "processedAt": "2025-01-26T14:30:00Z",
  "processedBy": 12,
  "tenantId": 5
}
```

**Business Rules:**

- ✅ Order must exist and not be fully paid
- ✅ Amount can be full order total or partial
- ✅ For cash: `cashReceived` must be ≥ `amount + tipAmount`
- ✅ Payment recorded in shift totals
- ✅ Order marked as paid when fully paid

**Error Responses:**

```json
// 400 Bad Request - Insufficient cash
{
  "statusCode": 400,
  "message": "Cash received ($40.00) is less than amount + tip ($45.46)"
}

// 404 Not Found - Order not found
{
  "statusCode": 404,
  "message": "Order with ID 1001 not found"
}
```

---

### 2. Initiate Split Payment

**POST** `/pos/payments/split/initiate`

Starts a split payment flow for an order.

**Request Body (EQUAL split):**

```json
{
  "orderId": 1001,
  "splitType": "EQUAL",
  "splitCount": 3,
  "totalAmount": 150.0,
  "branchId": 1
}
```

**Response (201):**

```json
{
  "id": 1,
  "splitGroupId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "orderId": 1001,
  "splitType": "EQUAL",
  "splitCount": 3,
  "totalAmount": 150.0,
  "completedSplits": 0,
  "remainingAmount": 150.0,
  "status": "PENDING",
  "splits": [
    {
      "sequence": 1,
      "amount": 50.0,
      "status": "PENDING"
    },
    {
      "sequence": 2,
      "amount": 50.0,
      "status": "PENDING"
    },
    {
      "sequence": 3,
      "amount": 50.0,
      "status": "PENDING"
    }
  ],
  "createdAt": "2025-01-26T14:30:00Z",
  "tenantId": 5
}
```

**Request Body (BY_AMOUNT split):**

```json
{
  "orderId": 1001,
  "splitType": "BY_AMOUNT",
  "splitCount": 2,
  "totalAmount": 150.0,
  "branchId": 1,
  "splitConfig": {
    "splits": [
      { "sequence": 1, "amount": 60.0 },
      { "sequence": 2, "amount": 90.0 }
    ]
  }
}
```

**Request Body (BY_ITEM split):**

```json
{
  "orderId": 1001,
  "splitType": "BY_ITEM",
  "splitCount": 2,
  "totalAmount": 150.0,
  "branchId": 1,
  "splitConfig": {
    "splits": [
      { "sequence": 1, "orderItemIds": [5001, 5002] },
      { "sequence": 2, "orderItemIds": [5003, 5004] }
    ]
  }
}
```

**Business Rules:**

- ✅ Split count must be ≥ 2
- ✅ For EQUAL: System divides total evenly
- ✅ For BY_AMOUNT: Sum of splits must equal total amount
- ✅ For BY_ITEM: All order items must be assigned
- ❌ Order cannot have active split already

**Error Responses:**

```json
// 400 Bad Request - Split count too low
{
  "statusCode": 400,
  "message": "Split count must be at least 2"
}

// 400 Bad Request - Amounts mismatch
{
  "statusCode": 400,
  "message": "Sum of split amounts ($140) does not match total ($150)"
}

// 409 Conflict - Order already has split
{
  "statusCode": 409,
  "message": "Order already has an active split payment"
}
```

---

### 3. Process Split Payment

**POST** `/pos/payments/split/pay`

Processes payment for one split in a split payment group.

**Request Body:**

```json
{
  "splitGroupId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "splitSequence": 1,
  "amount": 50.0,
  "paymentMethod": "CASH",
  "cashReceived": 50.0,
  "tipAmount": 0.0
}
```

**Response (201):**

```json
{
  "id": 502,
  "orderId": 1001,
  "amount": 50.0,
  "tipAmount": 0.0,
  "changeAmount": 0.0,
  "paymentMethod": "CASH",
  "paymentNumber": "PAY-20250126-0502",
  "status": "completed",
  "splitPaymentGroupId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "splitSequence": 1,
  "processedAt": "2025-01-26T14:35:00Z",
  "tenantId": 5
}
```

**Business Rules:**

- ✅ Must provide correct `splitGroupId`
- ✅ Sequence must be valid (1 to splitCount)
- ✅ For EQUAL splits, amount must match expected amount
- ✅ Cannot pay same sequence twice
- ✅ Auto-completes split group when all splits paid

**Error Responses:**

```json
// 400 Bad Request - Wrong sequence
{
  "statusCode": 400,
  "message": "Split sequence 4 does not exist (group has 3 splits)"
}

// 400 Bad Request - Wrong amount
{
  "statusCode": 400,
  "message": "Amount ($40) does not match expected amount for this split ($50)"
}

// 400 Bad Request - Split already paid
{
  "statusCode": 400,
  "message": "Split sequence 1 has already been paid"
}
```

---

### 4. Get Split Payment Status

**GET** `/pos/payments/split/:splitGroupId`

Retrieves current status of a split payment group.

**Response (200):**

```json
{
  "id": 1,
  "splitGroupId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "orderId": 1001,
  "splitType": "EQUAL",
  "splitCount": 3,
  "totalAmount": 150.0,
  "completedSplits": 2,
  "remainingAmount": 50.0,
  "status": "IN_PROGRESS",
  "nextSplitSequence": 3,
  "splits": [
    {
      "sequence": 1,
      "amount": 50.0,
      "status": "COMPLETED",
      "paymentId": 502,
      "paidAt": "2025-01-26T14:35:00Z"
    },
    {
      "sequence": 2,
      "amount": 50.0,
      "status": "COMPLETED",
      "paymentId": 503,
      "paidAt": "2025-01-26T14:37:00Z"
    },
    {
      "sequence": 3,
      "amount": 50.0,
      "status": "PENDING"
    }
  ]
}
```

**Use Case:**

- Display split payment progress to cashier
- Show which splits are paid and which are pending
- Determine next split to pay

---

### 5. Cancel Split Payment

**POST** `/pos/payments/split/cancel`

Cancels an in-progress split payment.

**Request Body:**

```json
{
  "splitGroupId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "reason": "Customer decided to pay together"
}
```

**Response (200):**

```json
{
  "id": 1,
  "splitGroupId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "CANCELLED",
  "cancelledAt": "2025-01-26T14:40:00Z",
  "cancelledBy": 12,
  "cancelReason": "Customer decided to pay together"
}
```

**Business Rules:**

- ✅ Completed splits remain valid (not refunded automatically)
- ✅ No more splits can be paid after cancellation
- ✅ Must provide reason for audit trail

---

### 6. Get Order Payments

**GET** `/pos/payments/order/:orderId`

Retrieves all payments for a specific order.

**Response (200):**

```json
[
  {
    "id": 501,
    "orderId": 1001,
    "amount": 40.46,
    "paymentMethod": "CASH",
    "paymentNumber": "PAY-20250126-0501",
    "status": "completed",
    "isVoided": false,
    "refundedAmount": 0.0,
    "processedAt": "2025-01-26T14:30:00Z"
  }
]
```

**Use Case:**

- Display payment history for an order
- Check how much has been paid
- View payment methods used

---

### 7. Void Payment

**POST** `/pos/payments/:id/void`

Voids a payment (same-day cancellation only).

**Request Body:**

```json
{
  "paymentId": 501,
  "reason": "Customer changed mind, order cancelled"
}
```

**Response (200):**

```json
{
  "id": 501,
  "status": "cancelled",
  "isVoided": true,
  "voidedAt": "2025-01-26T14:45:00Z",
  "voidedBy": 12,
  "voidReason": "Customer changed mind, order cancelled"
}
```

**Business Rules:**

- ❌ Can only void payments made today (same day)
- ❌ Cannot void if already refunded
- ❌ Cannot void already voided payments
- ✅ Voided payments removed from shift totals

**Error Responses:**

```json
// 400 Bad Request - Not same day
{
  "statusCode": 400,
  "message": "Cannot void payment made on 2025-01-25 (must be same day)"
}

// 400 Bad Request - Has refunds
{
  "statusCode": 400,
  "message": "Cannot void payment that has been refunded"
}
```

---

### 8. Refund Payment

**POST** `/pos/payments/:id/refund`

Creates a full or partial refund for a payment.

**Request Body (Full Refund):**

```json
{
  "refundAmount": 40.46,
  "reason": "Order cancelled, full refund"
}
```

**Request Body (Partial Refund):**

```json
{
  "refundAmount": 10.0,
  "reason": "One item removed, partial refund"
}
```

**Response (201):**

```json
{
  "id": 504,
  "parentPaymentId": 501,
  "orderId": 1001,
  "amount": 10.0,
  "paymentMethod": "CASH",
  "paymentNumber": "REFUND-20250126-0504",
  "status": "refunded",
  "notes": "Refund for payment PAY-20250126-0501. Reason: One item removed",
  "processedAt": "2025-01-26T15:00:00Z",
  "tenantId": 5
}
```

**Business Rules:**

- ✅ Can refund full or partial amounts
- ✅ Can do multiple partial refunds
- ❌ Total refunds cannot exceed original payment amount
- ❌ Cannot refund voided payments
- ✅ Refund reduces `paidAmount` on order

**Error Responses:**

```json
// 400 Bad Request - Exceeds available
{
  "statusCode": 400,
  "message": "Refund amount ($50) exceeds available refundable amount ($40.46)"
}

// 400 Bad Request - Payment voided
{
  "statusCode": 400,
  "message": "Cannot refund a voided payment"
}
```

---

## UI/UX Flows

### Flow 1: Single Cash Payment

**Screen: Order Detail - Ready to Pay**

1. **Cashier views order total**

   - Display: Total $40.46

2. **Tap "Process Payment" button**

   - Show payment method selector

3. **Select "Cash"**

   - Show cash payment form:
     - Order Total: $40.46
     - Tip Amount: [Input]
     - Cash Received: [Input]
     - Change: [Calculated]

4. **Enter tip and cash received**

   - Tip: $5.00
   - Cash Received: $50.00
   - System calculates: Change = $4.54

5. **Tap "Complete Payment"**

   - Frontend calls `POST /pos/payments/process`

   ```json
   {
     "orderId": 1001,
     "amount": 40.46,
     "paymentMethod": "CASH",
     "branchId": 1,
     "tipAmount": 5.0,
     "cashReceived": 50.0
   }
   ```

6. **Success**
   - Show "Payment Successful" screen
   - Display: "Change: $4.54 - Please give to customer"
   - Option to print receipt
   - Navigate back to dashboard

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Process Payment                    ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Order #1001 - Table 5                  │
│  Total: $40.46                          │
│                                         │
│  Payment Method: [Cash] [Card] [PayMe] │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Order Total:      $40.46        │   │
│  │                                 │   │
│  │ Tip Amount:                     │   │
│  │ ┌─────────────┐                │   │
│  │ │ $5.00       │                │   │
│  │ └─────────────┘                │   │
│  │                                 │   │
│  │ Cash Received:                  │   │
│  │ ┌─────────────┐                │   │
│  │ │ $50.00      │                │   │
│  │ └─────────────┘                │   │
│  │                                 │   │
│  │ ─────────────────────────      │   │
│  │ CHANGE TO GIVE: $4.54          │   │
│  └─────────────────────────────────┘   │
│                                         │
│       [Cancel]  [Complete Payment]     │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 2: Card Payment

**Screen: Payment Method Selected - Card**

1. **Select "Card" payment method**

   - Show card payment form

2. **Process card on POS terminal**

   - Cashier swipes/inserts/taps card
   - Terminal processes payment
   - Terminal provides: Last 4, Brand, Approval Code

3. **Enter card details in app**

   - Last 4: 1234
   - Brand: Visa
   - Approval Code: AUTH789456
   - Tip: $5.00

4. **Submit payment**

   - Frontend calls `POST /pos/payments/process`

   ```json
   {
     "orderId": 1001,
     "amount": 40.46,
     "paymentMethod": "CREDIT",
     "branchId": 1,
     "tipAmount": 5.0,
     "cardLast4": "1234",
     "cardBrand": "Visa",
     "approvalCode": "AUTH789456"
   }
   ```

5. **Success**
   - Show "Payment Successful"
   - Print receipt with masked card number
   - Navigate back

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Card Payment                       ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Order Total: $40.46                    │
│                                         │
│  💳 Process card on terminal            │
│                                         │
│  Card Last 4 Digits:                    │
│  ┌─────────────────────────────────┐   │
│  │ 1234                            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Card Brand:                            │
│  [Visa ▼] [Mastercard] [UzCard]        │
│                                         │
│  Approval Code:                         │
│  ┌─────────────────────────────────┐   │
│  │ AUTH789456                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Tip Amount:                            │
│  ┌─────────────────────────────────┐   │
│  │ $5.00                           │   │
│  └─────────────────────────────────┘   │
│                                         │
│       [Cancel]  [Complete Payment]     │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 3: Split Payment (Equal)

**Screen: Order Detail - Customer Requests Split**

1. **Customer says: "We'd like to split the bill 3 ways"**

2. **Cashier taps "Split Payment"**

   - Show split payment dialog

3. **Select split type: "Equal"**

   - Enter number of splits: 3
   - System shows: Each person pays $50.00

4. **Initiate split**

   - Frontend calls `POST /pos/payments/split/initiate`

   ```json
   {
     "orderId": 1001,
     "splitType": "EQUAL",
     "splitCount": 3,
     "totalAmount": 150.0,
     "branchId": 1
   }
   ```

5. **Split initiated**

   - Response includes `splitGroupId`
   - Show split payment tracker: 0/3 paid

6. **Process first split**

   - Person 1 ready to pay
   - Cashier taps "Pay Split 1/3"
   - Amount: $50.00 (pre-filled, cannot change for EQUAL splits)
   - Select payment method: Cash
   - Cash received: $50.00

7. **Submit first split payment**

   - Frontend calls `POST /pos/payments/split/pay`

   ```json
   {
     "splitGroupId": "a1b2c3d4...",
     "splitSequence": 1,
     "amount": 50.0,
     "paymentMethod": "CASH",
     "cashReceived": 50.0
   }
   ```

8. **First split paid**

   - Update tracker: 1/3 paid, $100 remaining
   - Show "Next: Pay Split 2/3"

9. **Repeat for splits 2 and 3**

   - Each person pays their $50.00
   - Tracker updates: 2/3 paid, 3/3 paid

10. **All splits paid**
    - Split group status: COMPLETED
    - Order marked as fully paid
    - Show success message
    - Print receipts (one per split or combined)

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Split Payment - 3 Ways Equal       ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Order #1001 - Total: $150.00           │
│                                         │
│  Split Progress:  2 / 3 Paid            │
│  ████████████░░░░░░░░░░░ 66%           │
│                                         │
│  Remaining: $50.00                      │
│                                         │
│  ✅ Split 1: $50.00 (Cash) - PAID       │
│  ✅ Split 2: $50.00 (Card) - PAID       │
│  ⏳ Split 3: $50.00 - PENDING           │
│                                         │
│  Next Payment: Split 3 of 3             │
│  Amount: $50.00                         │
│                                         │
│  Payment Method:                        │
│  [Cash] [Card] [PayMe] [Click]         │
│                                         │
│       [Cancel Split]  [Pay Split 3]    │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 4: Split Payment (By Amount)

**Screen: Custom Split Amounts**

1. **Customer says: "I'll pay $60, she'll pay $90"**

2. **Select split type: "By Amount"**

   - Number of splits: 2
   - Split 1: $60.00
   - Split 2: $90.00
   - System validates: $60 + $90 = $150 ✓

3. **Initiate split**

   - Frontend calls `POST /pos/payments/split/initiate`

   ```json
   {
     "orderId": 1001,
     "splitType": "BY_AMOUNT",
     "splitCount": 2,
     "totalAmount": 150.0,
     "branchId": 1,
     "splitConfig": {
       "splits": [
         { "sequence": 1, "amount": 60.0 },
         { "sequence": 2, "amount": 90.0 }
       ]
     }
   }
   ```

4. **Process each split**
   - Split 1: $60.00 (Person 1)
   - Split 2: $90.00 (Person 2)

---

### Flow 5: Void Payment

**Screen: Payment History**

1. **Cashier realizes mistake: "Wrong order charged"**

2. **View order payments**

   - Frontend calls `GET /pos/payments/order/1001`
   - Shows payment #501 - $40.46 (Cash) - Today 2:30 PM

3. **Tap on payment → "Void Payment"**

   - Show confirmation dialog
   - Warning: "This will cancel the payment as if it never happened"
   - Require reason input

4. **Enter reason and confirm**

   - Frontend calls `POST /pos/payments/501/void`

   ```json
   {
     "paymentId": 501,
     "reason": "Wrong order charged, customer not ready to pay"
   }
   ```

5. **Payment voided**
   - Payment status: Cancelled
   - Order status: Unpaid
   - Shift totals updated (payment removed)

---

### Flow 6: Refund Payment

**Screen: Order History**

1. **Customer returns next day: "One item was wrong, I want partial refund"**

2. **Look up original order #1001**

   - Original payment: $40.46 (Card)
   - Date: Yesterday

3. **Tap "Refund Payment"**

   - Show refund dialog
   - Original amount: $40.46
   - Refunded so far: $0.00
   - Available to refund: $40.46

4. **Enter refund amount and reason**

   - Refund amount: $10.00 (one item price)
   - Reason: "Item was incorrect, customer returned"

5. **Process refund**

   - Frontend calls `POST /pos/payments/501/refund`

   ```json
   {
     "refundAmount": 10.0,
     "reason": "Item was incorrect, customer returned"
   }
   ```

6. **Refund completed**
   - New refund payment created: -$10.00
   - Original payment now shows: Refunded $10.00
   - Customer receives refund (cash or card credit)

---

## Common Questions

### Q1: What's the difference between void and refund?

**A:**

- **Void**: Same-day cancellation, erases payment from records (as if it never happened). Can only be done on the same day. Does not create refund transaction.
- **Refund**: Returns money after payment, creates audit trail. Can be done any time. Creates separate refund transaction.

**Rule of thumb**: Use void for immediate mistakes (within same day), use refund for later returns/corrections.

### Q2: Can I split a payment by different payment methods?

**A:** Yes! Split payments allow each split to use a different payment method. Example:

- Split 1: $50 Cash
- Split 2: $50 Card
- Split 3: $50 PayMe

### Q3: What happens if a customer abandons a split payment halfway?

**A:** The cashier can cancel the split payment. Already-paid splits remain valid (money was received), but no new splits can be processed. The cashier would need to handle remaining amount separately (either refund paid splits or collect remaining amount via single payment).

### Q4: How do tips affect cash change?

**A:** Tips are included in change calculation:

```
Order: $40
Tip: $5
Cash Received: $50
Change: $50 - $40 - $5 = $5
```

If customer wants to leave $5 tip from $50, they should receive $5 change.

### Q5: Can I refund a voided payment?

**A:** No. Voided payments are considered cancelled and cannot be refunded. If you voided by mistake, you'll need to:

1. Re-process the payment
2. Then refund if needed

### Q6: What if split amounts don't match order total?

**A:** The API will reject the split initiation with error:

```
"Sum of split amounts ($140) does not match total ($150)"
```

Frontend should validate this before calling the API.

### Q7: Can I do partial refunds multiple times?

**A:** Yes! You can issue multiple partial refunds as long as the total refunded amount doesn't exceed the original payment amount.

Example:

- Original payment: $100
- Refund 1: $20
- Refund 2: $30
- Remaining refundable: $50

### Q8: How are tips tracked for employees?

**A:** Tips are stored with each payment. Reports can aggregate tips by:

- Employee (who processed payment)
- Date range
- Shift
- Payment method

This helps with fair tip distribution if pooled.

### Q9: What happens to payments if an order is cancelled?

**A:** If order had payments, they should be voided (same day) or refunded (later). The system does NOT automatically void/refund when an order is cancelled — this must be done explicitly.

### Q10: Can I split by items if some items were shared?

**A:** The BY_ITEM split requires assigning each item to exactly one split. For shared items, use BY_AMOUNT instead and divide manually (e.g., shared appetizer cost split evenly).

---

## Frontend Implementation Guide

### 1. **Payment Context Provider**

```typescript
interface PaymentContextType {
  processPayment: (data: ProcessPaymentDto) => Promise<PaymentResponse>
  initiateSplit: (data: SplitPaymentDto) => Promise<SplitPaymentGroup>
  processSplitPayment: (
    data: ProcessSplitPaymentDto
  ) => Promise<PaymentResponse>
  getSplitStatus: (splitGroupId: string) => Promise<SplitPaymentGroup>
  cancelSplit: (splitGroupId: string, reason: string) => Promise<void>
  voidPayment: (paymentId: number, reason: string) => Promise<void>
  refundPayment: (
    paymentId: number,
    amount: number,
    reason: string
  ) => Promise<void>
}
```

### 2. **Cash Change Calculator**

```typescript
function calculateChange(
  orderTotal: number,
  tipAmount: number,
  cashReceived: number
) {
  const totalDue = orderTotal + tipAmount
  const change = cashReceived - totalDue

  if (change < 0) {
    throw new Error(
      `Insufficient cash. Need $${totalDue.toFixed(2)}, received $${cashReceived.toFixed(2)}`
    )
  }

  return change
}

// Usage in component:
const [cashReceived, setCashReceived] = useState('')
const [tipAmount, setTipAmount] = useState('')

const change = useMemo(() => {
  try {
    return calculateChange(
      order.totalAmount,
      parseFloat(tipAmount) || 0,
      parseFloat(cashReceived) || 0
    )
  } catch {
    return 0
  }
}, [order.totalAmount, tipAmount, cashReceived])
```

### 3. **Split Payment Progress Tracker**

```typescript
function SplitPaymentTracker({ splitGroupId }: { splitGroupId: string }) {
  const [status, setStatus] = useState<SplitPaymentGroup | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await api.get(`/pos/payments/split/${splitGroupId}`);
      setStatus(data);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [splitGroupId]);

  if (!status) return <LoadingSpinner />;

  const progress = (status.completedSplits / status.splitCount) * 100;

  return (
    <div>
      <ProgressBar value={progress} />
      <p>{status.completedSplits} / {status.splitCount} Paid</p>
      <p>Remaining: ${status.remainingAmount.toFixed(2)}</p>

      {status.splits.map(split => (
        <SplitItem key={split.sequence} split={split} />
      ))}
    </div>
  );
}
```

### 4. **Payment Method Selector**

```typescript
function PaymentMethodSelector({ selected, onSelect }: Props) {
  const methods = [
    { value: 'CASH', label: 'Cash', icon: '💵' },
    { value: 'CREDIT', label: 'Card', icon: '💳' },
    { value: 'PAYME', label: 'PayMe', icon: '📱' },
    { value: 'CLICK', label: 'Click', icon: '🔵' },
    { value: 'UZUM', label: 'Uzum', icon: '🟣' },
  ];

  return (
    <div className="payment-methods">
      {methods.map(method => (
        <button
          key={method.value}
          className={selected === method.value ? 'active' : ''}
          onClick={() => onSelect(method.value)}
        >
          <span>{method.icon}</span>
          <span>{method.label}</span>
        </button>
      ))}
    </div>
  );
}
```

### 5. **Payment Receipt Generator**

```typescript
function generateReceipt(payment: PaymentResponse, order: Order) {
  return {
    header: {
      businessName: 'Restaurant Name',
      address: 'Branch Address',
      phone: '+998 XX XXX XX XX',
    },
    order: {
      orderNumber: order.orderNumber,
      date: payment.processedAt,
      items: order.items,
    },
    payment: {
      subtotal: order.subtotal,
      tax: order.taxAmount,
      serviceCharge: order.serviceChargeAmount,
      total: order.totalAmount,
      paymentMethod: payment.paymentMethod,
      amountPaid: payment.amount,
      tip: payment.tipAmount,
      change: payment.changeAmount,
    },
    footer: {
      paymentNumber: payment.paymentNumber,
      thankYouMessage: 'Thank you for your visit!',
    },
  }
}
```

---

## Testing Checklist

- [ ] Process cash payment with exact amount
- [ ] Process cash payment with change
- [ ] Process cash payment with insufficient cash (should fail)
- [ ] Process card payment
- [ ] Process mobile wallet payment (PayMe, Click, Uzum)
- [ ] Add tip to payment
- [ ] Initiate equal split payment (2, 3, 4 ways)
- [ ] Initiate by-amount split payment
- [ ] Process all splits in split payment
- [ ] Check split payment status during process
- [ ] Cancel split payment halfway
- [ ] Void same-day payment
- [ ] Try to void payment from previous day (should fail)
- [ ] Full refund of payment
- [ ] Partial refund of payment
- [ ] Multiple partial refunds
- [ ] Try to refund more than available (should fail)
- [ ] Try to refund voided payment (should fail)
- [ ] Get payment history for order
- [ ] Verify shift totals include payments
- [ ] Verify voided payments excluded from shift totals

---

## Summary

Payment processing is the final step that completes the order lifecycle. The system:

1. **Supports multiple payment methods** common in Uzbekistan (cash, card, mobile wallets)
2. **Handles split payments** with four different split types (equal, by amount, by item, by person)
3. **Tracks tips separately** for employee compensation and tax purposes
4. **Calculates change automatically** for cash payments
5. **Provides void and refund** for corrections and returns
6. **Maintains audit trail** for all payment operations
7. **Integrates with shifts** for financial accountability

Frontend must provide clear, intuitive interfaces for payment entry, split tracking, and error handling.
