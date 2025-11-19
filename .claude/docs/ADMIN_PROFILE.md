# Admin Panel — Profile Management

This document explains how to implement admin profile functionality in Horyco, including authentication, profile data management, password changes, and avatar uploads.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Concepts](#key-concepts)
3. [Frontend Implementation Guide](#frontend-implementation-guide)
4. [API Endpoints](#api-endpoints)

---

## Overview

### 🎯 Purpose

The profile management system allows admin users to:
- View and update their personal information
- Change their password securely
- Upload and manage their profile photo (avatar)
- View their assigned roles and permissions
- Manage their branch assignments

### 🔐 Authentication Flow

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
```typescript
{
  sub: number;              // Employee ID - use this for profile requests
  phone: string;            // User's phone number
  tenantId: number;         // Restaurant brand ID
  tenantSlug: string;       // Restaurant brand slug
  roles: string[];          // ["Admin", "Manager"]
  permissions: string[];    // ["menu.edit", "orders.create", ...]
  activeBranchId: number;   // Current working branch
  type: "access";          // Token type
}
```

**Important**: The `sub` field is the employee ID you'll use for all profile operations.

### 3. Profile Photo Upload Flow

```
1. Upload photo via /admin/files/upload?folder=EMPLOYEES
2. Get back file URL and variants (original, large, medium, thumb)
3. Update employee profile with photoUrl
4. Use "thumb" variant for avatar display
```

---

## Frontend Implementation Guide

### Step 1: Login

```typescript
// POST /auth/login
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+998901234567',
    password: 'userPassword123'
  })
});

const data = await loginResponse.json();
// Store tokens
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
localStorage.setItem('employeeId', data.employee.id);
```

### Step 2: Get Current User Info

```typescript
// GET /auth/me
const meResponse = await fetch('/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const currentUser = await meResponse.json();
// currentUser.sub is your employee ID
```

### Step 3: Get Full Profile Data

```typescript
// GET /admin/staff/employees/:id
const employeeId = currentUser.sub; // from /auth/me
const profileResponse = await fetch(`/admin/staff/employees/${employeeId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const profile = await profileResponse.json();
// profile contains: fullName, phone, photoUrl, roles, branches, etc.
```

### Step 4: Update Profile

```typescript
// PATCH /admin/staff/employees/:id
const updateResponse = await fetch(`/admin/staff/employees/${employeeId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: 'New Full Name',
    phone: '+998901234567'
    // photoUrl will be updated separately after upload
  })
});
```

### Step 5: Upload Avatar

```typescript
// POST /admin/files/upload?folder=EMPLOYEES
const formData = new FormData();
formData.append('file', avatarFile); // File from <input type="file">
formData.append('altText', 'Profile photo');

const uploadResponse = await fetch('/admin/files/upload?folder=EMPLOYEES', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});

const fileData = await uploadResponse.json();

// Now update profile with photo URL
await fetch(`/admin/staff/employees/${employeeId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    photoUrl: fileData.variants.thumb // or fileData.url for original
  })
});
```

### Step 6: Change Password

```typescript
// PATCH /admin/staff/employees/:id/password
const passwordResponse = await fetch(`/admin/staff/employees/${employeeId}/password`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    currentPassword: 'oldPassword123',
    newPassword: 'newPassword456'
  })
});
```

### Step 7: Logout

```typescript
// POST /auth/logout
await fetch('/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

// Clear local storage
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('employeeId');
```

### Step 8: Refresh Token

```typescript
// POST /auth/refresh
const refreshResponse = await fetch('/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refreshToken: localStorage.getItem('refreshToken')
  })
});

