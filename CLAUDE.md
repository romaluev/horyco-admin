# OshXona - Code Standards

**Next.js 15 + TypeScript + FSD**

---
## 🎯 Core Rules

1. **Arrow functions** - `export const Component = () => {}`
2. **No `any`** - always add types
3. **Boolean prefixes** - not loading but `isLoading`, or `hasPermission`
4. **Always follow the Eslint and Prettier rules and style**
6. **Max 50 lines** per function, 200 per file, Divide the functions in separate files to keep them easy readable
7. **Always use react query for requests**, use toasts for showing status.
8. **Public API** via `index.ts`
9. **Keep comments minimal**

---

## Subagents
1. Architector - knows the fsd architector, can help structuring the codebase.
2. Code-quality-guardian - Checks the code for principles such as SOLID, DRY, KISS, Clean code. 
3. Design-system-guardian - Checks the ui for accessibility, design system and consistency and user expirience.

### Use them to validate your code or help planning before implementing new feature.

---
## 📁 FSD Layers

### App (Pages + Routing)
**Purpose:** Route endpoints + application initialization

- Next.js pages/routes (`app/` or `pages/` directory)
- Root providers, layouts, error boundaries
- Route handlers, API routes
- Page-level data fetching (Server Components)
- **Rule:** Can import from any layer below. Keep route files thin—just composition
- **Example:** `ProfilePage` composes `ProfileWidget` + `EditProfileFeature` + `UserPostsWidget`
- **Anti-pattern:** ❌ Don't put business logic here

### Widgets
**Purpose:** Complex UI sections without isolated business meaning

- Self-contained composite blocks (header, sidebar, product card grid)
- Reusable across multiple pages
- Can have internal state but not global state
- Combines features + entities + shared
- **Rule:** No widget-to-widget imports (prevents coupling)
- **Example:** `ProductCard` widget uses `AddToCartButton` (feature) + `Product.Image` (entity) + `Card` (shared)
- **When to use:** Too complex for shared UI, doesn't represent user action

### Features
**Purpose:** User-triggered actions with business value

- Interactive functionality (login, add-to-cart, search, filter)
- Forms with validation and submission
- Contains UI + business logic + API calls for that action
- Modifies application state
- **Rule:** Features are independent—can't import other features
- **Example:** `AddToCart` feature has button UI + cart logic + API call
- **Structure:** `ui/`, `model/` (state, hooks), `api/`
- **Key question:** "Can user DO something specific?" → Yes = feature

### Entities
**Purpose:** Core business domain models

- Business concepts (User, Product, Order, Review)
- Type definitions, schemas
- CRUD operations for that entity
- Entity-specific state management
- Entity display components (avatar, product preview)
- **Rule:** Entities can reference other entities (User has Orders)
- **Example:** `Product` entity has types, `getProduct()` API method, store slice, `ProductImage` component
- **Structure:** `model/` (types, store), `api/`, `ui/`
- **Not for:** Multi-entity business processes (that's features)

### Shared
**Purpose:** Generic reusable code with zero business context

- UI kit (Button, Input, Modal)—pure presentation
- Utility functions (formatDate, debounce, validation)
- API client configuration
- Constants, configs, env variables
- Generic hooks (useDebounce, useLocalStorage)
- **Rule:** Fully isolated—imports nothing from other layers
- **Example:** `Button` component, `apiClient.ts`, `formatCurrency()` util
- **Test:** If it mentions business concepts → doesn't belong here

---

## Quick Decision Tree

| Question | Layer |
|----------|-------|
| Is it a route/page? | **App** |
| Composite UI section? | **Widgets** |
| User action with logic? | **Features** |
| Business data model? | **Entities** |
| Generic reusable code? | **Shared** |

---

## Dependency Flow

```
App → Widgets → Features → Entities → Shared
```

**Golden rule:** Higher layers import from lower layers only. Never upward.

---

## Quick Example

```tsx
// app/products/[id]/page.tsx
<ProductDetailsWidget id={id} />
<AddToCartFeature productId={id} />

// widgets/product-details
<Product.Image /> + <Badge /> (shared)

// features/add-to-cart
useCart() hook + <Button /> (shared)

// entities/product
productApi.getById() + Product types

// shared/ui
<Button />, <Badge />, <Card />
```

---

## 📋 Naming

| Type       | Format          | Example             |
| ---------- | --------------- | ------------------- |
| Components | PascalCase      | `ProductCard.tsx`   |
| Hooks      | camelCase + use | `useProductForm.ts` |
| Utils      | camelCase       | `formatPrice.ts`    |
| Types      | PascalCase + I  | `IProduct`          |
| Constants  | SCREAMING_SNAKE | `MAX_RETRIES`       |
| Booleans   | is/has/should   | `isLoading`         |
| Folders    | kebab-case      | `product-form/`     |

---

## 📊 Limits

| Rule       | Limit     |
| ---------- | --------- |
| Function   | 50 lines  |
| File       | 200 lines |
| Complexity | 10        |
| Nesting    | 3 levels  |
| Parameters | 4         |

---

## 🛠️ Commands

```bash
pnpm dev              # Dev
pnpm build            # Build
pnpm lint:fix         # Fix lint
pnpm format           # Format
pnpm check            # All checks
```
