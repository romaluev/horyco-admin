# Admin Panel — Menu Management

This document describes frontend tasks for the **Menu Management** section in Admin Panel. All described endpoints are already implemented on the backend (Stage 3.2) and ready for integration. The material explains business logic, page navigation, and the context for using each API endpoint.

## 📋 Table of Contents

1. [Basic Concepts and Terms](#basic-concepts-and-terms)
2. [Navigation and Menu Structure](#navigation-and-menu-structure)
3. [Page: Categories](#page-categories)
4. [Page: Products](#page-products)
5. [Page: Modifiers](#page-modifiers)
6. [Page: Additions](#page-additions)
7. [Page: Menu Templates](#page-menu-templates)
8. [Page: Branch Overrides](#page-branch-overrides)
9. [Common Use Cases](#common-use-cases)

---

## Basic Concepts and Terms

### 🔑 Key Menu System Concepts

#### **Category**
Grouping of products for convenient navigation. Categories can be **hierarchical** (parent → subcategories).

**Examples:**
- `Beverages` → `Hot Drinks`, `Cold Drinks`
- `Main Dishes` → `Pasta`, `Pizza`, `Salads`

**Why needed:**
- Menu organization in POS and WebApp
- Grouping for sales analytics
- Visual categorization for customers

#### **Product**
The main menu unit — a dish, beverage, or item sold to customers.

**Required fields:**
- `name` — product name
- `price` — base price
- `categoryId` — category it belongs to
- `productTypeId` — product type (food, beverage, alcohol, etc.)

**Optional:**
- `description` — dish description
- `image` — product photo
- `isAvailable` — available for ordering
- `preparationTime` — preparation time (minutes)
- `calories` — calorie count
- `allergens` — list of allergens

#### **Modifier**
Option to modify a product with **additional price**. Modifiers are grouped into **Modifier Groups**.

**Example for "Burger":**
```
Modifier Group: "Doneness Level"
├── Well Done (+0)
├── Medium (+0)
└── Rare (+0)

Modifier Group: "Extra Ingredients"
├── Extra Cheese (+150)
├── Bacon (+200)
└── Avocado (+180)
```

**Why needed:**
- Customer can customize dish (size, spice level, toppings)
- Automatic final price calculation in order
- Kitchen receives precise cooking instructions

**Important:**
- Modifier **must belong to a Modifier Group**
- Modifier group is linked to a product
- Can set `minSelection` and `maxSelection` (e.g., "select 1-3 toppings")

#### **Addition**
Group of **optional items** that can be added to the main product. Unlike modifiers, additions consist of **Addition Items** — separate products with their own price.

**Example for "Pizza Margherita":**
```
Addition: "Sauces"
├── Garlic Sauce (50)
├── BBQ Sauce (50)
└── Cheese Sauce (70)

Addition: "Drinks with Pizza"
├── Coca-Cola 0.5L (150)
├── Fanta 0.5L (150)
└── Mineral Water (100)
```

**Addition Properties:**
- `isRequired` — must at least one item be selected
- `isMultiple` — can multiple items be selected
- `isCountable` — can quantity be specified (e.g., 3 sauces)
- `minSelection` / `maxSelection` — selection constraints

**Difference from Modifier:**
| Characteristic | Modifier | Addition |
|---------------|----------|----------|
| Price | Added to product base price | Each item has separate price |
| Structure | Flat list of options in group | Group → Items (two-level) |
| Use | Changing dish characteristics | Additional items to dish |
| Example | Size, doneness, toppings | Sauces, drinks, desserts |

#### **Branch Override**
Ability to **override product parameters** for a specific branch without changing the base configuration.

**What can be overridden:**
- `price` — branch-specific price (e.g., higher in city center)
- `isAvailable` — availability (seasonal dishes only in certain locations)
- `image` — localized photo
- `name` — localized name

**Usage example:**
```
Product: "Cappuccino"
Base price: 350

Branch Overrides:
├── Branch "Downtown" → 450 (more expensive)
├── Branch "Residential" → 300 (cheaper)
└── Branch "Airport" → unavailable (isAvailable=false)
```

**Why needed:**
- Different prices for different locations
- Regional menu features
- Seasonal restrictions by branch
- Testing new items in selected locations

#### **Menu Template**
Ready-made set of categories and products for quick start of a new restaurant.

**Template examples:**
- "Coffee Shop" — coffee, tea, desserts, sandwiches
- "Pizzeria" — pizzas, pasta, salads, drinks
- "Fast Food" — burgers, fries, drinks
- "Sushi Bar" — rolls, sashimi, soups, drinks

**Why needed:**
- Accelerate onboarding of new clients
- Menu standardization for franchises
- Ready structure for new branches

---

## Navigation and Menu Structure

### Main Admin Panel Menu

```
📊 Dashboard
📋 Orders
🍔 Menu ← YOU ARE HERE
   ├── 📂 Categories
   ├── 🍕 Products
   ├── ⚙️ Modifiers
   ├── ➕ Additions
   ├── 📑 Menu Templates
   └── 🏢 Branch Overrides
👥 Customers
👨‍💼 Staff
🏪 Branches
💰 Finance
⚙️ Settings
```

### Navigation Flow

```
Main Menu Page
    ↓
┌───────────────────────────────────────┐
│  Category/Product List                │
│  + Search, filters, sorting           │
└───────────────────────────────────────┘
    ↓ (click on product)
┌───────────────────────────────────────┐
│  Product Detail Page                  │
│  + Edit basic information             │
└───────────────────────────────────────┘
    ↓ (tab "Modifiers")
┌───────────────────────────────────────┐
│  Product Modifier Management          │
│  + Add / remove groups                │
└───────────────────────────────────────┘
    ↓ (tab "Additions")
┌───────────────────────────────────────┐
│  Additions Management                 │
│  + Add / remove additions             │
└───────────────────────────────────────┘
    ↓ (tab "By Branches")
┌───────────────────────────────────────┐
│  Branch Overrides                     │
│  + Configure prices/availability      │
└───────────────────────────────────────┘
```

---

## Page: Categories

### 📍 Navigation
**Path:** `Admin Panel → Menu → Categories`
**URL:** `/admin/menu/categories`

### 🎯 Page Purpose
Manage hierarchical menu category structure. Manager can create, edit, delete, and reorder categories.

### 📋 API Endpoints

#### 1. Get category list
```
GET /admin/menu/categories
Query parameters:
  - parentId? (number) — filter by parent category
  - includeProducts? (boolean) — include product count
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Beverages",
    "parentId": null,
    "children": [{ "id": 2, "name": "Hot Drinks" }],
    "productCount": 25
  }
]
```

#### 2. Create category
```
POST /admin/menu/categories
Body: { "name": "Desserts", "parentId": null, "sortOrder": 5 }
```

#### 3. Update category
```
PATCH /admin/menu/categories/:id
Body: { "name": "Hot Desserts" }
```

#### 4. Delete category
```
DELETE /admin/menu/categories/:id
```

**⚠️ Important:**
- Cannot delete category with subcategories
- Cannot delete category with products

#### 5. Reorder categories
```
PATCH /admin/menu/categories/reorder
Body: { "categoryIds": [3, 1, 2, 5, 4] }
```

### 🎨 UI Components

**Category List:**
- Tree view with drag-and-drop
- Category icon / placeholder
- Name + description
- Product counter
- Activity indicator (on/off)
- Buttons: Edit, Delete, Add Subcategory

**Create/Edit Modal:**
```
┌─────────────────────────────────────┐
│  Create Category                    │
├─────────────────────────────────────┤
│  Name: [_________________]          │
│  Description: [_________________]   │
│  Parent: [▼ Select category]        │
│  Image: [📷 Upload]                 │
│  Active: [✓]                        │
│                                     │
│  [Cancel]  [Save]                   │
└─────────────────────────────────────┘
```

### ✅ Validation

1. **Category name:**
   - Required field
   - Max 100 characters
   - Should not duplicate at same level

2. **Parent category:**
   - Cannot select itself
   - Cannot create circular dependency (A → B → A)

3. **Deletion:**
   - Show warning if subcategories exist
   - Show number of affected products

### 🔄 Use Cases

**Creating hierarchy:**
```
1. Manager creates "Beverages" (parentId=null)
2. Creates "Hot Drinks" (parentId=1)
3. Reorders via drag-and-drop
4. System saves new sortOrder
```

---

## Page: Products

### 📍 Navigation
**Path:** `Admin Panel → Menu → Products`
**URL:** `/admin/menu/products`

### 🎯 Page Purpose
Manage product catalog: creation, editing, price and availability control.

### 📋 API Endpoints

#### 1. Get product list (with filters and pagination)
```
GET /admin/menu/products
Query parameters:
  - categoryId? (number) — filter by category
  - available? (boolean) — only available / unavailable
  - q? (string) — search by name
  - page? (number) — page number (default: 1)
  - limit? (number) — items per page (default: 20)
```

**Response:**
```json
{
  "data": [
    { "id": 101, "name": "Cappuccino", "price": 350, "isAvailable": true }
  ],
  "total": 156,
  "page": 1,
  "totalPages": 8
}
```

#### 2. Get product details
```
GET /admin/menu/products/:id
```

**Response:**
```json
{
  "id": 101,
  "name": "Cappuccino",
  "price": 350,
  "categoryId": 5,
  "isAvailable": true,
  "modifierGroupsCount": 2
}
```

#### 3. Create product
```
POST /admin/menu/products
Body: {
  "name": "Espresso",
  "price": 200,
  "categoryId": 5,
  "productTypeId": 2
}
```

#### 4. Update product
```
PATCH /admin/menu/products/:id
Body: { "name": "Double Espresso", "price": 280 }
```

#### 5. Quick price update [DEPRECATED]
```
PATCH /admin/menu/products/:id/price
Body: { "price": 320 }
```

**[DEPRECATED]** Use instead:
- `PATCH /admin/menu/products/:id` - for single product updates
- `PATCH /admin/menu/products/bulk-price` - for bulk price updates

**Migration notes:**
- Overly specialized endpoint
- Bulk endpoint more efficient for mass operations
- Will be removed in v2.0

**Migration:**
```json
{
  "old": "PATCH /admin/menu/products/:id/price",
  "new_single": "PATCH /admin/menu/products/:id",
  "new_bulk": "PATCH /admin/menu/products/bulk-price"
}
```

#### 6. Change availability
```
PATCH /admin/menu/products/:id/availability
Body: { "isAvailable": false }
```

#### 7. Delete product
```
DELETE /admin/menu/products/:id
```

**⚠️ Important:** Soft delete — product marked with `deletedAt`

---

### 🆕 Bulk Operations (NEW - 2025-11-03)

**Why needed:** Restaurants with hundreds of products need bulk operations instead of individual API calls!

#### 8. Bulk create products
```
POST /admin/menu/products/bulk
Body: {
  "products": [
    { "name": "Pizza Margherita", "price": 25000, "categoryId": 1, "productTypeId": 1 }
  ]
}
```

**Response:**
```json
{
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": [...]
}
```

#### 9. Bulk price update
```
PATCH /admin/menu/products/bulk-price
Body: {
  "productIds": [1, 2, 3],
  "priceChange": { "type": "percentage", "value": 10 }
}
```

**Examples:**
- Increase by 10%: `{ "type": "percentage", "value": 10 }`
- Decrease by 5%: `{ "type": "percentage", "value": -5 }`
- Add fixed amount: `{ "type": "fixed", "value": 5000 }`

#### 10. Bulk availability update
```
PATCH /admin/menu/products/bulk-availability
Body: { "productIds": [1, 2, 3], "isAvailable": false }
```

#### 11. Category-level availability update
```
PATCH /admin/menu/categories/:categoryId/products/availability
Body: { "isAvailable": false }
```

#### 12. Bulk delete
```
DELETE /admin/menu/products/bulk-delete
Body: { "productIds": [1, 2, 3] }
```

**Response:**
```json
{
  "deleted": 2,
  "failed": 1,
  "errors": [{ "productId": 3, "reason": "Product in active orders" }]
}
```

#### 13. Bulk general update
```
PATCH /admin/menu/products/bulk-update
Body: {
  "productIds": [1, 2, 3],
  "updates": { "categoryId": 5 }
}
```

#### 14. Reorder products within category
```
PATCH /admin/menu/categories/:categoryId/products/reorder
Body: { "productIds": [5, 3, 1, 4, 2] }
```

**Response codes:** 200 OK, 400 Bad Request, 404 Not Found

---

### 🆕 Create Product with Image (NEW - 2025-11-03)

**Problem:** Previously needed 3 API calls (create → upload → update)

**Solution:** Now everything in one call!

#### 15. Create product with image
```
POST /admin/menu/products/with-image
Content-Type: multipart/form-data

Form fields:
- image: [binary file]
- name: "Pizza Margherita"
- price: 25000
- categoryId: 1
- productTypeId: 1
```

**Features:**
- Automatic image optimization (WebP)
- Variant generation (original, large, medium, thumb)
- Tenant isolation
- Single API call instead of 3

**Frontend example:**

Create a FormData object with these fields:
- `image`: Binary file
- `name`: "Pizza Margherita"
- `price`: "25000"

Send as POST to `/admin/menu/products/with-image` with `Content-Type: multipart/form-data`

### 🎨 UI Components

**Product List (Table View):**
| Photo | Name | Category | Price | Available | Actions |
|------|------|----------|-------|-----------|---------|
| 🖼️ | Cappuccino | Hot Drinks | 350 | ✅ On | ✏️ 🗑️ |

**Filters:**
```
┌──────────────────────────────────────────┐
│ Category: [▼ All]  Status: [▼ All]      │
│ Search: [🔍 Product name...]             │
└──────────────────────────────────────────┘
```

### ✅ Validation

1. **Product name:** Required, max 200 characters
2. **Price:** Required, min 0, max 999999
3. **Category:** Required, must exist
4. **ProductTypeId:** Required for classification

---

## Page: Modifiers

### 📍 Navigation
**Path:** `Admin Panel → Menu → Modifiers`
**URL:** `/admin/menu/modifiers`

**Alternative:** `Products → [Product] → "Modifiers" Tab`

### 🎯 Page Purpose
Manage modifier groups and modifiers for product customization.

### 💡 Business Logic

**Architecture:**
```
Product (Pizza Margherita)
  └── Modifier Group: "Size"
      ├── Modifier: "Small (25cm)" +0
      ├── Modifier: "Medium (30cm)" +200
      └── Modifier: "Large (35cm)" +400
```

**Rules:**
- Modifier Group defines: `minSelection`, `maxSelection`, `isRequired`
- Modifier always belongs to a group
- Group is linked to a product

### 💡 Modifier Group Templates - Business Logic

#### What Are Templates?

Modifier group templates are pre-defined groups (like "Size", "Temperature") created at the **platform level** and automatically given to new tenants during registration.

#### How Templates Work

**Template Cloning Process:**
```
┌─────────────────────────────────────────────────┐
│ Platform Level (Super Admin)                   │
│ Template: "Size" (tenant_id = NULL)            │
│ - Not attached to any products                  │
│ - Serves as blueprint only                     │
└─────────────────────────────────────────────────┘
                    ↓
          New Tenant Registers
                    ↓
┌─────────────────────────────────────────────────┐
│ Tenant's Copy (tenant_id = 123)                │
│ Modifier Group: "Size" (cloned from template)  │
│ - Tenant can rename it                          │
│ - Tenant can add modifiers to it               │
│ - Tenant can attach it to products             │
│ - Completely independent from template         │
└─────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Cloned, not shared** - Each tenant gets their own copy
- **One-time copy** - Template changes don't affect existing tenants
- **Full ownership** - Tenants can modify, rename, or delete their copy
- **Pure tenant isolation** - No cross-tenant data sharing

#### User Flow: Tenant's First Login

**Scenario:** Restaurant owner "John" registers his coffee shop.

**Step 1: Registration**
```
1. John fills registration form:
   - Business name: "John's Coffee"
   - Phone: +998901234567
   - Email: john@coffee.com

2. Backend creates tenant account
3. Backend automatically clones all templates to John's account:
   ✓ "Size" modifier group created (empty, no modifiers yet)
```

**Step 2: Setting Up First Product**
```
1. John navigates to: Admin Panel → Menu → Products
2. Creates product "Cappuccino" (price: 15,000)
3. Clicks on "Cappuccino" → "Modifiers" tab
4. Sees available modifier groups:
   ┌───────────────────────────────────┐
   │ Available Groups:                 │
   │ ☐ Size (no modifiers yet)        │
   │ [+ Create Custom Group]           │
   └───────────────────────────────────┘
```

**Step 3: Adding Modifiers to Size Group**
```
1. John clicks on "Size" group
2. Adds modifiers:
   - "Small (8oz)" → price: 0
   - "Medium (12oz)" → price: 3,000
   - "Large (16oz)" → price: 5,000
3. Saves modifier group
```

**Step 4: Attaching to Product**
```
1. Returns to "Cappuccino" product
2. Attaches "Size" modifier group
3. Sets rules:
   ✓ Required: Yes
   ✓ Min selection: 1
   ✓ Max selection: 1
```

**Result:**
- Customers ordering Cappuccino must choose a size
- POS shows size options when adding Cappuccino to order
- Frontend can render special UI for "Size" group (icons, visual layout)

#### User Flow: Creating Products Without Templates

**Scenario:** Pizza restaurant needs "Toppings" modifier group (not a template).

**Step 1: Create Custom Group**
```
1. Navigate to: Admin Panel → Menu → Modifiers
2. Click [+ Create Modifier Group]
3. Fill form:
   - Name: "Toppings"
   - Required: No
   - Min selection: 0
   - Max selection: 5
4. Click [Save]
```

**Step 2: Add Modifiers**
```
1. Click on "Toppings" group
2. Add modifiers:
   - "Extra Cheese" → +2,000
   - "Pepperoni" → +3,000
   - "Mushrooms" → +1,500
   - "Olives" → +1,000
3. Save
```

**Step 3: Use Across Products**
```
1. Attach "Toppings" to "Pizza Margherita"
2. Attach "Toppings" to "Pizza Pepperoni"
3. Attach "Toppings" to "Pizza Vegetariana"

Result: All pizzas share same topping options
```

#### Frontend UX Patterns

**Pattern 1: Template vs Custom Groups**

Frontend should detect standard template names and render optimized UI. For example, when showing the "Size" group, instead of a plain list, the UI can display visual size representations with icons (small cup, medium cup, large cup). For "Temperature", it can show hot/cold icons. For custom groups like "Toppings", show a generic checkbox/radio list.

**Pattern 2: Empty Template vs Configured Template**

```
Scenario: Tenant has "Size" template but hasn't added modifiers yet

UI Should Show:
┌─────────────────────────────────────────┐
│ Modifier Groups                         │
├─────────────────────────────────────────┤
│ ☐ Size (0 modifiers) ⚠️                │
│   [Add modifiers to this group]         │
│                                         │
│ ☐ Toppings (5 modifiers)               │
│                                         │
│ [+ Create Custom Group]                 │
└─────────────────────────────────────────┘

When attaching to product:
- If "Size" has no modifiers → Show warning
- User can either:
  a) Add modifiers first
  b) Skip and attach later
```

**Pattern 3: Reusing Groups Across Products**

```
UX Flow: Attach modifier group to multiple products

Step 1: Select products
┌─────────────────────────────────────────┐
│ Bulk Actions                            │
│ Selected: 3 products                    │
│ - Cappuccino                            │
│ - Latte                                 │
│ - Americano                             │
└─────────────────────────────────────────┘

Step 2: Choose action
[Attach Modifier Group ▼]

Step 3: Select group
┌─────────────────────────────────────────┐
│ Select Modifier Group                   │
│ ( ) Size (3 modifiers)                  │
│ ( ) Temperature (3 modifiers)           │
│ ( ) Extras (4 modifiers)                │
│                                         │
│ [Cancel] [Attach to All]                │
└─────────────────────────────────────────┘

Result: All 3 coffee drinks now have same size options
```

### 📋 API Endpoints

#### Modifier Groups

#### 1. Get modifier group list
```
GET /admin/menu/modifier-groups
Query: search?, isRequired?
```

**Response:**
```json
[
  {
    "id": 10,
    "name": "Pizza Size",
    "isRequired": true,
    "minSelection": 1,
    "maxSelection": 1
  }
]
```

#### 2. Get modifier group with modifiers
```
GET /admin/menu/modifier-groups/:id?includeModifiers=true
```

#### 3. Create modifier group
```
POST /admin/menu/modifier-groups
Body: {
  "name": "Pizza Size",
  "isRequired": true,
  "minSelection": 1,
  "maxSelection": 1
}
```

**Validation:**
- `minSelection` >= 0
- `maxSelection` >= `minSelection`
- If `isRequired = true`, then `minSelection` >= 1

#### 4. Update modifier group
```
PATCH /admin/menu/modifier-groups/:id
Body: { "maxSelection": 2 }
```

#### 5. Delete modifier group
```
DELETE /admin/menu/modifier-groups/:id
```

#### 6. Get modifier groups for product
```
GET /admin/menu/products/:productId/modifier-groups
```

#### 7. Attach modifier group to product (RECOMMENDED)
```
POST /admin/menu/products/:productId/attach-modifier-group
Body: { "groupId": 5 }
```

**Why recommended:**
- Clear association semantics
- Action-based naming
- Body contains group ID for flexibility

**Response:**
```json
{ "message": "Modifier group attached to product successfully" }
```

#### 8. Detach modifier group from product (RECOMMENDED)
```
DELETE /admin/menu/products/:productId/detach-modifier-group
Body: { "groupId": 5 }
```

---

#### ⚠️ DEPRECATED: Old attach/detach endpoints (will be removed in v2.0)

##### 7a. [DEPRECATED] Attach via nested resource
```
POST /admin/menu/products/:productId/modifier-groups/:groupId
```

**Problem:** Looks like CRUD but manages association

**Migration:**
```
// ❌ Old (deprecated)
POST /admin/menu/products/1/modifier-groups/5

// ✅ New (recommended)
POST /admin/menu/products/1/attach-modifier-group
Body: { "groupId": 5 }
```

##### 8a. [DEPRECATED] Detach via nested resource
```
DELETE /admin/menu/products/:productId/modifier-groups/:groupId
```

**Migration:**
```
// ❌ Old (deprecated)
DELETE /admin/menu/products/1/modifier-groups/5

// ✅ New (recommended)
DELETE /admin/menu/products/1/detach-modifier-group
Body: { "groupId": 5 }
```

**Removal timeline:** v2.0 (Q3 2025)

---

#### Modifiers

#### 9. Get modifier list
```
GET /admin/menu/modifiers
Query: modifierGroupId?
```

#### 10. Create modifier
```
POST /admin/menu/modifiers
Body: {
  "name": "Extra Cheese",
  "price": 150,
  "modifierGroupId": 10
}
```

#### 11. Update modifier
```
PATCH /admin/menu/modifiers/:id
Body: { "price": 200 }
```

#### 12. Delete modifier
```
DELETE /admin/menu/modifiers/:id
```

#### 13. Reorder modifiers within group
```
PATCH /admin/menu/modifier-groups/:groupId/modifiers/reorder
Body: { "modifierIds": [3, 1, 2] }
```

### 🎨 UI Components

**Main Modifier Page:**
```
┌──────────────────────────────────────────┐
│ Modifier Groups          [+ Create]     │
├──────────────────────────────────────────┤
│ ☰ Pizza Size           [✏️] [🗑️] [👁️]   │
│   Required | Min: 1, Max: 1             │
│   3 modifiers                            │
└──────────────────────────────────────────┘
```

**Create Modal:**
```
┌─────────────────────────────────────────┐
│  Create Modifier Group                  │
├─────────────────────────────────────────┤
│ Name: [Pizza Size________]              │
│ [✓] Required group                      │
│ Min: [1_] Max: [1_]                     │
│                                         │
│ [Cancel] [Create]                       │
└─────────────────────────────────────────┘
```

### ✅ Validation

**Groups:**
- Name: required, max 255 chars
- `minSelection` >= 0
- `maxSelection` >= `minSelection`

**Modifiers:**
- Name: required, max 255 chars
- Price: required, min 0
- Group: must exist

### 🔄 Use Cases

**Scenario 1: Create group from scratch**
```
1. Create "Pizza Size" group
2. Add modifiers: Small (+0), Medium (+200), Large (+400)
3. Link to products
```

**Scenario 2: Reuse existing group**
```
1. Create new pizza product
2. Attach existing "Pizza Size" group
3. No need to create modifiers again
```

---

## Page: Additions

### 📍 Navigation
**Path:** `Admin Panel → Menu → Additions`
**URL:** `/admin/menu/additions`

### 🎯 Page Purpose
Manage addition groups and items for products.

### 💡 Business Logic

**Difference from modifiers:**
- Modifiers — **modify product** (size, toppings)
- Additions — **additional items** (sauces, drinks)

**Architecture:**
```
Product (Pizza Margherita)
  └── Addition: "Sauces"
      ├── Item: "Garlic Sauce" 50
      ├── Item: "BBQ Sauce" 50
      └── Item: "Cheese Sauce" 70
```

**Properties:**
- `isRequired` — must select at least one
- `isMultiple` — can select multiple
- `isCountable` — can specify quantity
- `minSelection` / `maxSelection`

### 📋 API Endpoints

#### 1. Get additions list
```
GET /admin/menu/additions
Query: productId?
```

#### 2. Create addition
```
POST /admin/menu/additions
Body: {
  "name": "Sauces",
  "productId": 101,
  "isRequired": false,
  "isMultiple": true,
  "maxSelection": 3
}
```

#### 3. Update addition
```
PATCH /admin/menu/additions/:id
Body: { "maxSelection": 5 }
```

#### 4. Delete addition
```
DELETE /admin/menu/additions/:id
```

### ✅ Validation

- `minSelection` <= `maxSelection`
- If `isRequired=true`, then `minSelection >= 1`
- If `isMultiple=false`, then `maxSelection = 1`

---

## Page: Modifier Group Templates (Super Admin Only)

### 📍 Navigation
**Path:** `Super Admin Panel → System → Templates → Modifier Groups`
**URL:** `/admin/system/templates/modifier-groups`
**Access:** Super Admin role only

### 🎯 Page Purpose
Platform administrators manage global modifier group templates that are cloned for all new tenants during registration.

### 💡 Business Logic

**Who can access:**
- Only users with `SUPER_ADMIN` role
- Regular tenants cannot see or edit templates

**Template lifecycle:**
```
1. Super Admin creates template "Size"
2. Template saved with tenant_id = NULL (platform-level)
3. New tenant registers
4. Template automatically cloned to tenant (tenant_id = 123)
5. Tenant works with their own copy
6. Template remains unchanged
```

**Important:**
- Templates are invisible to regular tenants
- Changing a template doesn't affect existing tenants
- Deleting a template doesn't affect existing tenant copies
- Templates serve as blueprints only

### 📋 API Endpoints (Super Admin)

#### 1. List all modifier group templates
```
GET /admin/system/templates/modifier-groups
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Size",
    "description": "Product size selection",
    "isRequired": false,
    "minSelection": 1,
    "maxSelection": 1,
    "sortOrder": 1,
    "isActive": true
  }
]
```

#### 2. Get template details
```
GET /admin/system/templates/modifier-groups/:id
```

#### 3. Create new template
```
POST /admin/system/templates/modifier-groups
Body: {
  "name": "Temperature",
  "description": "Hot or cold beverage",
  "isRequired": false,
  "minSelection": 1,
  "maxSelection": 1,
  "sortOrder": 2
}
```

#### 4. Update template
```
PATCH /admin/system/templates/modifier-groups/:id
Body: {
  "description": "Choose beverage temperature"
}
```

#### 5. Delete template
```
DELETE /admin/system/templates/modifier-groups/:id
```

**Note:** Deleting a template only prevents it from being cloned to NEW tenants. Existing tenants keep their copies.

#### 6. View template usage statistics
```
GET /admin/system/templates/modifier-groups/:id/usage
```

**Response:**
```json
{
  "templateId": 1,
  "templateName": "Size",
  "totalTenants": 1247,
  "totalClones": 1247
}
```

### 🎨 UI Components (Super Admin)

**Template List Page:**
```
┌────────────────────────────────────────────────┐
│ Modifier Group Templates          [+ Create]  │
├────────────────────────────────────────────────┤
│ Name        | Used By  | Active | Actions     │
├────────────────────────────────────────────────┤
│ Size        | 1,247    | ✓      | [✏️] [📊] │
│             | tenants  |        |            │
│ Temperature | 856      | ✓      | [✏️] [📊] │
│             | tenants  |        |            │
└────────────────────────────────────────────────┘

Legend:
[✏️] = Edit template
[📊] = View usage statistics
```

**Create/Edit Template Modal:**
```
┌─────────────────────────────────────────┐
│  Create Modifier Group Template        │
├─────────────────────────────────────────┤
│  Name: [Size___________________]        │
│  Description: [________________]        │
│                                         │
│  [✓] Required group                     │
│  Min selections: [1__]                  │
│  Max selections: [1__]                  │
│  Sort order: [1__]                      │
│                                         │
│  ⚠️ This will be cloned to all new     │
│     tenants during registration         │
│                                         │
│  [Cancel]  [Create Template]            │
└─────────────────────────────────────────┘
```

**Usage Statistics Page:**
```
┌─────────────────────────────────────────┐
│  Template: "Size" - Usage Statistics   │
├─────────────────────────────────────────┤
│  Total Tenants Using: 1,247             │
│  Total Clones: 1,247                    │
│                                         │
│  Timeline:                              │
│  Nov 2025: 156 new clones               │
│  Oct 2025: 142 new clones               │
│  Sep 2025: 128 new clones               │
│                                         │
│  ⚠️ Modifying this template only        │
│     affects NEW tenants, not existing   │
│                                         │
│  [Back to Templates]                    │
└─────────────────────────────────────────┘
```

### 🔄 User Flow: Super Admin Creates New Template

**Scenario:** Platform admin wants to add "Ice Level" template for beverage businesses.

**Step 1: Create Template**
```
1. Navigate to: Super Admin Panel → System → Templates
2. Click [+ Create Modifier Group Template]
3. Fill form:
   - Name: "Ice Level"
   - Description: "Choose ice amount"
   - Required: No
   - Min: 1, Max: 1
   - Sort order: 3
4. Click [Create Template]
```

**Step 2: Verify Creation**
```
✓ Template "Ice Level" created
✓ Visible in template list
✓ Usage: 0 tenants (new template)
```

**Step 3: Test with New Tenant**
```
1. Create test tenant account
2. Login as test tenant
3. Navigate to: Menu → Modifiers
4. See "Ice Level" group available (empty, no modifiers)
5. Add modifiers: "No Ice", "Light Ice", "Regular", "Extra Ice"
6. Attach to beverage products
```

**Result:**
- All future new tenants get "Ice Level" template
- Existing tenants don't get it automatically
- Test tenant successfully using the template

## Page: Menu Templates

### ⚠️ DEPRECATION NOTICE

> **WARNING**: `GET /admin/menu/templates` is **DEPRECATED** and will be removed in v2.0!
>
> **Use instead:**
> - **During onboarding:** `GET /admin/onboarding/default-products`
> - **After onboarding:** `GET /admin/menu/products/templates` *(Coming in v2.0)*

### 📍 Navigation
**Path:** `Admin Panel → Menu → Menu Templates`
**URL:** `/admin/menu/templates` *(DEPRECATED)*

### 🎯 Page Purpose
Apply ready-made menu templates for quick start.

**When to use which endpoint:**

| Scenario | Use | Status |
|----------|-----|--------|
| During onboarding | `GET /admin/onboarding/default-products` | ✅ RECOMMENDED |
| After onboarding | `GET /admin/menu/products/templates` | 🚧 Coming in v2.0 |
| Old way | `GET /admin/menu/templates` | ⚠️ DEPRECATED |

### 📋 API Endpoints

#### 1. ✅ Get templates during onboarding (RECOMMENDED)
```
GET /admin/onboarding/default-products?businessType=restaurant
```

**Response:**
```json
{
  "categories": [
    {
      "name": "Main Dishes",
      "products": [
        { "name": "Pizza Margherita", "suggestedPrice": 25000 }
      ]
    }
  ]
}
```

#### 2. ⚠️ Get all templates (DEPRECATED)
```
GET /admin/menu/templates?businessType=restaurant
```

**[DEPRECATED]** Returns same data as `/admin/onboarding/default-products`

**Migration:** Use `/admin/onboarding/default-products` now

#### 3. Apply template
```
POST /admin/onboarding/steps/menu-setup
Body: {
  "categories": [
    { "name": "Main Dishes", "products": [...] }
  ]
}
```

### 📝 Frontend Migration Guide

**Before (DEPRECATED):**
```
GET /admin/menu/templates?businessType={type}
```

**After (RECOMMENDED):**
```
GET /admin/onboarding/default-products?businessType={type}
```

Both endpoints accept `businessType` query parameter and return the same data structure.

---

## Page: Branch Overrides

### 📍 Navigation
**Path:** `Admin Panel → Menu → Branch Overrides`
**Alternative:** `Products → [Product] → "By Branches" Tab`

### 🎯 Page Purpose
Configure branch-specific prices and availability.

### 📋 API Endpoints

#### 1. Get branch overrides for product
```
GET /admin/menu/products/:id/branches
```

**Response:**
```json
[
  { "branchId": 1, "branchName": "Downtown", "price": 450, "isAvailable": true }
]
```

#### 2. Create or update branch override (upsert)
```
PUT /admin/menu/products/:id/branches/:branchId
Body: { "price": 450, "isAvailable": true }
```

**Response codes:**
- 201 Created — new override
- 200 OK — existing override updated

#### 3. Get all overrides for branch
```
GET /admin/menu/branches/:branchId/overrides
```

### ✅ Validation

- Override price: optional, min 0 if provided
- Branch: must exist
- No duplicate overrides for same product+branch

---

## Common Use Cases

### 1. Full Menu Loading with Optimization

```
GET /admin/menu/full
Query:
  - page? (default: 1)
  - limit? (default: 20, max: 100)
  - depth? (1|2|3, default: 2)
  - categoryId?
  - available?
  - branchId?
```

**Depth levels:**
- `depth=1`: Categories only
- `depth=2`: Categories + products (default)
- `depth=3`: Full tree with modifiers/additions

**Response:**
```json
{
  "categories": [...],
  "meta": {
    "total": 45,
    "page": 1,
    "totalPages": 3,
    "hasNextPage": true
  },
  "filters": { "depth": 2 }
}
```

### 2. Search Products

```
GET /admin/menu/products?q={query}&page=1&limit=20
```

Example:
```json
{
  "params": {
    "q": "pizza",
    "page": 1,
    "limit": 20
  }
}
```

### 3. Quick Availability Toggle

```
PATCH /admin/menu/products/{productId}/availability
```

Request body:
```json
{
  "isAvailable": true
}
```

### 4. Bulk Price Increase

**Step 1**: Get all products in category
```
GET /admin/menu/products?categoryId={categoryId}&limit=1000
```

**Step 2**: Extract product IDs from response and update prices
```
PATCH /admin/menu/products/bulk-price
```

Request body:
```json
{
  "productIds": [1, 2, 3, 4, 5],
  "priceChange": {
    "type": "percentage",
    "value": 10
  }
}
```

### 5. Validate Menu

```
GET /admin/menu/validate
```

Response:
```json
{
  "errors": [],
  "warnings": []
}
```

---

## 🔧 Technical Requirements

### Authentication
- All requests require JWT: `Authorization: Bearer <token>`
- On 401: refresh via `/auth/refresh`

### Error Handling

**Success:**
```json
Status: 200 OK
{ "id": 101, "name": "Cappuccino" }
```

**Validation error:**
```json
Status: 400 Bad Request
{
  "statusCode": 400,
  "message": ["name should not be empty"],
  "error": "Bad Request"
}
```

**Not found:**
```json
Status: 404 Not Found
{ "statusCode": 404, "message": "Product not found" }
```

### Optimization
- Debounce search (min 300ms)
- Cache category lists
- Lazy loading for products
- Optimistic UI updates

---

## 📚 Additional Materials

### Swagger Documentation
Available at: `http://localhost:3000/api/docs`

### Entity Relationships
```
Category
  └── Product
      ├── ModifierGroup (many-to-many)
      │   └── Modifier
      ├── Addition
      │   └── AdditionItem
      └── BranchOverride
```

### Development Priorities

**High (MVP):**
1. ✅ Categories CRUD
2. ✅ Products CRUD
3. ✅ Modifier Groups
4. ✅ Branch Overrides

**Medium:**
5. Additions
6. Menu Templates
7. Bulk operations

**Low:**
8. Import/export
9. Change history

---

## 📝 Change Log

### Version 1.2 — 2025-11-03
**Added:**
- ✅ New recommended association endpoints
- ✅ Migration guide from old to new endpoints

**Deprecated:**
- ⚠️ `POST /products/:productId/modifier-groups/:groupId` → v2.0
- ⚠️ `DELETE /products/:productId/modifier-groups/:groupId` → v2.0

### Version 1.1 — 2025-10-31
**Added:**
- ✅ Full modifier groups documentation
- ✅ UI components
- ✅ Use case scenarios

### Version 1.0 — 2025-01-24
- Initial version

---

**Current version:** 1.2
**Last update:** 2025-11-03
**Questions:** #admin-panel-dev Slack channel
