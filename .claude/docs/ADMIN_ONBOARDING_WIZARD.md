# Admin Panel — Onboarding Wizard (7-Step Setup)

This document explains the complete onboarding wizard that new restaurant owners complete after signup to configure their restaurant for launch.

**Note**: The system implements a 7-step flow including registration completion, business identity, branch setup, menu template, payment setup, staff invitation, and go live

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Onboarding Progress Tracking](#onboarding-progress-tracking)
3. [Step 0: Registration Complete](#step-0-registration-complete)
4. [Step 1: Business Identity](#step-1-business-identity)
5. [Step 2: Branch Setup](#step-2-branch-setup)
6. [Step 3: Menu Template](#step-3-menu-template)
7. [Step 4: Payment Methods](#step-4-payment-methods)
8. [Step 5: Invite Staff (Optional)](#step-5-invite-staff-optional)
9. [Step 6: Go Live](#step-6-go-live)
10. [Frontend Implementation Guide](#frontend-implementation-guide)
11. [API Endpoints](#api-endpoints)

---

## Overview

### 🎯 Purpose

The onboarding wizard helps new restaurant owners:
- Configure their restaurant in 10-15 minutes
- Understand what settings are available
- Launch with sensible defaults
- Start taking orders quickly

### 🚀 Why Onboarding Wizard?

**Without wizard**:
- Owner confused by all settings
- Doesn't know where to start
- Takes hours to configure
- High abandonment rate

**With wizard**:
- Step-by-step guided process
- Clear instructions for each step
- Can skip optional steps
- Gets to working system fast

### 📊 Wizard Steps

```
After Signup:
   ↓
Step 0: Registration Complete (Auto)
   → Account created with OTP verification
   ↓
Step 1: Business Identity (Required)
   → Business name, type, slug, logo
   ↓
Step 2: Branch Setup (Required)
   → Branch name, address, region, city
   → Operating hours, service types (dine-in/delivery/takeaway)
   ↓
Step 3: Menu Template (Required)
   → Select from pre-made templates or start from scratch
   ↓
Step 4: Payment Methods (Optional)
   → Configure Payme/Click integration or skip
   ↓
Step 5: Invite Staff (Optional)
   → Add employees or do it later
   ↓
Step 6: Go Live! (Complete)
   → Review settings and launch
   ↓
Dashboard (System Ready)
```

### ⏱️ Expected Time

- **Minimum (skip optionals)**: 5 minutes
- **Complete (all steps)**: 10-15 minutes
- **With menu customization**: 20-30 minutes

---

## Onboarding Progress Tracking

### Progress Bar UI

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Setting up Samarkand Restaurant                │
│                                                 │
│  Step 2 of 7                                    │
│  ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░ 29%           │
│                                                 │
│  ✓ Registration                                 │
│  ✓ Business Identity                            │
│  → Branch Setup (current)                       │
│    Menu Template                                │
│    Payment Methods                              │
│    Invite Staff                                 │
│    Go Live                                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Get Progress API

**API Call**:
```
GET /admin/onboarding/progress
Headers: Authorization: Bearer {token}

Response:
{
  "currentStep": "branch_setup",
  "completedSteps": [
    "registration_complete",
    "business_identity"
  ],
  "isCompleted": false,
  "completionPercentage": 29,
  "completedAt": null,
  "stepData": {
    "business_identity": {
      "completedAt": "2025-10-30T10:30:00Z",
      "businessName": "Golden Dragon Restaurant",
      "businessType": "restaurant",
      "slug": "golden-dragon",
      "logoUrl": "https://cdn.oshlab.uz/tenants/logos/golden-dragon.png"
    }
  },
  "nextStep": "menu_template",
  "remainingSteps": [
    "branch_setup",
    "menu_template",
    "payment_setup",
    "staff_invited",
    "go_live"
  ],
  "createdAt": "2025-10-30T09:00:00Z",
  "updatedAt": "2025-10-30T10:30:00Z"
}
```

---

## Step 0: Registration Complete

This step is **automatically completed** during the signup process (`POST /auth/register/complete`).

**What Gets Created**:
- Tenant entity with business name from OTP request
- Default Branch entity
- Owner Employee record with Admin role
- OnboardingProgress entity with `registration_complete` step marked

This step is not user-facing in the wizard - users land directly on Step 1 after signup.

---

## Step 1: Business Identity

### Purpose

Set up the business identity including:
- Business name and type
- Tenant slug (for URLs)
- Business logo
- Public-facing branding

### UI Form

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Step 1: Set up your business identity         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Business Name *                                │
│  ┌───────────────────────────────────────┐    │
│  │ Golden Dragon Restaurant               │    │
│  └───────────────────────────────────────┘    │
│  ℹ️  This is your public-facing business name   │
│                                                 │
│  Business Type *                                │
│  ○ Restaurant                                   │
│  ○ Cafe                                         │
│  ○ Fast Food                                    │
│  ○ Bar                                          │
│  ○ Bakery                                       │
│  ○ Food Truck                                   │
│  ○ Catering                                     │
│  ○ Other                                        │
│                                                 │
│  Business Slug *                                │
│  ┌───────────────────────────────────────┐    │
│  │ golden-dragon                          │    │
│  └───────────────────────────────────────┘    │
│  ℹ️  Used in URLs: golden-dragon.oshlab.uz     │
│                                                 │
│  Business Logo (optional)                       │
│  [📁 Upload Logo]                              │
│  ℹ️  PNG or JPG, max 2MB                        │
│                                                 │
│  [Skip for Now]           [ Next Step → ]      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Call

```
POST /admin/onboarding/steps/business-identity
Headers: Authorization: Bearer {token}

{
  "businessName": "Golden Dragon Restaurant",
  "businessType": "restaurant",
  "slug": "golden-dragon",
  "logoUrl": "https://cdn.oshlab.uz/tenants/logos/golden-dragon.png"
}

Response:
{
  "message": "Business identity updated successfully"
}
```

**Validation**:
- `businessName`: Required, 2-255 characters
- `businessType`: Required, enum (restaurant, cafe, fast_food, bar, bakery, food_truck, catering, other)
- `slug`: Required, 3-50 characters, lowercase alphanumeric with hyphens, must be unique
- `logoUrl`: Optional string

**What Happens**:
- Updates Tenant entity (name, businessType, slug)
- Stores metadata in stepData (completedAt)
- Marks `business_identity` step as complete
- Moves to `branch_setup` step

---

## Step 2: Branch Setup

### Purpose

Configure the default branch (created during signup) with:
- Branch name and address
- Region and city
- Operating hours
- Service types (dine-in, takeaway, delivery)

### UI Form

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Step 2: Configure your branch                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Branch Name *                                  │
│  ┌───────────────────────────────────────┐    │
│  │ Samarkand Restaurant (Main Branch)     │    │
│  └───────────────────────────────────────┘    │
│  ℹ️  You can add more branches later            │
│                                                 │
│  Branch Address                                 │
│  ┌───────────────────────────────────────┐    │
│  │ Same as business address               │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Region (Optional)                              │
│  ┌───────────────────────────────────────┐    │
│  │ Tashkent Region                        │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  City (Optional)                                │
│  ┌───────────────────────────────────────┐    │
│  │ Tashkent                               │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Service Types *                                │
│  ☑ Dine-in (table service)                     │
│  ☑ Takeaway (pickup orders)                    │
│  ☐ Delivery (door-to-door)                     │
│                                                 │
│  Operating Hours *                              │
│  ┌─────────────────────────────────────┐      │
│  │ Monday     09:00 - 22:00   [✓]      │      │
│  │ Tuesday    09:00 - 22:00   [✓]      │      │
│  │ Wednesday  09:00 - 22:00   [✓]      │      │
│  │ Thursday   09:00 - 22:00   [✓]      │      │
│  │ Friday     09:00 - 23:00   [✓]      │      │
│  │ Saturday   09:00 - 23:00   [✓]      │      │
│  │ Sunday     09:00 - 22:00   [✓]      │      │
│  └─────────────────────────────────────┘      │
│  [Copy to All Days]                             │
│                                                 │
│  [← Back]                     [ Next Step → ]  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Call

```
POST /admin/onboarding/steps/branch-setup
Headers: Authorization: Bearer {token}

{
  "branchName": "Main Branch",
  "address": "Tashkent, Amir Temur street 15",
  "region": "Tashkent Region",
  "city": "Tashkent",
  "businessHours": {
    "monday": { "open": "09:00", "close": "22:00" },
    "tuesday": { "open": "09:00", "close": "22:00" },
    "wednesday": { "open": "09:00", "close": "22:00" },
    "thursday": { "open": "09:00", "close": "22:00" },
    "friday": { "open": "09:00", "close": "23:00" },
    "saturday": { "open": "10:00", "close": "23:00" },
    "sunday": { "open": "10:00", "close": "22:00" }
  },
  "deliveryEnabled": true,
  "dineInEnabled": true,
  "takeawayEnabled": true
}

Response:
{
  "message": "Branch setup updated successfully"
}
```

**All fields are optional** - updates the default branch created during registration.

**What Happens**:
- Updates default Branch entity (name, address, region, city)
- Saves business hours to Settings (`branch.business_hours`)
- Saves service types to Settings (`branch.service_types`)
- Stores metadata in stepData (branchId, completedAt)
- Marks `branch_setup` step as complete
- Moves to `menu_template` step

### Why Service Types Matter?

**Dine-in**:
- Enables table/hall management
- Adds service charge option
- Shows table session features

**Takeaway**:
- Simpler order flow (no table)
- Usually no service charge
- Faster checkout

**Delivery**:
- Enables delivery address fields
- Adds delivery fee configuration
- Shows delivery radius settings

**Operating Hours**:
- Prevents orders outside business hours
- Shown to customers in webapp/QR menu
- Used for reporting and analytics

---

## Step 3: Menu Template

### Purpose

Quickly populate menu with pre-configured defaults based on business type or start from scratch.

### UI Flow

**Option 1: Load Defaults** → **Option 2: Customize Menu** → **Submit**

### UI Screen

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Step 3: Setup your menu                       │
│                                                 │
│  Load defaults for your business type or build │
│  your own menu from scratch.                    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Your Business Type: Restaurant                 │
│                                                 │
│  [Load Default Restaurant Menu]                │
│                                                 │
│  ─────────── OR ───────────                    │
│                                                 │
│  [Start with Empty Menu]                        │
│                                                 │
│  ────────────────────────────────────          │
│                                                 │
│  Current Menu (3 categories, 12 products):      │
│                                                 │
│  📁 Appetizers (4 products)                     │
│     • Spring Rolls - 18,000 UZS                 │
│     • Bruschetta - 25,000 UZS                   │
│     • Hummus Plate - 22,000 UZS                 │
│     • Garlic Bread - 15,000 UZS                 │
│                                                 │
│  📁 Main Courses (6 products)                   │
│     • Plov - 35,000 UZS                         │
│     • Lagman - 32,000 UZS                       │
│     ... [Expand to see all]                     │
│                                                 │
│  📁 Desserts (2 products)                       │
│     • Tiramisu - 28,000 UZS                     │
│     • Ice Cream - 18,000 UZS                    │
│                                                 │
│  [ + Add Category ]  [ Edit Menu ]              │
│                                                 │
│  [← Back]  [Skip - Add Later]  [ Next Step → ] │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Calls

```
// 1. Get default products for business type
GET /admin/onboarding/default-products?businessType=restaurant
Headers: Authorization: Bearer {token}

Response:
{
  "categories": [
    {
      "name": "Main Dishes",
      "description": "Our main course offerings",
      "products": [
        {
          "name": "Pizza Margherita",
          "description": "Classic Italian pizza",
          "suggestedPrice": 25000,
          "image": "https://cdn.example.com/pizza.jpg",
          "preparationTime": 15,
          "calories": 280,
          "allergens": ["gluten", "dairy"]
        }
      ]
    }
  ]
}

// 2. Apply menu setup with custom/modified data
POST /admin/onboarding/steps/menu-setup
Headers: Authorization: Bearer {token}

{
  "categories": [
    {
      "name": "Pizzas",
      "description": "Italian classics",
      "products": [
        {
          "name": "Margherita",
          "price": 25000,
          "description": "Classic pizza with tomato sauce, mozzarella, and basil",
          "image": "https://cdn.example.com/margherita.jpg",
          "preparationTime": 15,
          "calories": 280,
          "allergens": ["gluten", "dairy"]
        },
        {
          "name": "Pepperoni",
          "price": 30000,
          "description": "Spicy pepperoni pizza"
        }
      ]
    }
  ]
}

Response:
{
  "success": true,
  "categoriesCreated": 1,
  "productsCreated": 2
}

// 3. Or skip this step
POST /admin/onboarding/steps/menu-skip
Headers: Authorization: Bearer {token}

Response: OnboardingProgressResponseDto with updated stepData
```

### Frontend Implementation Notes

1. **Load Defaults**: Call `GET /admin/onboarding/default-products?businessType=restaurant`
2. **Let User Customize**: Display defaults in editable form
3. **Submit Menu**: Send customized structure to `POST /admin/onboarding/steps/menu-setup`
4. **Or Skip**: Call `POST /admin/onboarding/steps/menu-skip` to start with empty menu

**Validation**:
- Categories array required (at least one)
- Each category must have name and products array
- Each product must have name and price (≥ 0)
- Optional fields: description, image, preparationTime, calories, allergens

**Error Handling**:
- 400 if branch setup not completed first

---

## Step 4: Payment Methods (Optional)

### Purpose

Configure payment gateway integrations (Payme, Click, Uzum) or skip for now.

**This step is OPTIONAL** - can be skipped using the skip-step endpoint.

### UI Form

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Step 4: Payment methods (Optional)            │
│                                                 │
│  Configure online payment gateways or skip and  │
│  accept only cash/card for now.                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Accepted by Default:                           │
│  ✓ Cash                                         │
│  ✓ Card (manual terminal)                       │
│                                                 │
│  ─────────────────────────────────────────      │
│                                                 │
│  Online Payment Gateways:                       │
│                                                 │
│  ☐ Payme                                        │
│     [Configure Payme Integration]               │
│                                                 │
│  ☐ Click                                        │
│     [Configure Click Integration]               │
│                                                 │
│  ☐ Uzum Bank                                    │
│     [Configure Uzum Integration]                │
│                                                 │
│  ℹ️  You can configure these later in Settings  │
│                                                 │
│  [← Back]  [Skip for Now]  [ Next Step → ]     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Payme Configuration Modal

```
┌─────────────────────────────────────────────────┐
│  Payme Integration Setup                    × │
├─────────────────────────────────────────────────┤
│                                                 │
│  To accept Payme payments, you need:            │
│  1. Payme merchant account                      │
│  2. Merchant ID and Secret Key                  │
│                                                 │
│  Get these from:                                │
│  https://merchant.payme.uz                      │
│                                                 │
│  ─────────────────────────────────────────      │
│                                                 │
│  Merchant ID *                                  │
│  ┌───────────────────────────────────────┐    │
│  │ 5e730e8e0b852a417aa49ceb              │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Secret Key *                                   │
│  ┌───────────────────────────────────────┐    │
│  │ ••••••••••••••••••••                   │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Service ID *                                   │
│  ┌───────────────────────────────────────┐    │
│  │ 12345                                  │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  [ Test Connection ]                            │
│                                                 │
│  [ Cancel ]                    [ Save & Enable ]│
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Call

```
POST /admin/onboarding/steps/payment-setup
Headers: Authorization: Bearer {token}

{
  "paymeMerchantId": "628c8b3d9e1234567890abcd",
  "paymeSecretKey": "your-payme-secret-key",
  "clickMerchantId": "12345",
  "clickServiceId": "67890",
  "clickSecretKey": "your-click-secret-key",
  "cashEnabled": true,
  "cardEnabled": true
}

Response: OnboardingProgressResponseDto

// Or skip this step
PATCH /admin/onboarding/skip-step
Headers: Authorization: Bearer {token}

{
  "step": "payment_setup",
  "reason": "Will configure later"
}

Response: OnboardingProgressResponseDto
```

**All fields are optional**. Stores payment methods configuration in stepData and marks step complete.

---

## Step 5: Invite Staff (Optional)

### Purpose

Add employee invitations for staff members.

**This step is OPTIONAL** - can be skipped using the skip-step endpoint.

### UI Form

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Step 5: Invite your team (Optional)           │
│                                                 │
│  Add employees who will use the POS system.     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Invited Staff (2):                             │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ Farrux Aliyev                       │      │
│  │ +998 90 987 65 43                   │      │
│  │ Role: Cashier                       │      │
│  │ Branch: Main Branch                 │      │
│  │ [Edit] [Remove]                     │      │
│  └─────────────────────────────────────┘      │
│                                                 │
│  ┌─────────────────────────────────────┐      │
│  │ Dilnoza Rahimova                    │      │
│  │ +998 93 123 45 67                   │      │
│  │ Role: Waiter                        │      │
│  │ Branch: Main Branch                 │      │
│  │ [Edit] [Remove]                     │      │
│  └─────────────────────────────────────┘      │
│                                                 │
│  [ + Add Another Employee ]                    │
│                                                 │
│  ℹ️  They'll receive SMS with login instructions│
│                                                 │
│  [← Back]  [Skip - Add Later]  [ Send Invites]│
│                                                 │
└─────────────────────────────────────────────────┘
```

### Add Employee Modal

```
┌─────────────────────────────────────────────────┐
│  Invite Employee                            × │
├─────────────────────────────────────────────────┤
│                                                 │
│  Full Name *                                    │
│  ┌───────────────────────────────────────┐    │
│  │ Farrux Aliyev                          │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Phone Number *                                 │
│  ┌───────────────────────────────────────┐    │
│  │ +998 │ 90 987 65 43                   │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Email (optional)                               │
│  ┌───────────────────────────────────────┐    │
│  │ farrux@example.com                     │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Role *                                         │
│  ┌───────────────────────────────────────┐    │
│  │ Cashier                    ▼           │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  ℹ️  Employees will be automatically assigned  │
│     to your default branch                      │
│                                                 │
│  [ Cancel ]                    [ Add Employee ] │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Call

```
POST /admin/onboarding/steps/staff-invite
Headers: Authorization: Bearer {token}

{
  "invitations": [
    {
      "fullName": "John Doe",
      "phone": "+998901234567",
      "email": "john.doe@example.com",
      "roleId": 2
    },
    {
      "fullName": "Jane Smith",
      "phone": "+998909876543",
      "roleId": 3
    }
  ]
}

Response: OnboardingProgressResponseDto

// Or skip this step
PATCH /admin/onboarding/skip-step
Headers: Authorization: Bearer {token}

{
  "step": "staff_invited",
  "reason": "Will add staff later"
}

Response: OnboardingProgressResponseDto
```

**Validation**:
- `fullName`: Required string
- `phone`: Required string (Uzbekistan format)
- `email`: Optional email
- `roleId`: Required number (role must exist)

**Note**: Currently stores invitation data in stepData. Full employee creation logic to be implemented.

---

## Step 6: Go Live

### Purpose

Complete the onboarding and mark tenant as fully operational.

### UI Screen

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  🎉 You're all set! Ready to go live?           │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Setup Summary:                                 │
│                                                 │
│  ✓ Business Information                         │
│    Samarkand Restaurant                         │
│    123 Amir Temur Street, Tashkent              │
│                                                 │
│  ✓ Branch Configured                            │
│    Main Branch                                  │
│    Open: Mon-Sun, 9 AM - 10 PM                  │
│    Services: Dine-in, Takeaway                  │
│                                                 │
│  ✓ Menu Ready                                   │
│    8 categories, 45 products                    │
│                                                 │
│  ✓ Payment Methods                              │
│    Cash, Card, Payme                            │
│                                                 │
│  ✓ Team Invited                                 │
│    2 employees invited                          │
│                                                 │
│  ─────────────────────────────────────────      │
│                                                 │
│  Next Steps:                                    │
│  1. Customize your menu                         │
│  2. Set up tables and halls                     │
│  3. Configure taxes and pricing                 │
│  4. Train your staff                            │
│                                                 │
│  [ Review Settings ]       [ Start Using POS ]  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Call

```
POST /admin/onboarding/complete
Headers: Authorization: Bearer {token}

Response: OnboardingProgressResponseDto
{
  "currentStep": "go_live",
  "completedSteps": [
    "registration_complete",
    "business_identity",
    "branch_setup",
    "menu_template",
    "payment_setup",
    "staff_invited",
    "go_live"
  ],
  "isCompleted": true,
  "completionPercentage": 100,
  "completedAt": "2025-10-30T11:15:00Z",
  ...
}
```

**Validation**: Checks all required steps are completed:
- `registration_complete`
- `business_identity`
- `branch_setup`
- `menu_template`

**Error**: 400 if missing required steps

---

## Frontend Implementation Guide

### Onboarding Wizard Component

**Implementation Requirements**:

1. **Progress Management**:
   - Fetch progress on mount using `GET /admin/onboarding/progress`
   - Redirect to dashboard if `isCompleted` is true
   - Display progress bar based on `completionPercentage` and `completedSteps`

2. **Step Routing**:
   - Use `progress.currentStep` to determine which step component to render
   - Map step values to components:
     - `registration_complete` → Skip (auto-completed)
     - `business_identity` → Business Identity Form
     - `branch_setup` → Branch Setup Form
     - `menu_template` → Menu Template Selector
     - `payment_setup` → Payment Methods Form
     - `staff_invited` → Staff Invite Form
     - `go_live` → Final Summary Screen

3. **Step Completion**:
   - POST to appropriate endpoint based on current step
   - Update local progress state with response
   - Show success notification
   - Handle errors appropriately

4. **Skip Functionality**:
   - PATCH to `/admin/onboarding/skip-step` with step name and reason
   - Only `payment_setup` and `staff_invited` can be skipped
   - Required steps (`business_identity`, `branch_setup`, `menu_template`) cannot be skipped
   - Update progress and move to next step on success

---

## API Endpoints

### Progress Tracking

```
// Get onboarding progress
GET /admin/onboarding/progress

// Complete specific steps
POST /admin/onboarding/steps/business-identity
POST /admin/onboarding/steps/branch-setup
POST /admin/onboarding/steps/menu-setup
POST /admin/onboarding/steps/menu-skip
POST /admin/onboarding/steps/payment-setup
POST /admin/onboarding/steps/staff-invite

// Skip optional step
PATCH /admin/onboarding/skip-step
Body: { step, reason }

// Complete entire onboarding
POST /admin/onboarding/complete
```

### Menu Defaults

```
// Get default products for business type
GET /admin/onboarding/default-products?businessType=restaurant
```

---

## Common Questions

### Q: Can I go back and change previous steps?

**Yes**. All settings can be modified later in:
- Business Settings
- Branch Management
- Menu Management
- Staff Management
- Payment Settings

Onboarding wizard is just for initial setup.

### Q: What happens if I close the browser during onboarding?

**Progress is saved**. When you log in again:
- You'll be redirected back to onboarding
- Progress bar shows where you left off
- All completed steps are saved
- You continue from where you stopped

### Q: Can I skip the entire onboarding?

**No**. Required steps must be completed:
- Business Identity
- Branch Setup
- Menu Template

Optional steps can be skipped:
- Payment Setup
- Staff Invites

### Q: What if I choose the wrong menu template?

**No problem**. After onboarding, you can:
- Edit all menu items
- Delete items you don't need
- Add new items
- Apply a different template
- Start from scratch

Templates are just a starting point.

### Q: Do I need to configure payment gateways during onboarding?

**No**. Payment gateways are optional. You can:
- Skip during onboarding
- Accept only cash/card initially
- Configure Payme/Click later in Settings
- Test without online payments first

---

## Next Steps

After completing onboarding:
1. Customize your menu (prices, descriptions, images)
2. Set up tables and halls (for dine-in)
3. Configure taxes and service charges
4. Add more staff if needed
5. Train employees on POS usage
6. Start taking orders!

For post-onboarding configuration, see:
- `ADMIN_MENU_MANAGEMENT.md`
- `ADMIN_STAFF_MANAGEMENT.md`
- `ADMIN_TAX_AND_PRICING.md`
