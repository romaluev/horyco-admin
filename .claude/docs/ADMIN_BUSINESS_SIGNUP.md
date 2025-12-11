# Business Signup - Complete Step-by-Step Guide

This document covers every screen and case for new restaurant owner registration.

---

## Quick Summary

```
User arrives at signup page
            |
            v
[Screen 1: Enter Phone & Business Name]
            |
            v
[Screen 2: Verify OTP Code]
            |
            v
[Screen 3: Complete Profile]
            |
            v
Store tokens + Navigate to Onboarding Wizard
```

---

## What is Business Signup?

Think of it as the front door to create a new restaurant on the platform.

Registration is done through **OTP verification** followed by **profile completion**:
1. Enter phone and business name
2. Verify via SMS code (6 digits)
3. Complete profile with name, email, password
4. System creates everything automatically

What gets created automatically when signup completes:

| Entity | Details |
|--------|---------|
| Tenant | Restaurant brand, status: TRIAL (14 days) |
| Owner Employee | isOwner: true, wildcard permission (*) |
| Default Branch | Named "Main Branch" |
| Default Settings | Payment methods, basic config |
| Modifier Templates | Cloned from global templates |
| Onboarding Progress | Ready for business identity step |

Why it matters for frontend:
- Must guide user through OTP verification
- Must handle rate limits and error states
- Must redirect to Onboarding Wizard after success (NOT dashboard)
- Tokens are returned immediately for auto-login

---

## Screen 1: Enter Phone and Business Name

### When to Show

Show this screen when:
- User navigates to /signup or /register URL
- User clicks "Create Account" or "Get Started" button

Do NOT show when:
- User is already logged in (redirect to dashboard)

### UI Layout

```
+-----------------------------------------------+
|                                               |
|            [HORYCO LOGO]                      |
|                                               |
|         Welcome to Horyco!                    |
|         ------------------                    |
|                                               |
|  Let's get your restaurant online in minutes  |
|                                               |
|  Phone Number *                               |
|  +---------------------------------------+    |
|  | +998 | 90 123 45 67                   |    |
|  +---------------------------------------+    |
|  We'll send a verification code via SMS       |
|                                               |
|  Business Name *                              |
|  +---------------------------------------+    |
|  | Samarkand Restaurant                  |    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |    [ Send Verification Code ]         |    |  <- Disabled until valid
|  +---------------------------------------+    |
|                                               |
|  Already have an account? [Login]             |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Enter phone | Validate format as user types |
| Enter business name | No validation until submit |
| Click Send Verification Code | Validate all fields, call API |
| Click Login | GO TO: Login screen |

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Phone | Required | "Phone number is required" |
| Phone | Must be +998 + 9 digits | "Enter valid Uzbekistan phone number" |
| Business Name | Required | "Business name is required" |
| Business Name | 2-255 characters | "Business name must be 2-255 characters" |

### API Call

```
POST /auth/register/request-otp

Rate Limit: 3 requests per hour per IP (max 30 OTP requests per hour total)

Headers:
- Content-Type: application/json

Request Body:
{
  "phone": "+998901234567",
  "businessName": "Samarkand Restaurant"
}
```

### Handle Response

Success Response (200):
```
{
  "message": "OTP code sent successfully",
  "expiresAt": "2025-01-15T10:35:00Z"
}
```

### Decision Logic After OTP Request

```
Step 1: Store phone and business name
-------------------------------------
Store phone in temporary state (needed for next screens)
Store businessName in temporary state

Step 2: Navigate to OTP screen
------------------------------
GO TO: Screen 2 (Verify OTP Code)
```

### Error Handling

| Code | Response | What to Show |
|------|----------|--------------|
| 400 | `{"message": "Invalid phone format"}` | Show field error: "Enter valid Uzbekistan phone number" |
| 409 | `{"message": "Phone already registered"}` | Show error: "This phone is already registered. Try logging in." with Login link |
| 429 | `{"message": "Too many OTP requests"}` | Show error: "Too many attempts. Try again later." |
| 500 | Server error | Show error: "Something went wrong. Please try again." |

### Loading State

```
+-----------------------------------------------+
|                                               |
|            [HORYCO LOGO]                      |
|                                               |
|         Welcome to Horyco!                    |
|                                               |
|  Phone Number *                               |
|  +---------------------------------------+    |
|  | +998 | 90 123 45 67                   |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  Business Name *                              |
|  +---------------------------------------+    |
|  | Samarkand Restaurant                  |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |  [Spinner] Sending code...            |    |  <- Disabled, spinner
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### Error State

