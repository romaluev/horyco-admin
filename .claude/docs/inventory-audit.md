# Inventory Management - Implementation Audit

## Executive Summary

The current implementation covers **~40%** of the documented functionality. Basic list views and create operations exist, but **workflow management, detail pages, and advanced features are largely missing**.

---

## Implementation Status Overview

| Module | List View | Create | Detail/Edit | Workflow Actions | Status |
|--------|-----------|--------|-------------|------------------|--------|
| Dashboard | ✅ | - | - | - | 70% |
| Items | ✅ | ✅ | ✅ | - | 90% |
| Stock | ✅ | - | - | ✅ Adjust | 80% |
| Movements | ✅ | - | - | - | 100% |
| Suppliers | ✅ | ✅ | ✅ | - | 60% |
| Purchase Orders | ✅ | ✅ | ❌ | ❌ | 30% |
| Recipes | ✅ | ✅ | ❌ | - | 40% |
| Counts | ✅ | ✅ | ❌ | ❌ | 25% |
| Writeoffs | ✅ | ✅ | ❌ | ❌ | 25% |
| Production | ✅ | ✅ | ❌ | ❌ | 25% |

---

## Priority 1: Critical Missing Features (Must Have)

### 1.1 Purchase Order Detail Page & Workflow

**Status:** Only list view and create dialog exist. No detail page.

**Missing:**
- [ ] Detail page showing PO header, items, and receives
- [ ] "Send to Supplier" action (draft → sent)
- [ ] "Receive Items" dialog with quantity entry per item
- [ ] Support for partial receives
- [ ] "Cancel PO" action with reason
- [ ] Status timeline showing workflow history
- [ ] Edit functionality for draft POs
- [ ] Delete functionality for draft POs

**API Hooks Needed:**
```typescript
// Mutations to add in src/entities/purchase-order/model/mutations.ts
useSendPurchaseOrder(id)           // POST /purchase-orders/:id/send
useReceivePurchaseOrder(id, data)  // POST /purchase-orders/:id/receive
useCancelPurchaseOrder(id, reason) // POST /purchase-orders/:id/cancel
useUpdatePurchaseOrder(id, data)   // PATCH /purchase-orders/:id
useDeletePurchaseOrder(id)         // DELETE /purchase-orders/:id
useAddPOItem(id, item)             // POST /purchase-orders/:id/items
useUpdatePOItem(id, itemId, data)  // PATCH /purchase-orders/:id/items/:itemId
useDeletePOItem(id, itemId)        // DELETE /purchase-orders/:id/items/:itemId
```

**UI Components Needed:**
- `PurchaseOrderDetailPage` - Full page with tabs
- `POReceiveDialog` - Modal for receiving items
- `POStatusBadge` - Already exists, needs action buttons
- `POTimeline` - Workflow history visualization
- `POItemsTable` - Editable items grid for draft POs

---

### 1.2 Inventory Count Detail Page & Workflow

**Status:** Only list view and create dialog exist. No counting interface.

**Missing:**
- [ ] Detail page showing count header and items
- [ ] Counting interface with system vs counted quantity entry
- [ ] "Complete Count" action (in_progress → pending_approval)
- [ ] "Approve Count" action (creates stock adjustments)
- [ ] "Reject Count" action with reason (back to in_progress)
- [ ] "Cancel Count" action
- [ ] Variance summary display
- [ ] Progress indicator (X of Y items counted)

**API Hooks Needed:**
```typescript
// Mutations to add in src/entities/inventory-count/model/mutations.ts
useCompleteCount(id)              // POST /counts/:id/complete
useSubmitCount(id)                // POST /counts/:id/submit
useApproveCount(id)               // POST /counts/:id/approve
useRejectCount(id, reason)        // POST /counts/:id/reject
useCancelCount(id)                // POST /counts/:id/cancel
useAddCountItem(id, item)         // POST /counts/:id/items
useUpdateCountItem(id, itemId, data) // PATCH /counts/:id/items/:itemId
```

**UI Components Needed:**
- `InventoryCountDetailPage` - Full counting interface
- `CountItemEntry` - Row component for quantity entry
- `CountVarianceSummary` - Shows shortage/surplus totals
- `CountProgressBar` - Visual progress indicator
- `CountApprovalDialog` - Confirmation with variance summary

