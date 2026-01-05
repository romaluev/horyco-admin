# Analytics Integration Guide

A practical guide for frontend developers integrating with the Horyco Analytics API.

## Understanding the Analytics System

The analytics system is built on two layers: **entitlements** (what users can access) and **queries** (what data they can fetch). Both must work together for analytics to function.

### Access Control: The Entitlements Layer

Before making any analytics queries, the frontend should check what the user is allowed to access. This is done through the `me` query:

```graphql
query CurrentUser {
  me {
    entitlements {
      analytics_basic    # Sales, Products, Categories, Payment Methods
      analytics_pro      # + Heatmap, Channels, Staff, Customers
      analytics_full     # + Branch Comparison, Financial, Alerts
      dashboard_custom   # Custom dashboard configuration
    }
  }
}
```

**Key point:** `analytics_basic` is always `true` for all users - it's included in the BASIC plan. The Sales page and basic analytics should always be accessible.

### Tier-Based Access

| Feature | BASIC | PRO | FULL |
|---------|-------|-----|------|
| Sales Overview | Yes | Yes | Yes |
| Product Analytics | Yes | Yes | Yes |
| Category Analytics | Yes | Yes | Yes |
| Payment Methods | Yes | Yes | Yes |
| Delivery Types | Yes | Yes | Yes |
| Heatmap | No | Yes | Yes |
| Channels | No | Yes | Yes |
| Staff Analytics | No | Yes | Yes |
| Customer Analytics | No | Yes | Yes |
| Branch Comparison | No | No | Yes |
| Financial Reports | No | No | Yes |
| Alerts & Anomalies | No | No | Yes |

## Working with Analytics Queries

### Common Pattern: Scope and Period

Every analytics query accepts a `scope` (branch vs tenant-wide) and a `period` (time range). The backend handles data aggregation based on these parameters:

- **scope: "BRANCH"** - Data for the user's active branch only
- **scope: "TENANT"** - Aggregated data across all branches

Period types include TODAY, YESTERDAY, THIS_WEEK, LAST_7_DAYS, THIS_MONTH, LAST_30_DAYS, and CUSTOM (with start/end dates).

### Query Response Patterns

Most analytics queries return a consistent structure:

1. **scope** - What was queried
2. **period** - The time range with formatted labels
3. **summary** - Aggregate metrics with changes
4. **items/products/methods** - Detailed breakdown

### Handling Changes and Trends

The backend calculates period-over-period changes automatically. Look for:

- **changes** object - Percentage changes from previous period
- **trend** - Direction indicator (UP, DOWN, NEUTRAL)
- **change.value** - Absolute change
- **change.percent** - Percentage change

## Specific Query Notes

### productAnalytics

Returns detailed product performance with ABC classification:

- Use `offset` and `limit` for pagination
- `pagination.total` tells you the full count
- Each product includes `share` (percentage of total revenue)
- `abcClass` indicates revenue contribution tier (A, B, or C)

### paymentMethodsAnalytics

Returns payment method breakdown:

- `summary` contains totals and changes by payment type (cash, card, online)
- Each method includes `avgAmount` (calculated when transactions > 0)
- Colors are pre-assigned by payment type

### Alerts and Anomalies (FULL tier only)

These return JSON for flexibility. Parse the response and handle:

- Alert severity (CRITICAL, WARNING, INFO)
- Alert status (ACTIVE, ACKNOWLEDGED, RESOLVED)
- Health score (0-100 scale)

## Error Handling

### Common Issues

1. **"PRO plan required"** - Check entitlements first; if `analytics_basic` is false, there may be a configuration issue
2. **Empty data** - Valid scenario for new tenants; show empty state
3. **Null summary** - Shouldn't happen; report as bug

### Graceful Degradation

When a premium feature is unavailable:

1. Show a clear upgrade prompt
2. Don't hide the feature entirely - let users know what they're missing
3. Provide sample data or previews where appropriate

## Best Practices

### Query Optimization

1. Use the `me` query once on app load, cache entitlements
2. Don't re-fetch entitlements on every page
3. Use GraphQL fragments for consistent field selection
4. Batch related queries when possible

### State Management

1. Store period selection globally (user preference)
2. Cache analytics responses with appropriate TTL (5 min typical)
3. Show loading states - analytics queries can be slow

### UI Considerations

1. Always show the period being displayed
2. Include comparison labels ("vs last week")
3. Use consistent number formatting (locale-aware)
4. Handle negative changes gracefully (show red/down indicators)

## Queries NOT Implemented

The following are documented but not yet available:

- **forecast** - Use `cashFlow.forecast` instead for projections
- Structured alert types - Currently return JSON (use type guards when parsing)

## Changelog (2025-12-28)

### Fixed

- `analytics_basic` now always returns `true` for all tenants
- ProductAnalytics includes `id`, `share`, `change`, `trend`, `pagination`
- ProductAnalytics supports `offset` argument for pagination
- PaymentMethodsAnalytics includes `summary` wrapper and `avgAmount`
- AnalyticsPeriod includes `label` field for formatted date range display

### Known Limitations

- Alerts queries return JSON instead of structured types
- Transaction counts on payment methods are not yet implemented (returns 0)