const newTokens = await refreshResponse.json();
localStorage.setItem('accessToken', newTokens.accessToken);
localStorage.setItem('refreshToken', newTokens.refreshToken);
```

---

## API Endpoints

### Authentication

#### 1. Login
- **Method**: `POST`
- **Path**: `/auth/login`
- **Auth Required**: No
- **Rate Limit**: 5 attempts per 2 minutes

**Request Body**:
```typescript
{
  phone: string;           // Required. Format: +998XXXXXXXXX
  password: string;        // Required. Min length: 8 chars
  tenantSlug?: string;     // Optional
}
```

**Response (200)**:
```typescript
{
  accessToken: string;     // JWT access token
  refreshToken: string;    // JWT refresh token
  tokenType: "Bearer";
  expiresIn: 900;         // 15 minutes in seconds
  employee: {
    id: number;
    phone: string;
    fullName: string;
    roles: string[];
    tenantId: number;
    activeBranchId: number;
  }
}
```

**Errors**:
- `401`: Invalid credentials
- `429`: Too many login attempts

---

#### 2. Get Current User
- **Method**: `GET`
- **Path**: `/auth/me`
- **Auth Required**: Yes

**Headers**:
```
Authorization: Bearer <accessToken>
```

**Response (200)**:
```typescript
{
  sub: number;              // Employee ID - use for profile requests
  phone: string;
  tenantId: number;
  tenantSlug: string;
  roles: string[];          // ["Admin", "Manager"]
  permissions: string[];    // ["menu.edit", "orders.create"]
  activeBranchId: number;
  type: "access";
}
```

**Errors**:
- `401`: Unauthorized (invalid or expired token)

---

#### 3. Logout
- **Method**: `POST`
- **Path**: `/auth/logout`
- **Auth Required**: Yes

**Response (200)**:
```typescript
{
  message: "Logged out successfully",
  revokedTokens: number;   // Number of refresh tokens revoked
}
```

---

#### 4. Refresh Access Token
- **Method**: `POST`
- **Path**: `/auth/refresh`
- **Auth Required**: No (uses refresh token)

**Request Body**:
```typescript
{
  refreshToken: string;    // Required. Refresh token from login
}
```

**Response (200)**:
```typescript
{
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: 900;
}
```

**Errors**:
- `401`: Invalid or expired refresh token

---

### Profile Management

#### 5. Get Profile by ID
- **Method**: `GET`
- **Path**: `/admin/staff/employees/:id`
- **Auth Required**: Yes

**Path Parameters**:
- `id` (number) - Employee ID (get from `/auth/me` response `sub` field)

**Response (200)**:
```typescript
{
  id: number;
  phone: string;
  fullName: string;
  photoUrl: string | null;  // Avatar URL
  isActive: boolean;
  activeBranchId: number;
  roles: Array<{
    id: number;
    name: string;
    permissions: Array<{
      id: number;
      name: string;
      category: string;
    }>;
  }>;
  branches: Array<{
    id: number;
    name: string;
    address: string;
  }>;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}
```

**Errors**:
- `404`: Employee not found
- `401`: Unauthorized

---

#### 6. Update Profile
- **Method**: `PATCH`
- **Path**: `/admin/staff/employees/:id`
- **Auth Required**: Yes

**Path Parameters**:
- `id` (number) - Employee ID

**Request Body** (all fields optional):
```typescript
{
  phone?: string;          // Format: +998XXXXXXXXX
  fullName?: string;
  photoUrl?: string;       // URL from file upload
  roleIds?: number[];      // Array of role IDs
  branchIds?: number[];    // Array of branch IDs
  activeBranchId?: number;
  isActive?: boolean;
}
```

**Response (200)**:
```typescript
// Same as Get Profile response (updated employee object)
```

**Errors**:
- `400`: Validation error
- `404`: Employee not found
- `409`: Phone number already exists

---

#### 7. Change Password
- **Method**: `PATCH`
- **Path**: `/admin/staff/employees/:id/password`
- **Auth Required**: Yes

**Path Parameters**:
- `id` (number) - Employee ID

**Request Body**:
```typescript
{
  currentPassword: string; // Required. Current password
  newPassword: string;     // Required. Min length: 6 chars
}
```

**Response (200)**:
```typescript
{
  message: "Password changed successfully"
}
```

**Errors**:
- `400`: Current password is incorrect
- `403`: No permission to change password
- `401`: Unauthorized

---

### File Management (Avatar Upload)

#### 8. Upload Single File
- **Method**: `POST`
- **Path**: `/admin/files/upload`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data`

