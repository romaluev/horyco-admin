# POS Order Management

## Overview

Orders are the core of the POS system. Every transaction — from a quick coffee takeaway to a multi-course dinner — is represented as an Order entity. This document explains how orders work, their lifecycle, modification capabilities, and the various features that make order management flexible and powerful.

---

## Why Orders Are Structured This Way

### 1. **Order Must Belong to a Shift**

Every POS order is tied to an active shift. This ensures financial accountability — we always know which cashier handled the transaction and can reconcile cash at shift closure.

**Important**: WebApp and Telegram orders have `shiftId: null` because customers place them directly, not through a cashier.

### 2. **Order Items vs Order Entity**

Orders are split into two concepts:

- **Order**: The container (total, status, customer, table, shift)
- **Order Items**: The products/dishes being ordered

This separation allows:

- Adding/removing items without recreating the entire order
- Individual item status tracking (e.g., one dish ready, another cooking)
- Item-level special instructions

### 3. **Modifiers on Items**

Each order item can have modifiers (e.g., "Extra Cheese", "No Onions"). Modifiers are stored with the item, not separately, because:

- Modifiers are specific to that item instance
- Price calculations are per-item
- Kitchen needs to see modifiers with the dish

### 4. **Order Templates**

Templates allow creating common orders with one tap (e.g., "Breakfast Combo #1" with predefined items). This speeds up POS operations for frequently ordered combinations.

### 5. **Split and Merge Operations**

- **Split**: Divides one order into two (e.g., separate bills for couple)
- **Merge**: Combines multiple orders into one (e.g., joining two tables)

These operations maintain full audit trails for accounting purposes.

---

## Order Lifecycle

```
┌──────────┐
│ CREATED  │ ← Order just created, items added
└────┬─────┘
     │
     ├─────→ Send to kitchen
     │
┌────▼─────┐
│PREPARING │ ← Kitchen received order
└────┬─────┘
     │
     ├─────→ Kitchen starts cooking
     │
┌────▼─────┐
│ COOKING  │ ← Food is being prepared
└────┬─────┘
     │
     ├─────→ Food finished
     │
┌────▼─────┐
│  READY   │ ← Ready for pickup/service
└────┬─────┘
     │
     ├─────→ Delivered to customer
     │
┌────▼─────┐
│   SENT   │ ← Order delivered (optional for dine-in)
└────┬─────┘
     │
     ├─────→ Payment processed
     │
┌────▼─────┐
│COMPLETED │ ← Order fully paid and closed
└──────────┘
```

**Status Flow:**

1. **CREATED** - Order just created, can still modify items freely
2. **PREPARING** - Sent to kitchen, modifications may require confirmation
3. **COOKING** - Kitchen actively preparing, harder to modify
4. **READY** - Food ready for pickup/delivery
5. **SENT** - Delivered to customer (for dine-in/delivery orders)
6. **COMPLETED** - Fully paid and closed

---

## Key Concepts

### 1. **Delivery Types**

```typescript
enum OrderDeliveryType {
  TABLE = 'TABLE', // Dine-in at a table
  PICKUP = 'PICKUP', // Takeaway/to-go
  DELIVERY = 'DELIVERY', // Home delivery
}
```

Why this matters:

- **TABLE**: Requires `tableId`, order stays open until customer pays
- **PICKUP**: No table needed, usually paid immediately
- **DELIVERY**: Includes delivery address, may include delivery fee

### 2. **Order Modifications**

All changes to orders are tracked in the `OrderModification` table for audit purposes:

- Item added
- Item removed
- Quantity changed
- Notes updated
- Order split
- Order merged

**Why track modifications?**

- Kitchen needs to know what changed ("Cancel the burger")
- Accounting needs to reconcile refunds/additions
- Management can review suspicious changes

### 3. **Order Templates**

Predefined order combinations that can be created with one tap.

**Example Template: "Breakfast Combo"**

- 2x Scrambled Eggs
- 1x Toast
- 1x Orange Juice
- Total: $12.99

Cashier taps "Breakfast Combo" → all items added automatically.

### 4. **Split Orders**

Divides one order into two separate orders.

**Use Case**: Couple dining together wants separate bills.

**How It Works:**

1. Select items to move to new order
2. System creates second order with selected items
3. Original order retains remaining items
4. If payments existed, they're redistributed proportionally

### 5. **Merge Orders**

Combines multiple orders into one.

