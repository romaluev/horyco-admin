Create semantic commit for changes.

Hint: $ARGUMENTS

---

## PHASE 1: ANALYZE

```bash
git status
git diff
git diff --staged
```

**Identify**:

- What changed
- Type: `feat|fix|refactor|docs|test|chore`
- Scope: affected component/feature

---

## PHASE 2: MESSAGE

**Format**: `type(scope): description`

**Rules**:

- Imperative mood ("add" not "added")
- Max 72 chars first line
- Body for complex changes only

---

## PHASE 3: COMMIT

```bash
git add [relevant files]
git commit -m "[message]"
```

**Report**:

```
Committed: [hash]
Type: [type]
Files: [count]
Message: [message]
```
