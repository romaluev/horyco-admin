# Next.js/React Standards

**Purpose**: Enforce consistent Next.js 15 and React patterns
**Scope**: Component structure, data fetching, routing, server/client components

---

## SERVER VS CLIENT COMPONENTS

- **Default to Server Components** - all components are server by default in App Router
- **Use `'use client'` only when needed** - interactivity, hooks, event listeners, browser APIs
- **Server for data fetching** - fetch in server components, no loading states needed
- **Client for interactivity** - forms, buttons with onClick, useState/useEffect
- **Don't fetch in client components** - use React Query hooks instead
- **Keep client boundary minimal** - wrap only interactive parts, not whole pages
- **No useState in server components** - will error, use client component
- **Async server components allowed** - can be async for data fetching

### When to use 'use client':

- State management (`useState`, `useReducer`)
- Effects (`useEffect`, `useLayoutEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`)
- Custom hooks
- React Context consumers
- Third-party libraries requiring client (React Query, Zustand)

### When NOT to use 'use client':

- Layouts
- Static pages
- Data fetching
- Metadata generation
- Initial data loading

---

## COMPONENT STRUCTURE

- **Arrow functions for all components** - `export const Component = () => {}`
- **Named exports for utilities** - `export function helper() {}`
- **Default export for pages** - `export default function Page() {}`
- **Props interface above component** - clear contract
- **Destructure props in signature** - `({ title, onClose }: Props)` not `(props: Props)`
- **One component per file** - except small sub-components used only in that file
- **Sub-components below main** - if needed in same file, define after main component
- **Return early for loading/error** - `if (isLoading) return <Loading />` before main render
- **Conditional rendering explicit** - `length > 0`, not `length` (avoids rendering "0")
- **Fragment instead of div** - use `<></>` to avoid unnecessary DOM nodes

---

## PAGE COMPONENTS (app/\*\*/page.tsx)

- **Server component by default** - unless needs interactivity
- **Use `'use client'` if using hooks** - useState, React Query hooks
- **Export metadata separately** - `export const metadata = { title: '...' }`
- **Handle params with `use()`** - for dynamic routes in Next.js 15
- **Return PageContainer wrapper** - consistent layout
- **Early returns for states** - loading → error → empty → success
- **Define interfaces above component** - clear props contract

### Pattern:

```typescript
'use client'

interface ProductsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page } = use(searchParams)
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useGetProducts({ page, search })

  if (isLoading) return <BaseLoading />
  if (error) return <ErrorDisplay error={error} />
  if (!data?.length) return <EmptyState />

  return (
    <PageContainer>
      <PageHeader />
      <SearchBar value={search} onChange={setSearch} />
      <DataTable data={data} />
    </PageContainer>
  )
}
```

---

## LAYOUTS (app/\*\*/layout.tsx)

- **Always server components** - no 'use client'
- **Accept children prop** - `{ children }: { children: React.ReactNode }`
- **Async allowed** - can fetch data, access cookies
- **Export metadata** - page title, description
- **No hooks allowed** - server component
- **Persist state via cookies** - for sidebar, theme, etc.
- **Wrap providers here** - client providers in separate component

---

## DATA FETCHING

### React Query Hooks (Client)

- **Query hooks in `/entities/*/model/queries.ts`** - organized by entity
- **Mutation hooks in `/entities/*/model/mutations.ts`** - separate concerns
- **API layer in `/entities/*/model/api.ts`** - axios calls
- **Use query keys factory** - `settingsKeys.payments()` pattern
- **Toast on mutation success/error** - always show feedback
- **Invalidate queries on success** - keep data fresh
- **Use `queryClient.invalidateQueries`** - not refetch

### Query Pattern:

```typescript
export const useGetProducts = (params?: IGetProductsParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.getProducts(params),
  })
}
```

### Mutation Pattern:

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

### API Client:

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

### Form Pattern:

