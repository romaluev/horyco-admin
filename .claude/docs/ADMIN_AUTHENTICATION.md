# Admin Panel Authentication - Complete Step-by-Step Guide

This document covers every screen and case for employee authentication in Admin Panel.

---

## Quick Summary

```
App Opens
    |
    v
Has stored refresh token?
    |
    +-- NO --> [Screen 1: Login]
    |                |
    |                v
    |          Login success?
    |                |
    |           +----+----+
    |           |         |
    |           v         v
    |         ERROR    SUCCESS
    |           |         |
    |           v         v
    |    [Screen 1]  mustChangePassword?
    |    (show error)     |
    |                +----+----+
    |                |         |
    |                v         v
    |              TRUE      FALSE
    |                |         |
    |                v         |
    |          [Screen 2:     |
    |           Force Change  |
    |           Password]     |
    |                |        |
    +-- YES ---------+--------+
                     |
                     v
              Validate token
              (GET /auth/me)
                     |
                +----+----+
                |         |
                v         v
             VALID    INVALID
                |         |
                v         v
          [Screen 3:  [Screen 1:
           Dashboard]  Login]
```

---

## What is Admin Panel Authentication?

Think of it as the front door to manage your restaurant.

- Employees log in with phone number + password
- Each restaurant (tenant) has its own login portal
- Same person can work at multiple restaurants with same phone
- Access is controlled by permissions per branch

Why it matters for frontend:
- Must identify which restaurant (tenant) from URL
- Must handle forced password change for new employees
- Must manage token refresh automatically
- Must show/hide UI based on permissions

---

## Screen 1: Login Form

### When to Show

Show this screen when:
- User opens admin panel URL without valid session
- Token validation fails (expired refresh token)
- User explicitly logged out

Do NOT show when:
- User has valid access token OR valid refresh token that can be refreshed

### UI Layout

```
+-----------------------------------------------+
|                                               |
|            [RESTAURANT LOGO]                  |
|                                               |
|         Welcome to Admin Panel                |
|                                               |
|  Phone Number *                               |
|  +---------------------------------------+    |
|  | +998 | 90 123 45 67                   |    |
|  +---------------------------------------+    |
|                                               |
|  Password *                                   |
|  +---------------------------------------+    |
|  | ............                     [Eye]|    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |           [ Sign In ]                 |    |  <- Disabled until valid
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Enter phone | Validate format (+998XXXXXXXXX) |
| Enter password | No validation until submit |
| Click eye icon | Toggle password visibility |
| Click Sign In | Validate fields, call login API |

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Phone | Required | "Phone number is required" |
| Phone | Must be +998 + 9 digits | "Enter valid Uzbekistan phone number" |
| Password | Required | "Password is required" |
| Password | Min 8 characters | "Password must be at least 8 characters" |

### API Call

```
POST /auth/login

Rate Limit: 5 requests per 2 minutes per IP

Headers:
- Content-Type: application/json

Request Body:
{
  "phone": "+998901234567",
  "password": "SecurePassword123",
  "tenantSlug": "golden-dragon"
}
```

**Where does tenantSlug come from?**
- Production: Extract from subdomain (golden-dragon.admin.horyco.com)
- Development: From environment config or hardcoded

### Handle Response

Success Response (200):
```
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "mustChangePassword": false,
  "employee": {
    "id": 42,
    "fullName": "Alice Manager",
    "phone": "+998901234567",
    "tenantId": 10,
    "branchPermissions": {
      "101": ["menu:manage", "reports:view", "staff:manage"],
      "102": ["reports:view"]
    }
  }
}
```

### Decision Logic After Login

```
Step 1: Store tokens
------------------------
accessToken = response.accessToken
refreshToken = response.refreshToken
Store accessToken in memory (React state)
Store refreshToken in secure storage (HttpOnly cookie preferred)

Step 2: Check mustChangePassword
--------------------------------
if response.mustChangePassword = true
    GO TO: Screen 2 (Force Password Change)
    STOP

Step 3: Store employee data
---------------------------
Store response.employee in app state

