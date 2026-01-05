Create pull request with auto-description.

Target: $ARGUMENTS (default: main)

---

## PHASE 1: ANALYZE

```bash
git log main..HEAD --oneline
git diff main..HEAD --stat
```

**Identify**:

- Commits in branch
- Files changed
- Features/fixes included

---

## PHASE 2: GENERATE

**Title**: From branch name or commits

**Body**:

```markdown
## Summary

[1-3 bullets]

## Changes

[Key files/features]

## Testing

[How to verify]
```

---

## PHASE 3: CREATE

```bash
gh pr create --title "[title]" --body "[body]"
```

**Report**:

```
PR: [url]
Title: [title]
Changes: [count] files
```
