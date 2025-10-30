# Admin Panel — Tax & Pricing Configuration

This document explains how tax and service charge configuration works in OshLab, including tenant-level vs branch-level settings, order type filtering, and automatic calculation.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Concepts](#key-concepts)
3. [Tax Configuration](#tax-configuration)
4. [Service Charge Configuration](#service-charge-configuration)
5. [Order Calculation Flow](#order-calculation-flow)
6. [Frontend Implementation Guide](#frontend-implementation-guide)
7. [API Endpoints](#api-endpoints)

---

## Overview

### 🎯 Purpose

The tax and pricing system allows restaurant owners to:

- Configure taxes based on government regulations (VAT, sales tax, etc.)
- Add service charges (gratuity, delivery fees, etc.)
- Apply different rates for different order types (dine-in vs takeaway vs delivery)
- Override tenant-level settings at branch level for multi-location chains
- Preview total costs before creating orders

### 🌍 Real-World Use Cases

**Scenario 1: Simple Restaurant**

```
Single location in Tashkent
- VAT 15% on all orders
- Service charge 10% only for dine-in
```

**Scenario 2: Restaurant Chain**

```
3 branches in different cities
- Branch A (Tashkent): VAT 15%, service charge 10%
- Branch B (Bukhara): VAT 12%, service charge 5%
- Branch C (Samarkand): VAT 15%, no service charge
```

**Scenario 3: Food Delivery Platform**

```
Multiple restaurants on platform
- Dine-in: No delivery fee
- Takeaway: No delivery fee
- Delivery: 15,000 UZS flat fee + service charge 5%
```

---

## Key Concepts

### 1. Tax Configuration

**What is a tax?**

- A mandatory government-imposed charge on sales
- Examples: VAT (Value Added Tax), Sales Tax, GST
- Usually a percentage of the order subtotal
- Must be included in receipts for accounting/audit

**Tax Fields**:

```json
{
  "name": "VAT",
  "description": "Value Added Tax (15%)",
  "type": "percentage", // or "fixed"
  "value": 15.0, // 15% or fixed amount
  "isActive": true, // Currently enforced?
  "branchId": null, // null = tenant-level, or specific branch
  "orderTypes": ["dine_in", "takeaway", "delivery"],
  "appliesTo": "subtotal" // or "subtotal_with_service_charge"
}
```

### 2. Service Charge Configuration

**What is a service charge?**

- An optional fee added by the restaurant
- Examples: Gratuity/tip, delivery fee, packaging fee
- Can be percentage or fixed amount
- Not required by government (unlike tax)

**Service Charge Fields**:

```json
{
  "name": "Service Charge",
  "description": "10% gratuity for dine-in orders",
  "type": "percentage", // or "fixed"
  "value": 10.0,
  "isActive": true,
  "branchId": null,
  "orderTypes": ["dine_in"], // Only for dine-in
  "appliesTo": "subtotal"
}
```

### 3. Configuration Type: Percentage vs Fixed

**Percentage**:

```
value = 15.0  →  15% of base amount
Example: Order subtotal = 100,000 UZS
Tax = 100,000 × 0.15 = 15,000 UZS
```

**Fixed**:

```
value = 15000  →  15,000 UZS flat fee
Example: Delivery fee = 15,000 UZS (regardless of order size)
```

**When to use each?**

- Percentage: VAT, service charge % (scales with order size)
- Fixed: Delivery fee, packaging fee (same for all orders)

### 4. Tenant-Level vs Branch-Level

**Tenant-Level** (`branchId = null`):

- Applies to ALL branches by default
- Used for: VAT (same across all locations), standard service charge
- Example: "All branches must charge 15% VAT"

**Branch-Level** (`branchId = 123`):

- Applies ONLY to specific branch
- **Overrides tenant-level** for that branch
- Used for: Local taxes, branch-specific service charges
- Example: "Airport branch charges 20,000 UZS extra parking fee"

**Priority Rules**:

```
If branch-level config exists:
  → Use branch-level
Else:
  → Use tenant-level
```

### 5. Order Type Filtering

**Why filter by order type?**

Different order types have different pricing:

- **Dine-in**: Full service (service charge may apply)
- **Takeaway**: No service, less overhead (lower/no service charge)
- **Delivery**: Extra costs (delivery fee applies)

**Example Configuration**:

```json
// Service Charge #1: For dine-in only
{
  "name": "Table Service Charge",
  "value": 10.0,
  "type": "percentage",
  "orderTypes": ["dine_in"]       // Only dine-in orders
}

// Service Charge #2: For delivery only
{
  "name": "Delivery Fee",
  "value": 15000,
  "type": "fixed",
  "orderTypes": ["delivery"]      // Only delivery orders
}

// Tax: For all order types
{
  "name": "VAT",
  "value": 15.0,
  "type": "percentage",
  "orderTypes": ["dine_in", "takeaway", "delivery"]  // All types
}
```

### 6. AppliesTo: Calculation Base

**What does "appliesTo" mean?**

Determines what base amount to calculate from:

**Option 1: `appliesTo = "subtotal"`**

```
Subtotal:        100,000 UZS
Service Charge:   10,000 UZS (10% of subtotal)
Tax:              15,000 UZS (15% of subtotal)
                 ─────────────
Total:           125,000 UZS
```

**Option 2: `appliesTo = "subtotal_with_service_charge"`**

```
Subtotal:        100,000 UZS
Service Charge:   10,000 UZS (10% of subtotal)
                 ─────────────
Base for Tax:    110,000 UZS (subtotal + service charge)
Tax:              16,500 UZS (15% of 110,000)
                 ─────────────
Total:           126,500 UZS
```

**Which should I use?**

- Most countries: Tax applies to subtotal only → `"subtotal"`
- Some regions: Tax applies after service charge → `"subtotal_with_service_charge"`
- Check your local tax laws!

---

## Tax Configuration

### Setting Up Taxes

**Step 1: Determine Your Tax Requirements**

```
Questions to answer:
1. What taxes are required in your region?
   → VAT, Sales Tax, City Tax, etc.

2. What are the rates?
   → Example: VAT 15%, City Tax 2%

3. Do rates differ by order type?
   → Usually no, but some regions exempt takeaway from VAT

4. Do rates differ by branch location?
   → Yes, if branches are in different cities/regions
```

**Step 2: Create Tenant-Level Tax (Default for All Branches)**

```json
{
  "name": "VAT",
  "description": "National Value Added Tax (15%)",
  "type": "percentage",
  "value": 15.0,
  "isActive": true,
  "branchId": null, // Applies to all branches
  "orderTypes": ["dine_in", "takeaway", "delivery"],
  "appliesTo": "subtotal"
}
```

**Step 3: Create Branch-Level Tax Override (If Needed)**

```json
{
  "name": "VAT + City Tax",
  "description": "Tashkent VAT (15%) + City Tax (2%)",
  "type": "percentage",
  "value": 17.0, // Combined rate
  "isActive": true,
  "branchId": 10, // Only Branch A
  "orderTypes": ["dine_in", "takeaway", "delivery"],
  "appliesTo": "subtotal"
}
```

### Multiple Tax Components

**Scenario**: Separate VAT and City Tax

**Option 1: Combined (Simpler)**

```json
{
  "name": "VAT + City Tax",
  "value": 17.0,
  "type": "percentage"
}
```

**Option 2: Separate (More Detailed)**

```json
[
  {
    "name": "VAT",
    "value": 15.0,
    "type": "percentage"
  },
  {
    "name": "City Tax",
    "value": 2.0,
    "type": "percentage"
  }
]
```

**Which is better?**

- Separate: Better for accounting (itemized receipts)
- Combined: Simpler management
- Choose based on your accounting requirements

---

## Service Charge Configuration

### Common Service Charge Types

**1. Gratuity / Table Service**

```json
{
  "name": "Service Charge",
  "description": "10% gratuity for table service",
  "type": "percentage",
  "value": 10.0,
  "orderTypes": ["dine_in"], // Only dine-in
  "appliesTo": "subtotal"
}
```

**2. Delivery Fee**

```json
{
  "name": "Delivery Fee",
  "description": "Flat delivery charge",
  "type": "fixed",
  "value": 15000, // 15,000 UZS flat
  "orderTypes": ["delivery"], // Only delivery
  "appliesTo": "subtotal"
}
```

**3. Packaging Fee**

```json
{
  "name": "Packaging Fee",
  "description": "Takeaway packaging cost",
  "type": "fixed",
  "value": 2000, // 2,000 UZS per order
  "orderTypes": ["takeaway", "delivery"],
  "appliesTo": "subtotal"
}
```

**4. Peak Hours Surcharge**

```json
{
  "name": "Peak Hours Charge",
  "description": "5% surcharge during rush hours",
  "type": "percentage",
  "value": 5.0,
  "orderTypes": ["dine_in", "takeaway", "delivery"],
  "appliesTo": "subtotal",
  "isActive": false // Enable during peak hours only
}
```

### Toggling Service Charges

**Use Case**: Enable/disable charges without deleting them

**Example: Weekend Delivery Fee**

```
Monday-Friday:  isActive = false (no delivery fee)
Saturday-Sunday: isActive = true (20,000 UZS delivery fee)
```

**API Call**:

```typescript
// Enable charge
PATCH / admin / service - charges / 123 / toggle - active
// isActive flips from false → true

// Disable charge
PATCH / admin / service - charges / 123 / toggle - active
// isActive flips from true → false
```

---

## Order Calculation Flow

### How Totals Are Calculated

**Step-by-step calculation**:

```
1. Calculate Subtotal
   → Sum of all order items (product price × quantity)

2. Apply Service Charges
   → Filter by order type + branch
   → Calculate based on type (% or fixed)

3. Apply Taxes
   → Filter by order type + branch
   → Calculate based on appliesTo setting
   → If appliesTo = "subtotal": tax = subtotal × rate
   → If appliesTo = "subtotal_with_service_charge": tax = (subtotal + service) × rate

4. Calculate Final Total
   → Total = Subtotal + Service Charges + Taxes
```

### Example Calculation #1: Simple Dine-In

**Order**:

```
Subtotal: 100,000 UZS
Order Type: dine_in
Branch: Branch A
```

**Configurations**:

```json
// Service Charge
{
  "name": "Table Service",
  "type": "percentage",
  "value": 10.0,
  "orderTypes": ["dine_in"]
}

// Tax
{
  "name": "VAT",
  "type": "percentage",
  "value": 15.0,
  "appliesTo": "subtotal"
}
```

**Calculation**:

```
Subtotal:             100,000 UZS
Service Charge (10%):  10,000 UZS  (100,000 × 0.10)
VAT (15%):             15,000 UZS  (100,000 × 0.15)
                     ─────────────
Total:                125,000 UZS
```

### Example Calculation #2: Delivery Order

**Order**:

```
Subtotal: 50,000 UZS
Order Type: delivery
Branch: Branch A
```

**Configurations**:

```json
// Service Charge #1
{
  "name": "Delivery Fee",
  "type": "fixed",
  "value": 15000,
  "orderTypes": ["delivery"]
}

// Service Charge #2 (not applied - only for dine_in)
{
  "name": "Table Service",
  "type": "percentage",
  "value": 10.0,
  "orderTypes": ["dine_in"]
}

// Tax
{
  "name": "VAT",
  "type": "percentage",
  "value": 15.0,
  "appliesTo": "subtotal"
}
```

**Calculation**:

```
Subtotal:              50,000 UZS
Delivery Fee (fixed):  15,000 UZS  (flat fee)
VAT (15%):              7,500 UZS  (50,000 × 0.15)
                      ─────────────
Total:                 72,500 UZS
```

### Example Calculation #3: Tax After Service Charge

**Order**:

```
Subtotal: 100,000 UZS
Order Type: dine_in
Branch: Branch A
```

**Configurations**:

```json
// Service Charge
{
  "name": "Service Charge",
  "type": "percentage",
  "value": 10.0,
  "orderTypes": ["dine_in"]
}

// Tax (NOTE: appliesTo is different!)
{
  "name": "VAT",
  "type": "percentage",
  "value": 15.0,
  "appliesTo": "subtotal_with_service_charge"  // ← Applied after service charge
}
```

**Calculation**:

```
Subtotal:             100,000 UZS
Service Charge (10%):  10,000 UZS  (100,000 × 0.10)
                     ─────────────
Base for VAT:         110,000 UZS  (subtotal + service charge)
VAT (15%):             16,500 UZS  (110,000 × 0.15)
                     ─────────────
Total:                126,500 UZS
```

---

## Frontend Implementation Guide

### 1. Tax Configuration Page

**UI Layout**:

```
┌─────────────────────────────────────────────────┐
│  Tax Configurations        [+ Add Tax Config]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tenant-Level (All Branches):                  │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ 📄 VAT                              │      │
│  │    15% percentage                   │      │
│  │    Applies to: All order types      │      │
│  │    Status: ● Active                 │      │
│  │    [Edit] [Deactivate]              │      │
│  └─────────────────────────────────────┘      │
│                                                 │
│  Branch-Specific:                              │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ 📄 VAT + City Tax (Branch A)        │      │
│  │    17% percentage                   │      │
│  │    Applies to: All order types      │      │
│  │    Status: ● Active                 │      │
│  │    Overrides: VAT (tenant)          │      │
│  │    [Edit] [Deactivate] [Delete]     │      │
│  └─────────────────────────────────────┘      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Add/Edit Form**:

```
Tax Configuration Form:

Basic Information:
- Name: [VAT                    ]
- Description: [Value Added Tax (15%)]

Configuration:
- Type: ● Percentage  ○ Fixed Amount
- Value: [15.0        ] %

Scope:
- Level: ● All Branches (tenant-level)
         ○ Specific Branch: [Branch A ▼]

Order Types (select applicable):
☑ Dine-in
☑ Takeaway
☑ Delivery

Calculation:
- Applies To: ● Subtotal
              ○ Subtotal + Service Charge

Status:
- Active: ☑ (will be applied to new orders)

[Cancel] [Save Tax Configuration]
```

**API Calls**:

```typescript
// Get all taxes
GET /admin/tax-configurations
Query: ?branchId=10  (optional, for branch-specific)

// Create tax
POST /admin/tax-configurations
{
  "name": "VAT",
  "description": "Value Added Tax (15%)",
  "type": "percentage",
  "value": 15.0,
  "isActive": true,
  "branchId": null,
  "orderTypes": ["dine_in", "takeaway", "delivery"],
  "appliesTo": "subtotal"
}

// Update tax
PUT /admin/tax-configurations/123
{ ...updated fields }

// Toggle active status
PATCH /admin/tax-configurations/123/toggle-active

// Delete tax
DELETE /admin/tax-configurations/123
```

### 2. Service Charge Configuration Page

**UI Layout** (similar to tax page):

```
┌─────────────────────────────────────────────────┐
│  Service Charges           [+ Add Charge]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ 💰 Table Service (10%)              │      │
│  │    Applies to: Dine-in only         │      │
│  │    Status: ● Active                 │      │
│  │    [Edit] [Deactivate]              │      │
│  └─────────────────────────────────────┘      │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ 🚗 Delivery Fee (15,000 UZS)        │      │
│  │    Applies to: Delivery only        │      │
│  │    Status: ● Active                 │      │
│  │    [Edit] [Deactivate]              │      │
│  └─────────────────────────────────────┘      │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ 📦 Packaging Fee (2,000 UZS)        │      │
│  │    Applies to: Takeaway, Delivery   │      │
│  │    Status: ○ Inactive               │      │
│  │    [Edit] [Activate]                │      │
│  └─────────────────────────────────────┘      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Calls**:

```typescript
// Get all service charges
GET /admin/service-charges
Query: ?branchId=10  (optional)

// Create service charge
POST /admin/service-charges
{
  "name": "Delivery Fee",
  "description": "Flat delivery charge",
  "type": "fixed",
  "value": 15000,
  "isActive": true,
  "branchId": null,
  "orderTypes": ["delivery"],
  "appliesTo": "subtotal"
}

// Update service charge
PUT /admin/service-charges/123

// Toggle active status
PATCH /admin/service-charges/123/toggle-active

// Delete service charge
DELETE /admin/service-charges/123
```

### 3. Order Totals Preview/Calculator

**Use Case**: Let admin test their tax/charge configurations before applying

**UI**:

```
┌─────────────────────────────────────────────────┐
│  Order Totals Calculator                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Test Configuration:                            │
│                                                 │
│  Subtotal: [100000        ] UZS                 │
│  Branch: [Branch A ▼]                           │
│  Order Type: [Dine-in ▼]                        │
│                                                 │
│  [Calculate]                                    │
│                                                 │
│  ──────────────────────────────────────────    │
│  Results:                                       │
│  ──────────────────────────────────────────    │
│                                                 │
│  Subtotal:           100,000 UZS                │
│                                                 │
│  Service Charges:                               │
│    • Table Service:   10,000 UZS (10%)          │
│                      ─────────                  │
│  Total Service:       10,000 UZS                │
│                                                 │
│  Taxes:                                         │
│    • VAT:             15,000 UZS (15%)          │
│                      ─────────                  │
│  Total Tax:           15,000 UZS                │
│                                                 │
│  ════════════════════════════════               │
│  TOTAL:              125,000 UZS                │
│  ════════════════════════════════               │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Call**:

```typescript
// Calculate order totals preview
POST /admin/calculate-order-totals
{
  "subtotal": 100000,
  "branchId": 10,
  "orderType": "dine_in",
  "appliesTo": "subtotal"
}

Response:
{
  "subtotal": 100000,
  "serviceCharges": [
    {
      "name": "Table Service",
      "type": "percentage",
      "rate": 10.0,
      "amount": 10000
    }
  ],
  "totalServiceCharge": 10000,
  "taxes": [
    {
      "name": "VAT",
      "type": "percentage",
      "rate": 15.0,
      "amount": 15000,
      "appliedTo": "subtotal"
    }
  ],
  "totalTax": 15000,
  "total": 125000
}
```

### 4. Showing Totals in POS/Order Form

**When creating an order, show breakdown**:

```
┌─────────────────────────────────────────┐
│  Order #1234                            │
├─────────────────────────────────────────┤
│                                         │
│  Items:                                 │
│    2× Burger          40,000 UZS        │
│    1× Fries           15,000 UZS        │
│    2× Coke            10,000 UZS        │
│                                         │
│  ─────────────────────────────────      │
│  Subtotal:            65,000 UZS        │
│                                         │
│  Service Charge (10%): 6,500 UZS        │
│  VAT (15%):            9,750 UZS        │
│                                         │
│  ═════════════════════════════════      │
│  TOTAL:               81,250 UZS        │
│  ═════════════════════════════════      │
│                                         │
│  [Proceed to Payment]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## API Endpoints

### Tax Configuration

```typescript
// List taxes
GET /admin/tax-configurations
Query: ?branchId=10  (optional, filter by branch)

// Create tax
POST /admin/tax-configurations
Body: CreateTaxConfigurationDto

// Update tax
PUT /admin/tax-configurations/:id
Body: UpdateTaxConfigurationDto

// Delete tax
DELETE /admin/tax-configurations/:id

// Toggle active status
PATCH /admin/tax-configurations/:id/toggle-active
```

### Service Charge Configuration

```typescript
// List service charges
GET /admin/service-charges
Query: ?branchId=10  (optional)

// Create service charge
POST /admin/service-charges
Body: CreateServiceChargeConfigurationDto

// Update service charge
PUT /admin/service-charges/:id
Body: UpdateServiceChargeConfigurationDto

// Delete service charge
DELETE /admin/service-charges/:id

// Toggle active status
PATCH /admin/service-charges/:id/toggle-active
```

### Calculation Helper

```typescript
// Calculate order totals
POST /admin/calculate-order-totals
Body: {
  subtotal: number,
  branchId?: number,
  orderType?: 'dine_in' | 'takeaway' | 'delivery',
  appliesTo?: 'subtotal' | 'subtotal_with_service_charge'
}

Response: OrderTotalsResponseDto
```

---

## Common Questions

### Q: Can I have multiple taxes?

**Yes**. You can create multiple tax configurations, and they will all be applied to orders.

Example:

- VAT: 15%
- City Tax: 2%
- Both will be calculated and added to the order

### Q: What happens if I have both tenant-level and branch-level configs?

**Branch-level overrides tenant-level** for that specific branch.

Example:

```
Tenant-level: VAT 15%
Branch A override: VAT + City Tax 17%

→ Branch A orders: 17% tax
→ Branch B orders: 15% tax (uses tenant-level)
```

### Q: Can I temporarily disable a tax without deleting it?

**Yes**. Use the toggle-active endpoint.

```typescript
PATCH / admin / tax - configurations / 123 / toggle - active
```

This sets `isActive = false`, so it won't be applied to new orders, but the configuration remains in the system.

### Q: Should tax apply before or after service charge?

**It depends on your local regulations**. Use the `appliesTo` field:

- `"subtotal"` - Tax calculated on subtotal only
- `"subtotal_with_service_charge"` - Tax calculated after adding service charge

Most countries use `"subtotal"`, but some regions require tax after service charge.

### Q: Can I have order-type-specific taxes?

**Yes**. Use the `orderTypes` array.

Example: No tax on takeaway orders (tax-exempt):

```json
{
  "name": "VAT",
  "value": 15.0,
  "orderTypes": ["dine_in", "delivery"] // Exclude "takeaway"
}
```

### Q: How do I add a delivery fee that only applies to orders above a certain amount?

**Current system**: The API calculates based on subtotal, order type, and branch.

**For conditional fees** (minimum order amount, distance-based, etc.):

- You'll need to implement this logic in the frontend before calling the API
- Or create multiple configs and activate/deactivate programmatically

Example approach:

```typescript
if (orderSubtotal < 50000) {
  // Activate "Small Order Fee" config
  await activateServiceCharge(SMALL_ORDER_FEE_ID)
} else {
  // Deactivate it
  await deactivateServiceCharge(SMALL_ORDER_FEE_ID)
}
```

---

## Next Steps

After configuring taxes and service charges:

1. Test with the calculator endpoint to verify calculations
2. Create sample orders in POS to see actual receipts
3. Review receipts to ensure compliance with tax regulations
4. Train staff on how to explain charges to customers

For receipt customization, see:

- `ADMIN_RECEIPT_TEMPLATES.md` (future)

For POS order workflow, see:

- `POS_ORDER_MANAGEMENT.md`
- `POS_PAYMENT_PROCESSING.md`
