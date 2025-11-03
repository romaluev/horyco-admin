# Admin Settings Management

**Purpose**: This document describes the settings and configuration management workflows for the OshLab Admin Panel. Settings control tenant-level and branch-level configurations including branding, features, integrations, and operational parameters.

**Last Updated**: 2025-11-03
**API Version**: v1
**Related Endpoints**: `/admin/settings/*`

---

## Table of Contents

1. [Overview](#overview)
2. [Settings Architecture](#settings-architecture)
3. [Structured Settings Response](#structured-settings-response)
4. [Branding Settings](#branding-settings)
5. [Feature Flags](#feature-flags)
6. [Integration Settings](#integration-settings)
7. [Branch-Level Overrides](#branch-level-overrides)
8. [User Flows](#user-flows)
9. [Error Handling](#error-handling)
10. [Security Considerations](#security-considerations)

---

## Overview

OshLab settings system supports **two-level configuration**:
- **Tenant Level**: Default settings for the entire business
- **Branch Level**: Override settings for specific locations

### Key Concepts

- **Settings Inheritance**: Branch settings inherit from tenant defaults
- **Selective Override**: Branches can override only specific settings
- **Type Safety**: All settings are validated against predefined schemas
- **Scope Transparency**: Responses indicate whether values are tenant or branch-level
- **Audit Trail**: All changes tracked with userId and timestamp

---

## Settings Architecture

### Settings Categories

| Category | Description | Tenant-Level | Branch-Level |
|----------|-------------|--------------|--------------|
| **Branding** | Visual identity, logos, colors, social links | ✅ | ✅ |
| **Features** | Feature flags for enabled/disabled functionality | ✅ | ✅ |
| **Payments** | Payment gateway configurations | ✅ | ❌ |
| **SMS** | SMS provider settings | ✅ | ❌ |
| **Limits** | Operational limits (max orders, employees) | ✅ | ❌ |

### Predefined Settings

All settings are **predefined in code** with validation schemas. You cannot create arbitrary settings. The system includes:

- **15 Branding Settings**: brand name, logos, colors, social media links
- **12 Feature Flags**: QR ordering, loyalty, delivery, table reservations, etc.
- **9 Payment Settings**: PayMe, Click, Uzum integrations
- **6 SMS Settings**: Playmobile, Eskiz provider configurations
- **5 Limits**: max employees, branches, products, orders per day

---

## Structured Settings Response

### Endpoint: `GET /admin/settings`

**Purpose**: Retrieve all settings in a single structured response.

**Query Parameters**:
- `branchId` (optional): Get branch-specific view with overrides

**Response Structure**:

```json
{
  "tenantId": 1,
  "branchId": 2,  // Present if branchId query param provided
  "branding": {
    "brandName": {
      "key": "brand.name",
      "value": "My Restaurant",
      "scope": "tenant",
      "isOverride": false
    },
    "logoUrl": {
      "key": "brand.logo.url",
      "value": "https://...",
      "scope": "branch",
      "isOverride": true,
      "inheritedFrom": "2"  // Branch ID that set this override
    }
    // ... more branding settings
  },
  "features": {
    "qrOrderingEnabled": {
      "key": "features.qr_ordering",
      "value": true,
      "scope": "tenant",
      "isOverride": false
    }
    // ... more feature flags
  },
  "payments": {
    "paymeEnabled": {
      "key": "payment.payme.enabled",
      "value": true,
      "scope": "tenant",
      "isOverride": false
    },
    "paymeMerchantId": {
      "key": "payment.payme.merchant_id",
      "value": "***masked***",  // Secrets are masked
      "scope": "tenant",
      "isOverride": false
    }
    // ... more payment settings
  },
  "sms": {
    "smsProvider": {
      "key": "sms.provider",
      "value": "playmobile",
      "scope": "tenant",
      "isOverride": false
    }
    // ... more SMS settings
  }
}
```

**Metadata Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Internal setting identifier (e.g., "brand.name") |
| `value` | any | Actual setting value (typed: string, number, boolean, object) |
| `scope` | 'tenant' \| 'branch' | Which level this value applies to |
| `isOverride` | boolean | `true` if branch overrides tenant default, `false` if inherited |
| `inheritedFrom` | string | Branch ID (when scope='branch'), or 'tenant' (when inherited) |

**Use Cases**:
- Display complete settings overview page
- Show which settings are customized per branch
- Provide visual indicators for overridden values

---

## Branding Settings

### Endpoint: `GET /admin/settings/branding`

**Purpose**: Retrieve branding-specific settings with metadata.

**Query Parameters**:
- `branchId` (optional): Get branch-specific branding

**Branding Categories**:

1. **Brand Identity**:
   - `brand.name` - Business name
   - `brand.description` - Business description
   - `brand.logo.url` - Logo image URL
   - `brand.logo.dark.url` - Dark theme logo
   - `brand.favicon.url` - Favicon URL

2. **Visual Design**:
   - `brand.primary_color` - Primary brand color (hex)
   - `brand.secondary_color` - Secondary color (hex)

3. **Social Media**:
   - `brand.social.facebook` - Facebook page URL
   - `brand.social.instagram` - Instagram handle
   - `brand.social.telegram` - Telegram channel
   - `brand.social.website` - Business website

4. **Contact**:
   - `brand.contact.phone` - Primary phone number
   - `brand.contact.email` - Contact email
   - `brand.contact.address` - Physical address

### Endpoint: `PUT /admin/settings/branding`

**Purpose**: Update branding settings.

**Query Parameters**:
- `branchId` (optional): Update branch-specific branding

**Request Body**:

```json
{
  "brandName": "New Restaurant Name",
  "logoUrl": "https://cdn.example.com/logo.png",
  "primaryColor": "#FF5733",
  "facebookUrl": "https://facebook.com/myrestaurant"
}
```

**Notes**:
- Only include fields you want to update (partial updates supported)
- Tenant-level: Updates default branding for all branches
- Branch-level: Creates override for that specific branch
- Other branches continue using tenant defaults unless they have their own overrides

**Response**: Returns updated branding settings with metadata.

---

## Feature Flags

### Endpoint: `GET /admin/settings/features`

**Purpose**: Retrieve feature flag states.

**Query Parameters**:
- `branchId` (optional): Get branch-specific feature flags

**Available Feature Flags**:

| Feature | Key | Description |
|---------|-----|-------------|
| QR Ordering | `features.qr_ordering` | Enable QR code menu ordering |
| Loyalty Program | `features.loyalty` | Enable customer loyalty rewards |
| Delivery | `features.delivery` | Enable delivery orders |
| Dine-In | `features.dine_in` | Enable dine-in table service |
| Takeaway | `features.takeaway` | Enable takeaway orders |
| Reservations | `features.reservations` | Enable table reservations |
| Online Payment | `features.online_payment` | Enable online payment options |
| Tips | `features.tips` | Enable digital tipping |
| Reviews | `features.reviews` | Enable customer reviews |
| Multi-Language | `features.multi_language` | Enable multiple languages |
| Dark Mode | `features.dark_mode` | Enable dark theme |
| Analytics | `features.analytics` | Enable analytics dashboard |

**Response Example**:

```json
{
  "qrOrderingEnabled": {
    "key": "features.qr_ordering",
    "value": true,
    "scope": "tenant",
    "isOverride": false
  },
  "deliveryEnabled": {
    "key": "features.delivery",
    "value": true,
    "scope": "branch",
    "isOverride": true,
    "inheritedFrom": "2"
  }
}
```

### Endpoint: `PUT /admin/settings/features`

**Purpose**: Update feature flags.

**Query Parameters**:
- `branchId` (optional): Update branch-specific feature flags

**Request Body**:

```json
{
  "qrOrderingEnabled": true,
  "deliveryEnabled": false,
  "loyaltyEnabled": true
}
```

**Important Behavior**:
- **Without branchId**: Updates tenant-level defaults
  - Affects all branches that don't have overrides
  - Branches with overrides remain unchanged

- **With branchId**: Updates that branch only
  - Creates/updates branch-level override
  - Does not affect tenant or other branches
  - Branch can later be "reset" by deleting the override

**Response**: Returns updated feature flags with metadata and success message.

### Endpoint: `GET /admin/settings/features/:featureName/check`

**Purpose**: Check if a specific feature is enabled (for quick checks).

**Query Parameters**:
- `branchId` (optional): Check for specific branch

**Response**:

```json
{
  "enabled": true,
  "scope": "branch",
  "inheritedFrom": "2"
}
```

---

## Integration Settings

### Payment Integrations

**Endpoint**: `GET /admin/settings/integrations/payments`

**Supported Providers**:
- **PayMe**: Uzbekistan payment gateway
- **Click**: Uzbekistan payment gateway
- **Uzum**: Uzbekistan payment gateway

**Settings Per Provider**:
- `{provider}Enabled` - Enable/disable provider
- `{provider}MerchantId` - Merchant identifier (secret - masked in responses)
- `{provider}SecretKey` - API secret key (secret - masked in responses)

**Response Example**:

```json
{
  "paymeEnabled": {
    "key": "payment.payme.enabled",
    "value": true,
    "scope": "tenant",
    "isOverride": false
  },
  "paymeMerchantId": {
    "key": "payment.payme.merchant_id",
    "value": "***masked***",
    "scope": "tenant",
    "isOverride": false
  }
}
```

**Security Note**: Secret values are always masked with `***masked***` in GET responses. Update via `PUT /admin/settings` with actual values.

### SMS Integrations

**Endpoint**: `GET /admin/settings/integrations/sms`

**Supported Providers**:
- **Playmobile**: Default SMS provider (Uzbekistan)
- **Eskiz**: Alternative SMS provider (Uzbekistan)

**Settings Per Provider**:
- `smsProvider` - Active provider ('playmobile' or 'eskiz')
- `{provider}Login` - API login (secret - masked)
- `{provider}Password` - API password (secret - masked)
- `{provider}Sender` - Sender name (e.g., "OshLab")

**Testing Endpoint**: `POST /admin/settings/integrations/test`

**Purpose**: Test integration configuration by sending a test SMS or payment verification.

**Request Body**:
```json
{
  "provider": "playmobile",  // or "eskiz" for SMS, "payme"/"click"/"uzum" for payments
  "phoneNumber": "+998901234567"  // For SMS testing (optional for payment tests)
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "provider": "playmobile",
  "message": "SMS sent successfully to +998901234567",
  "details": {
    "responseTime": 1250,  // Milliseconds
    "endpoint": "https://api.playmobile.uz/sms/send",
    "statusCode": 200
  }
}
```

**Failure Response** (200 OK with success=false):
```json
{
  "success": false,
  "provider": "payme",
  "message": "Integration test failed",
  "error": "Invalid merchant ID or secret key",
  "details": {
    "responseTime": 850,
    "endpoint": "https://checkout.paycom.uz",
    "statusCode": 401
  }
}
```

**Response Fields**:
- `success` - Boolean indicating if test succeeded
- `provider` - Provider that was tested
- `message` - Human-readable result message
- `error` - Error details (only present if success=false)
- `details.responseTime` - API response time in milliseconds (for performance monitoring)
- `details.endpoint` - API endpoint that was called
- `details.statusCode` - HTTP status code from provider API

**UI Recommendations**:
- Show "Test Configuration" button next to each provider
- Display loading spinner during test (can take 1-3 seconds)
- Show success message with green checkmark if test passes
- Show error details in red if test fails
- Display response time for performance awareness
- Allow retry if test fails

---

## Branch-Level Overrides

### How Branch Overrides Work

1. **Default State**: All branches inherit tenant-level settings
2. **Create Override**: Set branch-specific value via `?branchId=X` parameter
3. **Override Active**: Branch uses its custom value, ignores tenant default
4. **Tenant Update**: Changing tenant setting doesn't affect branches with overrides
5. **Delete Override**: Remove branch setting to return to tenant default

### Use Cases for Branch Overrides

**Branding**:
- Different logo per branch location
- Branch-specific contact information
- Localized social media accounts

**Feature Flags**:
- Enable delivery only for some branches
- Test new features in pilot branch
- Disable QR ordering in specific locations

**Not Supported for Branch-Level**:
- Payment integrations (tenant-level only)
- SMS provider (tenant-level only)
- Operational limits (tenant-level only)

### Visual Indicators for Frontend

Show users when a setting is overridden:

```
Brand Name: "Downtown Location"
  [Tenant] [Override Active] [Reset to Default]

Delivery Enabled: ON
  [Tenant Default] [No Override]
```

**Metadata Usage**:
- `scope === 'branch'` → Show branch indicator
- `isOverride === true` → Show "Override Active" badge
- `isOverride === false` → Show "Using Default" label
- `inheritedFrom` → Show "Inherited from Tenant"

---

## User Flows

### Flow 1: View All Settings

**User Action**: Navigate to Settings page

**Steps**:
1. Call `GET /admin/settings`
2. Parse structured response
3. Display settings grouped by category (Branding, Features, Integrations, Limits)
4. Show metadata badges (Tenant/Branch, Override status)

**UI Recommendations**:
- Tabs or sections for each category
- Visual hierarchy: Category → Settings group → Individual settings
- Color coding: Tenant (blue), Branch Override (orange), Inherited (gray)

### Flow 2: View Branch-Specific Settings

**User Action**: Select branch from dropdown, view settings

**Steps**:
1. User selects branch from branch selector
2. Call `GET /admin/settings?branchId={selectedBranchId}`
3. Display settings with branch overrides highlighted
4. Show "Using tenant default" for non-overridden settings

**UI Recommendations**:
- Branch selector at top of settings page
- Clear indication of which settings are customized
- "Reset to tenant default" button for overridden settings

### Flow 3: Update Tenant-Level Settings

**User Action**: Admin updates default branding

**Steps**:
1. Display settings form (pre-filled with current values)
2. User modifies fields (e.g., brand name, logo URL)
3. Call `PUT /admin/settings/branding` (without branchId)
4. Show success message: "Tenant settings updated. Branches without overrides will use new values."
5. Refresh settings display

**Important**: Warn user that branches with overrides won't be affected.

### Flow 4: Create Branch Override

**User Action**: Customize settings for specific branch

**Steps**:
1. Select branch from dropdown
2. Call `GET /admin/settings/branding?branchId={id}` to load current state
3. Modify fields user wants to override
4. Call `PUT /admin/settings/branding?branchId={id}`
5. Show success message: "Branch override created. This branch now uses custom settings."
6. Update UI to show override badges

**UI Recommendations**:
- Checkbox per setting: "Override for this branch"
- Disabled fields for non-overridden settings (show tenant value)
- Prominent "Save Override" button

### Flow 5: Toggle Feature Flags

**User Action**: Enable/disable features

**Steps**:

**Tenant-Level**:
1. Call `GET /admin/settings/features` (no branchId)
2. Display toggle switches for all features
3. User toggles feature on/off
4. Call `PUT /admin/settings/features` with updated values
5. Show success: "Feature settings updated for all branches"

**Branch-Level**:
1. Select branch
2. Call `GET /admin/settings/features?branchId={id}`
3. Display toggles with override indicators
4. User toggles feature
5. Call `PUT /admin/settings/features?branchId={id}`
6. Show success: "Feature settings updated for {branchName}"

**UI Recommendations**:
- Toggle switches with clear labels
- Instant visual feedback on toggle
- Loading state while API call processes
- Success toast notification

### Flow 6: Reset Branch Override to Tenant Default

**User Action**: Remove branch customization

**Steps**:
1. Display branch settings with override indicators
2. User clicks "Reset to Default" button next to overridden setting
3. Call `DELETE /admin/settings/{category}?branchId={id}&key={settingKey}`
   - *(Note: This endpoint may need implementation)*
4. Or: Call PUT with null/undefined value to remove override
5. Refresh settings to show tenant default now applies
6. Show success: "Branch override removed. Now using tenant default."

---

## Error Handling

### Common Error Scenarios

**1. Invalid Branch Access (403 Forbidden)**

```json
{
  "statusCode": 403,
  "message": "Branch does not belong to your tenant",
  "error": "Forbidden"
}
```

**User Guidance**: "You don't have permission to modify this branch. Contact your administrator."

**2. Branch Not Found (404 Not Found)**

```json
{
  "statusCode": 404,
  "message": "Branch with ID 999 not found",
  "error": "Not Found"
}
```

**User Guidance**: "Branch not found. It may have been deleted."

**3. Invalid Setting Key (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "Setting key 'invalid.key' is not defined in schema",
  "error": "Bad Request"
}
```

**User Guidance**: "Invalid setting. Please refresh the page and try again."

**4. Validation Error (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "primaryColor",
      "message": "Must be a valid hex color (e.g., #FF5733)"
    }
  ]
}
```

**User Guidance**: Display field-specific error messages inline in the form.

**5. Missing Required Fields (400 Bad Request)**

```json
{
  "statusCode": 400,
  "message": "Payment merchant ID is required when provider is enabled",
  "error": "Bad Request"
}
```

**User Guidance**: "Please fill in all required fields before enabling this integration."

### Error Handling Best Practices

1. **Validation Before Submit**:
   - Validate format client-side (colors, URLs, phone numbers)
   - Disable submit button until valid
   - Show inline validation errors

2. **API Error Display**:
   - Show user-friendly error messages (not raw API errors)
   - Display errors near relevant form fields
   - Provide actionable guidance ("Check your input" vs "An error occurred")

3. **Optimistic Updates**:
   - Update UI immediately on toggle switches
   - Revert if API call fails
   - Show error notification if revert occurs

4. **Retry Logic**:
   - Allow user to retry failed operations
   - Don't lose form data on error
   - Add "Retry" button in error notifications

---

## Security Considerations

### 1. Tenant Isolation

- **Always enforced**: All endpoints validate tenant ownership of branches
- Branch from different tenant → 403 Forbidden
- Cannot read or modify other tenants' settings

### 2. Permission-Based Access

**Recommended Permissions**:
- `settings.view` - View settings
- `settings.update.tenant` - Update tenant-level settings
- `settings.update.branch` - Update branch-level settings
- `integrations.manage` - Manage payment/SMS integrations

**Role Recommendations**:
- **Owner/Admin**: All settings permissions
- **Manager**: View + update branch settings only
- **Staff**: No settings access

### 3. Sensitive Data Handling

- **Secret Masking**: API keys, merchant IDs, passwords masked in GET responses
- **Frontend Storage**: Never store secrets in localStorage or sessionStorage
- **Display**: Show `***masked***` in UI for secret fields
- **Update**: Allow updating secrets, but don't pre-fill masked values in forms

### 4. Audit Trail

- All setting changes logged with:
  - `userId` - Who made the change
  - `timestamp` - When
  - `settingKey` - What was changed
  - `oldValue` / `newValue` - What changed
  - `scope` - Tenant or branch level

**Audit Log Access**: *(To be implemented)* `GET /admin/settings/audit-log`

### 5. Rate Limiting

- Settings endpoints have standard rate limits (10 requests/minute)
- Integration test endpoint stricter (5 requests/minute) to prevent API abuse

---

## Response Schema Reference

### AllSettingsResponseDto

```typescript
{
  tenantId: number,
  branchId?: number,
  branding: Record<string, SettingValueResponseDto>,
  features: Record<string, SettingValueResponseDto>,
  payments: Record<string, SettingValueResponseDto>,
  sms: Record<string, SettingValueResponseDto>
}
```

### SettingValueResponseDto

```typescript
{
  key: string,              // e.g., "brand.name"
  value: string | number | boolean | object,
  scope: 'tenant' | 'branch',
  isOverride: boolean,
  inheritedFrom?: string    // Branch ID or 'tenant'
}
```

### BrandingSettingsResponseDto

All fields follow `SettingValueResponseDto` structure:
- `brandName`, `brandDescription`
- `logoUrl`, `logoDarkUrl`, `faviconUrl`
- `primaryColor`, `secondaryColor`
- `facebookUrl`, `instagramUrl`, `telegramUrl`, `websiteUrl`
- `contactPhone`, `contactEmail`, `contactAddress`

### FeatureFlagsResponseDto

All fields follow `SettingValueResponseDto` structure with boolean values:
- `qrOrderingEnabled`, `loyaltyEnabled`, `deliveryEnabled`, `dineInEnabled`
- `takeawayEnabled`, `reservationsEnabled`, `onlinePaymentEnabled`
- `tipsEnabled`, `reviewsEnabled`, `multiLanguageEnabled`
- `darkModeEnabled`, `analyticsEnabled`

---

## Implementation Checklist for Frontend

### Settings Overview Page

- [ ] Fetch all settings via `GET /admin/settings`
- [ ] Display categorized settings (Branding, Features, Integrations)
- [ ] Show metadata badges (Tenant, Branch, Override)
- [ ] Branch selector dropdown (optional)
- [ ] Handle loading and error states

### Branding Management

- [ ] Load branding via `GET /admin/settings/branding`
- [ ] Form with all branding fields
- [ ] File upload for logos/favicon
- [ ] Color picker for brand colors
- [ ] URL validation for social links
- [ ] Tenant/Branch toggle
- [ ] Submit via `PUT /admin/settings/branding`
- [ ] Success/error notifications

### Feature Flags Management

- [ ] Load features via `GET /admin/settings/features`
- [ ] Toggle switches for each feature
- [ ] Tenant/Branch selector
- [ ] Override indicators
- [ ] Optimistic UI updates
- [ ] Submit via `PUT /admin/settings/features`
- [ ] Feature descriptions/tooltips

### Integration Settings

- [ ] Load payment settings
- [ ] Load SMS settings
- [ ] Forms for provider configuration
- [ ] Secret field handling (masked display)
- [ ] Test integration button
- [ ] Success/error handling
- [ ] Provider selection (radio/dropdown)

### Branch Override Management

- [ ] Show override status per setting
- [ ] "Override for this branch" checkbox
- [ ] Reset to default button
- [ ] Visual differentiation (colors, badges)
- [ ] Confirmation dialog for reset
- [ ] Success notifications

---

## API Endpoint Summary

| Method | Endpoint | Purpose | Branch Support |
|--------|----------|---------|----------------|
| `GET` | `/admin/settings` | Get all settings | ✅ via `?branchId` |
| `GET` | `/admin/settings/branding` | Get branding settings | ✅ via `?branchId` |
| `PUT` | `/admin/settings/branding` | Update branding | ✅ via `?branchId` |
| `GET` | `/admin/settings/features` | Get feature flags | ✅ via `?branchId` |
| `PUT` | `/admin/settings/features` | Update feature flags | ✅ via `?branchId` |
| `GET` | `/admin/settings/features/:name/check` | Check single feature | ✅ via `?branchId` |
| `GET` | `/admin/settings/integrations/payments` | Get payment settings | ❌ Tenant only |
| `GET` | `/admin/settings/integrations/sms` | Get SMS settings | ❌ Tenant only |
| `POST` | `/admin/settings/integrations/test` | Test integration | ❌ Tenant only |

---

## Changelog

### 2025-11-03 - Task 8.2 Implementation
- ✅ Added structured settings response (`AllSettingsResponseDto`)
- ✅ Enhanced branding response with scope, isOverride, inheritedFrom metadata
- ✅ Implemented branch-level feature flags support
- ✅ Added integration settings with metadata and secret masking
- ✅ All settings now include complete metadata for transparency

### Previous Changes
- Task 8.1: Added schema-based validation, blocked arbitrary setting creation
- Initial implementation: Basic settings CRUD operations

---

## Support and Questions

For questions about settings implementation:
1. Review API endpoint Swagger documentation at `/api/docs`
2. Check response schemas in this document
3. Review e2e tests in `test/settings/` for usage examples
4. Contact backend team for schema changes or new setting types

---

**Document Version**: 1.0
**Task Reference**: Phase 8, Task 8.2
**Related Files**: `src/applications/admin-api/controllers/admin-settings.controller.ts`
