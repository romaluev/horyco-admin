# Inventory Management - Complete Implementation Plan

## Overview

This plan covers building all missing UI components to achieve 100% documentation compliance.
The entities layer (types, API, queries, mutations) is **already complete**.

---

## Phase 1: Purchase Order Workflow (Priority: CRITICAL)

### 1.1 Purchase Order Detail Page

**Path:** `src/app/dashboard/inventory/purchase-orders/[id]/page.tsx`

**Components:**
- Header with PO number, status badge, action buttons
- Summary section (supplier, dates, totals)
- Items table (editable for draft)
- Receives history (for sent/partial/received)
- Cancel dialog with reason input

**Actions by Status:**
| Status | Available Actions |
|--------|-------------------|
| draft | Edit, Add/Remove Items, Delete, Send |
| sent | Receive, Cancel |
| partial | Receive More, Cancel |
| received | View Only |
| cancelled | View Only |

### 1.2 Features to Create

**Path:** `src/features/purchase-order-workflow/`

Components:
- `SendPODialog` - Confirm sending to supplier
- `ReceivePODialog` - Enter received quantities per item
- `CancelPODialog` - Enter cancellation reason
- `POItemForm` - Add/edit item in draft PO

### 1.3 Update List Page

- Enable "Open" button with navigation to detail page
- Add row actions dropdown (Send, Cancel shortcuts)

---

## Phase 2: Inventory Count Workflow (Priority: CRITICAL)

### 2.1 Inventory Count Detail Page

**Path:** `src/app/dashboard/inventory/counts/[id]/page.tsx`

**Components:**
- Header with count number, type badge, status badge
- Progress bar (X of Y items counted)
- Variance summary card (shortage/surplus totals)
- Counting table with inline quantity entry
- Action buttons based on status

**Actions by Status:**
| Status | Available Actions |
|--------|-------------------|
| in_progress | Count Items, Add Items, Complete, Cancel |
| pending_approval | Approve, Reject, Cancel |
| completed | View Only |
| cancelled | View Only |

### 2.2 Features to Create

**Path:** `src/features/inventory-count-workflow/`

Components:
- `CountItemEntry` - Inline counting row with quantity input
- `CompleteCountDialog` - Confirm completion with variance preview
- `ApproveCountDialog` - Confirm approval with stock adjustment preview
- `RejectCountDialog` - Enter rejection reason
- `AddCountItemDialog` - Add item to count

### 2.3 Update List Page

- Enable "Open" button with navigation to detail page

---

## Phase 3: Writeoff Workflow (Priority: HIGH)

### 3.1 Writeoff Detail Page

**Path:** `src/app/dashboard/inventory/writeoffs/[id]/page.tsx`

**Components:**
- Header with writeoff number, reason badge, status badge
- Items table with quantity and value
- Total value summary
- Approval threshold indicator
- Action buttons based on status

**Actions by Status:**
| Status | Available Actions |
|--------|-------------------|
| draft | Edit, Add/Remove Items, Delete, Submit |
| pending | Approve, Reject |
| approved | View Only |
| rejected | Edit, Resubmit |

### 3.2 Features to Create

**Path:** `src/features/writeoff-workflow/`

Components:
- `SubmitWriteoffDialog` - Confirm submission for approval
- `ApproveWriteoffDialog` - Confirm approval
- `RejectWriteoffDialog` - Enter rejection reason
- `WriteoffItemForm` - Add/edit item

### 3.3 Update List Page

- Enable "Open" button with navigation to detail page

---

## Phase 4: Production Order Workflow (Priority: HIGH)

### 4.1 Production Order Detail Page

**Path:** `src/app/dashboard/inventory/production/[id]/page.tsx`

**Components:**
- Header with production number, status badge
- Recipe info (linked recipe, output item)
- Planned vs actual quantities
- Ingredients table (required vs available)
- Cost breakdown
- Action buttons based on status

**Actions by Status:**
| Status | Available Actions |
|--------|-------------------|
| planned | Edit, Start, Cancel |
| in_progress | Complete, Cancel |
| completed | View Only |
| cancelled | View Only |

### 4.2 Features to Create

**Path:** `src/features/production-workflow/`

Components:
- `StartProductionDialog` - Confirm ingredient deduction
- `CompleteProductionDialog` - Enter actual quantity produced
- `CancelProductionDialog` - Confirm cancellation

