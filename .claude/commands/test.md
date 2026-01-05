Generate tests for code.

Target: $ARGUMENTS

---

## PHASE 1: ANALYZE

**Read target** file(s).

**Find existing tests** in codebase for patterns.

**Identify**:

- Functions to test
- Hooks to test
- Components to test
- Edge cases
- Dependencies to mock

---

## PHASE 2: GENERATE

**Call test-writer agent** with target code and patterns.

**Write tests** next to source files (`*.test.ts` or `*.test.tsx`).

---

## PHASE 3: VERIFY

```bash
npm run test -- [target]
```

**If fails** → fix tests, rerun.

**Report**:

```
Tests: [count] generated
Coverage: [%]
Files: [list]
```
