# OshXona Admin Dashboard - Architecture Guide

## Overview

OshXona is a Next.js 15-based restaurant management dashboard built with modern React patterns and architectural best practices. The application uses **Feature Sliced Design (FSD)** architecture combined with domain-driven design principles.

**Tech Stack:**
- **Framework:** Next.js 15.3.2 with App Router
- **UI:** shadcn/ui (Radix UI + Tailwind CSS)
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query v5
- **Forms:** React Hook Form + Zod
- **Styling:** Tailwind CSS 4.0
- **Internationalization:** i18next
- **Utilities:** Axios, date-fns, Lucide Icons

---

## Architecture Pattern: Feature Sliced Design (FSD)

The codebase follows **Feature Sliced Design**, a scalable architecture pattern that organizes code by features and layers:

### Directory Structure

```
src/
├── app/                    # Next.js App Router - Pages & Routes
├── entities/               # Domain models & data layer
├── features/               # Feature modules & user interactions
├── shared/                 # Shared utilities, components, config
├── widgets/                # Complex composite components
└── middleware.ts           # Auth & routing middleware
```

---

## Layer Breakdown

### 1. **app/** - Pages & Routing (Next.js App Router)

Entry point for all routes. Follows Next.js App Router conventions.

**Structure:**
```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home (redirects to dashboard)
├── auth/
│   └── sign-in/[[...sign-in]]/
│       └── page.tsx        # Login page (Clerk/Custom auth)
├── api/                    # Server-side API routes
│   ├── expand-description/ # AI description expansion
│   └── extract-products/   # AI product extraction
├── dashboard/
│   ├── layout.tsx          # Dashboard layout with sidebar
│   ├── overview/           # Main dashboard analytics
│   ├── products/
│   │   ├── page.tsx        # Products list
│   │   └── [productId]/    # Dynamic product form
│   ├── categories/         # Category management
│   ├── branches/           # Branch management
│   ├── halls/              # Hall/area management
│   ├── employee/           # Employee management
│   ├── table/              # Table management
│   └── profile/            # User profile
└── providers/              # Provider setup
    ├── providers.tsx       # Root providers composition
    ├── react-query-provider.tsx
    ├── auth-provider.tsx
    └── kbar-provider.tsx
```

**Key Conventions:**
- Pages are minimal - they import and compose features/entities
- Use Server Components by default, `'use client'` only when needed
- Dynamic segments use `[id]` for single params, `[[...slug]]` for optional catch-alls
- API routes in `api/` folder use standard Next.js patterns

**Example Page Pattern:**
```tsx
// Minimal page that composes entities and features
export default function ProductsPage() {
  return (
    <PageContainer>
      <Heading title="Products" />
      <ProductList DeleteButton={DeleteProductButton} />
    </PageContainer>
  );
}
```

---

### 2. **entities/** - Domain Models & Data Layer

Contains domain models, API clients, and data management (NOT business logic). Each entity has 3 main folders:

**Structure per entity:**
```
entities/[entity-name]/
├── index.ts                # Public exports
├── model/                  # Data layer
│   ├── api.ts             # API client functions
│   ├── types.ts           # TypeScript interfaces
│   ├── queries.ts         # TanStack Query hooks (READ)
│   ├── mutations.ts       # TanStack Query hooks (WRITE)
│   ├── query-keys.ts      # React Query key factory
│   └── index.ts           # Barrel export
└── ui/                     # Display-only components
    ├── [entity]-list.tsx
    └── [entity]-item.tsx
```

**Example Entities:**
- `entities/product/` - Product data & display
- `entities/employee/` - Employee data & display
- `entities/auth/` - Authentication state & logic
- `entities/table/` - Table data & display
- `entities/branch/` - Branch data & display

### 2.1 **entities/[name]/model/** Pattern

#### API Layer (`api.ts`)
```tsx
// entities/product/model/api.ts
export const productAPi = {
  async getProducts(params: ApiParams): Promise<PaginatedResponse<IProduct>> {
    const response = await api.get('/pos/product', { params });
    return response.data;
  },
  
  async createProduct(data: ICreateProductDto): Promise<IProduct> {
    const response = await api.post('/pos/product', data);
    return response.data;
  }
};
```

