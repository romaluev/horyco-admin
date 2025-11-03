# OshLab Frontend Documentation

Complete API and workflow documentation for frontend developers building **Admin Panel** and **POS Application**.

**Version:** 2.0
**Last Updated:** 2025-01-29
**Language:** English

---

## 🎯 Quick Start

### For Admin Panel Developers

1. **Start here:** [Architecture Overview](./architecture/overview.md)
2. **Understand workflows:** [Admin Onboarding](./workflows/admin/onboarding-wizard.json) | [Menu Setup](./workflows/admin/menu-setup-flow.md)
3. **API Reference:** [Staff Management](./api-reference/admin/staff-management.md)
4. **Swagger UI:** http://localhost:3000/api/docs

### For POS Developers

1. **Start here:** [Architecture Overview](./architecture/overview.md)
2. **Legacy docs (temporary):** Check files marked with `POS_*` prefix in root `/docs/frontend/` until migration complete
3. **Swagger UI:** http://localhost:3000/api/docs

---

## 📚 Documentation Structure

### 🏗️ Architecture (Start Here)

Core concepts you must understand before building.

- **[Overview](./architecture/overview.md)** ⭐ **Read First**
  - Platform architecture
  - Multi-tenant system explained
  - Authentication flow
  - Data models and relationships
  - Permissions system (RBAC)
  - Request/response patterns
  - File upload handling

- **[Multi-Tenancy](./architecture/multi-tenancy.md)** *(Coming soon)*
  - Tenant isolation deep dive
  - Branch hierarchy
  - Context propagation

- **[Authentication](./architecture/authentication.md)** *(Coming soon)*
  - Admin Panel: Email + Password
  - POS: Manager Login + Staff PIN
  - Token management
  - Session handling

---

### 🔄 Workflows (Business Processes)

Step-by-step processes with sequence diagrams and state machines.

#### Admin Panel Workflows

- **[Onboarding Wizard](./workflows/admin/onboarding-wizard.json)** 📋 JSON Schema
  - 7-step registration process
  - Phone verification (OTP)
  - Business information
  - First branch setup
  - Menu templates
  - Operating hours
  - Payment methods
  - Staff invitations

- **[Menu Setup Flow](./workflows/admin/menu-setup-flow.md)** 📊 Mermaid Diagrams
  - Categories → Products → Modifiers → Additions
  - Branch overrides for multi-location
  - Image upload workflow
  - Publishing checklist
  - Common pitfalls

- **[Staff Management](./workflows/admin/staff-management-flow.json)** *(Coming soon)*
  - Creating employees
  - Assigning roles and permissions
  - Multi-branch access
  - Deactivation workflow

- **[Report Generation](./workflows/admin/reports-generation.json)** *(Coming soon)*
  - Sales reports
  - Shift summaries
  - Financial analytics
  - Export formats

#### POS Workflows

- **[Daily Operations](./workflows/pos/daily-operations.md)** *(Coming soon)*
  - Complete day cycle
  - Manager setup → Staff login → Shift → Orders → Close

- **[Shift Lifecycle](./workflows/pos/shift-lifecycle.json)** *(Coming soon)*
  - Open shift with cash float
  - Process orders and payments
  - Close shift with reconciliation
  - Manager approval for discrepancies

- **[Order Flow](./workflows/pos/order-flow.json)** *(Coming soon)*
  - Create order
  - Add modifiers/additions
  - Apply discounts
  - Process payment
  - Print receipt

- **[Payment Processing](./workflows/pos/payment-processing.json)** *(Coming soon)*
  - Cash
  - Card terminal
  - Split payments
  - Refunds

- **[Table Session Management](./workflows/pos/table-session.json)** *(Coming soon)*
  - Open table session
  - Add orders
  - Transfer table
  - Merge tables
  - Close session

---

### 📡 API Reference (Endpoint Documentation)

Complete endpoint documentation with request/response examples.

#### Admin Panel APIs

