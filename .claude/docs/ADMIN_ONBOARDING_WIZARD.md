# Onboarding Wizard - Complete Step-by-Step Guide

This document covers every screen and case for the 6-step setup wizard after signup.

---

## Quick Summary

```
After Signup/Login
    |
    v
GET /admin/onboarding/progress
    |
    v
isCompleted = true?
    |
    +-- YES --> [Dashboard]
    |
    +-- NO --> Start at currentStep
                    |
    +---------------+---------------+
    |               |               |
    v               v               v
[Screen 1]    [Screen 2]    [Screen 3]
Business      Branch        Menu
Identity      Setup         Template
(Required)    (Required)    (Can Skip)
    |               |               |
    +---------------+---------------+
                    |
    +---------------+---------------+
    |               |               |
    v               v               v
[Screen 4]    [Screen 5]    [Screen 6]
Payment       Invite        Go Live
Methods       Staff         Review
(Can Skip)    (Can Skip)    (Required)
    |               |               |
    +---------------+---------------+
                    |
                    v
            [Dashboard]
```

---

## What is the Onboarding Wizard?

Think of it as a guided setup that ensures every new restaurant is properly configured before going live.

Steps overview:

| Step | Name | Required | What Gets Configured |
|------|------|----------|----------------------|
| 1 | Business Identity | Yes | Name, type, slug, logo |
| 2 | Branch Setup | Yes | Address, hours, service types |
| 3 | Menu Template | Can skip | Load defaults or start empty |
| 4 | Payment Methods | Can skip | Payme, Click integration |
| 5 | Invite Staff | Can skip | Create employee accounts |
| 6 | Go Live | Yes | Review and launch |

Why it matters for frontend:
- Must check onboarding status on every admin panel load
- Must prevent access to dashboard until onboarding complete
- Must track progress and allow navigation between completed steps
- Must handle step skipping for optional steps

---

## Screen 0: Onboarding Check (App Init)

### When to Show

This is NOT a visible screen. This is initialization logic that runs when:
- User logs in successfully
- User opens admin panel with valid session
- User navigates to any admin route

### Initialization Logic

```
Step 1: Check onboarding status
-------------------------------
CALL GET /admin/onboarding/progress

Step 2: Route based on status
-----------------------------
if response.isCompleted = true
    Allow access to requested route
    STOP

if response.isCompleted = false
    Store progress in app state
    GO TO: Screen for response.currentStep
```

### API Call

```
GET /admin/onboarding/progress

Headers:
- Authorization: Bearer {accessToken}

Response (200):
{
  "currentStep": "branch_setup",
  "completedSteps": ["registration_complete", "business_identity"],
  "isCompleted": false,
  "completionPercentage": 33,
  "completedAt": null,
  "nextStep": "branch_setup",
  "remainingSteps": ["branch_setup", "menu_template", "payment_setup", "staff_invited", "go_live"],
  "tenantId": 1,
  "branchId": null,
  "stepData": {
    "registration_complete": {
      "phone": "+998901234567",
      "email": "owner@example.com",
      "fullName": "John Doe",
      "businessName": "Golden Dragon",
      "completedAt": "2025-10-30T09:00:00Z"
    },
    "business_identity": {
      "completedAt": "2025-10-30T10:30:00Z"
    }
  },
  "createdAt": "2025-10-30T09:00:00Z",
  "updatedAt": "2025-10-30T10:30:00Z"
}
```

### Response Fields Explained

| Field | What It Means | Frontend Use |
|-------|---------------|--------------|
| `currentStep` | Step user should be on | Navigate to this step |
| `completedSteps` | Array of finished steps | Show checkmarks |
| `isCompleted` | All required steps done | Allow dashboard access |
| `completionPercentage` | 0-100 progress | Progress bar width |
| `nextStep` | Where to go after current | Navigation after submit |
| `branchId` | Available after step 2 | Needed for menu/staff APIs |
| `stepData` | Saved data per step | Pre-fill forms |
| `remainingSteps` | Steps not yet completed | Show in progress list |

---