**Use Case**: Two tables joining together wants single bill.

**How It Works:**

1. Select source orders and target order
2. All items transferred to target order
3. Source orders marked as "merged" and completed
4. Total recalculated on target order

---

## API Endpoints

Base URL: `/pos/orders`

### 1. Create Order

**POST** `/pos/orders`

Creates a new order in an active shift.

**Request Body:**

```json
{
  "branchId": 1,
  "deliveryType": "TABLE",
  "tableId": 5,
  "customerId": 123,
  "items": [
    {
      "productId": 10,
      "productName": "Cheeseburger",
      "quantity": 2,
      "unitPrice": 12.99,
      "notes": "No pickles",
      "modifiers": [
        {
          "modifierId": 50,
          "modifierName": "Extra Cheese",
          "quantity": 1,
          "unitPrice": 1.5
        }
      ]
    },
    {
      "productId": 15,
      "productName": "French Fries",
      "quantity": 2,
      "unitPrice": 4.99
    }
  ],
  "notes": "Table 5 - Birthday party, please rush",
  "customerNotes": "Customer requested extra napkins"
}
```

**Response (201):**

```json
{
  "id": 1001,
  "orderNumber": "ORD-1001",
  "branchId": 1,
  "shiftId": 45,
  "customerId": 123,
  "tableId": 5,
  "deliveryType": "TABLE",
  "status": "CREATED",
  "paymentStatus": "pending",
  "source": "pos",
  "items": [
    {
      "id": 5001,
      "productId": 10,
      "productName": "Cheeseburger",
      "quantity": 2,
      "unitPrice": 12.99,
      "subtotal": 25.98,
      "notes": "No pickles",
      "modifiers": [
        {
          "id": 6001,
          "modifierId": 50,
          "modifierName": "Extra Cheese",
          "quantity": 1,
          "unitPrice": 1.5,
          "subtotal": 1.5
        }
      ],
      "totalWithModifiers": 27.48
    },
    {
      "id": 5002,
      "productId": 15,
      "productName": "French Fries",
      "quantity": 2,
      "unitPrice": 4.99,
      "subtotal": 9.98,
      "modifiers": [],
      "totalWithModifiers": 9.98
    }
  ],
  "subtotal": 37.46,
  "taxAmount": 3.0,
  "serviceChargeAmount": 0.0,
  "totalAmount": 40.46,
  "paidAmount": 0.0,
  "notes": "Table 5 - Birthday party, please rush",
  "customerNotes": "Customer requested extra napkins",
  "createdAt": "2025-01-26T12:30:00Z",
  "updatedAt": "2025-01-26T12:30:00Z",
  "tenantId": 5
}
```

**Business Rules:**

- ❌ Cannot create order without active shift (POS orders only)
- ✅ At least one item required
- ✅ Prices captured at order creation (immune to menu price changes)
- ✅ Tax and service charge calculated based on branch settings

---

### 2. Get Orders (with filters)

**GET** `/pos/orders?status=CREATED&branchId=1&startDate=2025-01-26`

Retrieves orders with optional filters.

**Query Parameters:**

- `status` - Filter by order status
- `branchId` - Filter by branch
- `shiftId` - Filter by shift
- `tableId` - Filter by table
- `startDate` - Start date range
- `endDate` - End date range

**Response (200):**

```json
[
  {
    "id": 1001,
    "orderNumber": "ORD-1001"
    // ... (full order object)
  }
]
```

---

### 3. Get Active Orders

**GET** `/pos/orders/active`

Returns all non-completed orders (CREATED, PREPARING, COOKING, READY, SENT).

**Response (200):**

```json
[
  {
    "id": 1001,
    "orderNumber": "ORD-1001",
    "status": "PREPARING",
    "tableId": 5,
    "totalAmount": 40.46,
    "createdAt": "2025-01-26T12:30:00Z"
  },
  {
    "id": 1002,
    "orderNumber": "ORD-1002",
    "status": "COOKING",
    "tableId": 8,
    "totalAmount": 65.0,
    "createdAt": "2025-01-26T12:45:00Z"
  }
]
```

**Use Case:**

- Display all pending orders on POS dashboard
- Kitchen display system showing active orders
- Waiter app showing tables with pending orders

---

### 4. Get Orders for Table

**GET** `/pos/orders/table/:tableId?includeCompleted=false`

Retrieves all orders for a specific table.

**Query Parameters:**

