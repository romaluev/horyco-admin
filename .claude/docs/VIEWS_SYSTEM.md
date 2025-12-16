# Views System - Frontend Specification

This document defines the Linear-style saved views system for Analytics pages.

---

## Quick Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VIEWS SYSTEM OVERVIEW                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (Views List)           │  MAIN CONTENT                         │
│                                │                                        │
│  ┌───────────────────────┐     │  ┌────────────────────────────────┐   │
│  │ 📊 Orders             │ ◄───│──│ Header: View name + controls   │   │
│  │   ├─ All Orders       │     │  ├────────────────────────────────┤   │
│  │   ├─ ⭐ High Value    │     │  │ Toolbar: Filters, Group, Sort  │   │
│  │   ├─ Refunded         │     │  ├────────────────────────────────┤   │
│  │   └─ + New View       │     │  │                                │   │
│  ├───────────────────────┤     │  │ Data Table / Chart             │   │
│  │ 📦 Products           │     │  │                                │   │
│  │   ├─ Top Sellers      │     │  │                                │   │
│  │   └─ Low Performers   │     │  │                                │   │
│  └───────────────────────┘     │  └────────────────────────────────┘   │
│                                │                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Core Concepts

### What is a View?

A **View** is a saved configuration of:

- **Timeframe** - Date range (Today, Yesterday, Last 7 days, Custom)
- **Filters** - What data to include (status, source, staff, etc.)
- **Columns** - Which fields to display
- **Grouping** - How to aggregate (by day, product, staff)
- **Sorting** - Order of results
- **Display** - Table or chart mode

### View Types

| Type     | Description                       | Icon | Example                |
| -------- | --------------------------------- | ---- | ---------------------- |
| Default  | System-created, cannot be deleted | -    | "All Orders"           |
| Personal | Created by user, only they see    | 👤   | "My High Value Orders" |
| Pinned   | Personal, shows at top            | ⭐   | Quick access views     |
| Shared   | Created by admin, visible to all  | 🔗   | "Refund Review"        |

### Premium Gating

| Feature             | Free  | Premium   |
| ------------------- | ----- | --------- |
| Default views       | ✓     | ✓         |
| Create custom views | 3 max | Unlimited |
| Share views         | ✗     | ✓         |
| Pin views           | ✗     | ✓         |

---

## UI Components

### 1. Views Sidebar

```
┌─────────────────────────────────┐
│ 📊 Orders                    ▼  │  <- Collapsible section
├─────────────────────────────────┤
│   All Orders                    │  <- Default (no icon)
│   ⭐ High Value                 │  <- Pinned
│   🔗 Refunds Review             │  <- Shared
│   My Custom View                │  <- Personal
├─────────────────────────────────┤
│   + New View                    │  <- Create action
└─────────────────────────────────┘
```

#### States

**Active view:**

```
│ ▶ All Orders                  │  <- Highlighted, arrow indicator
```

**Hover:**

```
│   My Custom View       ⋮      │  <- Show menu icon on hover
```

**Dragging (reorder):**

```
│ ═══════════════════════       │  <- Drag placeholder
│   My Custom View              │  <- Being dragged (elevated)
```

### 2. View Header

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  All Orders                                           [Save] [⋮ More]   │
│  Showing 234 orders                                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Header Actions

| Action    | Button           | Condition                  |
| --------- | ---------------- | -------------------------- |
| Save      | `[Save]`         | Show when config changed   |
| Save As   | Menu → Save As   | Always                     |
| Rename    | Menu → Rename    | Personal/Shared views only |
| Duplicate | Menu → Duplicate | Always                     |
| Delete    | Menu → Delete    | Personal views only        |
| Share     | Menu → Share     | Premium + admin only       |
| Pin/Unpin | Menu → Pin       | Premium only               |

### 3. Filter Toolbar

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [Today ▼]  [All Status ▼]  [All Sources ▼]  [+ Add Filter]   [Clear]   │
│                                                                          │
│  Active: Status = Completed, Source = POS                    [Group ▼]   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Filter Dropdown

```
┌───────────────────────────┐
│ Status                    │
├───────────────────────────┤
│ ☑ Completed               │
│ ☐ Cancelled               │
│ ☐ Refunded                │
│ ☐ Pending                 │
├───────────────────────────┤
│ [Clear] [Apply]           │
└───────────────────────────┘
```

### 4. Column Selector

```
┌───────────────────────────┐
│ Columns                   │
├───────────────────────────┤
│ ☑ Order #                 │
│ ☑ Date                    │
│ ☑ Customer                │
│ ☑ Total                   │
│ ☐ Items Count             │
│ ☐ Payment Method          │
│ ☐ Staff                   │
│ ☐ Source                  │
├───────────────────────────┤
│ [Reset to Default]        │
└───────────────────────────┘
```

