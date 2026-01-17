Comprehensive live UI review. Tests in browser, not just code.

Target: $ARGUMENTS (route like `/dashboard` or component path)

---

## 1. SETUP

```bash
agent-browser open <target-url>    # Navigate to target route
agent-browser console              # Note baseline errors
agent-browser snapshot -i          # Get interactive elements
```

---

## 2. FULL FLOW TEST

**Call browser-tester agent** for comprehensive testing.

Test COMPLETE user journey:

**CRUD (if applicable):**
- Create item → verify appears
- Read/view → verify data correct
- Update → verify changes persist
- Delete → verify removed

**Forms:**
- Valid data → submit → success
- Invalid data → error messages
- Required fields → validation

**Navigation:**
- Visit ALL related routes
- Test all links/buttons work
- Verify correct page loads

---

## 3. DESIGN COMPLIANCE

Check against `design-system.md`:

- **Spacing:** 4px grid (gap-1, gap-2, gap-4, gap-6)
- **Colors:** semantic only (no hardcoded)
- **Typography:** correct sizes (text-sm default)
- **Components:** correct heights (h-9 buttons/inputs)
- **No shadows:** borders only on cards

---

## 4. STATE TEST

| State   | How to Trigger            | Verify                  |
| ------- | ------------------------- | ----------------------- |
| Loading | Click async action        | Spinner/skeleton shows  |
| Error   | Submit invalid data       | Error message + styling |
| Empty   | Clear/filter to 0 results | Empty state message     |
| Success | Complete action           | Confirmation feedback   |

---

## 5. CONSOLE CHECK

```bash
agent-browser console → 0 errors required
```

---

## 6. REPORT

```
DESIGN REVIEW: [target]

BLOCKERS (must fix):
- [issue + location]

HIGH (fix before done):
- [issue + location]

MEDIUM (should fix):
- [issue + location]

LOW (nitpicks):
- [issue + location]

Summary:
- Full Flow: ✓/✗
- Design Compliance: ✓/✗
- States: ✓/✗
- Console: ✓/✗
```

---

## SEVERITY GUIDE

| Level       | Examples                                             |
| ----------- | ---------------------------------------------------- |
| **BLOCKER** | Button doesn't work, crash, can't submit form        |
| **HIGH**    | CRUD incomplete, wrong colors, missing error state   |
| **MEDIUM**  | Minor alignment issue, missing hover state           |
| **LOW**     | Could use better spacing, animation timing           |