```
+-----------------------------------------------+
|                                               |
|            [HORYCO LOGO]                      |
|                                               |
|  +---------------------------------------+    |
|  | [!] This phone is already registered  |    |  <- Red background
|  |     Try logging in instead. [Login]   |    |
|  +---------------------------------------+    |
|                                               |
|  Phone Number *                               |
|  +---------------------------------------+    |
|  | +998 | 90 123 45 67                   |    |  <- Red border
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

---

## Screen 2: Verify OTP Code

### When to Show

Show this screen when:
- OTP request succeeded from Screen 1

Do NOT show when:
- User navigates directly to this URL without requesting OTP first
- User has no phone number stored in state

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  <- Back                                      |
|                                               |
|         Enter Verification Code               |
|         -----------------------               |
|                                               |
|  We sent a 6-digit code to                    |
|  +998 90 *** ** 67                            |
|                                               |
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|  | 1 |  | 2 |  | 3 |  | 4 |  | _ |  | _ |    |
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|                                               |
|  Code expires in: 04:23                       |
|                                               |
|  +---------------------------------------+    |
|  |           [ Verify ]                  |    |  <- Disabled until 6 digits
|  +---------------------------------------+    |
|                                               |
|  Didn't receive code?                         |
|  [Resend Code] (available in 52s)             |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Click Back | GO TO: Screen 1 (Enter Phone) |
| Enter digit | Move focus to next input |
| Delete digit | Move focus to previous input |
| Paste code | Fill all 6 inputs |
| Click Verify | Call verify OTP API |
| Click Resend Code | Call resend API (if cooldown passed) |

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Code | Required | Button disabled until 6 digits |
| Code | Exactly 6 digits | "Enter all 6 digits" |

### API Call

```
POST /auth/register/verify-otp

Rate Limit: 3 requests per hour per IP

Headers:
- Content-Type: application/json

Request Body:
{
  "phone": "+998901234567",
  "code": "123456"
}
```

### Handle Response

Success Response (200):
```
{
  "verified": true,
  "message": "OTP verified successfully"
}
```

### Decision Logic After OTP Verify

```
Step 1: Mark phone as verified
------------------------------
Store verified = true in temporary state

Step 2: Navigate to complete profile
------------------------------------
GO TO: Screen 3 (Complete Profile)
```

### Error Handling

| Code | Response | What to Show |
|------|----------|--------------|
| 400 | `{"message": "Invalid OTP code"}` | Show error: "Wrong code. Check and try again." Clear inputs. |
| 404 | `{"message": "Registration request not found"}` | GO TO: Screen 1 (start over) |
| 409 | `{"message": "OTP already verified"}` | GO TO: Screen 3 (Complete Profile) |
| 410 | `{"message": "OTP expired"}` | Show error: "Code expired. Request a new one." Enable resend. |
| 429 | `{"message": "Too many verification attempts"}` | Show error: "Too many attempts. Blocked for 60 minutes." Disable inputs. |

### Resend OTP API

```
POST /auth/register/resend-otp

Headers:
- Content-Type: application/json

Request Body:
{
  "phone": "+998901234567"
}

Success Response (200):
{
  "message": "OTP code sent successfully",
  "expiresAt": "2025-01-15T10:40:00Z"
}
```

### Resend Behavior

```
Step 1: Check cooldown
----------------------
if lastResendTime + 60 seconds > now
    Show countdown: "Resend Code (available in Xs)"
    STOP

Step 2: Call resend API
-----------------------
CALL POST /auth/register/resend-otp

Step 3: Handle result
---------------------
if SUCCESS
    Reset expiry countdown to 5 minutes
    Reset resend cooldown to 60 seconds
    Show toast: "Code sent!"

if ERROR (429)
    Show error message from response
