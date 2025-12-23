Refactor code for quality. Visual output must stay unchanged.

Target: $ARGUMENTS

---

## 1. ANALYZE

Load: `skills/*`, `standards/*`

Call **code-guardian** → get all violations
Call **design-guardian** → get UI violations (if UI code)

**Capture baseline** (skip: `--skip-ui-test`):

- Test at 3 breakpoints (375, 768, 1440)
- `browser_take_screenshot` at each size
- `browser_snapshot` → save DOM structure
- Note current behavior

---

## 2. REFACTOR

Fix systematically:

1. Type safety → replace `any`, add explicit types
2. Code patterns → extract functions, remove duplication
3. React patterns → extract handlers, fix keys
4. State → immutable updates, proper hooks
5. Architecture → split god components, fix imports

**Follow exactly:** `core.md`, `design-system.md`

---

## 3. VALIDATE

**Guardians:** Re-run until clean

**Quality gates:** (see `workflow.md`)

**Visual regression** (skip: `--skip-ui-test`):

- Test at same 3 breakpoints
- Compare screenshots → must match baseline
- Compare DOM → structure unchanged
- Test interactions still work

**If fail → FIX LOOP** (see `workflow.md`, max 3 cycles)

---

## 4. DONE

**Cleanup:** (see `workflow.md`)

**Report:**

```
REFACTORED: [target]
Issues fixed: [count by severity]
Files: [list]
Quality: Types ✓ | Lint ✓ | Tests ✓ | UI ✓
Visual: unchanged ✓
```

---

## SUCCESS

- All violations fixed
- Visual output unchanged at all breakpoints
- Interactions still work
- Coverage maintained
- All gates pass