## Progress Bar Component

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  Setting up Golden Dragon Restaurant          |
|                                               |
|  Step 2 of 6                                  |
|  [====--------] 33%                           |
|                                               |
|  [v] Business Identity                        |
|  [>] Branch Setup (current)                   |
|  [ ] Menu Template                            |
|  [ ] Payment Methods                          |
|  [ ] Invite Staff                             |
|  [ ] Go Live                                  |
|                                               |
+-----------------------------------------------+
```

### Step States

| State | Icon | Style |
|-------|------|-------|
| Completed | [v] | Green checkmark |
| Current | [>] | Blue highlight, bold text |
| Pending | [ ] | Gray, not clickable |
| Skipped | [-] | Gray checkmark (optional steps only) |

### Navigation Rules

```
Can user click on step?
-----------------------
if step is completed
    YES - allow navigation to review/edit

if step is current
    YES - already viewing

if step is pending
    NO - must complete previous steps first
```

---

## Screen 1: Business Identity

### When to Show

Show this screen when:
- `currentStep = "business_identity"`
- User clicks on completed "Business Identity" step to edit

Do NOT show when:
- Onboarding is already completed (unless reopening step)

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 1 of 6]                 |
|                                               |
|  Step 1: Set up your business identity        |
|  ------------------------------------         |
|                                               |
|  Business Name *                              |
|  +---------------------------------------+    |
|  | Golden Dragon Restaurant              |    |
|  +---------------------------------------+    |
|  This is your public-facing business name     |
|                                               |
|  Business Type *                              |
|  +---------------------------------------+    |
|  | Restaurant                          v |    |
|  +---------------------------------------+    |
|  Options: Restaurant, Cafe, Bar,             |
|  Bakery, Fast Food, Other                    |
|                                               |
|  Business Slug *                              |
|  +---------------------------------------+    |
|  | golden-dragon                         |    |
|  +---------------------------------------+    |
|  Your URL: golden-dragon.horyco.com           |
|                                               |
|  Business Logo (optional)                     |
|  +---------------------------------------+    |
|  |  [+] Upload Logo                      |    |
|  |  PNG or JPG, max 2MB                  |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |           [ Next Step ]               |    |  <- Disabled until valid
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Enter business name | Validate length (2-255) |
| Select business type | Store selection |
| Enter slug | Validate format |
| Upload logo | Upload to CDN, store URL |
| Click Next Step | Validate all, call API |

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Business Name | Required | "Business name is required" |
| Business Name | 2-255 characters | "Name must be 2-255 characters" |
| Business Type | Required | "Select a business type" |
| Slug | Required | "Slug is required" |
| Slug | 3-50 characters | "Slug must be 3-50 characters" |
| Slug | Lowercase, alphanumeric, hyphens only | "Only lowercase letters, numbers, and hyphens" |
| Slug | Format: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` | "Invalid slug format (no consecutive hyphens)" |
| Logo | Max 2MB | "File too large. Max 2MB." |
| Logo | PNG or JPG only | "Only PNG and JPG files allowed" |

### Business Types Available

| Value | Display Name |
|-------|--------------|
| `restaurant` | Restaurant |
| `cafe` | Cafe |
| `bar` | Bar |
| `bakery` | Bakery |
| `fast_food` | Fast Food |
| `other` | Other |

### API Call

```
POST /admin/onboarding/steps/business-identity

Headers:
- Authorization: Bearer {accessToken}
- Content-Type: application/json

Request Body:
{
  "businessName": "Golden Dragon Restaurant",
  "businessType": "restaurant",
  "slug": "golden-dragon",
  "logoUrl": "https://cdn.horyco.com/tenants/logos/golden-dragon.png"
}
```

### Handle Response

Success Response (200):
```
{
  "currentStep": "branch_setup",
  "completedSteps": ["registration_complete", "business_identity"],
  "isCompleted": false,
  "completionPercentage": 33,
  "nextStep": "branch_setup",
  "stepData": {
    "business_identity": {
      "completedAt": "2025-10-30T10:30:00Z"
    }
  },
  ...
}
```

### Decision Logic After Submit

```
Step 1: Update progress state
-----------------------------
Store response in onboarding state

Step 2: Navigate to next step
-----------------------------
GO TO: Screen 2 (Branch Setup)
```

### Error Handling

| Code | Response | What to Show |
|------|----------|--------------|
| 400 | `{"message": "Slug already taken"}` | Show field error: "This slug is already taken" |
| 400 | `{"message": "Invalid business type"}` | Show dropdown error |
| 409 | Conflict | Show error message from response |

### Loading State

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 1 of 6]                 |
|                                               |
|  Business Name *                              |
|  +---------------------------------------+    |
|  | Golden Dragon Restaurant              |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  Business Type *                              |
|  +---------------------------------------+    |
|  | Restaurant                          v |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |     [Spinner] Saving...               |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