```

### Loading State

```
+-----------------------------------------------+
|                                               |
|  <- Back                                      |
|                                               |
|         Enter Verification Code               |
|                                               |
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|  | 1 |  | 2 |  | 3 |  | 4 |  | 5 |  | 6 |    |  <- Disabled
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|                                               |
|  +---------------------------------------+    |
|  |     [Spinner] Verifying...            |    |  <- Disabled, spinner
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### Error State

```
+-----------------------------------------------+
|                                               |
|  <- Back                                      |
|                                               |
|         Enter Verification Code               |
|                                               |
|  +---------------------------------------+    |
|  | [!] Wrong code. Check and try again.  |    |  <- Red background
|  +---------------------------------------+    |
|                                               |
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|  | _ |  | _ |  | _ |  | _ |  | _ |  | _ |    |  <- Red border, cleared
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|                                               |
|  Code expires in: 02:15                       |
|                                               |
+-----------------------------------------------+
```

### Code Expired State

```
+-----------------------------------------------+
|                                               |
|  <- Back                                      |
|                                               |
|         Enter Verification Code               |
|                                               |
|  +---------------------------------------+    |
|  | [!] Code expired. Request a new one.  |    |  <- Yellow background
|  +---------------------------------------+    |
|                                               |
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|  | _ |  | _ |  | _ |  | _ |  | _ |  | _ |    |  <- Disabled
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|                                               |
|  Code expired                                 |
|                                               |
|  [Resend Code]                                |  <- Enabled
|                                               |
+-----------------------------------------------+
```

### Blocked State (Too Many Attempts)

```
+-----------------------------------------------+
|                                               |
|  <- Back                                      |
|                                               |
|         Enter Verification Code               |
|                                               |
|  +---------------------------------------+    |
|  | [!] Too many failed attempts.         |    |  <- Red background
|  |     Try again in 58 minutes.          |    |
|  +---------------------------------------+    |
|                                               |
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|  | _ |  | _ |  | _ |  | _ |  | _ |  | _ |    |  <- Disabled
|  +---+  +---+  +---+  +---+  +---+  +---+    |
|                                               |
|                                               |
|  [Start Over]                                 |  <- Go back to Screen 1
|                                               |
+-----------------------------------------------+
```

---

## Screen 3: Complete Profile

### When to Show

Show this screen when:
- OTP verification succeeded from Screen 2

Do NOT show when:
- Phone not verified
- User navigates directly without verification

### UI Layout

```
+-----------------------------------------------+
|                                               |
|  <- Back                                      |
|                                               |
|         Complete Your Profile                 |
|         ---------------------                 |
|                                               |
|  Full Name *                                  |
|  +---------------------------------------+    |
|  | Akmal Karimov                         |    |
|  +---------------------------------------+    |
|                                               |
|  Email *                                      |
|  +---------------------------------------+    |
|  | akmal@samarkand.uz                    |    |
|  +---------------------------------------+    |
|  We'll send receipts and notifications        |
|                                               |
|  Password *                                   |
|  +---------------------------------------+    |
|  | ............                     [Eye]|    |
|  +---------------------------------------+    |
|  At least 8 characters                        |
|                                               |
|  [x] I agree to Terms of Service and          |
|      Privacy Policy                           |
|                                               |
|  +---------------------------------------+    |
|  |       [ Create Account ]              |    |  <- Disabled until valid
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Click Back | GO TO: Screen 2 (keeps verification valid) |
| Enter full name | Validate length |
| Enter email | Validate format |
| Enter password | Validate strength |
| Toggle checkbox | Enable/disable submit |
| Click eye icon | Toggle password visibility |
| Click Terms/Privacy links | Open in new tab |
| Click Create Account | Validate all, call API |

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Full Name | Required | "Full name is required" |
| Full Name | 2-255 characters | "Name must be 2-255 characters" |
| Email | Required | "Email is required" |
| Email | Valid format | "Enter a valid email address" |
| Email | Unique | "This email is already registered" |
| Password | Required | "Password is required" |
| Password | Min 8 characters | "Password must be at least 8 characters" |
| Terms checkbox | Must be checked | Button disabled until checked |

### API Call

```
POST /auth/register/complete

Headers:
- Content-Type: application/json

