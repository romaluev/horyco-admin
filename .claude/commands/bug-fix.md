Locate and fix bugs. I'm giving you bug(s), you need to fix them.

Docs: $ARGUMENTS

## Workflow

locate → fix → test → validate

---

## Phase 1: Locate

**Call locator agent** for bugs: you will get the locations of bugs.

---

## Phase 2: Fix

**Load standards & use skills** (ensure fix follows rules):

- `.claude/skills/standards.md`
- `.claude/skills/design-system.md`

**Implement fix** (no code examples, see `.claude/standards/`):

- Read affected files
- Apply fix following standards
- Update related files if needed
- Add error handling/null checks

**Output**:

```
Fixed:
✓ Added calculateTotals() in addItem
✓ Also fixed removeItem, updateQuantity

Files modified: 1
Standards: ✓ Immutable updates ✓ Type safe
```

---

## Phase 3: Test

**If tests exist**: Run + add regression test
**If no tests**: Call **test-writer** to generate

**Output**:

```
Tests:
✓ updates total when item added
✓ updates total when removed
✓ updates total when quantity changed

All passing: 8/8 ✓
```

---

## Phase 4: Validate

**Run**:

```bash
npm run type-check
npm run lint
npm run test
```

**Fix errors, re-run**

**Output**:

```
✓ TypeScript: 0 errors
✓ ESLint: 0 warnings
✓ Tests: 53/53 passing

Bug fixed!
```

---

## Examples

### Single Bug

**User**: "Fix: cart total shows 0"

**Locate**: useCartStore.ts:45
**Fix**: Added calculateTotals() call
**Test**: 3 regression tests ✓
**Validate**: All gates passed ✓

### Multiple Bugs

**User**: "Fix: 1) search not debouncing 2) images not loading"

**Locate**: MenuPage.tsx:30, ProductCard.tsx:45
**Fix**: Added useDebounce, fixed image URL
**Test**: 4 regression tests ✓
**Validate**: All gates passed ✓

---

## Success Criteria

- Bug located (file:line)
- Root cause fixed
- Regression test added
- All tests pass
- Quality gates passed

See `.claude/standards/` for fix patterns.
