# FSD Architecture Standards

**Purpose**: Enforce Feature-Sliced Design principles
**Scope**: Project structure, layer organization, dependencies

---

## LAYERS (5 total)

### 1. APP (Pages + Routing)

- **Purpose**: Next.js pages, layouts, routing logic
- **Contains**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, API routes
- **Can import**: All lower layers (widgets, features, entities, shared)
- **Rules**:
  - Thin composition layer - no business logic
  - Metadata defined here
  - Middleware for auth
  - Providers wrap here

### 2. WIDGETS (Complex UI Sections)

- **Purpose**: Reusable composite UI blocks without business meaning
- **Contains**: Dashboard sections, statistics cards, complex lists
- **Can import**: Features, entities, shared
- **Cannot import**: Other widgets, app
- **Rules**:
  - Self-contained UI composition
  - No widget-to-widget dependencies
  - Can use entity queries
  - No business logic

### 3. FEATURES (User Actions)

- **Purpose**: Interactive functionality users can trigger
- **Contains**: Forms, dialogs, actions, workflows
- **Can import**: Entities, shared
- **Cannot import**: Other features, widgets, app
- **Rules**:
  - One user action per feature
  - Independent from other features
  - Contains UI + validation + submission logic
  - Uses entity mutations/queries

### 4. ENTITIES (Business Models)

- **Purpose**: Core domain concepts with CRUD operations
- **Contains**: API methods, queries, mutations, types, display components
- **Can import**: Other entities (relationships), shared
- **Cannot import**: Features, widgets, app
- **Rules**:
  - One business concept per entity
  - Complete CRUD operations
  - Can reference related entities
  - Display components only (no forms)

### 5. SHARED (Generic Code)

- **Purpose**: Reusable code with zero business context
- **Contains**: UI kit, utilities, hooks, types, API client
- **Can import**: Nothing (isolated)
- **Cannot import**: Any layer above
- **Rules**:
  - No business logic
  - Generic and reusable
  - No mentions of domain concepts

---

## DEPENDENCY FLOW

```
App → Widgets → Features → Entities → Shared
```

### Rules:

- **Downward only** - layers import from layers below, never upward
- **Skip levels allowed** - can skip intermediate layers (app → entities)
- **Same level forbidden** - features cannot import other features
- **Shared isolated** - shared imports nothing

### Allowed:

- ✓ Feature → Entity (forms use entity mutations)
- ✓ Feature → Shared (use UI components)
- ✓ Entity → Entity (relationships)
- ✓ Page → Feature (compose dialogs)
- ✓ Page → Entity (use queries)

### Forbidden:

- ✗ Feature → Feature (breaks independence)
- ✗ Entity → Feature (breaks separation)
- ✗ Shared → Any higher layer
- ✗ Widget → Widget (breaks isolation)

### Exception:

- Entity UI can import feature actions for buttons (delete, edit dialogs in table rows)
- Justification: Avoids duplicating dialogs everywhere

---

## SLICE STRUCTURE

### Feature Slice

```
features/[feature-name]/
├── index.ts              (Public API - UI exports only)
├── model/                (Business logic)
│   ├── contract.ts       (Zod schemas, types)
│   ├── use-[name].ts     (Custom hooks)
│   └── index.ts
├── lib/                  (Utilities - optional)
│   └── helpers.ts
├── config/               (Constants - optional)
│   └── constants.ts
└── ui/                   (Components)
    ├── [main-dialog].tsx
    ├── [form-step-1].tsx
    ├── [form-step-2].tsx
    └── index.ts
```

### Entity Slice

```
entities/[entity-name]/
├── index.ts              (Public API - exports everything)
├── model/                (Data layer)
│   ├── types.ts          (Interfaces, DTOs)
│   ├── api.ts            (API methods)
│   ├── queries.ts        (useGetX hooks)
│   ├── mutations.ts      (useCreateX, useUpdateX hooks)
│   ├── query-keys.ts     (React Query keys factory)
│   ├── [name]-store.ts   (Zustand store - optional)
│   └── index.ts
└── ui/                   (Display components)
    ├── [entity]-card.tsx
    ├── [entity]-list.tsx
    ├── [entity]-table.tsx
    └── index.ts
```

### Widget Slice

```
widgets/[widget-name]/
├── index.ts              (Public API - component exports)
├── ui/                   (Components)
│   ├── [widget-main].tsx
│   ├── [sub-component-1].tsx
│   ├── [sub-component-2].tsx
│   └── index.ts
└── lib/                  (Widget utilities - optional)
    └── helpers.ts
```

### Shared Structure

```
shared/
├── ui/                   (UI components)
│   ├── base/             (Shadcn components)
│   ├── layout/           (Layout components)
│   └── index.ts          (Aggregated exports)
├── lib/                  (Utilities)
│   ├── axios.ts          (API client)
│   ├── utils.ts          (Helpers)
│   └── format.ts         (Formatters)
├── hooks/                (Generic hooks)
│   ├── use-debounce.tsx
│   └── use-media-query.ts
├── types/                (Global types)
│   └── index.ts
└── config/               (Constants)
    └── data.ts
```

---

## SEGMENTS (Internal Organization)

### Model Segment

