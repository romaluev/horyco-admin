# Screen 14: Stock Movements (История движений)

> Просмотр истории всех движений склада

---

## Quick Summary

```
Dashboard
    |
    v
+-----------+
| Movements | <-- текущий экран
+-----------+
    |
    +---> View movement details
    +---> Filter by type/date/item
    +---> Export history
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:view`
- URL: `/admin/inventory/movements`

---

## UI Layout

```
+-------------------------------------------------------------------------+
|  Stock Movements                                              [Export]  |
+-------------------------------------------------------------------------+
|  Warehouse: [Main Kitchen v]   Item: [All v]   Type: [All v]           |
|  Date: [Jan 1] - [Jan 18]                                              |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | Date/Time   | Item       | Type         | Qty   | Cost  | Balance  ||
|  +---------------------------------------------------------------------+|
|  | Jan 18 14:30| Tomatoes   | Sale         | -2.0  | 8,000 | 43.5 kg  ||
|  | Jan 18 12:00| Flour      | Purchase     | +50.0 | 6,000 | 150.0 kg ||
|  | Jan 18 10:30| Cheese     | Sale         | -0.5  | 85,000| 11.5 kg  ||
|  | Jan 17 16:00| Olive Oil  | Writeoff     | -1.0  |120,000| 8.5 L    ||
|  | Jan 17 14:00| Tomatoes   | Adjustment   | +5.0  | 8,000 | 45.5 kg  ||
|  | Jan 17 09:00| Beef       | Production   | -2.0  | 85,000| 20.0 kg  ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Summary for period:                                                     |
|  Purchases: +2,500,000   Sales: -850,000   Writeoffs: -120,000          |
|                                                         Page 1 of 25    |
+-------------------------------------------------------------------------+
```

---

## Movement Detail (Expandable Row)

```
+-------------------------------------------------------------------------+
|  | Jan 18 14:30| Tomatoes   | Sale         | -2.0  | 8,000 | 43.5  [v] ||
+-------------------------------------------------------------------------+
|  |                                                                      ||
|  |  Movement Details                                                    ||
|  |  +---------------------------------------------------------------+  ||
|  |  | Movement ID:     500                                          |  ||
|  |  | Type:            SALE_DEDUCTION                               |  ||
|  |  | Quantity:        -2.0 kg                                      |  ||
|  |  | Unit Cost:       8,000 UZS/kg                                 |  ||
|  |  | Total Cost:      16,000 UZS                                   |  ||
|  |  | Balance After:   43.5 kg                                      |  ||
|  |  | WAC After:       8,236 UZS/kg                                 |  ||
|  |  +---------------------------------------------------------------+  ||
|  |                                                                      ||
|  |  Reference                                                           ||
|  |  +---------------------------------------------------------------+  ||
|  |  | Type:    Order                                                |  ||
|  |  | ID:      Order #1234                                          |  ||
|  |  | Product: Classic Burger x 2                                   |  ||
|  |  +---------------------------------------------------------------+  ||
|  |                                                                      ||
|  |  [View Order]                                                        ||
|  |                                                                      ||
+-------------------------------------------------------------------------+
```

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Stock Movements                                              [Export]  |
+-------------------------------------------------------------------------+
|  Warehouse: [Main Kitchen v]   Item: [All v]   Type: [All v]           |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

### Empty State (no movements for filters)

