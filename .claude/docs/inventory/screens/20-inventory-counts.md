# Screen 20: Inventory Counts (Инвентаризация)

> Проведение инвентаризации и сверки остатков

---

## Quick Summary

```
Dashboard
    |
    v
+-----------------+
| Inventory Counts| <-- текущий экран
+-----------------+
    |
    +---> Create Count
    +---> Enter Counts
    +---> Review Variances
    +---> Apply Adjustments
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:count`
- URL: `/admin/inventory/counts`

---

## UI Layout: List

```
+-------------------------------------------------------------------------+
|  Inventory Counts                                     [+ Start Count]   |
+-------------------------------------------------------------------------+
|  [Search...]     Status: [All v]   Type: [All v]   Warehouse: [All v]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | Count Number | Date     | Type    | Items | Variance | Status      ||
|  +---------------------------------------------------------------------+|
|  | CNT-2501-003 | Jan 18   | Full    |  156  | -2.5%    | [InProgress]||
|  | CNT-2501-002 | Jan 15   | Partial |   25  | -5.2%    | [Pending]   ||
|  | CNT-2501-001 | Jan 10   | Spot    |    5  | +1.0%    | [Approved]  ||
|  | CNT-2412-015 | Dec 28   | Full    |  152  | -3.1%    | [Approved]  ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                                         Page 1 of 5     |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Create Count

```
+-------------------------------------------------------------------------+
|  < Back to Counts                                                       |
+-------------------------------------------------------------------------+
|  Start Inventory Count                                                  |
+-------------------------------------------------------------------------+
|                                                                          |
|  Count Settings                                                          |
|  +---------------------------------------------------------------------+|
|  | Warehouse*:   [Main Kitchen                              v]         ||
|  | Count Date*:  [2026-01-18]                                          ||
|  | Count Type*:  ( ) Full Count - All items                            ||
|  |               (*) Partial - Selected categories                      ||
|  |               ( ) Spot Check - Random items                          ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  IF Partial:                                                             |
|  +---------------------------------------------------------------------+|
|  | Select Categories:                                                  ||
|  | [x] Vegetables    [x] Dairy    [ ] Meat    [ ] Dry Goods           ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Options                                                                 |
|  +---------------------------------------------------------------------+|
|  | [ ] Hide system quantities (blind count)                            ||
|  | [ ] Require photo proof for variances > 10%                         ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                              [Cancel]  [Start Count]    |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Counting Screen

```
+-------------------------------------------------------------------------+
|  < Back (Save Progress)                                                 |
+-------------------------------------------------------------------------+
|  CNT-2501-003 - Full Count                            Progress: 45/156  |
+-------------------------------------------------------------------------+
|                                                                          |
|  Filter: [All v]  [Search item...]                                      |
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | Item              | System  | Counted  | Variance | Status         ||
|  +---------------------------------------------------------------------+|
|  | Tomatoes          | 45.5 kg | [45    ] | -0.5 kg  | [!] Variance   ||
|  | Cucumbers         | 30.0 kg | [30    ] | 0        | [v] Match      ||
|  | Bell Peppers      | 20.0 kg | [      ] | --       | [ ] Pending    ||
|  | Mozzarella        | 12.0 kg | [10    ] | -2.0 kg  | [!] Variance   ||
|  | Olive Oil         | 8.5 L   | [8.5   ] | 0        | [v] Match      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Quick Actions:                                                          |
|  [Set All to System] [Set All to Zero]                                  |
|                                                                          |
|  Progress:                                                               |
|  [=================                    ] 45 of 156 items                |
|  Matches: 30    Variances: 15    Pending: 111                           |
|                                                                          |
|                              [Save Draft]  [Complete Count]             |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Review Variances

```
+-------------------------------------------------------------------------+
|  < Back to Count                                                        |
+-------------------------------------------------------------------------+
|  CNT-2501-003 - Review Variances                                        |
+-------------------------------------------------------------------------+
|                                                                          |
|  Summary                                                                 |
|  +---------------------------------------------------------------------+|
|  | Total Items Counted:    156                                         ||
|  | Items with Variance:    23                                          ||
|  | Variance Rate:          14.7%                                       ||
|  |                                                                     ||
|  | Expected Value:         45,234,000 UZS                              ||
|  | Counted Value:          44,102,500 UZS                              ||
|  | Total Variance:         -1,131,500 UZS (-2.5%)                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Variances by Category                                                   |
|  +---------------------------------------------------------------------+|
|  | Category    | Expected   | Counted    | Variance                   ||
|  +---------------------------------------------------------------------+|
|  | Vegetables  | 5,234,000  | 5,100,000  | -134,000 (-2.6%)           ||
|  | Dairy       | 12,500,000 | 11,950,000 | -550,000 (-4.4%)           ||
|  | Meat        | 18,000,000 | 17,802,500 | -197,500 (-1.1%)           ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Items with Large Variance (> 5%)                                        |
|  +---------------------------------------------------------------------+|
|  | Item        | System | Counted | Variance | Value Impact           ||
|  +---------------------------------------------------------------------+|
|  | Mozzarella  | 12 kg  | 10 kg   | -16.7%   | -170,000 UZS           ||
|  | Beef Patty  | 25 kg  | 22 kg   | -12.0%   | -255,000 UZS           ||
|  | Salmon      | 8 kg   | 7 kg    | -12.5%   | -180,000 UZS           ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [!] Large variances detected. Review before approval.                  |
|                                                                          |
|  Notes for Approval:                                                     |
|  +---------------------------------------------------------------------+|
|  | [                                                              ]    ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                            [Edit Counts]  [Submit for Approval]         |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Approval View