Step 4: Navigate to dashboard
-----------------------------
GO TO: Screen 3 (Dashboard)
```

### Error Handling

| Code | Response | What to Show |
|------|----------|--------------|
| 401 | `{"message": "Invalid phone or password"}` | Show error: "Wrong phone or password. Try again." |
| 403 | `{"message": "Account is deactivated"}` | Show error: "Your account is deactivated. Contact your manager." |
| 404 | `{"message": "Tenant not found"}` | Show error: "Restaurant not found. Check the URL." |
| 429 | Rate limit exceeded | Show error: "Too many attempts. Please wait 2 minutes." |
| 500 | Server error | Show error: "Something went wrong. Please try again." |

### Loading State

```
+-----------------------------------------------+
|                                               |
|            [RESTAURANT LOGO]                  |
|                                               |
|         Welcome to Admin Panel                |
|                                               |
|  Phone Number *                               |
|  +---------------------------------------+    |
|  | +998 | 90 123 45 67                   |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  Password *                                   |
|  +---------------------------------------+    |
|  | ............                          |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |        [Spinner] Signing in...        |    |  <- Disabled, spinner
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### Error State

```
+-----------------------------------------------+
|                                               |
|            [RESTAURANT LOGO]                  |
|                                               |
|         Welcome to Admin Panel                |
|                                               |
|  +---------------------------------------+    |
|  | [!] Wrong phone or password           |    |  <- Red background
|  +---------------------------------------+    |
|                                               |
|  Phone Number *                               |
|  +---------------------------------------+    |
|  | +998 | 90 123 45 67                   |    |
|  +---------------------------------------+    |
|                                               |
|  Password *                                   |
|  +---------------------------------------+    |
|  | ............                     [Eye]|    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |           [ Sign In ]                 |    |
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

---

## Screen 2: Force Password Change

### When to Show

Show this screen when:
- Login response has `mustChangePassword: true`

This happens when:
- Employee was created with auto-generated password via invite
- Admin reset employee's password

Do NOT show when:
- `mustChangePassword: false` in login response
- User navigates here manually without valid session

### UI Layout

```
+-----------------------------------------------+
|                                               |
|         Change Your Password                  |
|         --------------------                  |
|                                               |
|  Your account requires a password change      |
|  before you can continue.                     |
|                                               |
|  New Password *                               |
|  +---------------------------------------+    |
|  | ............                     [Eye]|    |
|  +---------------------------------------+    |
|  Minimum 8 characters                         |
|                                               |
|  Confirm Password *                           |
|  +---------------------------------------+    |
|  | ............                     [Eye]|    |
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |       [ Change Password ]             |    |  <- Disabled until valid
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Enter new password | Validate minimum length |
| Enter confirm password | Validate matches new password |
| Click eye icon | Toggle password visibility |
| Click Change Password | Validate fields, call API |

### Input Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| New Password | Required | "Password is required" |
| New Password | Min 8 characters | "Password must be at least 8 characters" |
| Confirm Password | Required | "Please confirm your password" |
| Confirm Password | Must match New Password | "Passwords do not match" |

### API Call

```
POST /auth/force-change-password

Headers:
- Authorization: Bearer {accessToken from login}
- Content-Type: application/json

Request Body:
{
  "newPassword": "MyNewSecurePassword123",
  "confirmPassword": "MyNewSecurePassword123"
}
```

### Handle Response

Success Response (200):
```
{
  "success": true,
  "message": "Password changed successfully",
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

### Decision Logic After Password Change

```
Step 1: Update tokens
---------------------
Replace stored accessToken with response.accessToken
Replace stored refreshToken with response.refreshToken

