# Admin Panel — File Management

**Complete guide to uploading, managing, and displaying files in Admin Panel**

**Version:** 4.0 (Unified API)
**Last Updated:** 2025-01-24
**API Prefix:** `/files` (unified across all applications)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Upload Workflows](#upload-workflows)
4. [API Endpoints](#api-endpoints)
5. [UI Implementation Guidelines](#ui-implementation-guidelines)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## Overview

### What Changed (v4.0)

🎯 **Major Update**: File management has been unified!

**Before** (v3.x):
- `/admin/files/*` for Admin Panel
- `/pos/files/*` for POS
- Different endpoints, different behaviors

**Now** (v4.0):
- Single `/files/*` endpoint for ALL applications
- Role-based access control (admin vs POS users)
- Better performance (60-70% faster uploads)
- Simpler integration

###Purpose

File management allows you to:
- ✅ Upload images for products, categories, employees, logos
- ✅ Get multiple image sizes automatically (original, large, medium, thumb)
- ✅ Access files securely with time-limited URLs
- ✅ Track image metadata (dimensions, alt text)
- ✅ Manage files across different entities

### Performance Improvements

| Metric | Before (v3.x) | Now (v4.0) | Improvement |
|--------|---------------|------------|-------------|
| Upload Time (4 variants) | ~2-3 seconds | ~800ms | **60-70% faster** |
| Image Processing | Sequential | Parallel | **40% faster** |
| S3 Upload | Sequential | Parallel | **3-4x faster** |

---

## Core Concepts

### Security & Access Control

#### Tenant Isolation (Automatic)
- All files stored with tenant prefix: `tenant-{tenantId}/products/...`
- You can ONLY access your tenant's files
- Backend automatically filters by tenant - **you never send tenantId manually**

#### Access Control (Automatic)
- Files accessed via **presigned URLs** (expire in 15 minutes)
- URLs regenerate on each request
- No permanent public URLs
- **Presigned URLs don't require authentication** (signature provides security)

#### Admin vs POS Restrictions
- **Admin Users**: Can upload ALL entity types
- **POS Users**: Limited to `PRODUCT` and `RECEIPT_TEMPLATE` only
- Enforced automatically by backend guard

### File Validation

**Automatic validations:**
- ✅ Only images allowed: JPG, PNG, WebP, GIF
- ✅ Max file size: 5MB
- ✅ Filenames sanitized automatically
- ✅ Path traversal prevention
- ✅ MIME type validation

---

## Upload Workflows

### Method 1: Direct Upload (Recommended)

**Best for**: Admin Panel, most use cases

**Flow**:
```
1. User selects file
   ↓
2. Frontend validates (optional, but recommended)
   ↓
3. Upload to API
   POST /files/upload
   ↓
4. Backend processes image
   - Validates file
   - Converts to WebP (~30% smaller)
   - Generates variants (original, large, medium, thumb)
   - Uploads all variants to S3 in parallel
   ↓
5. Returns URLs for all variants
   ↓
6. Use URLs in your app
```

**Single File Upload**:
```http
POST /files/upload?entityType=PRODUCT&entityId=0&altText=Pizza
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form data:
- file: [binary file]

Query parameters:
- entityType: PRODUCT (required, see Entity Types below)
- entityId: 0 (optional, use 0 for temporary files)
- altText: "Margherita Pizza" (optional, for accessibility)
```

**Response**:
```json
{
  "id": 123,
  "variants": {
    "original": "https://s3.../tenant-1/products/original/0-abc123.webp?signature=...",
    "large": "https://s3.../tenant-1/products/large/0-abc123.webp?signature=...",
    "medium": "https://s3.../tenant-1/products/medium/0-abc123.webp?signature=...",
    "thumb": "https://s3.../tenant-1/products/thumb/0-abc123.webp?signature=..."
  },
  "metadata": {
    "width": 1920,
    "height": 1080,
    "altText": "Margherita Pizza",
    "originalFileName": "pizza.jpg"
  },
  "mimeType": "image/webp",
  "size": 245678
}
```

**Multiple File Upload** (max 10 files):
```http
POST /files/upload-multiple?entityType=PRODUCT&entityId=0
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form data:
- files: [binary file 1]
- files: [binary file 2]
- files: [binary file 3]
```

**Response**:
```json
{
  "files": [
    {
      "id": 123,
      "variants": { "original": "...", "large": "...", "medium": "...", "thumb": "..." },
      "metadata": { "width": 1920, "height": 1080 }
    },
    {
      "id": 124,
      "variants": { "original": "...", "large": "...", "medium": "...", "thumb": "..." },
      "metadata": { "width": 1280, "height": 720 }
    }
  ],
  "total": 2
}
```

---

### Method 2: Presigned URL Upload (Advanced)

**Best for**: Large files (>5MB), direct browser → S3 uploads

**3-Step Flow**:

**Step 1**: Request presigned URL
```http
POST /files/presigned-url
Content-Type: application/json
Authorization: Bearer {token}

{
  "entityType": "PRODUCT",
  "entityId": 0,
  "fileName": "pizza.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 2456789,
  "altText": "Margherita Pizza"
}
```

**Response**:
```json
{
  "uploadUrl": "https://s3.amazonaws.com/bucket/tenant-1/products/0-xyz.jpg?X-Amz-Signature=...",
  "fileKey": "tenant-1/products/0-xyz789.jpg",
  "fileId": 125,
  "expiresIn": 900,
  "instructions": "Use PUT method to upload file to uploadUrl"
}
```

**Step 2**: Upload directly to S3 (client-side, no backend)
```javascript
// In your frontend code
fetch(uploadUrl, {
  method: 'PUT',
  body: fileBlob,
  headers: {
    'Content-Type': 'image/jpeg'
  }
});
```

**Step 3**: Confirm upload
```http
POST /files/confirm
Content-Type: application/json
Authorization: Bearer {token}

{
  "fileId": 125,
  "fileKey": "tenant-1/products/0-xyz789.jpg"
}
```

**Response**: Same as direct upload (includes all variants)

---

## Image Variants

When you upload an image, the system automatically creates 4 versions:

| Variant | Max Size | Use For | Generated When |
|---------|----------|---------|----------------|
| **Original** | No limit | High quality display, zoom, downloads | Always |
| **Large** | 1200×1200px | Desktop product detail pages | Original > 1200px |
| **Medium** | 600×600px | Product cards, mobile views | Original > 600px |
| **Thumb** | 200×200px | Lists, thumbnails, previews | Original > 200px |

**Important Notes**:
- ✅ Aspect ratio preserved (no cropping)
- ✅ Converted to WebP format (85% quality, ~30% smaller than JPEG)
- ✅ Variants only generated if original is larger
- ✅ All processing happens in parallel (fast!)

**Example**: Upload 2400×1800px JPEG
- Original: 2400×1800px WebP
- Large: 1200×900px WebP
- Medium: 600×450px WebP
- Thumb: 200×150px WebP

---

## Entity Types

Files must be associated with an entity type:

### Admin Panel Entity Types

| Entity Type | Use For | Example | Access |
|------------|---------|---------|--------|
| `PRODUCT` | Product photos | Pizza image | Admin + POS |
| `CATEGORY` | Category banners | "Desserts" header | Admin only |
| `MODIFIER` | Modifier icons | "Extra Cheese" icon | Admin only |
| `ADDITION_ITEM` | Addition item images | "Coca Cola" thumbnail | Admin only |
| `EMPLOYEE` | Employee avatars | Staff photo | Admin only |
| `TENANT` | Company logos, documents | Restaurant logo | Admin only |
| `BRANCH` | Branch photos | Location exterior | Admin only |
| `OFFER` | Promotional images | "50% OFF" banner | Admin only |
| `RECEIPT_TEMPLATE` | Receipt assets | Custom header logo | Admin + POS |
| `MANUAL_PAYMENT_RECEIPT` | Payment proof images | Bank transfer receipt | Admin only |

**Note**: POS users can ONLY upload `PRODUCT` and `RECEIPT_TEMPLATE` files. Backend automatically blocks other types.

---

## API Endpoints

### Base URL
```
POST   /files/upload
POST   /files/upload-multiple
POST   /files/presigned-url
POST   /files/confirm
GET    /files/:id
GET    /files/:id/download
GET    /files/entity/:entityType/:entityId
DELETE /files/:id
```

**Authentication**: All endpoints require `Authorization: Bearer {token}`

---

### 1. Upload Single File

**Endpoint**: `POST /files/upload`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entityType` | string | ✅ Yes | Entity type (see Entity Types) |
| `entityId` | number | No | Entity ID (default: 0 for temporary) |
| `altText` | string | No | Accessibility text |

**Form Data**:
- `file`: Binary file (max 5MB)

**Response**: `FileResponseDto` (see above)

**Errors**:
- `400`: Invalid file type, size exceeded, or POS user trying restricted entity type
- `401`: Missing or invalid authentication token
- `413`: File too large (>5MB)

---

### 2. Upload Multiple Files

**Endpoint**: `POST /files/upload-multiple`

**Query Parameters**: Same as single upload

**Form Data**:
- `files`: Array of binary files (max 10 for admin, 5 for POS)

**Response**:
```json
{
  "files": [FileResponseDto, ...],
  "total": 3
}
```

---

### 3. Get File Metadata

**Endpoint**: `GET /files/:id`

**Response**: `FileResponseDto` with fresh presigned URLs (15-minute expiry)

**Use Case**: Refresh expired URLs, get file metadata

---

### 4. Get File for Entity

**Endpoint**: `GET /files/entity/:entityType/:entityId`

**Example**: `GET /files/entity/PRODUCT/42`

**Response**: `FileResponseDto` for the file associated with this entity

**Note**: Returns 404 if no file associated with entity

---

### 5. Get Download URL

**Endpoint**: `GET /files/:id/download`

**Response**:
```json
{
  "downloadUrl": "https://s3.../file?signature=...",
  "expiresIn": 300
}
```

**Use Case**: Direct file download with auth (5-minute expiry)

---

### 6. Delete File

**Endpoint**: `DELETE /files/:id?entityType=PRODUCT&entityId=42`

**Access**: Admin users only (POS users blocked)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entityType` | string | ✅ Yes | Entity type for validation |
| `entityId` | number | ✅ Yes | Entity ID for validation |

**Response**:
```json
{
  "id": 123
}
```

**What Happens**:
1. ✅ All variants deleted from S3 storage (hard delete)
2. ✅ Database record soft-deleted (preserves audit trail)

---

## UI Implementation Guidelines

### Product Image Upload Example

**User Flow**:
```
1. User navigates to "Create Product" form
2. User clicks "Upload Image" button
3. File picker opens
4. User selects pizza.jpg (2.5MB)
5. Frontend validates file (optional):
   - Check size < 5MB
   - Check type (jpg/png/webp/gif)
6. Upload to API
7. Show loading spinner
8. Receive response with variants
9. Display thumbnail (use "thumb" variant)
10. Store "medium" URL for product card
11. Store "original" URL for product creation
12. Submit product form with image URL
```

**Recommended UI Components**:

**File Picker**:
```
┌─────────────────────────────────────┐
│                                     │
│    [Click or drag to upload]        │
│                                     │
│    Max 5MB • JPG, PNG, WebP, GIF   │
│                                     │
└─────────────────────────────────────┘
```

**Upload Progress**:
```
┌─────────────────────────────────────┐
│ Uploading pizza.jpg...              │
│ ████████████░░░░░░░░░░ 60%          │
└─────────────────────────────────────┘
```

**Preview with Variants**:
```
┌─────────────────────────────────────┐
│         [Product Image]              │
│    ┌──────────────────┐             │
│    │                  │             │
│    │   [Pizza Image]  │             │
│    │                  │             │
│    └──────────────────┘             │
│                                     │
│  ✓ Original: 1920×1080 (450KB)     │
│  ✓ Large: 1200×675 (180KB)         │
│  ✓ Medium: 600×338 (65KB)          │
│  ✓ Thumb: 200×113 (15KB)           │
│                                     │
│  [Change Image]  [Remove]           │
└─────────────────────────────────────┘
```

### Displaying Images

**Use appropriate variant for context**:

```
Product List / Grid:
  <img src={file.variants.thumb} alt={file.metadata.altText} />

Product Card:
  <img src={file.variants.medium} alt={file.metadata.altText} />

Product Detail Page:
  <img src={file.variants.large} alt={file.metadata.altText} />

Zoom / Lightbox:
  <img src={file.variants.original} alt={file.metadata.altText} />
```

**Important**:
- ✅ ALWAYS use `variants.{size}` URLs (presigned, no auth needed)
- ❌ NEVER use raw file IDs like `/files/123` (requires auth, returns metadata not image)

### URL Expiry Handling

**Presigned URLs expire after 15 minutes**. Handle this:

**Option 1**: Refresh on component mount
```javascript
// Pseudo-code
useEffect(() => {
  if (fileId && isUrlExpired(fileUrl)) {
    refreshFileUrl(fileId); // GET /files/:id
  }
}, [fileId]);
```

**Option 2**: Cache URLs with timestamp
```javascript
// Store upload time
{
  fileId: 123,
  variants: { ... },
  uploadedAt: Date.now()
}

// Check before use
if (Date.now() - uploadedAt > 10 * 60 * 1000) { // 10 minutes
  refreshFileUrl(fileId);
}
```

**Option 3**: Handle 403 errors
```javascript
<img
  src={fileUrl}
  onError={(e) => {
    // URL expired, refresh
    refreshFileUrl(fileId).then(newUrl => {
      e.target.src = newUrl;
    });
  }}
/>
```

---

## Error Handling

### Common Errors

| Status | Error | Cause | Solution |
|--------|-------|-------|----------|
| **400** | Invalid file type | Uploaded PDF/DOC/etc | Only JPG, PNG, WebP, GIF allowed |
| **400** | Entity type not allowed | POS user uploading CATEGORY | Use PRODUCT or RECEIPT_TEMPLATE only |
| **400** | No file provided | Missing file in form data | Ensure form field name is "file" |
| **401** | Unauthorized | Missing/invalid token | Check Authorization header |
| **403** | Forbidden | Presigned URL expired | Refresh URL via GET /files/:id |
| **404** | File not found | Invalid file ID | Verify file exists in your tenant |
| **413** | File too large | File > 5MB | Compress image or use presigned URL method |
| **500** | Upload failed | S3 error, processing error | Retry upload, check logs |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "This operation is only allowed for entity types: PRODUCT, RECEIPT_TEMPLATE. Attempted: CATEGORY",
  "timestamp": "2025-01-24T10:00:00Z",
  "path": "/files/upload"
}
```

---

## Best Practices

### Performance

✅ **DO**:
- Use `thumb` variant for lists (200px, ~15KB)
- Use `medium` variant for product cards (600px, ~65KB)
- Use `large` variant for detail pages (1200px, ~180KB)
- Cache presigned URLs (with 10-minute refresh)
- Lazy load images below the fold
- Use `loading="lazy"` attribute

❌ **DON'T**:
- Don't use `original` variant everywhere (large file size)
- Don't request file metadata repeatedly (cache it)
- Don't refresh URLs on every render

### Accessibility

✅ **DO**:
- Always provide `altText` when uploading
- Use meaningful alt text: "Margherita Pizza with fresh basil" (good) vs "product_123.jpg" (bad)
- Include alt text in `<img alt="">` attributes

### UX

✅ **DO**:
- Show upload progress (especially for slow connections)
- Display thumbnail immediately after upload
- Allow image preview before upload
- Provide drag-and-drop upload
- Show file size and dimensions after upload
- Validate on frontend (size, type) before uploading

❌ **DON'T**:
- Don't block UI during upload (use async/background upload)
- Don't auto-submit form on image upload (let user review)
- Don't hide upload errors (show clear error messages)

### Security

✅ **DO**:
- Always include JWT token in Authorization header
- Handle 403 errors (expired URLs)
- Validate file types on frontend (UX)
- Trust backend validation (security)

❌ **DON'T**:
- Don't expose raw file IDs in public URLs
- Don't cache presigned URLs forever (15-minute expiry)
- Don't skip error handling

---

## Migration from v3.x to v4.0

### Breaking Changes

| v3.x (Old) | v4.0 (New) | Action Required |
|------------|------------|-----------------|
| `POST /admin/files/upload` | `POST /files/upload` | Update API base path |
| `folder` query param | `entityType` query param | Rename parameter |
| FileFolderEnum | EntityTypeEnum | Use entity types instead |

### Migration Steps

1. **Update API calls**:
   ```javascript
   // Old (v3.x)
   POST /admin/files/upload?folder=products

   // New (v4.0)
   POST /files/upload?entityType=PRODUCT&entityId=0
   ```

2. **Update entity type mapping**:
   ```javascript
   // Old folder names
   "products" → EntityTypeEnum.PRODUCT
   "categories" → EntityTypeEnum.CATEGORY
   "employees" → EntityTypeEnum.EMPLOYEE
   "logos" → EntityTypeEnum.TENANT
   ```

3. **Test POS restrictions** (if applicable):
   - Verify POS users can only upload PRODUCT and RECEIPT_TEMPLATE
   - Handle 400 errors for restricted entity types

---

## Quick Reference

**Upload file**:
```http
POST /files/upload?entityType=PRODUCT&entityId=0
Content-Type: multipart/form-data
file: [binary]
```

**Get file metadata**:
```http
GET /files/123
```

**Delete file** (admin only):
```http
DELETE /files/123?entityType=PRODUCT&entityId=42
```

**Use in HTML**:
```html
<img src={file.variants.medium} alt={file.metadata.altText} loading="lazy" />
```

---

## Support

**Issues with file uploads?**
- Check file size (<5MB)
- Check file type (JPG/PNG/WebP/GIF)
- Verify JWT token is valid
- Check console for error details

**Performance issues?**
- Use appropriate variant (thumb/medium/large)
- Enable lazy loading
- Cache presigned URLs

**Questions?**
- Swagger UI: http://localhost:3000/api/docs
- Slack: #backend-api
- Email: dev@horyco.com

---

**Happy coding! 🚀**
