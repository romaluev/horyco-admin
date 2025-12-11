---
name: core
description: JS/TS rules (best practices, standards, rules)
model: haiku
triggers:
  ['ts/js rules', 'best practices', 'typescript standards', 'clean code']
---

# JS/TS Code Quality Rules

## TYPE SAFETY

- **Never use `any`** - use `unknown` and narrow with type guards (`typeof`, `instanceof`)
- **Explicit types for arrays/objects** - `const items: string[] = []`, never `const items = []`
- **Handle null/undefined explicitly** - use `?.` and `??` operators consistently
- **Use type guards, not assertions** - validate with `instanceof`/`typeof` before accessing
- **Import types explicitly** - `import type { Product }` for type-only imports
- **Prefer `interface` over `type`** for object shapes (better error messages, extendable)
- **Use `as const`** for literal types and readonly arrays/objects
- **Avoid type widening** - be explicit with types instead of relying on inference
- **Use discriminated unions** - for state machines and variant types
- **Strict null checks enabled** - never disable `strictNullChecks` in tsconfig

---

## NAMING

- **Descriptive, not abbreviated** - `products` not `arr`, `totalPrice` not `tmp`
- **Boolean prefixes required** - `isLoading`, `hasError`, `canEdit`, `shouldUpdate`
- **Event handlers use `handle` prefix** - `handleClick`, `handleSubmit`, `handleChange`
- **Constants are SCREAMING_SNAKE_CASE** - `MAX_RETRIES`, `API_BASE_URL`, `DEFAULT_TIMEOUT`
- **Functions are verbs** - `fetchUser`, `validateEmail`, `formatDate`, `calculateTotal`
- **React components are PascalCase** - `ProductCard`, `UserProfile`, `OrderList`
- **Private fields use `#` or `_` prefix** - `#privateField` or `_internalMethod`
- **Hooks start with `use`** - `useProducts`, `useAuth`, `useDebounce`
- **Types/Interfaces use `I` prefix** - `IProduct`, `IUser` (project convention)

---

## SOLID PRINCIPLES

- **Single Responsibility** - one function does one thing (separate fetch/validate/transform)
- **Open/Closed** - extend via config objects, not if/else modification
- **Liskov Substitution** - subtypes must be substitutable for base types
- **Interface Segregation** - split large interfaces into focused, smaller ones
- **Dependency Injection** - pass dependencies as params, don't hardcode

---

## KISS & DRY

- **Don't abstract until 3+ repetitions** - avoid premature abstraction
- **No premature optimization** - don't use `useMemo`/`useCallback` for simple operations
- **Extract repeated logic after 3rd occurrence** - maintain balance between DRY and simplicity
- **Keep it simple** - prefer straightforward code over clever tricks
- **Avoid deep nesting** - max 3 levels, extract functions if deeper
- **Early returns** - reduce nesting with guard clauses

---

## CODE SIZE

- **Functions max 50 lines** (ideal: < 30)
- **Components max 200 lines** (ideal: < 150)
- **Files max 300 lines**
- **Function parameters max 4** (use options object for more)
- **Cyclomatic complexity max 10** (max 10 decision branches)
- **If exceeded**: Extract smaller functions/components

---

## ERROR HANDLING

- **Never empty catch blocks** - always log or handle errors
- **Type errors properly** - `if (err instanceof Error)` before accessing `.message`
- **Use custom error classes** - extend `Error` for domain-specific errors
- **Fail fast** - throw errors early, don't propagate invalid state
- **Error boundaries in React** - wrap components for graceful degradation
- **Provide error context** - include relevant data in error messages
- **Use Result types** - `{ data?: T, error?: Error }` for expected failures

---

## ASYNC/AWAIT

- **Always handle promises** - use `await` or explicit `void` for fire-and-forget
- **Type async functions** - `async function foo(): Promise<T>`
- **Try/catch for async errors** - handle rejections explicitly
- **Avoid mixing async/sync** - functions should be fully async or sync
- **Parallel when possible** - `Promise.all()` for independent operations
- **Sequential when dependent** - `for...of` with `await` for dependent ops
- **No `Promise` constructor** - use `async/await` instead of `new Promise`

---

## IMPORTS