- `status` - Filter by status (optional)
- `includeCompleted` - Include completed orders (default: false)

**Response (200):**

```json
[
  {
    "id": 1001,
    "orderNumber": "ORD-1001",
    "status": "PREPARING",
    "totalAmount": 40.46,
    "paidAmount": 0.0
  }
]
```

**Use Case:**

- Waiter checks table's order status
- Add more items to existing table order
- Check if table has unpaid orders before seating new customers

---

### 5. Get Order by ID

**GET** `/pos/orders/:orderId`

Retrieves complete order details.

**Response (200):**

```json
{
  "id": 1001
  // ... (full order object with all items and modifiers)
}
```

---

### 6. Update Order Status

**PATCH** `/pos/orders/:orderId/status`

Updates the order status (typically called by kitchen or waiter).

**Request Body:**

```json
{
  "status": "READY"
}
```

**Response (200):**

```json
{
  "id": 1001,
  "status": "READY"
  // ... (full updated order)
}
```

**Business Rules:**

- Cannot move from COMPLETED back to earlier status
- Each status transition may trigger notifications (e.g., waiter notified when order ready)

---

### 7. Update Order

**PATCH** `/pos/orders/:orderId`

Updates order details (notes, customer, table, etc.). Does not modify items — use modification endpoints for that.

**Request Body:**

```json
{
  "tableId": 6,
  "notes": "Moved to table 6",
  "customerNotes": "Customer allergic to peanuts"
}
```

**Response (200):**

```json
{
  "id": 1001,
  "tableId": 6,
  "notes": "Moved to table 6"
  // ... (full updated order)
}
```

---

### 8. Cancel Order

**DELETE** `/pos/orders/:orderId`

Cancels an order (marks as cancelled, not hard delete).

**Response (200):**

```json
{
  "id": 1001,
  "status": "CANCELLED"
  // ... (cancelled order)
}
```

**Business Rules:**

- Cannot cancel completed orders
- Cancelling an order in PREPARING/COOKING may require kitchen confirmation
- Refund issued if order was partially/fully paid

---

## Order Modification Endpoints

### 9. Add Item to Order

**POST** `/pos/orders/:id/items`

Adds a new item to an existing order.

**Request Body:**

```json
{
  "productId": 20,
  "productName": "Caesar Salad",
  "quantity": 1,
  "unitPrice": 8.99,
  "notes": "Dressing on the side",
  "modifiers": []
}
```

**Response (201):**

```json
{
  "id": 1001,
  "items": [
    // ... existing items
    {
      "id": 5003,
      "productId": 20,
      "productName": "Caesar Salad",
      "quantity": 1,
      "unitPrice": 8.99,
      "subtotal": 8.99,
      "notes": "Dressing on the side"
    }
  ],
  "subtotal": 46.45, // Recalculated
  "taxAmount": 3.72,
  "totalAmount": 50.17
}
```

**Business Rules:**

- ✅ Can add items to CREATED or PREPARING orders
- ❌ Cannot add items to COMPLETED orders
- ✅ Totals recalculated automatically
- ✅ Modification logged in audit trail

---

### 10. Remove Item from Order

**DELETE** `/pos/orders/:id/items/:itemId?reason=Customer%20changed%20mind`

Removes an item from the order.

**Query Parameters:**

- `reason` - Reason for removal (optional but recommended)
- `forceRemove` - Skip kitchen confirmation (default: false)

**Response (200):**

```json
{
  "id": 1001,
  "items": [
    // Item removed, remaining items shown
  ],
  "subtotal": 28.48, // Recalculated
  "totalAmount": 31.73
}
```

**Business Rules:**

- ✅ Can remove items from CREATED orders freely
- ⚠️ Removing from PREPARING/COOKING orders may require kitchen confirmation
- ✅ Partial refund issued if order was paid
- ✅ Modification logged with reason

**Error Responses:**

```json
// 409 Conflict - Kitchen confirmation required
{
  "statusCode": 409,
  "message": "Kitchen confirmation required to remove item that is already being prepared"
}
```

---

### 11. Update Item Quantity

**PATCH** `/pos/orders/:id/items/:itemId/quantity`

Changes the quantity of an existing item.

**Request Body:**

```json
{
  "quantity": 3,
  "reason": "Customer ordered one more"
}
```

**Response (200):**