### 5. Group By Selector

```
┌───────────────────────────┐
│ Group By                  │
├───────────────────────────┤
│ ○ None                    │
│ ○ Day                     │
│ ○ Week                    │
│ ○ Month                   │
│ ○ Product                 │
│ ○ Category                │
│ ○ Staff                   │
│ ○ Source                  │
└───────────────────────────┘
```

### 6. Display Toggle

```
┌─────────────────┐
│ [📊] [📈]       │  <- Table / Chart toggle
└─────────────────┘
```

---

## View Config Schema

### TypeScript Interface

```typescript
interface ViewConfig {
  // Time range
  timeframe: {
    type:
      | 'TODAY'
      | 'YESTERDAY'
      | 'LAST_7_DAYS'
      | 'LAST_30_DAYS'
      | 'THIS_MONTH'
      | 'LAST_MONTH'
      | 'CUSTOM'
    customStart?: string // ISO date, only if type = CUSTOM
    customEnd?: string // ISO date, only if type = CUSTOM
  }

  // Filters
  filters: Filter[]

  // Columns to display
  columns: string[]

  // Grouping
  groupBy?:
    | 'DAY'
    | 'WEEK'
    | 'MONTH'
    | 'PRODUCT'
    | 'CATEGORY'
    | 'STAFF'
    | 'SOURCE'
    | 'PAYMENT_METHOD'

  // Sorting
  sorting: {
    field: string
    direction: 'ASC' | 'DESC'
  }

  // Display mode
  display: 'TABLE' | 'CHART'

  // Chart settings (if display = CHART)
  chartType?: 'LINE' | 'BAR' | 'PIE'

  // Comparison enabled
  compareEnabled: boolean
}

interface Filter {
  field: string // e.g., 'status', 'source', 'staffId'
  operator:
    | 'eq'
    | 'ne'
    | 'in'
    | 'notIn'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'between'
  value: any // string, number, array, or { from, to }
}
```

### Example Config

```json
{
  "timeframe": {
    "type": "LAST_7_DAYS"
  },
  "filters": [
    { "field": "status", "operator": "eq", "value": "COMPLETED" },
    { "field": "source", "operator": "in", "value": ["pos", "web"] }
  ],
  "columns": [
    "orderNumber",
    "createdAt",
    "customerName",
    "total",
    "paymentMethod"
  ],
  "groupBy": null,
  "sorting": {
    "field": "createdAt",
    "direction": "DESC"
  },
  "display": "TABLE",
  "compareEnabled": false
}
```

---

## User Flows

### Flow 1: Create New View

```
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User clicks "+ New View"                                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────┐                                 │
│  │ Create New View                   │                                 │
│  ├───────────────────────────────────┤                                 │
│  │                                   │                                 │
│  │ Name:                             │                                 │
│  │ ┌───────────────────────────────┐ │                                 │
│  │ │ High Value Orders             │ │                                 │
│  │ └───────────────────────────────┘ │                                 │
│  │                                   │                                 │
│  │ Start from:                       │                                 │
│  │ ○ Blank view                      │                                 │
│  │ ● Current filters                 │  <- Copy current config         │
│  │ ○ Existing view: [Select ▼]       │                                 │
│  │                                   │                                 │
│  │           [Cancel] [Create]       │                                 │
│  │                                   │                                 │
│  └───────────────────────────────────┘                                 │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ STEP 2: View is created and activated                                  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Sidebar:                          Main content:                        │
│  ┌───────────────────────────┐     ┌────────────────────────────────┐  │
│  │   All Orders              │     │ High Value Orders    [Save] [⋮]│  │
│  │ ▶ High Value Orders       │ ◄───│ Showing 45 orders              │  │
│  │   + New View              │     │                                │  │
│  └───────────────────────────┘     └────────────────────────────────┘  │
│                                                                         │
│  Toast: "View created successfully"                                     │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### Flow 2: Modify and Save View

```
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User modifies filters                                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Header shows unsaved indicator:                                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ High Value Orders •              [Save] [Discard] [⋮ More]     │    │
│  │ Showing 32 orders                                              │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                           ↑                                             │
│                     Unsaved dot                                         │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ STEP 2: User clicks Save                                               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  - API call: updateView(id, config)                                    │
│  - Remove unsaved indicator                                            │
│  - Toast: "View saved"                                                 │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### Flow 3: Delete View

