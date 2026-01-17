Refactor code for quality. Visual output must stay unchanged.

Target: $ARGUMENTS

---

## 1. ANALYZE

Load: `skills/*`, `standards/*`

Call **code-guardian** → get all violations
Call **design-guardian** → get UI violations (if UI code)

**Capture baseline** (skip: `--skip-ui-test`):

```bash
agent-browser open <affected-url>  # Navigate to affected pages
agent-browser snapshot -i          # Save DOM structure
agent-browser screenshot           # Capture visual baseline
```

- Test current user flows
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

- Call **browser-tester** agent for comprehensive testing
- Test SAME user flows as baseline
- Compare DOM → structure unchanged
- Test ALL interactions still work
- `agent-browser console` → 0 errors

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
- Visual output unchanged
- Full user flows still work
- Coverage maintained
- All gates pass