```json
{
  "id": 1001,
  "items": [
    {
      "id": 5001,
      "quantity": 3, // Updated
      "subtotal": 38.97 // Recalculated (12.99 * 3)
      // ...
    }
  ],
  "totalAmount": 55.2
}
```

**Business Rules:**

- ✅ Quantity must be ≥ 1 (use remove endpoint to delete item entirely)
- ✅ Price stays the same, only quantity changes
- ✅ Total recalculated automatically

---

### 12. Update Item Notes

**PATCH** `/pos/orders/:id/items/:itemId/notes`

Updates special instructions for a specific item.

**Request Body:**

```json
{
  "notes": "Well done, extra crispy",
  "reason": "Customer clarified preferences"
}
```

**Response (200):**

```json
{
  "id": 1001,
  "items": [
    {
      "id": 5001,
      "notes": "Well done, extra crispy"
      // ...
    }
  ]
}
```

---

### 13. Split Order

**POST** `/pos/orders/:id/split`

Splits one order into two separate orders.

**Request Body:**

```json
{
  "itemsToSplit": [
    {
      "orderItemId": 5001,
      "quantity": 1
    },
    {
      "orderItemId": 5002,
      "quantity": 2
    }
  ],
  "newOrderNotes": "Split bill - Person 2"
}
```

**Response (201):**

```json
[
  {
    "id": 1001, // Original order (modified)
    "items": [
      // Remaining items
    ],
    "totalAmount": 20.0
  },
  {
    "id": 1003, // New order created
    "orderNumber": "ORD-1003",
    "items": [
      // Split items
    ],
    "totalAmount": 30.46,
    "notes": "Split bill - Person 2"
  }
]
```

**Business Rules:**

- ✅ Original order keeps remaining items
- ✅ New order created with split items
- ✅ If original order had payments, they're redistributed proportionally
- ❌ Cannot split completed orders
- ❌ Cannot split if fully paid (must refund first)

---

### 14. Merge Orders

**POST** `/pos/orders/merge`

Merges multiple orders into one target order.

**Request Body:**

```json
{
  "targetOrderId": 1001,
  "sourceOrderIds": [1002, 1003],
  "mergeNotes": "Tables 5 and 6 joined"
}
```

**Response (201):**

```json
{
  "id": 1001, // Target order
  "items": [
    // All items from source orders now here
  ],
  "totalAmount": 95.5, // Combined total
  "notes": "Tables 5 and 6 joined"
}
```

**Business Rules:**

- ✅ All items transferred to target order
- ✅ Source orders marked as "merged" and completed
- ✅ Payments from source orders transferred to target
- ❌ Cannot merge orders from different branches
- ❌ Cannot merge if tenants don't match

---

### 15. Get Modification History

**GET** `/pos/orders/:id/modifications`

Retrieves complete audit trail of all changes made to an order.

**Response (200):**

```json
[
  {
    "id": 1,
    "orderId": 1001,
    "modificationType": "ITEM_ADDED",
    "description": "Added Caesar Salad (x1)",
    "modifiedBy": 12,
    "modifiedAt": "2025-01-26T12:45:00Z",
    "reason": "Customer ordered additional item"
  },
  {
    "id": 2,
    "orderId": 1001,
    "modificationType": "ITEM_REMOVED",
    "description": "Removed French Fries (x1)",
    "modifiedBy": 12,
    "modifiedAt": "2025-01-26T12:50:00Z",
    "reason": "Customer changed mind"
  },
  {
    "id": 3,
    "orderId": 1001,
    "modificationType": "QUANTITY_UPDATED",
    "description": "Updated Cheeseburger quantity from 2 to 3",
    "modifiedBy": 12,
    "modifiedAt": "2025-01-26T12:55:00Z"
  }
]
```

**Use Case:**

- Review what changed and why
- Investigate discrepancies
- Audit trail for accounting
- Manager review of suspicious modifications

---

## Order Templates

### 16. Get Active Templates

**GET** `/pos/orders/templates?branchId=1`

Retrieves all active order templates.

**Response (200):**

```json
[
  {
    "id": 10,
    "name": "Breakfast Combo",
    "description": "Scrambled eggs, toast, orange juice",
    "isActive": true,
    "branchId": null, // Tenant-wide
    "items": [
      {
        "productId": 5,
        "productName": "Scrambled Eggs",
        "quantity": 2,
        "unitPrice": 4.99
      },
      {
        "productId": 8,
        "productName": "Toast",
        "quantity": 1,
        "unitPrice": 2.0
      },
      {
        "productId": 12,
        "productName": "Orange Juice",
        "quantity": 1,
        "unitPrice": 3.99
      }
    ],
    "estimatedTotal": 12.99
  }
]
```

