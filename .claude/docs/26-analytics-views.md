# 26. Analytics Views - Complete Step-by-Step Guide

This document covers every screen and case for the Saved Views feature in Analytics.

**API**: GraphQL (NOT REST)
**Endpoint**: `POST /graphql`
**Authentication**: JWT Bearer Token

---

## Subscription Tiers

Views access is gated by subscription plan. See `docs/about/Pricing & Billing Spec.md` for full details.

| Feature | BASIC ($29) | PRO ($59) | ULTRA ($119) |
|---------|-------------|-----------|--------------|
| Use default views | Yes | Yes | Yes |
| Create custom views | No | Yes (3 max) | Yes (unlimited) |
| Edit custom views | No | Yes | Yes |
| Delete custom views | No | Yes | Yes |
| Pin views | No | Yes | Yes |
| Share views with team | No | No | Yes |

**Entitlements:**
- `analytics_basic` - Can use default views only
- `analytics_pro` - Can create up to 3 custom views per page
- `analytics_full` - Unlimited custom views + sharing

### Default Views vs Custom Views

**Default Views:**
- Hardcoded in frontend (NOT stored in database)
- Available to all users
- Cannot be edited or deleted
- Example: "Top Sellers (7 days)", "By Category"

**Custom Views:**
- Stored in database (tenant-specific)
- Created by users with PRO+ plan
- Can be edited, deleted, pinned

```typescript
// Frontend: Default views are hardcoded constants
const DEFAULT_VIEWS = {
  products: [
    {
      id: 'default-products-top',
      name: 'Top Sellers',
      isDefault: true,
      config: {
        timeframe: { type: 'LAST_7_DAYS' },
        sorting: { column: 'revenue', direction: 'DESC' },
        columns: ['product', 'quantity', 'revenue', 'share', 'abc']
      }
    },
    {
      id: 'default-products-category',
      name: 'By Category',
      isDefault: true,
      config: {
        timeframe: { type: 'LAST_7_DAYS' },
        groupBy: 'category',
        columns: ['category', 'products', 'revenue']
      }
    }
  ]
};
```

---

## What is a View?

A View is a saved combination of:
- **Timeframe**: The period filter (Today, Last 7 Days, Custom, etc.)
- **Filters**: Any applied filters (category, channel, etc.)
- **Columns**: Which columns to show
- **Grouping**: How to group data (by hour, day, week, etc.)
- **Sorting**: Which column to sort by and direction
- **Display Mode**: Table only, or with Overview section (PRO+ feature)

Think of it as a "bookmark" for your preferred way of looking at analytics data.

---

## View Display Modes

Custom views (PRO+) can have two display modes:

### Mode 1: Table Only (Default)

```
+------------------------------------------------------------------+
|  Products                              [Views: My View v] [Period v] |
|                                                                   |
|  [Filters Row]                                                    |
|                                                                   |
|  +---------------------------------------------------------------+|
|  | Column 1 | Column 2 | Column 3 | Column 4                     ||
|  |----------|----------|----------|------------------------------|
|  | Row 1    | ...      | ...      | ...                          ||
|  | Row 2    | ...      | ...      | ...                          ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  [Pagination]                                                     |
+------------------------------------------------------------------+
```

### Mode 2: With Overview (PRO+ Custom Views)

```
+------------------------------------------------------------------+
|  Products                              [Views: My View v] [Period v] |
|                                                                   |
|  Overview                                                         |
|  +------------+ +------------+ +------------+ +------------+      |
|  | Metric 1   | | Metric 2   | | Metric 3   | | Metric 4   |      |
|  | 45,000,000 | | 1,234      | | 89         | | +12.5%     |      |
|  +------------+ +------------+ +------------+ +------------+      |
|                                                                   |
|  Chart (optional)                                                 |
|  +---------------------------------------------------------------+|
|  |     ____                                                      ||
|  | ___/    \___/\____                                            ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  Data Table                                                       |
|  +---------------------------------------------------------------+|
|  | Column 1 | Column 2 | Column 3 | Column 4                     ||
|  |----------|----------|----------|------------------------------|
|  | Row 1    | ...      | ...      | ...                          ||
|  +---------------------------------------------------------------+|
|                                                                   |
|  [Pagination]                                                     |
+------------------------------------------------------------------+
```