```
+-------------------------------------------------------------------------+
|  Stock Movements                                              [Export]  |
+-------------------------------------------------------------------------+
|  Warehouse: [Main Kitchen v]   Item: [Tomatoes v]   Type: [Writeoff v] |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [document icon]                                              ||
|  |                                                                      ||
|  |         No movements found                                           ||
|  |                                                                      ||
|  |         Try adjusting your filters or date range.                    ||
|  |                                                                      ||
|  |         [Clear Filters]                                              ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Movement Types

| Type | Название | Описание | Qty |
|------|----------|----------|-----|
| PURCHASE_RECEIVE | Purchase | Приёмка закупки | + |
| SALE_DEDUCTION | Sale | Списание при продаже | - |
| SALE_REVERSAL | Sale Reversal | Возврат при отмене заказа | + |
| WRITEOFF | Writeoff | Списание (порча, истёк срок) | - |
| ADJUSTMENT | Adjustment | Ручная корректировка | +/- |
| PRODUCTION_INPUT | Production In | Списание на производство | - |
| PRODUCTION_OUTPUT | Production Out | Выпуск с производства | + |
| TRANSFER_OUT | Transfer Out | Перемещение на другой склад | - |
| TRANSFER_IN | Transfer In | Получение с другого склада | + |
| COUNT_ADJUSTMENT | Count Adjust | Корректировка по инвентаризации | +/- |

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Warehouse selector | Фильтр по складу |
| Item filter | Фильтр по конкретному товару |
| Type filter | Фильтр по типу движения |
| Date range | Фильтр по периоду |
| Клик на строку | Развернуть детали |
| View Order/PO/etc | Переход на связанный документ |
| Export | Скачать Excel/CSV |

---

## API Calls

### GET /admin/inventory/movements

```json
// Query: ?warehouseId=1&itemId=10&movementType=SALE_DEDUCTION&fromDate=2026-01-01&toDate=2026-01-18
// Response 200
{
  "items": [
    {
      "id": 500,
      "warehouseId": 1,
      "warehouseName": "Main Kitchen",
      "itemId": 10,
      "itemName": "Tomatoes",
      "itemUnit": "kg",
      "movementType": "SALE_DEDUCTION",
      "movementTypeDisplay": "Sale",
      "quantity": -2.0,
      "unitCost": 8000,
      "totalCost": 16000,
      "balanceAfter": 43.5,
      "costAfter": 8236,
      "referenceType": "order",
      "referenceId": 1234,
      "referenceDisplay": "Order #1234",
      "notes": null,
      "createdAt": "2026-01-18T14:30:00Z",
      "createdByName": "John Doe"
    }
  ],
  "summary": {
    "totalPurchases": 2500000,
    "totalSales": 850000,
    "totalWriteoffs": 120000,
    "totalAdjustments": 40000,
    "netChange": 1570000
  },
  "total": 500,
  "page": 1,
  "limit": 50
}
```

### GET /admin/inventory/movements/:id

```json
// Response 200
{
  "id": 500,
  "warehouseId": 1,
  "warehouseName": "Main Kitchen",
  "itemId": 10,
  "itemName": "Tomatoes",
  "itemSku": "VEG-001",
  "itemUnit": "kg",
  "movementType": "SALE_DEDUCTION",
  "movementTypeDisplay": "Sale",
  "quantity": -2.0,
  "unitCost": 8000,
  "totalCost": 16000,
  "balanceAfter": 43.5,
  "costAfter": 8236,
  "referenceType": "order",
  "referenceId": 1234,
  "referenceDisplay": "Order #1234",
  "reference": {
    "type": "order",
    "id": 1234,
    "orderNumber": "#1234",
    "products": [
      {"name": "Classic Burger", "quantity": 2}
    ]
  },
  "notes": null,
  "createdAt": "2026-01-18T14:30:00Z",
  "createdBy": 1,
  "createdByName": "John Doe"
}
```

### GET /admin/inventory/movements/export

```
// Query: ?warehouseId=1&fromDate=2026-01-01&toDate=2026-01-18&format=xlsx
// Response: Binary file download
```

---

## Decision Logic

```
1. Цветовое кодирование:
   IF quantity > 0 THEN
     color = green
   ELSE
     color = red
   END IF

2. Группировка по дате:
   Показывать заголовок даты при смене дня

3. Reference links:
   referenceType = 'order' -> /admin/orders/:id
   referenceType = 'purchase_order' -> /admin/inventory/purchase-orders/:id
   referenceType = 'writeoff' -> /admin/inventory/writeoffs/:id
   referenceType = 'production' -> /admin/inventory/production/:id
   referenceType = 'count' -> /admin/inventory/counts/:id

4. Default date range:
   Последние 30 дней
```

---

## Export Format (Excel)

| Column | Description |
|--------|-------------|
| Date | Дата и время |
| Warehouse | Склад |
| Item | Товар |
| SKU | Артикул |
| Type | Тип движения |
| Quantity | Количество (+/-) |
| Unit | Единица |
| Unit Cost | Себестоимость единицы |
| Total Cost | Общая стоимость |
| Balance | Остаток после |
| Reference | Ссылка на документ |
| Created By | Кто создал |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Invalid date range | Показать ошибку |
| 404 | Movement not found | Toast с ошибкой |

---

## FAQ

**Q: Можно ли отменить движение?**

A: Напрямую нет. Нужно создать обратное движение (корректировку) или списание.

**Q: Почему некоторые движения без Reference?**

A: Ручные корректировки и некоторые старые записи могут не иметь связи с документом.

**Q: Как найти движения для конкретного заказа?**

A: Использовать поиск по Reference ID или открыть заказ и посмотреть связанные движения.

---

*Документ актуален на январь 2026*