#### Query Keys (`query-keys.ts`)
```tsx
// Organized factory for query keys (enables cache invalidation)
export const productKeys = {
  all: () => ['products'],
  byId: (id: number) => ['products', id],
  productTypes: () => ['products-types']
} as const;
```

#### Queries (`queries.ts`) - READ operations
```tsx
export const useGetAllProducts = (params?: ApiParams) => {
  return useQuery({
    queryKey: [...productKeys.all(), JSON.stringify(params)],
    queryFn: () => productAPi.getProducts(params)
  });
};
```

#### Mutations (`mutations.ts`) - WRITE operations
```tsx
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ICreateProductDto) => productAPi.createProduct(data),
    onSuccess: () => {
      // Invalidate related queries for automatic re-fetch
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      toast.success('Created!');
    }
  });
};
```

#### Types (`types.ts`)
```tsx
export interface IProduct {
  id: number;
  name: string;
  price: number;
  productTypeId: number;
  description: string;
  status: 'active' | 'archived';
  stock: number;
}
```

### 2.2 **entities/[name]/ui/** - Display Components

Simple, dumb components that only display data. No business logic.
```tsx
// entities/product/ui/product-list.tsx
export const ProductList = ({ products, DeleteButton }) => (
  <div>
    {products.data?.items.map(product => (
      <div key={product.id}>
        <h3>{product.name}</h3>
        <DeleteButton productId={product.id} />
      </div>
    ))}
  </div>
);
```

---

### 3. **features/** - Feature Modules & User Interactions

Contains **complete feature implementations** with business logic, forms, and user interactions. Features should be SELF-CONTAINED and may depend on entities.

**Structure per feature:**
```
features/[feature-name]/
├── index.ts                # Public exports (only components)
├── model/                  # Feature-specific logic
│   ├── contract.ts        # Zod schemas & DTOs
│   ├── constants.ts       # Feature constants
│   └── [other].ts         # Helper functions
├── config/                # Feature config
│   └── constants.ts
├── lib/                   # Utility functions
│   └── helpers.ts
└── ui/                    # Feature components
    └── [feature].tsx
```

**Example Features:**
- `features/product-form/` - Product CRUD forms (CreateProductForm, UpdateProductForm)
- `features/table/` - Table actions (CreateTableButton, UpdateTableButton)
- `features/employee/` - Employee management forms

### 3.1 Example: Product Form Feature

```tsx
// features/product-form/model/contract.ts - Validation schemas
export const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(0),
  description: z.string(),
  additions: z.array(additionSchema).optional().default([])
});

export type ProductFormValues = z.infer<typeof productSchema>;
```

```tsx
// features/product-form/ui/create-product-form.tsx - Feature component
export const CreateProductForm = () => {
  const { mutateAsync: createProduct } = useCreateProduct(); // Entity mutation
  const { data: productTypes } = useGetAllProductTypes();    // Entity query
  const router = useRouter();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { ... }
  });
  
  const onSubmit = async (values: ProductFormValues) => {
    await createProduct(values);
    router.push('/dashboard/products');
  };
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields using shared UI components */}
      </form>
    </FormProvider>
  );
};
```

**Key Principle:** Features EXPORT only the final user-facing components, not internal logic.

```tsx
// features/product-form/index.ts
export { CreateProductForm } from './ui/create-product-form';
export { UpdateProductForm } from './ui/update-product-form';
export { DeleteProductButton } from './ui/delete-product-button';
```

---

### 4. **shared/** - Shared Utilities, Config & Base Components

Utilities and components used across the entire application.

