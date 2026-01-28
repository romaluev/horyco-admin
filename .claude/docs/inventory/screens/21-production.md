# Screen 21: Production (Производство полуфабрикатов)

> Управление производством полуфабрикатов

---

## Quick Summary

```
Dashboard
    |
    v
+------------+
| Production | <-- текущий экран
+------------+
    |
    +---> Create Production Order
    +---> Start Production (deduct ingredients)
    +---> Complete Production (add output)
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:production`
- URL: `/admin/inventory/production`

---

## UI Layout: List

```
+-------------------------------------------------------------------------+
|  Production Orders                                  [+ Create Order]    |
+-------------------------------------------------------------------------+
|  [Search...]     Status: [All v]   Warehouse: [All v]   Date: [Today] |
+-------------------------------------------------------------------------+
|                                                                          |
|  Today's Schedule                                                        |
|  +---------------------------------------------------------------------+|
|  | Order #      | Product       | Qty Plan | Status    | Scheduled    ||
|  +---------------------------------------------------------------------+|
|  | PRD-2501-008 | Pizza Dough   | 20 kg    | [InProg]  | 09:00        ||
|  | PRD-2501-009 | Burger Patty  | 50 pcs   | [Pending] | 10:00        ||
|  | PRD-2501-010 | Tomato Sauce  | 10 L     | [Pending] | 11:00        ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Recent Orders                                                           |
|  +---------------------------------------------------------------------+|
|  | Order #      | Product       | Qty Prod | Status    | Completed    ||
|  +---------------------------------------------------------------------+|
|  | PRD-2501-007 | Pizza Dough   | 18 kg    | [Done]    | Jan 17 16:00 ||
|  | PRD-2501-006 | Burger Patty  | 48 pcs   | [Done]    | Jan 17 11:00 ||
|  | PRD-2501-005 | Pizza Dough   | 22 kg    | [Cancelled]| Jan 16      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Today's Summary:                                                        |
|  Planned: 3    In Progress: 1    Completed: 0                           |
|                                                         Page 1 of 10    |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Create Production Order

```
+-------------------------------------------------------------------------+
|  < Back to Production                                                   |
+-------------------------------------------------------------------------+
|  Create Production Order                                                |
+-------------------------------------------------------------------------+
|                                                                          |
|  Basic Info                                                              |
|  +---------------------------------------------------------------------+|
|  | Warehouse*:   [Main Kitchen                              v]         ||
|  | Product*:     [Pizza Dough                               v]         ||
|  |               [!] Must be a semi-finished item with recipe          ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Quantity                                                                |
|  +---------------------------------------------------------------------+|
|  | Planned Quantity*: [20        ] kg                                  ||
|  | Recipe Output:     5 kg per batch                                   ||
|  | Batches:           4                                                ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Schedule                                                                |
|  +---------------------------------------------------------------------+|
|  | Production Date*:  [2026-01-18]                                     ||
|  | Scheduled Time:    [09:00    ]                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Required Ingredients (for 20 kg output)                                 |
|  +---------------------------------------------------------------------+|
|  | Ingredient    | Required | Available | Status                       ||
|  +---------------------------------------------------------------------+|
|  | Flour         | 16 kg    | 150 kg    | [v] OK                       ||
|  | Water         | 10 L     | 50 L      | [v] OK                       ||
|  | Yeast         | 0.4 kg   | 0.3 kg    | [!] Not enough               ||
|  | Salt          | 0.2 kg   | 5 kg      | [v] OK                       ||
|  | Olive Oil     | 0.8 L    | 8.5 L     | [v] OK                       ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [!] Warning: Not enough Yeast. Order 0.1 kg more or reduce quantity.  |
|                                                                          |
|  Notes:                                                                  |
|  [Morning prep for lunch rush                                       ]   |
|                                                                          |
|                                              [Cancel]  [Create Order]   |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Production Order Detail