### View Config with Display Settings

```typescript
interface ViewConfig {
  timeframe: { type: string; customStart?: string; customEnd?: string };
  filters: string | null;        // JSON filters
  columns: string[];             // visible columns
  groupBy: string | null;        // grouping
  sorting: { column: string; direction: 'ASC' | 'DESC' };

  // NEW: Display settings (PRO+ only)
  display?: {
    mode: 'table' | 'overview';  // default: 'table'

    // If mode = 'overview':
    kpis?: string[];             // which KPIs to show (max 4)
    chart?: {
      enabled: boolean;
      metric: string;            // metric for chart
      type: 'line' | 'bar';
    };
  };
}
```

### Example: Custom Overview View

```json
{
  "name": "Product Performance Overview",
  "pageCode": "products",
  "config": {
    "timeframe": { "type": "LAST_7_DAYS" },
    "columns": ["product", "quantity", "revenue", "share"],
    "sorting": { "column": "revenue", "direction": "DESC" },
    "display": {
      "mode": "overview",
      "kpis": ["TOTAL_REVENUE", "TOTAL_QUANTITY", "UNIQUE_PRODUCTS", "CHANGE_PERCENT"],
      "chart": {
        "enabled": true,
        "metric": "REVENUE",
        "type": "line"
      }
    }
  }
}
```

Note: Overview mode requires `analytics_pro` or higher. BASIC users always see table-only mode.

---

## Quick Summary

```
User on Analytics Page
        |
        v
+-------------------+
| Views Dropdown    |
| [Default View v]  |
+-------------------+
        |
   +----+----+----+
   |    |    |    |
   v    v    v    v
Select  Save  Edit  Delete
View    View  View  View
   |     |     |     |
   v     v     v     v
Apply  Screen Screen Screen
Config   2      3      4
```

---

## Screen 1: Views Dropdown

### When to Show

Show this component when:
- User is on any analytics page (Products, Staff, Customers, etc.)
- Views dropdown is visible in the page header

### UI Layout

```
+------------------------------------------------------------------+
|  Products Analytics                          [Views: Default v]   |
|                                                                   |
|  When dropdown is OPEN:                                           |
|  +--------------------------------+                               |
|  | [*] Default                    |                               |
|  +--------------------------------+                               |
|  | [ ] Top Sellers (7 days)    [*]| <- pinned                     |
|  +--------------------------------+                               |
|  | [ ] By Category                |                               |
|  +--------------------------------+                               |
|  | [ ] High Margin Products       |                               |
|  +--------------------------------+                               |
|  | ────────────────────────────── |                               |
|  | [+] Save Current View          |                               |
|  +--------------------------------+                               |
|                                                                   |
+------------------------------------------------------------------+
```

### User Actions

| Action | What Happens | Entitlement |
|--------|--------------|-------------|
| Tap dropdown | Open/close view list | Any |
| Tap view | Apply view config to page | Any |
| Tap [*] pin icon | Toggle pin status | `analytics_pro`+ |
| Tap [+] Save Current | GO TO Screen 2 | `analytics_pro`+ |
| Long press view | Show context menu (Edit, Delete) | `analytics_pro`+ (own views only) |

**For BASIC users:**
- Hide [+] Save Current View option
- Hide pin icons
- Disable long-press context menu
- Show only: Default views + "Upgrade to save your views" prompt

```
+--------------------------------+
| [*] Default                    |
+--------------------------------+
| [ ] Top Sellers (7 days)       |
+--------------------------------+
| ────────────────────────────── |
| [Lock] Save your own views     |
|        Upgrade to PRO          |
+--------------------------------+
```

### API Call: Load Views

