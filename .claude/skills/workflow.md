---
name: workflow
description: Common workflow patterns for all commands
model: haiku
triggers: ['workflow', 'validate', 'fix loop', 'quality gates']
---

# Workflow Patterns

Common patterns referenced by all commands.

---

## LOAD CONTEXT

Always load before work:

```
Skills: core.md, design-system.md, project-index.md, workflow.md
Standards: architecture.md, next.md
```

---

## PRE-FLIGHT

Before browser tests:

```
1. curl -s localhost:3000 > /dev/null
2. If not running → npm run dev & → wait 10s
3. Proceed with tests
```

---

## QUALITY GATES

Run in order, stop on first fail:

```bash
npm run type-check
npm run lint
npm run test
```

---

## FIX LOOP

**Max 3 attempts per error.**

```
1. READ error completely
2. UNDERSTAND root cause (not symptoms)
3. FIX properly (no hacks)
4. RE-RUN failed gate
5. If 3x same error → STOP, report blocker
```

**FORBIDDEN:**

- `@ts-ignore` / `@ts-expect-error`
- `as any` casting
- `// eslint-disable`
- Deleting code to avoid errors

---

## GUARDIAN VALIDATION

After implementation:

```
1. Call code-guardian → get violations
2. Call design-guardian → get UI violations (if UI)
3. Fix ALL violations
4. Re-run until clean
```

---

## LIVE UI TESTING

Skip with `--skip-ui-test` flag.

### Phase 1: Setup

```
1. PRE-FLIGHT check (dev server running)
2. browser_navigate → target route
3. browser_console_messages → note baseline errors
```

### Phase 2: Responsive Testing

Test at **3 breakpoints**:

| Device  | Width  | Command                   |
| ------- | ------ | ------------------------- |
| Mobile  | 375px  | `browser_resize 375 812`  |
| Tablet  | 768px  | `browser_resize 768 1024` |
| Desktop | 1440px | `browser_resize 1440 900` |

For each breakpoint:

```
1. browser_resize → set viewport
2. browser_snapshot → verify layout
3. browser_take_screenshot → capture
4. Check: no overflow, readable text, touch targets
```

### Phase 3: Interaction Testing

```
1. browser_click → test buttons, links, toggles
2. browser_fill_form → test inputs with valid/invalid data
3. browser_hover → test tooltips, dropdowns
4. browser_press_key → test keyboard navigation (Tab, Enter, Escape)
5. browser_verify_text_visible → confirm feedback messages
```

### Phase 4: State Testing

```
1. Loading states → trigger async action, verify spinner
2. Error states → submit invalid data, verify error UI
3. Empty states → clear data, verify empty message
4. Success states → complete action, verify confirmation
```

### Phase 5: Accessibility

```
1. Tab through page → verify focus order
2. browser_snapshot → check aria labels present
3. Verify focus rings visible on interactive elements
4. Test with keyboard only (no mouse)
```

### Phase 6: Console Check

```
browser_console_messages → MUST be 0 errors
browser_network_requests → check for failed API calls
```

---

## ISSUE SEVERITY

Categorize findings:

| Level       | Meaning                                            | Action          |
| ----------- | -------------------------------------------------- | --------------- |
| **BLOCKER** | Broken functionality, crash, data loss             | Must fix now    |
| **HIGH**    | Major UX issue, accessibility fail, wrong behavior | Fix before done |
| **MEDIUM**  | Minor visual issue, edge case bug                  | Should fix      |
| **LOW**     | Nitpick, polish, nice-to-have                      | Optional        |

---

## TOOLS REFERENCE

| Tool                             | Purpose                    |
| -------------------------------- | -------------------------- |
| `browser_navigate`               | Open page                  |
| `browser_resize`                 | Set viewport size          |
| `browser_snapshot`               | Get DOM/accessibility tree |
| `browser_take_screenshot`        | Capture visual             |
| `browser_console_messages`       | Check JS errors            |
| `browser_network_requests`       | Check API calls            |
| `browser_click`                  | Click element              |
| `browser_type`                   | Type text                  |
| `browser_fill_form`              | Fill multiple inputs       |
| `browser_hover`                  | Hover element              |
| `browser_press_key`              | Keyboard input             |
| `browser_wait_for`               | Wait for condition         |
| `browser_verify_text_visible`    | Assert text                |
| `browser_verify_element_visible` | Assert element             |

---

## STOP CONDITIONS

**STOP and ask when:**

- Docs unclear or contradictory
- Code conflicts with requirements
- Fix requires breaking unrelated code
- 3 fix attempts failed
- Missing dependencies/permissions
- Multiple valid approaches

**DO NOT assume. Ask.**

---

## CLEANUP

Before done:

```
1. Remove unused imports
2. Remove console.log
3. Remove TODO comments
4. npm run lint -- --fix
```

---

## REPORT FORMAT

```
DONE: [summary]

Files: [list]
Tests: [count] passing

Quality:
- Types: ✓/✗
- Lint: ✓/✗
- Tests: ✓/✗
- UI: ✓/✗/skipped

Issues: [blockers/high/medium/low counts]
```
