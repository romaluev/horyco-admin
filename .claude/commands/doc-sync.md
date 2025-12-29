Sync code with documentation. Code must match docs 100%.

Docs: $ARGUMENTS

---

## 1. ANALYZE

Load: `skills/*`, `standards/*`

Read provided docs thoroughly.

Compare code vs docs:

- Missing features
- Wrong behavior
- UI differences
- API mismatches

**If conflicts → ASK** before proceeding.

---

## 2. SYNC

For each violation:

1. Update code to match docs exactly
2. Follow all standards
3. Update/add tests

**Priority order:**

1. Functionality (logic matches docs)
2. UI (matches documented design)
3. API (endpoints/params match)
4. Types (match documented schemas)

**Follow exactly:** `core.md`, `design-system.md`

---

## 3. VALIDATE

**Guardians:**

- Call **code-guardian** → fix violations
- Call **design-guardian** → fix UI violations

**Quality gates:** (see `workflow.md`)

**Verify UI matches docs** (skip: `--skip-ui-test`):

- Test EVERY documented user flow end-to-end using Playwright mcp
- Test COMPLETE CRUD if documented
- Verify ALL documented elements visible
- Test ALL states (loading, error, empty, success)
- `browser_console_messages` → 0 errors

**If fail → FIX LOOP** (see `workflow.md`, max 3 cycles)

---

## 4. DONE

**Report:**

```
SYNCED: [feature/module]

Changes: [count] files
Docs compliance: 100%

Quality: Types ✓ | Lint ✓ | Tests ✓ | UI ✓
Verified: All documented features work ✓
```

---

## SUCCESS

- Code matches docs 100%
- Full documented flows tested in browser
- All standards followed
- All gates pass