---

## Screen 2: Branch Setup

### When to Show

Show this screen when:
- `currentStep = "branch_setup"`
- Step 1 (Business Identity) is completed

Do NOT show when:
- Step 1 is not completed

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 2 of 6]                 |
|                                               |
|  Step 2: Configure your branch                |
|  -----------------------------                |
|                                               |
|  Branch Name                                  |
|  +---------------------------------------+    |
|  | Main Branch                           |    |
|  +---------------------------------------+    |
|  You can add more branches later              |
|                                               |
|  Address                                      |
|  +---------------------------------------+    |
|  | Tashkent, Amir Temur street 15        |    |
|  +---------------------------------------+    |
|                                               |
|  Region                    City               |
|  +------------------+  +------------------+   |
|  | Tashkent Region v|  | Tashkent       v|   |
|  +------------------+  +------------------+   |
|                                               |
|  Service Types                                |
|  +---------------------------------------+    |
|  | [x] Dine-in (table service)           |    |
|  | [x] Takeaway (pickup orders)          |    |
|  | [ ] Delivery (door-to-door)           |    |
|  +---------------------------------------+    |
|                                               |
|  Operating Hours                              |
|  +---------------------------------------+    |
|  | Mon  [09:00] - [22:00]                |    |
|  | Tue  [09:00] - [22:00]                |    |
|  | Wed  [09:00] - [22:00]                |    |
|  | Thu  [09:00] - [22:00]                |    |
|  | Fri  [09:00] - [23:00]                |    |
|  | Sat  [10:00] - [23:00]                |    |
|  | Sun  [10:00] - [22:00]                |    |
|  +---------------------------------------+    |
|  [Copy Monday to all days]                    |
|                                               |
|  +----------------+  +--------------------+   |
|  |    [ Back ]    |  |   [ Next Step ]    |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Enter branch name | Store value (optional) |
| Enter address | Store value (optional) |
| Select region | Filter cities dropdown |
| Select city | Store value |
| Toggle service type | Update service flags |
| Set hours | Store hours per day |
| Click Copy to all | Copy Monday hours to all days |
| Click Back | GO TO: Screen 1 |
| Click Next Step | Call API |

### API Call

```
POST /admin/onboarding/steps/branch-setup

Headers:
- Authorization: Bearer {accessToken}
- Content-Type: application/json

Request Body:
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
  "dineInEnabled": true,
  "takeawayEnabled": true,
  "deliveryEnabled": false
}
```

All fields are optional. Update only what's provided.

### Handle Response

Success Response (200):
```
{
  "currentStep": "menu_template",
  "completedSteps": ["registration_complete", "business_identity", "branch_setup"],
  "stepData": {
    "branch_setup": {
      "branchId": 5,
      "completedAt": "2025-10-30T10:45:00Z"
    }
  },
  "branchId": 5,
  ...
}
```

### Decision Logic After Submit

```
Step 1: Store branchId
----------------------
branchId is now available for subsequent API calls

Step 2: Update progress
-----------------------
Store response in onboarding state

Step 3: Navigate
----------------
GO TO: Screen 3 (Menu Template)
```

### Service Types Explained

| Type | What It Enables |
|------|-----------------|
| Dine-in | Table/hall management, service charge option |
| Takeaway | Pickup orders, no table assignment needed |
| Delivery | Delivery address fields, delivery fee settings |

---

## Screen 3: Menu Template

### When to Show

Show this screen when:
- `currentStep = "menu_template"`
- Steps 1 and 2 are completed

