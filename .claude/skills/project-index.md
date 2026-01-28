---
name: project-index
description: Quick reference to project structure, documentation locations, and key directories. Use this to understand where files are located and what's already implemented.
model: haiku
color: blue
triggers: ['code locations', 'find docs', 'find components', 'project structure']
---

## DOCUMENTATION LOCATIONS

| Location              | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| `/.claude/standards/` | Code quality standards (TypeScript, Design System, React, FSD)   |
| `/.claude/docs/`      | Documentation about the project and its modules                  |
| `/.claude/agents/`    | AI agent configurations (design-guardian, code-guardian, etc.)   |
| `/.claude/skills/`    | Reusable skills (this file, design-system, typescript)           |
| `/CLAUDE.md`          | Project-level instructions for AI                                |

---

## TECH STACK

- **Build Tool**: Vite 6.x
- **Framework**: React 18.2.0
- **Routing**: TanStack Router (file-based)
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **State**: Zustand (global), useState (local)
- **Styling**: Tailwind CSS + shadcn/ui
- **API**: GraphQL (graphql-request)
- **Deployment**: Vercel (SPA + Serverless Functions)

---

## ARCHITECTURE (FSD)

### App Layer (`/src/app/`)

- **Legacy Pages**: Old page components (being migrated to routes)
- **Providers**: `/providers/` - React Query, Auth, Theme
- **Entry**: `/main.tsx` - App entry point
- **Root**: `/App.tsx` - Root component with RouterProvider

### Routes Layer (`/src/routes/`)

- **Purpose**: TanStack Router file-based routing
- **Root**: `__root.tsx` - Root layout with providers
- **Layouts**: `_layout.tsx` or `_layout/route.tsx` - Pathless layouts
- **Pages**: `index.tsx` - Route components
- **Dynamic**: `$paramName.tsx` - Dynamic route segments
- **Generated**: `/src/routeTree.gen.ts` - Auto-generated route tree

### Widgets Layer (`/src/widgets/`)

- `branch-statistics/` - Dashboard analytics widget
- `overview/` - Analytics charts and metrics
- `ListItems/` - Reusable list filters/pagination
- `views/` - Custom view data tables

### Features Layer (`/src/features/`)

**Organized by Domain**:

- `auth/` - Authentication features (login, registration, staff-invite)
- `dashboard/` - Dashboard features (analytics, dashboard-builder, view-builder)
- `inventory/` - Inventory features (forms, workflows)
- `menu/` - Menu features (product-form, category-form, etc.)
- `organization/` - Organization features (branch, employee, hall, table forms)

**Feature Structure**:
```
features/[domain]/[feature-name]/
├── index.ts              (Public API)
├── model/                (Business logic)
│   ├── contract.ts       (Zod schemas)
│   ├── schema.ts         (Validation)
│   └── index.ts
└── ui/                   (Components)
    ├── [dialog].tsx
    └── index.ts
```

### Entities Layer (`/src/entities/`)

**Organized by Domain**:

- `auth/` - auth, role, user
- `dashboard/` - analytics, dashboard, dashboard-widget, view
- `inventory/` - inventory-count, inventory-item, production-order, purchase-order, recipe, stock, stock-movement, supplier, warehouse, writeoff
- `menu/` - addition, branch-override, category, modifier, modifier-group, pin, product
- `onboarding/` - onboarding
- `organization/` - branch, employee, hall, operating-hours, settings, subscription, table, tax-pricing

**Entity Structure**:
```
entities/[domain]/[entity-name]/
├── index.ts              (Public API)
├── model/
│   ├── types.ts          (Interfaces, DTOs)
│   ├── api.ts            (API methods)
│   ├── queries.ts        (useGetX hooks)
│   ├── mutations.ts      (useCreateX hooks)
│   ├── query-keys.ts     (React Query keys)
│   └── index.ts
└── ui/                   (Display components)
    ├── [entity]-card.tsx
    └── index.ts
```

### Shared Layer (`/src/shared/`)