```
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User opens view menu, clicks Delete                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────┐                                 │
│  │ Delete View?                      │                                 │
│  ├───────────────────────────────────┤                                 │
│  │                                   │                                 │
│  │ Are you sure you want to delete   │                                 │
│  │ "High Value Orders"?              │                                 │
│  │                                   │                                 │
│  │ This action cannot be undone.     │                                 │
│  │                                   │                                 │
│  │           [Cancel] [Delete]       │                                 │
│  │                                   │                                 │
│  └───────────────────────────────────┘                                 │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ STEP 2: View deleted, navigate to default                              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  - API call: deleteView(id)                                            │
│  - Remove from sidebar                                                 │
│  - Navigate to "All Orders" (default)                                  │
│  - Toast: "View deleted"                                               │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## GraphQL API

### Get Views for Page

```graphql
query GetViews($pageCode: String!) {
  views(pageCode: $pageCode) {
    id
    name
    pageCode
    isDefault
    isPinned
    isShared
    createdBy
    config
    createdAt
    updatedAt
  }
}
```

### Create View

```graphql
mutation CreateView($input: CreateViewInput!) {
  createView(input: $input) {
    id
    name
    pageCode
    config
  }
}

# Input
input CreateViewInput {
  pageCode: String!
  name: String!
  config: JSON!
}
```

### Update View

```graphql
mutation UpdateView($id: ID!, $input: UpdateViewInput!) {
  updateView(id: $id, input: $input) {
    id
    name
    config
    updatedAt
  }
}

# Input
input UpdateViewInput {
  name: String
  config: JSON
  isPinned: Boolean
  isShared: Boolean
}
```

### Delete View

```graphql
mutation DeleteView($id: ID!) {
  deleteView(id: $id) {
    success
  }
}
```

---

## State Management

### Store Structure (Pinia)

```typescript
// stores/analytics/views.ts

interface ViewsState {
  // All views for current page
  views: View[]

  // Currently active view
  activeViewId: string | null

  // Working config (may have unsaved changes)
  workingConfig: ViewConfig | null

  // Original config (for detecting changes)
  savedConfig: ViewConfig | null

  // Loading states
  loading: boolean
  saving: boolean
}

export const useViewsStore = defineStore('views', {
  state: (): ViewsState => ({
    views: [],
    activeViewId: null,
    workingConfig: null,
    savedConfig: null,
    loading: false,
    saving: false,
  }),

  getters: {
    activeView: (state) => state.views.find((v) => v.id === state.activeViewId),
    hasUnsavedChanges: (state) =>
      !isEqual(state.workingConfig, state.savedConfig),
    defaultViews: (state) => state.views.filter((v) => v.isDefault),
    pinnedViews: (state) =>
      state.views.filter((v) => v.isPinned && !v.isDefault),
    personalViews: (state) =>
      state.views.filter((v) => !v.isDefault && !v.isPinned),
  },

  actions: {
    async loadViews(pageCode: string) {
      /* ... */
    },
    async selectView(viewId: string) {
      /* ... */
    },
    async createView(name: string, fromCurrent: boolean) {
      /* ... */
    },
    async saveView() {
      /* ... */
    },
    async deleteView(viewId: string) {
      /* ... */
    },
    updateWorkingConfig(partial: Partial<ViewConfig>) {
      /* ... */
    },
    discardChanges() {
      /* ... */
    },
  },
})
```

### Composable

```typescript
// composables/useAnalyticsView.ts

export function useAnalyticsView(pageCode: string) {
  const store = useViewsStore()
  const router = useRouter()

  // Load views on mount
  onMounted(() => {
    store.loadViews(pageCode)
  })

  // Watch for view changes in URL
  const route = useRoute()
  watch(
    () => route.query.view,
    (viewId) => {
      if (viewId && viewId !== store.activeViewId) {
        store.selectView(viewId as string)
      }
    }
  )

  // Computed
  const activeView = computed(() => store.activeView)
  const config = computed(() => store.workingConfig)
  const hasUnsavedChanges = computed(() => store.hasUnsavedChanges)

  // Methods
  const updateFilter = (field: string, value: any) => {
    // Update filter in working config
  }

  const updateTimeframe = (timeframe: ViewConfig['timeframe']) => {
    store.updateWorkingConfig({ timeframe })
  }

  const updateGroupBy = (groupBy: ViewConfig['groupBy']) => {
    store.updateWorkingConfig({ groupBy })
  }

  return {
    // State
    views: computed(() => store.views),
    activeView,
    config,
    hasUnsavedChanges,
    loading: computed(() => store.loading),
    saving: computed(() => store.saving),

    // Actions
    selectView: store.selectView,
    createView: store.createView,
    saveView: store.saveView,
    deleteView: store.deleteView,
    updateFilter,
    updateTimeframe,
    updateGroupBy,
    discardChanges: store.discardChanges,
  }
}
```

---

## Component Structure

```
src/
├── features/
│   └── analytics/
│       ├── components/
│       │   ├── views/
│       │   │   ├── ViewsSidebar.vue       # Left sidebar with views list
│       │   │   ├── ViewItem.vue           # Single view in sidebar
│       │   │   ├── ViewHeader.vue         # View name + actions
│       │   │   ├── CreateViewModal.vue    # Create new view dialog
│       │   │   ├── ViewMenu.vue           # Dropdown menu for view actions
│       │   │   └── ShareViewModal.vue     # Share view dialog (premium)
│       │   │
│       │   ├── toolbar/
│       │   │   ├── FilterToolbar.vue      # Filter bar
│       │   │   ├── FilterDropdown.vue     # Single filter dropdown
│       │   │   ├── TimeframePicker.vue    # Date range selector
│       │   │   ├── ColumnSelector.vue     # Column visibility
│       │   │   ├── GroupBySelector.vue    # Grouping options
│       │   │   └── DisplayToggle.vue      # Table/Chart toggle
│       │   │
│       │   └── data/
│       │       ├── DataTable.vue          # Main data table
│       │       ├── DataChart.vue          # Chart view
│       │       └── EmptyState.vue         # No data message
│       │
│       ├── composables/
│       │   ├── useAnalyticsView.ts
│       │   ├── useViewFilters.ts
│       │   └── useViewData.ts
│       │
│       ├── stores/
│       │   └── views.ts
│       │
│       └── pages/
│           ├── OrdersPage.vue
│           ├── ProductsPage.vue
│           ├── ChannelsPage.vue
│           ├── StaffPage.vue
│           └── VisitorsPage.vue
```

---

## URL Structure

Views are identified by URL query parameter:

```
/analytics/orders                    # Default view (All Orders)
/analytics/orders?view=abc123        # Custom view by ID
/analytics/orders?view=abc123&edit   # Edit mode (shows save button)
```

### URL Sync

```typescript
// When view changes, update URL
watch(activeViewId, (id) => {
  router.replace({
    query: id && !isDefaultView(id) ? { view: id } : {},
  })
})

