---
name: workflow
description: Common workflow patterns for all commands
model: haiku
triggers: ['workflow', 'validate', 'fix loop', 'quality gates', 'agent-browser', 'browser-test']
---

# Workflow Patterns

---

## LOAD CONTEXT

```
Skills: core.md, design-system.md, project-index.md
Standards: architecture.md, next.md
```

---

## ASK IF UNCLEAR

Before implementing, if you have:
- Questions about requirements
- Unclear decisions to make
- Multiple valid approaches

**→ ASK the user. Don't assume.**

---

## QUALITY GATES

```bash
npm run type-check
npm run lint
npm run test
```

---

## FIX LOOP

**Max 3 attempts per error.**

1. Read error
2. Understand root cause
3. Fix properly (no hacks)
4. Re-run gate
5. If 3x fail → STOP, report blocker

**FORBIDDEN:** `@ts-ignore`, `as any`, `eslint-disable`

---

## GUARDIAN VALIDATION

After implementation:
1. Call **code-guardian** → fix violations
2. Call **design-guardian** → fix UI violations (if UI)

---

## BROWSER TESTING (agent-browser CLI)

Skip with `--skip-ui-test` flag.

### ⚠️ CRITICAL - Tool Selection

**❌ FORBIDDEN - Never use these for browser testing:**
```
mcp__playwright__*           # ANY Playwright MCP tool
mcp__chrome-devtools__*      # ANY Chrome DevTools MCP tool
browser_navigate, browser_snapshot, browser_click, etc.
```

**✅ REQUIRED - Only use Bash with agent-browser:**
```bash
Bash("agent-browser open 'http://localhost:3000'")
Bash("agent-browser snapshot -i")
Bash("agent-browser click @e1")
```

### Call browser-tester Agent

**→ Call `browser-tester` agent for comprehensive testing.**

The agent uses `agent-browser` CLI commands via Bash tool.

### Test Credentials
- Phone: +998201000022
- Password: Password123
- PIN (John): 0000

### agent-browser Commands (via Bash)
```bash
# Install once
npm install -g agent-browser && agent-browser install

# Core workflow - ALL via Bash tool
agent-browser open <url>           # Navigate
agent-browser snapshot -i          # Get interactive elements (@e1, @e2...)
agent-browser click @e1            # Interact
agent-browser fill @e2 "text"      # Fill inputs
agent-browser screenshot           # Capture state
agent-browser console              # Check errors
agent-browser network              # Check API calls
```

**FULL FLOW TESTING (mandatory):**

Test the COMPLETE user journey for every change:

1. **CRUD features** → test ALL operations:
   - Create → verify item appears in list
   - Read → verify data displays correctly
   - Update → verify changes persist
   - Delete → verify item removed

2. **Multiple pages** → visit EACH page:
   - Navigate to every affected route
   - Take screenshots for verification
   - Verify no console errors
   - Test all interactive elements

3. **Forms** → test complete flow:
   - Fill with valid data → submit → verify success
   - Fill with invalid data → verify error messages
   - Test required field validation

4. **State & Error handling** → verify ALL states:
   - Loading state visible
   - Success feedback shown
   - Error handling works
   - Empty states display correctly

5. **Network & Console** → monitor continuously:
   - No API failures (4xx/5xx)
   - No JavaScript errors
   - No React warnings

**Test pattern:**
```
open → snapshot -i → interact → snapshot → console → network → verify
     ↑__________________________________________________|
```

---

## CLEANUP

Before done:
1. Remove unused imports
2. Remove console.log
3. `npm run lint -- --fix`

---

## REPORT FORMAT

```
DONE: [summary]
Files: [list]
Quality: Types ✓ | Lint ✓ | Tests ✓ | UI ✓
```