### UI Layout (Initial)

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 3 of 6]                 |
|                                               |
|  Step 3: Set up your menu                     |
|  ------------------------                     |
|                                               |
|  Your Business Type: Restaurant               |
|                                               |
|  Choose how to start:                         |
|                                               |
|  +---------------------------------------+    |
|  |  [Restaurant Icon]                    |    |
|  |                                       |    |
|  |  Load Default Restaurant Menu         |    |
|  |  Sample categories and products       |    |
|  |  You can customize everything later   |    |
|  |                                       |    |
|  |  [ Load Default Menu ]                |    |
|  +---------------------------------------+    |
|                                               |
|  -------------- OR --------------             |
|                                               |
|  +---------------------------------------+    |
|  |  [Empty Icon]                         |    |
|  |                                       |    |
|  |  Start with Empty Menu                |    |
|  |  Create everything from scratch       |    |
|  |                                       |    |
|  |  [ Skip This Step ]                   |    |
|  +---------------------------------------+    |
|                                               |
|  +----------------+                           |
|  |    [ Back ]    |                           |
|  +----------------+                           |
|                                               |
+-----------------------------------------------+
```

### After Loading Default Menu

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 3 of 6]                 |
|                                               |
|  Step 3: Set up your menu                     |
|                                               |
|  Menu loaded! Review and customize:           |
|                                               |
|  +---------------------------------------+    |
|  | v Appetizers (4 products)             |    |
|  |   - Spring Rolls         18,000 UZS   |    |
|  |   - Bruschetta           25,000 UZS   |    |
|  |   - Hummus Plate         22,000 UZS   |    |
|  |   - Garlic Bread         15,000 UZS   |    |
|  +---------------------------------------+    |
|  | > Main Courses (6 products)           |    |
|  +---------------------------------------+    |
|  | > Desserts (2 products)               |    |
|  +---------------------------------------+    |
|                                               |
|  [+ Add Category]                             |
|                                               |
|  You can edit all items in Menu Management    |
|  after completing setup.                      |
|                                               |
|  +----------------+  +--------------------+   |
|  |    [ Back ]    |  |   [ Next Step ]    |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Click Load Default Menu | Fetch and display template |
| Click Skip This Step | Skip step, go to Screen 4 |
| Expand category | Show products in category |
| Edit product price | Update price in local state |
| Click Add Category | Open add category modal |
| Click Back | GO TO: Screen 2 |
| Click Next Step | Save menu, go to Screen 4 |

### Get Default Products

```
GET /admin/onboarding/default-products?businessType=restaurant

Headers:
- Authorization: Bearer {accessToken}

Response (200):
{
  "categories": [
    {
      "name": "Appetizers",
      "description": "Starters and small plates",
      "products": [
        {
          "name": "Spring Rolls",
          "description": "Crispy vegetable rolls",
          "suggestedPrice": 18000,
          "image": "https://cdn.horyco.com/defaults/spring-rolls.jpg",
          "preparationTime": 15,
          "calories": 250,
          "allergens": ["gluten", "soy"]
        }
      ]
    }
  ]
}
```

### Submit Menu

```
POST /admin/onboarding/steps/menu-setup

Headers:
- Authorization: Bearer {accessToken}
- Content-Type: application/json

Request Body:
{
  "categories": [
    {
      "name": "Appetizers",
      "description": "Starters",
      "products": [
        {
          "name": "Spring Rolls",
          "price": 18000,
          "description": "Crispy vegetable rolls",
          "image": "https://cdn.horyco.com/defaults/spring-rolls.jpg",
          "preparationTime": 15,
          "calories": 250,
          "allergens": ["gluten", "soy"]
        }
      ]
    }
  ]
}
```

### Handle Response

Success Response (200):
```
{
  "currentStep": "menu_template",
  "completedSteps": [..., "menu_template"],
  "stepData": {
    "menu_template": {
      "categoriesCreated": 3,
      "productsCreated": 12,
      "success": true,
      "completedAt": "2025-10-30T11:00:00Z"
    }
  },
  ...
}
```

Note: After menu-setup, currentStep stays at menu_template. Frontend should navigate to next step manually.

### Skip Menu (Start Empty)

```
PATCH /admin/onboarding/skip-step

Headers:
- Authorization: Bearer {accessToken}
- Content-Type: application/json

Request Body:
{
  "step": "menu_template",
  "reason": "Will add menu items manually later"
}

