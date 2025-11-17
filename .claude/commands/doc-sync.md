Sync code with documentations. You should carefully go through feature/logic documentation and change code to suit the docs for 100%

## Docs: $ARGUMENTS

## The highest Priority: To make code the same as docs and user prompts.

## Workflow

analyze → sync → validate

---

## Phase 1: Analyze & Plan

**Load ALL standards & Docs**:

- Most important: The docs are provided by the user (if not enough ask questions)
- `.claude/standards/architecture.md`
- `.claude/standards/next.md`

**Optional**: Focus area (typescript/design-system/architecture/all)

**Call analyzer subagent**: Give him the provided docs and get all violations against them.

**Carefully plan**: Plan your refactoring process (use phases for clarity).

---

## Phase 2: Sync

**Apply ALL standards & Docs**:

1. **Most important: Documentation**: Make sure that the code 100% the same as documentation. ANY VIOLATIONS SHOULD BE FIXED.
2. **Design System**: Remove borders → shadows, inline styles → CSS Modules, Arco → Radix
3. **Architecture**: Fix folder structure, Zustand vs React Query, import order, prop drilling
4. **TypeScript**: Replace `any`, add explicit types, use type guards, `import type`, etc.

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
