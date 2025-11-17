Implement new feature i will provide you the documentation of the feature and you should implement it with 100% reflection of the documentation. Btw you should follow all standards and skills..

Docs: $ARGUMENTS

## Workflow

plan → implement → test → validate

---

## Phase 1: Plan

**Load context**:

- `.claude/skills/core.md`
- `.claude/skills/design-system.md`
- `.claude/skills/project-index.md`

**Load docs** user should provide you docs and you should load andy analyze them.

**If you have any questions ask me**

- Use shared components.
- Plan the architecture.

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

## Phase 3: Validate

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
