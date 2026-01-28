# Screen 22: Stock Alerts (Уведомления о низком остатке)

> Просмотр и управление алертами склада

---

## Quick Summary

```
Dashboard
    |
    v
+--------+
| Alerts | <-- текущий экран
+--------+
    |
    +---> View alert details
    +---> Acknowledge alerts
    +---> Create quick PO
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:view`
- URL: `/admin/inventory/alerts`

---

## UI Layout

```
+-------------------------------------------------------------------------+
|  Stock Alerts                                          [Mark All Read]  |
+-------------------------------------------------------------------------+
|  Warehouse: [All v]     Type: [All v]     Status: [Unacknowledged v]   |
+-------------------------------------------------------------------------+
|                                                                          |
|  Critical (Out of Stock)                                           [3]  |
|  +---------------------------------------------------------------------+|
|  | [R] Basil           | Main Kitchen | 0 kg   | Min: 1 kg   |[Order] ||
|  | [R] Salmon          | Main Kitchen | 0 kg   | Min: 5 kg   |[Order] ||
|  | [R] Heavy Cream     | Bar Storage  | 0 L    | Min: 2 L    |[Order] ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Warning (Low Stock)                                              [12]  |
|  +---------------------------------------------------------------------+|
|  | [Y] Mozzarella      | Main Kitchen | 10 kg  | Min: 10 kg  |[Order] ||
|  | [Y] Tomatoes        | Main Kitchen | 18 kg  | Min: 20 kg  |[Order] ||
|  | [Y] Olive Oil       | Main Kitchen | 4 L    | Min: 5 L    |[Order] ||
|  | [Y] Chicken Breast  | Main Kitchen | 8 kg   | Min: 10 kg  |[Order] ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [Show More (8)]                                                        |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Alert Card (Expanded)

```
+-------------------------------------------------------------------------+
|  [R] Basil - OUT OF STOCK                               [x] Acknowledge |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | Location:          Main Kitchen                                     ||
|  | Current Quantity:  0 kg                                             ||
|  | Min Stock Level:   1 kg                                             ||
|  | Reorder Point:     2 kg                                             ||
|  | Last Movement:     Jan 18 14:30 (Sale Deduction)                    ||
|  | Days Out:          2 days                                           ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Affected Products (using this item):                                    |
|  +---------------------------------------------------------------------+|
|  | Caprese Salad      | Cannot prepare                                 ||
|  | Margherita Pizza   | Cannot prepare                                 ||
|  | Bruschetta         | Cannot prepare                                 ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Quick Actions:                                                          |
|  [Create Purchase Order]  [View Stock History]  [Edit Item Settings]    |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Alert Types

| Type | Цвет | Условие | Приоритет |
|------|------|---------|-----------|
| OUT_OF_STOCK | Red | quantity <= 0 | Critical |
| LOW_STOCK | Yellow | 0 < quantity <= minStockLevel | Warning |
| REORDER | Blue | quantity <= reorderPoint | Info |

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Stock Alerts                                          [Mark All Read]  |
+-------------------------------------------------------------------------+
|  Warehouse: [All v]     Type: [All v]                                  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | [skeleton]                                                          ||
|  | [skeleton]                                                          ||
|  | [skeleton]                                                          ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

### Empty State

