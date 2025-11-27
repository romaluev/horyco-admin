# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Horyco Admin** is a Next.js 15 admin panel for restaurant management, built with TypeScript, React Query, Zustand, and shadcn/ui. The project follows Feature-Sliced Design (FSD) architecture with strict TypeScript and design system compliance.

## Development Commands

### Setup
```bash
pnpm install
cp .env.example .env.local  # Configure environment variables
```

### Development
```bash
pnpm dev                    # Start dev server on port 3000
pnpm build                  # Production build
pnpm start                  # Start production server
```

### Code Quality
```bash
pnpm lint                   # Run ESLint
pnpm lint:fix               # Auto-fix ESLint issues
pnpm lint:strict            # Lint with zero warnings
pnpm format                 # Format code with Prettier
pnpm format:check           # Check formatting
pnpm type-check             # TypeScript type checking
pnpm check                  # Run all checks (type-check + lint:strict + format:check)
```

### Pre-commit Hooks
- Husky + lint-staged runs automatically on commit
- Runs `eslint --fix --max-warnings 0` and `prettier --write` on staged files

## Architecture

### Feature-Sliced Design (FSD)
The codebase follows strict FSD with 5 layers:

```
src/
├── app/          # Next.js App Router (pages, layouts, routing)
├── widgets/      # Complex UI sections (dashboard sections, lists)
├── features/     # User actions (forms, dialogs, mutations)
├── entities/     # Business models (CRUD, queries, types)
└── shared/       # Generic utilities (UI kit, hooks, lib)
```

**Dependency Flow**: `App → Widgets → Features → Entities → Shared` (downward only, no cross-imports at same level)

### Key Entities (17 total)
- **Menu**: `product`, `category`, `addition`, `modifier`, `modifier-group`, `branch-override`
- **Locations**: `branch`, `hall`, `table`
- **Staff**: `employee`, `role`, `user`, `auth`
- **System**: `settings`, `file`, `onboarding`, `analytics`

### Entity Structure Pattern
```
entities/[name]/
├── model/
│   ├── types.ts          # Interfaces, DTOs
│   ├── api.ts            # API methods (axios calls)
│   ├── queries.ts        # useGetX hooks (React Query)
│   ├── mutations.ts      # useCreateX, useUpdateX hooks
│   └── query-keys.ts     # Query key factory
└── ui/                   # Display components (cards, tables, lists)
```

### Feature Structure Pattern
```
features/[action]-[entity]/
├── model/
│   ├── contract.ts       # Zod validation schemas
│   └── use-[name].ts     # Custom hooks
└── ui/                   # Form/dialog components
```

### Path Aliases
- `@/*` → `./src/*` (all source files)
- `~/*` → `./public/*` (static assets)

## API & Data Fetching

### API Client
- Located: `src/shared/lib/axios.ts`
- Singleton axios instance with interceptors
- Auto token refresh when expiring (within 2 minutes)
- Redirects to `/auth/sign-in` on 401 errors
- Base URL from `NEXT_PUBLIC_API_URL` env variable

### React Query Pattern
All API calls use React Query (TanStack Query v5):

**Query Hook** (in `entities/[name]/model/queries.ts`):
```typescript
export const useGetProducts = (params?: IGetProductsParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
  })
}
```

**Mutation Hook** (in `entities/[name]/model/mutations.ts`):
```typescript
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: ICreateProductDto) => productApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success('Product created')
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    },
  })
}
```

**Always**:
- Use query key factory pattern (`productKeys.list()`, `productKeys.detail(id)`)
- Show toast on mutation success/error
- Invalidate queries after mutations
- Never fetch in `useEffect` - use React Query

## Forms

All forms use **React Hook Form + Zod**:
- Validation schemas in `features/[name]/model/contract.ts`
- Use `zodResolver` to connect schema to form
- All forms use shadcn/ui `FormField`, `FormItem`, `FormControl`, `FormLabel`, `FormMessage`
- Show loading states on buttons: `{isPending ? 'Saving...' : 'Save'}`
- Mobile inputs: `text-base md:text-sm` (prevents iOS zoom)

## TypeScript Standards