```
+-------------------------------------------------------------------------+
|  < Back to Production                                                   |
+-------------------------------------------------------------------------+
|  PRD-2501-008: Pizza Dough                          Status: IN_PROGRESS |
+-------------------------------------------------------------------------+
|                                                                          |
|  Order Info                                                              |
|  +---------------------------------------------------------------------+|
|  | Warehouse:       Main Kitchen                                       ||
|  | Product:         Pizza Dough                                        ||
|  | Planned:         20 kg                                              ||
|  | Scheduled:       Jan 18, 2026 09:00                                 ||
|  | Started:         Jan 18, 2026 09:15                                 ||
|  | Created by:      John Doe                                           ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Ingredients (Deducted at Start)                                         |
|  +---------------------------------------------------------------------+|
|  | Ingredient    | Used     | Cost    | Total                          ||
|  +---------------------------------------------------------------------+|
|  | Flour         | 16 kg    | 6,000   | 96,000                         ||
|  | Water         | 10 L     | 500     | 5,000                          ||
|  | Yeast         | 0.4 kg   | 45,000  | 18,000                         ||
|  | Salt          | 0.2 kg   | 2,000   | 400                            ||
|  | Olive Oil     | 0.8 L    | 120,000 | 96,000                         ||
|  +---------------------------------------------------------------------+|
|  | Total Ingredient Cost:             | 215,400 UZS                    ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Complete Production                                                     |
|  +---------------------------------------------------------------------+|
|  | Actual Quantity Produced*: [19.5     ] kg                           ||
|  | (Planned: 20 kg, Variance: -0.5 kg)                                 ||
|  |                                                                     ||
|  | Cost per kg: 11,046 UZS/kg                                          ||
|  |                                                                     ||
|  | Completion Notes:                                                   ||
|  | [Slight loss due to dough sticking to container            ]        ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                               [Cancel Production]  [Complete]           |
+-------------------------------------------------------------------------+
```

---

## Status Flow