```
+-------------------------------------------------------------------------+
|  CNT-2501-002 - Pending Approval                                        |
+-------------------------------------------------------------------------+
|                                                                          |
|  [Summary and variance details same as above]                           |
|                                                                          |
|  Submitted by: John Doe on Jan 15, 2026                                 |
|  Notes: Found cheese stored incorrectly in wrong fridge                 |
|                                                                          |
|  Approval Decision                                                       |
|  +---------------------------------------------------------------------+|
|  | (*) Approve and Apply Adjustments                                   ||
|  |     - Stock will be updated to match counted quantities             ||
|  |     - COUNT_ADJUSTMENT movements will be created                    ||
|  |                                                                     ||
|  | ( ) Approve Without Adjustments                                     ||
|  |     - Accept count as accurate but don't change stock              ||
|  |     - For informational purposes only                              ||
|  |                                                                     ||
|  | ( ) Reject                                                          ||
|  |     - Require recount                                               ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Rejection Reason (if rejecting):                                        |
|  [                                                              ]       |
|                                                                          |
|                                              [Cancel]  [Confirm]        |
+-------------------------------------------------------------------------+
```

---

## Count Types

| Type | Описание | Частота |
|------|----------|---------|
| FULL | Полная инвентаризация всех товаров | Месяц/квартал |
| PARTIAL | Выборочная по категориям | Неделя |
| SPOT | Случайная проверка нескольких позиций | Ежедневно |

---

## Status Flow