### Strict Configuration
- All strict flags enabled in `tsconfig.json`
- `noImplicitAny`, `noUncheckedIndexedAccess`, `strictNullChecks` enforced
- **Never use `any`** - use `unknown` and narrow with type guards
- `I` prefix for interfaces: `IProduct`, `IUser`, `ICreateProductDto`

### Type Locations
- **Global types**: `shared/types/index.ts`
- **Entity types**: `entities/[name]/model/types.ts`
- **Form schemas**: `features/[name]/model/contract.ts`
- Import with `type`: `import type { IProduct } from '@/entities/product'`

## Design System

### UI Components
All UI components in `src/shared/ui/` (60+ shadcn/ui components):
- **Never hardcode colors** - use tokens: `bg-primary`, `text-muted-foreground`, `border-border`
- **4px spacing grid** - use `gap-2`, `gap-4`, `gap-6` (never `gap-3`, `gap-5`)
- **Typography**: `text-sm` (default), `text-lg` (dialog titles), `text-3xl` (page headings)
- **Input height**: always `h-9`
- **Button heights**: `h-9` (default), `h-8` (sm), `h-10` (lg)
- **Icons**: `h-4 w-4` (default), `size-3` (badges), `h-8 w-8` (loading spinners)
- **No shadows** - use borders only
- **Mobile-first responsive**: `p-4 md:px-6`, `text-base md:text-sm`

### Loading & Error States
- **Loading**: `<BaseLoading className="py-14" />` (from `shared/ui`)
- **Error**: `<BaseError message="..." onRetry={fn} />` (from `shared/ui`)
- Never create custom loading/error components

## State Management

- **Local state**: `useState` for component-only state (search, open/closed)
- **Global state**: Zustand for cross-component state (auth, branch selection)
- **Server state**: React Query for all API data
- **Form state**: React Hook Form with Zod validation

## Authentication & Routing

### Middleware
- Protected routes: `/dashboard/*`
- Auth check via `access_token` cookie
- Auto-redirect to `/auth/sign-in` with `?redirect=` param
- Located: `src/middleware.ts`

### Auth Flow
- Registration → Onboarding wizard → Dashboard
- Token refresh handled automatically by axios interceptor
- Tokens stored in cookies: `access_token`, `refresh_token`, `token_expires_at`

## Testing

**Note**: No test framework currently configured. When adding tests:
- Place test files alongside source: `component.test.tsx`
- Test behavior, not implementation
- Mock API calls and external dependencies

## Common Patterns

### Page Component Pattern (Next.js 15)
```typescript
'use client'
import { use } from 'react'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default function ProductsPage({ searchParams }: PageProps) {
  const { page } = use(searchParams)
  const { data, isLoading, error } = useGetProducts({ page })
  
  if (isLoading) return <BaseLoading />
  if (error) return <BaseError error={error} />
  
  return <PageContainer>...</PageContainer>
}
```

### Dialog Pattern
- Controlled state: `isOpen` and `onOpenChange`
- Close on successful mutation
- Reset form on close
- Max width: `max-w-lg` (default), `max-w-2xl` (large forms)

### Data Table Pattern
- Use `useDataTable` hook from `shared/hooks`
- Always wrap in `<ScrollArea>` with horizontal scrollbar
- Empty state with `colSpan={columns.length}`

## Anti-Patterns to Avoid

- ❌ Hardcoded colors (`bg-red-500` instead of `bg-destructive`)
- ❌ Off-grid spacing (`gap-5`, `p-7`)
- ❌ Using `any` type
- ❌ Fetching in `useEffect` (use React Query)
- ❌ Index as React key (use stable IDs)
- ❌ Cross-feature imports (`features/A` → `features/B`)
- ❌ Business logic in `app/` or `shared/` layers
- ❌ Missing loading states on async buttons
- ❌ Desktop-first responsive (`px-6 md:p-4`)

## Important References

The `.claude/` directory contains detailed standards and documentation:
- `.claude/skills/core.md` - TypeScript/React rules
- `.claude/skills/design-system.md` - UI/design tokens
- `.claude/skills/project-index.md` - File organization
- `.claude/standards/architecture.md` - FSD architecture
- `.claude/standards/next.md` - Next.js 15 patterns
- `CLAUDE.md` - Project-level AI instructions

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_API_URL` - Backend API base URL

See `.env.example` for full list.
