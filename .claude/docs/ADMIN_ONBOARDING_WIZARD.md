# Admin Panel — Onboarding Wizard (7-Step Setup)

This document explains the complete onboarding wizard that new restaurant owners complete after signup to configure their restaurant for launch.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Onboarding Progress Tracking](#onboarding-progress-tracking)
3. [Step 1: Business Information](#step-1-business-information)
4. [Step 2: Branch Setup](#step-2-branch-setup)
5. [Step 3: Menu Template](#step-3-menu-template)
6. [Step 4: Payment Methods](#step-4-payment-methods)
7. [Step 5: Invite Staff (Optional)](#step-5-invite-staff-optional)
8. [Step 6: Go Live](#step-6-go-live)
9. [Frontend Implementation Guide](#frontend-implementation-guide)
10. [API Endpoints](#api-endpoints)

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
Step 1: Business Information (Required)
   → Company address, business type, region
   ↓
Step 2: Branch Setup (Required)
   → Operating hours, service types (dine-in/delivery/takeaway)
   ↓
Step 3: Choose Menu (Required)
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
│  Step 2 of 6                                    │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░ 33%          │
│                                                 │
│  ✓ Business Info                                │
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

```typescript
GET /admin/onboarding/progress

Response:
{
  "isCompleted": false,
  "currentStep": "BRANCH_SETUP",
  "completedSteps": [
    "REGISTRATION_COMPLETE",
    "BUSINESS_INFO_VERIFIED"
  ],
  "completionPercentage": 33,
  "stepsData": {
    "BUSINESS_INFO_VERIFIED": {
      "completedAt": "2024-01-20T10:30:00Z",
      "data": {
        "address": "123 Main St, Tashkent",
        "businessType": "restaurant",
        "regionId": 1
      }
    }
  },
  "nextStep": "BRANCH_SETUP",
  "canSkip": false  // Required step
}
```

### Step Status Types

```typescript
enum OnboardingStep {
  REGISTRATION_COMPLETE = 'REGISTRATION_COMPLETE', // Auto-completed on signup
  BUSINESS_INFO_VERIFIED = 'BUSINESS_INFO_VERIFIED', // Step 1
  BRANCH_SETUP = 'BRANCH_SETUP', // Step 2
  MENU_TEMPLATE = 'MENU_TEMPLATE', // Step 3
  PAYMENT_SETUP = 'PAYMENT_SETUP', // Step 4 (optional)
  STAFF_INVITED = 'STAFF_INVITED', // Step 5 (optional)
  GO_LIVE = 'GO_LIVE', // Step 6 (final)
}
```

---

## Step 1: Business Information

### Purpose

Collect basic business details for:

- Legal/tax documentation
- Location-based features
- Business analytics
- Profile display

### UI Form

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Step 1: Tell us about your business           │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Business Address *                             │
│  ┌───────────────────────────────────────┐    │
│  │ 123 Amir Temur Street                  │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Region *                                       │
│  ┌───────────────────────────────────────┐    │
│  │ Tashkent City             ▼            │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  District *                                     │
│  ┌───────────────────────────────────────┐    │
│  │ Yakkasaray District       ▼            │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Business Type *                                │
│  ○ Restaurant                                   │
│  ○ Cafe                                         │
│  ○ Fast Food                                    │
│  ○ Food Truck                                   │
│  ○ Catering                                     │
│  ○ Other                                        │
│                                                 │
│  Description (optional)                         │
│  ┌───────────────────────────────────────┐    │
│  │ Traditional Uzbek cuisine with modern  │    │
│  │ presentation. Family recipes since     │    │
│  │ 1985.                                  │    │
│  └───────────────────────────────────────┘    │
│  ℹ️  Shown to customers in webapp               │
│                                                 │
│  Website (optional)                             │
│  ┌───────────────────────────────────────┐    │
│  │ https://samarkand.uz                   │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  [Skip for Now]           [ Next Step → ]      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Call

```typescript
POST /admin/onboarding/steps/business-info
{
  "address": "123 Amir Temur Street, Tashkent",
  "regionId": 1,           // Tashkent City
  "districtId": 5,         // Yakkasaray District
  "businessType": "restaurant",
  "description": "Traditional Uzbek cuisine with modern presentation. Family recipes since 1985.",
  "website": "https://samarkand.uz"
}

Response:
{
  "success": true,
  "progress": {
    "currentStep": "BRANCH_SETUP",
    "completionPercentage": 33,
    "completedSteps": ["REGISTRATION_COMPLETE", "BUSINESS_INFO_VERIFIED"]
  },
  "message": "Business information saved successfully"
}
```

### Why This Information?

**Address**:

- Required for delivery radius calculation
- Shown on receipts and customer app
- Used for tax/legal documentation

**Region/District**:

- Tax rates may vary by location
- Analytics by geographic area
- Future: delivery zone configuration

**Business Type**:

- Pre-fills relevant settings
- Determines default menu template options
- Used in analytics/benchmarking

**Description**:

- Shown to customers in QR menu/webapp
- Helps customers find you
- SEO for online ordering

---

## Step 2: Branch Setup

### Purpose

Configure the default branch with:

- Operating hours
- Service types (dine-in, takeaway, delivery)
- Branch-specific settings

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

```typescript
POST /admin/onboarding/steps/branch-setup
{
  "branchName": "Samarkand Restaurant (Main Branch)",
  "address": "123 Amir Temur Street, Tashkent",
  "dineInEnabled": true,
  "takeawayEnabled": true,
  "deliveryEnabled": false,
  "businessHours": {
    "monday": { "open": "09:00", "close": "22:00", "closed": false },
    "tuesday": { "open": "09:00", "close": "22:00", "closed": false },
    "wednesday": { "open": "09:00", "close": "22:00", "closed": false },
    "thursday": { "open": "09:00", "close": "22:00", "closed": false },
    "friday": { "open": "09:00", "close": "23:00", "closed": false },
    "saturday": { "open": "09:00", "close": "23:00", "closed": false },
    "sunday": { "open": "09:00", "close": "22:00", "closed": false }
  }
}

Response:
{
  "success": true,
  "branch": {
    "id": 10,
    "name": "Samarkand Restaurant (Main Branch)",
    "isMain": true
  },
  "progress": {
    "currentStep": "MENU_TEMPLATE",
    "completionPercentage": 50
  }
}
```

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

Quickly populate menu with pre-made templates or start from scratch.

### UI Screen

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Step 3: Choose your menu                      │
│                                                 │
│  Select a template to get started quickly, or  │
│  start from scratch and build your own.        │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Filter by:  [Restaurant ▼]  [All Cuisines ▼] │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   [Image]    │  │   [Image]    │            │
│  │              │  │              │            │
│  │ Traditional  │  │ Modern Cafe  │            │
│  │ Restaurant   │  │              │            │
│  │              │  │              │            │
│  │ 8 categories │  │ 6 categories │            │
│  │ 45 products  │  │ 32 products  │            │
│  │              │  │              │            │
│  │  [Preview]   │  │  [Preview]   │            │
│  │  [Select]    │  │  [Select]    │            │
│  └──────────────┘  └──────────────┘            │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   [Image]    │  │   [Image]    │            │
│  │              │  │              │            │
│  │ Fast Food    │  │ Blank Menu   │            │
│  │              │  │              │            │
│  │ 5 categories │  │ Start from   │            │
│  │ 28 products  │  │ scratch      │            │
│  │              │  │              │            │
│  │  [Preview]   │  │  [Select]    │            │
│  │  [Select]    │  │              │            │
│  └──────────────┘  └──────────────┘            │
│                                                 │
│  [← Back]           [Skip - Add Later]         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Template Preview Modal

```
┌─────────────────────────────────────────────────┐
│  Traditional Restaurant Menu                × │
├─────────────────────────────────────────────────┤
│                                                 │
│  This template includes:                        │
│                                                 │
│  ✓ 8 Categories:                                │
│    • Appetizers (6 items)                       │
│    • Soups (4 items)                            │
│    • Main Courses (12 items)                    │
│    • Grilled Meats (8 items)                    │
│    • Salads (5 items)                           │
│    • Desserts (4 items)                         │
│    • Hot Drinks (3 items)                       │
│    • Cold Drinks (3 items)                      │
│                                                 │
│  ✓ 45 Products with:                            │
│    • Sample names and descriptions              │
│    • Placeholder prices (you can edit)          │
│    • Common modifiers (size, spice level, etc)  │
│                                                 │
│  ℹ️  You can customize everything after applying │
│                                                 │
│  [ Cancel ]              [ Apply Template ]     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Calls

```typescript
// Get available templates
GET /admin/onboarding/menu-templates?businessType=restaurant

Response:
{
  "templates": [
    {
      "id": 1,
      "name": "Traditional Restaurant",
      "description": "Full-service restaurant with multiple courses",
      "businessType": "restaurant",
      "categoriesCount": 8,
      "productsCount": 45,
      "thumbnail": "https://...template-1.jpg"
    },
    {
      "id": 2,
      "name": "Modern Cafe",
      "description": "Cafe-style menu with coffee and light meals",
      "businessType": "cafe",
      "categoriesCount": 6,
      "productsCount": 32,
      "thumbnail": "https://...template-2.jpg"
    }
  ]
}

// Apply template
POST /admin/onboarding/steps/menu-template
{
  "templateId": 1,
  "replaceExisting": false  // Keep any existing menu items
}

Response:
{
  "success": true,
  "categoriesCreated": 8,
  "productsCreated": 45,
  "message": "Menu template applied successfully",
  "progress": {
    "currentStep": "PAYMENT_SETUP",
    "completionPercentage": 67
  }
}

// Or skip this step
POST /admin/onboarding/steps/menu-template
{
  "templateId": null,  // Start from scratch
  "replaceExisting": false
}
```

### Why Menu Templates?

**Benefits**:

- Get started immediately (no empty menu)
- Learn proper category organization
- See example product structure
- Faster time to launch

**Customization**:

- All template data can be edited
- Can delete unwanted items
- Can add new items
- Just a starting point

---

## Step 4: Payment Methods

### Purpose

Configure payment gateway integrations (Payme, Click) or skip for now.

**This step is OPTIONAL** - can be configured later in settings.

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

```typescript
POST /admin/onboarding/steps/payment-setup
{
  "cashEnabled": true,
  "cardEnabled": true,
  "paymeMerchantId": "5e730e8e0b852a417aa49ceb",
  "paymeSecretKey": "your-secret-key",
  "paymeServiceId": "12345",
  "clickMerchantId": null,  // Not configuring Click
  "clickServiceId": null,
  "clickSecretKey": null
}

Response:
{
  "success": true,
  "enabledMethods": {
    "cash": true,
    "card": true,
    "payme": true,
    "click": false
  },
  "progress": {
    "currentStep": "STAFF_INVITED",
    "completionPercentage": 83
  }
}

// Or skip this step
POST /admin/onboarding/skip-step
{
  "step": "PAYMENT_SETUP",
  "reason": "Will configure later"
}

Response:
{
  "success": true,
  "progress": {
    "currentStep": "STAFF_INVITED",
    "completionPercentage": 83
  }
}
```

---

## Step 5: Invite Staff (Optional)

### Purpose

Add employees and send them invitations to join.

**This step is OPTIONAL** - can add staff later.

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
│  Assign to Branch *                             │
│  ☑ Main Branch                                 │
│                                                 │
│  [ Cancel ]                    [ Add Employee ] │
│                                                 │
└─────────────────────────────────────────────────┘
```

### API Call

```typescript
POST /admin/onboarding/steps/staff-invite
{
  "invitations": [
    {
      "fullName": "Farrux Aliyev",
      "phone": "+998909876543",
      "email": "farrux@example.com",
      "roleId": 3,        // Cashier role ID
      "branchIds": [10]   // Main branch
    },
    {
      "fullName": "Dilnoza Rahimova",
      "phone": "+998931234567",
      "email": null,
      "roleId": 4,        // Waiter role ID
      "branchIds": [10]
    }
  ]
}

Response:
{
  "success": true,
  "totalInvited": 2,
  "invitations": [
    {
      "fullName": "Farrux Aliyev",
      "phone": "+998909876543",
      "invitedAt": "2024-01-20T11:00:00Z"
    },
    {
      "fullName": "Dilnoza Rahimova",
      "phone": "+998931234567",
      "invitedAt": "2024-01-20T11:00:00Z"
    }
  ],
  "progress": {
    "currentStep": "GO_LIVE",
    "completionPercentage": 100
  }
}
```

**Note**: In current implementation, this just stores invitation data. Full employee account creation happens later in Staff Management section.

---

## Step 6: Go Live!

### Purpose

Final review and launch confirmation.

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

```typescript
POST /admin/onboarding/complete

Response:
{
  "success": true,
  "completedAt": "2024-01-20T11:15:00Z",
  "message": "Onboarding completed successfully! Welcome to OshLab!",
  "redirectTo": "/admin/dashboard"
}
```

---

## Frontend Implementation Guide

### Onboarding Wizard Component

```typescript
// Main wizard component
const OnboardingWizard = () => {
  const [progress, setProgress] = useState(null);
  const [currentStepData, setCurrentStepData] = useState({});

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const response = await api.get('/admin/onboarding/progress');
    setProgress(response);

    // Redirect if already completed
    if (response.isCompleted) {
      router.push('/admin/dashboard');
    }
  };

  const handleStepComplete = async (stepData) => {
    try {
      let response;

      switch (progress.nextStep) {
        case 'BUSINESS_INFO_VERIFIED':
          response = await api.post('/admin/onboarding/steps/business-info', stepData);
          break;
        case 'BRANCH_SETUP':
          response = await api.post('/admin/onboarding/steps/branch-setup', stepData);
          break;
        case 'MENU_TEMPLATE':
          response = await api.post('/admin/onboarding/steps/menu-template', stepData);
          break;
        // ... other steps
      }

      // Update progress
      setProgress(response.progress);
      toast.success('Step completed!');

    } catch (error) {
      toast.error('Failed to save. Please try again.');
    }
  };

  const handleSkipStep = async () => {
    try {
      const response = await api.post('/admin/onboarding/skip-step', {
        step: progress.nextStep,
        reason: 'User chose to skip'
      });

      setProgress(response.progress);
      toast.info('Step skipped. You can complete it later.');

    } catch (error) {
      if (error.response?.data?.message?.includes('required')) {
        toast.error('This step is required and cannot be skipped.');
      }
    }
  };

  return (
    <div>
      <ProgressBar
        current={progress.completedSteps.length}
        total={6}
        percentage={progress.completionPercentage}
      />

      {progress.nextStep === 'BUSINESS_INFO_VERIFIED' && (
        <BusinessInfoStep onComplete={handleStepComplete} />
      )}

      {progress.nextStep === 'BRANCH_SETUP' && (
        <BranchSetupStep onComplete={handleStepComplete} />
      )}

      {/* Other steps... */}
    </div>
  );
};
```

---

## API Endpoints

### Progress Tracking

```typescript
// Get onboarding progress
GET / admin / onboarding / progress

// Complete specific step
POST / admin / onboarding / steps / business - info
POST / admin / onboarding / steps / branch - setup
POST / admin / onboarding / steps / menu - template
POST / admin / onboarding / steps / payment - setup
POST / admin / onboarding / steps / staff - invite

// Skip optional step
POST / admin / onboarding / skip - step
Body: {
  step, reason
}

// Complete entire onboarding
POST / admin / onboarding / complete
```

### Menu Templates

```typescript
// Get available templates
GET /admin/onboarding/menu-templates
Query: ?businessType=restaurant

// Get template details
GET /admin/onboarding/menu-templates/:id
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

- Business Information
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
