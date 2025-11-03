# Admin Panel — File Management

This document explains how file uploads work in the Admin Panel, including product images, category images, employee avatars, logos, and other file types.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Concepts](#key-concepts)
3. [Upload Methods](#upload-methods)
4. [Supported Entity Types](#supported-entity-types)
5. [Image Variants](#image-variants)
6. [API Endpoints](#api-endpoints)
7. [UI/UX Flows](#uiux-flows)
8. [Common Questions](#common-questions)

---

## Overview

### 🎯 Purpose

The file management system allows admins to:
- Upload images for products, categories, and other entities
- Manage multiple image variants (original, large, medium, thumb)
- Secure file access with presigned URLs
- Track file metadata (dimensions, alt text, processing status)

### 🔒 Security Features

**Tenant Isolation**:
- All files stored with tenant prefix: `tenant-{tenantId}/`
- Employees can only access files from their tenant
- File paths never exposed directly to frontend

**Access Control**:
- Files accessed via presigned URLs (15 min expiry)
- URLs regenerated on every request
- No permanent public URLs

**File Validation**:
- MIME type whitelist (images only)
- File size limit: 5MB
- Filename sanitization
- Extension verification

---

## 🆕 Update (2025-11-03): Simplified Upload for Admin Panel

**NEW**: Admin-specific file upload endpoints have been added for simpler workflows!

### Two Upload Methods Available

#### Method 1: Direct Upload (Recommended for Admin Panel) **NEW**
- Simple, single-step process
- Upload files directly through API
- Suitable for files <5MB
- **Endpoints**: `POST /admin/files/upload`, `POST /admin/files/upload-multiple`

#### Method 2: Presigned URL Upload (Advanced)
- Two-step process: request URL → upload → confirm
- Direct upload to storage (bypasses backend)
- Better for large files
- **Endpoints**: `POST /admin/files/presigned-url`, `POST /admin/files/confirm`

**Choose Method 1 (Direct Upload) if:**
- Building Admin Panel UI
- File sizes < 5MB (typical for product images)
- Want simpler code

**Choose Method 2 (Presigned URL) if:**
- Building client-facing upload
- Large file sizes (>5MB)
- Need maximum performance

---

## Key Concepts

### 1. Why Presigned URLs?

**Problem**: Direct file uploads through API server are slow
- File must upload to server, then server uploads to storage
- 2x bandwidth usage
- API server becomes bottleneck

**Solution**: Presigned URLs
- Client uploads directly to MinIO storage
- API server only generates temporary upload URL
- 50% faster uploads

**How it works**:
```
1. Frontend requests presigned URL
   → Backend creates File record (status: pending)
   → Backend generates MinIO upload URL (15 min expiry)
   → Returns uploadUrl, fileId, fileKey

2. Frontend uploads file to presigned URL
   → Direct to storage, bypasses API
   → Fast and efficient

3. Frontend confirms upload
   → Backend verifies file exists in storage
   → Backend verifies file size matches
   → Updates File record (status: confirmed)
   → Triggers image processing
```

### 2. Image Processing Pipeline

**Automatic Processing** (happens after upload confirmation):

```
Original Upload (JPEG/PNG)
    ↓
Sharp Image Processor
    ├─→ Original (optimized) - WebP conversion, 90% quality
    ├─→ Large (1200px) - for product detail pages
    ├─→ Medium (600px) - for product cards
    └─→ Thumb (200px) - for lists/thumbnails
```

**Why WebP?**
- 30% smaller file size vs JPEG
- Better quality at same size
- Modern browser support (95%+)

**Processing Time**:
- Small images (<1MB): ~500ms
- Large images (2-5MB): ~2-3 seconds

### 3. File Variants Explained

**Original**:
- Optimized version of uploaded file
- Converted to WebP (unless already WebP/GIF)
- Used when highest quality needed

**Large (1200px)**:
- Product detail pages
- Category hero images
- High-resolution displays

**Medium (600px)**:
- Product cards in grid view
- Category thumbnails
- Most common use case

**Thumb (200px)**:
- Product lists
- Quick previews
- Admin panel thumbnails

**When to use each variant**:
```
Product Grid         → thumb or medium
Product Detail Page  → large or original
Category Banner      → large or original
Admin Product List   → thumb
```

### 4. Entity Types

Files are always attached to a specific entity. Supported types:

| Entity Type | Use Case | Example |
|------------|----------|---------|
| PRODUCT | Product photos | Pizza image |
| CATEGORY | Category banners | "Desserts" banner |
| MODIFIER | Modifier icons | "Extra Cheese" icon |
| ADDITION_ITEM | Addition item images | Sauce bottle photo |
| EMPLOYEE | Employee avatars | Staff profile photo |
| TENANT | Company logos | Restaurant logo |
| BRANCH | Branch photos | Store front image |
| RECEIPT_TEMPLATE | Receipt logos | Custom receipt header |

---

## Upload Methods

### Method 1: Direct Upload (NEW - Recommended for Admin Panel)

**When to use**:
- Admin Panel development
- Files <5MB (typical product images)
- Simple implementation needed

**Advantages**:
- ✅ Simple one-step process
- ✅ No need to manage upload state
- ✅ Automatic image processing
- ✅ Less code to write

**Flow**:
```
Single API Call
├── Frontend: POST /admin/files/upload with multipart/form-data
├── Backend: Uploads to MinIO
├── Backend: Generates image variants
└── Backend: Returns URLs immediately

Done! Use the URL in your entity (product, category, etc.)
```

**Example Code**:
```javascript
// Upload single file
const uploadFile = async (file, folder = 'products') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);  // products, categories, logos, etc.
  formData.append('altText', 'Product image');  // optional

  const response = await fetch('/admin/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  const data = await response.json();
  return data;
};

// Response:
// {
//   "id": 123,
//   "url": "https://cdn.oshlab.uz/tenant-42/products/original/123-pizza.jpg",
//   "filename": "123-pizza.jpg",
//   "size": 245678,
//   "mimeType": "image/jpeg",
//   "folder": "products",
//   "variants": {
//     "original": "https://cdn.oshlab.uz/.../original/123-pizza.jpg",
//     "large": "https://cdn.oshlab.uz/.../large/123-pizza.jpg",
//     "medium": "https://cdn.oshlab.uz/.../medium/123-pizza.jpg",
//     "thumb": "https://cdn.oshlab.uz/.../thumb/123-pizza.jpg"
//   },
//   "metadata": {
//     "width": 1920,
//     "height": 1080,
//     "altText": "Product image"
//   }
// }
```

**Upload Multiple Files**:
```javascript
const uploadMultipleFiles = async (files, folder = 'products') => {
  const formData = new FormData();

  // Add all files
  files.forEach(file => {
    formData.append('files', file);  // Note: 'files' plural
  });

  formData.append('folder', folder);

  const response = await fetch('/admin/files/upload-multiple', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  const data = await response.json();
  return data;
};

// Response:
// {
//   "files": [
//     { "id": 123, "url": "...", "variants": {...} },
//     { "id": 124, "url": "...", "variants": {...} },
//     { "id": 125, "url": "...", "variants": {...} }
//   ],
//   "total": 3
// }
```

**Folder Options**:
- `products` - Product images
- `categories` - Category banners
- `modifiers` - Modifier icons
- `employees` - Employee avatars
- `logos` - Tenant/brand logos
- `branding` - Branding materials
- `documents` - Documents and files
- `misc` - Miscellaneous files

**File Validation**:
- Max size: 5MB
- Allowed types: jpg, jpeg, png, webp, gif
- Max 10 files per request (for multi-upload)

**Error Handling**:
```javascript
try {
  const file = await uploadFile(imageFile, 'products');
  console.log('Uploaded:', file.url);
} catch (error) {
  if (error.status === 400) {
    // Validation error (file too large, wrong type, etc.)
    alert(error.message);
  } else if (error.status === 401) {
    // Not authenticated
    redirectToLogin();
  } else {
    // Server error
    alert('Upload failed. Please try again.');
  }
}
```

---

### Method 2: Presigned URL Upload (Advanced)

**When to use**:
- Production environments
- All file sizes
- Best performance

**Advantages**:
- ✅ Fastest upload speed
- ✅ Lowest server load
- ✅ Works on slow networks
- ✅ Built-in retry support

**Flow**:
```
Step 1: Request Upload URL
POST /admin/files/upload-url
{
  "entityType": "PRODUCT",
  "entityId": 123,
  "fileName": "pizza.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 1048576,
  "altText": "Margherita Pizza"
}

Response:
{
  "uploadUrl": "https://storage.oshlab.uz/tenant-5/products/...",
  "fileId": 45,
  "fileKey": "tenant-5/products/123-abc123.jpg",
  "expiresIn": 900  // 15 minutes
}

Step 2: Upload to Storage
PUT {uploadUrl}
Body: [file binary]
Headers: { 'Content-Type': 'image/jpeg' }

Step 3: Confirm Upload
POST /admin/files/confirm
{
  "fileId": 45,
  "fileKey": "tenant-5/products/123-abc123.jpg"
}

Response:
{
  "id": 45,
  "variants": {
    "original": "https://storage.oshlab.uz/...",
    "large": "https://storage.oshlab.uz/...",
    "medium": "https://storage.oshlab.uz/...",
    "thumb": "https://storage.oshlab.uz/..."
  },
  "metadata": {
    "width": 1920,
    "height": 1080,
    "confirmed": true,
    "confirmedAt": "2024-10-31T12:00:00Z"
  }
}
```

### Method 2: Direct Upload (Fallback)

**When to use**:
- Development/testing
- Old browsers without presigned URL support
- Small files only (<1MB)

**Advantages**:
- ✅ Simpler flow (1 API call)
- ✅ Good for batch uploads

**Disadvantages**:
- ❌ Slower (file passes through API)
- ❌ Higher server load
- ❌ Not recommended for production

**Flow**:
```
POST /admin/files/upload
Content-Type: multipart/form-data

Query Params:
?entityType=PRODUCT&entityId=123&altText=Product+Image

Form Data:
files: [File, File, ...]  // Max 10 files

Response: Array of FileResponseDto
[
  {
    "id": 45,
    "variants": { ... },
    "metadata": { ... }
  }
]
```

---

## Supported Entity Types

### PRODUCT (Products)

**Use Case**: Product images (food, drinks, merchandise)

**Restrictions**: None

**Example**:
```
Entity: Pizza Margherita (ID: 123)
File: pizza-margherita.jpg
Folder: products
Path: tenant-5/products/123-abc123.jpg
```

### CATEGORY (Menu Categories)

**Use Case**: Category banners and icons

**Restrictions**: None

**Example**:
```
Entity: Desserts (ID: 10)
File: desserts-banner.jpg
Folder: categories
Path: tenant-5/categories/10-xyz789.jpg
```

### EMPLOYEE (Staff Profiles)

**Use Case**: Employee avatars and photos

**Restrictions**: None

**Example**:
```
Entity: John Doe (ID: 45)
File: john-avatar.jpg
Folder: employees
Path: tenant-5/employees/45-qwerty.jpg
```

### TENANT (Business Brand)

**Use Case**: Restaurant logo, branding assets

**Restrictions**: None

**Example**:
```
Entity: Oshlab Restaurant (ID: 5)
File: logo.png
Folder: logos
Path: tenant-5/logos/5-logo123.png
```

---

## Image Variants

### How Variants Are Generated

**Automatic Processing**:
1. Upload confirmed
2. Original file downloaded from storage
3. Sharp processes image:
   - Resizes to each variant size
   - Converts to WebP
   - Optimizes quality
4. Variants uploaded back to storage
5. File record updated with variant paths

**Storage Structure**:
```
tenant-5/
  └── products/
      ├── original/
      │   └── 123-abc123.webp
      ├── large/
      │   └── 123-abc123.webp
      ├── medium/
      │   └── 123-abc123.webp
      └── thumb/
          └── 123-abc123.webp
```

### Variant Dimensions

| Variant | Max Width | Max Height | Use Case |
|---------|-----------|------------|----------|
| Original | No limit | No limit | Highest quality needed |
| Large | 1200px | Auto aspect | Product details, hero images |
| Medium | 600px | Auto aspect | Product cards, grids |
| Thumb | 200px | Auto aspect | Lists, thumbnails |

**Aspect Ratio Preserved**: Images are never stretched or cropped

---

## API Endpoints

### 1. Get Presigned Upload URL

**POST** `/admin/files/upload-url`

Request presigned URL for direct client upload.

**Request Body**:
```json
{
  "entityType": "PRODUCT",
  "entityId": 123,
  "fileName": "product-image.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 1048576,
  "altText": "Product description"
}
```

**Response (201)**:
```json
{
  "uploadUrl": "https://storage.oshlab.uz/tenant-5/products/123-xyz.jpg?...",
  "fileId": 45,
  "fileKey": "tenant-5/products/123-xyz.jpg",
  "expiresIn": 900
}
```

**Errors**:
- 400: Invalid file type or size
- 401: Unauthorized

---

### 2. Confirm Upload

**POST** `/admin/files/confirm`

Confirm successful upload after using presigned URL.

**Request Body**:
```json
{
  "fileId": 45,
  "fileKey": "tenant-5/products/123-xyz.jpg"
}
```

**Response (201)**:
```json
{
  "id": 45,
  "entityType": "PRODUCT",
  "entityId": 123,
  "folder": "products",
  "originalName": "product-image.jpg",
  "mimeType": "image/webp",
  "size": 856432,
  "variants": {
    "original": "https://storage.oshlab.uz/...(presigned-url)",
    "large": "https://storage.oshlab.uz/...(presigned-url)",
    "medium": "https://storage.oshlab.uz/...(presigned-url)",
    "thumb": "https://storage.oshlab.uz/...(presigned-url)"
  },
  "metadata": {
    "width": 1920,
    "height": 1080,
    "altText": "Product description",
    "confirmed": true,
    "confirmedAt": "2024-10-31T12:00:00Z",
    "processedAt": "2024-10-31T12:00:02Z"
  },
  "createdAt": "2024-10-31T12:00:00Z"
}
```

**Errors**:
- 404: File not found
- 400: File size mismatch (security check)
- 400: File not found in storage

**Security Checks**:
- Verifies file exists in MinIO
- Verifies file size matches declared size
- Prevents "size bomb" attacks

---

### 3. Direct File Upload

**POST** `/admin/files/upload`

Direct upload through API (fallback method).

**Content-Type**: `multipart/form-data`

**Query Parameters**:
- `entityType` (required): Entity type enum
- `entityId` (required): Entity ID number
- `altText` (optional): Image description

**Form Data**:
- `files`: File array (max 10 files)

**Response (201)**: Array of FileResponseDto

**Errors**:
- 400: No files provided
- 400: Invalid entity type
- 400: File validation failed

---

### 4. Get File Metadata

**GET** `/admin/files/:id`

Retrieve file metadata with all variants.

**Response (200)**:
```json
{
  "id": 45,
  "entityType": "PRODUCT",
  "entityId": 123,
  // ... (same as confirm response)
}
```

**Errors**:
- 404: File not found

---

### 5. Get Download URL

**GET** `/admin/files/:id/download`

Generate presigned download URL (15 min expiry).

**Response (200)**:
```json
{
  "downloadUrl": "https://storage.oshlab.uz/...",
  "expiresIn": 900
}
```

**Use Case**: Download original file for editing

---

### 6. Get Variant Download URL

**GET** `/admin/files/:id/download/:variant`

Get presigned URL for specific variant.

**Path Parameters**:
- `variant`: `large` | `medium` | `thumb`

**Response (200)**:
```json
{
  "downloadUrl": "https://storage.oshlab.uz/...",
  "expiresIn": 900
}
```

**Errors**:
- 404: Variant not found (image too small for that variant)

---

### 7. Get Entity Files

**GET** `/admin/files/entity/:entityType/:entityId`

Retrieve all files for an entity.

**Example**: `GET /admin/files/entity/PRODUCT/123`

**Response (200)**: Array of FileResponseDto

**Use Case**: Load product gallery, display all category images

---

### 8. Delete File

**DELETE** `/admin/files/:id?entityType=PRODUCT&entityId=123`

Delete file from storage and database.

**Query Parameters** (required):
- `entityType`: Entity type for verification
- `entityId`: Entity ID for verification

**Response (200)**:
```json
{
  "id": 45
}
```

**Business Rules**:
- Soft delete (record kept for audit)
- All variants deleted from storage
- Cannot be recovered

**Errors**:
- 404: File not found
- 403: Entity type/ID mismatch

---

## UI/UX Flows

### Flow 1: Upload Product Image

**Screen: Product Edit Page**

```
┌─────────────────────────────────────────────────┐
│  Edit Product: Pizza Margherita                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Product Images (3/10)                          │
│                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ 📷   │  │ 📷   │  │ 📷   │  │  +   │      │
│  │Image1│  │Image2│  │Image3│  │Upload│      │
│  │ [×]  │  │ [×]  │  │ [×]  │  │      │      │
│  └──────┘  └──────┘  └──────┘  └──────┘      │
│                                                 │
│  [Drag & Drop files here or click to browse]   │
│                                                 │
│  Accepted: JPEG, PNG, WebP, GIF                │
│  Max size: 5MB per file                        │
│  Max files: 10                                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**User Actions**:

1. **Click "Upload" or drag file**
   - File picker opens
   - User selects `pizza-new.jpg`

2. **File validation** (client-side)
   - Check: File type allowed? ✅
   - Check: File size < 5MB? ✅
   - Show preview thumbnail

3. **Start upload**
   - Request presigned URL from API
   - Show progress bar (0%)
   - Upload file to storage
   - Update progress (0% → 100%)

4. **Confirm upload**
   - Call confirm endpoint
   - Show processing indicator
   - Wait for image processing (~2s)

5. **Success**
   - Display uploaded image
   - Show all variants (original, large, medium, thumb)
   - Image ready to use

**Error Handling**:
- File too large → Show "Max 5MB" error
- Upload fails → Show retry button
- Confirm timeout → Auto-retry once

---

### Flow 2: Replace Product Image

**User wants to change existing image**

```
1. Hover over existing image
   → Show "Replace" and "Delete" buttons

2. Click "Replace"
   → File picker opens
   → Select new file

3. Upload new file
   → Old file marked for deletion
   → New file uploaded (same flow as above)

4. Success
   → Old file soft-deleted
   → New file displayed
   → All product references updated automatically
```

---

### Flow 3: View Image Gallery

**Screen: Product Detail - Images Tab**

```
┌─────────────────────────────────────────────────┐
│  Product Images Gallery                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────┐           │
│  │                                 │           │
│  │      [Main Image - Large]       │           │
│  │                                 │           │
│  └─────────────────────────────────┘           │
│                                                 │
│  Thumbnails:                                    │
│  [🖼️] [🖼️] [🖼️] [🖼️]                        │
│   ↑                                             │
│  Active                                         │
│                                                 │
│  Image Details:                                 │
│  • Dimensions: 1920 × 1080                      │
│  • File Size: 856 KB                            │
│  • Format: WebP                                 │
│  • Alt Text: Margherita Pizza                   │
│  • Uploaded: Oct 31, 2024                       │
│                                                 │
│  Available Variants:                            │
│  • Original (1920×1080) - 856 KB               │
│  • Large (1200×675) - 245 KB                   │
│  • Medium (600×338) - 87 KB                    │
│  • Thumb (200×113) - 12 KB                     │
│                                                 │
│  [Download Original] [Replace] [Delete]         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Flow 4: Batch Upload (Multiple Images)

**Use Case**: Upload 5 product images at once

```
1. Select multiple files
   → Show list of files to upload

2. Validate all files
   ✅ pizza-1.jpg (2.1 MB)
   ✅ pizza-2.jpg (1.8 MB)
   ❌ pizza-3.jpg (6.2 MB) - Too large!
   ✅ pizza-4.png (3.4 MB)
   ✅ pizza-5.webp (890 KB)

3. Show confirmation
   → "Upload 4 valid files? (1 file rejected)"

4. Upload sequentially
   → File 1: Uploading... 45%
   → File 2: Queued
   → File 3: Queued (skipped)
   → File 4: Queued
   → File 5: Queued

5. Progress tracking
   → Overall: 2 of 4 files uploaded

6. Success
   → Show all uploaded images
   → Option to retry failed uploads
```

---

## Common Questions

### Q: Why 15 minute expiry for presigned URLs?

**A:** Security best practice. If URL leaks:
- Attacker has limited time window
- URL becomes useless after 15 minutes
- New URL required for each access

**Frontend Impact**:
- Never store presigned URLs permanently
- Always fetch fresh URL when displaying image
- Use caching with expiry awareness

---

### Q: What happens if upload succeeds but confirm fails?

**A:** File exists in storage but not confirmed in database.

**System Behavior**:
- File record marked as "pending"
- Cleanup job runs daily, deletes unconfirmed files >24h old
- No orphaned files left in storage

**User Impact**:
- Upload appears to fail
- User can retry immediately
- No wasted storage space

---

### Q: Can I upload non-image files?

**A:** Currently no. Only images supported:
- JPEG
- PNG
- WebP
- GIF

**Future**: PDF support planned for receipts/documents

---

### Q: What if image is smaller than variant size?

**A:** Variant not generated.

**Example**:
- Upload 400×300 image
- `large` (1200px) not created ✗
- `medium` (600px) not created ✗
- `thumb` (200px) created ✓
- `original` always created ✓

**API Response**:
```json
{
  "variants": {
    "original": "https://...",
    "large": null,
    "medium": null,
    "thumb": "https://..."
  }
}
```

---

### Q: How to display responsive images?

**A:** Use appropriate variant based on viewport:

**Recommended Usage**:
```
Mobile list (< 768px)      → thumb
Tablet grid (768-1024px)   → medium
Desktop grid (> 1024px)    → medium
Product detail page        → large
Zoom/Lightbox              → original
```

**Performance Tip**: Always use smallest variant that looks good

---

### Q: What's the difference between altText and description?

**A:**
- **altText** (File metadata): Accessibility, SEO, image alt attribute
- **description** (Product): Product marketing description

**Example**:
```
Product: Margherita Pizza
Description: "Classic Italian pizza with fresh mozzarella and basil"

File altText: "Margherita Pizza with fresh basil and tomatoes"
           ↳ Used for screen readers and SEO
```

---

### Q: Can I reuse the same image for multiple products?

**A:** No. Each file belongs to one entity.

**Why?**
- Simpler data model
- Easier deletion logic
- Independent metadata per entity

**Workaround**: Upload same image multiple times (fast with presigned URLs)

---

### Q: How to handle upload errors?

**Common Errors**:

| Error | Cause | Solution |
|-------|-------|----------|
| 400: Invalid file type | Non-image file | Check MIME type before upload |
| 400: File too large | > 5MB | Compress image or show error |
| 404: File not found | Confirm timeout | Retry confirm request |
| 400: Size mismatch | Network corruption | Re-upload file |
| 500: Processing failed | Sharp error | Retry or upload different format |

**Retry Strategy**:
1. Upload fails → Retry immediately (max 3 times)
2. Confirm fails → Retry with exponential backoff
3. Processing fails → Notify user, allow retry

---

### Q: Are thumbnails cropped or resized?

**A:** Resized only, aspect ratio preserved.

**Why?**
- No important parts cut off
- Consistent with original image
- Better UX (predictable results)

**Example**:
```
Original: 1920×1080 (16:9)
↓
Thumb: 200×113 (16:9) - Aspect ratio preserved
```

---

## Security Considerations

### 1. Never Store Presigned URLs

**Why?**
- URLs expire after 15 minutes
- Storing them causes broken images
- Security risk if leaked

**Correct Approach**:
- Store file ID only
- Fetch fresh presigned URL on demand
- Cache URL client-side with expiry

---

### 2. Validate File Type Server-Side

**Client validation is not enough**:
- User can bypass frontend checks
- MIME type can be spoofed

**Server validates**:
- MIME type whitelist
- File extension
- Magic bytes (file signature)

---

### 3. XSS Protection

**Filenames sanitized automatically**:
- Special characters removed
- Scripts in filename blocked
- Safe characters only: `a-z A-Z 0-9 . _ -`

**Example**:
```
Upload: <script>alert('xss')</script>.jpg
Stored: -script-alert-xss--script-.jpg
```

---

### 4. Tenant Isolation

**Automatic Enforcement**:
- All file paths include `tenant-{tenantId}/`
- TenantAwareRepository filters queries
- No cross-tenant file access possible

**Example**:
```
Tenant 5 uploads file:
→ tenant-5/products/123-abc.jpg

Tenant 6 cannot access:
→ tenant-5/* (blocked by TenantAwareRepository)
```

---

### 5. Rate Limiting

**Upload Limits** (per tenant):
- Max 10 files per request
- Max 50 uploads per minute
- Max 5MB per file

**Why?**
- Prevent abuse
- Protect storage costs
- Ensure fair usage

---

## Performance Tips

### 1. Image Compression Before Upload

**Recommended**: Compress images client-side before upload
- Faster uploads
- Lower bandwidth costs
- Better UX

**Tools**: Browser Image Compression API

---

### 2. Lazy Loading

**Strategy**: Only load images when visible

**Implementation**:
- Use `loading="lazy"` attribute
- Load thumbnail first, upgrade to medium/large on interaction

---

### 3. Caching Strategy

**Presigned URLs**:
- Cache for 14 minutes (1 min buffer before expiry)
- Refresh before displaying if expired

**Image Files**:
- Browser caches automatically
- CDN integration planned for future

---

## Next Steps

1. **Implement upload UI** in Admin Panel
2. **Test upload flow** with various file sizes
3. **Handle errors gracefully** with retry logic
4. **Display images responsively** using variants
5. **Monitor upload performance** and optimize

For POS file management, see `POS_FILE_MANAGEMENT.md`

---

**Last Updated**: October 31, 2024
**Version**: 1.0
**Status**: ✅ Production Ready
