Implement feature from documentation. Zero manual intervention.

Docs: $ARGUMENTS

---

## 1. UNDERSTAND

Load: `skills/*`, `standards/*`

Read provided docs. **If unclear → ASK.** Do not assume.

---

## 2. PLAN

- Call **architector** → get file structure
- Map to existing components (`project-index.md`)
- Create todo list

**Rule:** NO custom components if reusable exists.

---

## 3. IMPLEMENT

For each file:

1. Find similar pattern in codebase
2. Reuse patterns, don't invent
3. Write code + tests together

**Follow exactly:** `core.md`, `design-system.md`

---

## 4. VALIDATE

**Guardians:**

- Call **code-guardian** → fix violations
- Call **design-guardian** → fix UI violations

**Quality gates:** (see `workflow.md`)

**Live UI test** (skip: `--skip-ui-test`):

- Run FULL FLOW TESTING using PlaywrightMCP from `workflow.md`
- Test EVERY page/route created
- Test COMPLETE CRUD if applicable (create → read → update → delete)
- Test ALL form flows (valid + invalid data)
- Verify design compliance + 0 console errors

**If fail → FIX LOOP** (see `workflow.md`, max 3 cycles)

---

## 5. DONE

**Cleanup:** (see `workflow.md`)

**Report:**

```
DONE: [feature]
Files: [list]
Quality: Types ✓ | Lint ✓ | Tests ✓ | UI ✓
Issues: [blocker/high/medium/low counts]
```

---

## SUCCESS

- Docs reflected 100%
- Reusable components used
- All standards followed
- All gates pass
- Full user journey tested in browser