---

### 1.3 Writeoff Detail Page & Workflow

**Status:** Only list view and create dialog exist. No approval workflow.

**Missing:**
- [ ] Detail page showing writeoff items and status
- [ ] "Submit for Approval" action (when > threshold)
- [ ] "Approve Writeoff" action (creates stock movements)
- [ ] "Reject Writeoff" action with reason
- [ ] Edit items for pending writeoffs
- [ ] Approval threshold indicator

**API Hooks Needed:**
```typescript
// Mutations to add in src/entities/writeoff/model/mutations.ts
useSubmitWriteoff(id)             // POST /writeoffs/:id/submit
useApproveWriteoff(id)            // POST /writeoffs/:id/approve
useRejectWriteoff(id, reason)     // POST /writeoffs/:id/reject
useUpdateWriteoff(id, data)       // PATCH /writeoffs/:id
useDeleteWriteoff(id)             // DELETE /writeoffs/:id
useAddWriteoffItem(id, item)      // POST /writeoffs/:id/items
useDeleteWriteoffItem(id, itemId) // DELETE /writeoffs/:id/items/:itemId
```

**UI Components Needed:**
- `WriteoffDetailPage` - Shows items and approval status
- `WriteoffApprovalBanner` - Shows if requires approval
- `WriteoffApproveDialog` - Confirmation dialog
- `WriteoffRejectDialog` - With reason input

---

### 1.4 Production Order Detail Page & Workflow

**Status:** Only list view and create dialog exist. No production workflow.

**Missing:**
- [ ] Detail page showing production order and ingredients
- [ ] "Start Production" action (deducts ingredients)
- [ ] "Complete Production" action with actual quantity
- [ ] "Cancel Production" action (reverses if started)
- [ ] Ingredient availability check display
- [ ] Cost calculation display

**API Hooks Needed:**
```typescript
// Mutations to add in src/entities/production-order/model/mutations.ts
useStartProduction(id)                    // POST /production/:id/start
useCompleteProduction(id, quantity, notes) // POST /production/:id/complete
useCancelProduction(id, notes)            // POST /production/:id/cancel
```

**Queries to add:**
```typescript
useProductionStatistics(fromDate, toDate) // GET /production/statistics
useTodayProduction(warehouseId)           // GET /production/today
```

**UI Components Needed:**
- `ProductionOrderDetailPage` - Shows recipe, ingredients, costs
- `ProductionStartDialog` - Confirms ingredient deduction
- `ProductionCompleteDialog` - Enter actual quantity
- `ProductionIngredientsList` - Shows required vs available

---

## Priority 2: Important Missing Features

### 2.1 Recipe Management

**Status:** List view and basic create exist. No ingredient management.

**Missing:**
- [ ] Recipe detail/edit page
- [ ] Ingredient management (add/edit/delete)
- [ ] "Duplicate Recipe" action
- [ ] "Recalculate Cost" action
- [ ] Cost breakdown display
- [ ] Link to product/modifier/item

**API Hooks Needed:**
```typescript
// Mutations to add in src/entities/recipe/model/mutations.ts
useUpdateRecipe(id, data)                    // PATCH /recipes/:id
useDeleteRecipe(id)                          // DELETE /recipes/:id
useDuplicateRecipe(id, name)                 // POST /recipes/:id/duplicate
useRecalculateRecipeCost(id)                 // POST /recipes/:id/recalculate
useAddIngredient(recipeId, ingredient)       // POST /recipes/:id/ingredients
useUpdateIngredient(recipeId, ingredientId, data) // PATCH /recipes/:id/ingredients/:id
useDeleteIngredient(recipeId, ingredientId)  // DELETE /recipes/:id/ingredients/:id
```

**UI Components Needed:**
- `RecipeDetailPage` - Full recipe view with cost breakdown
- `RecipeIngredientsTable` - Editable ingredients list
- `AddIngredientDialog` - Select item and set quantity
- `RecipeCostSummary` - Shows total cost and margin

---

### 2.2 Supplier Item & Price Management