Response (200):
{
  "currentStep": "payment_setup",
  "completedSteps": [...],
  "stepData": {
    "menu_template": {
      "skipped": true,
      "skippedAt": "2025-10-30T11:00:00Z",
      "reason": "Will add menu items manually later"
    }
  },
  ...
}
```

---

## Screen 4: Payment Methods (Optional)

### When to Show

Show this screen when:
- `currentStep = "payment_setup"`
- Steps 1, 2, 3 are completed (or step 3 skipped)

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 4 of 6]                 |
|                                               |
|  Step 4: Payment methods (Optional)           |
|  ----------------------------------           |
|                                               |
|  Default payment methods (always enabled):    |
|  [v] Cash                                     |
|  [v] Card (manual terminal)                   |
|                                               |
|  ----------------------------------------     |
|                                               |
|  Online Payment Gateways:                     |
|                                               |
|  +---------------------------------------+    |
|  | [ ] Payme                             |    |
|  |     Merchant ID: [________________]   |    |
|  |     Secret Key:  [________________]   |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | [ ] Click                             |    |
|  |     Merchant ID: [________________]   |    |
|  |     Service ID:  [________________]   |    |
|  |     Secret Key:  [________________]   |    |
|  +---------------------------------------+    |
|                                               |
|  You can configure these later in Settings    |
|                                               |
|  +----------+  +--------+  +--------------+   |
|  |  [ Back ]|  | [Skip] |  | [Next Step ] |   |
|  +----------+  +--------+  +--------------+   |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Toggle Payme | Show/hide Payme configuration fields |
| Toggle Click | Show/hide Click configuration fields |
| Enter credentials | Store in state |
| Click Back | GO TO: Screen 3 |
| Click Skip | Skip step, GO TO: Screen 5 |
| Click Next Step | Validate if any enabled, call API |

### API Call

```
POST /admin/onboarding/steps/payment-setup

Headers:
- Authorization: Bearer {accessToken}
- Content-Type: application/json

Request Body:
{
  "cashEnabled": true,
  "cardEnabled": true,
  "paymeMerchantId": "628c8b3d9e1234567890abcd",
  "paymeSecretKey": "secret-key-here",
  "clickMerchantId": null,
  "clickServiceId": null,
  "clickSecretKey": null
}
```

### Handle Response

Success Response (200):
```
{
  "currentStep": "payment_setup",
  "completedSteps": [..., "payment_setup"],
  "stepData": {
    "payment_setup": {
      "paymentMethods": {
        "payme": true,
        "click": false,
        "cash": true,
        "card": true
      },
      "completedAt": "2025-10-30T11:15:00Z"
    }
  },
  ...
}
```

### Validation Logic

```
Payme is enabled only if:
- paymeMerchantId is provided AND
- paymeSecretKey is provided

Click is enabled only if:
- clickMerchantId is provided AND
- clickServiceId is provided AND
- clickSecretKey is provided

Cash and Card are independent boolean flags (default true)
```

### Skip Step

```
PATCH /admin/onboarding/skip-step

Headers:
- Authorization: Bearer {accessToken}
- Content-Type: application/json

Request Body:
{
  "step": "payment_setup",
  "reason": "Will configure payment methods later"
}
```

---

## Screen 5: Invite Staff (Optional)

### When to Show

Show this screen when:
- `currentStep = "staff_invited"`
- Steps 1-4 completed or skipped

### UI Layout (Empty State)

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 5 of 6]                 |
|                                               |
|  Step 5: Invite your team (Optional)          |
|  -----------------------------------          |
|                                               |
|  Create accounts for employees who will       |
|  use the POS system. They'll receive a        |
|  temporary password to change on first login. |
|                                               |
|  +---------------------------------------+    |
|  |                                       |    |
|  |  [Team Icon]                          |    |
|  |                                       |    |
|  |  No employees added yet               |    |
|  |                                       |    |
|  |  [+ Add First Employee]               |    |
|  |                                       |    |
|  +---------------------------------------+    |
|                                               |
|  +----------+  +--------+  +--------------+   |
|  |  [ Back ]|  | [Skip] |  | [Next Step ] |   |
|  +----------+  +--------+  +--------------+   |
|                                               |
+-----------------------------------------------+
```

### UI Layout (With Employees Added)

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 5 of 6]                 |
|                                               |
|  Step 5: Invite your team (Optional)          |
|                                               |
|  Employees to create (2):                     |
|                                               |
|  +---------------------------------------+    |
|  | Farrux Aliyev                         |    |
|  | +998 90 987 65 43                     |    |
|  | Permissions: 12                       |    |
|  | [Edit] [Remove]                       |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | Dilnoza Rahimova                      |    |
|  | +998 93 123 45 67                     |    |
|  | Permissions: 8                        |    |
|  | [Edit] [Remove]                       |    |
|  +---------------------------------------+    |
|                                               |
|  [+ Add Another Employee]                     |
|                                               |
|  +----------------+  +--------------------+   |
|  |    [ Back ]    |  |   [ Create Staff ] |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### After Staff Created (Success State)

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 5 of 6]                 |
|                                               |
|  Staff Created Successfully!                  |
|                                               |
|  +---------------------------------------+    |
|  | [!] Save these passwords! They won't  |    |  <- Warning banner
|  |     be shown again.                   |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | Farrux Aliyev                         |    |
|  | +998 90 987 65 43                     |    |
|  | Temp Password: Xk9m2pL4      [Copy]   |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | Dilnoza Rahimova                      |    |
|  | +998 93 123 45 67                     |    |
|  | Temp Password: Zy7n3qR8      [Copy]   |    |
|  +---------------------------------------+    |
|                                               |
|  +----------------+  +--------------------+   |
|  |    [ Back ]    |  |   [ Next Step ]    |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### Add Employee Modal

