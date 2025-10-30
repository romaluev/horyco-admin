# Admin Panel — Business Signup & Authentication

This document explains the complete business signup process for new restaurant owners, including phone verification with OTP, account creation, and initial authentication.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Signup Flow](#signup-flow)
3. [Phone Number Verification (OTP)](#phone-number-verification-otp)
4. [Account Creation](#account-creation)
5. [Login Flow](#login-flow)
6. [PIN Authentication (POS)](#pin-authentication-pos)
7. [Frontend Implementation Guide](#frontend-implementation-guide)
8. [API Endpoints](#api-endpoints)

---

## Overview

### 🎯 Purpose

The signup system allows new restaurant owners to:
- Self-register without sales team involvement
- Verify their phone number with SMS OTP
- Create a tenant (restaurant brand) and their first branch
- Get immediate access to the admin panel
- Start configuring their restaurant

### 🔐 Security Features

**Phone Verification**:
- SMS OTP sent via Eskiz SMS provider
- 6-digit code valid for 5 minutes
- Maximum 3 verification attempts
- Rate limiting: 3 OTP requests per hour per phone
- Temporary block after max attempts exceeded

**Why phone verification?**
- Prevents fake registrations
- Ensures contact ownership
- Reduces spam/abuse
- Standard in Uzbekistan (preferred over email)

---

## Signup Flow

### Complete Registration Journey

```
1. Landing Page
   ↓
2. Enter Phone Number & Business Name
   ↓ (API: POST /auth/register/request-otp)
3. SMS Sent → Wait for OTP
   ↓
4. Enter OTP Code
   ↓ (API: POST /auth/register/verify-otp)
5. Phone Verified ✓
   ↓
6. Complete Profile Form
   ↓ (API: POST /auth/register/complete)
7. Account Created ✓
   ↓
8. Redirect to Onboarding Wizard
```

### What Gets Created During Signup

When a user completes signup, the system automatically creates:

1. **Tenant** (Restaurant Brand)
   - Unique tenant ID
   - Business name
   - Status: `trial` or `active`

2. **Owner Employee**
   - First user account
   - Automatically assigned "Admin" role (full access)
   - Can login to admin panel

3. **Default Branch**
   - Named same as business (can be changed later)
   - Marked as main branch
   - Ready for configuration

4. **Default Roles** (4 system roles)
   - Admin, Manager, Cashier, Waiter

5. **Default Settings**
   - Timezone: Asia/Tashkent
   - Currency: UZS
   - Language: uz
   - Business hours: 9 AM - 10 PM
   - Tax rate: 0% (to be configured)

6. **Default Payment Methods**
   - Cash (active)
   - Card (active)

---

## Phone Number Verification (OTP)

### Step 1: Request OTP

**User Journey**:
```
1. User enters phone number: +998 90 123 45 67
2. User enters business name: "Samarkand Restaurant"
3. User clicks "Send Code"
4. System sends SMS with 6-digit code
5. User receives SMS: "Your OshLab verification code: 123456. Valid for 5 minutes."
```

**UI Form**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         Welcome to OshLab! 🍽️                  │
│                                                 │
│  Let's get your restaurant online in minutes   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Phone Number *                                 │
│  ┌───────────────────────────────────────┐    │
│  │ +998 │ 90 123 45 67                   │    │
│  └───────────────────────────────────────┘    │
│  ℹ️  We'll send a verification code via SMS    │
│                                                 │
│  Business Name *                                │
│  ┌───────────────────────────────────────┐    │
│  │ Samarkand Restaurant                   │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  [ Send Verification Code ]                    │
│                                                 │
│  Already have an account? [Login]              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Call**:
```typescript
POST /auth/register/request-otp
{
  "phone": "+998901234567",        // Required, format: +998XXXXXXXXX
  "businessName": "Samarkand Restaurant"  // Required, 2-255 chars
}

Response (Success):
{
  "success": true,
  "message": "OTP sent successfully",
  "phone": "+998901234567",
  "expiresAt": "2025-10-30T10:35:00Z"  // 5 minutes from now
}

Response (Rate Limited):
{
  "statusCode": 429,
  "message": "Too many OTP requests. Please try again later."
}
```

**Phone Number Format**:
- Must start with +998 (Uzbekistan country code)
- Format: +998XXXXXXXXX (total 13 characters)
- Example: +998901234567
- Frontend should auto-format as user types: +998 90 123 45 67

### Step 2: Verify OTP Code

**User Journey**:
```
1. User sees "Code sent to +998 90 123 45 67"
2. User enters 6-digit code: 1 2 3 4 5 6
3. System verifies code
   → Success: Phone verified ✓
   → Failure: "Invalid code. 2 attempts remaining."
```

**UI Form**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         Enter Verification Code                │
│                                                 │
│  We sent a 6-digit code to                     │
│  +998 90 123 45 67                              │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│         ┌───┬───┬───┬───┬───┬───┐             │
│  Code:  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │             │
│         └───┴───┴───┴───┴───┴───┘             │
│                                                 │
│  ⏱️  Code expires in: 04:23                     │
│                                                 │
│  [ Verify ]                                    │
│                                                 │
│  Didn't receive code?                          │
│  [Resend Code] (available in 52 seconds)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Call**:
```typescript
POST /auth/register/verify-otp
{
  "phone": "+998901234567",
  "code": "123456"              // Exactly 6 digits
}

Response (Success):
{
  "success": true,
  "verified": true,
  "phone": "+998901234567",
  "message": "OTP verified successfully"
}

Response (Invalid Code):
{
  "statusCode": 400,
  "message": "Invalid or expired OTP code"
}

Response (Max Attempts Exceeded):
{
  "statusCode": 429,
  "message": "Too many verification attempts. Please request a new code."
}

Response (Registration Not Found):
{
  "statusCode": 404,
  "message": "Registration request not found"
}
```

**Important Notes**:
- `businessName` is REQUIRED and will be used as the tenant's name
- `fullName` is the owner's personal name (different from business name)
- The tenant will be created with `name = businessName`, not the owner's name

**Frontend Implementation Notes**:
- Auto-focus to the next OTP input field when a digit is entered
- Auto-submit the OTP when all 6 digits are entered
- Implement a countdown timer showing remaining time (starts at 5 minutes)
- Mark OTP as expired when timer reaches zero
- Display appropriate error messages for invalid codes, expired codes, or max attempts exceeded

### Step 3: Resend OTP (If Needed)

**When to allow resend**:
- Initial code expired (after 5 minutes)
- User didn't receive SMS
- User entered wrong number initially

**Rate Limiting**:
- Wait 60 seconds between resend requests
- Maximum 3 OTP requests per hour

**API Call**:
```typescript
POST /auth/register/resend-otp
{
  "phone": "+998901234567"
}

Response (Success):
{
  "success": true,
  "message": "OTP sent successfully",
  "phone": "+998901234567",
  "expiresAt": "2025-10-30T10:40:00Z"
}

Response (Rate Limited):
{
  "statusCode": 429,
  "message": "Too many OTP requests. Please try again later."
}
```

---

## Account Creation

### Complete Profile Form

**After OTP verified**, user fills out their profile:

**UI Form**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         Complete Your Profile                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Owner Information:                             │
│                                                 │
│  Full Name *                                    │
│  ┌───────────────────────────────────────┐    │
│  │ Akmal Karimov                          │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Email (optional)                               │
│  ┌───────────────────────────────────────┐    │
│  │ akmal@samarkand.uz                     │    │
│  └───────────────────────────────────────┘    │
│  ℹ️  We'll send receipts and notifications      │
│                                                 │
│  Create Password *                              │
│  ┌───────────────────────────────────────┐    │
│  │ ••••••••                               │    │
│  └───────────────────────────────────────┘    │
│  ✓ At least 8 characters                       │
│  ✓ Include numbers or symbols                  │
│                                                 │
│  Confirm Password *                             │
│  ┌───────────────────────────────────────┐    │
│  │ ••••••••                               │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  ☑ I agree to [Terms of Service] and          │
│     [Privacy Policy]                            │
│                                                 │
│  [ Create Account ]                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Call**:
```typescript
POST /auth/register/complete
{
  "phone": "+998901234567",          // Required, must be verified
  "fullName": "Akmal Karimov",       // Required, owner's full name
  "email": "akmal@samarkand.uz",     // Required, valid email format
  "password": "secure123!",          // Required, minimum 8 characters
  "businessName": "Samarkand Restaurant"  // Optional, uses OTP request name if omitted
}

Response (Success):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,  // 15 minutes
  "tenant": {
    "id": 123,
    "name": "Samarkand Restaurant",
    "slug": "samarkand-restaurant-123",
    "businessType": "restaurant",
    "email": "akmal@samarkand.uz",
    "phone": "+998901234567"
  },
  "employee": {
    "id": 456,
    "fullName": "Akmal Karimov",
    "phone": "+998901234567",
    "roles": ["Admin"],
    "activeBranchId": 1
  },
  "message": "Registration completed successfully"
}

Response (Phone Not Verified):
{
  "statusCode": 400,
  "message": "Phone number not verified. Please complete OTP verification first."
}

Response (Phone Already Registered):
{
  "statusCode": 409,
  "message": "Phone or email already registered"
}
```

**What Happens After Creation**:
1. Account created with all default data
2. Access token returned (user is logged in)
3. Welcome email sent (if email provided)
4. User redirected to onboarding wizard
5. Onboarding progress initialized

---

## Login Flow

### Regular Login (Phone + Password)

**UI Form**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         Login to OshLab                         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Phone Number                                   │
│  ┌───────────────────────────────────────┐    │
│  │ +998 │ 90 123 45 67                   │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  Password                                       │
│  ┌───────────────────────────────────────┐    │
│  │ ••••••••                        [👁]   │    │
│  └───────────────────────────────────────┘    │
│                                                 │
│  ☐ Remember me                                 │
│                                                 │
│  [ Login ]                                     │
│                                                 │
│  [Forgot Password?]                            │
│                                                 │
│  Don't have an account? [Sign Up]              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Call**:
```typescript
POST /auth/login
{
  "phone": "+998901234567",        // Required, format: +998XXXXXXXXX
  "password": "secure123!",        // Required, minimum 8 characters
  "tenantSlug": "samarkand-restaurant-123"  // Optional, for multi-tenant disambiguation
}

Response (Success):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,  // 15 minutes
  "employee": {
    "id": 456,
    "phone": "+998901234567",
    "fullName": "Akmal Karimov",
    "roles": ["Admin"],
    "tenantId": 123,
    "activeBranchId": 10
  }
}

Response (Invalid Credentials):
{
  "statusCode": 401,
  "message": "Invalid phone number or password"
}

Response (Too Many Requests):
{
  "statusCode": 429,
  "message": "Too many login attempts. Please try again later."
}
```

### Token Refresh

**When to refresh**:
- Access token expires (after 15 minutes)
- Before making API call if token will expire soon (< 2 minutes remaining)

**API Call**:
```typescript
POST /auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Success):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // New refresh token (token rotation)
  "tokenType": "Bearer",
  "expiresIn": 900  // 15 minutes
}

Response (Invalid/Expired):
{
  "statusCode": 401,
  "message": "Invalid or expired refresh token. Please login again."
}

Response (Too Many Requests):
{
  "statusCode": 429,
  "message": "Too many requests. Please try again later."
}
```

**Frontend Token Management Guidelines**:
- Store both `accessToken` and `refreshToken` securely in localStorage or secure storage
- Add the access token to Authorization header for all authenticated requests: `Authorization: Bearer {token}`
- Implement an HTTP interceptor to automatically refresh tokens when receiving 401 responses
- When a 401 is received, attempt to get a new access token using the refresh token
- If refresh succeeds, retry the original request with the new token
- If refresh fails, logout the user and redirect to login page

---

## PIN Authentication (POS)

### Why PIN Login?

**Problem**: Entering phone + password on POS tablet is slow
**Solution**: 4-digit PIN for fast authentication

**Use Case**:
- Manager logs in with phone + password (first time)
- Manager generates PINs for all employees
- Employees login with PIN (takes 2 seconds)
- PINs valid for 30 days, then need regeneration

**Security**:
- PINs are hashed (not stored in plain text)
- PINs expire after 30 days
- PIN login only works for employees assigned to the branch
- Manager/Admin can revoke PINs anytime

### Setting Up PIN for Employee

**Manager/Admin Action**:

**UI**:
```
┌─────────────────────────────────────────────────┐
│  Employee: Akmal Karimov                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  POS Quick Login (PIN)                          │
│                                                 │
│  Status: ● Enabled                              │
│  PIN: ••••                                      │
│  Valid Until: Feb 20, 2024                      │
│                                                 │
│  [ Generate New PIN ]  [ Disable PIN ]          │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Call**:
```typescript
POST /auth/generate-pin
{
  "employeeId": 456
}

Response (Success):
{
  "pin": "1234",              // Only shown once!
  "expiresAt": "2025-02-20T00:00:00Z",
  "employeeId": 456,
  "message": "PIN generated successfully. Please share this PIN securely with the employee."
}

Response (Forbidden):
{
  "statusCode": 403,
  "message": "Insufficient permissions. Only Admin/Manager roles can generate PINs."
}

Response (Not Found):
{
  "statusCode": 404,
  "message": "Employee not found"
}
```

**Important**: The PIN is only shown once. Manager must share it with employee securely.

### PIN Login Flow (POS)

**UI (POS Tablet)**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│         Select Your Profile                     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │   👤    │  │   👤    │  │   👤    │        │
│  │         │  │         │  │         │        │
│  │  Akmal  │  │  Farrux │  │  Dilnoza│        │
│  │ Cashier │  │  Waiter │  │ Manager │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘

          ↓ (User clicks profile)

┌─────────────────────────────────────────────────┐
│                                                 │
│         Enter PIN for Akmal                     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│              ┌───┬───┬───┬───┐                 │
│       PIN:   │ • │ • │ • │ • │                 │
│              └───┴───┴───┴───┘                 │
│                                                 │
│     ┌───┬───┬───┐                              │
│     │ 1 │ 2 │ 3 │                              │
│     ├───┼───┼───┤                              │
│     │ 4 │ 5 │ 6 │                              │
│     ├───┼───┼───┤                              │
│     │ 7 │ 8 │ 9 │                              │
│     ├───┼───┼───┤                              │
│     │ ← │ 0 │ ✓ │                              │
│     └───┴───┴───┘                              │
│                                                 │
│     [Use Password Instead]                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Calls**:
```typescript
// Step 1: Get employees list for branch
GET /pos/staff/staff-list?branchId=10
Headers: Authorization: Bearer {JWT_TOKEN}

Response:
[
  {
    "id": 456,
    "fullName": "Akmal Karimov",
    "phoneNumber": "+998901234567",
    "hasPin": true,
    "photoUrl": "https://...",
    "roles": ["Cashier"],
    "isActive": true
  },
  {
    "id": 457,
    "fullName": "Farrux Aliyev",
    "phoneNumber": "+998909876543",
    "hasPin": false,
    "photoUrl": null,
    "roles": ["Waiter"],
    "isActive": true
  }
]

// Step 2: Login with PIN
POST /auth/pin-login
{
  "employeeId": 456,
  "pin": "1234",
  "branchId": 10  // Optional, for multi-branch employees
}

Response (Success):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "employee": {
    "id": 456,
    "fullName": "Akmal Karimov",
    "phone": "+998901234567",
    "roles": ["Cashier"],
    "activeBranchId": 10
  }
}

Response (Invalid PIN):
{
  "statusCode": 401,
  "message": "Invalid PIN"
}

Response (PIN Expired or Disabled):
{
  "statusCode": 400,
  "message": "PIN has expired or is not enabled. Please contact your manager."
}

Response (Too Many Attempts):
{
  "statusCode": 429,
  "message": "Too many failed attempts. Please try again later."
}
```

---

## API Endpoints

### Signup Flow

```
POST /auth/register/request-otp
Body: { phone, businessName }

POST /auth/register/verify-otp
Body: { phone, code }

POST /auth/register/resend-otp
Body: { phone }

POST /auth/register/complete
Body: { phone, fullName, email, password, businessName? }
```

### Login Flow

```
POST /auth/login
Body: { phone, password }

POST /auth/refresh
Body: { refreshToken }

GET /auth/me
Headers: Authorization: Bearer {token}

POST /auth/logout
Headers: Authorization: Bearer {token}
```

### PIN Authentication

```
GET /pos/staff/staff-list?branchId={branchId}
Headers: Authorization: Bearer {token}

POST /auth/pin-login
Body: { employeeId, pin, branchId? }

POST /auth/generate-pin
Body: { employeeId }
Headers: Authorization: Bearer {token}
Roles: Admin, Manager

POST /auth/refresh-pin
Headers: Authorization: Bearer {token}

GET /auth/pin-status/:employeeId
```

---

## Common Questions

### Q: Why phone verification instead of email?

**Phone verification is preferred in Uzbekistan** because:
- Everyone has a mobile phone
- SMS delivery is instant and reliable
- Phone numbers are tied to ID cards (reduces fraud)
- Standard practice for business applications
- Email may not be available or checked regularly

### Q: Can I skip email during signup?

**Yes**. Email is optional. The system will:
- Still work without email
- Send receipts via SMS instead
- Use phone for all notifications
- You can add email later in settings

### Q: What happens if I don't receive the SMS?

**Common solutions**:
1. Wait 60 seconds and click "Resend Code"
2. Check phone number is correct (+998...)
3. Check SMS inbox (sometimes delayed)
4. Contact support if issue persists

### Q: How long are access tokens valid?

**Access Token**: 15 minutes
**Refresh Token**: 7 days

Frontend should auto-refresh access tokens before they expire.

### Q: Can multiple employees share the same phone number?

**No**. Each phone number can only be registered once. Phone is the unique identifier for login.

If multiple people need access, create separate employees with different phone numbers.

### Q: What's the difference between signup and onboarding?

**Signup**: Create account + verify phone + login (5 minutes)
**Onboarding**: Configure restaurant settings (10-15 minutes)

After signup, user is redirected to onboarding wizard to complete setup.

---

## Next Steps

After successful signup/login:
1. User is redirected to onboarding wizard
2. Complete 7-step setup (see `ADMIN_ONBOARDING_WIZARD.md`)
3. Start using the system

For onboarding documentation, see:
- `ADMIN_ONBOARDING_WIZARD.md`
