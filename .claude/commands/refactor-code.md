# Refactor code for quality.

## #1 Priority Requirements&Docs: $ARGUMENTS

### Visually everything looks fine but we need to work on code, improve it, make design more close to standards.

## Workflow

analyze → refactor → validate

---

## Phase 1: Analyze

**Load standards**:

- `.claude/skills/core.md`
- `.claude/skils/design-system.md`
- `.claude/standards/architecture.md`
- `.claude/standards/next.md`

## **Call analyzer**: give related docs if provided and you will get all violations.

## Phase 2: Refactor

**Fix systematically**:

1. Type safety → Replace `any`, add explicit types
2. Design system → Remove borders, add shadows
3. React patterns → Extract inline functions
4. State → Fix mutations (immutable updates)
5. Architecture → Split god components, remove prop drilling

**No code examples** (see `.claude/standards/` for patterns)

---

## Phase 3: Validate

**Run**:

```bash
npm run type-check
npm run lint
npm run test
```

**Fix errors, re-run**

**Re-analyze**:

```
Issues: 1 (0 critical, 1 warning)
Coverage: 65% (unchanged)

All critical fixed ✓
```

---

## Example

**User**: "Refactor MenuPage.tsx"

**Analyze**: 12 issues (3 critical)

**Refactor**:

- Fixed types, borders, mutations
- Split into 3 components
- Removed prop drilling

**Validate**: All tests pass, 0 critical issues

---

## Success Criteria

- All critical issues fixed
- Anti-patterns resolved
- Quality gates passed
- Coverage maintained
- Visual output unchanged

See `.claude/standards/` for refactoring patterns.