| Document | Endpoints | Status |
|----------|-----------|--------|
| **[Staff Management](./api-reference/admin/staff-management.md)** ✅ | 18 endpoints | Complete |
| **[Onboarding](./api-reference/admin/onboarding.md)** | 8 endpoints | *Coming soon* |
| **[Menu Management](./api-reference/admin/menu-management.md)** | 30+ endpoints | *Coming soon* |
| **[Branch Management](./api-reference/admin/branch-management.md)** | 12 endpoints | *Coming soon* |
| **[Settings](./api-reference/admin/settings.md)** | 10 endpoints | *Coming soon* |
| **[Tax & Pricing](./api-reference/admin/tax-pricing.md)** | 6 endpoints | *Coming soon* |
| **[Financial Reports](./api-reference/admin/financial-reports.md)** | 12 endpoints | *Coming soon* |
| **[Operating Hours](./api-reference/admin/operating-hours.md)** | 5 endpoints | *Coming soon* |
| **[Customers](./api-reference/admin/customers.md)** | 8 endpoints | *Coming soon* |
| **[Order History](./api-reference/admin/order-history.md)** | 6 endpoints | *Coming soon* |

#### POS APIs

| Document | Endpoints | Status |
|----------|-----------|--------|
| **[Authentication](./api-reference/pos/authentication.md)** | 5 endpoints | *Coming soon* |
| **[Shifts](./api-reference/pos/shifts.md)** | 6 endpoints | *Coming soon* |
| **[Orders](./api-reference/pos/orders.md)** | 12 endpoints | *Coming soon* |
| **[Tables](./api-reference/pos/tables.md)** | 8 endpoints | *Coming soon* |
| **[Payments](./api-reference/pos/payments.md)** | 8 endpoints | *Coming soon* |
| **[Receipts](./api-reference/pos/receipts.md)** | 7 endpoints | *Coming soon* |
| **[Customers](./api-reference/pos/customers.md)** | 6 endpoints | *Coming soon* |
| **[Menu](./api-reference/pos/menu.md)** | 4 endpoints | *Coming soon* |

---

### 📋 JSON Schemas (Request/Response Examples)

Copy-paste ready JSON examples for all endpoints.

#### Request Examples

- `requests/create-order.json`
- `requests/apply-discount.json`
- `requests/close-shift.json`
- `requests/create-product.json`
- `requests/update-branch-settings.json`

#### Response Examples

- `responses/order-response.json`
- `responses/shift-summary.json`
- `responses/menu-response.json`
- **[responses/error-standard.json](./schemas/responses/error-standard.json)** ✅ Error handling guide

---

### 🎨 UI Guidelines (Frontend Best Practices)

Coming soon:

- `ui-guidelines/pos-screen-flow.md` - POS application screen sequence
- `ui-guidelines/admin-navigation.md` - Admin Panel menu structure
- `ui-guidelines/form-validation.md` - Validation standards
- `ui-guidelines/offline-mode.md` - POS offline support

---

### 🛠️ Troubleshooting

Coming soon:

- `troubleshooting/common-errors.md` - HTTP error codes explained
- `troubleshooting/pos-faq.md` - POS developer FAQ
- `troubleshooting/admin-faq.md` - Admin developer FAQ

---

## 🗺️ Key Concepts

### Multi-Tenant Architecture

Every restaurant is a **Tenant**. All data automatically filtered by current tenant.

```
Tenant (Pizza House Brand)
  └── Branch (Downtown Location)
      ├── Employees
      ├── Menu (with branch-specific pricing)
      ├── Tables & Halls
      ├── Settings
      └── Operating Hours
```

**What this means for you:**
- ✅ Never manually add `tenantId` to requests
- ✅ Backend automatically filters all data
- ✅ Cannot access other tenants' data

