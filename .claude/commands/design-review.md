Comprehensive live UI review. Tests in browser, not just code.

Target: $ARGUMENTS (route like `/dashboard` or component path)

---

## 1. SETUP

```
1. PRE-FLIGHT (see workflow.md)
2. browser_navigate → target route
3. browser_console_messages → note baseline
```

---

## 2. RESPONSIVE TEST

Test **3 breakpoints** (see `workflow.md`):

| Device  | Size     |
| ------- | -------- |
| Mobile  | 375x812  |
| Tablet  | 768x1024 |
| Desktop | 1440x900 |

**For each:**

```
browser_resize → browser_snapshot → browser_take_screenshot
```

**Check:**

- No horizontal overflow
- Text readable (not cut off)
- Touch targets ≥44px on mobile
- Layout adapts properly

---

## 3. INTERACTION TEST

```
browser_click      → buttons, links, toggles, tabs
browser_fill_form  → valid + invalid data
browser_hover      → tooltips, dropdowns, menus
browser_press_key  → Tab (focus), Enter (submit), Escape (close)
```

**Verify:**

- Click feedback (visual response)
- Form validation messages
- Hover states appear
- Keyboard navigation works

---

## 4. STATE TEST

| State   | How to Trigger            | Verify                  |
| ------- | ------------------------- | ----------------------- |
| Loading | Click async action        | Spinner/skeleton shows  |
| Error   | Submit invalid data       | Error message + styling |
| Empty   | Clear/filter to 0 results | Empty state message     |
| Success | Complete action           | Confirmation feedback   |

---

## 5. ACCESSIBILITY TEST

```
1. Tab through entire page → verify logical focus order
2. browser_snapshot → verify aria-labels present
3. Check focus rings visible (not hidden)
4. Test keyboard-only (no mouse clicks)
5. Verify color contrast on text
```

---

## 6. CONSOLE & NETWORK

```
browser_console_messages → 0 errors required
browser_network_requests → no failed API calls
```

---

## 7. REPORT

Categorize all findings:

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

Screenshots: [list captured files]

Summary:
- Responsive: ✓/✗
- Interactions: ✓/✗
- States: ✓/✗
- Accessibility: ✓/✗
- Console: ✓/✗
```

---

## SEVERITY GUIDE

| Level       | Examples                                             |
| ----------- | ---------------------------------------------------- |
| **BLOCKER** | Button doesn't work, crash, can't submit form        |
| **HIGH**    | Missing focus ring, broken on mobile, no error state |
| **MEDIUM**  | Minor alignment issue, missing hover state           |
| **LOW**     | Could use better spacing, animation timing           |