- **Organize in order**: Framework → External → Internal (@/) → Relative (./)
- **Use named exports** (except React/Vue default component exports)
- **Group by type** - types together, functions together
- **Avoid barrel exports** - they hurt tree-shaking
- **No circular dependencies** - refactor to break cycles
- **Sort alphabetically** - within each group for consistency

---

## REACT PATTERNS

- **No inline arrow functions in JSX** - creates new function every render
- **Never use index as key** - use stable IDs (`key={item.id}`)
- **Explicit boolean checks** - `length > 0`, not `length` (avoids rendering "0")
- **Destructure props** - `({ title }: Props)` not `(props: Props)`
- **Keep components pure** - same props → same output (no side effects in render)
- **Lift state up** - share state at lowest common ancestor
- **One component per file** - except tiny related subcomponents
- **Use fragments** - `<></>` instead of unnecessary wrapper divs
- **Custom hooks for reusable logic** - extract stateful logic into hooks
- **Controlled components** - prefer controlled over uncontrolled inputs
- **Avoid inline styles** - use Tailwind classes or styled components

---

## STATE MANAGEMENT

- **Local state first** - `useState` for component-only state
- **Lift state up** - move to parent when shared by siblings
- **Context for deep trees** - avoid prop drilling (auth, theme, i18n)
- **Zustand for global state** - lightweight, simple API
- **React Query for server state** - handles caching, refetching, errors
- **React Hook Form for forms** - validation, submission, field management
- **Avoid redundant state** - derive from existing state when possible
- **Immutable updates** - never mutate state directly

---

## PERFORMANCE

- **`useMemo` only for expensive ops** - filtering/sorting large arrays, heavy calculations
- **`useCallback` only for memoized children** - when passed to `React.memo` components
- **Use `React.memo` wisely** - for pure components that re-render often
- **Lazy load routes/components** - `React.lazy()` and `Suspense` for code splitting
- **Debounce expensive operations** - search inputs, scroll/resize handlers
- **Virtualize long lists** - use react-window/virtuoso for 100+ items
- **Optimize images** - Next.js Image with proper `sizes` prop
- **Avoid premature optimization** - measure first, optimize bottlenecks

---

## TESTING

- **Test behavior, not implementation** - test what users see/do
- **Arrange-Act-Assert pattern** - clear test structure
- **One assertion per test** - focused tests are easier to debug
- **Mock external dependencies** - API calls, timers, browser APIs
- **Test edge cases** - empty arrays, null, undefined, errors, boundary values
- **Descriptive test names** - `it('should disable button when form is invalid')`
- **Avoid testing implementation details** - don't test state/props directly

---

## COMMENTS

- **Explain WHY, not WHAT** - code shows what, comments explain why
- **Document complex logic** - algorithms, workarounds, non-obvious decisions
- **TSDoc for public APIs** - use `@param`, `@returns`, `@throws` for exported functions
- **TODO with context** - `// TODO(name): reason and deadline`
- **Remove commented code** - use git history instead
- **Keep comments updated** - outdated comments are worse than none
- **Don't comment on simple stuff** - Don't write comments whenever you can, write only when the naming is not enough or code is big.

---

## ANTI-PATTERNS (AUTO-REJECT)

- ❌ `any` type (use `unknown` and narrow)
- ❌ Empty catch blocks (always handle/log errors)
- ❌ Index as React key (use stable IDs)
- ❌ Prop drilling 3+ levels (use context/zustand)
- ❌ Direct state mutation (immutability required)
- ❌ `console.log` in production (use proper logging)
- ❌ Missing hook dependencies (exhaustive-deps)
- ❌ God functions/components (>50 lines)
- ❌ Type assertions without validation (use type guards)
- ❌ Nested ternaries >2 levels (use if/else or early returns)
- ❌ Magic numbers (use named constants)
- ❌ Hardcoded strings (use i18n or constants)
- ❌ `var` keyword (use `const` or `let`)
- ❌ `==` operator (use `===` always)

---

## ESLINT COMPLIANCE

- Unused variables → Remove
- Missing semicolons → Add (or configure consistently)
- Missing hook dependencies → Add to array
- Unsafe optional chaining → Add null checks
- No `var` → Use `const` or `let`
- Prefer `const` → Use `const` by default

---

**Apply every rule on every file. No exceptions.**
