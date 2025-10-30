# OshXona - Code Standards

**Next.js 15 + TypeScript + FSD**

---

## 🎯 Core Rules

1. **Named exports only** (except Next.js pages)
2. **Arrow functions** - `export const Component = () => {}`
3. **Explicit return types** on exported functions
4. **No `any`** - use `unknown` and narrow
5. **Boolean prefixes** - `isLoading`, `hasPermission`
6. **Max 50 lines** per function, 200 per file
7. **Always toast** on mutations (success + error)
8. **Public API** via `index.ts`

---

## 📁 FSD Layers
```
src/
├── app/         # Routes, providers
├── widgets/     # Page compositions
├── features/    # User actions + business logic
├── entities/    # Domain models + data (NO business logic)
└── shared/      # UI, utils, config (NO dependencies)
```

**Import Rules:**
```
app      → widgets, features, entities, shared
widgets  → features, entities, shared
features → entities, shared
entities → shared
shared   → nothing
```

❌ **FORBIDDEN:**
- Cross-entity imports
- Upward imports
- Feature-to-feature imports

---

## 🏗️ Entity Structure
```
entities/[name]/
├── index.ts
├── model/
│   ├── api.ts          # API client
│   ├── types.ts        # Interfaces, DTOs
│   ├── queries.ts      # useQuery hooks
│   ├── mutations.ts    # useMutation hooks
│   └── query-keys.ts   # Query key factory
└── ui/
    └── List.tsx        # Display components only
```

**Rules:**
- NO user interactions
- NO business logic
- Dumb UI components
- Pure data operations

---

## 🎨 Feature Structure
```
features/[name]/
├── index.ts            # Export UI only
├── model/
│   └── contract.ts    # Zod schemas
└── ui/
    └── Form.tsx       # Action components
```

**Rules:**
- NO direct API calls
- Use entity mutations/queries
- Handle validations
- Provide user feedback

---

## 📋 Naming

| Type | Format | Example |
|------|--------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase + use | `useProductForm.ts` |
| Utils | camelCase | `formatPrice.ts` |
| Types | PascalCase + I | `IProduct` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| Booleans | is/has/should | `isLoading` |
| Folders | kebab-case | `product-form/` |

---

## ✅ Checklist

- [ ] Named exports only
- [ ] Arrow functions
- [ ] Explicit return types
- [ ] No `any`
- [ ] Boolean prefixes
- [ ] Functions < 50 lines
- [ ] Files < 200 lines
- [ ] Query keys use factory
- [ ] Mutations have toasts
- [ ] Error handling complete
- [ ] FSD boundaries respected
- [ ] Public API via index.ts

---

## 📊 Limits

| Rule | Limit |
|------|-------|
| Function | 50 lines |
| File | 200 lines |
| Complexity | 10 |
| Nesting | 3 levels |
| Parameters | 4 |

---

## 🛠️ Commands
```bash
pnpm dev              # Dev
pnpm build            # Build
pnpm lint:fix         # Fix lint
pnpm format           # Format
pnpm check            # All checks
```

---

**Consistency > Cleverness**
