---
name: core
description: Critical TypeScript/React rules (quick reference)
model: haiku
triggers: ['ts rules', 'best practices', 'typescript', 'clean code']
---

# Core Rules (Quick Reference)

Critical rules only. Full details: `.claude/standards/react.md`

---

## TYPE SAFETY

- **NO `any`** → use `unknown` + type guards
- **Explicit arrays** → `const items: string[] = []`
- **Handle null** → use `?.` and `??`
- **Import types** → `import type { X }`
- **Prefer interface** → over type for objects
- **I prefix** → `IProduct`, `IUser` (project convention)

---

## NAMING

| Type       | Pattern             | Example                       |
| ---------- | ------------------- | ----------------------------- |
| Booleans   | `is/has/can` prefix | `isLoading`, `hasError`       |
| Handlers   | `handle` prefix     | `handleClick`, `handleSubmit` |
| Constants  | SCREAMING_SNAKE     | `MAX_RETRIES`, `API_URL`      |
| Components | PascalCase          | `ProductCard`                 |
| Hooks      | `use` prefix        | `useProducts`                 |

---

## CODE SIZE LIMITS

- Functions: **50 lines max** (ideal <30)
- Components: **200 lines max** (ideal <150)
- Files: **300 lines max**
- Parameters: **4 max** (use options object)

---

## REACT PATTERNS

- **No inline JSX functions** → extract handlers
- **Never index as key** → use stable IDs
- **Explicit booleans** → `length > 0`, not `length`
- **Destructure props** → `({ title }: Props)`
- **Early returns** → loading/error states first

---

## STATE MANAGEMENT

| Need           | Solution        |
| -------------- | --------------- |
| Component-only | `useState`      |
| Global/shared  | Zustand         |
| Server data    | React Query     |
| Forms          | React Hook Form |

**Never mutate state directly.**

---

## IMPORTS ORDER

```
1. react, @tanstack/react-router
2. external libs
3. @/... internal
4. ./... relative
```

---

## ANTI-PATTERNS (auto-reject)

```
any type              → use unknown
empty catch           → handle errors
index as key          → use stable ID
prop drilling 3+      → use context/zustand
state mutation        → immutable updates
console.log           → remove in prod
missing deps          → add to array
god components        → split <200 lines
nested ternary 3+     → use if/else
magic numbers         → use constants
```

---

## SOLID (Quick)

- **S** - One function = one job
- **O** - Extend via config, not if/else
- **L** - Subtypes substitutable
- **I** - Small focused interfaces
- **D** - Depend on abstractions

---

## ERROR HANDLING

- Never empty catch → always handle/log
- Type errors → `if (err instanceof Error)`
- Toast on mutations → success + error feedback

---

**Full rules:** `.claude/standards/react.md`