Step 2: Navigate
----------------
GO TO: Screen 3 (Dashboard)
```

### Error Handling

| Code | Response | What to Show |
|------|----------|--------------|
| 400 | `{"message": "Passwords do not match"}` | Show field error under Confirm Password |
| 400 | `{"message": "Password too weak"}` | Show password requirements |
| 400 | `{"message": "Password change is not required"}` | GO TO: Screen 3 (Dashboard) |
| 401 | Token expired | GO TO: Screen 1 (Login) |

### Loading State

```
+-----------------------------------------------+
|                                               |
|         Change Your Password                  |
|         --------------------                  |
|                                               |
|  New Password *                               |
|  +---------------------------------------+    |
|  | ............                          |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  Confirm Password *                           |
|  +---------------------------------------+    |
|  | ............                          |    |  <- Disabled
|  +---------------------------------------+    |
|                                               |
|  +---------------------------------------+    |
|  |    [Spinner] Changing password...     |    |  <- Disabled, spinner
|  +---------------------------------------+    |
|                                               |
+-----------------------------------------------+
```

### Error State

```
+-----------------------------------------------+
|                                               |
|         Change Your Password                  |
|         --------------------                  |
|                                               |
|  New Password *                               |
|  +---------------------------------------+    |
|  | ............                     [Eye]|    |
|  +---------------------------------------+    |
|                                               |
|  Confirm Password *                           |
|  +---------------------------------------+    |
|  | ............                     [Eye]|    |  <- Red border
|  +---------------------------------------+    |
|  Passwords do not match                       |  <- Red text
|                                               |
+-----------------------------------------------+
```

---

## Screen 3: Dashboard (Post-Login Destination)

### When to Show

Show this screen when:
- Login successful AND `mustChangePassword: false`
- Password change successful
- Token refresh successful AND user data loaded

Do NOT show when:
- No valid session
- `mustChangePassword: true` and password not yet changed

### Handle Token Refresh (Background Process)

```
Token Refresh Logic (runs automatically)
----------------------------------------

Step 1: Detect need for refresh
-------------------------------
if API returns 401 with "Token expired" message
    OR accessToken expires in less than 60 seconds
    CONTINUE to Step 2

Step 2: Prevent refresh loops
-----------------------------
if already refreshing = true
    WAIT for current refresh to complete
    STOP

Step 3: Call refresh endpoint
-----------------------------
already refreshing = true
CALL POST /auth/refresh with refreshToken

Step 4: Handle refresh result
-----------------------------
if refresh SUCCESS
    Update stored accessToken
    Update stored refreshToken (if new one provided)
    Retry failed request (if any)
    already refreshing = false

if refresh FAILURE (401)
    Clear all tokens
    Clear user state
    GO TO: Screen 1 (Login)
    already refreshing = false
```

### Refresh API Call

```
POST /auth/refresh

Headers:
- Content-Type: application/json

Request Body:
{
  "refreshToken": "eyJhbG..."
}

Success Response (200):
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "tokenType": "Bearer",
  "expiresIn": 900
}

Error Response (401):
{
  "message": "Invalid refresh token"
}
```

---

## Screen 4: App Initialization

### When to Show

This is the first screen shown when app loads (loading/splash screen).

### UI Layout

```
+-----------------------------------------------+
|                                               |
|                                               |
|                                               |
|            [RESTAURANT LOGO]                  |
|                                               |
|              [Spinner]                        |
|                                               |
|                                               |
|                                               |
+-----------------------------------------------+
```

### Initialization Logic

```
Step 1: Check for stored refresh token
--------------------------------------
refreshToken = get from secure storage

if refreshToken = null OR empty
    GO TO: Screen 1 (Login)
    STOP

Step 2: Validate session
------------------------
CALL GET /auth/me with current accessToken

if accessToken expired
    CALL POST /auth/refresh with refreshToken

Step 3: Handle validation result
--------------------------------
if user data received
    Store employee data in app state
    GO TO: Screen 3 (Dashboard)

if 401 error (invalid/expired refresh token)
    Clear all stored tokens
    GO TO: Screen 1 (Login)
```

### Get Current User API

```
GET /auth/me

Headers:
- Authorization: Bearer {accessToken}

