Locate and fix bugs. I'm giving you bug(s), you need to fix them.

#1 PRIORITY TASK: $ARGUMENTS

## Workflow

locate → fix → test → validate

---

## Phase 1: Locate

**Call locator agent** for bugs: you will get the locations of them.

---

## Phase 1.5: Reproduce Bug (if UI-related, skip with `--skip-ui-test`)

- `browser_navigate` → affected page
- `browser_snapshot` → capture broken state
- `browser_console_messages` → check for errors
- Document reproduction steps

---

## Phase 2: Fix

**Load standards & use skills** (ensure fix follows rules):

- `.claude/skills/project-index.md`
- `.claude/skills/standards.md`
- `.claude/skills/design-system.md`

**Implement fix** (no code examples, see `.claude/standards/*`):

- Read affected files
- Apply fix following standards
- Update related files if needed
- Add error handling/null checks
- Make sure that you completely fixed the bug

---

## Phase 3: Test

**If tests exist**: Run + add regression test
**If no tests**: Call **test-writer agent** to generate

---

## Phase 3.5: Guardian Check

**Call code-guardian** → validate fix follows `core.md`

**If violations** → fix before validation.

---

## Phase 4: Validate

**Run**:

```bash
npm run type-check
npm run lint
npm run test
```

**FORBIDDEN fixes** (never use):

- `@ts-ignore` / `@ts-expect-error`
- `as any` type casting
- Removing code to avoid errors
- `// eslint-disable` comments
- Quick hacks

**If errors** → understand root cause → fix properly → re-run.

---

## Phase 4.5: Verify Fix (if UI-related, skip with `--skip-ui-test`)

- Re-run reproduction steps from Phase 1.5
- `browser_verify_*` → confirm bug fixed
- `browser_console_messages` → zero new errors
- `browser_take_screenshot` → capture fixed state

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
