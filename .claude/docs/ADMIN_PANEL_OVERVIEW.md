# Admin Panel — Complete Overview for Frontend Developers

This document provides a complete understanding of the OshLab Admin Panel: architecture, navigation, user roles, and how sections connect. Use this as your starting point before diving into specific sections.

---

## 📋 Table of Contents

1. [Introduction to OshLab](#introduction-to-oshlab)
2. [System Architecture](#system-architecture)
3. [User Roles](#user-roles)
4. [Admin Panel Structure](#admin-panel-structure)
5. [Core Concepts](#core-concepts)
6. [Navigation & Workflows](#navigation--workflows)
7. [API Structure](#api-structure)
8. [Section Documentation](#section-documentation)

---

## Introduction to OshLab

**OshLab** is a **white-label B2B2C platform** for restaurant management with multi-tenant architecture.

### 🎯 What This Means

**White-label:**
- Each client gets the platform with their own branding
- Customizable design, logos, colors
- Own domain (example: `pizza-house.oshlab.uz`)

**B2B2C:**
- **B2B** — We sell the platform to restaurants (our clients)
- **B2C** — Restaurants serve their customers through our platform

**Multi-tenant:**
- One backend serves multiple restaurants
- Complete data isolation between tenants
- Scalability and resource efficiency

### 🏗️ Platform Components

```
┌────────────────────────────────────────────────────────┐
│                    OSHLAB PLATFORM                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   POS App    │  │ Admin Panel  │  │   WebApp    │ │
│  │  (Flutter)   │  │    (Web)     │  │  (Next.js)  │ │
│  │              │  │              │  │             │ │
│  │ For cashiers │  │ For managers │  │ For         │ │
│  │ and waiters  │  │ and owners   │  │ customers   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                  │        │
│         └─────────────────┼──────────────────┘        │
│                           │                           │
│                  ┌────────▼────────┐                  │
│                  │   Core API      │                  │
│                  │   (NestJS)      │                  │
│                  │                 │                  │
│                  │ - Multi-tenant  │                  │
│                  │ - DDD           │                  │
│                  │ - PostgreSQL    │                  │
│                  └─────────────────┘                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 📱 Who Uses Admin Panel?

**Target Audience:**
- 👨‍💼 **Restaurant Owners** — Strategic decisions, analytics
- 👩‍💼 **Managers** — Operational management, staff control
- 👨‍🍳 **Supervisors** — Menu, purchases, branch settings

**Main Tasks:**
- Menu management (categories, products, prices)
- Staff control (schedules, salaries, roles)
- Financial accounting (reports, cash registers, revenue)
- Branch management (settings, configurations)
- Analytics and reports (sales, dish popularity)

---

## System Architecture

### 🏛️ Domain-Driven Design (DDD)

Backend is organized by **domains** (business areas):

```
src/
├── domains/                    # Business logic (Domain Layer)
│   ├── tenant-management/      # Tenant management
│   ├── menu-management/        # Menu, products, categories
│   ├── order-management/       # Orders, shifts
│   ├── staff-management/       # Employees, roles
│   ├── customer-management/    # Customers, loyalty
│   ├── branch-management/      # Branches, tables, halls
│   ├── financial-management/   # Payments, reports
│   └── settings-management/    # System settings
│
└── applications/               # API Layer (data presentation)
    ├── pos-api/                # Endpoints for POS
    ├── admin-api/              # Endpoints for Admin Panel ← YOU ARE HERE
    ├── webapp-api/             # Endpoints for customer app
    └── telegram-api/           # Endpoints for Telegram bot
```

### 🔐 Multi-tenancy

**Each entity is tied to `tenantId`:**

```typescript
// Example: Product
{
  id: 101,
  tenantId: 5,           // ← Restaurant "Pizza House"
  name: "Margherita",
  price: 890,
  ...
}
```

**Automatic Isolation:**
- All requests are automatically filtered by current tenant
- Backend uses `AsyncLocalStorage` for request context
- Frontend doesn't need to manually add `tenantId` to each request

**How It Works:**
```
1. Frontend makes request with JWT token
2. Backend extracts tenantId from token
3. All SQL queries automatically add WHERE tenantId = X
4. Data from other restaurants is inaccessible
```

### 🌳 Branch Structure

```
Tenant (Restaurant "Pizza House")
  └── Branch ("Downtown")
      ├── Halls
      │   └── Tables
      ├── Employees
      └── Settings

  └── Branch ("Suburbs")
      └── ...
```

**Branch Overrides:**
- Each branch can override settings
- Product prices can differ
- Dish availability depends on location
- Tax, shift, and cash register settings — at branch level

---

## User Roles

### 👥 Role Hierarchy in Admin Panel

```
Owner
  ├── Full access to everything
  ├── Subscription and billing management
  └── Create new managers

Manager
  ├── Menu and staff management
  ├── View reports and analytics
  ├── Branch settings
  └── NO access to billing

Supervisor
  ├── Operational management of one branch
  ├── Shift and staff control
  └── Basic analytics

Accountant
  ├── Financial reports
  ├── View transactions
  └── Read-only (no editing)
```

### 🔒 Access Rights (PBAC)

**Permission-Based Access Control:**

| Section | Owner | Manager | Supervisor | Accountant |
|---------|-------|---------|------------|------------|
| Dashboard | ✅ All | ✅ All | ✅ Own branch | ✅ Finance |
| Menu | ✅ Full | ✅ Full | ✅ Limited | ❌ No |
| Staff | ✅ Full | ✅ Full | ✅ Own branch | ❌ No |
| Finance | ✅ Full | ✅ View | ✅ Own branch | ✅ View |
| Settings | ✅ Full | ✅ Basic | ❌ No | ❌ No |
| Billing | ✅ Full | ❌ No | ❌ No | ❌ No |

**Permission Check on Frontend:**
```typescript
// Example check
if (user.hasPermission('menu:edit')) {
  // Show "Edit" button
}

if (user.hasRole('owner', 'manager')) {
  // Show "Analytics" section
}
```

---

## Admin Panel Structure

### 🗂️ Main Menu (Sidebar)

```
┌─────────────────────────────────────┐
│  🏠 Dashboard                       │  ← Home page with metrics
├─────────────────────────────────────┤
│  📊 Analytics                       │  ← Charts, reports
│    ├── Sales                        │
│    ├── Popular dishes               │
│    └── Financial metrics            │
├─────────────────────────────────────┤
│  📋 Orders                          │  ← Order history
├─────────────────────────────────────┤
│  🍔 Menu                            │  ← Menu management
│    ├── Categories                   │
│    ├── Products                     │
│    ├── Modifiers                    │
│    ├── Additions                    │
│    ├── Menu templates               │
│    └── Branch settings              │
├─────────────────────────────────────┤
│  👥 Customers                       │  ← CRM
│    ├── Customer database            │
│    ├── Loyalty program              │
│    └── Reviews                      │
├─────────────────────────────────────┤
│  👨‍💼 Staff                           │  ← HR
│    ├── Employees                    │
│    ├── Roles and permissions        │
│    ├── Work schedules               │
│    └── Salaries                     │
├─────────────────────────────────────┤
│  🏪 Branches                        │  ← Location management
│    ├── Branch list                  │
│    ├── Halls and tables             │
│    └── Branch settings              │
├─────────────────────────────────────┤
│  💰 Finance                         │  ← Accounting
│    ├── Cash register shifts         │
│    ├── Transactions                 │
│    ├── Reports                      │
│    └── Payouts                      │
├─────────────────────────────────────┤
│  ⚙️ Settings                        │  ← Configuration
│    ├── General settings             │
│    ├── Integrations                 │
│    └── Taxes and receipts           │
├─────────────────────────────────────┤
│  💳 Subscription                    │  ← Billing (Owner only)
└─────────────────────────────────────┘
```

### 📊 Dashboard (Home Page)

**Key Metrics (KPI):**
```
┌──────────────────────────────────────────────────────┐
│  Today                        This Month             │
├──────────────────────────────────────────────────────┤
│  💰 Revenue: 1,250,000 ₽      15,890,000 ₽          │
│  📦 Orders: 145               3,450                  │
│  👥 Customers: 98             1,890                  │
│  📈 Avg Check: 8,600 ₽        4,600 ₽               │
└──────────────────────────────────────────────────────┘
```

**Charts:**
- Sales dynamics (by days/weeks/months)
- Sales distribution by category
- Dish popularity (Top 10)
- Hourly traffic

**Quick Actions:**
- Create new product
- Add employee
- View active shifts
- Open daily report

---

## Core Concepts

### 🏢 Tenant

**What it is:**
A restaurant or restaurant chain using the platform.

**Examples:**
- "Pizza House" — one restaurant
- "Coffee Time" — chain of 5 cafes
- "Sushi Market" — franchise of 15 locations

**Properties:**
- Unique `tenantId`
- Own customer database
- Independent menu
- Separate billing

### 🏪 Branch

**What it is:**
Physical restaurant location.

**Examples:**
- "Pizza House — Downtown"
- "Pizza House — Mega Mall"
- "Pizza House — Airport"

**Why it matters:**
- Branches can have different prices
- Different menu (seasonality, regional dishes)
- Own staff
- Separate analytics

### 🔄 Shift

**What it is:**
Work shift of cashier/waiter in POS.

**Lifecycle:**
```
1. Open Shift
   ├── Employee opens POS
   ├── Enters starting cash amount (opening float)
   └── POST /pos/shifts

2. Work During Shift
   ├── Takes orders
   ├── Processes payments
   └── All transactions tied to shiftId

3. Close Shift
   ├── Count cash
   ├── Reconcile with system
   ├── Report discrepancies
   └── PATCH /pos/shifts/:id/close
```

**For Admin Panel:**
- View all shifts
- Shift analytics
- Discrepancy control
- Employee reports

### 💳 Payment

**Payment Methods:**
- `cash` — Cash
- `card` — Bank card
- `payme` — Payme
- `click` — Click
- `uzum` — Uzum Bank

**Split Payment:**
```
Example: Bill for 10,000₽, split in half

Payment 1:
  ├── method: 'card'
  ├── amount: 5,000₽
  └── sequence: 1

Payment 2:
  ├── method: 'cash'
  ├── amount: 5,000₽
  └── sequence: 2
```

### 📝 Order

**Order Types:**
- `dine_in` — In-hall (at table)
- `takeaway` — To-go
- `delivery` — Delivery

**Order Sources:**
- `pos` — Created in POS by cashier
- `web` — Through WebApp
- `telegram` — Through Telegram bot
- `aggregator` — From delivery platforms (Yandex.Eats)

**Order Statuses:**
```
created
  ↓
paid
  ↓
preparing
  ↓
ready
  ↓
delivered
  ↓
completed
```

### 🎫 Receipt

**Receipt Types:**
- `sale` — Sale
- `refund` — Refund
- `void` — Void

**Formats:**
- `thermal` — Thermal printer (58mm, 80mm)
- `a4` — Laser printer
- `email` — Electronic receipt
- `sms` — SMS delivery

---

## Navigation & Workflows

### 🎯 Typical User Scenarios

#### Scenario 1: Morning Restaurant Opening (Manager)

```
1. Login to Admin Panel
   └── GET /auth/login

2. Dashboard — Check yesterday's KPI
   └── GET /admin/analytics/dashboard

3. Check readiness
   ├── Menu → Check dish availability
   │   └── GET /admin/menu/products?available=false
   ├── Staff → Who's on shift today
   │   └── GET /admin/staff/schedule?date=today
   └── Branches → Are all tables free
       └── GET /admin/branches/:id/tables

4. Adjust menu (if something unavailable)
   └── PATCH /admin/menu/products/:id/availability

5. Ready to open ✅
```

#### Scenario 2: Add New Dish (Owner/Manager)

```
1. Menu → Products → [+ Add]
   └── Opens creation form

2. Fill basic information
   ├── Name: "Caesar Salad"
   ├── Category: "Salads"
   ├── Price: 590₽
   └── POST /admin/menu/products

3. Add modifiers
   ├── Group "Portion Size"
   │   ├── Standard +0₽
   │   └── Large +150₽
   └── POST /admin/menu/modifiers

4. Add additions
   ├── Group "Sauces"
   │   ├── Caesar (free)
   │   └── Garlic +50₽
   └── POST /admin/menu/additions

5. Branch settings (optional)
   └── PATCH /admin/menu/products/:id/branches/:branchId

6. Dish available in POS ✅
```

#### Scenario 3: Weekly Report (Owner)

```
1. Analytics → Reports
   └── GET /admin/analytics/reports

2. Select period
   └── Last week (01.01 - 07.01)

3. Key metrics
   ├── Total revenue
   ├── Number of orders
   ├── Average check
   └── Growth vs previous week

4. Breakdown
   ├── By branches
   ├── By categories
   └── By employees

5. Export report
   └── [Download PDF] / [Download Excel]
```

### 🔄 Section Connections

**Menu ↔ Orders:**
```
Created new dish → Immediately available in POS → Customer orders → Appears in statistics
```

**Staff ↔ Finance:**
```
Added employee → Assigned "Cashier" role → Opens shift → Transactions tied to them → Employee report
```

**Branches ↔ Menu:**
```
Created branch → Applied menu template → Adjusted prices for branch → Branch operational
```

---

## API Structure

### 🔗 Base URL

```
Development: http://localhost:3000
Production:  https://api.oshlab.uz
```

### 🔑 Authentication

**All requests require JWT token:**

```http
GET /admin/menu/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get Token:**
```http
POST /auth/login
Content-Type: application/json

{
  "phone": "+998901234567",
  "password": "secret123"
}

Response:
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": 1,
    "tenantId": 5,
    "roles": ["owner"],
    "permissions": ["menu:edit", "staff:manage", ...]
  }
}
```

**Refresh Token:**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbG..."
}
```

### 📡 Response Format

**Success Response:**
```json
{
  "id": 101,
  "name": "Cappuccino",
  "price": 350,
  "categoryId": 5,
  ...
}
```

**List with Pagination:**
```json
{
  "data": [...],
  "total": 156,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

**Validation Error:**
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "price must be a number"
  ],
  "error": "Bad Request"
}
```

**Authorization Error:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Permission Error:**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### 🗂️ API Prefixes

```
/admin/*          — Admin Panel endpoints
/pos/*            — POS Application endpoints
/webapp/*         — WebApp/Customer endpoints
/telegram/*       — Telegram Bot endpoints
/auth/*           — Authentication (shared)
```

### 📚 Swagger Documentation

**Available at:**
```
http://localhost:3000/api/docs
```

**What's there:**
- Complete list of all endpoints
- Request parameter descriptions
- Response examples
- Try it out — test API in browser
- Validation schemas (DTOs)

---

## Section Documentation

Detailed documentation for each section:

### ✅ Available Documents

1. **[ADMIN_MENU_MANAGEMENT.md](./ADMIN_MENU_MANAGEMENT.md)** — Menu Management
   - Categories
   - Products
   - Modifiers
   - Additions
   - Menu Templates
   - Branch Overrides

2. **[ADMIN_STAFF_MANAGEMENT.md](./ADMIN_STAFF_MANAGEMENT.md)** — Staff Management
   - Employee list
   - Roles and permissions
   - Work schedules
   - Salaries and payouts

3. **[ADMIN_BRANCH_MANAGEMENT.md](./ADMIN_BRANCH_MANAGEMENT.md)** — Branch Management
   - Create branches
   - Halls and tables
   - Branch settings

4. **[ADMIN_FINANCIAL_MANAGEMENT.md](./ADMIN_FINANCIAL_MANAGEMENT.md)** — Financial Management
   - Transactions
   - Cash register shifts
   - Reports
   - Payouts

5. **[ADMIN_SETTINGS.md](./ADMIN_SETTINGS.md)** — System Settings
   - General settings
   - Integrations
   - Taxes and receipts

6. **[ADMIN_ONBOARDING_WIZARD.md](./ADMIN_ONBOARDING_WIZARD.md)** — Onboarding Wizard
   - Business signup
   - Initial setup
   - Step-by-step configuration

7. **[ADMIN_BUSINESS_SIGNUP.md](./ADMIN_BUSINESS_SIGNUP.md)** — Business Signup
   - Registration flow
   - Phone verification
   - Account creation

8. **[ADMIN_OPERATING_HOURS.md](./ADMIN_OPERATING_HOURS.md)** — Operating Hours
   - Weekly schedules
   - Holiday management
   - Today's status

9. **[ADMIN_TAX_AND_PRICING.md](./ADMIN_TAX_AND_PRICING.md)** — Tax & Pricing
   - Tax configuration
   - Service charges
   - Order calculations

10. **[ADMIN_FILE_MANAGEMENT.md](./ADMIN_FILE_MANAGEMENT.md)** — File Management
    - Image uploads
    - File variants
    - Presigned URLs

---

## 🛠️ Technical Requirements

### Frontend Stack (Recommendations)

**Framework:**
- React / Next.js (for SSR and SEO)
- TypeScript (strict typing)

**UI Libraries:**
- Ant Design / Material-UI (ready components)
- TailwindCSS (custom styling)

**State Management:**
- Zustand / Redux Toolkit
- TanStack Query (React Query) for API work

**Charts:**
- Recharts / Chart.js
- ApexCharts (interactive charts)

**Forms:**
- React Hook Form
- Zod (schema validation)

**Tables:**
- TanStack Table (React Table)
- AG Grid (for large datasets)

### Required Features

**Authentication:**
- Automatic token refresh
- Redirect to login on 401
- Save token in localStorage/cookies

**Error Handling:**
- Toast notifications
- Display validation errors
- Retry mechanism for failed requests

**UX:**
- Loading states (skeletons)
- Optimistic updates
- Debounce for search
- Infinite scroll / pagination

**Security:**
- XSS protection
- CSRF tokens
- Frontend permission checks (duplicates backend)

### Performance

**Optimizations:**
- Lazy loading routes
- Code splitting
- Component memoization
- Virtualization for long lists

**Caching:**
- React Query cache
- LocalStorage for rarely changing data
- Optimistic updates

---

## 🚀 Getting Started

### Step 1: Study Documentation

1. Read this document completely
2. Review [ADMIN_MENU_MANAGEMENT.md](./ADMIN_MENU_MANAGEMENT.md)
3. Open Swagger docs and explore API

### Step 2: Set Up Environment

1. Get API access (dev/staging)
2. Configure API client (axios/fetch)
3. Implement authentication

### Step 3: Start Simple

1. Create Login page
2. Implement Dashboard (basic metrics)
3. Build product list (Menu → Products)

### Step 4: Iterative Development

1. Implement one section completely
2. Test with real data
3. Collect feedback
4. Move to next section

---

## Glossary

| Term | Meaning |
|------|---------|
| **Tenant** | Restaurant using the platform |
| **Branch** | Restaurant location |
| **Override** | Override settings at branch level |
| **Shift** | Cashier work shift |
| **DDD** | Domain-Driven Design |
| **PBAC** | Permission-Based Access Control |
| **DTO** | Data Transfer Object |
| **KPI** | Key Performance Indicator |
