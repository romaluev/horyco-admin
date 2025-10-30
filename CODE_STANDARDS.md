# Code Standards

**Next.js 15 + TypeScript + FSD**

---

## Quick Start

```bash
pnpm install
pnpm run lint        # Check violations
pnpm run format      # Auto-format
pnpm run lint:fix    # Auto-fix
pnpm run check       # Verify all
```

---

## Rules

### Naming

- Components: `ProductCard.tsx`
- Hooks: `useProductForm.ts`
- Utils: `formatPrice.ts`
- Folders: `product-management/`
- Booleans: `isLoading`, `hasPermission`
- Constants: `MAX_RETRIES`

### Exports

- Named exports ONLY: `export const Btn = () => {}`
- Exception: Next.js pages use default

### TypeScript

- NO `any` - use `unknown` + narrow
- Explicit return types: `const calc = (x: number): number => x * 2`
- Interface for objects, type for unions

### Components

```typescript
'use client' // only if needed

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import type { Product } from '@/entities/product'

interface Props {
  product: Product
}

export const Card = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  if (!product) return null
  return <div>{product.name}</div>
}
```

### React Query

```typescript
// Query keys
export const productKeys = {
  all: () => ['products'] as const,
  list: (f: F) => [...productKeys.all(), f] as const,
}

// Mutations - BOTH required
useMutation({
  mutationFn: api.create,
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: productKeys.all() })
    toast.success('Created')
  },
  onError: (e: unknown) => {
    toast.error(e instanceof Error ? e.message : 'Failed')
  },
})
```

### Errors

```typescript
try {
  await op()
} catch (error: unknown) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || 'Failed')
  } else if (error instanceof Error) {
    toast.error(error.message)
  }
}
```

### Forms

```typescript
// Schema (entity)
export const schema = z.object({
  name: z.string().min(1).max(100),
})
export type FormData = z.infer<typeof schema>

// Form (feature)
export const CreateForm = () => {
  const { mutate } = useCreate()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })
  return <Form {...form}><form onSubmit={form.handleSubmit((d) => mutate(d))} /></Form>
}
```

---

## Forbidden

### ESLint Blocks/Warns

- ❌ `any` type
- ❌ Default exports (except pages)
- ❌ Vague names: `data`, `temp`, `result`, `item`, `value`, `obj`, `arr`
- ❌ Magic numbers (except -1, 0, 1, 2)
- ❌ TODO/FIXME/HACK comments
- ❌ Missing boolean prefix
- ❌ >50 lines/function
- ❌ >200 lines/file
- ❌ >10 complexity
- ❌ >3 nesting levels

### Code Review Catches

- ❌ Mutations without toast (success + error)
- ❌ Silent errors (empty catch)
- ❌ console.log
- ❌ Excessive comments
- ❌ Commented-out code
- ❌ Generic error messages
- ❌ Complex one-liners
- ❌ Premature abstraction
- ❌ Over-typing

---

## Anti-AI Mistakes

1. **NO vague names** - ESLint blocks `data`, `temp`, `result`
2. **NO magic numbers** - Extract to constants
3. **NO TODO comments** - Implement or delete
4. **NO over-commenting** - Code should be self-explanatory
5. **NO generic errors** - Be specific: "Product creation failed: missing name"
6. **NO complex one-liners** - Split readable steps
7. **NO commented code** - Delete it
8. **NO premature abstraction** - Wait for 3+ use cases
9. **NO over-typing** - Infer when obvious
10. **NO duplication** - Extract shared logic after 3rd use

---

## FSD Structure

```
src/
├── shared/      → imports: nothing
├── entities/    → imports: shared
├── features/    → imports: shared + entities
├── widgets/     → imports: shared + entities + features
└── app/         → imports: everything
```

---

## Migration (3 weeks)

### Week 1: Critical

1. Fix `productAPi` → `productApi`
2. Standardize query keys: `[entity]Keys`
3. Add explicit return types
4. Fix vague names: `grep -rE "const (data|temp|result) =" src/`

### Week 2: Refactor

5. Split functions >50 lines
6. Split files >200 lines
7. Extract magic numbers to constants
8. Remove TODO comments

### Week 3: Polish

9. `pnpm run format && pnpm run lint:fix`
10. `pnpm run check` → must pass

---

## Pre-Commit Checklist

- [ ] Named exports
- [ ] Arrow functions
- [ ] Explicit return types
- [ ] No `any`
- [ ] Boolean prefixes
- [ ] Mutations have toasts
- [ ] <50 lines/function
- [ ] <200 lines/file
- [ ] No vague names
- [ ] No magic numbers
- [ ] No TODO/FIXME
- [ ] No commented code
- [ ] Specific errors

---

## Resources

[Next.js](https://nextjs.org) · [FSD](https://feature-sliced.design) · [React Query](https://tanstack.com/query) · [shadcn/ui](https://ui.shadcn.com)
