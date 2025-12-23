Locate and fix bugs. Root cause, not symptoms.

Bug(s): $ARGUMENTS

---

## 1. LOCATE

Call **locator** → get file:line locations

**Reproduce in browser** (skip: `--skip-ui-test`):

```
browser_navigate → trigger bug → browser_snapshot
browser_console_messages → capture errors
browser_take_screenshot → document broken state
```

Document exact reproduction steps.

---

## 2. FIX

Load: `skills/*`

For each bug:

1. Understand root cause (not symptoms)
2. Apply fix following standards
3. Add null checks/error handling if needed

**Follow exactly:** `core.md`

---

## 3. TEST

- If tests exist → run + add regression test
- If no tests → call **test-writer** → generate tests

---

## 4. VALIDATE

**Guardian:** Call **code-guardian** → fix violations

**Quality gates:** (see `workflow.md`)

**Verify fix in browser** (skip: `--skip-ui-test`):

- Re-run reproduction steps → bug should not occur
- Test at 3 breakpoints (375, 768, 1440)
- `browser_console_messages` → 0 errors
- Test related interactions still work

**If fail → FIX LOOP** (see `workflow.md`, max 3 cycles)

---

## 5. DONE

**Report:**

```
FIXED: [bug summary]

Root cause: [explanation]
Files: [list]
Tests: [count] added

Quality: Types ✓ | Lint ✓ | Tests ✓
Verified: Bug no longer reproducible ✓
```

---

## SUCCESS

- Bug located (file:line)
- Root cause fixed (not symptoms)
- Regression test added
- Verified fixed at all breakpoints
- All gates pass
