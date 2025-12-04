# Admin Panel Authentication

This document covers employee authentication for the Admin Panel application.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [API Endpoints](#api-endpoints)
4. [Token Management](#token-management)
5. [Error Handling](#error-handling)

---

## Overview

### Admin Auth vs Other Auth Methods

| Aspect | Admin Panel | POS | WebApp (Customer) |
|--------|-------------|-----|-------------------|
| **Login Method** | Phone + Password | Phone + Password → PIN | Phone + OTP |
| **User Type** | `employee` | `employee` | `customer` |
| **JWT Audience** | `admin` | `pos` | `webapp` |
| **Token Lifetime** | Access: 15m, Refresh: 7d | Access: 15m, Refresh: 7d | Access: 15m, Refresh: 30d |
| **Tenant Resolution** | Via subdomain or header | Via stored config | Via subdomain or header |

### Authentication Architecture

The backend uses a global `auth_users` table for identity management:

```
┌─────────────────────────────────────────────────────────────┐
│                    auth_users (Global Identity)             │
│                                                             │
│  phone       | user_type | password_hash | is_active        │
│  ────────────────────────────────────────────────────────   │
│  +998901234567 | employee  | $2b$10$...  | true             │
│  +998901234567 | customer  | NULL        | true             │
│                                                             │
│  Note: Same phone can exist as both employee AND customer   │
│  Constraint: UNIQUE(phone, user_type)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────────┐
          │                                     │
          ▼                                     ▼
┌───────────────────────────┐          ┌────────────────────────────┐
│   sm_employees            │          │   cm_customers             │
│   (Per-Tenant)            │          │   (Per-Tenant)             │
│                           │          │                            │
│ auth_user_id: FK required │          │ auth_user_id: FK required  │
│ tenant_id: required       │          │ tenant_id: required        │
│ branch permissions        │          │ loyalty points             │
└───────────────────────────┘          └────────────────────────────┘
```

**Key Points:**
- One `auth_user` can link to multiple employees (different tenants)
- Password is stored in `auth_users.password_hash` (not in `sm_employees`)
- Backward compatibility: Legacy employees without `auth_user_id` use `sm_employees.password`

---

## Authentication Flow

### Login Flow

```
┌──────────────┐     POST /admin/auth/login          ┌──────────────┐
│   Admin      │ ─────────────────────────────────────▶│    API       │
│   Panel      │     { phone, password }              │              │
│              │◀───────────────────────────────────── │              │
│              │     { accessToken, refreshToken,     │              │
│              │       employee, tenant, branches }   │              │
└──────────────┘                                       └──────────────┘
```

### What Happens During Login

1. **Find Employee** → Search by phone in `auth_users` (type: employee)
2. **Verify Password** → Check `auth_users.password_hash`
3. **Get Employee Record** → Load from `sm_employees` with permissions
4. **Generate Tokens** → Create access + refresh JWTs
5. **Return Context** → Employee data, tenant info, branches

---

## API Endpoints

### Tenant Resolution

Admin Panel requires tenant context. Two methods:

**Option A: Subdomain** (Recommended for production)
```
URL: https://golden-dragon.admin.horyco.com/api/...
Tenant extracted from subdomain automatically
```

**Option B: Header** (For development/testing)
```
Header: x-tenant-slug: golden-dragon
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "phone": "+998901234567",
  "password": "SecurePassword123",
  "tenantSlug": "golden-dragon"
}

Response 200:
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "tokenType": "Bearer",
  "expiresIn": 900,
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

**Note:** `branchPermissions` is a **map** of `branchId → permission names[]`:
- Owner with full access: `{ "101": ["*"] }`
- Staff with limited access: `{ "101": ["menu:view", "orders:create"] }`

```http
Response 401:
{
  "statusCode": 401,
  "message": "Invalid phone or password"
}

Response 401:
{
  "statusCode": 401,
  "message": "Account is temporarily locked. Try again in 10 minutes."
}

Response 403:
{
  "statusCode": 403,
  "message": "Account is deactivated"
}
```

### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbG..."
}

Response 200:
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "tokenType": "Bearer",
  "expiresIn": 900
}

Response 401:
{
  "statusCode": 401,
  "message": "Invalid refresh token"
}
```

### Get Current User

```http
GET /auth/me
Authorization: Bearer {accessToken}

Response 200:
{
  "id": 42,
  "authUserId": 1,
  "fullName": "Alice Manager",
  "phone": "+998901234567",
  "photoUrl": "https://...",
  "tenantId": 10,
  "tenantName": "Golden Dragon Restaurant",
  "isOwner": false,
  "branchPermissions": {
    "101": ["menu:manage", "reports:view", "staff:manage"],
    "102": ["reports:view"]
  }
}
```

**Permission System Note:**
- `isOwner: true` indicates the user is a tenant owner
- Owners have wildcard permission `"*"` for full access
- Staff have specific permissions per branch
- See [Staff Management](./ADMIN_STAFF_MANAGEMENT.md) for permission details

### Logout

```http
POST /auth/logout
Authorization: Bearer {accessToken}

Response 204 (No Content)
```

---

## Token Management

### Access Token Structure

```json
{
  "sub": 1,                    // auth_user.id
  "phone": "+998901234567",
  "userType": "employee",
  "employeeId": 42,            // sm_employees.id
  "tenantId": 10,
  "type": "access",
  "aud": "admin",
  "iat": 1705312800,
  "exp": 1705313700           // 15 minutes from iat
}
```

### Refresh Token Structure

```json
{
  "sub": 1,                    // auth_user.id
  "phone": "+998901234567",
  "userType": "employee",
  "tenantId": 10,
  "type": "refresh",
  "aud": "admin",
  "iat": 1705312800,
  "exp": 1705917600           // 7 days from iat
}
```

### Storage Recommendations

| Token | Storage | Notes |
|-------|---------|-------|
| `accessToken` | Memory (React state) | Short-lived, don't persist |
| `refreshToken` | HttpOnly Cookie or SecureStorage | Long-lived |

### Auto-Refresh Strategy

**Implementation Logic:**

1. **Intercept 401 errors** from API responses
2. **Check if refresh already attempted** (prevent infinite loops)
3. **Get refresh token** from storage
4. **Call refresh endpoint** with refresh token
5. **Save new tokens** if successful
6. **Retry original request** with new access token
7. **Redirect to login** if refresh fails

**API Flow:**
```
Original Request → 401 Error
  ↓
Get Refresh Token from Storage
  ↓
POST /admin/auth/refresh { "refreshToken": "..." }
  ↓
Success: Save new tokens → Retry original request
Failure: Clear storage → Redirect to login
```

---

## Error Handling

### Authentication Errors

| Error | Code | Message | Action |
|-------|------|---------|--------|
| Invalid credentials | 401 | "Invalid phone or password" | Show error, let retry |
| Account locked | 401 | "Account is temporarily locked..." | Show countdown |
| Account inactive | 403 | "Account is deactivated" | Show contact admin |
| Token expired | 401 | "Token expired" | Auto-refresh |
| Invalid token | 401 | "Invalid token" | Redirect to login |
| Tenant not found | 404 | "Tenant not found" | Check subdomain/header |

### Account Lockout

After 5 failed login attempts, the account is locked for 15 minutes.

**During lockout:**
- All login attempts rejected with 401
- Error message includes remaining lockout time
- Lockout applies to `auth_user` level (affects all tenants for that phone)

**After lockout expires:**
- Failed attempts counter resets
- Normal login flow resumes

---

## Multi-Tenant Employee Support

One employee can work at multiple restaurants. The backend tracks this via `auth_users`:

```
auth_users:
  id: 1
  phone: +998901234567
  user_type: employee

sm_employees (Tenant A - Golden Dragon):
  id: 42
  auth_user_id: 1
  tenant_id: 10

sm_employees (Tenant B - Pizza House):
  id: 89
  auth_user_id: 1
  tenant_id: 15
```

**Login behavior:**
- When employee logs into `golden-dragon.admin.horyco.com` → Gets employee #42
- When employee logs into `pizza-house.admin.horyco.com` → Gets employee #89
- Same phone/password works for both (shared `auth_user`)

---

## Related Documentation

| Document | Description |
|----------|-------------|
| [POS Authentication](../pos/AUTHENTICATION.md) | POS two-tier auth (manager + PIN) |
| [WebApp Authentication](../webapp/WEBAPP_AUTHENTICATION.md) | Customer OTP login |
| [Staff Management](./ADMIN_STAFF_MANAGEMENT.md) | Creating employees, assigning permissions |
| [PIN Management](./ADMIN_PIN_MANAGEMENT.md) | Managing employee PINs |