Response (200):
{
  "id": 42,
  "sub": 42,
  "phone": "+998901234567",
  "tenantId": 10,
  "tenantSlug": "golden-dragon",
  "branchPermissions": {
    "101": ["menu:manage", "reports:view", "staff:manage"],
    "102": ["reports:view"]
  },
  "type": "access"
}
```

---

## Screen 5: Logout Confirmation

### When to Show

Show this screen when:
- User clicks logout button/menu item

### UI Layout (Modal/Dialog)

```
+-----------------------------------------------+
|                                               |
|         Log Out                               |
|         -------                               |
|                                               |
|  Are you sure you want to log out?            |
|  This will log you out from all devices.      |
|                                               |
|  +----------------+  +--------------------+   |
|  |    Cancel      |  |      Log Out       |   |
|  +----------------+  +--------------------+   |
|                                               |
+-----------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Click Cancel | Close dialog, stay on current screen |
| Click Log Out | Call logout API, clear data, GO TO: Screen 1 |

### Logout API Call

```
POST /auth/logout

Headers:
- Authorization: Bearer {accessToken}

Response (200):
{
  "message": "Logged out successfully",
  "revokedTokens": 3
}
```

### Handle Response

```
Step 1: Call API (optional, can skip if fails)
----------------------------------------------
CALL POST /auth/logout
(This invalidates ALL refresh tokens on server for this employee)

Step 2: Clear local data
------------------------
Clear accessToken from memory
Clear refreshToken from secure storage
Clear employee data from app state

Step 3: Navigate
----------------
GO TO: Screen 1 (Login)
```

---

## Permission-Based UI

### How branchPermissions Works

```
Example branchPermissions object from JWT:
{
  "101": ["menu:manage", "reports:view", "staff:manage"],
  "102": ["reports:view"]
}

This means:
- At branch 101: Can manage menu, view reports, manage staff
- At branch 102: Can only view reports
```

### Permission Check Logic

```
Check Permission (permission, branchId)
---------------------------------------
currentBranchPermissions = branchPermissions[branchId]

if currentBranchPermissions is null or undefined
    RETURN false

if currentBranchPermissions contains "*"
    RETURN true (wildcard = all permissions, owner only)

if currentBranchPermissions contains permission
    RETURN true

RETURN false
```

### Common Permissions

| Permission | What To Show/Enable |
|------------|---------------------|
| `menu:manage` | Menu section, Edit/Delete buttons on products |
| `menu:view` | Menu section (read-only, no edit buttons) |
| `reports:view` | Analytics/Reports section |
| `staff:manage` | Staff section, Add/Edit employee buttons |
| `staff:edit` | Edit employee details |
| `staff:permissions` | Manage employee permissions |
| `settings:edit` | Settings section |
| `orders:manage` | Order management section |
| `shifts:manage` | Shift management |
| `branches:edit` | Branch settings |
| `*` | Everything (owner has this) |

---

## Multi-Tenant Context

### Same Phone, Different Restaurants

```
Same phone (+998901234567) registered at:
+-- Golden Dragon (tenant_id: 10) --> employee #42
+-- Pizza House (tenant_id: 15) --> employee #89

Login to golden-dragon.admin.horyco.com
    --> Gets employee #42 data

Login to pizza-house.admin.horyco.com
    --> Gets employee #89 data
```

### Important Frontend Rules

- Do NOT cache employee data across different tenant logins
- Always use data from current session
- Same person may have different permissions at each restaurant
- Tenant is determined by URL subdomain, not user selection
- JWT contains tenantSlug for routing validation

---

## JWT Token Structure

### Access Token (15 minute expiry)

```
Payload after decode:
{
  "sub": 42,              // employeeId
  "phone": "+998901234567",
  "tenantId": 10,
  "tenantSlug": "golden-dragon",
  "branchPermissions": {
    "101": ["menu:manage", "reports:view"],
    "102": ["reports:view"]
  },
  "type": "access",
  "iat": 1699000000,      // issued at
  "exp": 1699000900       // expires at (15 min later)
}
```

### Refresh Token (7 day expiry)

```
Payload after decode:
{
  "sub": 42,              // employeeId
  "tenantId": 10,
  "type": "refresh",
  "iat": 1699000000,
  "exp": 1699604800       // expires at (7 days later)
}
```

---

## Complete Flow Chart