```
POST /graphql

Query:
query Views($pageCode: String) {
  views(pageCode: $pageCode) {
    id
    name
    pageCode
    isDefault
    isPinned
    isShared
    config {
      timeframe {
        type
        customStart
        customEnd
      }
      filters
      columns
      groupBy
      sorting {
        column
        direction
      }
      display
    }
    createdAt
  }
}

Variables:
{
  "pageCode": "products"
}

Success Response:
{
  "data": {
    "views": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Top Sellers (7 days)",
        "pageCode": "products",
        "isDefault": false,
        "isPinned": true,
        "isShared": false,
        "config": {
          "timeframe": { "type": "LAST_7_DAYS", "customStart": null, "customEnd": null },
          "filters": null,
          "columns": ["product", "quantity", "revenue", "share"],
          "groupBy": null,
          "sorting": { "column": "revenue", "direction": "DESC" }
        },
        "createdAt": "2025-12-20T10:00:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "By Category",
        "pageCode": "products",
        "isDefault": true,
        "isPinned": false,
        "isShared": false,
        "config": {
          "timeframe": { "type": "LAST_7_DAYS" },
          "groupBy": "category",
          "columns": ["category", "products", "revenue"]
        },
        "createdAt": "2025-12-15T08:00:00Z"
      }
    ]
  }
}
```

### Handle Response

```
Step 1: Sort views
────────────────────
pinnedViews = views.filter(v => v.isPinned).sort by name
defaultViews = views.filter(v => v.isDefault).sort by name
customViews = views.filter(v => !v.isPinned && !v.isDefault).sort by createdAt DESC

Step 2: Build display list
──────────────────────────
displayList = [
  ...pinnedViews,
  ...defaultViews,
  ...customViews
]

Step 3: Show in dropdown
────────────────────────
Render each view with:
- Name
- Pin icon if isPinned
- Radio/check if currently selected
```

### Apply View Logic

```
When user taps a view:
──────────────────────
config = selectedView.config

if config.timeframe
  Set page period = config.timeframe

if config.filters
  Apply filters from JSON

if config.columns
  Show only specified columns

if config.groupBy
  Set grouping = config.groupBy

if config.sorting
  Sort by config.sorting.column
  Direction = config.sorting.direction

Reload data with new parameters
```

---

## Screen 2: Save View Modal

### When to Show

Show this modal when:
- User taps [+] Save Current View
- **User has `analytics_pro` or `analytics_full` entitlement**
- User has not exceeded view limit (3 for PRO, unlimited for ULTRA)

Do NOT show when:
- User has only `analytics_basic` (show upgrade modal instead)

### UI Layout

```
+------------------------------------------+
|  X                   Save View           |
|                                          |
|  View Name *                             |
|  +------------------------------------+  |
|  | My Custom View                     |  |
|  +------------------------------------+  |
|                                          |
|  Current Configuration:                  |
|  +------------------------------------+  |
|  | Period: Last 7 Days                |  |
|  | Filters: Category = Pizza          |  |
|  | Columns: product, revenue, qty     |  |
|  | Sort: revenue DESC                 |  |
|  +------------------------------------+  |
|                                          |
|  [ ] Pin this view                       |
|                                          |
|  +------------------------------------+  |
|  |            [ Save View ]           |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

### Error State: View Limit Reached (PRO users only)

```
+------------------------------------------+
|  X                   Save View           |
|                                          |
|  [!] View Limit Reached                  |
|                                          |
|  You have reached the maximum of 3       |
|  custom views on PRO plan.               |
|  Delete a view or upgrade to ULTRA       |
|  for unlimited views.                    |
|                                          |
|  +------------------------------------+  |
|  |         [ Upgrade to ULTRA ]       |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |         [ Manage Views ]           |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

### Error State: No Custom Views (BASIC users)

```
+------------------------------------------+
|  X                   Save View           |
|                                          |
|  [Lock icon]                             |
|                                          |
|  Custom Views require PRO plan           |
|                                          |
|  Save your favorite filters and          |
|  configurations with custom views.       |
|                                          |
|  +------------------------------------+  |
|  |         [ Upgrade to PRO ]         |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Tap [X] | Close modal, discard |
| Enter name | Update view name |
| Toggle pin | Set isPinned value |
| Tap [Save View] | Call API, close modal |

### Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Name | Required, 1-100 chars | "View name is required" |
| Name | Unique per pageCode | "A view with this name already exists" |

### API Call: Create View

```
POST /graphql

Mutation:
mutation CreateView($input: CreateViewInput!) {
  createView(input: $input) {
    id
    name
    pageCode
    isDefault
    isPinned
  }
}