**Read more:** [Architecture Overview](./architecture/overview.md#multi-tenant-architecture)

---

### Menu Structure

Hierarchical product system with customization options.

```
Category (e.g., "Pizzas")
  └── Product (e.g., "Margherita Pizza" - $12.99)
      ├── Modifier Groups (customize product)
      │   └── Modifier Items (e.g., "Large +$4.00", "Extra Cheese +$2.00")
      └── Addition Groups (suggested extras)
          └── Addition Items (e.g., "Coca Cola $2.50")
```

**Branch Overrides:**
- Downtown branch: Margherita = $14.99 (20% markup)
- Airport branch: Margherita = unavailable (seasonal)

**Read more:** [Menu Setup Flow](./workflows/admin/menu-setup-flow.md)

---

### Permission System

Format: `resource:action`

**Examples:**
- `menu:view` - View menu items
- `menu:edit` - Create/edit menu items
- `staff:manage` - Manage employees
- `reports:financial` - View financial reports

**Predefined Roles:**
- **Owner** - Full access
- **Manager** - Branch management
- **Cashier** - POS operations
- **Waiter** - Order taking

**Read more:** [Staff Management API](./api-reference/admin/staff-management.md#permission-management)

---

## 🚀 Development Workflow

### Setting Up

1. **Clone and install:**
   ```bash
   git clone https://github.com/oshlab/oshlab-api.git
   cd oshlab-api
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Configure DATABASE_*, JWT_SECRET, etc.
   ```

3. **Start development server:**
   ```bash
   npm run start:local
   ```

4. **Access Swagger docs:**
   ```
   http://localhost:3000/api/docs
   ```

---

### API Base URLs

| Environment | URL |
|-------------|-----|
| **Local** | http://localhost:3000 |
| **Development** | https://dev-api.oshlab.uz |
| **Production** | https://api.oshlab.uz |

---

### API Prefixes

| Application | Prefix | Example Endpoint |
|-------------|--------|------------------|
| **Admin Panel** | `/admin/*` | `/admin/staff/employees` |
| **POS** | `/pos/*` | `/pos/orders` |
| **Auth (Shared)** | `/auth/*` | `/auth/login` |

---

### Authentication Headers

All authenticated endpoints require:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token lifespan:**
- Access token: 15 minutes
- Refresh token: 7 days

**Auto-refresh recommended before expiry.**

---

## 📊 Standard Response Formats

### Success (200/201)

```json
{
  "id": 42,
  "name": "Margherita Pizza",
  "price": 12.99,
  "createdAt": "2025-01-29T10:00:00Z"
}
```

### Paginated List (200)

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

### Error (4xx/5xx)

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number",
      "constraint": "min"
    }
  ],
  "timestamp": "2025-01-29T10:00:00Z",
  "path": "/admin/menu/products"
}
```

**Full error handling guide:** [Error Standards](./schemas/responses/error-standard.json)

---

## 🔍 Query Parameters

All list endpoints support:

```http
GET /admin/menu/products?page=1&limit=20&categoryId=5&isActive=true&search=pizza&sortBy=createdAt&sortOrder=desc
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |
| `search` | string | Search term (name, description) |
| `sortBy` | string | Field to sort by |
| `sortOrder` | string | `asc` or `desc` |
| *entity-specific* | various | Filters like `categoryId`, `branchId`, `isActive` |

---

## 🌐 Internationalization

**Supported languages:**
- English (default)
- Russian
- Uzbek

**User language preference:**
```json
{
  "user": {
    "locale": "en" // or "ru", "uz"
  }
}
```

**Frontend responsibilities:**
- Use i18n library (`react-i18next`, `next-intl`)
- Format dates/numbers per locale
- Translate UI text (API returns data in English)

---

## 📦 File Upload

**Endpoint:** `POST /admin/files/upload`

**Request:**
```http
POST /admin/files/upload
Content-Type: multipart/form-data

file: [binary data]
folder: "products"
```

**Response:**
```json
{
  "url": "https://cdn.oshlab.uz/tenant-42/products/uuid-v4.jpg",
  "filename": "uuid-v4.jpg",
  "size": 245678,
  "mimeType": "image/jpeg"
}
```

**Constraints:**
- Max size: **5 MB**
- Formats: `jpg`, `jpeg`, `png`, `webp`
- Auto-resize to optimal dimensions

---

## ⚠️ Common Pitfalls