```
+-----------------------------------------------+
|  Add Employee                             [x] |
+-----------------------------------------------+
|                                               |
|  Full Name *                                  |
|  +---------------------------------------+    |
|  | Farrux Aliyev                         |    |
|  +---------------------------------------+    |
|                                               |
|  Phone Number *                               |
|  +---------------------------------------+    |
|  | +998 | 90 987 65 43                   |    |
|  +---------------------------------------+    |
|                                               |
|  Email (optional)                             |
|  +---------------------------------------+    |
|  | farrux@example.com                    |    |
|  +---------------------------------------+    |
|                                               |
|  Role Template (pre-fills permissions)        |
|  +---------------------------------------+    |
|  | Cashier                             v |    |
|  +---------------------------------------+    |
|                                               |
|  Permissions * (customize as needed)          |
|  +---------------------------------------+    |
|  | Menu                                  |    |
|  |   [x] menu:view    [ ] menu:create    |    |
|  |   [ ] menu:edit    [ ] menu:delete    |    |
|  |                                       |    |
|  | Orders                                |    |
|  |   [x] orders:view  [x] orders:create  |    |
|  |   [x] orders:edit  [ ] orders:delete  |    |
|  +---------------------------------------+    |
|                                               |
|  +----------------+  +--------------------+   |
|  |   [ Cancel ]   |  |  [ Add Employee ]  |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Full Name | Required | "Full name is required" |
| Phone | Required, +998 format | "Enter valid phone number" |
| Email | Optional, valid format | "Enter valid email" |
| Permissions | At least 1 required | "Select at least one permission" |

### Submit Staff

```
POST /admin/onboarding/steps/staff-invite

Headers:
- Authorization: Bearer {accessToken}
- Content-Type: application/json

Request Body:
{
  "invitations": [
    {
      "fullName": "Farrux Aliyev",
      "phone": "+998909876543",
      "email": "farrux@example.com",
      "permissionIds": [1, 5, 6, 7, 8, 12],
      "password": null
    },
    {
      "fullName": "Dilnoza Rahimova",
      "phone": "+998931234567",
      "email": null,
      "permissionIds": [1, 10, 11, 12],
      "password": null
    }
  ]
}
```

If password is null, system generates a secure random 8-character password.

### Handle Response

Success Response (200):
```
{
  "currentStep": "staff_invited",
  "completedSteps": [..., "staff_invited"],
  "stepData": {
    "staff_invited": {
      "employeesCreated": 2,
      "credentials": [
        {
          "employeeId": 5,
          "fullName": "Farrux Aliyev",
          "phone": "+998909876543",
          "temporaryPassword": "Xk9m2pL4",
          "branchName": "Main Branch",
          "permissionCount": 6
        },
        {
          "employeeId": 6,
          "fullName": "Dilnoza Rahimova",
          "phone": "+998931234567",
          "temporaryPassword": "Zy7n3qR8",
          "branchName": "Main Branch",
          "permissionCount": 4
        }
      ],
      "completedAt": "2025-10-30T11:30:00Z"
    }
  }
}
```

### Decision Logic After Submit

```
Step 1: Display credentials
---------------------------
Show temporary passwords for each employee
These are shown ONLY ONCE - user must save them

Step 2: Update state
--------------------
Store credentials in local state for display
Mark step as completed

Step 3: Navigate (after user clicks Next)
-----------------------------------------
GO TO: Screen 6 (Go Live)
```

### Skip Step

```
PATCH /admin/onboarding/skip-step

Headers:
- Authorization: Bearer {accessToken}
- Content-Type: application/json