**Structure:**
```
shared/
├── ui/                     # Reusable UI components
│   ├── base/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── table/         # Data table components
│   │   └── ... (50+ shadcn components)
│   ├── layout/            # Layout components
│   │   ├── app-sidebar.tsx
│   │   ├── header.tsx
│   │   ├── page-container.tsx
│   │   └── ThemeToggle/
│   ├── kbar/              # Command palette
│   ├── modal/             # Modal dialogs
│   └── icons.tsx          # Icon definitions
├── lib/                    # Utility functions
│   ├── axios.ts           # Axios instance with interceptors
│   ├── utils.ts           # General utilities (cn, etc)
│   ├── font.ts            # Font configuration
│   ├── format.ts          # Formatting utilities
│   ├── parsers.ts         # URL search params parsers
│   └── data-table.ts      # Data table utilities
├── hooks/                 # Custom React hooks
│   ├── use-data-table.ts  # Advanced data table state
│   ├── use-breadcrumbs.tsx
│   ├── use-debounce.tsx
│   ├── use-mobile.tsx
│   └── ... (more hooks)
├── config/                # Configuration
│   ├── data.ts            # Navigation items, constants
│   ├── data-table.ts      # Table config
│   ├── i18n.ts            # i18n setup (empty, needs implementation)
│   ├── mock-api.ts        # Mock data
│   └── locales/           # i18n translations
│       ├── en.json
│       ├── ru.json
│       └── uz.json
├── types/                 # Global types
│   ├── index.ts           # NavItem, PaginatedResponse, ApiParams
│   ├── data-table.ts      # Data table types
│   └── env.d.ts           # Environment types
└── assets/                # Images, fonts, etc
```

#### 4.1 **shared/lib/axios.ts** - HTTP Client
```tsx
// Centralized Axios instance with auth interceptor
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: Auto-attach auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 errors
api.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    Cookies.remove('access_token');
    window.location.href = '/auth/sign-in';
  }
  return Promise.reject(error);
});
```

#### 4.2 **shared/hooks/use-data-table.ts**
Advanced hook for server-side table state management using `nuqs` for URL search params:
- Pagination (page, perPage)
- Sorting (sort)
- Filtering (column filters)
- Column visibility
- Row selection

```tsx
const { table } = useDataTable({
  columns,
  data,
  pageCount: Math.ceil(total / pageSize),
  // All state is synced to URL automatically
});
```

#### 4.3 **shared/types/index.ts**
```tsx
export interface ApiParams {
  filters?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  size: number;
}
```

---

### 5. **widgets/** - Composite UI Components

Complex, reusable UI components that combine multiple entities and features. Used for major page sections.

**Structure:**
```
widgets/
├── overview/              # Dashboard analytics widget
│   ├── components/
│   │   ├── analytics-overview.tsx
│   │   ├── analytics-metrics.tsx
│   │   ├── analytics-chart.tsx
│   │   ├── period-filter.tsx
│   │   └── recent-sales.tsx
│   └── index.ts
└── ListItems/            # Generic list widget
    └── ui/
        ├── BaseFilter.tsx
        └── BasePagination.tsx
```

**Example Widget:**
```tsx
// widgets/overview/components/analytics-overview.tsx
export function AnalyticsOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('hour');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  
  return (
    <div>
      <PeriodFilter onPeriodChange={setSelectedPeriod} />
      <AnalyticsMetrics period={selectedPeriod} />
      <AnalyticsChart metric={selectedMetric} />
      <RecentOrders />
    </div>
  );
}
```

Widgets are page-level compositions - they shouldn't be reused elsewhere. If you need reusable components, make them UI components in `shared/ui/`.

---

## State Management

### Zustand (Global Client State)
Used for **user authentication state** only.

```tsx
// entities/auth/model/store.ts
export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (phone, password) => {
    const { access_token } = await authApi.login({ phone, password });
    Cookies.set('access_token', access_token);
    set({ isAuthenticated: true });
  },
  
  logout: () => {
    Cookies.remove('access_token');
    set({ user: null, isAuthenticated: false });
  }
}));
```

**Usage:**
```tsx
const { user, login, logout } = useAuthStore();
```

### TanStack React Query (Server State)
Primary tool for managing server state - caching, synchronization, updates.

