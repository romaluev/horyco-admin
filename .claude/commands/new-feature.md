Implement new feature i will provide you the documentation of the feature and you should implement it with 100% reflection of the documentation. Btw you should follow all standards and skills..

Docs: $ARGUMENTS

## Workflow

plan → implement → test → validate

---

## Phase 1: Plan

**Load context**:

- `.claude/skills/core.md`
- `.claude/skills/design-system.md`
- `.claude/skills/project-index.md`
- `.claude/standards/architecture.md`
- `.claude/standards/next.md`

**Read the docs&prompts** i've provided.

**If you have any questions ask me before starting**

- Plan the architecture.
- Plan design system & ui kit component usage
- Plan the actual implementation following all standards&docs.

---

## Phase 2: Implement

**Execute**:

- Implement the feature following all rules (use todo list for clarity)
- Don't hurry. Take your time. I want to get the best result you can give.

---

## Phase 3: Validate

**Run**:

```bash
npm run type-check
npm run lint
npm run test
```

**If errors**: fix and re-run

---

## Success Criteria

- All files created
- Design system followed (no borders, shadows, CSS Modules)
- Architecture followed (feature structure, state management)
- Quality gates passed (tsc, eslint, tests ≥80%)

See `.claude/standards/` for detailed rules.
