# Admin Panel — Onboarding Wizard (7-Step Setup)

This document explains the complete onboarding wizard that new restaurant owners complete after signup to configure their restaurant for launch.

**Note**: The system implements a 7-step flow including registration completion, business identity, branch setup, menu template, payment setup, staff invitation, and go live

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [⚡ Standardized Response Format](#-standardized-response-format-new)
3. [Onboarding Progress Tracking](#onboarding-progress-tracking)
4. [✅ Onboarding Validation (NEW)](#-onboarding-validation-new)
5. [🔄 Reopen Step for Editing (NEW)](#-reopen-step-for-editing-new)
6. [Step 0: Registration Complete](#step-0-registration-complete)
7. [Step 1: Business Identity](#step-1-business-identity)
8. [Step 2: Branch Setup](#step-2-branch-setup)
9. [Step 3: Menu Template](#step-3-menu-template)
10. [Step 4: Payment Methods](#step-4-payment-methods)
11. [Step 5: Invite Staff (Optional)](#step-5-invite-staff-optional)
12. [Step 6: Go Live](#step-6-go-live)
13. [Frontend Implementation Guide](#frontend-implementation-guide)
14. [API Endpoints](#api-endpoints)

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

## ⚡ Standardized Response Format (NEW)

### 🎯 All Step Endpoints Return Same Format

**IMPORTANT**: As of the latest update, **ALL onboarding step endpoints now return the same standardized `OnboardingProgressResponseDto`**. This means:

✅ **No more different response formats** - Every step endpoint returns identical structure
✅ **Frontend can use single response handler** - One function handles all step responses
✅ **No extra `/progress` calls needed** - All necessary data included in step response
✅ **branchId available immediately** - Returned in response after branch setup
✅ **tenantId always included** - Available in every response

### Standard Response Structure

All step endpoints (`/steps/business-identity`, `/steps/branch-setup`, `/steps/menu-setup`, etc.) return:

```json
{
  "currentStep": "branch_setup",
  "completedSteps": ["registration_complete", "business_identity"],
  "isCompleted": false,
  "completionPercentage": 29,
  "stepData": {
    "business_identity": {
      "businessName": "Golden Dragon",
      "completedAt": "2025-10-30T10:30:00Z"
    }
  },
  "nextStep": "branch_setup",
  "remainingSteps": ["branch_setup", "menu_template", "payment_setup", "staff_invited", "go_live"],
  "createdAt": "2025-10-30T09:00:00Z",
  "updatedAt": "2025-10-30T10:30:00Z",
  "tenantId": 1,
  "branchId": 5  // Available after branch setup, null before
}
```

### Key Fields

- **`currentStep`**: Current onboarding step (use for navigation)
- **`nextStep`**: Recommended next step to navigate to
- **`completedSteps`**: Array of completed steps (use for progress indicator)
- **`completionPercentage`**: 0-100 percentage (use for progress bar)
- **`stepData`**: Step-specific data (e.g., menu stats, payment methods configured)
- **`tenantId`**: Always present - tenant identifier
- **`branchId`**: Available after branch setup step completes
- **`remainingSteps`**: Steps left to complete

### Migration Notes

If you were using the old response formats:
- Replace parsing of `{ message }` responses with `OnboardingProgressResponseDto`
- Replace parsing of `{ success, categoriesCreated }` with `stepData.menu_template`
- Remove extra calls to `/progress` between steps - data is in step response

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
      "logoUrl": "https://cdn.horyco.com/tenants/logos/golden-dragon.png"
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

## ✅ Onboarding Validation (NEW)

### 🎯 Purpose

The validation endpoint allows frontend to check if onboarding can be completed **before** showing the "Complete Onboarding" button or attempting to call `/complete`. This provides better UX by:

- ✅ Proactively showing "You're ready to go live!" vs "Missing: Menu Setup"
- ✅ Showing specific missing steps instead of generic error messages
- ✅ Avoiding 400 errors from failed `/complete` calls
- ✅ Displaying accurate completion progress with skipped steps

### When to Call Validation

Call `GET /admin/onboarding/validation` in these scenarios:

1. **Before showing "Complete Onboarding" button** - Check if all required steps are done
2. **After completing each step** - Update UI to show remaining tasks
3. **On wizard load** - Display current completion status
4. **Before final step** - Verify readiness to go live

### API Endpoint

```
GET /admin/onboarding/validation
Headers: Authorization: Bearer {token}

Response:
{
  "canComplete": true,
  "missingSteps": [],
  "completedSteps": [
    "registration_complete",
    "business_identity",
    "branch_setup"
  ],
  "skippedSteps": ["menu_template"],
  "completionPercentage": 100,
  "requiredStepsCount": 4,
  "completedStepsCount": 4
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `canComplete` | boolean | Can the onboarding be completed? `true` if all required steps done |
| `missingSteps` | string[] | Array of required steps that must be completed |
| `completedSteps` | string[] | Array of steps actually completed (not skipped) |
| `skippedSteps` | string[] | Array of steps that were skipped (count as completed) |
| `completionPercentage` | number | 0-100 percentage based on required steps only |
| `requiredStepsCount` | number | Total required steps (always 4) |
| `completedStepsCount` | number | Total completed + skipped steps |

### Required Steps Logic

The validation checks these **4 required steps**:

1. ✅ `REGISTRATION_COMPLETE` - Always completed during signup
2. ✅ `BUSINESS_IDENTITY` - Must be completed
3. ✅ `BRANCH_SETUP` - Must be completed
4. ✅ `MENU_TEMPLATE` - Must be completed **OR** skipped

**Optional steps** (don't block completion):
- `PAYMENT_SETUP` - Can be skipped
- `STAFF_INVITED` - Can be skipped

**Important**: Skipped steps count as completed! If `MENU_TEMPLATE` is skipped, it will appear in `skippedSteps` array and will **NOT** be in `missingSteps`.

### Example Validation Responses

#### Scenario 1: New User (Just Registered)

```json
{
  "canComplete": false,
  "missingSteps": [
    "business_identity",
    "branch_setup",
    "menu_template"
  ],
  "completedSteps": ["registration_complete"],
  "skippedSteps": [],
  "completionPercentage": 25,
  "requiredStepsCount": 4,
  "completedStepsCount": 1
}
```

**UI Display**: "25% Complete - Missing: Business Identity, Branch Setup, Menu Template"

#### Scenario 2: Mid-Onboarding (50% Complete)

```json
{
  "canComplete": false,
  "missingSteps": [
    "branch_setup",
    "menu_template"
  ],
  "completedSteps": [
    "registration_complete",
    "business_identity"
  ],
  "skippedSteps": [],
  "completionPercentage": 50,
  "requiredStepsCount": 4,
  "completedStepsCount": 2
}
```

**UI Display**: "50% Complete - Missing: Branch Setup, Menu Template"

#### Scenario 3: Ready to Complete (All Done)

```json
{
  "canComplete": true,
  "missingSteps": [],
  "completedSteps": [
    "registration_complete",
    "business_identity",
    "branch_setup",
    "menu_template"
  ],
  "skippedSteps": [],
  "completionPercentage": 100,
  "requiredStepsCount": 4,
  "completedStepsCount": 4
}
```

**UI Display**: "🎉 You're ready to go live! - Complete Onboarding"

#### Scenario 4: With Skipped Menu (Still Ready)

```json
{
  "canComplete": true,
  "missingSteps": [],
  "completedSteps": [
    "registration_complete",
    "business_identity",
    "branch_setup"
  ],
  "skippedSteps": ["menu_template"],
  "completionPercentage": 100,
  "requiredStepsCount": 4,
  "completedStepsCount": 4
}
```

**UI Display**: "🎉 You're ready to go live! (Menu will be added later) - Complete Onboarding"

### Best Practices

1. **Always check validation before showing complete button** - Better UX than showing error after click
2. **Update validation after each step** - Keep UI in sync with backend state
3. **Show specific missing steps** - Don't just say "incomplete", tell them what's needed
4. **Highlight skipped steps** - Let users know they can configure these later
5. **Use completion percentage for progress bar** - More accurate than step count
6. **Handle skipped steps properly** - They count as completed for validation purposes

### Common Questions

#### Q: What if I call `/complete` without checking validation first?

**A**: The `/complete` endpoint will return a 400 error with the same missing steps information. However, it's better UX to check validation first and prevent the error.

#### Q: Do skipped steps block completion?

**A**: No! Skipped steps count as completed. If you skip `MENU_TEMPLATE`, `canComplete` will be `true` (assuming other required steps are done).

#### Q: Can I rely on validation for all steps?

**A**: Yes! The validation checks the exact same logic as `/complete`. If `canComplete = true`, the `/complete` call will succeed.

#### Q: How often should I call validation?

**A**:
- On wizard load (to show current status)
- After completing each step (to update progress)
- Before showing the "Complete" button (to verify readiness)

You don't need to call it on every render - cache the result and update only when progress changes.

---

## 🔄 Reopen Step for Editing (NEW)

### 🎯 Purpose

The reopen step feature allows users to go back and edit previously completed onboarding steps without losing all their progress. This significantly improves UX for users who:

- Made a typo in business name (step 2) after completing steps 3-5
- Need to change branch address after menu is configured
- Want to update business type and see different menu templates
- Realize they need to modify any completed step

**Without reopen**: Users would have to reset entire onboarding or contact support
**With reopen**: Click "Edit" on any completed step, fix the data, and re-complete subsequent steps

### 🔑 Key Concepts

#### Cascade Invalidation

Reopening a step **automatically invalidates all subsequent steps** to maintain data consistency:

```
Completed Steps: [1, 2, 3, 4, 5]
                      ↓
Reopen Step 2 (BUSINESS_IDENTITY)
                      ↓
Completed Steps: [1] only
Steps 2-5 become incomplete
```

**Why cascade?** Because later steps may depend on earlier step data:
- Menu templates depend on business type (step 2)
- Branch settings may affect menu availability
- Payment settings might change based on business type

#### Data Preservation

**Important**: Step data is **preserved** when reopening, not deleted. This allows users to:
- See their previous answers when re-editing
- Make small corrections without re-entering everything
- Understand what they configured before

```json
// After reopening BUSINESS_IDENTITY
{
  "stepData": {
    "business_identity": {
      "businessName": "Golden Dragon",  // ← Still here!
      "businessType": "restaurant",      // ← Available for editing
      "slug": "golden-dragon",
      "completedAt": "2025-10-30T10:30:00Z"
    },
    "branch_setup": {
      "branchName": "Main Branch",  // ← Also preserved (even though step invalidated)
      "address": "123 Main St"
    }
  }
}
```

### Which Steps Can Be Reopened?

| Step | Can Reopen? | Consequence |
|------|-------------|-------------|
| `REGISTRATION_COMPLETE` | ❌ No | Cannot undo registration |
| `BUSINESS_IDENTITY` | ✅ Yes | Invalidates steps 3-6 (BRANCH_SETUP, MENU_TEMPLATE, PAYMENT_SETUP, STAFF_INVITED, GO_LIVE) |
| `BRANCH_SETUP` | ✅ Yes | Invalidates steps 4-6 (MENU_TEMPLATE, PAYMENT_SETUP, STAFF_INVITED, GO_LIVE) |
| `MENU_TEMPLATE` | ✅ Yes | Invalidates steps 5-6 (PAYMENT_SETUP, STAFF_INVITED, GO_LIVE) |
| `PAYMENT_SETUP` | ✅ Yes | Invalidates step 6 (STAFF_INVITED, GO_LIVE) |
| `STAFF_INVITED` | ✅ Yes | Invalidates step 7 (GO_LIVE only) |
| `GO_LIVE` | ✅ Yes | Marks onboarding as incomplete, allows re-editing |

**Note**: Can only reopen steps that were previously completed. Cannot reopen steps that were never completed.

### API Endpoint

```
PATCH /admin/onboarding/steps/:step/reopen
Headers: Authorization: Bearer {token}

Response: OnboardingProgressResponseDto
{
  "currentStep": "business_identity",  // ← Updated to reopened step
  "completedSteps": ["registration_complete"],  // ← Subsequent steps removed
  "isCompleted": false,
  "completionPercentage": 14,  // ← Recalculated
  "stepData": {
    "business_identity": {
      "businessName": "Golden Dragon",  // ← Preserved for re-editing
      "businessType": "restaurant",
      "slug": "golden-dragon"
    },
    "branch_setup": { ... }  // ← Still available even though step invalidated
  },
  ...
}
```

### Step Order & Invalidation Examples

#### Example 1: Reopen Step 2 (BUSINESS_IDENTITY)

**Before**:
```
Completed: [1:REGISTRATION, 2:BUSINESS, 3:BRANCH, 4:MENU, 5:PAYMENT]
Current Step: STAFF_INVITED (step 6)
```

**Reopen BUSINESS_IDENTITY (step 2)**:
```
PATCH /admin/onboarding/steps/business_identity/reopen

Completed: [1:REGISTRATION] only
Current Step: BUSINESS_IDENTITY (step 2)
Invalidated: [3:BRANCH, 4:MENU, 5:PAYMENT, 6:STAFF]
```

**User must now re-complete**: Steps 2, 3, 4, 5, 6

#### Example 2: Reopen Step 4 (MENU_TEMPLATE)

**Before**:
```
Completed: [1, 2, 3, 4, 5, 6, 7] (All done, onboarding completed)
isCompleted: true
```

**Reopen MENU_TEMPLATE (step 4)**:
```
PATCH /admin/onboarding/steps/menu_template/reopen

Completed: [1, 2, 3] only
Current Step: MENU_TEMPLATE (step 4)
Invalidated: [5:PAYMENT, 6:STAFF, 7:GO_LIVE]
isCompleted: false  // ← Onboarding no longer complete
```

**User must now re-complete**: Steps 4, 5, 6, 7

#### Example 3: Reopen Last Step (STAFF_INVITED)

**Before**:
```
Completed: [1, 2, 3, 4, 5, 6]
Current Step: GO_LIVE (step 7)
```

**Reopen STAFF_INVITED (step 6)**:
```
PATCH /admin/onboarding/steps/staff_invited/reopen

Completed: [1, 2, 3, 4, 5] only
Current Step: STAFF_INVITED (step 6)
Invalidated: [7:GO_LIVE] only
```

**User must now re-complete**: Steps 6, 7

### Error Responses

#### Cannot Reopen REGISTRATION_COMPLETE

```json
// Request
PATCH /admin/onboarding/steps/registration_complete/reopen

// Response: 400 Bad Request
{
  "statusCode": 400,
  "message": "Cannot reopen REGISTRATION_COMPLETE step. Registration cannot be undone.",
  "error": "Bad Request"
}
```

#### Cannot Reopen Uncompleted Step

```json
// Request: Trying to reopen PAYMENT_SETUP that was skipped (not completed)
PATCH /admin/onboarding/steps/payment_setup/reopen

// Response: 400 Bad Request
{
  "statusCode": 400,
  "message": "Cannot reopen step 'payment_setup' - it was never completed. Only completed steps can be reopened.",
  "error": "Bad Request"
}
```

#### Invalid Step Name

```json
// Request
PATCH /admin/onboarding/steps/invalid_step/reopen

// Response: 400 Bad Request
{
  "statusCode": 400,
  "message": "Invalid onboarding step: invalid_step",
  "error": "Bad Request"
}
```

### UI/UX Recommendations

#### 1. Clear Visual Indication

Show "Edit" buttons prominently on completed steps:

```
✅ Registration Complete                [Cannot Edit]
✅ Business Identity                    [Edit ✏️]
✅ Branch Setup                         [Edit ✏️]
→  Menu Setup                           [In Progress]
   Payment Methods                      [Not Started]
```

#### 2. Warning Before Reopening

Always warn users about cascade invalidation:

```
┌─────────────────────────────────────────────────┐
│  ⚠️ Edit Business Identity?                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Editing this step will mark the following      │
│  steps as incomplete:                           │
│                                                 │
│  • Branch Setup                                 │
│  • Menu Setup                                   │
│  • Payment Methods                              │
│                                                 │
│  You'll need to re-complete these steps.        │
│  Your previous answers will be saved.           │
│                                                 │
│  [ Cancel ]        [ Yes, Edit Step ]           │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3. Pre-fill Forms with Existing Data

When user reopens a step, pre-populate form with preserved step data:

```typescript
// Fetch current progress
const progress = await api.get('/admin/onboarding/progress');

// Pre-fill business identity form
const businessData = progress.stepData.business_identity;
if (businessData) {
  form.setValue('businessName', businessData.businessName);
  form.setValue('businessType', businessData.businessType);
  form.setValue('slug', businessData.slug);
}
```

#### 4. Highlight Invalidated Steps

After reopening, visually show which steps need re-completion:

```
✅ Registration Complete
→  Business Identity                    [Editing...]
⚠️ Branch Setup                        [Needs Re-completion]
⚠️ Menu Setup                          [Needs Re-completion]
⚠️ Payment Methods                     [Needs Re-completion]
```

### Re-completion Workflow

After reopening a step, users must re-complete it and all subsequent steps:

```
1. User completes steps 1-5
2. User realizes business name has typo
3. User clicks "Edit" on Business Identity (step 2)
   → Steps 3-5 become incomplete
   → Step data preserved
4. User fixes business name
5. User clicks "Next" → re-completes step 2
6. User re-completes step 3 (branch setup)
   → Can use preserved data or change it
7. User re-completes step 4 (menu)
8. User re-completes step 5 (payment)
9. Onboarding progress restored!
```

### Best Practices

1. **Always show warning** - Users should understand cascade invalidation before confirming
2. **Preserve data** - Pre-fill forms with existing stepData so users can make quick corrections
3. **Visual feedback** - Clearly indicate which steps need re-completion after reopen
4. **Cannot reopen registration** - Disable "Edit" button for REGISTRATION_COMPLETE step
5. **Only completed steps** - Cannot reopen steps that were never completed or were skipped
6. **Completion percentage updates** - Progress bar should reflect invalidated steps
7. **Handle onboarding complete** - If user reopens GO_LIVE, `isCompleted` becomes `false`

### Common Questions

#### Q: What happens to my data when I reopen a step?

**A**: Your data is **preserved**, not deleted. All `stepData` remains available so you can see your previous answers and make corrections without re-entering everything.

#### Q: Can I reopen a step I skipped?

**A**: No. You can only reopen steps that were actually completed. Skipped steps can be completed normally by navigating to them.

#### Q: What if I reopen step 2 but don't want to re-complete step 4?

**A**: Unfortunately, you must re-complete all subsequent steps after the reopened step. This ensures data consistency (e.g., menu templates match business type).

#### Q: Can I undo a reopen?

**A**: No direct "undo" feature, but you can simply re-complete the reopened step without making changes, then re-complete subsequent steps using the preserved data.

#### Q: Why can't I reopen REGISTRATION_COMPLETE?

**A**: Registration creates fundamental tenant data (phone number, initial tenant record, owner account). This cannot be undone without deleting the entire tenant, which would require contacting support.

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
│  ℹ️  Used in URLs: golden-dragon.horyco.com     │
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
  "logoUrl": "https://cdn.horyco.com/tenants/logos/golden-dragon.png"
}

Response: OnboardingProgressResponseDto
{
  "currentStep": "branch_setup",
  "completedSteps": ["registration_complete", "business_identity"],
  "isCompleted": false,
  "completionPercentage": 29,
  "stepData": { ... },
  "nextStep": "branch_setup",
  "remainingSteps": ["branch_setup", "menu_template", ...],
  "tenantId": 1,
  "branchId": null,
  "createdAt": "2025-10-30T09:00:00Z",
  "updatedAt": "2025-10-30T10:30:00Z"
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

Response: OnboardingProgressResponseDto
{
  "currentStep": "menu_template",
  "completedSteps": ["registration_complete", "business_identity", "branch_setup"],
  "isCompleted": false,
  "completionPercentage": 43,
  "stepData": { ... },
  "nextStep": "menu_template",
  "remainingSteps": ["menu_template", "payment_setup", ...],
  "tenantId": 1,
  "branchId": 5,  // ← Available immediately after this step!
  "createdAt": "2025-10-30T09:00:00Z",
  "updatedAt": "2025-10-30T11:00:00Z"
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

Response: OnboardingProgressResponseDto
{
  "currentStep": "payment_setup",
  "completedSteps": ["registration_complete", "business_identity", "branch_setup", "menu_template"],
  "isCompleted": false,
  "completionPercentage": 57,
  "stepData": {
    "menu_template": {
      "success": true,
      "categoriesCreated": 1,
      "productsCreated": 2,
      "completedAt": "2025-10-30T11:30:00Z"
    }
  },
  "nextStep": "payment_setup",
  "remainingSteps": ["payment_setup", "staff_invited", "go_live"],
  "tenantId": 1,
  "branchId": 5,
  "createdAt": "2025-10-30T09:00:00Z",
  "updatedAt": "2025-10-30T11:30:00Z"
}

// 3. Or skip this step using unified skip endpoint
PATCH /admin/onboarding/skip-step
Headers: Authorization: Bearer {token}

{
  "step": "menu_template",
  "reason": "Will add menu items manually later"
}

Response: OnboardingProgressResponseDto (with menu_template marked as skipped in stepData)
```

### Frontend Implementation Notes

1. **Load Defaults**: Call `GET /admin/onboarding/default-products?businessType=restaurant`
2. **Let User Customize**: Display defaults in editable form
3. **Submit Menu**: Send customized structure to `POST /admin/onboarding/steps/menu-setup`
4. **Or Skip**: Call `PATCH /admin/onboarding/skip-step` with `step: "menu_template"` to start with empty menu

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

3. **Step Completion (NEW - Standardized)**:
  - POST to appropriate endpoint based on current step
  - **All endpoints return `OnboardingProgressResponseDto`** - use single handler!
  - Extract `branchId` from response (available after branch setup)
  - Extract `tenantId` from response (always available)
  - Navigate using `response.nextStep` field
  - Update progress bar using `response.completionPercentage`
  - **No need to call `/progress` separately** - data is in step response!

4. **Simplified Response Handler (NEW)**:
   ```typescript
   async function handleStepComplete(stepEndpoint: string, data: any) {
     const response = await api.post(stepEndpoint, data);
     // response is always OnboardingProgressResponseDto
     setProgress(response);
     if (response.branchId) {
       setBranchId(response.branchId); // Available after branch setup
     }
     navigateToStep(response.nextStep);
     updateProgressBar(response.completionPercentage);
   }
   ```

5. **Skip Functionality**:
  - PATCH to `/admin/onboarding/skip-step` with step name and optional reason
  - Returns `OnboardingProgressResponseDto` (same as all other endpoints)
  - **Skippable steps**: `menu_template`, `payment_setup`, `staff_invited`
  - **Required steps** (cannot skip): `registration_complete`, `business_identity`, `branch_setup`, `go_live`
  - Skipped steps are marked as completed with skip metadata in `stepData`
  - Update progress and move to next step on success

---

## API Endpoints

### Progress Tracking

```
// Get onboarding progress
GET /admin/onboarding/progress

// Validate if onboarding can be completed (NEW)
GET /admin/onboarding/validation

// Complete specific steps
POST /admin/onboarding/steps/business-identity
POST /admin/onboarding/steps/branch-setup
POST /admin/onboarding/steps/menu-setup
POST /admin/onboarding/steps/payment-setup
POST /admin/onboarding/steps/staff-invite

// Reopen a completed step for editing (NEW)
PATCH /admin/onboarding/steps/:step/reopen
Path Params: {
  step: "business_identity" | "branch_setup" | "menu_template" |
        "payment_setup" | "staff_invited" | "go_live"
}
Note: Cannot reopen "registration_complete"

// Skip optional steps (MENU_TEMPLATE, PAYMENT_SETUP, STAFF_INVITED)
PATCH /admin/onboarding/skip-step
Body: {
  step: "menu_template" | "payment_setup" | "staff_invited",
  reason?: string  // Optional
}

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

**Yes, in two ways**:

1. **During onboarding** - Use the reopen step feature:
  - Click "Edit" button next to any completed step
  - Make your changes
  - Re-complete subsequent steps
  - See [Reopen Step for Editing](#-reopen-step-for-editing-new) section for details

2. **After onboarding** - Modify settings in the main admin panel:
  - Business Settings
  - Branch Management
  - Menu Management
  - Staff Management
  - Payment Settings

Onboarding wizard is just for initial setup - all configurations can be changed anytime.

### Q: What happens if I close the browser during onboarding?

**Progress is saved**. When you log in again:
- You'll be redirected back to onboarding
- Progress bar shows where you left off
- All completed steps are saved
- You continue from where you stopped

### Q: Can I skip the entire onboarding?

**No**. Required steps must be completed:
- Registration Complete (auto-completed during signup)
- Business Identity
- Branch Setup
- Go Live (final step)

Optional steps can be skipped using `PATCH /admin/onboarding/skip-step`:
- **Menu Template** - Start with empty menu, add products later
- **Payment Setup** - Accept only cash/card, configure gateways later
- **Staff Invites** - Add employees later in Staff Management

Note: The old `/steps/menu-skip` endpoint has been removed. Use the unified `/skip-step` endpoint for all optional steps.

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
