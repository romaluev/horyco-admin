Locate and fix bugs. Root cause, not symptoms.

Bug(s): $ARGUMENTS

---

## 1. LOCATE

Call **locator** → get file:line locations

**Reproduce in browser** (skip: `--skip-ui-test`):

```bash
agent-browser open <url>        # Navigate to affected page
agent-browser snapshot -i       # Get interactive elements
# Trigger the bug
agent-browser console           # Capture errors
agent-browser screenshot        # Document broken state
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

**Call browser-tester agent** to verify fix in browser.

---

## 4. VALIDATE

**Guardian:** Call **code-guardian** → fix violations

**Quality gates:** (see `workflow.md`)

**Verify fix in browser** (skip: `--skip-ui-test`):

- Re-run reproduction steps → bug should not occur
- Call **browser-tester** agent for full related flow testing
- `agent-browser console` → 0 errors
- Verify no regressions in related features

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
- Full related flow verified in browser
- All gates pass