Request Body:
{
  "phone": "+998901234567",
  "fullName": "Akmal Karimov",
  "email": "akmal@samarkand.uz",
  "password": "secure123!",
  "businessName": "Samarkand Restaurant"
}
```

### Handle Response

Success Response (201):
```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "tenant": {
    "id": 123,
    "name": "Samarkand Restaurant",
    "slug": "tenant-uuid-temporary",
    "businessType": null,
    "email": "akmal@samarkand.uz",
    "phone": "+998901234567"
  },
  "employee": {
    "id": 456,
    "fullName": "Akmal Karimov",
    "phone": "+998901234567",
    "permissions": ["*"]
  },
  "message": "Registration completed successfully"
}
```

### Decision Logic After Registration Complete

```
Step 1: Store tokens
--------------------
Store accessToken in memory
Store refreshToken in secure storage

Step 2: Store user data
-----------------------
Store tenant info in app state
Store employee info in app state

Step 3: Clear temporary state
-----------------------------
Clear phone, businessName, verified from temp state

Step 4: Navigate to onboarding
------------------------------
GO TO: Onboarding Wizard (NOT dashboard)
```

### Error Handling

| Code | Response | What to Show |
|------|----------|--------------|
| 400 | `{"message": "Phone not verified"}` | GO TO: Screen 1 (start over) |
| 400 | `{"message": "Password too weak"}` | Show field error with requirements |
| 409 | `{"message": "Phone already registered"}` | Show error: "This phone is already registered" |
| 409 | `{"message": "Email already registered"}` | Show field error: "This email is already registered" |
| 500 | Server error | Show error: "Something went wrong. Please try again." |

### Loading State

```
+-----------------------------------------------+
|                                               |
|         Complete Your Profile                 |
|                                               |
|  Full Name *                                  |
|  +---------------------------------------+    |
|  | Akmal Karimov                         |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  Email *                                      |
|  +---------------------------------------+    |
|  | akmal@samarkand.uz                    |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  Password *                                   |
|  +---------------------------------------+    |
|  | ............                          |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  | [Spinner] Creating your account...    |    |  <- Disabled, spinner
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

---

## What Gets Created on Registration Complete

The backend performs an **atomic transaction** creating all of the following:

### 1. Tenant
```
{
  id: 123,
  name: "Samarkand Restaurant",
  slug: "tenant-uuid-temporary",  // Custom slug set in onboarding step 1
  status: "TRIAL",
  trialEndsAt: "2025-01-29T10:20:00Z",  // 14 days from registration
  email: "akmal@samarkand.uz",
  phone: "+998901234567",
  businessType: null  // Set in onboarding step 1
}
```

### 2. Default Branch
```
{
  id: 1,
  name: "Main Branch",
  address: "Main Location",  // Customized in onboarding step 2
  phone: "+998901234567",
  isActive: true
}
```

### 3. Owner Employee
```
{
  id: 456,
  fullName: "Akmal Karimov",
  phone: "+998901234567",
  email: "akmal@samarkand.uz",
  isOwner: true,
  isActive: true,
  permissions: ["*"]  // Wildcard = full access
}
```

### 4. Onboarding Progress
```
{
  currentStep: "business_identity",  // Next step to complete
  completedSteps: ["registration_complete"],
  isCompleted: false,
  stepData: {
    registration_complete: {
      phone: "+998901234567",
      email: "akmal@samarkand.uz",
      fullName: "Akmal Karimov",
      businessName: "Samarkand Restaurant",
      completedAt: "2025-01-15T10:20:00Z"
    }
  }
}
```

---

## Security Constraints

### OTP System

| Rule | Value |
|------|-------|
| Code length | 6 digits |
| Code validity | 5 minutes |
| Max verification attempts per code | 3 |
| Block duration after 3 failed attempts | 60 minutes |
| Max OTP requests per hour | 30 |
| Resend cooldown | 60 seconds |
| OTP storage | Hashed with bcrypt |

### Phone & Email Uniqueness

| Rule | Scope |
|------|-------|
| Phone must be unique | Across all tenants |
| Email must be unique | Across all tenants |
| Same phone cannot register twice | System-wide |

---

## Complete Flow Chart