- **Purpose**: Business logic, data management, state
- **Contains**: types, schemas, hooks, stores, API
- **Files**:
  - `types.ts` - interfaces, DTOs
  - `contract.ts` - Zod schemas (features only)
  - `api.ts` - API methods (entities only)
  - `queries.ts` - React Query hooks
  - `mutations.ts` - React Query mutations
  - `query-keys.ts` - Query key factory
  - `store.ts` - Zustand store (if needed)

### UI Segment

- **Purpose**: Visual components
- **Contains**: React components for display/interaction
- **Rules**:
  - Import from local `model/`
  - Import from entities (queries, types)
  - Import from shared (UI, hooks)
  - No cross-feature imports

### Lib Segment (Optional)

- **Purpose**: Slice-specific utilities
- **Contains**: Helpers, formatters, calculators
- **When**: Logic used multiple times within slice

### Config Segment (Optional)

- **Purpose**: Slice constants
- **Contains**: Default values, options, enums
- **When**: Hardcoded data needed in multiple places

---

## PUBLIC API (index.ts)

- The access point to internal logic, used in all layers.

---

## NAMING CONVENTIONS

### Slices

- **Format**: kebab-case
- **Features**: `[action]-[entity]` or `[action]-form`
  - `employee-form`, `branch-delete`, `product-form`
- **Entities**: `[domain-concept]`
  - `product`, `employee`, `branch`, `category`
- **Widgets**: `[section-name]`
  - `branch-statistics`, `overview`, `list-items`

### Files

- **Components**: PascalCase - `CreateProductDialog.tsx`
- **Hooks**: camelCase - `use-employee-form.ts`
- **Types**: camelCase - `types.ts`, `contract.ts`
- **Utils**: camelCase - `helpers.ts`, `format.ts`
- **Index**: always `index.ts`

### Exports

- **Components**: PascalCase - `export const ProductCard`
- **Hooks**: camelCase - `export const useGetProducts`
- **Types**: PascalCase with `I` prefix - `export interface IProduct`
- **Constants**: SCREAMING_SNAKE_CASE - `export const MAX_ITEMS = 20`

---

## TYPE SHARING

### Hierarchy

```
shared/types/
  └── index.ts           (Global: NavItem, PaginationParams)

entities/[entity]/model/types.ts
  └── Domain types       (IProduct, ICreateProductDto)

features/[feature]/model/contract.ts
  └── Form schemas       (Zod schemas + inferred types)
```

### Rules

- **Global types** in `shared/types/` - pagination, navigation, generic
- **Entity types** in entity `model/types.ts` - domain models, DTOs
- **Feature types** in feature `model/contract.ts` - form validation types
- **Never duplicate** - import from single source
- **Export with `type`** - `export type { IProduct }`

---

## CROSS-CUTTING CONCERNS

### API Client

- **Location**: `shared/lib/axios.ts`
- **Pattern**: Singleton Axios instance with interceptors
- **Usage**: Import in entity API layers

### Constants

- **Global**: `shared/config/data.ts`
- **Business enums**: `shared/config/business-types.ts`
- **Feature-specific**: `features/[feature]/config/constants.ts`

### Utilities

- **Generic**: `shared/lib/utils.ts` - `cn()`, `formatBytes()`
- **Formatting**: `shared/lib/format.ts` - `formatPrice()`, `formatDate()`
- **Feature-specific**: `features/[feature]/lib/` - when used only in that feature

### Hooks

- **Generic**: `shared/hooks/` - `useDebounce`, `useMediaQuery`
- **Entity**: `entities/[entity]/model/queries.ts` - `useGetProducts`
- **Feature**: `features/[feature]/model/` - `useEmployeeForm`

---

## ANTI-PATTERNS (AUTO-REJECT)

- ❌ Upward imports (entity → feature, shared → entity)
- ❌ Cross-feature imports (feature A → feature B)
- ❌ Widget-to-widget imports
- ❌ Business logic in app layer
- ❌ Business logic in shared layer
- ❌ Barrel exports in shared (hurts tree-shaking)
- ❌ Missing public API (no index.ts)
- ❌ Deep nesting (>4 levels in slice)
- ❌ God slices (>20 files in one slice)
- ❌ Mixed concerns (UI + API in same file)
- ❌ Missing query keys factory
- ❌ Direct API calls in features (use entity queries)
- ❌ Forms in entities (belongs in features)
- ❌ Direct mutations in pages (use features)

---

## BEST PRACTICES

- **Colocate related code** - keep slice files together
- **Small slices** - split when >15 files
- **Public API mandatory** - every slice has index.ts
- **Query keys factory** - always use for React Query
- **Toast on mutations** - always show user feedback
- **Invalidate queries** - keep data fresh after mutations
- **Type everything** - no implicit any
- **Validation with Zod** - schema-first forms
- **Reusable UI in shared** - extract after 3rd usage
- **Entity for CRUD** - complete operations per entity
- **Feature for actions** - one user action per feature
- **Widget for sections** - complex composite UI
- **Test boundaries** - respect layer limits
- **Document exceptions** - justify any violations
- **Consistent naming** - follow conventions

---

**Maintain strict FSD compliance. Architecture enables scalability and maintainability.**