### 4.3 Update List Page

- Enable "Open" button with navigation to detail page

---

## Phase 5: Recipe Management (Priority: HIGH)

### 5.1 Recipe Detail Page

**Path:** `src/app/dashboard/inventory/recipes/[id]/page.tsx`

**Components:**
- Header with recipe name, linked entity, status
- Output info (quantity, unit)
- Ingredients table (editable)
- Cost breakdown (per ingredient + total)
- Margin calculation (if linked to product)
- Action buttons (Edit, Duplicate, Recalculate Cost, Delete)

### 5.2 Features to Create

**Path:** `src/features/recipe-management/`

Components:
- `RecipeEditForm` - Edit recipe header
- `AddIngredientDialog` - Add ingredient to recipe
- `EditIngredientDialog` - Edit ingredient quantity/waste
- `DuplicateRecipeDialog` - Enter new name
- `RecipeCostSummary` - Cost breakdown display

### 5.3 Update List Page

- Enable "Change" button with navigation to detail page

---

## Phase 6: Supplier Item Catalog (Priority: MEDIUM)

### 6.1 Supplier Detail Enhancement

**Path:** Update `src/app/dashboard/inventory/suppliers/page.tsx`

Add tabs to supplier detail view:
- **Info** - Existing supplier info
- **Items & Prices** - Catalog of items this supplier provides
- **Orders** - Purchase orders with this supplier
- **Price History** - Historical price changes

### 6.2 Features to Create

**Path:** `src/features/supplier-items/`

Components:
- `SupplierItemsTable` - List items with prices
- `AddSupplierItemDialog` - Link item to supplier
- `EditSupplierItemDialog` - Update price/SKU
- `PriceHistoryTable` - Historical prices

---

## Phase 7: Item Unit Conversions (Priority: MEDIUM)

### 7.1 Update Item Detail

Add unit conversions section to item edit dialog/page.

### 7.2 Features to Create

**Path:** `src/features/item-conversions/`

Components:
- `ItemConversionsSection` - Display current conversions
- `AddConversionDialog` - Add new conversion
- `DeleteConversionButton` - Remove conversion

---

## Phase 8: Dashboard Enhancements (Priority: MEDIUM)

### 8.1 New Dashboard Widgets

**Path:** `src/widgets/inventory-dashboard/ui/`

New widgets:
- `PendingApprovalsWidget` - Writeoffs + counts needing approval
- `UpcomingDeliveriesWidget` - POs with expected delivery dates
- `ProductionScheduleWidget` - Today's planned production

### 8.2 Add Queries

May need to add:
- `useGetPendingApprovals()` - Aggregate pending items
- `useTodayProduction()` - Today's production orders

---

## Phase 9: List Enhancements (Priority: LOW)

### 9.1 Common Improvements

For all list pages:
- Pagination controls (page size selector, navigation)
- Column sorting (click header to sort)
- Date range filters
- Export to CSV button

### 9.2 Shared Components

**Path:** `src/shared/ui/`

Components:
- `DataTablePagination` - Reusable pagination
- `SortableTableHeader` - Click to sort
- `DateRangeFilter` - From/to date picker
- `ExportButton` - Download as CSV

---

## File Structure Summary

