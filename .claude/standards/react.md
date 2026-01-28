# React + Vite + TanStack Router Standards

**Purpose**: Enforce consistent React, Vite, and TanStack Router patterns
**Scope**: Component structure, data fetching, routing, state management

---

## COMPONENT STRUCTURE

- **Arrow functions for all components** - `export const Component = () => {}`
- **Named exports for utilities** - `export function helper() {}`
- **Default export for route pages** - `export default function Page() {}`
- **Props interface above component** - clear contract
- **Destructure props in signature** - `({ title, onClose }: Props)` not `(props: Props)`
- **One component per file** - except small sub-components used only in that file
- **Sub-components below main** - if needed in same file, define after main component
- **Return early for loading/error** - `if (isLoading) return <Loading />` before main render
- **Conditional rendering explicit** - `length > 0`, not `length` (avoids rendering "0")
- **Fragment instead of div** - use `<></>` to avoid unnecessary DOM nodes

---

## ROUTING (TanStack Router)

### File-based Routing

Routes are defined in `/src/routes/` with file naming conventions:

| File | URL |
|------|-----|
| `routes/index.tsx` | `/` |
| `routes/auth/sign-in.tsx` | `/auth/sign-in` |
| `routes/dashboard/_layout/route.tsx` | Layout wrapper (no URL segment) |
| `routes/dashboard/_layout/overview/index.tsx` | `/dashboard/overview` |
| `routes/dashboard/_layout/branches/$branchId.tsx` | `/dashboard/branches/:branchId` |

### Route Definition Pattern

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

export const Route = createFileRoute('/dashboard/_layout/branches/$branchId')({
  component: BranchDetailPage,
})

function BranchDetailPage() {
  const { branchId } = Route.useParams()
  // ...
}
```

### Route Guards (Auth)

```typescript
export const Route = createFileRoute('/dashboard/_layout')({
  beforeLoad: ({ location }) => {
    const token = getAccessToken()
    if (!token) {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect: location.pathname },
      })
    }
  },
  component: DashboardLayout,
})
```

### Navigation

```typescript
// Link component (preferred for static links)
import { Link } from '@tanstack/react-router'
<Link to="/dashboard/branches">Branches</Link>
<Link to="/dashboard/branches/$branchId" params={{ branchId: '123' }}>View</Link>

// Programmatic navigation
import { useNavigate } from '@tanstack/react-router'
const navigate = useNavigate()
navigate({ to: '/dashboard/branches' })
navigate({ to: '/dashboard/branches/$branchId', params: { branchId: '123' } })

// Search params
export const Route = createFileRoute('/dashboard/_layout/products')({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
    search: (search.search as string) || '',
  }),
})

function ProductsPage() {
  const { page, search } = Route.useSearch()
  const navigate = useNavigate()

  const setPage = (newPage: number) => {
    navigate({ search: { page: newPage, search } })
  }
}
```

### Layouts

```typescript
// Pathless layout: routes/dashboard/_layout/route.tsx
export const Route = createFileRoute('/dashboard/_layout')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </SidebarProvider>
  )
}
```

---

## DATA FETCHING

### React Query Hooks (Primary Method)

- **Query hooks in `/entities/*/model/queries.ts`** - organized by entity
- **Mutation hooks in `/entities/*/model/mutations.ts`** - separate concerns
- **API layer in `/entities/*/model/api.ts`** - axios/graphql calls
- **Use query keys factory** - `productKeys.list(params)` pattern
- **Toast on mutation success/error** - always show feedback
- **Invalidate queries on success** - keep data fresh

### Query Pattern

```typescript
export const useGetProducts = (params?: IGetProductsParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
  })
}
```

### Mutation Pattern

```typescript
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateProductDto) => productApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success('Продукт создан')
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`)
    },
  })
}
```

### API Client

- **Use axios instance** - configured in `shared/lib/axios.ts`
- **Token interceptor** - auto-refresh on 401
- **Type responses** - `ApiResponse<T>` wrapper
- **Return `.data.data`** - unwrap response in API layer

---

## FORMS

- **React Hook Form + Zod** - always together
- **Define schema in `/model/contract.ts`** - validation schemas
- **Use `zodResolver`** - connect schema to form
- **Toast feedback** - success/error after submission
- **Disable button when pending** - `disabled={isPending}`
- **Show loading state** - spinner + text change
- **Reset form after success** - `form.reset()` or redirect
- **Use FormField wrapper** - from shadcn/ui
- **Error messages automatic** - `<FormMessage />` component

### Form Pattern

```typescript
export const CreateProductForm = () => {
  const { mutateAsync, isPending } = useCreateProduct()
  const navigate = useNavigate()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      isAvailable: true,
    },
  })

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const product = await mutateAsync(values)
      toast.success('Продукт создан')
      navigate({ to: '/dashboard/menu/products/$productId/edit', params: { productId: String(product.id) } })
    } catch {
      // Error handled in mutation hook
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Введите название" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Сохранение...' : 'Создать'}
        </Button>
      </form>
    </Form>
  )
}
```

---

## STATE MANAGEMENT

### Local State (useState)

- **Default choice** - for component-only state
- **Use for UI state** - open/closed, selected item, search input
- **Initialize with correct type** - `useState<string>('')`
- **Destructure with descriptive names** - `[search, setSearch]`

### Zustand (Global State)

- **For cross-component state** - auth, branch selection
- **Define in `/entities/*/model/store.ts`** - entity-specific stores
- **Actions in store** - `login()`, `logout()`, `setUser()`
- **Persist to localStorage** - for user preferences

### React Query (Server State)

- **For all API data** - queries and mutations
- **Not for UI state** - use useState instead
- **Cache by query keys** - automatic caching
- **Invalidate on mutations** - keep data synchronized

### When to use what

| Need | Solution |
|------|----------|
| Component-only | `useState` |
| Global/shared | Zustand |
| Server data | React Query |
| Forms | React Hook Form |

---

## ERROR & LOADING STATES

### Loading States

- **Use `<BaseLoading />`** - shared spinner component
- **Skeleton for lists** - better UX than blank page
- **Disable buttons when pending** - `disabled={isPending}`
- **Show loading text** - "Сохранение..." instead of "Сохранить"
- **Return early** - `if (isLoading) return <BaseLoading />`

### Error States

- **Use `<BaseError />`** - shared error component with retry
- **Toast for mutations** - errors in forms/actions
- **Alert for critical errors** - inline error display
- **Type errors properly** - `error: Error` not `error: any`
- **Show user-friendly messages** - not raw error text
- **Provide retry option** - `onRetry` callback

### Empty States

- **Different from errors** - empty results ≠ error
- **Show helpful message** - "Нет продуктов" not "Empty"
- **Provide action** - create button if applicable

---

## META TAGS (react-helmet-async)

```typescript
import { Helmet } from 'react-helmet-async'

