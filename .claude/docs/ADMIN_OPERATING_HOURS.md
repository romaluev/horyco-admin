# Admin Operating Hours & Holidays

This document describes operating hours and holiday management workflows for the Admin Panel. Control when branches are open for business, define weekly schedules, and manage special holiday closures or hours.

---

## Table of Contents

1. [Overview](#overview)
2. [Operating Hours Management](#operating-hours-management)
3. [Holiday Management](#holiday-management)
4. [Today's Status (Convenience Endpoint)](#todays-status-convenience-endpoint)
5. [User Flows](#user-flows)
6. [Error Handling](#error-handling)

---

## Overview

The Operating Hours & Holidays system allows restaurant owners to:
- **Define weekly operating hours** per branch (Monday-Sunday schedules)
- **Manage holidays** with special hours or closures
- **Track current open/closed status** in real-time
- **Display business hours** to customers (WebApp/POS)

### Key Concepts

- **Operating Hours**: Regular weekly schedule (e.g., "Monday: 9 AM - 10 PM")
- **Holidays**: Special dates with different hours or closed status
- **Current Status**: Real-time calculation of whether branch is currently open
- **Day of Week**: 0-6 where 0=Sunday, 1=Monday, ..., 6=Saturday
- **Branch-Level Configuration**: Each branch has independent hours and holidays

### Architecture

```
Branch
  ├── Operating Hours (7 entries, one per day of week)
  │   ├── Sunday (dayOfWeek: 0)
  │   ├── Monday (dayOfWeek: 1)
  │   └── ... Saturday (dayOfWeek: 6)
  │
  └── Holidays (special dates)
      ├── Holiday 1 (e.g., "New Year's Day - Closed")
      └── Holiday 2 (e.g., "Independence Day - Open 12PM-6PM")
```

---

## Operating Hours Management

### Endpoint: `GET /admin/operating-hours`

**Purpose**: Retrieve all operating hours for a branch (full weekly schedule).

**Query Parameters**:
- `branchId` (required): Branch identifier

**Response Structure**:

```json
{
  "branchId": 5,
  "hours": [
    {
      "id": 123,
      "dayOfWeek": 1,
      "dayName": "Monday",
      "openTime": "09:00",
      "closeTime": "22:00",
      "isClosed": false
    },
    {
      "id": 124,
      "dayOfWeek": 2,
      "dayName": "Tuesday",
      "openTime": "09:00",
      "closeTime": "22:00",
      "isClosed": false
    },
    {
      "id": 125,
      "dayOfWeek": 0,
      "dayName": "Sunday",
      "openTime": null,
      "closeTime": null,
      "isClosed": true
    }
    // ... 7 items total (one per day)
  ]
}
```

**Response Fields**:
- `branchId` - Branch these hours apply to
- `hours[]` - Array of 7 operating hour entries
  - `id` - Hour record identifier
  - `dayOfWeek` - Day number (0=Sunday, 1=Monday, ..., 6=Saturday)
  - `dayName` - Human-readable day name
  - `openTime` - Opening time in HH:MM format (24-hour)
  - `closeTime` - Closing time in HH:MM format (24-hour)
  - `isClosed` - `true` if branch closed all day, `false` if open

**Use Cases**:
- Display weekly schedule to customers (WebApp, social media)
- Admin view and edit operating hours
- Validate order placement times (POS)

### Endpoint: `PUT /admin/operating-hours`

**Purpose**: Update operating hours for a branch (full weekly schedule).

**Query Parameters**:
- `branchId` (required): Branch identifier

**Request Body**:

```json
{
  "hours": [
    {
      "dayOfWeek": 1,
      "openTime": "09:00",
      "closeTime": "22:00",
      "isClosed": false
    },
    {
      "dayOfWeek": 2,
      "openTime": "09:00",
      "closeTime": "22:00",
      "isClosed": false
    },
    {
      "dayOfWeek": 0,
      "isClosed": true
    }
    // ... 7 items required (one per day)
  ]
}
```

**Validation Rules**:
- Must provide exactly 7 day entries (one per dayOfWeek 0-6)
- `openTime` and `closeTime` required if `isClosed: false`
- Times must be in HH:MM format (24-hour)
- `closeTime` must be after `openTime` (or cross midnight if desired)
- If `isClosed: true`, openTime and closeTime ignored

**Response**: Updated operating hours (same structure as GET)

**Use Cases**:
- Admin updates weekly schedule
- Seasonal hour changes (summer vs winter hours)
- Initial branch setup during onboarding

---

## Holiday Management

### Endpoint: `GET /admin/holidays`

**Purpose**: Retrieve all holidays for a branch.

**Query Parameters**:
- `branchId` (required): Branch identifier
- `startDate` (optional): Filter holidays on or after this date
- `endDate` (optional): Filter holidays on or before this date
- `upcoming` (optional): If `true`, return only future holidays

**Response Structure**:

```json
[
  {
    "id": 45,
    "branchId": 5,
    "date": "2025-12-25",
    "name": "Christmas Day",
    "isClosed": true,
    "openTime": null,
    "closeTime": null,
    "notes": "Closed for Christmas holiday"
  },
  {
    "id": 46,
    "branchId": 5,
    "date": "2025-07-04",
    "name": "Independence Day",
    "isClosed": false,
    "openTime": "12:00",
    "closeTime": "18:00",
    "notes": "Limited hours for holiday"
  }
]
```

**Response Fields**:
- `id` - Holiday record identifier
- `branchId` - Branch this holiday applies to
- `date` - Holiday date (YYYY-MM-DD format)
- `name` - Holiday name (e.g., "New Year's Day")
- `isClosed` - `true` if branch closed all day, `false` if open with special hours
- `openTime` - Opening time if open (null if closed)
- `closeTime` - Closing time if open (null if closed)
- `notes` - Optional notes for staff/customers

**Use Cases**:
- Display upcoming holidays to customers
- Admin calendar view of special dates
- POS warning about holiday hours

### Endpoint: `GET /admin/holidays/today`

**Purpose**: Check if today is a holiday (quick lookup).

**Query Parameters**:
- `branchId` (required): Branch identifier

**Response** (if today is a holiday):

```json
{
  "id": 45,
  "date": "2025-12-25",
  "name": "Christmas Day",
  "isClosed": true,
  "openTime": null,
  "closeTime": null,
  "notes": "Closed for Christmas holiday"
}
```

**Response** (if today is NOT a holiday):

```json
{
  "message": "No holiday today"
}
```

**Use Cases**:
- Quick check in dashboard: "Today is Christmas Day - Closed"
- POS login screen warning
- Customer notification on WebApp

**Important**: This endpoint uses specific route matching. Ensure it's called correctly as `/holidays/today` (not `/holidays/:id` with "today" as ID).

### Endpoint: `GET /admin/holidays/:id`

**Purpose**: Get details of a specific holiday.

**Parameters**:
- `id` (required): Holiday identifier (must be numeric)

**Response**: Single holiday object (same structure as list item)

**Use Cases**:
- Edit holiday dialog (pre-fill form)
- Holiday detail page

### Endpoint: `POST /admin/holidays`

**Purpose**: Create a new holiday.

**Request Body**:

```json
{
  "branchId": 5,
  "date": "2025-12-31",
  "name": "New Year's Eve",
  "isClosed": false,
  "openTime": "09:00",
  "closeTime": "14:00",
  "notes": "Closing early for New Year celebrations"
}
```

**Validation Rules**:
- `branchId` required
- `date` required (YYYY-MM-DD format, must be future date)
- `name` required (1-100 characters)
- If `isClosed: false`, both `openTime` and `closeTime` required
- If `isClosed: true`, `openTime` and `closeTime` ignored
- Cannot create duplicate holiday for same date/branch

**Response**: Created holiday object with assigned `id`

**Use Cases**:
- Admin adds upcoming holiday to calendar
- Initial holiday setup during onboarding

### Endpoint: `PUT /admin/holidays/:id`

**Purpose**: Update an existing holiday.

**Parameters**:
- `id` (required): Holiday identifier

**Request Body**: Same structure as POST (all fields can be updated)

**Response**: Updated holiday object

**Use Cases**:
- Change holiday hours (e.g., decided to open half day instead of full closure)
- Correct typo in holiday name
- Update notes

### Endpoint: `DELETE /admin/holidays/:id`

**Purpose**: Delete a holiday.

**Parameters**:
- `id` (required): Holiday identifier

**Response**: Success message

**Use Cases**:
- Remove accidentally created holiday
- Cancel previously planned holiday closure

---

## Today's Status (Convenience Endpoint)

### Endpoint: `GET /admin/operating-hours/today`

**Purpose**: Get today's complete operating status in a single request (convenience endpoint).

**Query Parameters**:
- `branchId` (required): Branch identifier

**What This Endpoint Combines**:
1. Today's operating hours (from weekly schedule)
2. Current open/closed status (real-time calculation)
3. Holiday information (if today is a holiday)

**Response Structure**:

```json
{
  "date": "2025-11-03",
  "dayOfWeek": 3,
  "dayName": "Wednesday",
  "currentTime": "14:30:00",
  "isCurrentlyOpen": true,
  "operatingHours": {
    "openTime": "09:00",
    "closeTime": "22:00",
    "isClosed": false
  },
  "holiday": null,
  "nextStatusChange": {
    "time": "22:00",
    "status": "closed"
  }
}
```

**Response Structure** (on a holiday):

```json
{
  "date": "2025-12-25",
  "dayOfWeek": 4,
  "dayName": "Thursday",
  "currentTime": "10:00:00",
  "isCurrentlyOpen": false,
  "operatingHours": {
    "openTime": null,
    "closeTime": null,
    "isClosed": true
  },
  "holiday": {
    "name": "Christmas Day",
    "isClosed": true,
    "notes": "Closed for Christmas holiday"
  },
  "nextStatusChange": {
    "time": "09:00",
    "status": "open",
    "date": "2025-12-26"
  }
}
```

**Response Fields**:
- `date` - Today's date (YYYY-MM-DD)
- `dayOfWeek` - Today's day number (0=Sunday, ..., 6=Saturday)
- `dayName` - Human-readable day name
- `currentTime` - Current time (HH:MM:SS format)
- `isCurrentlyOpen` - Boolean: is branch open RIGHT NOW
- `operatingHours` - Today's scheduled hours
- `holiday` - Holiday object if today is a holiday, null otherwise
- `nextStatusChange` - When status will next change (next open or close time)

**Alternative Endpoints**:
- `GET /admin/operating-hours?branchId=X` - Full weekly schedule
- `GET /admin/holidays/today?branchId=X` - Holiday info only
- `GET /admin/operating-hours/status?branchId=X` - Current open/closed status only

**Use Cases**:
- Dashboard "Store Status" widget
- POS home screen: "Currently Open - Closes at 10 PM"
- Mobile app home screen
- Customer WebApp banner: "Open Now" or "Closed - Opens tomorrow at 9 AM"

**When to Use**:
- Quick status checks (dashboard, home screens)
- When you need all three pieces of data (hours + status + holiday)

**When NOT to Use**:
- If you only need one piece of data (use specific endpoint)
- If you're building a weekly schedule editor (use `/operating-hours`)
- If you're managing holiday calendar (use `/holidays`)

---

## User Flows

### Flow 1: View Branch Operating Hours

**User Action**: Navigate to Branch Settings → Operating Hours

**Steps**:
1. Select branch from dropdown
2. Call `GET /admin/operating-hours?branchId={selectedBranch}`
3. Display weekly schedule in table format
4. Show open/closed status for each day
5. Highlight today's row

**UI Layout**:

```
Operating Hours - Downtown Branch

┌─────────────┬──────────────┬──────────────┬──────────┐
│ Day         │ Opens        │ Closes       │ Status   │
├─────────────┼──────────────┼──────────────┼──────────┤
│ Monday      │ 9:00 AM      │ 10:00 PM     │ Open     │
│ Tuesday     │ 9:00 AM      │ 10:00 PM     │ Open     │
│ Wednesday → │ 9:00 AM      │ 10:00 PM     │ Open     │ ← Today
│ Thursday    │ 9:00 AM      │ 10:00 PM     │ Open     │
│ Friday      │ 9:00 AM      │ 11:00 PM     │ Open     │
│ Saturday    │ 10:00 AM     │ 11:00 PM     │ Open     │
│ Sunday      │ --           │ --           │ Closed   │
└─────────────┴──────────────┴──────────────┴──────────┘

[Edit Hours]
```

### Flow 2: Update Weekly Operating Hours

**User Action**: Admin changes operating hours

**Steps**:
1. Click "Edit Hours" button
2. Display editable form with 7 rows (one per day)
3. For each day:
   - Toggle: "Closed all day" checkbox
   - If not closed: Time pickers for open/close times
4. User makes changes (e.g., extend Friday hours to 11 PM)
5. Validate: ensure close time after open time
6. Call `PUT /admin/operating-hours?branchId={id}` with all 7 days
7. Show success message: "Operating hours updated successfully"
8. Refresh display

**Validation Rules**:
- All 7 days must have data
- Open time < Close time (same day) OR allow overnight (close time next day)
- Times in 15-minute increments (optional UX improvement)
- Warn if hours overlap midnight (e.g., "Open 11 PM - 2 AM")

### Flow 3: Add a Holiday

**User Action**: Admin adds upcoming holiday closure

**Steps**:
1. Navigate to Branch Settings → Holidays
2. Click "Add Holiday" button
3. Display form:
   - Date picker (default: next special date)
   - Holiday name input (text field)
   - Status toggle: "Closed all day" or "Open with special hours"
   - If open with special hours: Time pickers for open/close
   - Notes textarea (optional, for staff/customer message)
4. User fills form (e.g., "Christmas - Closed")
5. Call `POST /admin/holidays` with form data
6. Add new holiday to calendar/list view
7. Show success message: "Holiday added successfully"

**UI Recommendations**:
- Calendar view showing existing holidays
- Color-code: Red (closed), Yellow (limited hours), Green (normal hours)
- Quick actions: "Add New Year's Day", "Add Independence Day" (pre-fill names)
- Copy from last year: "Import holidays from 2024"

### Flow 4: View Today's Status on Dashboard

**User Action**: View dashboard home screen

**Steps**:
1. On dashboard load, call `GET /admin/operating-hours/today?branchId={defaultBranch}`
2. Display prominent status widget:
   - Large badge: "OPEN" (green) or "CLOSED" (red)
   - Current time: "2:30 PM"
   - Today's hours: "9:00 AM - 10:00 PM"
   - If holiday: Show banner: "Today: Christmas Day - Closed"
   - Next status change: "Closes in 7h 30m"
3. Optional: Auto-refresh every 60 seconds for real-time accuracy
4. Branch selector dropdown (if multi-branch)

**Dashboard Widget Design**:

```
┌──────────────────────────────────────┐
│  Downtown Branch                  ▼  │
│                                      │
│      ●  OPEN                         │
│                                      │
│  Today: Wednesday, Nov 3             │
│  Hours: 9:00 AM - 10:00 PM           │
│  Current Time: 2:30 PM               │
│                                      │
│  ⏰ Closes in 7h 30m                 │
└──────────────────────────────────────┘
```

**Alternative Design (on holiday)**:

```
┌──────────────────────────────────────┐
│  Downtown Branch                  ▼  │
│                                      │
│      ●  CLOSED                       │
│                                      │
│  🎄 Christmas Day                    │
│  "Closed for Christmas holiday"      │
│                                      │
│  ⏰ Reopens tomorrow at 9:00 AM      │
└──────────────────────────────────────┘
```

### Flow 5: Manage Holiday Calendar

**User Action**: View and manage all holidays

**Steps**:
1. Navigate to Branch Settings → Holidays
2. Call `GET /admin/holidays?branchId={id}&upcoming=true`
3. Display as calendar or list view
4. Each holiday card shows: Date, Name, Status (Open/Closed), Hours (if open)
5. Actions per holiday: [Edit] [Delete]
6. Click Edit → Pre-fill form with holiday data
7. Click Delete → Confirm dialog → Call `DELETE /admin/holidays/:id`

**UI View Options**:
- **Calendar View**: Month calendar with holidays marked
- **List View**: Chronological list with full details
- **Upcoming Only**: Filter to show only future holidays
- **Past Holidays**: Archive of previous year's holidays

---

## Error Handling

### Common Error Scenarios

**1. Branch Not Found (404)**

```json
{
  "statusCode": 404,
  "message": "Branch with ID 999 not found",
  "error": "Not Found"
}
```

**User Guidance**: "Branch not found. Please select a valid branch."

**2. Invalid Day of Week (400)**

When submitting operating hours with invalid dayOfWeek:

```json
{
  "statusCode": 400,
  "message": "Invalid dayOfWeek: must be between 0 and 6",
  "error": "Bad Request"
}
```

**User Guidance**: Internal error - frontend should only submit valid day numbers (0-6).

**3. Missing Required Days (400)**

When submitting operating hours without all 7 days:

```json
{
  "statusCode": 400,
  "message": "Must provide hours for all 7 days of the week",
  "error": "Bad Request"
}
```

**User Guidance**: "Please set operating hours for all days of the week."

**4. Invalid Time Format (400)**

```json
{
  "statusCode": 400,
  "message": "Invalid time format. Use HH:MM (24-hour format)",
  "error": "Bad Request"
}
```

**User Guidance**: "Please enter times in HH:MM format (e.g., 09:00, 14:30, 22:00)."

**5. Close Time Before Open Time (400)**

```json
{
  "statusCode": 400,
  "message": "Close time must be after open time",
  "error": "Bad Request"
}
```

**User Guidance**: "Closing time must be after opening time. For overnight hours, contact support."

**6. Duplicate Holiday (409 Conflict)**

When creating holiday for date that already has one:

```json
{
  "statusCode": 409,
  "message": "Holiday already exists for this branch on 2025-12-25",
  "error": "Conflict"
}
```

**User Guidance**: "A holiday is already set for this date. Please edit the existing holiday or choose a different date."

**7. Past Date Holiday (400)**

When creating holiday for a past date:

```json
{
  "statusCode": 400,
  "message": "Cannot create holiday for past date",
  "error": "Bad Request"
}
```

**User Guidance**: "Cannot create holidays for past dates. Please select a future date."

---

## Implementation Notes for Frontend

### Time Handling

**Format**: All times use 24-hour format (HH:MM)
- `09:00` = 9:00 AM
- `14:30` = 2:30 PM
- `22:00` = 10:00 PM
- `00:00` = Midnight

**Display**: Convert to 12-hour format for user display:
```javascript
function formatTime(time24) {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}
```

### Day of Week Mapping

```javascript
const DAY_NAMES = [
  'Sunday',    // 0
  'Monday',    // 1
  'Tuesday',   // 2
  'Wednesday', // 3
  'Thursday',  // 4
  'Friday',    // 5
  'Saturday'   // 6
];
```

**Important**: JavaScript's `Date.getDay()` returns 0 for Sunday, matching the API.

### Real-Time Status Updates

For dashboard widgets showing "Currently Open":
- Poll `/operating-hours/today` every 60 seconds
- Update countdown timer client-side (don't poll every second)
- Recalculate status when crossing open/close time boundaries

### Overnight Hours (Edge Case)

If a branch operates past midnight (e.g., "Open 11 PM - 2 AM"):
- Some implementations use next-day close time
- Others use 26:00, 27:00 notation
- **OshLab Implementation**: Check API behavior and document here

---

## API Endpoint Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/admin/operating-hours` | Get weekly schedule for branch |
| `PUT` | `/admin/operating-hours` | Update weekly schedule |
| `GET` | `/admin/operating-hours/today` | Get today's status (convenience) |
| `GET` | `/admin/operating-hours/status` | Get current open/closed status |
| `GET` | `/admin/holidays` | List all holidays for branch |
| `GET` | `/admin/holidays/today` | Check if today is a holiday |
| `GET` | `/admin/holidays/:id` | Get specific holiday details |
| `POST` | `/admin/holidays` | Create new holiday |
| `PUT` | `/admin/holidays/:id` | Update existing holiday |
| `DELETE` | `/admin/holidays/:id` | Delete holiday |

