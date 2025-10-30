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
  "phone": "+998901234567",
  "businessName": "Samarkand Restaurant"
}

Response (Success):
{
  "message": "OTP code sent successfully",
  "expiresAt": "2024-01-20T10:35:00Z"  // 5 minutes from now
}

Response (Rate Limited):
{
  "statusCode": 429,
  "message": "Too many OTP requests. Please try again in 45 minutes.",
  "nextAllowedAt": "2024-01-20T11:20:00Z"
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
  "code": "123456"
}

Response (Success):
{
  "verified": true,
  "message": "OTP verified successfully"
}

Response (Invalid Code - 2 attempts left):
{
  "statusCode": 400,
  "message": "Invalid OTP code. 2 attempts remaining."
}

Response (Max Attempts Exceeded):
{
  "statusCode": 429,
  "message": "Maximum verification attempts exceeded. Blocked until 11:45 AM.",
  "blockedUntil": "2024-01-20T11:45:00Z"
}

Response (Expired Code):
{
  "statusCode": 400,
  "message": "OTP code has expired. Please request a new code."
}
```

**Frontend Logic for OTP Input**:

```typescript
// Auto-focus next input when digit entered
const handleOtpInput = (index: number, value: string) => {
  if (value.length === 1 && index < 5) {
    // Move to next input
    inputRefs[index + 1].focus()
  }

  // Auto-submit when all 6 digits entered
  if (index === 5 && value.length === 1) {
    verifyOtp(otpCode)
  }
}

// Countdown timer
useEffect(() => {
  const timer = setInterval(() => {
    setTimeRemaining((prev) => prev - 1)
  }, 1000)

  if (timeRemaining <= 0) {
    setOtpExpired(true)
  }

  return () => clearInterval(timer)
}, [timeRemaining])
```

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
  "message": "OTP code sent successfully",
  "expiresAt": "2024-01-20T10:40:00Z"
}

Response (Too Soon):
{
  "statusCode": 429,
  "message": "Please wait 45 seconds before requesting a new code.",
  "retryAfter": 45  // seconds
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
  "phone": "+998901234567",          // Already verified
  "businessName": "Samarkand Restaurant",
  "ownerName": "Akmal Karimov",      // Full name
  "email": "akmal@samarkand.uz",     // Optional
  "password": "secure123!"
}

Response (Success):
{
  "success": true,
  "message": "Account created successfully",
  "tenant": {
    "id": 123,
    "name": "Samarkand Restaurant",
    "slug": "samarkand-restaurant-123",
    "status": "trial"
  },
  "employee": {
    "id": 456,
    "fullName": "Akmal Karimov",
    "phone": "+998901234567",
    "email": "akmal@samarkand.uz",
    "roles": ["Admin"]
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900  // 15 minutes
  }
}

Response (Phone Not Verified):
{
  "statusCode": 400,
  "message": "Phone number not verified. Please complete OTP verification first."
}

Response (Phone Already Registered):
{
  "statusCode": 409,
  "message": "Phone number already registered. Please login instead."
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
  "phone": "+998901234567",
  "password": "secure123!"
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

Response (Account Inactive):
{
  "statusCode": 403,
  "message": "Your account has been deactivated. Please contact support."
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
  "expiresIn": 900
}

Response (Invalid/Expired):
{
  "statusCode": 401,
  "message": "Invalid or expired refresh token. Please login again."
}
```

**Frontend Token Management**:

```typescript
// Store tokens securely
localStorage.setItem('accessToken', response.accessToken)
localStorage.setItem('refreshToken', response.refreshToken)

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')
      const newToken = await refreshAccessToken(refreshToken)

      if (newToken) {
        // Retry original request with new token
        error.config.headers.Authorization = `Bearer ${newToken}`
        return axios.request(error.config)
      } else {
        // Refresh failed, logout user
        redirectToLogin()
      }
    }
    return Promise.reject(error)
  }
)
```

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
  "success": true,
  "pin": "1234",              // Only shown once!
  "expiresAt": "2024-02-20T00:00:00Z",
  "message": "PIN generated successfully. Please share this PIN securely with the employee."
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
GET /pos/auth/staff-list?branchId=10

Response:
{
  "employees": [
    {
      "id": 456,
      "firstName": "Akmal",
      "lastName": "Karimov",
      "role": "Cashier",
      "avatar": "https://...",
      "hasPinEnabled": true,
      "pinExpiresAt": "2024-02-20T00:00:00Z"
    },
    {
      "id": 457,
      "firstName": "Farrux",
      "lastName": "Aliyev",
      "role": "Waiter",
      "avatar": null,
      "hasPinEnabled": false
    }
  ]
}

