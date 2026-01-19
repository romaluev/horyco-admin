# Screen 13: Stock Levels (Остатки по складам)

> Просмотр текущих остатков товаров

---

## Quick Summary

```
Dashboard
    |
    v
+-------------+
| Stock Levels| <-- текущий экран
+-------------+
    |
    +---> Filter by status (low/out)
    +---> View item details
    +---> Manual adjustment (modal)
    +---> Export to Excel
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:view`
- URL: `/admin/inventory/stock`

---

## UI Layout

```
+-------------------------------------------------------------------------+
|  Stock Levels                                                 [Export]  |
+-------------------------------------------------------------------------+
|  Warehouse: [Main Kitchen v]     Category: [All v]     [Search...]     |
|  Status: [All v]                                                        |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | Item             | Available | Reserved | Avg Cost | Total Value    ||
|  +---------------------------------------------------------------------+|
|  | Tomatoes         | 43.5 kg   | 2.0 kg   | 8,000    | 364,000        ||
|  | [Y] Mozzarella   | 10.0 kg   | 2.0 kg   | 85,000   | 1,020,000      ||
|  | Olive Oil        | 8.5 L     | 0 L      | 120,000  | 1,020,000      ||
|  | Flour 00         | 148.0 kg  | 2.0 kg   | 6,000    | 900,000        ||
|  | [R] Basil        | 0.2 kg    | 0 kg     | 50,000   | 10,000         ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [Y] = Low stock    [R] = Out of stock                                  |
|                                                                          |
|  Summary:                                                                |
|  Total Items: 156    Low Stock: 12    Out of Stock: 3                   |
|  Total Value: 45,234,000 UZS                          Page 1 of 12      |
+-------------------------------------------------------------------------+
```

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Stock Levels                                                 [Export]  |
+-------------------------------------------------------------------------+
|  Warehouse: [Main Kitchen v]     Category: [All v]     [Search...]     |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

### Empty State

```
+-------------------------------------------------------------------------+
|  Stock Levels                                                 [Export]  |
+-------------------------------------------------------------------------+
|  Warehouse: [Main Kitchen v]     Category: [All v]     [Search...]     |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [empty box icon]                                             ||
|  |                                                                      ||
|  |         No stock records yet                                         ||
|  |                                                                      ||
|  |         Stock will appear here after receiving                       ||
|  |         your first purchase order.                                   ||
|  |                                                                      ||
|  |         [Create Purchase Order]                                      ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

### Filtered Empty State

```
+-------------------------------------------------------------------------+
|  Stock Levels                                                 [Export]  |
+-------------------------------------------------------------------------+
|  Warehouse: [Main Kitchen v]   Category: [Dairy v]   Status: [Low v]   |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [check icon]                                                 ||
|  |                                                                      ||
|  |         All dairy items are well stocked                             ||
|  |                                                                      ||
|  |         [Clear Filters]                                              ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Stock Row Detail (expandable)

```
+-------------------------------------------------------------------------+
|  | Tomatoes         | 43.5 kg   | 2.0 kg   | 8,000    | 364,000    [v] ||
+-------------------------------------------------------------------------+
|  |                                                                      ||
|  |  Stock Details                                                       ||
|  |  +---------------------------------------------------------------+  ||
|  |  | Total Quantity:    45.5 kg                                    |  ||
|  |  | Reserved:          2.0 kg  (for 3 pending orders)             |  ||
|  |  | Available:         43.5 kg                                    |  ||
|  |  +---------------------------------------------------------------+  ||
|  |                                                                      ||
|  |  Cost Information                                                    ||
|  |  +---------------------------------------------------------------+  ||
|  |  | Average Cost (WAC):  8,000 UZS/kg                             |  ||
|  |  | Last Purchase Cost:  7,500 UZS/kg (Jan 15)                    |  ||
|  |  | Total Value:         364,000 UZS                              |  ||
|  |  +---------------------------------------------------------------+  ||
|  |                                                                      ||
|  |  Thresholds                                                          ||
|  |  +---------------------------------------------------------------+  ||
|  |  | Min Stock Level:   20 kg                                      |  ||
|  |  | Reorder Point:     30 kg                                      |  ||
|  |  | Max Stock Level:   100 kg                                     |  ||
|  |  +---------------------------------------------------------------+  ||
|  |                                                                      ||
|  |  [View Movements]  [Adjust Stock]                                    ||
|  |                                                                      ||
+-------------------------------------------------------------------------+
```

---

## Manual Adjustment Modal

```
+--------------------------------------------------+
|  Adjust Stock: Tomatoes                    [X]   |
+--------------------------------------------------+
|                                                   |
|  Current Stock: 45.5 kg                           |
|                                                   |
|  New Quantity*: [44.0        ] kg                |
|                                                   |
|  Difference: -1.5 kg                              |
|                                                   |
|  Reason*:       [Correction after count    v]    |
|                                                   |
|  Notes:         [Physical count showed 44kg ]    |
|                                                   |
|  [!] This will create a stock movement record    |
|                                                   |
|                         [Cancel]  [Apply]        |
+--------------------------------------------------+
```

### Adjustment Reasons