Request Body:
{
  "step": "staff_invited",
  "reason": "Will add employees later"
}
```

---

## Screen 6: Go Live

### When to Show

Show this screen when:
- `currentStep = "go_live"`
- All required steps completed (or optional ones skipped)

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  [Progress Bar - Step 6 of 6]                 |
|                                               |
|  You're all set! Ready to go live?            |
|  ---------------------------------            |
|                                               |
|  Setup Summary:                               |
|                                               |
|  [v] Business Information                     |
|      Golden Dragon Restaurant                 |
|      Type: Restaurant                         |
|      URL: golden-dragon.horyco.com            |
|                                               |
|  [v] Branch Configured                        |
|      Main Branch                              |
|      Tashkent, Amir Temur street 15           |
|      Open: Mon-Sun                            |
|      Services: Dine-in, Takeaway              |
|                                               |
|  [v] Menu Ready                               |
|      3 categories, 12 products                |
|                                               |
|  [v] Payment Methods                          |
|      Cash, Card, Payme                        |
|                                               |
|  [v] Team Invited                             |
|      2 employees                              |
|                                               |
|  ----------------------------------------     |
|                                               |
|  What's Next:                                 |
|  - Customize your menu in Menu Management     |
|  - Set up tables and halls                    |
|  - Configure taxes and pricing                |
|  - Train your staff on POS                    |
|                                               |
|  +----------------+  +--------------------+   |
|  |[Review Settings]| | [Start Using POS] |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Click Review Settings | GO TO: Settings page |
| Click Start Using POS | Complete onboarding, GO TO: Dashboard |

### Validation Before Complete

```
GET /admin/onboarding/validation

Headers:
- Authorization: Bearer {accessToken}

Response (200):
{
  "canComplete": true,
  "missingSteps": [],
  "completedSteps": ["registration_complete", "business_identity", "branch_setup", "menu_template", "payment_setup", "staff_invited"],
  "skippedSteps": [],
  "completionPercentage": 100,
  "requiredStepsCount": 4,
  "completedStepsCount": 6
}
```

Required steps for completion:
- registration_complete
- business_identity
- branch_setup
- menu_template (can be skipped, which counts as completed)

### Complete Onboarding

```
POST /admin/onboarding/complete

Headers:
- Authorization: Bearer {accessToken}

Success Response (200):
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
  "completedAt": "2025-10-30T11:45:00Z",
  "stepData": {
    "go_live": {
      "completedAt": "2025-10-30T11:45:00Z"
    }
  }
}
```

### Decision Logic After Complete

```
Step 1: Update state
--------------------
Set onboarding.isCompleted = true

Step 2: Navigate
----------------
GO TO: Dashboard
Show success toast: "Welcome to Horyco! Your restaurant is ready."
```

### Error Handling

| Code | Response | What to Show |
|------|----------|--------------|
| 400 | `{"message": "Required steps not completed"}` | Show error, highlight missing steps |

---

## Reopen Step for Editing

### When to Use

When user wants to change data from a completed step.

### Cascade Invalidation

When a step is reopened, all subsequent steps become incomplete:

```
Step Order:
1. REGISTRATION_COMPLETE (cannot reopen)
2. BUSINESS_IDENTITY
3. BRANCH_SETUP
4. MENU_TEMPLATE
5. PAYMENT_SETUP
6. STAFF_INVITED
7. GO_LIVE

Example: Reopen BUSINESS_IDENTITY
- BUSINESS_IDENTITY becomes incomplete
- BRANCH_SETUP, MENU_TEMPLATE, PAYMENT_SETUP, STAFF_INVITED, GO_LIVE become incomplete
- stepData is preserved (not deleted) for re-editing
- isCompleted reset to false if onboarding was complete
```

### Warning Modal

```
+-----------------------------------------------+
|  Edit Business Identity?                  [x] |
+-----------------------------------------------+
|                                               |
|  Editing this step will mark the following    |
|  steps as incomplete:                         |
|                                               |
|  - Branch Setup                               |
|  - Menu Setup                                 |
|  - Payment Methods                            |
|  - Invite Staff                               |
|  - Go Live                                    |
|                                               |
|  You'll need to re-complete these steps.      |
|  Your previous answers will be saved.         |
|                                               |
|  +----------------+  +--------------------+   |
|  |   [ Cancel ]   |  |  [ Yes, Edit ]     |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### Reopen API

```
PATCH /admin/onboarding/steps/business_identity/reopen

Headers:
- Authorization: Bearer {accessToken}

Response (200):
{
  "currentStep": "business_identity",
  "completedSteps": ["registration_complete"],
  "isCompleted": false,
  ...
}
```