**Status:** Supplier CRUD exists. No item catalog management.

**Missing:**
- [ ] Supplier items tab/page
- [ ] Add item to supplier catalog
- [ ] Update item price
- [ ] Remove item from catalog
- [ ] Set preferred supplier for item
- [ ] Price history view

**API Hooks Needed:**
```typescript
// Already have useSupplierItems, useSupplierPriceHistory
// Need mutations:
useAddSupplierItem(supplierId, item)        // POST /suppliers/:id/items
useUpdateSupplierItem(supplierId, itemId, data) // PATCH /suppliers/:id/items/:itemId
useDeleteSupplierItem(supplierId, itemId)   // DELETE /suppliers/:id/items/:itemId
```

**UI Components Needed:**
- `SupplierItemsTab` - Tab in supplier detail
- `AddSupplierItemDialog` - Select item, set price
- `SupplierPriceHistoryTable` - Shows price changes

---

### 2.3 Item Unit Conversions

**Status:** Item CRUD exists. No conversion management UI.

**Missing:**
- [ ] Unit conversions section in item detail
- [ ] Add conversion dialog
- [ ] Delete conversion

**API Hooks Needed:**
```typescript
// Already have useGetItemConversions
// Need mutations:
useAddItemConversion(itemId, conversion)    // POST /items/:id/conversions
useDeleteItemConversion(itemId, conversionId) // DELETE /items/:id/conversions/:id
```

**UI Components Needed:**
- `ItemConversionsSection` - In item detail/edit
- `AddConversionDialog` - Set from/to units and factor

---

## Priority 3: Dashboard Enhancements

### 3.1 Missing Dashboard Widgets

**Currently have:**
- ✅ Stats cards (5 cards)
- ✅ Low stock items list
- ✅ Recent movements
- ✅ Stock alerts