```
+---------------------------------------------------------------------+
|  СТАТУСЫ ПРОИЗВОДСТВЕННОГО ЗАКАЗА                                    |
+---------------------------------------------------------------------+
|                                                                      |
|  PLANNED -----> IN_PROGRESS -----> COMPLETED                         |
|      |              |                                                |
|      v              v                                                |
|  CANCELLED      CANCELLED                                            |
|                                                                      |
|  PLANNED:       Запланировано, ингредиенты не списаны                |
|  IN_PROGRESS:   Начато, ингредиенты списаны                          |
|  COMPLETED:     Завершено, выход добавлен на склад                   |
|  CANCELLED:     Отменено                                             |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Create Order | Создать производственный заказ |
| Start Production | Списать ингредиенты, статус IN_PROGRESS |
| Complete | Указать фактический выход, добавить на склад |
| Cancel (PLANNED) | Отменить без последствий |
| Cancel (IN_PROGRESS) | Возврат ингредиентов на склад |

---

## API Calls

### GET /admin/inventory/production

```json
// Query: ?status=PLANNED&warehouseId=1&date=2026-01-18
// Response 200
{
  "items": [
    {
      "id": 8,
      "orderNumber": "PRD-2501-008",
      "warehouseId": 1,
      "warehouseName": "Main Kitchen",
      "itemId": 100,
      "itemName": "Pizza Dough",
      "itemUnit": "kg",
      "plannedQuantity": 20,
      "actualQuantity": null,
      "status": "PLANNED",
      "scheduledDate": "2026-01-18",
      "scheduledTime": "09:00",
      "estimatedCost": 215400,
      "createdAt": "2026-01-18T08:00:00Z",
      "createdByName": "John Doe"
    }
  ],
  "todaySummary": {
    "planned": 3,
    "inProgress": 1,
    "completed": 0
  },
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### GET /admin/inventory/production/today

```json
// Query: ?warehouseId=1
// Response 200
[
  {
    "id": 8,
    "orderNumber": "PRD-2501-008",
    "itemName": "Pizza Dough",
    "plannedQuantity": 20,
    "status": "PLANNED",
    "scheduledTime": "09:00"
  }
]
```

### POST /admin/inventory/production

```json
// Request
{
  "warehouseId": 1,
  "itemId": 100,
  "plannedQuantity": 20,
  "scheduledDate": "2026-01-18",
  "scheduledTime": "09:00",
  "notes": "Morning prep"
}

// Response 201
{
  "id": 8,
  "orderNumber": "PRD-2501-008",
  "status": "PLANNED",
  "requiredIngredients": [
    {
      "itemId": 20,
      "itemName": "Flour",
      "requiredQuantity": 16,
      "availableQuantity": 150,
      "sufficient": true
    }
  ],
  "estimatedCost": 215400
}
```

### POST /admin/inventory/production/:id/start

```json
// Response 200
{
  "id": 8,
  "status": "IN_PROGRESS",
  "startedAt": "2026-01-18T09:15:00Z",
  "ingredientsDeducted": [
    {"itemId": 20, "quantity": 16, "movementId": 550},
    {"itemId": 21, "quantity": 10, "movementId": 551}
  ],
  "totalIngredientCost": 215400
}
```

### POST /admin/inventory/production/:id/complete

```json
// Request
{
  "quantityProduced": 19.5,
  "notes": "Slight loss due to dough sticking"
}

// Response 200
{
  "id": 8,
  "status": "COMPLETED",
  "completedAt": "2026-01-18T11:30:00Z",
  "actualQuantity": 19.5,
  "variance": -0.5,
  "variancePercent": -2.5,
  "totalIngredientCost": 215400,
  "costPerUnit": 11046,
  "outputMovementId": 560
}
```

### POST /admin/inventory/production/:id/cancel

```json
// Request
{
  "notes": "Cancelled due to equipment failure"
}

// Response 200 (if IN_PROGRESS)
{
  "id": 8,
  "status": "CANCELLED",
  "ingredientsReturned": [
    {"itemId": 20, "quantity": 16, "movementId": 561}
  ]
}
```

---

## Decision Logic

```
1. Проверка ингредиентов:
   FOR EACH ingredient IN recipe.ingredients:
     required = (plannedQty / recipe.outputQty) * ingredient.quantity * (1 + wasteFactor)
     available = stock.availableQuantity
     IF required > available THEN
       showWarning("Not enough " + ingredient.name)
     END IF
   END FOR

2. Расчёт себестоимости:
   ingredientCost = SUM(ingredient.quantity * item.avgCost)
   costPerUnit = ingredientCost / actualQuantityProduced

3. При Start:
   - Создаются StockMovement (PRODUCTION_INPUT) для каждого ингредиента
   - Stock.quantity уменьшается
   - Статус -> IN_PROGRESS

4. При Complete:
   - Создаётся StockMovement (PRODUCTION_OUTPUT) для выхода
   - Stock для semi-finished item увеличивается
   - avgCost для semi-finished = ingredientCost / actualQty

5. При Cancel (если IN_PROGRESS):
   - Создаются обратные движения для ингредиентов
   - Stock восстанавливается
```

---

## Production Statistics

```
+--------------------------------------------------+
|  Production Statistics                            |
|  Period: Jan 1-18, 2026                           |
+--------------------------------------------------+
|                                                   |
|  Orders:                                          |
|  - Total:        25                               |
|  - Completed:    20                               |
|  - Cancelled:    2                                |
|  - In Progress:  3                                |
|                                                   |
|  Output:                                          |
|  - Total Produced:     450 kg                     |
|  - Total Cost:         4,850,000 UZS              |
|  - Avg Cost/kg:        10,778 UZS                 |
|                                                   |
|  Efficiency:                                      |
|  - Avg Yield:          97.5%                      |
|  - Total Variance:     -11.25 kg                  |
|                                                   |
+--------------------------------------------------+
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| warehouseId | Обязательное |
| itemId | Обязательное, isSemiFinished = true |
| itemId | Должен иметь активный recipe |
| plannedQuantity | > 0 |
| scheduledDate | >= today |
| quantityProduced | > 0, при complete |

---

## Status Badge Colors

| Status | Цвет |
|--------|------|
| PLANNED | Blue |
| IN_PROGRESS | Yellow |
| COMPLETED | Green |
| CANCELLED | Gray |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Item has no recipe | Ошибка, предложить создать recipe |
| 400 | Insufficient ingredients | Warning с деталями |
| 400 | Cannot cancel completed | Toast с предупреждением |
| 404 | Order not found | Вернуться на список |

---

## FAQ

**Q: Что если фактический выход меньше запланированного?**

A: Указать фактический выход. Система рассчитает variance и скорректирует себестоимость.

**Q: Можно ли отменить начатое производство?**

A: Да, ингредиенты будут возвращены на склад. Но уже использованные материалы нельзя "вернуть".

**Q: Как рассчитывается себестоимость полуфабриката?**

A: Сумма стоимости ингредиентов / фактический выход. Это становится avgCost для semi-finished item.

---

*Документ актуален на январь 2026*
