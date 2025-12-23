# UI Testing with Playwright MCP

Triggers: `ui test`, `playwright`, `browser test`, `visual test`

## Config

- Dev server: `localhost:3000`
- Browser: headless
- Skip flag: `--skip-ui-test`

---

## Verification Pattern

```
1. browser_navigate → http://localhost:3000/[route]
2. browser_snapshot → verify DOM renders
3. browser_console_messages → must be zero errors
4. browser_take_screenshot → capture result
```

---

## Interaction Testing

```
1. browser_fill_form → test form inputs
2. browser_click → test buttons/links
3. browser_verify_text_visible → check expected text
4. browser_verify_element_visible → check expected elements
```

---

## Error Handling

- Console errors = **FAIL**. Fix code, retest.
- Network errors = Check `browser_network_requests` for failed API calls.

---

## Tool Reference

| Tool                             | Use                |
| -------------------------------- | ------------------ |
| `browser_navigate`               | Open page          |
| `browser_snapshot`               | Get DOM tree       |
| `browser_console_messages`       | Check errors       |
| `browser_take_screenshot`        | Capture visual     |
| `browser_click`                  | Click element      |
| `browser_type`                   | Type text          |
| `browser_fill_form`              | Fill form          |
| `browser_verify_text_visible`    | Assert text        |
| `browser_verify_element_visible` | Assert element     |
| `browser_network_requests`       | Debug API          |
| `browser_wait_for`               | Wait for condition |