### Restrictions

- Cannot reopen REGISTRATION_COMPLETE step (registration cannot be undone)
- Step must have been previously completed
- Only supports reopening completed steps

---

## Complete Flow Chart

```
                    +------------------+
                    |   APP LOADS      |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | GET /onboarding/ |
                    | progress         |
                    +--------+---------+
                             |
                        +----+----+
                        |         |
                        v         v
                  isCompleted  isCompleted
                    = true      = false
                        |         |
                        v         v
                  +-----+----+  +-+-------------+
                  | Dashboard|  | currentStep   |
                  +----------+  +-------+-------+
                                        |
            +---------------------------+---------------------------+
            |           |           |           |           |       |
            v           v           v           v           v       v
      business_   branch_     menu_      payment_   staff_    go_live
      identity    setup       template   setup      invited
            |           |           |           |           |       |
            v           v           v           v           v       v
      [Screen 1]  [Screen 2]  [Screen 3]  [Screen 4]  [Screen 5]  [Screen 6]
            |           |           |           |           |       |
            +-----+-----+     +-----+-----+     +-----+-----+       |
                  |           |           |           |             |
                  v           v           v           v             |
              POST step   POST step   POST/SKIP   POST/SKIP        |
                  |           |           |           |             |
                  +-----+-----+-----+-----+-----+-----+             |
                        |                                           |
                        v                                           |
                  Navigate to next screen                           |
                        |                                           |
                        +-------------------------------------------+
                                        |
                                        v
                              +---------+---------+
                              | POST /onboarding/ |
                              | complete          |
                              +---------+---------+
                                        |
                                        v
                              +---------+---------+
                              |    Dashboard      |
                              +-------------------+
```

---

## API Reference

| Endpoint | Method | When | Auth |
|----------|--------|------|------|
| `/admin/onboarding/progress` | GET | Check current status | Yes |
| `/admin/onboarding/validation` | GET | Before completing | Yes |
| `/admin/onboarding/default-products` | GET | Load menu templates | Yes |
| `/admin/onboarding/steps/business-identity` | POST | Complete step 1 | Yes |
| `/admin/onboarding/steps/branch-setup` | POST | Complete step 2 | Yes |
| `/admin/onboarding/steps/menu-setup` | POST | Complete step 3 | Yes |
| `/admin/onboarding/steps/payment-setup` | POST | Complete step 4 | Yes |
| `/admin/onboarding/steps/staff-invite` | POST | Complete step 5 | Yes |
| `/admin/onboarding/skip-step` | PATCH | Skip optional step | Yes |
| `/admin/onboarding/steps/:step/reopen` | PATCH | Edit completed step | Yes |
| `/admin/onboarding/complete` | POST | Finish onboarding | Yes |

---

## Storage Reference

| Key | Type | Where | Set When | Clear When |
|-----|------|-------|----------|------------|
| `onboardingProgress` | object | Memory | GET progress call | Onboarding complete |
| `currentStep` | string | Memory | Each step response | Onboarding complete |
| `branchId` | number | Memory | Step 2 complete | Logout |
| `staffCredentials` | array | Memory (temp) | Step 5 response | User navigates away |

---

## FAQ

**Q: What if user closes browser during onboarding?**
A: Progress is saved on server. On next login, they continue from `currentStep`.

**Q: Can user skip required steps?**
A: No. Steps 1, 2, 6 are required. Steps 3, 4, 5 can be skipped.

**Q: What if user wants to change business name later?**
A: After onboarding, use Settings. During onboarding, use reopen endpoint.

**Q: Are staff passwords stored?**
A: No. They're generated once and returned in API response only. Owner must save them.

**Q: What if user chooses wrong menu template?**
A: After onboarding, full menu editing is available in Menu Management.

**Q: Can user go back to previous steps?**
A: Yes. Click on completed step in progress bar, or use Back button.

**Q: What happens if API fails mid-step?**
A: Show error, keep form data, allow retry. Progress is not lost.

**Q: Is branchId needed for all subsequent calls?**
A: Some APIs require it (menu, staff). It's available after step 2 completes.

**Q: Does skipping a step count as completing it?**
A: Yes. Skipped steps count toward completion percentage and validation.

**Q: What's the minimum to complete onboarding?**
A: Steps 1 (Business Identity), 2 (Branch Setup), 3 (Menu - can be skipped), and 6 (Go Live).
