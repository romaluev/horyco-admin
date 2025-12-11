# Admin Panel — Profile Management

This document covers admin profile functionality including authentication, profile data management, password changes, and avatar uploads.

---

## Table of Contents

1. [Overview](#overview)
2. [Key Concepts](#key-concepts)
3. [API Endpoints](#api-endpoints)
4. [User Flows](#user-flows)
5. [UI Recommendations](#ui-recommendations)
6. [Data Schemas](#data-schemas)

---

## Overview

### Purpose

The profile management system allows admin users to:
- View and update their personal information
- Change their password securely
- Upload and manage their profile photo (avatar)
- View their assigned roles and permissions
- Manage their branch assignments

### Authentication Flow

```
1. User enters phone + password
2. Backend validates credentials
3. Backend returns JWT tokens (access + refresh)
4. Frontend stores tokens and user data
5. Frontend includes token in all subsequent requests
```

**Token Lifecycle**:
- Access Token: 15 minutes (900 seconds)
- Refresh Token: 7 days
- After access token expires, use refresh token to get new tokens

---

## Key Concepts

### 1. User Identity

**Employee** = Admin user who can log into the system
- Every admin is an employee with specific roles
- Has personal data: phone, full name, photo
- Belongs to one tenant (restaurant brand)
- Can work at multiple branches
- Has one or more roles (Admin, Manager, etc.)

### 2. JWT Payload

After login, you receive a JWT token that contains:

```json
{
  "sub": 123,
  "phone": "+998901234567",
  "tenantId": 1,
  "tenantSlug": "my-restaurant",
  "roles": ["Admin", "Manager"],
  "permissions": ["menu.edit", "orders.create"],
  "activeBranchId": 5,
  "type": "access"
}
```

**Important**: The `sub` field is the employee ID you'll use for all profile operations.

### 3. Profile Photo Upload Flow

```
1. Upload photo via POST /admin/files/upload?folder=EMPLOYEES
2. Get back file URL and variants (original, large, medium, thumb)
3. Update employee profile with photoUrl
4. Use "thumb" variant for avatar display
```

---

## API Endpoints

### Base URL
```
/auth (authentication)
/admin/staff/employees (profile management)
/admin/files (file management)
```

### Authentication

#### 1. Login

```
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone": "+998901234567",
  "password": "userPassword123",
  "tenantSlug": "my-restaurant"
}
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "employee": {
    "id": 123,
    "phone": "+998901234567",
    "fullName": "John Doe",
    "roles": ["Admin"],
    "tenantId": 1,
    "activeBranchId": 5
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `429`: Too many login attempts (5 per 2 minutes)

---

#### 2. Get Current User

```
GET /auth/me
Authorization: Bearer {accessToken}
```

**Response 200:**
```json
{
  "sub": 123,
  "phone": "+998901234567",
  "tenantId": 1,
  "tenantSlug": "my-restaurant",
  "roles": ["Admin", "Manager"],
  "permissions": ["menu.edit", "orders.create", "staff.view"],
  "activeBranchId": 5,
  "type": "access"
}
```

---

#### 3. Logout

```
POST /auth/logout
Authorization: Bearer {accessToken}
```

**Response 200:**
```json
{
  "message": "Logged out successfully",
  "revokedTokens": 1
}
```

---

#### 4. Refresh Access Token

```
POST /auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

---

### Profile Management

#### 5. Get Profile by ID

```
GET /admin/staff/employees/{id}
Authorization: Bearer {accessToken}
```

**Path Parameters:**
- `id` (number) - Employee ID (get from `/auth/me` response `sub` field)

**Response 200:**
```json
{
  "id": 123,
  "phone": "+998901234567",
  "fullName": "John Doe",
  "photoUrl": "https://cdn.example.com/photos/thumb/123.jpg",
  "isActive": true,
  "activeBranchId": 5,
  "roles": [
    {
      "id": 1,
      "name": "Admin",
      "permissions": [
        {
          "id": 10,
          "name": "menu.edit",
          "category": "Menu"
        },
        {
          "id": 11,
          "name": "orders.create",
          "category": "Orders"
        }
      ]
    }
  ],
  "branches": [
    {
      "id": 5,
      "name": "Main Branch",
      "address": "123 Main Street"
    },
    {
      "id": 6,
      "name": "Downtown Branch",
      "address": "456 Downtown Ave"
    }
  ],
  "tenantId": 1,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-02-10T14:30:00Z"
}
```

---

#### 6. Update Profile

```
PATCH /admin/staff/employees/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Path Parameters:**
- `id` (number) - Employee ID

**Request Body (all fields optional):**
```json
{
  "phone": "+998901234567",
  "fullName": "John Smith",
  "photoUrl": "https://cdn.example.com/photos/thumb/new.jpg",
  "roleIds": [1, 2],
  "branchIds": [5, 6],
  "activeBranchId": 5,
  "isActive": true
}
```

**Response 200:**
Returns updated employee object (same structure as Get Profile)

**Errors:**
- `400`: Validation error
- `404`: Employee not found
- `409`: Phone number already exists

---

#### 7. Change Password

```
PATCH /admin/staff/employees/{id}/password
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Path Parameters:**
- `id` (number) - Employee ID

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response 200:**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `400`: Current password is incorrect
- `403`: No permission to change password

---

### File Management (Avatar Upload)

#### 8. Upload Single File

```
POST /admin/files/upload?folder=EMPLOYEES
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Query Parameters:**
- `folder` (required) - Use `EMPLOYEES` for profile photos

**Form Data:**
- `file` - Image file (jpg, png, webp, gif)
- `altText` (optional) - Alt text for image

**File Constraints:**
- Max size: 5MB
- Allowed types: jpg, jpeg, png, webp, gif

**Response 201:**
```json
{
  "id": 501,
  "url": "https://cdn.example.com/photos/original/501.jpg",
  "filename": "profile-photo.jpg",
  "size": 245678,
  "mimeType": "image/jpeg",
  "folder": "EMPLOYEES",
  "variants": {
    "original": "https://cdn.example.com/photos/original/501.jpg",
    "large": "https://cdn.example.com/photos/large/501.jpg",
    "medium": "https://cdn.example.com/photos/medium/501.jpg",
    "thumb": "https://cdn.example.com/photos/thumb/501.jpg"
  },
  "metadata": {
    "width": 800,
    "height": 600,
    "altText": "Profile photo"
  }
}
```

---

#### 9. Delete File

```
DELETE /admin/files/{id}
Authorization: Bearer {accessToken}
```

**Path Parameters:**
- `id` (number) - File ID

**Response 200:**
```json
{
  "id": 501
}
```

---

## User Flows

### Flow 1: Login

```
1. User enters phone + password
2. POST /auth/login
3. Store accessToken and refreshToken
4. Store employee.id for profile requests
5. Redirect to dashboard
```

### Flow 2: Load Profile Page

```
1. GET /auth/me to get current user info
2. Extract employee ID from "sub" field
3. GET /admin/staff/employees/{id}
4. Display profile data
```

### Flow 3: Upload Avatar

```
1. User selects image file
2. POST /admin/files/upload?folder=EMPLOYEES
3. Get file URL from response
4. PATCH /admin/staff/employees/{id} with photoUrl
5. Refresh profile display
```

### Flow 4: Change Password

```
1. User fills current + new password
2. PATCH /admin/staff/employees/{id}/password
3. Show success message
4. Optionally logout and require re-login
```

### Flow 5: Token Refresh

```
1. Access token expires (401 error)
2. POST /auth/refresh with refreshToken
3. Store new tokens
4. Retry original request
5. If refresh fails, redirect to login
```

---

## UI Recommendations

### Profile Page Layout

```
+--------------------------------------------------+
|  [<- Back]         My Profile          [Logout]  |
+--------------------------------------------------+
|                                                   |
|           +------------------+                    |
|           |       [Photo]    |                    |
|           +------------------+                    |
|           [Change Photo]                          |
|                                                   |
|  +----------------------------------------------+|
|  | Full Name                                    ||
|  | [John Doe                               ]    ||
|  +----------------------------------------------+|
|                                                   |
|  +----------------------------------------------+|
|  | Phone Number                                 ||
|  | [+998 90 123 45 67                     ]     ||
|  +----------------------------------------------+|
|                                                   |
|  --- Roles ---                                   |
|  [Admin] [Manager]                               |
|                                                   |
|  --- Assigned Branches ---                       |
|  * Main Branch (Active)                          |
|  * Downtown Branch                               |
|                                                   |
|  [Save Changes]                                  |
|                                                   |
|  +----------------------------------------------+|
|  |  Change Password                             ||
|  |  Current: [........]                         ||
|  |  New:     [........]                         ||
|  |  Confirm: [........]                         ||
|  |  [Update Password]                           ||
|  +----------------------------------------------+|
|                                                   |
+--------------------------------------------------+
```

### Validation Rules

**Phone Number:**
- Format: `+998XXXXXXXXX` (Uzbekistan)
- Regex: `/^\+998\d{9}$/`

**Password:**
- Minimum length: 6-8 characters
- No special requirements

**Avatar:**
- Accept: `image/jpeg,image/png,image/webp,image/gif`
- Max size: 5MB
- Show preview before upload

---

## Data Schemas

### Login Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | Yes | Format: +998XXXXXXXXX |
| `password` | string | Yes | Min length: 8 chars |
| `tenantSlug` | string | No | Tenant identifier |

### Login Response

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | string | JWT access token |
| `refreshToken` | string | JWT refresh token |
| `tokenType` | string | Always "Bearer" |
| `expiresIn` | number | Seconds until expiry (900) |
| `employee` | object | Basic employee info |

### Current User Response

| Field | Type | Description |
|-------|------|-------------|
| `sub` | number | Employee ID |
| `phone` | string | Phone number |
| `tenantId` | number | Tenant ID |
| `tenantSlug` | string | Tenant slug |
| `roles` | string[] | Role names |
| `permissions` | string[] | Permission codes |
| `activeBranchId` | number | Current branch |
| `type` | string | Token type ("access") |

### Employee Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Employee ID |
| `phone` | string | Phone number |
| `fullName` | string | Full name |
| `photoUrl` | string | Avatar URL |
| `isActive` | boolean | Account status |
| `activeBranchId` | number | Current branch ID |
| `roles` | Role[] | Assigned roles with permissions |
| `branches` | Branch[] | Assigned branches |
| `tenantId` | number | Tenant ID |
| `createdAt` | datetime | Creation timestamp |
| `updatedAt` | datetime | Last update timestamp |

### Update Employee Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | No | Format: +998XXXXXXXXX |
| `fullName` | string | No | Full name |
| `photoUrl` | string | No | Avatar URL |
| `roleIds` | number[] | No | Role IDs to assign |
| `branchIds` | number[] | No | Branch IDs to assign |
| `activeBranchId` | number | No | Current branch ID |
| `isActive` | boolean | No | Account status |

### Change Password Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currentPassword` | string | Yes | Current password |
| `newPassword` | string | Yes | New password (min 6 chars) |

### File Upload Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | File ID |
| `url` | string | Original file URL |
| `filename` | string | Original filename |
| `size` | number | Size in bytes |
| `mimeType` | string | MIME type |
| `folder` | string | Storage folder |
| `variants` | object | Resized image URLs |
| `variants.original` | string | Full size URL |
| `variants.large` | string | Large size URL |
| `variants.medium` | string | Medium size URL |
| `variants.thumb` | string | Thumbnail URL |
| `metadata` | object | Image metadata |

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success (GET, PATCH) |
| `201` | Created (POST) |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (invalid/expired token) |
| `403` | Forbidden (no permission) |
| `404` | Not Found |
| `409` | Conflict (duplicate phone) |
| `429` | Too Many Requests (rate limit) |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": ["phone must match +998XXXXXXXXX format"],
  "error": "Bad Request"
}
```

---

## Security Notes

1. **Token Storage**: Store tokens in localStorage or secure cookie
2. **Token Refresh**: Implement auto-refresh before expiration
3. **Tenant Isolation**: All data is automatically filtered by tenantId from JWT
4. **Rate Limiting**: Login endpoint limited to 5 attempts per 2 minutes
5. **File Security**: Only images allowed, files validated on backend

---

## Related Documentation

| Document | Description |
|----------|-------------|
| [Admin Authentication](./ADMIN_AUTHENTICATION.md) | Full auth flow details |
| [Admin Staff Management](./ADMIN_STAFF_MANAGEMENT.md) | Staff CRUD operations |
| [Admin File Management](./ADMIN_FILE_MANAGEMENT.md) | File upload system |