- Correction after count
- Damaged goods
- Found items
- System error correction
- Opening balance
- Other

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Warehouse selector | Перезагрузка данных для выбранного склада |
| Category filter | Фильтрация по категории товара |
| Status filter | All / Low Stock / Out of Stock |
| Search input | Поиск по имени товара |
| Export | Скачать Excel/CSV |
| Клик на строку | Развернуть детали |
| View Movements | Переход на Movements с фильтром по item |
| Adjust Stock | Открыть модалку корректировки |

---

## API Calls

### GET /admin/inventory/stock

```json
// Query: ?warehouseId=1&category=vegetables&status=low&search=tom
// Response 200
{
  "items": [
    {
      "id": 1,
      "warehouseId": 1,
      "warehouseName": "Main Kitchen",
      "itemId": 10,
      "itemName": "Tomatoes",
      "itemSku": "VEG-001",
      "itemUnit": "kg",
      "itemCategory": "vegetables",
      "quantity": 45.5,
      "reservedQuantity": 2.0,
      "availableQuantity": 43.5,
      "avgCost": 8000,
      "lastCost": 7500,
      "totalValue": 364000,
      "minStockLevel": 20,
      "reorderPoint": 30,
      "maxStockLevel": 100,
      "status": "ok",
      "lastMovementAt": "2026-01-18T14:30:00Z"
    },
    {
      "id": 2,
      "itemId": 15,
      "itemName": "Basil",
      "quantity": 0.2,
      "minStockLevel": 1,
      "status": "out"
    }
  ],
  "summary": {
    "totalItems": 156,
    "lowStockCount": 12,
    "outOfStockCount": 3,
    "totalValue": 45234000
  },
  "total": 156,
  "page": 1,
  "limit": 20
}
```

### GET /admin/inventory/stock/low

```json
// Query: ?warehouseId=1
// Response 200
[
  {
    "itemId": 10,
    "itemName": "Mozzarella",
    "quantity": 10,
    "minStockLevel": 10,
    "percentRemaining": 100,
    "status": "low"
  }
]
```

### GET /admin/inventory/stock/out

```json
// Query: ?warehouseId=1
// Response 200
[
  {
    "itemId": 15,
    "itemName": "Basil",
    "quantity": 0.2,
    "minStockLevel": 1,
    "status": "out"
  }
]
```

### POST /admin/inventory/stock/adjust

```json
// Request
{
  "warehouseId": 1,
  "itemId": 10,
  "newQuantity": 44.0,
  "reason": "Correction after count",
  "notes": "Physical count showed 44kg"
}

// Response 200
{
  "id": 1,
  "quantity": 44.0,
  "previousQuantity": 45.5,
  "adjustmentQuantity": -1.5,
  "movementId": 500,
  "updatedAt": "2026-01-18T15:00:00Z"
}
```

### GET /admin/inventory/stock/export

```
// Query: ?warehouseId=1&format=xlsx
// Response: Binary file download
```

---

## Decision Logic

```
1. Определение статуса:
   IF quantity <= 0 THEN
     status = "out"
     color = red
   ELSE IF quantity <= minStockLevel THEN
     status = "low"
     color = yellow
   ELSE
     status = "ok"
     color = none
   END IF

2. Available quantity:
   availableQuantity = quantity - reservedQuantity

3. Сортировка по умолчанию:
   - Сначала out of stock
   - Затем low stock
   - Затем остальные по имени

4. Корректировка:
   - Требует permission inventory:adjust
   - Создаёт StockMovement типа MANUAL_ADJUSTMENT
   - Логирует пользователя и причину
```

---

## Status Colors

| Status | Цвет | Условие |
|--------|------|---------|
| out | Red (#EF4444) | quantity <= 0 |
| low | Yellow (#F59E0B) | 0 < quantity <= minStockLevel |
| ok | None | quantity > minStockLevel |

---

## Export Format (Excel)

| Column | Description |
|--------|-------------|
| Item Name | Название товара |
| SKU | Артикул |
| Category | Категория |
| Unit | Единица измерения |
| Quantity | Текущий остаток |
| Reserved | Зарезервировано |
| Available | Доступно |
| Avg Cost | Средняя себестоимость |
| Total Value | Общая стоимость |
| Min Level | Минимальный уровень |
| Status | ok/low/out |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Invalid quantity | Ошибка в модалке корректировки |
| 403 | No adjust permission | Скрыть кнопку Adjust Stock |
| 404 | Stock record not found | Toast с ошибкой |

---

## Permissions

```
inventory:view   -> Просмотр остатков
inventory:adjust -> Ручная корректировка (кнопка Adjust Stock)
inventory:export -> Экспорт (кнопка Export)
```

---

## FAQ

**Q: Что такое Reserved quantity?**

A: Зарезервированное количество для заказов в статусе PENDING/CONFIRMED/PREPARING. Списывается при COMPLETED.

**Q: Почему avgCost отличается от lastCost?**

A: avgCost — средневзвешенная себестоимость (WAC), рассчитывается по всем закупкам. lastCost — цена последней закупки.

**Q: Может ли quantity быть отрицательным?**

A: Да, при soft check режиме. Это означает пересортицу или ошибку в учёте.

---

*Документ актуален на январь 2026*