function ProductsPage() {
  return (
    <>
      <Helmet>
        <title>Продукты | Horyco Admin</title>
        <meta name="description" content="Управление меню" />
      </Helmet>
      {/* page content */}
    </>
  )
}
```

---

## VERCEL SERVERLESS FUNCTIONS

API routes are in `/api/` folder (Vercel convention):

```typescript
// api/expand-description.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Handle request
    const result = await processData(req.body)
    return res.status(200).json({ data: result })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

---

## ENVIRONMENT VARIABLES

- **Vite prefix** - `VITE_` for client-accessible variables
- **Access** - `import.meta.env.VITE_API_URL`
- **Server-only** - No prefix, only in Vercel Functions
- **Type declaration** - in `src/vite-env.d.ts`

```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}
```

---

## HOOKS USAGE

### React Query Hooks

- **One hook per query** - `useGetProducts`, `useGetProductById`
- **Destructure what you need** - `{ data, isLoading, error }`
- **Rename data** - `{ data: products }` for clarity
- **Use enabled option** - conditional fetching

### Custom Hooks

- **Start with `use`** - `useDebounce`, `useAuth`
- **Return object or array** - consistent return type
- **One responsibility** - focused logic
- **Extract repeated logic** - after 3rd usage
- **Type return value** - explicit return type

### Hook Rules

- **Top level only** - no conditional hooks
- **No hooks in callbacks** - call at component level
- **Exhaustive dependencies** - trust ESLint rule
- **Stable references** - useCallback for handlers passed to memo'd children

---

## PERFORMANCE

- **React.memo sparingly** - only for expensive pure components
- **useMemo for heavy calculations** - filtering/sorting large arrays
- **useCallback for memo'd children** - when passed to React.memo components
- **Keys must be stable** - use id, not index
- **Lazy load routes** - TanStack Router handles this
- **Debounce expensive ops** - search inputs, API calls

---

## ANTI-PATTERNS (AUTO-REJECT)

- ❌ `any` type (use proper types)
- ❌ Fetching in useEffect (use React Query)
- ❌ Index as key (use stable id)
- ❌ Prop drilling 3+ levels (use context/store)
- ❌ Inline functions in JSX (creates new function every render)
- ❌ Direct DOM manipulation (use refs if needed)
- ❌ Conditional hooks (breaks rules of hooks)
- ❌ Missing error handling (always handle errors)
- ❌ Missing loading states (always show loading)
- ❌ Mutations without toast (user needs feedback)
- ❌ Forms without validation (always validate)
- ❌ No TypeScript (required everywhere)

---

## BEST PRACTICES

- **Colocate related code** - feature folder contains all related code
- **Export from index** - public API via barrel exports
- **Avoid barrel exports in shared** - hurts tree-shaking
- **One component per file** - except tiny sub-components
- **Destructure props** - easier to read, auto-completion works
- **Use fragments** - avoid unnecessary divs
- **Semantic HTML** - buttons not divs with onClick
- **Accessible** - aria labels, keyboard navigation
- **Russian UI text** - all user-facing text in Russian
- **English code** - variables, functions, types in English
- **Consistent naming** - follow project conventions
- **Clean imports** - organized: framework → external → internal → relative
- **No console.log** - use proper logging in production
- **Type everything** - no implicit any

---

**Apply every rule consistently. Prioritize user experience and code maintainability.**