---

### 17. Create Order from Template

**POST** `/pos/orders/from-template/:id`

Creates a new order using a predefined template.

**Request Body:**

```json
{
  "branchId": 1,
  "tableId": 5,
  "customerId": 123,
  "notes": "Quick order from template"
}
```

**Response (201):**

```json
{
  "id": 1004,
  "orderNumber": "ORD-1004",
  "items": [
    // All template items automatically added
  ],
  "totalAmount": 12.99
}
```

**Business Rules:**

- ✅ All template items added automatically
- ✅ Prices captured from template (or current menu prices)
- ✅ Can modify order after creation (add/remove items)

---

## UI/UX Flows

### Flow 1: Creating a New Order

**Screen: POS Order Entry**

1. **Cashier taps "New Order"**

   - System checks for active shift (must exist)
   - Show order entry screen

2. **Select delivery type**

   - Dine-in (TABLE) → Show table selector
   - Takeaway (PICKUP) → No table needed
   - Delivery (DELIVERY) → Show delivery address form

3. **Add items to cart**

   - Search or browse menu
   - Tap product → Add to cart
   - Adjust quantity (+ / - buttons)
   - Add modifiers (e.g., "Extra Cheese", "No Pickles")
   - Add item notes (e.g., "Well done")

4. **Review order**

   - Show cart with all items
   - Display subtotal, tax, service charge, total
   - Option to add order notes

5. **Submit order**
   - Frontend calls `POST /pos/orders`
   - Display confirmation: "Order #1001 created"
   - Navigate to order detail screen or back to dashboard

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  New Order - Table 5                ✕   │
├─────────────────────────────────────────┤
│  Delivery Type: [Dine-in] [Takeaway]   │
│                                         │
│  Cart (3 items)                         │
│  ┌─────────────────────────────────┐   │
│  │ 2x Cheeseburger      $25.98     │   │
│  │    + Extra Cheese    $ 1.50     │   │
│  │    "No pickles"                 │   │
│  │                     [- | 2 | +] │   │
│  │                                 │   │
│  │ 2x French Fries      $ 9.98     │   │
│  │                     [- | 2 | +] │   │
│  │                                 │   │
│  │ 1x Coke              $ 2.50     │   │
│  │                     [- | 1 | +] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Subtotal:           $37.46             │
│  Tax (8%):            $3.00             │
│  Service Charge:      $0.00             │
│  ─────────────────────────────         │
│  Total:              $40.46             │
│                                         │
│  Order Notes: ___________________       │
│                                         │
│         [Add Item]  [Submit Order]     │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 2: Using Order Templates

**Screen: POS Dashboard**

1. **Cashier taps "Templates" button**

   - Frontend calls `GET /pos/orders/templates`
   - Display grid of available templates

2. **Select template (e.g., "Breakfast Combo")**

   - Show template details (items, total)
   - Confirm dialog: "Create order from template?"

3. **Confirm and customize**

   - Frontend calls `POST /pos/orders/from-template/:id`
   - Order created with template items
   - Can still add/remove items before submitting

4. **Submit order**
   - Same flow as regular order creation

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Order Templates                    ✕   │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │Breakfast │  │  Lunch   │           │
│  │  Combo   │  │  Special │           │
│  │          │  │          │           │
│  │ $12.99   │  │ $15.99   │           │
│  └──────────┘  └──────────┘           │
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │ Family   │  │  Happy   │           │
│  │  Meal    │  │   Hour   │           │
│  │          │  │          │           │
│  │ $45.00   │  │  $8.99   │           │
│  └──────────┘  └──────────┘           │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 3: Modifying an Order (Add Item)

**Screen: Order Detail**

1. **Cashier views order #1001**

   - Display all order details
   - Status: CREATED or PREPARING

2. **Tap "Add Item" button**

   - Show menu/product picker
   - Select product (e.g., "Caesar Salad")
   - Add quantity, modifiers, notes

3. **Confirm addition**

   - Frontend calls `POST /pos/orders/1001/items`

   ```json
   {
     "productId": 20,
     "productName": "Caesar Salad",
     "quantity": 1,
     "unitPrice": 8.99
   }
   ```