- `ui/` - **60+ UI components** (shadcn/ui based)
- `lib/` - Utilities (axios, utils, format, navigation)
- `hooks/` - Reusable hooks (14 files)
- `types/` - Global TypeScript types
- `config/` - Constants and configuration
- `api/` - GraphQL client and generated types

### API Layer (`/api/`)

- **Vercel Serverless Functions** - Replaces Next.js API routes
- `expand-description.ts` - AI product description expansion
- `extract-products.ts` - AI menu extraction from images

---

## ROUTING (TanStack Router)

### File Conventions

| File Pattern | Purpose |
|--------------|---------|
| `__root.tsx` | Root layout (providers, global UI) |
| `index.tsx` | Index route for folder |
| `$paramName.tsx` | Dynamic route segment |
| `_layout.tsx` | Pathless layout wrapper |
| `_layout/route.tsx` | Layout with nested routes |
| `route.lazy.tsx` | Code-split route component |

### Route Examples

```
/src/routes/
├── __root.tsx                              → Root layout
├── index.tsx                               → /
├── auth/
│   └── sign-in.tsx                         → /auth/sign-in
├── dashboard/
│   └── _layout/
│       ├── route.tsx                       → Dashboard layout (sidebar)
│       ├── overview/
│       │   └── index.tsx                   → /dashboard/overview
│       ├── branches/
│       │   ├── index.tsx                   → /dashboard/branches
│       │   └── $branchId.tsx               → /dashboard/branches/:branchId
│       └── inventory/
│           └── counts/
│               └── $countId.tsx            → /dashboard/inventory/counts/:countId
└── onboarding/
    └── business-info.tsx                   → /onboarding/business-info
```

### Navigation

```typescript
// Link component
import { Link } from '@tanstack/react-router'
<Link to="/dashboard/branches">Branches</Link>

// Programmatic navigation
import { useNavigate } from '@tanstack/react-router'
const navigate = useNavigate()
navigate({ to: '/dashboard/branches' })

// With params
navigate({ to: '/dashboard/branches/$branchId', params: { branchId: '123' } })

// Route params
const { branchId } = Route.useParams()

// Search params
const { page } = Route.useSearch()
```

---

## UI COMPONENTS

### Shared UI (`/src/shared/ui/`)

**Always use these instead of creating new:**

- Buttons: `Button` with variants (default, destructive, outline, ghost)
- Forms: `FormField`, `FormItem`, `FormControl`, `FormLabel`, `FormMessage`
- Inputs: `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`
- Dialogs: `Dialog`, `AlertDialog`, `Sheet`
- Cards: `Card`, `CardHeader`, `CardContent`, `CardFooter`
- Tables: `DataTable`, `Table`, `TableRow`, `TableCell`
- Loading: `BaseLoading` (spinner)
- Error: `BaseError` (error display with retry)

### Shared Hooks (`/src/shared/hooks/`)

- `use-debounce.tsx` - Debounce values
- `use-media-query.ts` - Responsive queries
- `use-form-persist.tsx` - Persist form to localStorage
- `use-data-table.ts` - Table state management
- `use-multistep-form.tsx` - Multi-step forms

### Shared Utilities (`/src/shared/lib/`)

- `axios.ts` - API client with auth
- `utils.ts` - `cn()` for className merging
- `format.ts` - `formatPrice()`, `formatDate()`
- `navigation.ts` - Navigation compatibility layer
- `auth-guard.ts` - Auth utilities for route guards

---

## FINDING THINGS

### Need a UI component?
→ Check `/src/shared/ui/`

### Need to fetch data?
→ Check `/src/entities/[domain]/[entity]/model/queries.ts`

### Need a form?
→ Check `/src/features/[domain]/[feature]-form/`

### Need to add a new route?
→ Create file in `/src/routes/` following TanStack Router conventions

### Need to understand architecture?
→ Read `.claude/standards/architecture.md`

### Need coding standards?
→ Read `.claude/standards/` (typescript, design-system, react)
