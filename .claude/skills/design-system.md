---
name: design-system
description: UI rules (spacing, colors, sizes, components)
model: haiku
triggers: ['ui rules', 'design system', 'component style', 'ui']
---

# Design System Rules

**Purpose**: Maintain consistent, accessible, minimalistic UI across Horyco Admin
**Stack**: Next.js + shadcn/ui + Tailwind CSS
**Style**: Minimalist, functional, semantic

---

## SPACING (4px Grid)

- Use only 4px-based spacing values (gap-1/2/4/6/8, never gap-3/5/7)
- `gap-1` (4px) - badge icons only
- `gap-1.5` (6px) - card header (title + description)
- `gap-2` (8px) - DEFAULT icon-text spacing in buttons
- `gap-4` (16px) - button groups, form field spacing
- `gap-6` (24px) - major section spacing
- `gap-8` (32px) - page-level breaks
- Cards: `py-4 gap-2` on Card, `px-2` on Header/Content
- Dialogs: `p-6 gap-4` on Content
- Forms: `space-y-4` between fields, `space-y-6` between sections
- FormItem: `grid gap-2` (default)

---

## TYPOGRAPHY

- `text-xs` (12px) - badges, timestamps only
- `text-sm` (14px) - UI default (buttons, labels, body text)
- `text-base` (16px) - mobile inputs ONLY (`text-base md:text-sm`)
- `text-lg` (18px) - dialog/card titles
- `text-xl` (20px) - section headings
- `text-3xl` (24px) - page headings only
- `font-medium` - labels, buttons
- `font-semibold` - card/dialog titles
- `font-bold` - page headings only
- `leading-none` - titles only
- Use `line-clamp-{n}` for truncation, not `overflow-hidden text-ellipsis`
- Descriptions: `text-sm text-muted-foreground`

---

## COLORS

- NEVER use hardcoded colors (`bg-red-500`, `text-gray-600`, `border-blue-300`)
- Backgrounds: `bg-background`, `bg-card`, `bg-muted`, `bg-primary`, `bg-destructive`, `bg-secondary`, `bg-accent`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive`, `text-card-foreground`, `text-primary-foreground`
- Borders: `border-border`, `border-input`, `border-primary`, `border-destructive`
- Primary color is `#fe4a49` (use via `bg-primary` token only)

---

## BUTTON

- Heights: `h-9` (default), `h-8` (sm), `h-10` (lg), `size-9` (icon)
- Icon-text spacing: `gap-2` (default)
- Icons inside buttons: `h-4 w-4`
- Loading buttons MUST show spinner + text change (`{isPending && <Loader2 />} {isPending ? 'Saving...' : 'Save'}`)
- Destructive actions: `variant="destructive"`
- Secondary actions: `variant="outline"`
- Text: `text-sm font-medium` (applied by default)

---

## INPUT

- Height: always `h-9`
- Mobile text: `text-base md:text-sm` (prevents iOS zoom)
- Padding: `px-3 py-1` (applied by default)
- Error inputs MUST have `aria-invalid={!!error}`
- Placeholders: `placeholder:text-muted-foreground` (default)
- File inputs: `file:text-sm file:font-medium` (default)

---

## CARD

- Base card: `py-4 gap-2`
- CardHeader/Content: `px-2`
- CardHeader: `gap-1.5` for title + description
- CardTitle: `font-semibold leading-none`
- Border radius: `rounded-xl`
- NO shadows - use borders only (`border`, not `shadow-lg`)
- Cards with images: `p-0` on Card, `p-3` on CardContent

---

## DIALOG

- Max width: `max-w-lg` (default), `max-w-2xl` (large forms)
- Content: `p-6 gap-4`
- DialogHeader: `gap-2`
- DialogFooter: `gap-2 flex-col-reverse sm:flex-row`
- DialogTitle: `text-lg font-semibold leading-none`
- Close button: `absolute top-4 right-4` (applied by default)

---

## FORM

- FormItem: `grid gap-2` (default)
- Form layout: `space-y-4` between fields
- Large sections: `space-y-6`
- Required fields: show red asterisk (`<span className="text-destructive">*</span>`)
- Error labels: `data-[error=true]:text-destructive` (automatic)
- Error messages: `text-destructive text-sm`
- Grid forms: `grid-cols-1 gap-4 md:grid-cols-2`
- Switch forms: `flex items-center justify-between rounded-lg border p-4`

---

## BADGE

- Text: `text-xs font-medium`
- Padding: `px-2 py-0.5`
- Icons: `size-3` with `gap-1`
- Border radius: `rounded-md`

---

## TABLE

- Header: `sticky top-0 z-10 bg-muted`
- TableHead/TableCell: `px-2`
- Empty state: `colSpan={columns.length} className="h-24 text-center"`
- Wrap in `<ScrollArea>` with `<ScrollBar orientation="horizontal" />`

---

## RESPONSIVE DESIGN

- ALWAYS mobile-first (`p-4 md:px-6`, not `px-6 md:p-4`)
- Input text: `text-base md:text-sm`
- Grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Flex: `flex-col md:flex-row`
- Hide on mobile: `hidden md:flex`
- Page padding: `p-4 md:px-6`

---

## STATE PATTERNS

- Loading spinners: `<BaseLoading className="py-2" />`
- Page loading: use `<BaseLoading className="py-14" />`
- Error states: use `<BaseError className="py-10" message="..." onRetry={fn} />`
- Focus rings: `focus-visible:ring-[3px] focus-visible:ring-ring/50`
- Focus borders: `focus-visible:border-ring`
- Error rings: `aria-invalid:ring-destructive/20`
- Error borders: `aria-invalid:border-destructive`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

---

## ICONS

- Default size: `h-4 w-4`
- Badge icons: `size-3`
- Large icons (errors): `h-12 w-12`
- Loading spinners: `h-8 w-8`
- Icons always: `pointer-events-none shrink-0`

---

## ANIMATIONS

- Transitions: `transition-all`
- Dialog animations: `data-[state=open]:animate-in data-[state=closed]:animate-out`
- Hover scales: `transition-transform group-hover:scale-105`
- Duration: `duration-200`
- Loading: `animate-spin`

---

## ACCESSIBILITY

- Interactive elements MUST have `focus-visible:ring-[3px] focus-visible:ring-ring/50`
- Error inputs MUST have `aria-invalid={!!error}`
- Form controls MUST have `aria-describedby`
- Dialogs MUST have `aria-labelledby` (via DialogTitle)
- Close buttons MUST have `<span className="sr-only">Close</span>`
- Touch targets MUST be ≥44x44px (min `size-9` for icon buttons)

---

## ANTI-PATTERNS (AUTO-REJECT)

- ❌ Hardcoded colors (`bg-red-500`, `text-gray-600`)
- ❌ Shadow classes (`shadow-md`, `shadow-lg`)
- ❌ Off-grid spacing (`gap-5`, `p-7`, `space-y-5`)
- ❌ Desktop-first responsive (`px-6 md:p-4`)
- ❌ Missing focus rings on interactive elements
- ❌ Mobile inputs without `text-base md:text-sm`
- ❌ Missing loading states on async buttons
- ❌ Missing `aria-invalid` on error inputs
- ❌ Custom loading/error components (use BaseLoading/BaseError)
- ❌ Wrong input height (must be `h-9`)
- ❌ Wrong button icon size (must be `h-4 w-4`)
- ❌ Card shadows (use borders only)
- ❌ Missing required field indicators
- ❌ Empty state without proper messaging

---

**Apply every rule on every UI component. No exceptions.**

## Always use shadcn ui components from shared layer.
