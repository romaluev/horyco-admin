# Admin Panel — File Management

This document explains how file uploads work in Admin Panel for product images, category images, employee avatars, logos, and other files.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Upload Workflow](#upload-workflow)
4. [Image Variants](#image-variants)
5. [API Endpoints](#api-endpoints)
6. [UI Workflows](#ui-workflows)
7. [Error Handling](#error-handling)

---

## Overview

### Purpose

File management allows you to:
- Upload images for products, categories, employees
- Get multiple image sizes automatically (original, large, medium, thumb)
- Access files securely with temporary URLs
- Track image metadata (dimensions, alt text)

### Security

**Tenant Isolation:**
- All files stored with tenant prefix: `tenant-{tenantId}/products/...`
- You can only access your tenant's files
- Backend automatically filters by tenant

**Access Control:**
- Files accessed via presigned URLs (expire in 15 minutes)
- URLs regenerate on each request
- No permanent public URLs

**File Validation:**
- Only images allowed: JPG, PNG, WebP, GIF
- Max file size: 5MB
- Filenames sanitized automatically

---

## Core Concepts

### Upload Methods

**Method 1: Direct Upload (Recommended)**
- Simple one-step process
- Upload file directly to API
- Best for Admin Panel

**Method 2: Presigned URL**
- Two-step: get URL → upload → confirm
- Upload directly to storage
- Better for large files

**Use Method 1 for Admin Panel** — simpler and sufficient for typical images.

### Image Variants

When you upload an image, system automatically creates 4 versions:

| Variant | Max Size | Use For |
|---------|----------|---------|
| Original | No limit | High quality display, zoom |
| Large | 1200px | Product detail pages |
| Medium | 600px | Product cards, grids |
| Thumb | 200px | Lists, thumbnails |

**Important:**
- Images are converted to WebP format (85% quality, ~30% smaller file size)
- Aspect ratio is preserved (no cropping, only resizing)
- Variants are only generated if original image is larger than variant size
- All variants maintain the same aspect ratio as the original

### Entity Types

Files are always attached to an entity:

**Primary Entity Types (Available via Admin Upload API):**

| Entity Type | Use For | Example | Folder |
|------------|---------|---------|--------|
| PRODUCT | Product photos | Pizza image | `products` |
| CATEGORY | Category banners | "Desserts" header | `categories` |
| MODIFIER | Modifier icons | "Extra Cheese" icon | `modifiers` |
| EMPLOYEE | Employee avatars | Staff photo | `employees` |
| TENANT | Company logos, documents | Restaurant logo, certificates | `logos`, `branding`, `documents`, `misc` |

**Additional Entity Types (System-managed):**

These entity types are used internally by the system and not directly accessible via simplified upload endpoints:

| Entity Type | Use For | Storage Folder |
|------------|---------|----------------|
| ADDITION_ITEM | Addition item images | `addition-items` |
| BRANCH | Branch photos | `branch-assets` |
| OFFER | Promotional offer images | `offers` |
| TICKET | Kitchen ticket assets | `tickets` |
| RECEIPT_TEMPLATE | Receipt template assets | `receipt-templates` |
| MANUAL_PAYMENT_RECEIPT | Manual payment receipts | `manual-payment-receipts` |

**Note:** System-managed entity types are typically created through specific domain endpoints (e.g., creating an offer automatically handles its image upload).

---

## Upload Workflow

### Temporary Files (entityId = 0)

When uploading files using the simplified upload endpoints, files are initially created with `entityId=0`. This is intentional:

**Why entityId=0?**
- Files can be uploaded before creating the entity (e.g., upload product image before creating product)
- Frontend can display preview immediately
- File URL can be included when creating the entity

**How it works:**
```
1. Upload file → entityId=0, folder="products"
2. Get file URL from response
3. Create product with imageUrl from step 2
4. Backend associates file with product automatically
```

**Important:**
- Files with entityId=0 are NOT orphaned
- They're still scoped by tenant
- Can be deleted using DELETE /admin/files/:id (no entityId needed)

### How Upload Works

```
1. User selects file
   ↓
2. Frontend validates (size, type)
   ↓
3. Upload to API
   POST /admin/files/upload
   ↓
4. Backend uploads to storage
   ↓
5. Backend generates variants
   (original, large, medium, thumb)
   ↓
6. Returns URLs for all variants
   ↓
7. Use URLs in your forms
```

### Upload Single File

**Endpoint:** `POST /admin/files/upload`

**Request:**
```http
POST /admin/files/upload?folder=products&altText=Margherita%20Pizza
Content-Type: multipart/form-data

Form data:
- file: [binary file]

Query parameters:
- folder: "products" (required, one of: products, categories, modifiers, employees, logos, branding, documents, misc)
- altText: "Margherita Pizza" (optional)
```

**Response:**
```json
{
  "id": 123,
  "url": "https://storage.../original/123-pizza.webp",
  "filename": "123-pizza.webp",
  "size": 245678,
  "mimeType": "image/webp",
  "folder": "products",
  "variants": {
    "original": "https://storage.../original/123-pizza.webp",
    "large": "https://storage.../large/123-pizza.webp",
    "medium": "https://storage.../medium/123-pizza.webp",
    "thumb": "https://storage.../thumb/123-pizza.webp"
  },
  "metadata": {
    "width": 1920,
    "height": 1080,
    "altText": "Margherita Pizza"
  }
}
```

### Upload Multiple Files

**Endpoint:** `POST /admin/files/upload-multiple`

**Request:**
```http
POST /admin/files/upload-multiple?folder=products&altText=Product%20images
Content-Type: multipart/form-data

Form data:
- files: [file1, file2, file3]

Query parameters:
- folder: "products" (required, one of: products, categories, modifiers, employees, logos, branding, documents, misc)
- altText: "Product images" (optional, applied to all files)
```

**Response:**
```json
{
  "files": [
    {
      "id": 123,
      "url": "...",
      "variants": { ... }
    },
    {
      "id": 124,
      "url": "...",
      "variants": { ... }
    }
  ],
  "total": 2
}
```

**Limits:**
- Max 10 files per request
- Each file max 5MB
- Only images allowed

---

## Image Variants

### How Variants are Generated

```
Original Upload (JPEG/PNG/GIF)
    ↓
Sharp Image Processor
    ├─→ Original (optimized) - WebP, 85% quality
    ├─→ Large (1200px max) - for detail pages
    ├─→ Medium (600px max) - for cards
    └─→ Thumb (200px max) - for lists
```

**Processing Time:**
- Small images (<1MB): ~500ms
- Large images (2-5MB): ~2-3 seconds

### When to Use Each Variant

```
Product Grid         → thumb or medium
Product Detail Page  → large or original
Category Banner      → large or original
Admin Product List   → thumb
Zoom/Lightbox        → original
```

### Variant Storage

```
tenant-5/
  └── products/
      ├── original/
      │   └── 123-pizza.webp
      ├── large/
      │   └── 123-pizza.webp
      ├── medium/
      │   └── 123-pizza.webp
      └── thumb/
          └── 123-pizza.webp
```

---

## API Endpoints

### Upload Files

```
POST /admin/files/upload
→ Upload single file, get all variants

POST /admin/files/upload-multiple
→ Upload multiple files at once
```

### Get File Info

```
GET /admin/files/:id
→ Get file metadata and variant URLs

GET /admin/files/entity/:entityType/:entityId
→ Get all files for an entity (e.g., all product images)
```

**Example:**
```
GET /admin/files/entity/PRODUCT/123
→ Returns all images uploaded for Product #123
```

### Delete File

```
DELETE /admin/files/:id?entityType=PRODUCT&entityId=0
→ Deletes file and all variants
```

**Parameters:**
- `id` (required) - File ID to delete
- `entityType` (optional) - Entity type for verification (defaults to PRODUCT)
- `entityId` (optional) - Entity ID for verification (defaults to 0 for unassociated files)

**Important:**
- entityType and entityId are optional; if not provided, defaults are used
- Soft delete (kept in database for audit trail)
- All variants physically deleted from storage
- Cannot be recovered after deletion

---

## UI Workflows

### Workflow 1: Upload Product Image

**Screen:** Product Edit Page

```
┌─────────────────────────────────────────────────┐
│  Edit Product: Margherita Pizza                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Product Images (3/10)                          │
│                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ 🖼️  │  │ 🖼️  │  │ 🖼️  │  │  +   │      │
│  │Img 1 │  │Img 2 │  │Img 3 │  │Upload│      │
│  │ [×]  │  │ [×]  │  │ [×]  │  │      │      │
│  └──────┘  └──────┘  └──────┘  └──────┘      │
│                                                 │
│  [Drag & Drop or Click to Upload]              │
│                                                 │
│  Accepted: JPG, PNG, WebP, GIF                 │
│  Max size: 5MB per file                        │
│  Max files: 10                                  │
└─────────────────────────────────────────────────┘
```

**Steps:**

1. **User clicks Upload or drags file**
  - File picker opens
  - User selects `pizza.jpg`

2. **Frontend validates**
  - Check: File type allowed? ✅
  - Check: File size < 5MB? ✅
  - Show preview thumbnail

3. **Upload to API**
  - `POST /admin/files/upload`
  - Show progress bar
  - Wait for response

4. **Success**
  - Display uploaded image
  - Show all variants available
  - Image ready to use

**What to send:**
```javascript
// Create FormData with file
const formData = new FormData();
formData.append('file', fileObject);

// Send to API with query parameters
POST /admin/files/upload?folder=products&altText=Product%20image
Body: formData
```

**What you get:**
```json
{
  "id": 123,
  "variants": {
    "original": "https://...",
    "large": "https://...",
    "medium": "https://...",
    "thumb": "https://..."
  }
}
```

**Use the `medium` URL for product card, `large` for detail page.**

### Workflow 2: Replace Image

**User wants to change existing image**

```
1. Hover over image → Show [Replace] [Delete]

2. Click [Replace]
   → File picker opens
   → Select new file

3. Upload new file
   → Old file marked for deletion
   → New file uploaded

4. Success
   → Old file deleted
   → New file displayed
```

### Workflow 3: Upload Multiple Images

**Use case:** Add 5 product photos at once

```
1. Select multiple files
   → Show list of files

2. Validate each file
   ✅ pizza-1.jpg (2.1 MB)
   ✅ pizza-2.jpg (1.8 MB)
   ❌ pizza-3.jpg (6.2 MB) - Too large!
   ✅ pizza-4.png (3.4 MB)

3. Upload valid files
   → POST /admin/files/upload-multiple
   → Show progress for each

4. Success
   → Show all uploaded images
   → Option to retry failed ones
```

### Workflow 4: View Image Gallery

**Screen:** Product Detail → Images Tab

```
┌─────────────────────────────────────────────────┐
│  Product Images                                 │
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
│                                                 │
│  Variants Available:                            │
│  • Original (1920×1080) - 856 KB               │
│  • Large (1200×675) - 245 KB                   │
│  • Medium (600×338) - 87 KB                    │
│  • Thumb (200×113) - 12 KB                     │
│                                                 │
│  [Download] [Replace] [Delete]                  │
└─────────────────────────────────────────────────┘
```

---

## Error Handling

### Common Errors

**File Too Large (400)**
```json
{
  "statusCode": 400,
  "message": "File size exceeds 5MB limit",
  "error": "Bad Request"
}
```
**User message:** "File too large. Maximum size is 5MB. Please compress the image."

**Invalid File Type (400)**
```json
{
  "statusCode": 400,
  "message": "Invalid file type. Only images allowed",
  "error": "Bad Request"
}
```
**User message:** "Please upload an image file (JPG, PNG, WebP, or GIF)."

**Too Many Files (400)**
```json
{
  "statusCode": 400,
  "message": "Maximum 10 files per request",
  "error": "Bad Request"
}
```
**User message:** "You can upload up to 10 files at once. Please select fewer files."

**Upload Failed (500)**
```json
{
  "statusCode": 500,
  "message": "File upload failed",
  "error": "Internal Server Error"
}
```
**User message:** "Upload failed. Please try again."

**Retry Strategy:**
- Upload fails → Retry immediately (max 3 attempts)
- Show retry button if all attempts fail
- Allow user to retry manually

---

## Folder Structure

Organize uploads by type:

| Folder | Use For |
|--------|---------|
| `products` | Product images |
| `categories` | Category banners |
| `modifiers` | Modifier icons |
| `employees` | Employee avatars |
| `logos` | Tenant/brand logos |
| `branding` | Branding materials |
| `documents` | Legal documents, certificates |
| `misc` | Miscellaneous files |

**Folder to Entity Type Mapping:**

When you upload a file to a folder, it's automatically associated with an entity type:

| Folder | Entity Type | Use Case |
|--------|-------------|----------|
| `products` | PRODUCT | Product images |
| `categories` | CATEGORY | Category banners |
| `modifiers` | MODIFIER | Modifier icons |
| `employees` | EMPLOYEE | Employee avatars |
| `logos` | TENANT | Company logos |
| `branding` | TENANT | Branding materials |
| `documents` | TENANT | Legal documents |
| `misc` | TENANT | General files |

**Example:**
```
Upload product image:
  folder: "products"
  → Stored as: tenant-{tenantId}/products/{entityId}-{uniqueId}.webp
  → Entity type: PRODUCT

Upload category banner:
  folder: "categories"
  → Stored as: tenant-{tenantId}/categories/{entityId}-{uniqueId}.webp
  → Entity type: CATEGORY

Upload employee photo:
  folder: "employees"
  → Stored as: tenant-{tenantId}/employees/{entityId}-{uniqueId}.webp
  → Entity type: EMPLOYEE

Upload company logo:
  folder: "logos"
  → Stored as: tenant-{tenantId}/tenant-assets/{entityId}-{uniqueId}.webp
  → Entity type: TENANT
```

---

## Best Practices

### Image Size Recommendations

**Product Photos:**
- Upload: 1920×1080 or higher (landscape)
- Use `medium` variant for grid display
- Use `large` variant for detail page

**Category Banners:**
- Upload: 1920×600 or similar (wide)
- Use `large` variant for display

**Logos:**
- Upload: 512×512 (square) or 1024×256 (horizontal)
- Use `original` variant (no resizing needed for logos)

### Performance Tips

**Display Images:**
- Use smallest variant that looks good
- Mobile list → `thumb`
- Desktop grid → `medium`
- Detail page → `large`
- Zoom → `original`

**Loading:**
- Show loading spinner during upload
- Display thumbnail immediately after upload
- Lazy load images in long lists

---

## Common Questions

### Q: Why do URLs expire after 15 minutes?

**A:** Security. If a URL leaks, it becomes useless after 15 minutes.

**Frontend impact:**
- Never store presigned URLs permanently
- Always fetch fresh URL when displaying
- URLs in responses are valid for 15 minutes

### Q: What if image is smaller than variant size?

**A:** That variant won't be created.

**Example:**
Upload 400×300 image:
- `large` (1200px) → not created ❌
- `medium` (600px) → not created ❌
- `thumb` (200px) → created ✅
- `original` → always created ✅

**Response will have:**
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

### Q: Can I reuse same image for multiple products?

**A:** No. Each file belongs to one entity.

**Why:**
- Simpler data model
- Easier deletion
- Independent metadata per entity

**Workaround:** Upload the same file multiple times (fast with direct upload).

### Q: Are thumbnails cropped or resized?

**A:** Resized only, aspect ratio preserved.

**Example:**
```
Original: 1920×1080 (16:9)
↓
Thumb: 200×113 (16:9) - Same aspect ratio
```

No cropping, no distortion.

### Q: Why are all images converted to WebP?

**A:** WebP provides better compression with same quality.

**Benefits:**
- 25-35% smaller file size compared to JPEG/PNG
- Faster page load times
- Lower bandwidth costs
- Better user experience

**Browser support:**
- All modern browsers (Chrome, Firefox, Safari, Edge) support WebP
- 95%+ global browser coverage

### Q: What happens to animated GIFs?

**A:** Animated GIFs are currently processed as static images.

**Behavior:**
- Only first frame is extracted and converted to WebP
- Animation is lost during processing
- If you need animations, consider using video formats instead

**Workaround:** Use MP4 videos for animations (better compression, broader support).

### Q: Can I upload files without entityId first?

**A:** Yes! This is the recommended workflow.

**Example:**
```
1. Upload product image → Returns file with entityId=0
2. Create product with returned image URL
3. Backend automatically associates file with product
```

This allows you to show image preview before creating the entity.

---

## API Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/admin/files/upload` | Upload single file |
| `POST` | `/admin/files/upload-multiple` | Upload multiple files |
| `POST` | `/admin/files/presigned-url` | Generate presigned upload URL (advanced) |
| `POST` | `/admin/files/confirm` | Confirm presigned URL upload |
| `GET` | `/admin/files/:id` | Get file metadata |
| `GET` | `/admin/files/entity/:type/:id` | Get entity files |
| `DELETE` | `/admin/files/:id` | Delete file |

---

---

## 🆕 Key Changes (2025-11-20)

### **Fixed Upload Bug**
- ✅ Fixed "Employee does not belong to current tenant" error
- Added `tenantId` to user context in file upload controller

### **Automatic Presigned URLs**
- ✅ Backend now auto-generates presigned URLs when returning entities
- Employee responses include `avatar` field with presigned URLs
- Product responses include `imageUrls` field with all variants
- Category responses include `imageUrls` field with all variants

### **Updated Response Structure**

**Employee Response (GET /pos/staff):**
```json
{
  "id": 1,
  "photoUrl": "123",        // ← File ID (store this)
  "avatar": {               // ← NEW: Auto-generated presigned URLs
    "original": "https://storage.../original.jpg?...",
    "thumb": "https://storage.../thumb.jpg?..."
  }
}
```

**Product Response (GET /admin/products):**
```json
{
  "id": 42,
  "image": "456",           // ← File ID (store this)
  "imageUrls": {            // ← NEW: Auto-generated presigned URLs
    "original": "https://...",
    "medium": "https://...",
    "thumb": "https://..."
  }
}
```

### **Enhanced Proxy Endpoint**
- ✅ Improved `/file/:id` endpoint with proper MIME types
- Added 24-hour browser caching
- Better performance for image display

### **Frontend Integration**
- ✅ Store file ID (not URL!) in `photoUrl`/`image` fields
- ✅ Use presigned URLs from entity responses directly in `<img>` tags
- ✅ No manual URL fetching needed - backend handles it automatically
- See complete guide: `docs/frontend/FILE_UPLOAD_INTEGRATION.md`

---

## Document Updates

**Last Updated:** 2025-11-20

**Previous Changes:**
- ✅ Added all entity types (ADDITION_ITEM, OFFER, TICKET, etc.)
- ✅ Added missing folders (documents, misc)
- ✅ Updated WebP quality from 90% to 85% (matches implementation)
- ✅ Clarified query parameter usage for folder and altText
- ✅ Added folder-to-entity-type mapping table
- ✅ Added temporary files (entityId=0) explanation
- ✅ Added Common Questions about WebP conversion and animated GIFs
- ✅ Clarified that entityType and entityId are optional in DELETE endpoint
- ✅ Added presigned URL endpoints to API Summary
- ✅ Updated all code examples to match actual implementation