**Key Patterns:**

1. **Queries (Read):**
```tsx
const { data, isLoading, error } = useGetProducts();
```

2. **Mutations (Create/Update/Delete):**
```tsx
const { mutate: createProduct } = useCreateProduct();

mutate(data, {
  onSuccess: (result) => {
    // Invalidate related queries
    queryClient.invalidateQueries({ 
      queryKey: productKeys.all() 
    });
  }
});
```

3. **Query Key Factory:**
```tsx
const productKeys = {
  all: () => ['products'],
  byId: (id: number) => ['products', id]
};

// Always use for consistency
useQuery({
  queryKey: productKeys.byId(123),
  queryFn: () => getProduct(123)
});
```

**Why not Zustand for server state:**
- React Query handles caching, deduplication, stale state
- Automatic re-fetching on window focus
- Built-in devtools & debugging
- Mutation optimism & rollback

---

## API/Data Fetching Patterns

### 1. API Client Structure

All API calls are in `entities/[name]/model/api.ts`:

```tsx
// Single responsibility: Only API communication
export const productAPi = {
  async getProducts(params: ApiParams): Promise<PaginatedResponse<IProduct>> {
    const response = await api.get('/pos/product', { params });
    return response.data;
  },
  
  async createProduct(data: ICreateProductDto): Promise<IProduct> {
    const response = await api.post('/pos/product', data);
    return response.data;
  }
};
```

### 2. Request/Response Flow

```
Component
  ↓
React Query Hook (useQuery/useMutation)
  ↓
API Function (productAPi.getProducts)
  ↓
Axios Instance (api.get/post/put/delete)
  ↓
Backend API
  ↓
Response → Type-safe response (IProduct, etc)
```

### 3. Error Handling

**Global errors** (401, network):
```tsx
// In axios interceptor
api.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    // Redirect to login
  }
});
```

**Mutation errors** (form validation, business logic):
```tsx
const mutation = useMutation({
  mutationFn: createProduct,
  onError: (error) => {
    toast.error(error.response?.data?.message || 'Error');
  }
});
```

### 4. Pagination Pattern

```tsx
const [page, setPage] = useState(1);
const params = useMemo(() => ({ page, size: 10 }), [page]);
const { data } = useGetProducts(params);

// Response structure
interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  page: number;
  size: number;
}
```

---

## Authentication & Middleware

### 1. **middleware.ts** - Route Protection

```tsx
// src/middleware.ts
export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const pathname = req.nextUrl.pathname;
  
  // Protected routes require auth
  const isProtected = pathname.startsWith('/dashboard');
  
  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon).*)']
};
```

### 2. **AuthProvider** - Client-side Auth State

```tsx
// app/providers/auth-provider.tsx
export function AuthProvider({ children }) {
  const { me, user, isLoading } = useAuthStore();
  
  useEffect(() => {
    me(); // Fetch current user on mount
  }, []);
  
  if (isLoading) return <BaseLoading />;
  
  return children;
}
```

### 3. **Auth Store** - Authentication State (Zustand)

```tsx
// entities/auth/model/store.ts
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (phone, password) => {
    const { access_token } = await authApi.login({ phone, password });
    Cookies.set('access_token', access_token, {
      expires: 7,
      secure: true,
      sameSite: 'strict'
    });
    set({ isAuthenticated: true });
  },
  
  logout: () => {
    Cookies.remove('access_token');
    set({ user: null, isAuthenticated: false });
  },
  
  me: async () => {
    try {
      const profile = await authApi.myProfile();
      set({ user: profile });
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/auth/sign-in';
      }
    }
  }
}));
```

### 4. Auth API

```tsx
// entities/auth/model/api.ts
export const authApi = {
  login: async (credentials: AuthRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  myProfile: async () => {
    const response = await api.get<IEmployee>('/dashboard/profile');
    return response.data;
  }
};
```

### 5. Token Management

- **Storage:** HTTP-only cookies (preferred for security)
- **Attachment:** Axios request interceptor auto-adds `Authorization: Bearer {token}`
- **Refresh:** Currently basic - on 401, redirect to login
- **Expiry:** 7 days