Variables:
{
  "input": {
    "pageCode": "products",
    "name": "My Custom View",
    "config": {
      "timeframe": { "type": "LAST_7_DAYS" },
      "filters": "{\"categoryId\": [1, 2]}",
      "columns": ["product", "revenue", "quantity"],
      "groupBy": null,
      "sorting": { "column": "revenue", "direction": "DESC" }
    },
    "isPinned": false
  }
}

Success Response:
{
  "data": {
    "createView": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "My Custom View",
      "pageCode": "products",
      "isDefault": false,
      "isPinned": false
    }
  }
}

Error Response (limit reached):
{
  "errors": [
    {
      "message": "View limit reached. Maximum 3 custom views allowed. Upgrade to premium for unlimited views.",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Handle Response

```
if response.data.createView.id exists
  Show success toast "View saved"
  Close modal
  Add new view to dropdown list
  Select the new view

if error.code = "FORBIDDEN"
  Show limit reached error state

if error.code = "BAD_USER_INPUT"
  Show field validation error
```

---

## Screen 3: Edit View Modal

### When to Show

Show this modal when:
- User long-presses a view and selects "Edit"
- User has permission to edit (creator or admin)

Cannot edit when:
- View is a system default (isDefault = true)
- View was created by another user (unless admin)

### UI Layout

```
+------------------------------------------+
|  X                   Edit View           |
|                                          |
|  View Name *                             |
|  +------------------------------------+  |
|  | Top Sellers (7 days)               |  |
|  +------------------------------------+  |
|                                          |
|  [ ] Pin this view                       |
|  [ ] Share with team                     |
|                                          |
|  +------------------------------------+  |
|  |            [ Save Changes ]        |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Tap [X] | Close modal, discard changes |
| Edit name | Update name field |
| Toggle pin | Update isPinned |
| Toggle share | Update isShared |
| Tap [Save Changes] | Call API, close modal |

### API Call: Update View

```
POST /graphql

Mutation:
mutation UpdateView($id: ID!, $input: UpdateViewInput!) {
  updateView(id: $id, input: $input) {
    id
    name
    isPinned
    isShared
  }
}

Variables:
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "input": {
    "name": "Top Sellers (updated)",
    "isPinned": true,
    "isShared": false
  }
}

Success Response:
{
  "data": {
    "updateView": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Top Sellers (updated)",
      "isPinned": true,
      "isShared": false
    }
  }
}
```

### Handle Response

```
if response.data.updateView.id exists
  Show success toast "View updated"
  Close modal
  Update view in dropdown list

if error.code = "FORBIDDEN"
  Show error toast "Cannot edit this view"
  Close modal

if error.code = "NOT_FOUND"
  Show error toast "View not found"
  Remove view from list
  Close modal
```

---

## Screen 4: Delete View Confirmation

### When to Show

Show this dialog when:
- User long-presses a view and selects "Delete"
- User has permission to delete (creator)

Cannot delete when:
- View is a system default (isDefault = true)
- View was created by another user

### UI Layout

```
+------------------------------------------+
|                                          |
|  Delete View?                            |
|                                          |
|  Are you sure you want to delete         |
|  "Top Sellers (7 days)"?                 |
|                                          |
|  This action cannot be undone.           |
|                                          |
|  +----------------+ +------------------+ |
|  |    Cancel      | |      Delete      | |
|  +----------------+ +------------------+ |
|                                          |
+------------------------------------------+
```

### User Actions

| Action | What Happens |
|--------|--------------|
| Tap [Cancel] | Close dialog |
| Tap [Delete] | Call API, close dialog |

### API Call: Delete View

```
POST /graphql

Mutation:
mutation DeleteView($id: ID!) {
  deleteView(id: $id) {
    success
  }
}

Variables:
{
  "id": "550e8400-e29b-41d4-a716-446655440001"
}

Success Response:
{
  "data": {
    "deleteView": {
      "success": true
    }
  }
}

Error Response:
{
  "errors": [
    {
      "message": "Cannot delete default views",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Handle Response

```
if response.data.deleteView.success = true
  Show success toast "View deleted"
  Remove view from dropdown list
  If deleted view was selected:
    Switch to Default view
    Reload page data

if error.code = "FORBIDDEN"
  Show error toast "Cannot delete this view"

if error.code = "NOT_FOUND"
  Show error toast "View not found"
  Remove view from list
```

---

## Complete Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANALYTICS PAGE LOADS                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Fetch views for       │
                    │ current pageCode      │
                    └───────────┬───────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                 SUCCESS                  ERROR
                    │                       │
                    ▼                       ▼
           ┌───────────────┐       ┌───────────────┐
           │ Show views    │       │ Show empty    │
           │ in dropdown   │       │ dropdown      │
           └───────┬───────┘       └───────────────┘
                   │
        ┌──────────┼──────────┬──────────────┐
        │          │          │              │
        ▼          ▼          ▼              ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Select  │ │ Save    │ │ Edit    │ │ Delete  │
   │ View    │ │ Current │ │ View    │ │ View    │
   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
        │          │          │              │
        ▼          ▼          ▼              ▼
   Apply      Screen 2    Screen 3     Screen 4
   Config     Save Modal  Edit Modal   Confirm
        │          │          │              │
        ▼          │          │              │
   Reload          │          │              │
   Data            │          │              │
        │          │          │              │
        └──────────┴──────────┴──────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Refresh view    │
                  │ dropdown list   │
                  └─────────────────┘
```

---

## API Reference

| Query/Mutation | When Called | Parameters |
|----------------|-------------|------------|
| `views` | Page load | pageCode |
| `view` | Load single view detail | id |
| `createView` | Save new view | input: CreateViewInput |
| `updateView` | Edit view | id, input: UpdateViewInput |
| `deleteView` | Delete view | id |

---

## Page Codes Reference

Each analytics page has a unique pageCode:

| Page | pageCode |
|------|----------|
| Dashboard | `dashboard` |
| Products | `products` |
| Categories | `categories` |
| Staff | `staff` |
| Customers | `customers` |
| Channels | `channels` |
| Delivery Types | `delivery` |
| Payment Methods | `payments` |
| Branches | `branches` |
| Orders | `orders` |
| Financial | `financial` |

---

## Storage Reference

| Key | Type | Set When | Clear When |
|-----|------|----------|------------|
| `views.{pageCode}.selected` | string (view id) | User selects view | Never (persist) |
| `views.{pageCode}.cache` | View[] | API response | On create/update/delete |

---

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| UNAUTHENTICATED | Token invalid | Redirect to login |
| FORBIDDEN | No permission or limit reached | Show error message |
| BAD_USER_INPUT | Invalid input | Show validation error |
| NOT_FOUND | View not found | Remove from list |

---

## FAQ

**Q: How many views can a user create?**
A: BASIC users: 0 (default views only). PRO users: 3 custom views per page. ULTRA: unlimited.

**Q: Can BASIC users use views?**
A: Yes, they can use default views (hardcoded in frontend). They cannot create, edit, or delete custom views.

**Q: Can I share views with my team?**
A: Only ULTRA users can share views. Toggle "Share with team" when editing. Shared views appear for all team members.

**Q: What happens to shared views if creator is removed?**
A: Shared views persist. They become orphaned but still accessible.

**Q: Are default views editable?**
A: No, default views (isDefault = true) cannot be edited or deleted. They are hardcoded in frontend.

**Q: Where are default views stored?**
A: Frontend only (constants). They are NOT in the database. This means no API call needed to load them.

**Q: What happens if I apply a view with invalid filters?**
A: Invalid filters are ignored. Page shows all data without those filters.

**Q: How is the config.filters field formatted?**
A: JSON string. Example: `"{\"categoryId\": [1, 2], \"channel\": [\"DINE_IN\"]}"`. Parse it as JSON object.

**Q: Can I update the config of an existing view?**
A: Currently, updateView only allows name/isPinned/isShared changes. To change config, delete and recreate.

**Q: What's the difference between pin and default?**
A: Default views are system-created (hardcoded) and appear first. Pinned views are user-pinned and appear after defaults.

**Q: Can custom views have overview sections?**
A: Yes, PRO+ users can create views with `display.mode = 'overview'` to add KPI cards and charts above the data table.

**Q: What happens if user downgrades from PRO to BASIC?**
A: Their custom views become read-only. They can still use them but cannot edit, delete, or create new ones.

**Q: What happens if PRO user exceeds 3 views limit?**
A: They see an upgrade prompt to ULTRA for unlimited views, or can delete existing views.
