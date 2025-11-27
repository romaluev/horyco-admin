---
name: project-index
description: Quick reference to project structure, documentation locations, and key directories. Use this to understand where files are located and what's already implemented.
model: haiku
color: blue
triggers: ['code locations', 'find docs', 'find components', 'project structure']
---

## 📚 DOCUMENTATION LOCATIONS

| Location              | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| `/.claude/standards/` | Code quality standards (TypeScript, Design System, Next.js, FSD) |
| `/.claude/docs/`      | Documentation about the project and its modules                  |
| `/.claude/agents/`    | AI agent configurations (design-guardian, code-guardian, etc.)   |
| `/.claude/skills/`    | Reusable skills (this file, design-system, typescript)           |
| `/CLAUDE.md`          | Project-level instructions for AI                                |

---

## 🏗️ ARCHITECTURE (FSD)

### App Layer (`/src/app/`)

- **Pages**: Route files with `page.tsx`
- **Layouts**: `layout.tsx` for shared structure
- **API Routes**: `/api/` directory
- **Providers**: `/providers/providers.tsx` - React Query, Auth, Theme
- **Middleware**: `/middleware.ts` - Auth routing

### Widgets Layer (`/src/widgets/`)

- `branch-statistics/` - Dashboard analytics widget
- `overview/` - Analytics charts and metrics
- `ListItems/` - Reusable list filters/pagination

### Features Layer (`/src/features/`)

**Forms** (10 slices):

- `employee-form/` - Employee creation/editing
- `branch-form/` - Branch management
- `product-form/` - Product CRUD with AI
- `category-form/` - Category management
- `addition-form/` - Extras/additions
- `modifier-form/` - Modifiers
- `hall-form/` - Hall/dining area
- `table-form/` - Table management
- `branding-settings-form/` - Brand config
- `payment-settings-form/` - Payment setup

**Actions** (5 slices):

- `auth/` - Registration/login
- `branch-delete/` - Deletion confirmation
- `employee-actions/` - State transitions
- `table-qr/` - QR generation
- `table-session/` - Session management

### Entities Layer (`/src/entities/`)

**17 Business Domains**:

- `auth/` - Authentication & session
- `employee/` - Staff management
- `branch/` - Location management
- `product/` - Menu items
- `category/` - Product categories
- `addition/` - Product extras
- `modifier/` - Modifiers system
- `modifier-group/` - Grouped modifiers
- `hall/` - Dining areas
- `table/` - Table management
- `role/` - User roles
- `settings/` - App settings
- `user/` - User profiles
- `onboarding/` - Onboarding flow
- `file/` - File uploads

**Layer Structure**:

```
[layer]/[name]/
├── model/
│   ├── types.ts       (Interfaces, DTOs)
│   ├── api.ts         (API methods)
│   ├── queries.ts     (useGetX hooks)
│   ├── mutations.ts   (useCreateX hooks)
│   └── query-keys.ts  (React Query keys)
└── ui/                (Display components)
```

### Shared Layer (`/src/shared/`)

- `ui/` - **60+ UI components** (see UI Components Index)
- `lib/` - Utilities (axios, utils, format)
- `hooks/` - Reusable hooks (14 files)
- `types/` - Global TypeScript types
- `config/` - Constants and configuration

---

## 🎨 UI COMPONENTS

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

---

## 🔍 FINDING THINGS

### Need a UI component?

→ Check `/src/shared/ui/`

### Need to fetch data?

→ Check `/src/entities/[name]/model/queries.ts`

### Need a form?

→ Check `/src/features/[name]-form/`

### Need to understand architecture?

→ Read `.claude/standards/architecture.md`

### Need coding standards?

→ Read `.claude/standards/` (typescript, design-system, nextjs-react)
