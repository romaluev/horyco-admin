Sync code with documentations. You should carefully go through feature/logic documentation and change code to suit the docs for 100%

## #1 Priority - User Prompts&Docs: $ARGUMENTS

## The highest Priority: To make code the same as docs and user prompts.

## Workflow

analyze → sync → validate

---

## Phase 1: Analyze & Plan

**Load ALL standards & Docs**:

- Most important: The docs are provided by the user (if not enough ask questions)
- Use all skills you have.
- `.claude/standards/architecture.md`
- `.claude/standards/next.md`

**Optional**: Focus area (typescript/design-system/architecture/all)

**Call analyzer subagent**: Give him the provided docs and get all violations against them.

**Carefully plan**: Plan your refactoring process (use phases for clarity).

---

## Phase 2: SYNC!!!

**Apply ALL standards & Docs**:

1. **Most important: Documentation**: Make sure that the code 100% the same as the documentation. ANY VIOLATIONS SHOULD BE FIXED.
2. **Design System**: Remove borders → shadows, inline styles → CSS Modules, Arco → Radix
3. **Architecture**: Fix folder structure, Zustand vs React Query, import order, prop drilling
4. **TypeScript**: Replace `any`, add explicit types, use type guards, `import type`, etc.

---

## Phase 2.5: Verify UI Matches Docs (if UI, skip with `--skip-ui-test`)

- `browser_navigate` → documented pages
- `browser_verify_element_visible` → required elements from docs
- `browser_verify_text_visible` → required labels from docs
- Test documented user flows
- `browser_take_screenshot` → capture for comparison

---

## Phase 3: Validate

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

**If errors** → understand root cause → fix properly → re-run.

**Re-analyze**:

```
Standards & Docs compliance: 100%

✓ Docs: The code is completely the same as docs.
✓ TypeScript: all rules
✓ Design System: all rules
✓ Architecture: all rules
```

---

## Example

**User**: "Sync orders feature with docs"

**Analyze**: 22 violations (TypeScript, design, architecture)

**Sync**: Applied all standards (15 files modified)

**Validate**: 100% compliance ✓

---

## Success Criteria

- All standards violations fixed (ts, ui, architecture, linters, DOCS).

See `.claude/standards/` for all rules.