**Query Parameters**:
- `folder` (required) - Use `EMPLOYEES` for profile photos

**Form Data**:
```typescript
{
  file: File;              // Required. Image file (jpg, png, webp, gif)
  altText?: string;        // Optional. Alt text for image
}
```

**File Constraints**:
- Max size: 5MB
- Allowed types: jpg, jpeg, png, webp, gif

**Response (201)**:
```typescript
{
  id: number;              // File ID in database
  url: string;             // Public URL
  filename: string;
  size: number;            // Size in bytes
  mimeType: string;
  folder: "EMPLOYEES";
  variants: {
    original: string;      // Full size URL
    large: string;         // Large size URL
    medium: string;        // Medium size URL
    thumb: string;         // Thumbnail URL (use for avatar)
  };
  metadata: {
    width: number;
    height: number;
    altText?: string;
  }
}
```

**Errors**:
- `400`: Invalid file or file too large
- `401`: Unauthorized

---

#### 9. Delete File
- **Method**: `DELETE`
- **Path**: `/admin/files/:id`
- **Auth Required**: Yes

**Path Parameters**:
- `id` (number) - File ID

**Response (200)**:
```typescript
{
  id: number;              // Deleted file ID
}
```

**Errors**:
- `404`: File not found

---

## Validation Rules

### Phone Number
- Format: `+998XXXXXXXXX` (Uzbekistan)
- Regex: `/^\+998\d{9}$/`
- Example: `+998901234567`

### Password
- Minimum length: 6-8 characters (varies by endpoint)
- No special requirements (letters, numbers, symbols all allowed)

### File Upload
- Max file size: 5MB
- Allowed formats: jpg, jpeg, png, webp, gif
- Recommended: Upload as JPEG or WebP for best compression

### Pagination (for future employee lists)
- Default limit: 20
- Max limit: 100
- Default page: 1

---

## Error Handling

### Common HTTP Status Codes

- `200` - OK (successful GET, PATCH)
- `201` - Created (successful POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate, e.g., phone already exists)
- `429` - Too Many Requests (rate limit exceeded)

### Error Response Format

```typescript
{
  statusCode: number;
  message: string | string[];  // Can be array for validation errors
  error: string;               // Error type (e.g., "Bad Request")
}
```

**Example Validation Error**:
```typescript
{
  statusCode: 400,
  message: [
    "phone must match +998XXXXXXXXX format",
    "password must be at least 8 characters"
  ],
  error: "Bad Request"
}
```

---

## Security Notes

### 1. Token Storage
- Store tokens in `localStorage` or secure cookie
- Never store in plain query parameters or URLs
- Clear tokens on logout

### 2. Token Refresh Strategy
- Monitor access token expiration (15 minutes)
- Implement auto-refresh before expiration
- On 401 errors, try refresh token
- If refresh fails, redirect to login

### 3. Tenant Isolation
- All data is automatically filtered by `tenantId` from JWT
- You cannot access other tenants' data
- No need to send `tenantId` in requests

### 4. Rate Limiting
- Login endpoint: 5 attempts per 2 minutes per IP
- Handle 429 errors gracefully with retry logic

### 5. File Upload Security
- Only images allowed for profile photos
- Files are scanned and validated on backend
- Use provided thumbnail URLs for display

---

## Complete Profile Page Example Flow

```typescript
// 1. On page load, get current user
const currentUser = await getMe();
const employeeId = currentUser.sub;

// 2. Fetch full profile
const profile = await getEmployeeById(employeeId);

// 3. Display profile data
displayProfile(profile);

// 4. Handle avatar upload
async function handleAvatarUpload(file: File) {
  // Upload file
  const uploadedFile = await uploadFile(file, 'EMPLOYEES');

  // Update profile with new photo URL
  await updateEmployee(employeeId, {
    photoUrl: uploadedFile.variants.thumb
  });

  // Refresh profile
  const updatedProfile = await getEmployeeById(employeeId);
  displayProfile(updatedProfile);
}

// 5. Handle profile update
async function handleProfileUpdate(data: UpdateData) {
  await updateEmployee(employeeId, data);

  // Refresh profile
  const updatedProfile = await getEmployeeById(employeeId);
  displayProfile(updatedProfile);
}

// 6. Handle password change
async function handlePasswordChange(current: string, newPass: string) {
  await changePassword(employeeId, current, newPass);
  alert('Password changed successfully');
}
```

