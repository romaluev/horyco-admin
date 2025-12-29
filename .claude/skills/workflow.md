---
name: workflow
description: Common workflow patterns for all commands
model: haiku
triggers: ['workflow', 'validate', 'fix loop', 'quality gates', 'playwright']
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

## PLAYWRIGHT MCP TESTING

Skip with `--skip-ui-test` flag.

**Credentials:**
- Phone: +998201000022
- Password: Password123
- PIN (John): 0000

**Playwright Tools:**
> npx @playwright/mcp@latest --help
--allowed-hosts <hosts...>            comma-separated list of hosts this
server is allowed to serve from.
Defaults to the host the server is bound
to. Pass '*' to disable the host check.
--allowed-origins <origins>           semicolon-separated list of TRUSTED
origins to allow the browser to request.
Default is to allow all.
Important: *does not* serve as a
security boundary and *does not* affect
redirects.
--blocked-origins <origins>           semicolon-separated list of origins to
block the browser from requesting.
Blocklist is evaluated before allowlist.
If used without the allowlist, requests
not matching the blocklist are still
allowed.
Important: *does not* serve as a
security boundary and *does not* affect
redirects.
--block-service-workers               block service workers
--browser <browser>                   browser or chrome channel to use,
possible values: chrome, firefox,
webkit, msedge.
--caps <caps>                         comma-separated list of additional
capabilities to enable, possible values:
vision, pdf.
--cdp-endpoint <endpoint>             CDP endpoint to connect to.
--cdp-header <headers...>             CDP headers to send with the connect
request, multiple can be specified.
--config <path>                       path to the configuration file.
--console-level <level>               level of console messages to return:
"error", "warning", "info", "debug".
Each level includes the messages of more
severe levels.
--device <device>                     device to emulate, for example: "iPhone
15"
--executable-path <path>              path to the browser executable.
--extension                           Connect to a running browser instance
(Edge/Chrome only). Requires the
"Playwright MCP Bridge" browser
extension to be installed.
--grant-permissions <permissions...>  List of permissions to grant to the
browser context, for example
"geolocation", "clipboard-read",
"clipboard-write".
--headless                            run browser in headless mode, headed by
default
--host <host>                         host to bind server to. Default is
localhost. Use 0.0.0.0 to bind to all
interfaces.
--ignore-https-errors                 ignore https errors
--init-page <path...>                 path to TypeScript file to evaluate on
Playwright page object
--init-script <path...>               path to JavaScript file to add as an
initialization script. The script will
be evaluated in every page before any of
the page's scripts. Can be specified
multiple times.
--isolated                            keep the browser profile in memory, do
not save it to disk.
--image-responses <mode>              whether to send image responses to the
client. Can be "allow" or "omit",
Defaults to "allow".
--no-sandbox                          disable the sandbox for all process
types that are normally sandboxed.
--output-dir <path>                   path to the directory for output files.
--port <port>                         port to listen on for SSE transport.
--proxy-bypass <bypass>               comma-separated domains to bypass proxy,
for example
".com,chromium.org,.domain.com"
--proxy-server <proxy>                specify proxy server, for example
"http://myproxy:3128" or
"socks5://myproxy:8080"
--save-session                        Whether to save the Playwright MCP
session into the output directory.
--save-trace                          Whether to save the Playwright Trace of
the session into the output directory.
--save-video <size>                   Whether to save the video of the session
into the output directory. For example
"--save-video=800x600"
--secrets <path>                      path to a file containing secrets in the
dotenv format
--shared-browser-context              reuse the same browser context between
all connected HTTP clients.
--snapshot-mode <mode>                when taking snapshots for responses,
specifies the mode to use. Can be
"incremental", "full", or "none".
Default is incremental.
--storage-state <path>                path to the storage state file for
isolated sessions.
--test-id-attribute <attribute>       specify the attribute to use for test
ids, defaults to "data-testid"
--timeout-action <timeout>            specify action timeout in milliseconds,
defaults to 5000ms
--timeout-navigation <timeout>        specify navigation timeout in
milliseconds, defaults to 60000ms
--user-agent <ua string>              specify user agent string
--user-data-dir <path>                path to the user data directory. If not
specified, a temporary directory will be
created.
--viewport-size <size>                specify browser viewport size in pixels,
for example "1280x720"

**FULL FLOW TESTING (mandatory):**

Test the COMPLETE user journey for every change:

1. **CRUD features** → test ALL operations:
   - Create → verify item appears
   - Read → verify data displays correctly
   - Update → verify changes persist
   - Delete → verify item removed

2. **Multiple pages** → visit EACH page:
   - Navigate to every affected route
   - Check design compliance
   - Verify no console errors
   - Test all interactive elements

3. **Forms** → test complete flow:
   - Fill with valid data → submit → verify success
   - Fill with invalid data → verify error messages
   - Test required field validation

4. **State changes** → verify ALL states:
   - Loading state visible
   - Success feedback shown
   - Error handling works
   - Empty states display correctly

**Test pattern:**
```
browser_navigate → browser_snapshot → browser_console_messages
→ browser_fill_form/browser_click → verify result
→ repeat for each operation/page
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