---

## UI Component Organization

### Component Hierarchy

```
shared/ui/base/
  └─ shadcn components (Button, Dialog, Form, etc)

shared/ui/
  ├─ layout/ (AppSidebar, Header, PageContainer)
  ├─ kbar/ (Command palette)
  ├─ modal/ (Custom modals)
  └─ other shared components

entities/[name]/ui/
  └─ Display-only entity components

features/[name]/ui/
  └─ Interactive feature components

widgets/
  └─ Complex page-level compositions
```

### Button Variants

```tsx
// shadcn buttons use CVA (Class Variance Authority)
<Button variant="default" size="lg">
<Button variant="outline">
<Button variant="ghost">
<Button variant="destructive">
```

### Form Pattern (React Hook Form + Zod)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2)
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' }
  });
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
}
```

---

## Internationalization (i18next)

**Current Status:** i18n setup is minimal. Translation files exist but may not be fully integrated.

**Locale Files:**
```
src/shared/config/locales/
├── en.json      # English
├── ru.json      # Russian
└── uz.json      # Uzbek
```

**Usage (when configured):**
```tsx
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.title')}</h1>;
}
```

**To fully implement:**
1. Configure i18n in `shared/config/i18n.ts`
2. Create provider in `app/providers/`
3. Add language switcher in header
4. Ensure all UI strings use `t()` function

---

## File Organization Conventions

### Import Order
```tsx
// 1. External packages
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Absolute imports from @/
import { useGetProducts } from '@/entities/product';
import { CreateProductForm } from '@/features/product-form';
import { Button } from '@/shared/ui';

// 3. Relative imports
import styles from './component.module.css';
```

### File Naming
- **Components:** PascalCase (ProductList.tsx)
- **Utilities:** camelCase (formatDate.ts)
- **Types:** camelCase (product.types.ts)
- **Styles:** component.module.css

### Barrel Exports (index.ts)

Every folder should have an `index.ts` that exports public API:

```tsx
// entities/product/index.ts
export { ProductList } from './ui/product-list';
export { useGetAllProducts, useCreateProduct } from './model';
export type { IProduct } from './model';

// Import as:
import { ProductList, useGetAllProducts } from '@/entities/product';
```

---

## Routing Patterns

### Next.js App Router Routes

```
/                          → Root (redirects to /dashboard/overview)
/auth/sign-in              → Login page
/auth/sign-in/[[...sign-in]] → Clerk auth callback route

/dashboard                 → Protected route group
  /overview                → Main dashboard
  /products                → Product list
  /products/new            → Create product form
  /products/[productId]    → Edit product form
  /categories              → Category management
  /branches                → Branch management
  /branches/[branchId]     → Branch detail
  /employee                → Employee list
  /halls                   → Hall management
  /table                   → Table management
  /profile/[[...profile]]  → User profile (optional catch-all)
```

### Dynamic Routes

```tsx
// Single ID: /dashboard/products/[productId]
type PageProps = { params: Promise<{ productId: string }> };
export default async function Page(props: PageProps) {
  const params = await props.params;
  const id = Number(params.productId);
}

// Catch-all: /dashboard/profile/[[...slug]]
type PageProps = { params: Promise<{ slug?: string[] }> };
```

---

## Development Conventions

### Component Structure

```tsx
// ✅ Good: Feature component with proper structure
'use client';

import { useState } from 'react';
import { useCreateProduct } from '@/entities/product';
import { Button } from '@/shared/ui/base/button';

interface ProductFormProps {
  onSuccess?: () => void;
}