// Step 2: Login with PIN
POST /auth/pin-login
{
  "employeeId": 456,
  "pin": "1234",
  "branchId": 10  // Current branch
}

Response (Success):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "employee": {
    "id": 456,
    "fullName": "Akmal Karimov",
    "roles": ["Cashier"],
    "activeBranchId": 10
  }
}

Response (Invalid PIN):
{
  "statusCode": 401,
  "message": "Invalid PIN. 2 attempts remaining."
}

Response (PIN Expired):
{
  "statusCode": 400,
  "message": "PIN has expired. Please use password login or contact your manager."
}
```

---

## Frontend Implementation Guide

### Signup Page Flow

```typescript
// Step 1: Request OTP
const handleRequestOtp = async () => {
  try {
    const response = await api.post('/auth/register/request-otp', {
      phone: formatPhone(phone),
      businessName: businessName,
    })

    setOtpSent(true)
    setOtpExpiresAt(response.expiresAt)
    startCountdown(300) // 5 minutes

    toast.success('Verification code sent!')
  } catch (error) {
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.')
    } else {
      toast.error('Failed to send code. Please try again.')
    }
  }
}

// Step 2: Verify OTP
const handleVerifyOtp = async (code: string) => {
  try {
    const response = await api.post('/auth/register/verify-otp', {
      phone: formatPhone(phone),
      code: code,
    })

    setPhoneVerified(true)
    toast.success('Phone verified!')

    // Move to profile form
    setCurrentStep('profile')
  } catch (error) {
    if (error.response?.data?.message?.includes('attempts')) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Invalid code. Please try again.')
    }
  }
}

// Step 3: Complete Registration
const handleCompleteRegistration = async () => {
  try {
    const response = await api.post('/auth/register/complete', {
      phone: formatPhone(phone),
      businessName: businessName,
      ownerName: ownerName,
      email: email || undefined,
      password: password,
    })

    // Store tokens
    localStorage.setItem('accessToken', response.tokens.accessToken)
    localStorage.setItem('refreshToken', response.tokens.refreshToken)

    // Redirect to onboarding
    router.push('/admin/onboarding')

    toast.success('Welcome to OshLab! 🎉')
  } catch (error) {
    if (error.response?.status === 409) {
      toast.error('Phone already registered. Please login.')
    } else {
      toast.error('Registration failed. Please try again.')
    }
  }
}
```

### Login Page Flow

```typescript
const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      phone: formatPhone(phone),
      password: password,
    })

    // Store tokens
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)

    // Store user data
    setUser(response.employee)

    // Redirect based on role
    if (response.employee.roles.includes('Admin')) {
      router.push('/admin/dashboard')
    } else {
      router.push('/pos')
    }

    toast.success(`Welcome back, ${response.employee.fullName}!`)
  } catch (error) {
    toast.error('Invalid phone or password')
  }
}
```

### PIN Login Flow (POS)

```typescript
const handlePinLogin = async (employeeId: number, pin: string) => {
  try {
    const response = await api.post('/auth/pin-login', {
      employeeId: employeeId,
      pin: pin,
      branchId: currentBranchId,
    })

    // Store tokens
    localStorage.setItem('accessToken', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)

    // Redirect to POS
    router.push('/pos/dashboard')

    toast.success(`Welcome, ${response.employee.fullName}!`)
  } catch (error) {
    setPinError(true)
    clearPinInputs()

    if (error.response?.data?.message?.includes('expired')) {
      toast.error('PIN expired. Please use password login.')
    } else {
      toast.error('Invalid PIN')
    }
  }
}
```

---

## API Endpoints

### Signup Flow

```typescript
// Request OTP
POST /auth/register/request-otp
Body: { phone, businessName }

// Verify OTP
POST /auth/register/verify-otp
Body: { phone, code }

// Resend OTP
POST /auth/register/resend-otp
Body: { phone }

// Complete Registration
POST /auth/register/complete
Body: { phone, businessName, ownerName, email?, password }
```

### Login Flow

```typescript
// Regular Login
POST /auth/login
Body: { phone, password }

// Refresh Token
POST /auth/refresh
Body: { refreshToken }

// Get Current User
GET /auth/me
Headers: Authorization: Bearer {token}

// Logout
POST /auth/logout
Headers: Authorization: Bearer {token}
```

### PIN Authentication

```typescript
// Get Staff List for Branch (POS)
GET /pos/auth/staff-list?branchId={branchId}

// PIN Login
POST /auth/pin-login
Body: { employeeId, pin, branchId }

// Generate PIN (Admin/Manager)
POST /auth/generate-pin
Body: { employeeId }

// Refresh PIN (Self)
POST /auth/refresh-pin
Headers: Authorization: Bearer {token}

// Get PIN Status
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
