---
name: design-system
description: UI rules quick reference (spacing, colors, components)
model: haiku
triggers: ['ui rules', 'design system', 'component style', 'ui']
---

# Design System (Quick Reference)

Stack: Next.js + shadcn/ui + Tailwind
Style: Minimalist, no shadows, semantic colors

---

## SPACING (4px Grid)

| Value     | Use                        |
| --------- | -------------------------- |
| `gap-1`   | badge icons                |
| `gap-1.5` | card header                |
| `gap-2`   | icon-text (default)        |
| `gap-4`   | form fields, button groups |
| `gap-6`   | sections                   |

**Never use:** `gap-3`, `gap-5`, `gap-7` (off-grid)

---

## COLORS

**Only semantic tokens:**

```
bg-background, bg-card, bg-muted, bg-primary, bg-destructive
text-foreground, text-muted-foreground, text-primary, text-destructive
border-border, border-input, border-destructive
```

**Never hardcode:** `bg-red-500`, `text-gray-600`

---

## TYPOGRAPHY

| Size        | Use                |
| ----------- | ------------------ |
| `text-xs`   | badges, timestamps |
| `text-sm`   | default UI         |
| `text-base` | mobile inputs only |
| `text-lg`   | dialog/card titles |
| `text-3xl`  | page headings      |

**Mobile inputs:** `text-base md:text-sm` (prevents iOS zoom)

---

## COMPONENTS

**Button:**

- Height: `h-9` (default), `h-8` (sm), `size-9` (icon)
- Icons: `h-4 w-4`
- Loading: `{isPending && <Loader2 />} {isPending ? 'Saving...' : 'Save'}`

**Input:**

- Height: `h-9` always
- Text: `text-base md:text-sm`
- Error: `aria-invalid={!!error}`

**Card:**

- Structure: `py-4 gap-2`, header/content `px-2`
- NO shadows, borders only

**Dialog:**

- Content: `p-6 gap-4`
- Width: `max-w-lg`

---

## RESPONSIVE

**Always mobile-first:**

```
✓ p-4 md:px-6
✗ px-6 md:p-4
```

Common patterns:

- `flex-col md:flex-row`
- `grid-cols-1 md:grid-cols-2`
- `hidden md:flex`

---

## STATE PATTERNS

- Loading: `<BaseLoading />`
- Error: `<BaseError message="..." onRetry={fn} />`
- Focus: `focus-visible:ring-[3px] focus-visible:ring-ring/50`
- Disabled: `disabled:opacity-50`

---

## ANTI-PATTERNS (auto-reject)

```
hardcoded colors      → use semantic tokens
shadows               → use borders
off-grid spacing      → use 4px grid
desktop-first         → mobile-first
missing focus rings   → add focus-visible
h-10 inputs           → use h-9
custom loaders        → use BaseLoading
missing aria-invalid  → add to error inputs
```

---

**Use shadcn/ui from shared layer. No custom duplicates.**