```
+---------------------------------------------------------------------+
|  СТАТУСЫ ИНВЕНТАРИЗАЦИИ                                              |
+---------------------------------------------------------------------+
|                                                                      |
|  CREATED -----> IN_PROGRESS -----> COMPLETED -----> PENDING          |
|      |              |                                  |             |
|      v              v                                  v             |
|  CANCELLED      CANCELLED                          APPROVED          |
|                                                        |             |
|                                                    REJECTED          |
|                                                                      |
|  CREATED:      Создана, не начата                                    |
|  IN_PROGRESS:  Идёт подсчёт                                          |
|  COMPLETED:    Подсчёт завершён, ожидает review                      |
|  PENDING:      Отправлена на утверждение                             |
|  APPROVED:     Утверждена, корректировки применены                   |
|  REJECTED:     Отклонена, требуется пересчёт                         |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## API Calls

### GET /admin/inventory/counts

```json
// Response 200
{
  "items": [
    {
      "id": 3,
      "countNumber": "CNT-2501-003",
      "warehouseId": 1,
      "warehouseName": "Main Kitchen",
      "countDate": "2026-01-18",
      "countType": "FULL",
      "status": "IN_PROGRESS",
      "totalItems": 156,
      "countedItems": 45,
      "variancePercent": -2.5,
      "varianceValue": -1131500,
      "createdAt": "2026-01-18T08:00:00Z",
      "createdByName": "John Doe"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20
}
```

### POST /admin/inventory/counts

```json
// Request
{
  "warehouseId": 1,
  "countDate": "2026-01-18",
  "countType": "PARTIAL",
  "categories": ["vegetables", "dairy"],
  "blindCount": false,
  "requirePhotoForLargeVariance": true
}

// Response 201
{
  "id": 3,
  "countNumber": "CNT-2501-003",
  "status": "CREATED",
  "totalItems": 45,
  ...
}
```

### GET /admin/inventory/counts/:id/items

```json
// Response 200
{
  "countId": 3,
  "items": [
    {
      "id": 1,
      "itemId": 10,
      "itemName": "Tomatoes",
      "itemUnit": "kg",
      "systemQuantity": 45.5,
      "countedQuantity": 45.0,
      "variance": -0.5,
      "variancePercent": -1.1,
      "varianceValue": -4000,
      "status": "VARIANCE",
      "notes": null,
      "countedAt": "2026-01-18T10:00:00Z",
      "countedByName": "John Doe"
    }
  ]
}
```

### PATCH /admin/inventory/counts/:id/items/:itemId

```json
// Request
{
  "countedQuantity": 45.0,
  "notes": "Double checked, definitely 45kg"
}

// Response 200
{
  "itemId": 10,
  "countedQuantity": 45.0,
  "variance": -0.5,
  "variancePercent": -1.1,
  "status": "VARIANCE"
}
```

### POST /admin/inventory/counts/:id/complete

```json
// Response 200
{
  "id": 3,
  "status": "COMPLETED",
  "summary": {
    "totalItems": 156,
    "matchedItems": 133,
    "varianceItems": 23,
    "variancePercent": -2.5,
    "varianceValue": -1131500
  }
}
```

### POST /admin/inventory/counts/:id/approve

```json
// Request
{
  "applyAdjustments": true,
  "notes": "Approved after investigating variances"
}

// Response 200
{
  "id": 3,
  "status": "APPROVED",
  "approvedAt": "2026-01-18T16:00:00Z",
  "adjustmentsApplied": 23,
  "stockMovements": [...]
}
```

---

## Decision Logic

```
1. Variance calculation:
   variance = countedQuantity - systemQuantity
   variancePercent = (variance / systemQuantity) * 100
   varianceValue = variance * item.avgCost

2. Status determination:
   IF countedQuantity = null THEN status = PENDING
   ELSE IF countedQuantity = systemQuantity THEN status = MATCH
   ELSE status = VARIANCE

3. Approval threshold:
   IF ABS(variancePercent) > settings.countVarianceThreshold THEN
     requiresApproval = true
   END IF

4. При применении корректировок:
   - Создаётся StockMovement (COUNT_ADJUSTMENT) для каждого item с variance
   - Stock.quantity обновляется до countedQuantity
   - Если variance большой, может потребоваться photo
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| warehouseId | Обязательное |
| countDate | Обязательное, не в будущем |
| countType | Обязательное |
| categories | Обязательное если type = PARTIAL |
| countedQuantity | >= 0 |

---

## Status Badge Colors

| Status | Цвет |
|--------|------|
| CREATED | Gray |
| IN_PROGRESS | Blue |
| COMPLETED | Yellow |
| PENDING | Orange |
| APPROVED | Green |
| REJECTED | Red |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Count already in progress | Показать существующий count |
| 400 | Cannot modify completed | Toast с предупреждением |
| 403 | Cannot approve own count | Toast с предупреждением |

---

## FAQ

**Q: Что такое blind count?**

A: Скрытие системных остатков при подсчёте. Предотвращает "подгон" чисел.

**Q: Как часто проводить полную инвентаризацию?**

A: Рекомендуется ежемесячно для high-value items, ежеквартально для остальных.

**Q: Что если найдены товары которых нет в системе?**

A: Сначала добавить товар в номенклатуру, затем включить в count.

---

*Документ актуален на январь 2026*
