Implement feature from documentation. Zero manual intervention.

Docs: $ARGUMENTS

---

## PHASE 1: UNDERSTAND

**Load skills** (cached):

- `.claude/skills/core.md`
- `.claude/skills/design-system.md`
- `.claude/skills/project-index.md`
- `.claude/skills/ui-testing.md`

**Load standards**:

- `.claude/standards/architecture.md`
- `.claude/standards/next.md`

**Read user docs**. If unclear → ask. Do NOT assume.

---

## PHASE 2: PLAN

**Call architector agent** → get file structure.

**Map components** (MANDATORY):

- Use existing components, see list here `project-index.md`
- NO custom components if reusable exists.

**Create todo list** with steps.

---

## PHASE 3: IMPLEMENT

**Strict rules**:

- Use ONLY existing components (no custom duplicates)
- Follow `design-system.md` EXACTLY
- Follow `core.md` EXACTLY
- Match docs 100%

**For each file**:

1. Find similar pattern in codebase first
2. Reuse patterns, don't invent
3. Write code + tests together

---

## PHASE 3.5: GUARDIAN CHECK

**Call code-guardian** → validate `core.md` rules

**Call design-guardian** → validate `design-system.md` rules (if UI)

**If violations** → fix before quality gates.

---

## PHASE 4: VERIFY

**Quality gates**:

```bash
npm run type-check
npm run lint
npm run test
```

**UI test** (skip with `--skip-ui-test`):

- `browser_navigate` → feature route
- `browser_snapshot` → verify DOM
- `browser_console_messages` → zero errors
- `browser_take_screenshot` → capture

**ANY fail** → PHASE 5
**ALL pass** → PHASE 6

---

## PHASE 5: FIX

**Proper fix approach**:

1. **Understand** - what is the error telling you?
2. **Root cause** - why does this error exist?
3. **Fix properly** - even if requires big changes
4. **Verify** - error gone AND code correct

**Fix by type**:

- Type error → fix types properly, recheck `core.md`
- Lint error → fix style properly, recheck `core.md`
- Test fail → fix logic or update test correctly
- UI error → fix component, recheck `design-system.md`
- Console error → fix runtime issue at root

**Return to PHASE 4**.

**Max 3 cycles**. Still failing → report blocker.

---

## PHASE 6: CLEANUP

**Final**:

- Remove unused imports
- Remove console.logs
- No TODO comments
- Run `npm run lint -- --fix`

**Report**:

```
DONE: [feature]

Files: [list]
Components used: [list]

Quality:
- Types: ✓
- Lint: ✓
- Tests: ✓ (X%)
- UI: ✓
```

---

## SUCCESS CRITERIA

- Docs reflected 100%
- Reusable components used (no duplicates)
- Design system followed exactly
- Architecture correct (FSD)
- Best practices followed - Clean Code 100%
- All standards are followed 100%
- All quality gates pass
- UI renders without errors
