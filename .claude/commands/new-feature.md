Implement new feature.

Docs: $ARGUMENTS

## Workflow

plan → implement → test → validate

---

## Phase 1: Plan

**Load context**:

- `.claude/skills/core.md`
- `.claude/skills/design-system.md`
- `.claude/skills/project-index.md`

**Get requirements** from user

**Plan file organization with skill**:

- Use shared components.
- Plan the architecture.
- File structure with good decomposition

---

## Phase 2: Implement

**Execute**:

1. Create API layer (typed methods, multi-tenant headers)
2. Create data layer (React Query hooks OR Zustand store)
3. Implement the feature itself following all rules (use todo list for clarity)
4. Call **offline-handler** (if offline needed) → Dexie queue
5. Write business logic (SOLID, <50 lines per function)

**Output**:

```
Created:
- api/productApi.ts (3 methods)
- hooks/useProducts.ts (React Query)
- components/ProductGrid.tsx + .module.css
- etc.

```

---

## Phase 3: Test

**Call test-writer**:

- Component tests (RTL)
- API tests (MSW)
- Integration tests
- Target: ≥80% coverage

---

## Phase 4: Validate

**Run**:

```bash
npm run type-check
npm run lint
npm run test
```

**If errors**: fix and re-run

**Output**:

```
✓ TypeScript: 0 errors
✓ ESLint: 0 warnings
✓ Tests: 22/22 passing
✓ Coverage: 86.3%
```

---

## Success Criteria

- All files created
- Design system followed (no borders, shadows, CSS Modules)
- Architecture followed (feature structure, state management)
- Quality gates passed (tsc, eslint, tests ≥80%)

See `.claude/standards/` for detailed rules.