```typescript
export const CreateProductForm = () => {
  const { mutateAsync, isPending } = useCreateProduct()
  const router = useRouter()

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
      router.push(`/dashboard/menu/products/${product.id}/edit`)
    } catch (error) {
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
- **Initialize with correct type** - `useState<string>('')` not `useState('')`
- **Destructure with descriptive names** - `[search, setSearch]` not `[s, setS]`

### Zustand (Global State)

- **For cross-component state** - auth, branch selection
- **Define in `/entities/*/model/store.ts`** - entity-specific stores
- **Actions in store** - `login()`, `logout()`, `setUser()`
- **Persist to localStorage** - for user preferences
- **Initialize from storage** - on mount

### React Query (Server State)

- **For all API data** - queries and mutations
- **Not for UI state** - use useState instead
- **Cache by query keys** - automatic caching
- **Invalidate on mutations** - keep data synchronized

### When to use what:

- Local state → component-only (search, open/closed)
- Zustand → global state (auth, selected branch)
- React Query → server data (products, users, settings)
- Context → rare (theme, deep prop drilling)

---

## ROUTING & NAVIGATION

### File-based Routing

- **Folders define routes** - `/app/dashboard/products` → `/dashboard/products`
- **page.tsx for pages** - entry point for route
- **layout.tsx for layouts** - wrap multiple pages
- **loading.tsx for loading** - automatic loading UI
- **error.tsx for errors** - error boundary per route
- **not-found.tsx for 404** - custom not found page

### Dynamic Routes

- **Folders with brackets** - `[id]` for dynamic segments
- **Access via params** - `use(params)` in Next.js 15
- **Parse to number** - `parseInt(params.id)` when needed

### Navigation

- **Use Next Link** - for internal navigation
- **Use useRouter** - for programmatic navigation
- **Prefetch by default** - Link prefetches on hover
- **Push vs replace** - push for history, replace to avoid

### Middleware

- **Auth check** - redirect unauthenticated users
- **Token from cookies** - access via `req.cookies`
- **Protected routes array** - check pathname against list
- **Preserve redirect URL** - `?redirect=` query param

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
- **Use EmptyState component** - consistent design

---

## HOOKS USAGE

### React Query Hooks

- **One hook per query** - `useGetProducts`, `useGetProductById`
- **Destructure what you need** - `{ data, isLoading, error }`
- **Rename data** - `{ data: products }` for clarity
- **Use enabled option** - conditional fetching
- **Dependent queries** - chain with enabled

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

## METADATA & SEO

- **Export metadata from page** - separate export
- **Static metadata for simple pages** - `export const metadata = {}`
- **Dynamic metadata for complex** - `export async function generateMetadata()`
- **Title for every page** - descriptive, includes app name
- **Description when needed** - for important pages
- **Use template** - root layout provides template

---

## API ROUTES (app/api/\*\*/route.ts)

- **Named exports** - `export async function GET()`, `POST()`, etc.
- **Type request** - `NextRequest` type
- **Type response data** - return typed JSON
- **Use NextResponse** - for JSON responses
- **Try/catch errors** - return 500 on error
- **Validate input** - check body, params, query
- **Status codes** - 200, 400, 401, 404, 500
- **No 'use client'** - server only

---

## COMPOSITION PATTERNS

### Component Composition

- **Break into sub-components** - when >50 lines
- **Pass data down** - props drilling for 1-2 levels
- **Use context for 3+** - avoid deep drilling
- **Render props rare** - prefer composition
- **Children pattern** - flexible, reusable

### Dialog/Modal Pattern

- **Controlled state** - `isOpen` and `onOpenChange`
- **Optional trigger prop** - custom trigger element
- **Close on success** - after mutation completes
- **Reset form on close** - clean state

### List/Detail Pattern

- **List page** - loads all items
- **Click navigates** - router.push to detail
- **Detail page** - loads single item
- **Back button** - navigate back to list

---

## CONDITIONAL RENDERING

- **Early return** - for loading, error, null states
- **Ternary for inline** - simple true/false
- **Logical AND** - `condition && <Component />`
- **Explicit boolean** - `length > 0` not `length`
- **Null over empty fragment** - `return null` not `return <></>`
- **Switch rare** - prefer if/else or lookup object

---

## PERFORMANCE

- **React.memo sparingly** - only for expensive pure components
- **useMemo for heavy calculations** - filtering/sorting large arrays
- **useCallback for memo'd children** - when passed to React.memo components
- **Keys must be stable** - use id, not index
- **Lazy load routes** - code splitting at route level
- **Optimize images** - Next Image with sizes prop
- **Debounce expensive ops** - search inputs, API calls

---

## ANTI-PATTERNS (AUTO-REJECT)

- ❌ `'use client'` in every file (only when needed)
- ❌ Data fetching in client components (use React Query)
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
