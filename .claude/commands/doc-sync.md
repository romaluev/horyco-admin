Sync code with documentation. Code must match docs 100%.

Docs: $ARGUMENTS

---

## 1. ANALYZE & PLAN

Load: `skills/*`, `standards/*`

Read provided docs thoroughly.

Compare code vs docs:

- Missing features
- Wrong behavior
- UI differences
- API mismatches

**If conflicts → ASK** before proceeding.

---

## 2. EXECUTE & SYNC

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

## 3. TEST & VALIDATE

**Guardians:**

- Call **code-guardian** → fix violations
- Call **design-guardian** → fix UI violations

- Call **browser-tester** agent for comprehensive testing: using agent-browser command
- Test EVERY documented user flow end-to-end
- Test COMPLETE CRUD if documented
- Verify ALL documented elements visible
- Interact with every action that you can - buttons, forms, filters, submittion, sorting, pagination and more.
- Test ALL states (loading, error, empty, success)
- `agent-browser console` → 0 errors

**If fail → FIX LOOP**. Go back to planning.

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