// When URL changes, load view
watch(
  () => route.query.view,
  (viewId) => {
    if (viewId) {
      store.selectView(viewId)
    } else {
      store.selectView(getDefaultViewId())
    }
  }
)
```

---

## Keyboard Shortcuts

| Shortcut               | Action                              |
| ---------------------- | ----------------------------------- |
| `Cmd/Ctrl + S`         | Save current view                   |
| `Cmd/Ctrl + Shift + S` | Save as new view                    |
| `Cmd/Ctrl + F`         | Focus filter input                  |
| `Escape`               | Clear active filter dropdown        |
| `1-9`                  | Quick switch to view 1-9 in sidebar |

---

## Premium Limits

### View Count Check

```typescript
async function createView(name: string) {
  const { data: tenant } = await getTenantModules()
  const isPremium = tenant.modules.includes('analytics_premium')

  if (!isPremium) {
    const personalViews = views.filter((v) => !v.isDefault && !v.isShared)
    if (personalViews.length >= 3) {
      showUpgradeModal('custom_views')
      return
    }
  }

  // Proceed with creation
}
```

### Feature Gates

```vue
<!-- ViewMenu.vue -->
<template>
  <DropdownMenu>
    <DropdownMenuItem @click="renameView">Rename</DropdownMenuItem>
    <DropdownMenuItem @click="duplicateView">Duplicate</DropdownMenuItem>

    <!-- Premium features -->
    <DropdownMenuItem
      @click="pinView"
      :disabled="!isPremium"
      :title="!isPremium ? 'Premium feature' : ''"
    >
      <template v-if="!isPremium">
        <CrownIcon class="mr-2 h-4 w-4" />
      </template>
      Pin to Top
    </DropdownMenuItem>

    <DropdownMenuItem v-if="isAdmin" @click="shareView" :disabled="!isPremium">
      Share with Team
    </DropdownMenuItem>

    <DropdownMenuSeparator />
    <DropdownMenuItem @click="deleteView" variant="destructive">
      Delete
    </DropdownMenuItem>
  </DropdownMenu>
</template>
```

---

## Error Handling

| Error             | User Message                                  | Action              |
| ----------------- | --------------------------------------------- | ------------------- |
| View not found    | "This view no longer exists"                  | Redirect to default |
| Save failed       | "Failed to save view. Please try again."      | Keep unsaved state  |
| Delete failed     | "Failed to delete view. Please try again."    | Close dialog        |
| Load failed       | "Failed to load views"                        | Show retry button   |
| Permission denied | "You don't have permission to edit this view" | Show as read-only   |

---

## FAQ

**Q: Can users see each other's views?**
A: No, views are personal by default. Only admins with Premium can share views with the team.

**Q: What happens to shared views when creator leaves?**
A: Shared views remain accessible. Ownership transfers to tenant admin.

**Q: Can default views be modified?**
A: No. Users can apply temporary filters but must "Save As" to persist changes.

**Q: How many views can be created?**
A: Free users: 3 custom views per page. Premium: Unlimited.

**Q: Are views synced across devices?**
A: Yes, views are stored server-side and sync automatically.