```
+-------------------------------------------------------------------------+
|  Stock Alerts                                          [Mark All Read]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [check circle icon]                                          ||
|  |                                                                      ||
|  |         All stock levels are healthy                                 ||
|  |                                                                      ||
|  |         No low stock or out of stock items.                          ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Warehouse filter | Фильтр по складу |
| Type filter | OUT_OF_STOCK / LOW_STOCK / REORDER |
| Status filter | Unacknowledged / Acknowledged / All |
| Acknowledge | Отметить алерт как просмотренный |
| Mark All Read | Отметить все как просмотренные |
| Order (quick action) | Создать PO с этим товаром |
| View Stock History | Переход на Movements с фильтром |
| Edit Item Settings | Переход на редактирование item |

---

## API Calls

### GET /admin/inventory/alerts

```json
// Query: ?warehouseId=1&alertType=OUT_OF_STOCK&acknowledged=false
// Response 200
{
  "items": [
    {
      "id": 1,
      "warehouseId": 1,
      "warehouseName": "Main Kitchen",
      "itemId": 50,
      "itemName": "Basil",
      "itemUnit": "kg",
      "alertType": "OUT_OF_STOCK",
      "currentQuantity": 0,
      "thresholdQuantity": 1,
      "reorderPoint": 2,
      "reorderQuantity": 5,
      "isAcknowledged": false,
      "acknowledgedAt": null,
      "acknowledgedByName": null,
      "lastMovementAt": "2026-01-18T14:30:00Z",
      "lastMovementType": "SALE_DEDUCTION",
      "daysInThisState": 2,
      "affectedProducts": [
        {"id": 100, "name": "Caprese Salad"},
        {"id": 101, "name": "Margherita Pizza"}
      ],
      "createdAt": "2026-01-16T14:30:00Z"
    }
  ],
  "summary": {
    "outOfStock": 3,
    "lowStock": 12,
    "reorder": 5,
    "totalUnacknowledged": 15
  },
  "total": 20,
  "page": 1,
  "limit": 50
}
```

### POST /admin/inventory/alerts/:id/acknowledge

```json
// Response 200
{
  "id": 1,
  "isAcknowledged": true,
  "acknowledgedAt": "2026-01-18T15:00:00Z",
  "acknowledgedByName": "John Doe"
}
```

### POST /admin/inventory/alerts/:warehouseId/acknowledge-all

```json
// Response 200
{
  "acknowledged": 15
}
```

### GET /admin/inventory/alerts/summary

```json
// Response 200 (для badge в sidebar)
{
  "unacknowledgedCount": 15,
  "criticalCount": 3
}
```

---

## Decision Logic

```
1. Создание алерта:
   При каждом StockMovement проверяется:
   IF newQuantity <= 0 THEN
     createOrUpdateAlert(OUT_OF_STOCK)
   ELSE IF newQuantity <= item.minStockLevel THEN
     createOrUpdateAlert(LOW_STOCK)
   ELSE IF newQuantity <= item.reorderPoint THEN
     createOrUpdateAlert(REORDER)
   ELSE
     resolveAlert(itemId, warehouseId)
   END IF

2. Автоматическое разрешение:
   Когда quantity восстанавливается выше порога:
   - Алерт помечается resolved
   - Новый алерт создаётся если снова упадёт

3. Affected Products:
   Найти все Recipe где item используется как ingredient
   Показать products связанные с этими recipes

4. Badge в sidebar:
   Показывать количество unacknowledged alerts
   Красный если есть OUT_OF_STOCK
```

---

## Quick Order Modal

```
+--------------------------------------------------+
|  Quick Order: Basil                        [X]   |
+--------------------------------------------------+
|                                                   |
|  Current Stock:     0 kg                          |
|  Reorder Quantity:  5 kg                          |
|                                                   |
|  Supplier:  [Fresh Farms LLC            v]       |
|             Last order: Jan 15, Price: 50,000/kg |
|                                                   |
|  Quantity:  [5          ] kg                     |
|  Price:     [50,000     ] UZS/kg                 |
|                                                   |
|  Total:     250,000 UZS                          |
|                                                   |
|  [x] Add to existing draft PO (PO-2501-019)      |
|  [ ] Create new Purchase Order                    |
|                                                   |
|                     [Cancel]  [Add to Order]     |
+--------------------------------------------------+
```

---

## Notification Integration

```
+---------------------------------------------------------------------+
|  УВЕДОМЛЕНИЯ ОБ АЛЕРТАХ                                              |
+---------------------------------------------------------------------+
|                                                                      |
|  Типы уведомлений (будущее):                                         |
|  - Push notification в Admin Panel                                   |
|  - Email digest (ежедневно)                                          |
|  - Telegram bot                                                      |
|                                                                      |
|  Настройки уведомлений:                                              |
|  - Кто получает (роли)                                               |
|  - Какие типы (OUT_OF_STOCK, LOW_STOCK)                              |
|  - Частота (мгновенно, digest)                                       |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 404 | Alert not found | Обновить список |
| 400 | Alert already acknowledged | Toast с информацией |

---

## Sidebar Badge

```
Inventory
  +-- Dashboard
  +-- ...
  +-- Alerts [15]  <-- красный badge если есть critical
```

---

## FAQ

**Q: Как настроить пороги для алертов?**

A: Через редактирование Item: minStockLevel и reorderPoint.

**Q: Можно ли отключить алерты для некоторых товаров?**

A: Установить minStockLevel = 0 и reorderPoint = 0.

**Q: Что значит "Acknowledge"?**

A: Подтверждение что алерт увиден. Не изменяет stock, только убирает из "непрочитанных".

---

*Документ актуален на январь 2026*