---

## UI/UX Recommendations

### Profile Page Sections

1. **Avatar Section**
   - Display current photo (use `thumb` variant)
   - Click to upload new photo
   - Show upload progress
   - Show success/error messages

2. **Personal Information**
   - Full Name (editable)
   - Phone Number (editable, with validation)
   - Email (if added in future)

3. **Account Information**
   - Roles (read-only badges)
   - Permissions (collapsible list)
   - Active Branch (dropdown if multiple branches)
   - Account Status (active/inactive indicator)

4. **Security Section**
   - Change Password form
   - Current password field
   - New password field
   - Confirm password field (frontend validation)

5. **Branch Assignments**
   - List of assigned branches
   - Show active branch highlighted

### Form Validation

**Phone Number**:
- Use input mask: `+998 (__) ___-__-__`
- Validate on blur: `/^\+998\d{9}$/`
- Show error if invalid format

**Password Change**:
- Current password: required
- New password: min 6 chars, show strength indicator
- Confirm password: must match new password
- Show validation errors inline

**Avatar Upload**:
- Accept only images: `accept="image/jpeg,image/png,image/webp,image/gif"`
- Check file size before upload (max 5MB)
- Show image preview before confirming
- Compress large images on client if possible

---

## TypeScript Types

```typescript
// Login
interface LoginRequest {
  phone: string;
  password: string;
  tenantSlug?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  employee: {
    id: number;
    phone: string;
    fullName: string;
    roles: string[];
    tenantId: number;
    activeBranchId: number;
  };
}

// Current User
interface CurrentUser {
  sub: number;
  phone: string;
  tenantId: number;
  tenantSlug: string;
  roles: string[];
  permissions: string[];
  activeBranchId: number;
  type: 'access';
}

// Employee Profile
interface Employee {
  id: number;
  phone: string;
  fullName: string;
  photoUrl: string | null;
  isActive: boolean;
  activeBranchId: number;
  roles: Role[];
  branches: Branch[];
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
  category: string;
}

interface Branch {
  id: number;
  name: string;
  address: string;
}

// Update Profile
interface UpdateEmployeeRequest {
  phone?: string;
  fullName?: string;
  photoUrl?: string;
  roleIds?: number[];
  branchIds?: number[];
  activeBranchId?: number;
  isActive?: boolean;
}

// Change Password
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// File Upload
interface FileUploadResponse {
  id: number;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  folder: string;
  variants: {
    original: string;
    large?: string;
    medium?: string;
    thumb?: string;
  };
  metadata: {
    width?: number;
    height?: number;
    altText?: string;
  };
}
```

---

## FAQ

**Q: Can I update my own profile?**
A: Yes, use your employee ID from `/auth/me` response (`sub` field) to call `/admin/staff/employees/:id`

**Q: What happens if access token expires?**
A: Use the refresh token to get new tokens via `/auth/refresh`

**Q: Can I upload files other than images for avatar?**
A: No, only image formats (jpg, png, webp, gif) are allowed

**Q: How do I get my employee ID?**
A: Call `/auth/me` and use the `sub` field

**Q: Can I change other users' passwords?**
A: Depends on your permissions. Admins can, but need proper role permissions

**Q: What size avatar should I display?**
A: Use `thumb` variant for small avatars (50x50), `medium` for larger displays

**Q: Do I need to send tenantId in requests?**
A: No, it's extracted automatically from your JWT token

**Q: What if I get 401 Unauthorized?**
A: Try refreshing the token. If refresh fails, redirect to login

---

**Need more help?** Check the Swagger documentation at `/api/docs` when running the development server.