```
                    +------------------+
                    |  USER ARRIVES    |
                    |  at /signup      |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |   Screen 1:      |
                    |   Enter Phone    |
                    |   & Business     |
                    +--------+---------+
                             |
                             v
                    POST /register/
                    request-otp
                             |
                      +------+------+
                      |             |
                      v             v
                   ERROR         SUCCESS
                      |             |
                      v             v
                 (show error)  +----+----+
                               |         |
                               v         |
                      +--------+------+  |
                      |  Screen 2:    |  |
                      |  Verify OTP   |  |
                      +--------+------+  |
                               |         |
                               v         |
                      POST /register/    |
                      verify-otp         |
                               |         |
                        +------+------+  |
                        |             |  |
                        v             v  |
                     ERROR         SUCCESS
                        |             |
                        v             v
                   (show error)  +----+----+
                                 |         |
                                 v         |
                        +--------+------+  |
                        |  Screen 3:    |  |
                        |  Complete     |  |
                        |  Profile      |  |
                        +--------+------+  |
                                 |         |
                                 v         |
                        POST /register/    |
                        complete           |
                                 |         |
                          +------+------+  |
                          |             |  |
                          v             v  |
                       ERROR         SUCCESS
                          |             |
                          v             v
                     (show error)  +----+-----------+
                                   |                |
                                   v                |
                       +-----------+-----------+    |
                       | Store tokens          |    |
                       | Store user/tenant     |    |
                       +-----------+-----------+    |
                                   |                |
                                   v                |
                       +-----------+-----------+    |
                       | Onboarding Wizard     |    |
                       | (NOT dashboard)       |    |
                       +-----------------------+    |
```

---

## API Reference

| Endpoint | Method | When | Auth | Rate Limit |
|----------|--------|------|------|------------|
| `/auth/register/request-otp` | POST | User submits phone + business name | No | 3/hour per IP |
| `/auth/register/verify-otp` | POST | User enters 6-digit code | No | 3/hour per IP |
| `/auth/register/resend-otp` | POST | User clicks resend (after cooldown) | No | 3/hour per IP |
| `/auth/register/complete` | POST | User submits profile + password | No | Standard |

---

## Storage Reference

| Key | Type | Where to Store | Set When | Clear When |
|-----|------|----------------|----------|------------|
| `tempPhone` | string | Memory (temp state) | Screen 1 success | Registration complete |
| `tempBusinessName` | string | Memory (temp state) | Screen 1 submit | Registration complete |
| `tempVerified` | boolean | Memory (temp state) | Screen 2 success | Registration complete |
| `accessToken` | string | Memory (app state) | Registration complete | Logout |
| `refreshToken` | string | Secure storage | Registration complete | Logout |
| `tenant` | object | Memory (app state) | Registration complete | Logout |
| `employee` | object | Memory (app state) | Registration complete | Logout |

---

## FAQ

**Q: What if user refreshes page during OTP flow?**
A: Temporary state is lost. User must start from Screen 1 again. The OTP on server remains valid for 5 minutes.

**Q: Can user go back from OTP screen to change phone?**
A: Yes. Back button returns to Screen 1. User must request new OTP for new phone.

**Q: What if OTP code expires while user is typing?**
A: Show expired state. Disable code inputs. Enable "Resend Code" button.

**Q: Can same phone register multiple businesses?**
A: No. One phone = one account. User must use different phone for second business.

**Q: What happens if user closes browser during signup?**
A: Start over from Screen 1. No data persisted until registration complete. Server-side registration request (with OTP) remains valid for cleanup (1 hour if not verified, 7 days if verified).

**Q: Why redirect to Onboarding instead of Dashboard?**
A: New tenants need to complete setup (business type, slug, logo, hours, etc.) before they can use the system. The tenant is in incomplete state.

**Q: Is email required for registration?**
A: Yes. Email is required and must be unique across all tenants.

**Q: What if user is blocked after too many OTP attempts?**
A: Show blocked state with countdown (60 minutes). User can start over from Screen 1 after block expires.

**Q: What permissions does the owner have?**
A: Owner gets wildcard `*` permission which means full access to everything in the system.

**Q: How long is the trial period?**
A: 14 days from registration. Tenant status is set to TRIAL.