```
src/
├── app/dashboard/inventory/
│   ├── purchase-orders/
│   │   └── [id]/
│   │       └── page.tsx         # NEW
│   ├── counts/
│   │   └── [id]/
│   │       └── page.tsx         # NEW
│   ├── writeoffs/
│   │   └── [id]/
│   │       └── page.tsx         # NEW
│   ├── production/
│   │   └── [id]/
│   │       └── page.tsx         # NEW
│   └── recipes/
│       └── [id]/
│           └── page.tsx         # NEW
│
├── features/
│   ├── purchase-order-workflow/  # NEW
│   │   ├── ui/
│   │   │   ├── send-po-dialog.tsx
│   │   │   ├── receive-po-dialog.tsx
│   │   │   ├── cancel-po-dialog.tsx
│   │   │   └── po-item-form.tsx
│   │   └── index.ts
│   │
│   ├── inventory-count-workflow/ # NEW
│   │   ├── ui/
│   │   │   ├── count-item-entry.tsx
│   │   │   ├── complete-count-dialog.tsx
│   │   │   ├── approve-count-dialog.tsx
│   │   │   ├── reject-count-dialog.tsx
│   │   │   └── add-count-item-dialog.tsx
│   │   └── index.ts
│   │
│   ├── writeoff-workflow/        # NEW
│   │   ├── ui/
│   │   │   ├── submit-writeoff-dialog.tsx
│   │   │   ├── approve-writeoff-dialog.tsx
│   │   │   ├── reject-writeoff-dialog.tsx
│   │   │   └── writeoff-item-form.tsx
│   │   └── index.ts
│   │
│   ├── production-workflow/      # NEW
│   │   ├── ui/
│   │   │   ├── start-production-dialog.tsx
│   │   │   ├── complete-production-dialog.tsx
│   │   │   └── cancel-production-dialog.tsx
│   │   └── index.ts
│   │
│   ├── recipe-management/        # NEW
│   │   ├── ui/
│   │   │   ├── add-ingredient-dialog.tsx
│   │   │   ├── edit-ingredient-dialog.tsx
│   │   │   ├── duplicate-recipe-dialog.tsx
│   │   │   └── recipe-cost-summary.tsx
│   │   └── index.ts
│   │
│   ├── supplier-items/           # NEW
│   │   ├── ui/
│   │   │   ├── supplier-items-table.tsx
│   │   │   ├── add-supplier-item-dialog.tsx
│   │   │   └── price-history-table.tsx
│   │   └── index.ts
│   │
│   └── item-conversions/         # NEW
│       ├── ui/
│       │   ├── item-conversions-section.tsx
│       │   └── add-conversion-dialog.tsx
│       └── index.ts
│
├── widgets/inventory-dashboard/ui/
│   ├── pending-approvals-widget.tsx   # NEW
│   ├── upcoming-deliveries-widget.tsx # NEW
│   └── production-schedule-widget.tsx # NEW
│
└── entities/
    ├── purchase-order/ui/
    │   └── po-items-table.tsx    # NEW
    ├── inventory-count/ui/
    │   └── count-items-table.tsx # NEW
    ├── writeoff/ui/
    │   └── writeoff-items-table.tsx # NEW
    ├── production-order/ui/
    │   └── production-ingredients-table.tsx # NEW
    └── recipe/ui/
        └── recipe-ingredients-table.tsx # NEW
```

---

## Implementation Order

1. **Phase 1: Purchase Orders** - Most critical for receiving inventory
2. **Phase 2: Inventory Counts** - Essential for stock accuracy
3. **Phase 3: Writeoffs** - Needed for loss tracking
4. **Phase 4: Production** - Required for semi-finished goods
5. **Phase 5: Recipes** - Needed for production and cost analysis
6. **Phase 6-7: Supplier Items & Conversions** - Supporting features
7. **Phase 8-9: Dashboard & Lists** - Quality of life improvements

---

## Shared Patterns to Follow

### Detail Page Structure
```tsx
export default function DetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const { data, isLoading } = useEntityById(id)

  if (isLoading) return <BaseLoading />
  if (!data) return <BaseError message="Not found" />

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        {/* Header with back button, title, action buttons */}
        {/* Content sections */}
      </div>
    </PageContainer>
  )
}
```

### Workflow Dialog Structure
```tsx
interface WorkflowDialogProps {
  entityId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function WorkflowDialog({ entityId, open, onOpenChange, onSuccess }: WorkflowDialogProps) {
  const mutation = useWorkflowMutation()

  const handleSubmit = () => {
    mutation.mutate(entityId, {
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* Content */}
    </AlertDialog>
  )
}
```

### Action Buttons Pattern
```tsx
// Only show actions based on status
{status === 'draft' && (
  <Button onClick={handleSend}>
    <Send className="h-4 w-4 mr-2" />
    Отправить
  </Button>
)}
{(status === 'sent' || status === 'partial') && (
  <Button onClick={handleReceive}>
    <Package className="h-4 w-4 mr-2" />
    Принять товары
  </Button>
)}
```

---

## Testing Checklist

After each phase, verify:

- [ ] List page "Open" button navigates to detail page
- [ ] Detail page loads data correctly
- [ ] All workflow actions work
- [ ] Status transitions are correct
- [ ] Toast notifications show on success/error
- [ ] Back navigation works
- [ ] Mobile responsive design
- [ ] No TypeScript errors
- [ ] No ESLint errors