**Missing:**
- [ ] Pending approvals widget (writeoffs + counts needing approval)
- [ ] Upcoming deliveries widget (POs with expected date)
- [ ] Production schedule widget (today's planned production)

**API Endpoints Needed:**
```typescript
// Queries to add
useGetPendingApprovals()     // Custom aggregation or multiple calls
useUpcomingDeliveries()      // Filter POs by status=sent and expectedDate
useTodayProduction()         // GET /production/today
```

---

## Priority 4: List View Enhancements

### 4.1 Missing List Features (All Modules)

**Missing across most lists:**
- [ ] Pagination controls (page size, navigation)
- [ ] Column sorting (click header to sort)
- [ ] Date range filters
- [ ] Export to CSV/Excel
- [ ] Bulk actions (select multiple, bulk delete/update)

**UI Components Needed:**
- `DataTablePagination` - Reusable pagination
- `SortableHeader` - Click to sort column
- `DateRangeFilter` - From/to date picker
- `ExportButton` - Download as CSV
- `BulkActionBar` - Shows when items selected

---

### 4.2 Missing Import Feature

**Documented but not implemented:**
- [ ] Import CSV for inventory items
- [ ] Preview imported data
- [ ] Validation errors display
- [ ] Conflict resolution (update vs skip)

**UI Components Needed:**
- `ImportItemsDialog` - File upload and preview
- `ImportPreviewTable` - Shows parsed data
- `ImportResultSummary` - Shows success/errors

---

## Priority 5: Quality of Life Improvements

### 5.1 Search & Filter Enhancements

**Missing:**
- [ ] Global search across all inventory modules
- [ ] Saved filters/presets
- [ ] Advanced filters (multiple conditions)

### 5.2 Navigation Improvements

**Missing:**
- [ ] Breadcrumbs on all pages
- [ ] Quick actions dropdown on list rows
- [ ] Keyboard shortcuts for common actions

### 5.3 Status History/Timeline

**Missing for workflow modules:**
- [ ] Timeline component showing status changes
- [ ] Who/when for each transition
- [ ] Notes/comments on transitions

---

## Implementation Roadmap

### Phase 1: Core Workflow Pages (Weeks 1-2)
1. Purchase Order detail page + receive workflow
2. Inventory Count detail page + counting interface
3. Writeoff detail page + approval workflow
4. Production Order detail page + start/complete

### Phase 2: Recipe & Supplier Management (Week 3)
1. Recipe detail page with ingredient management
2. Supplier items catalog management
3. Item unit conversions UI

### Phase 3: Dashboard & Lists (Week 4)
1. Dashboard pending approvals widget
2. Dashboard upcoming deliveries widget
3. Pagination on all lists
4. Export functionality

### Phase 4: Polish (Week 5)
1. Import CSV functionality
2. Column sorting
3. Status timeline components
4. Advanced filters

---

## File Structure for New Features

```
src/
├── app/dashboard/inventory/
│   ├── purchase-orders/
│   │   └── [id]/
│   │       └── page.tsx          # NEW: PO detail page
│   ├── counts/
│   │   └── [id]/
│   │       └── page.tsx          # NEW: Count detail page
│   ├── writeoffs/
│   │   └── [id]/
│   │       └── page.tsx          # NEW: Writeoff detail page
│   ├── production/
│   │   └── [id]/
│   │       └── page.tsx          # NEW: Production detail page
│   └── recipes/
│       └── [id]/
│           └── page.tsx          # NEW: Recipe detail page
│
├── features/
│   ├── purchase-order-receive/   # NEW: Receive workflow
│   ├── inventory-count-process/  # NEW: Counting workflow
│   ├── writeoff-approval/        # NEW: Approval workflow
│   ├── production-workflow/      # NEW: Start/complete workflow
│   └── recipe-ingredients/       # NEW: Ingredient management
│
├── entities/
│   ├── purchase-order/model/
│   │   └── mutations.ts          # ADD: send, receive, cancel mutations
│   ├── inventory-count/model/
│   │   └── mutations.ts          # ADD: complete, approve, reject mutations
│   ├── writeoff/model/
│   │   └── mutations.ts          # ADD: submit, approve, reject mutations
│   ├── production-order/model/
│   │   └── mutations.ts          # ADD: start, complete, cancel mutations
│   └── recipe/model/
│       └── mutations.ts          # ADD: duplicate, recalculate, ingredient mutations
│
└── widgets/
    └── inventory-dashboard/ui/
        ├── pending-approvals-widget.tsx    # NEW
        └── upcoming-deliveries-widget.tsx  # NEW
```

---

## API Endpoints Summary

### Currently Implemented (Queries Only)
| Entity | GET List | GET By ID | GET Related |
|--------|----------|-----------|-------------|
| Warehouses | ✅ | ✅ | ✅ stock-summary |
| Items | ✅ | ✅ | ✅ conversions, categories |
| Stock | ✅ | - | ✅ low, out, summary, alerts |
| Movements | ✅ | ✅ | - |
| Suppliers | ✅ | ✅ | ✅ items, price-history |
| PurchaseOrders | ✅ | ✅ | - |
| Recipes | ✅ | ✅ | ✅ ingredients |
| Counts | ✅ | ✅ | ✅ variance |
| Writeoffs | ✅ | ✅ | ⚠️ pending (missing) |
| Production | ✅ | ✅ | ⚠️ today, statistics (missing) |

### Missing Mutations (By Priority)

**P1 - Critical:**
- PO: send, receive, cancel, update, delete, addItem, updateItem, deleteItem
- Count: complete, submit, approve, reject, cancel, addItem, updateItem
- Writeoff: submit, approve, reject, update, delete, addItem, deleteItem
- Production: start, complete, cancel

**P2 - Important:**
- Recipe: update, delete, duplicate, recalculate, addIngredient, updateIngredient, deleteIngredient
- Supplier: addItem, updateItem, deleteItem
- Item: addConversion, deleteConversion

---

## Testing Checklist

After implementation, verify:

- [ ] PO can be created → sent → received (partial/full) → completed
- [ ] PO can be cancelled at any non-received state
- [ ] Count can be created → items counted → completed → approved
- [ ] Count approval creates stock adjustment movements
- [ ] Writeoff auto-approves below threshold
- [ ] Writeoff requires approval above threshold
- [ ] Production start deducts ingredients
- [ ] Production complete adds output to stock
- [ ] Recipe cost updates when ingredient prices change
- [ ] All workflows respect permission checks