| Issue | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | Token expired or invalid | Refresh token or re-login |
| **403 Forbidden** | Missing permission | Check user role/permissions |
| **404 Not Found** | Invalid ID or wrong endpoint | Verify resource exists |
| **409 Conflict** | Duplicate unique field | Use different value (e.g., phone, email) |
| **422 Business Rule Error** | Violates business logic | Read `error.details` for specific issue |
| **Products not showing in POS** | `isActive: false` | Activate both category and product |
| **Modifiers not appearing** | Not linked to product | Use `/products/:id/modifiers` endpoint |

---

## 🎓 Learning Path

### Week 1: Foundation
1. Read [Architecture Overview](./architecture/overview.md)
2. Understand multi-tenancy concept
3. Set up local development environment
4. Explore Swagger UI

### Week 2: Admin Panel Development
1. Study [Onboarding Workflow](./workflows/admin/onboarding-wizard.json)
2. Implement login + dashboard
3. Build [Menu Management](./workflows/admin/menu-setup-flow.md)
4. Implement [Staff Management](./api-reference/admin/staff-management.md)

### Week 3: POS Development
1. Study POS authentication flow (legacy docs)
2. Implement shift management
3. Build order creation
4. Integrate payment processing

### Week 4: Advanced Features
1. Branch overrides
2. Reporting and analytics
3. Offline mode (POS)
4. Performance optimization

---

## 🔗 External Resources

- **[Swagger API Documentation](http://localhost:3000/api/docs)** - Interactive API explorer
- **[Backend CLAUDE.md](../../CLAUDE.md)** - Backend architecture and DDD patterns
- **[Development Roadmap](../../DEVELOPMENT_ROADMAP.md)** - Project roadmap and priorities

---

## 📞 Support

**Questions about documentation:**
- Slack: `#frontend-docs`
- Email: dev@oshlab.uz

**API issues:**
- Slack: `#backend-api`
- GitHub Issues: `documentation` tag

**Bugs:**
- GitHub Issues with reproduction steps

---

## 📅 Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-30 | 2.1 | Removed TypeScript/Flutter code examples (JSON-only API docs), cleaned up structure |
| 2025-01-29 | 2.0 | Complete restructure: English-only, JSON workflows, Mermaid diagrams |
| 2025-01-28 | 1.2 | Added POS Authentication documentation |
| 2025-01-24 | 1.1 | Added Admin Menu Management |
| 2025-01-24 | 1.0 | Initial documentation structure |

---

## 🛣️ Roadmap

### ✅ Completed
- [x] Architecture overview
- [x] Error handling standards
- [x] Admin onboarding workflow (JSON)
- [x] Admin menu setup workflow (Mermaid)
- [x] Staff management API reference

### 🚧 In Progress (Week of 2025-01-29)
- [ ] Admin settings API
- [ ] Admin branch management API
- [ ] POS shift lifecycle workflow
- [ ] POS order flow workflow

### 📋 Planned (Next 2 Weeks)
- [ ] POS authentication API
- [ ] POS payment processing API
- [ ] Admin financial reports API
- [ ] UI guidelines
- [ ] Troubleshooting guides
- [ ] Complete migration of legacy docs

---

## 🎯 Documentation Coverage

| Application | Coverage | Status |
|-------------|----------|--------|
| **Admin Panel** | 65% | 🟡 In Progress |
| **POS Application** | 45% | 🟡 In Progress |

**Target:** 95%+ by mid-February 2025

---

## 💡 Contributing

### Report Issues

Found outdated info or errors?
1. Create GitHub Issue with `documentation` tag
2. Include: file path, what's wrong, suggested fix

### Suggest Improvements

Have ideas for better documentation?
1. Open GitHub Discussion
2. Or PR directly with changes

### Update Documentation

When adding new endpoints:
1. Update relevant API reference file
2. Add workflow diagram if complex
3. Include request/response examples
4. Update this README if needed

---

**Happy Coding! 🚀**

**OshLab Platform** — Making every restaurant digital-first.