export function CreateProductForm({ onSuccess }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useCreateProduct();
  
  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      mutate(data, {
        onSuccess: () => {
          onSuccess?.();
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
}
```

### Query Key Patterns

```tsx
// Query keys MUST be in entity/model/query-keys.ts
export const productKeys = {
  all: () => ['products'],
  lists: () => [...productKeys.all(), 'list'],
  list: (filters?: ApiParams) => [
    ...productKeys.lists(),
    { filters }
  ],
  byId: (id: number) => ['products', id],
  productTypes: () => ['product-types']
} as const;
```

### Mutation Patterns

```tsx
// Always include proper error handling and cache invalidation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ICreateProductDto) => 
      productAPi.createProduct(data),
    onSuccess: (data) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ 
        queryKey: productKeys.all() 
      });
      toast.success('Product created');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error');
    }
  });
};
```

---

## Build & Deployment

```bash
# Development
npm run dev          # Run on http://localhost:3002

# Build
npm run build        # Production build
npm run build:prod   # Production build

# Production
npm start            # Start production server on port 3002
npm start:prod       # Alternative production start

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run lint:strict  # Strict linting (no warnings)
npm run format       # Format with Prettier
```

---

## Common Tasks & Patterns

### Add a New Entity

1. **Create structure:**
```
src/entities/[entity-name]/
├── index.ts
├── model/
│   ├── api.ts
│   ├── types.ts
│   ├── queries.ts
│   ├── mutations.ts
│   ├── query-keys.ts
│   └── index.ts
└── ui/
    ├── [entity]-list.tsx
    └── [entity]-item.tsx
```

2. **api.ts - Define API calls**
3. **types.ts - Define TypeScript interfaces**
4. **query-keys.ts - Create key factory**
5. **queries.ts - Create useQuery hooks**
6. **mutations.ts - Create useMutation hooks**
7. **ui/ - Create display components**
8. **index.ts - Export public API**

### Add a New Feature

1. **Create structure:**
```
src/features/[feature-name]/
├── index.ts
├── model/
│   ├── contract.ts (Zod schemas)
│   └── constants.ts
├── lib/
│   └── helpers.ts
└── ui/
    └── [feature].tsx
```

2. **contract.ts - Define validation schemas**
3. **ui/ - Create interactive components**
4. **Export only final components in index.ts**

### Add a New Page

1. Create route in `app/dashboard/[route]/page.tsx`
2. Import and compose entities/features
3. Keep page minimal - mostly composition

### Handle Loading & Error States

```tsx
// Use React Query's isLoading flag
const { data, isLoading, error } = useGetProducts();

if (isLoading) return <BaseLoading />;
if (error) return <BaseError />;

return <ProductList products={data} />;
```

---

## Performance Optimizations

1. **Server Components** - Use by default, minimize client-side JS
2. **React Query Caching** - Automatic cache management
3. **URL Search Params** - State persists in URL (use `nuqs`)
4. **Image Optimization** - Use Next.js `Image` component
5. **Code Splitting** - Automatic with dynamic imports

---

## Security Considerations

1. **Token Storage** - Use secure HTTP-only cookies
2. **API Interceptor** - Auto-attach Authorization header
3. **Middleware** - Protect routes before client-side render
4. **Environment Variables** - Use `.env.local` for secrets
5. **CORS** - Backend handles CORS for frontend origin
6. **Input Validation** - Zod schemas validate all form inputs

---

## Troubleshooting

### Common Issues

**1. "Cannot find module" errors**
- Ensure `@/` alias is in tsconfig.json
- Check path: `"@/*": ["./src/*"]`

**2. Query not updating after mutation**
- Always invalidate related queryKeys
- Check query key matches between hooks

**3. "Access denied" 401 errors**
- Check token is in cookies
- Verify axios interceptor adds Authorization header
- Token may have expired (refresh token logic not implemented)

**4. Form validation not working**
- Ensure Zod schema is passed to zodResolver
- Check field names match schema keys
- Verify error messages are displayed

---

## Useful Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Query:** https://tanstack.com/query/latest
- **shadcn/ui:** https://ui.shadcn.com
- **Zod:** https://zod.dev
- **Zustand:** https://github.com/pmndrs/zustand
- **Tailwind CSS:** https://tailwindcss.com

---

**Last Updated:** October 2024
**Architecture Version:** Feature Sliced Design v1.0