4. **Success**
   - Order refreshed with new item
   - Total updated automatically
   - Show toast: "Item added successfully"

---

### Flow 4: Split Order

**Screen: Order Detail - Table 5**

1. **Customer requests separate bills**

   - Order #1001 has 4 items, 2 people dining

2. **Cashier taps "Split Order"**

   - Show item selection screen
   - Checkboxes next to each item
   - Select items for Person 2

3. **Select items to split**

   - ✓ 1x Cheeseburger
   - ✓ 1x Fries
   - ✗ 2x Salad (stays with Person 1)

4. **Confirm split**

   - Frontend calls `POST /pos/orders/1001/split`

   ```json
   {
     "itemsToSplit": [
       { "orderItemId": 5001, "quantity": 1 },
       { "orderItemId": 5002, "quantity": 1 }
     ],
     "newOrderNotes": "Split bill - Person 2"
   }
   ```

5. **Result**
   - Original order (1001): 2x Salad = $20.00
   - New order (1003): 1x Burger + 1x Fries = $20.46
   - Display both orders for payment

**UI Mockup:**

```
┌─────────────────────────────────────────┐
│  Split Order #1001                  ✕   │
├─────────────────────────────────────────┤
│                                         │
│  Select items for new order:            │
│                                         │
│  ☑ 1x Cheeseburger      $12.99         │
│  ☑ 1x French Fries      $ 4.99         │
│  ☐ 2x Caesar Salad      $17.98         │
│  ☐ 1x Coke              $ 2.50         │
│                                         │
│  ─────────────────────────────         │
│  Moving to new order:   $17.98         │
│  Remaining in original: $20.48         │
│                                         │
│  New Order Notes: ___________________   │
│                                         │
│         [Cancel]  [Split Order]        │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flow 5: Merge Orders

**Screen: Table Management - Tables 5 and 6**

1. **Two tables want to join**

   - Table 5 has Order #1001
   - Table 6 has Order #1002

2. **Cashier taps "Merge Tables"**

   - Select target table (Table 5)
   - Select source table(s) (Table 6)

3. **Confirm merge**

   - Frontend calls `POST /pos/orders/merge`

   ```json
   {
     "targetOrderId": 1001,
     "sourceOrderIds": [1002],
     "mergeNotes": "Tables 5 & 6 joined"
   }
   ```

4. **Result**
   - All items from Table 6 moved to Table 5's order
   - Order #1002 marked as merged
   - Combined total shown for Table 5

---

## Common Questions

### Q1: What's the difference between order notes and customer notes?

**A:**

- **Order Notes**: Internal notes for staff (e.g., "Rush order", "VIP customer")
- **Customer Notes**: Special requests from customer (e.g., "Allergic to peanuts", "Extra napkins")

Both are optional, but customer notes may be printed on kitchen tickets.

### Q2: Why do order items store product name and price?

**A:** Order items capture a **snapshot** of the product at the time of ordering. Even if the product is deleted or price changes later, the order remains accurate for accounting purposes.

### Q3: Can I modify an order that's already sent to the kitchen?

**A:** Yes, but:

- Adding items: Usually allowed, new items sent to kitchen
- Removing items: May require kitchen confirmation to avoid waste
- Quantity changes: Depends on order status (CREATED = easy, COOKING = requires confirmation)

### Q4: What happens if I cancel an order that's partially paid?

**A:** The system issues a refund for the paid amount. This is logged in the payment transactions for accounting.

### Q5: Can I split an order that has payments?

**A:** Yes, but payments are redistributed proportionally between the two orders based on the split amounts.

### Q6: Why use order templates instead of just saving favorite items?

**A:** Templates allow:

- Predefined combinations with special pricing
- One-tap ordering for common combos
- Consistent preparation (kitchen knows this combo)
- Faster service during rush hours

### Q7: What does "modification logged" mean?

**A:** Every change to an order (add item, remove item, quantity change, split, merge) is recorded in the `OrderModification` table with:

- What changed
- Who made the change
- When it happened
- Why it happened (reason field)

This provides a complete audit trail.

### Q8: Can I create an order without a customer?

**A:** Yes, `customerId` is optional. Anonymous orders (quick takeaway) don't require customer information.

### Q9: What's the difference between SENT and COMPLETED status?

- **SENT**: Order delivered to customer, but payment not confirmed yet (optional status)
- **COMPLETED**: Order fully paid and closed (final status)

### Q10: Can WebApp customers modify their orders?

**A:** Yes, but through the WebApp API (`/webapp/orders/*`), not POS API. WebApp orders have different modification rules (e.g., time limits, cancellation fees).

---

## Frontend Implementation Guide

### 1. **Order Context Provider**

```typescript
interface OrderContextType {
  currentOrders: OrderResponseDto[]
  activeOrders: OrderResponseDto[]
  isLoading: boolean
  createOrder: (data: CreateOrderDto) => Promise<OrderResponseDto>
  addItem: (orderId: number, item: AddOrderItemDto) => Promise<void>
  removeItem: (
    orderId: number,
    itemId: number,
    reason?: string
  ) => Promise<void>
  splitOrder: (orderId: number, data: SplitOrderDto) => Promise<void>
  refreshOrders: () => Promise<void>
}
```

### 2. **Order Status Badge Component**

```typescript
function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const colors = {
    CREATED: 'blue',
    PREPARING: 'yellow',
    COOKING: 'orange',
    READY: 'green',
    SENT: 'purple',
    COMPLETED: 'gray'
  };

  return (
    <Badge color={colors[status]}>
      {status}
    </Badge>
  );
}
```

### 3. **Order Item with Modifiers**

```typescript
function OrderItemDisplay({ item }: { item: OrderItem }) {
  return (
    <div>
      <div className="item-main">
        {item.quantity}x {item.productName} - ${item.subtotal}
      </div>
      {item.modifiers?.map(mod => (
        <div key={mod.id} className="modifier">
          + {mod.modifierName} (${mod.unitPrice})
        </div>
      ))}
      {item.notes && (
        <div className="notes">
          📝 {item.notes}
        </div>
      )}
    </div>
  );
}
```

### 4. **Real-time Total Calculation**

```typescript
function calculateOrderTotal(
  items: CreateOrderItemDto[],
  taxRate: number,
  serviceChargeRate: number
) {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice
    const modifiersTotal = (item.modifiers || []).reduce(
      (modSum, mod) => modSum + mod.quantity * mod.unitPrice,
      0
    )
    return sum + itemTotal + modifiersTotal
  }, 0)

  const taxAmount = subtotal * (taxRate / 100)
  const serviceChargeAmount = subtotal * (serviceChargeRate / 100)
  const totalAmount = subtotal + taxAmount + serviceChargeAmount

  return { subtotal, taxAmount, serviceChargeAmount, totalAmount }
}
```

### 5. **Optimistic UI Updates**

```typescript
async function addItemToOrder(orderId: number, item: AddOrderItemDto) {
  // Optimistically update UI
  const optimisticItem = { ...item, id: Date.now() }
  setOrders((prev) =>
    prev.map((order) =>
      order.id === orderId
        ? { ...order, items: [...order.items, optimisticItem] }
        : order
    )
  )

  try {
    // Make API call
    const updated = await api.post(`/pos/orders/${orderId}/items`, item)
    // Replace with server response
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
  } catch (error) {
    // Rollback on error
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.filter((i) => i.id !== optimisticItem.id),
            }
          : order
      )
    )
    showError('Failed to add item')
  }
}
```

---

## Testing Checklist

- [ ] Create order with active shift
- [ ] Create order without active shift (should fail for POS orders)
- [ ] Add items with modifiers
- [ ] Remove items from CREATED order
- [ ] Remove items from PREPARING order (should require confirmation)
- [ ] Update item quantity
- [ ] Update item notes
- [ ] Change order status through lifecycle (CREATED → PREPARING → COOKING → READY → COMPLETED)
- [ ] Split order with 2+ items
- [ ] Split order with payments (should redistribute)
- [ ] Merge two orders from same branch
- [ ] Merge orders from different branches (should fail)
- [ ] Create order from template
- [ ] Get orders for specific table
- [ ] Get active orders
- [ ] Cancel order
- [ ] View modification history
- [ ] Calculate totals correctly (subtotal + tax + service charge)

---

## Summary

Orders are the core transaction entity in the POS system. They:

1. **Must belong to a shift** (for POS orders) to ensure accountability
2. **Capture price snapshots** to remain accurate even if menu changes
3. **Support flexible modifications** with full audit trails
4. **Enable split/merge operations** for complex dining scenarios
5. **Integrate with templates** for fast ordering
6. **Track status through lifecycle** from creation to completion

Frontend must handle real-time updates, optimistic UI, and provide clear feedback for all modifications.