```
                    +------------------+
                    |   APP OPENS      |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | Screen 4:        |
                    | App Init         |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | Has refresh      |
                    | token stored?    |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
              v                             v
             NO                            YES
              |                             |
              v                             v
     +--------+--------+          +---------+---------+
     |   Screen 1:     |          | GET /auth/me      |
     |   Login Form    |          | (validate token)  |
     +--------+--------+          +---------+---------+
              |                             |
              v                        +----+----+
     User submits                      |         |
     phone + password                  v         v
              |                     VALID    INVALID
              v                        |         |
     POST /auth/login                  |         v
              |                        |   +-----+-----+
       +------+------+                 |   | Clear     |
       |             |                 |   | tokens    |
       v             v                 |   +-----+-----+
    ERROR         SUCCESS              |         |
       |             |                 |         v
       v             |                 |   +-----+-----+
+------+------+      |                 |   | Screen 1: |
| Show error  |      |                 |   | Login     |
| message     |      |                 |   +-----------+
+------+------+      |                 |
       |             v                 |
       v    +--------+--------+        |
 (stay on   | mustChangePass? |        |
  Screen 1) +--------+--------+        |
                     |                 |
              +------+------+          |
              |             |          |
              v             v          |
            TRUE          FALSE        |
              |             |          |
              v             +----+-----+
     +--------+--------+         |
     |   Screen 2:     |         |
     |   Force Change  |         |
     |   Password      |         |
     +--------+--------+         |
              |                  |
              v                  |
     POST /auth/                 |
     force-change-password       |
              |                  |
       +------+------+           |
       |             |           |
       v             v           |
    ERROR         SUCCESS        |
       |             |           |
       v             v           |
  (show error)  +----+-----------+
                |
                v
        +-------+-------+
        |   Screen 3:   |
        |   Dashboard   |
        +---------------+
```

---

## API Reference

| Endpoint | Method | When | Auth Required | Rate Limit |
|----------|--------|------|---------------|------------|
| `/auth/login` | POST | User submits login form | No | 5/2min per IP |
| `/auth/force-change-password` | POST | After login with mustChangePassword=true | Yes | Standard |
| `/auth/refresh` | POST | Access token expired | No (uses refresh token) | Standard |
| `/auth/me` | GET | App init, page refresh | Yes | Standard |
| `/auth/logout` | POST | User clicks logout | Yes | Standard |

---

## Storage Reference

| Key | Type | Where to Store | Set When | Clear When |
|-----|------|----------------|----------|------------|
| `accessToken` | string | Memory (React state/context) | Login success, token refresh | Logout, auth error |
| `refreshToken` | string | HttpOnly Cookie (preferred) or Secure Storage | Login success, token refresh | Logout, auth error |
| `employee` | object | Memory (React state/context) | Login success, GET /auth/me | Logout |

---

## FAQ

**Q: What if user opens app in new tab?**
A: Each tab shares the same refresh token (if using cookie/localStorage). Call GET /auth/me to restore user state.

**Q: What happens on network error during login?**
A: Show generic error "Connection failed. Check your internet and try again." Keep form data.

**Q: Can user navigate away from Force Password Change screen?**
A: No. Block navigation until password is changed. Logging out is the only way to exit.

**Q: What if refresh token expires while user is active?**
A: Refresh happens automatically. If refresh fails, redirect to login with message "Session expired. Please log in again."

**Q: How to handle multiple tabs with different tenants?**
A: Each tenant subdomain has isolated storage. Logging into restaurant A does not affect restaurant B session.

**Q: What if user closes browser during login flow?**
A: On next open, start from Screen 4 (App Init). If no valid tokens, show Screen 1 (Login).

**Q: Should we show "Remember me" checkbox?**
A: No. Refresh tokens already persist the session for 7 days. Always remember by default.

**Q: What if API returns unexpected error format?**
A: Show generic error "Something went wrong. Please try again." Log error for debugging.

**Q: Is "Forgot Password" available for admin staff?**
A: Not currently implemented. Staff who forget password should contact their manager who can reset via admin panel (POST /admin/staff/employees/{id}/reset-password).

**Q: Does logout log out from all devices?**
A: Yes. POST /auth/logout revokes ALL refresh tokens for that employee, logging them out everywhere.
