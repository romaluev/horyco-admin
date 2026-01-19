# Screen 17: Purchase Orders (Заказы поставщикам)

> Создание и управление заказами на закупку

---

## Quick Summary

```
Dashboard
    |
    v
+-----------------+
| Purchase Orders | <-- текущий экран
+-----------------+
    |
    +---> Create PO (page)
    +---> Edit PO (page)
    +---> Send to Supplier
    +---> Receive Items --> Screen 18
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:purchase`
- URL: `/admin/inventory/purchase-orders`

---

## UI Layout: List

```
+-------------------------------------------------------------------------+
|  Purchase Orders                                     [+ Create Order]   |
+-------------------------------------------------------------------------+
|  [Search...]     Supplier: [All v]   Status: [All v]   Warehouse: [All v]
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | PO Number    | Supplier      | Warehouse | Amount    | Due   |Status||
|  +---------------------------------------------------------------------+|
|  | PO-2501-0018 | Fresh Farms   | Main Kitch| 2,500,000 | Jan 25|[Sent]||
|  | PO-2501-0015 | Dairy Direct  | Main Kitch| 1,800,000 | Jan 20|[Part]||
|  | PO-2501-0012 | Meat Masters  | Main Kitch| 3,200,000 | Jan 18|[Recv]||
|  | PO-2501-0010 | Fresh Farms   | Bar Store | 850,000   | Jan 15|[Recv]||
|  | PO-2501-0008 | Kitchen Supp  | Main Kitch| 2,100,000 | --    |[Draft||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Status Legend: [Draft] [Sent] [Part]=Partial [Recv]=Received [Canc]    |
|                                                         Page 1 of 5     |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Create/Edit PO Page

```
+-------------------------------------------------------------------------+
|  < Back to Purchase Orders                                              |
+-------------------------------------------------------------------------+
|  PO-2501-0018                                   Status: [DRAFT] [Send]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  Order Info                                                              |
|  +---------------------------------------------------------------------+|
|  | Supplier*:    [Fresh Farms LLC                              v]      ||
|  | Warehouse*:   [Main Kitchen                                 v]      ||
|  | Order Date:   [2026-01-18]                                          ||
|  | Expected:     [2026-01-21] (3 days lead time)                       ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Order Items                                         [+ Add Item]       |
|  +---------------------------------------------------------------------+|
|  | Item         | Qty     | Unit | Price    | Disc% | Tax% | Total     ||
|  +---------------------------------------------------------------------+|
|  | Tomatoes     | 50      | kg   | 8,500    | 0     | 12   | 476,000   ||
|  | Cucumbers    | 30      | kg   | 6,000    | 0     | 12   | 201,600   ||
|  | Bell Peppers | 20      | kg   | 12,000   | 5     | 12   | 256,080   ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Order Summary                                                           |
|  +---------------------------------------------------------------------+|
|  | Subtotal:                              933,680 UZS                  ||
|  | Discount:                              -12,000 UZS                  ||
|  | Tax (12%):                             +110,602 UZS                 ||
|  | ------------------------------------------------------------------  ||
|  | TOTAL:                                 1,032,282 UZS                ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Notes                                                                   |
|  +---------------------------------------------------------------------+|
|  | [Please deliver before 10 AM                               ]        ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                   [Save Draft]  [Send to Supplier]      |
+-------------------------------------------------------------------------+
```

---

## Add Item Modal

```
+--------------------------------------------------+
|  Add Item to Order                         [X]   |
+--------------------------------------------------+
|                                                   |
|  Item*:         [Search items...           v]    |
|                                                   |
|  Quantity*:     [50         ] kg                 |
|                                                   |
|  Unit Price*:   [8,500      ] UZS                |
|                 Last price: 8,000 UZS            |
|                                                   |
|  Discount:      [0          ] %                  |
|  Tax Rate:      [12         ] %                  |
|                                                   |
|  Total:         476,000 UZS                      |
|                                                   |
|                         [Cancel]  [Add]          |
+--------------------------------------------------+
```

---

## Status Flow

```
+---------------------------------------------------------------------+
|  СТАТУСЫ ЗАКАЗА ПОСТАВЩИКУ                                           |
+---------------------------------------------------------------------+
|                                                                      |
|  DRAFT -----> SENT -----> PARTIAL -----> RECEIVED                    |
|    |           |             |                                       |
|    v           v             v                                       |
|  CANCELLED  CANCELLED    (cannot cancel)                             |
|                                                                      |
|  DRAFT:    Черновик, можно редактировать                             |
|  SENT:     Отправлен поставщику, ожидаем доставку                    |
|  PARTIAL:  Часть товаров получена                                    |
|  RECEIVED: Все товары получены                                       |
|  CANCELLED: Отменён                                                  |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Purchase Orders                                     [+ Create Order]   |
+-------------------------------------------------------------------------+
|  [Search...]     Supplier: [All v]   Status: [All v]                   |
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
|  Purchase Orders                                     [+ Create Order]   |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [document icon]                                              ||
|  |                                                                      ||
|  |         No purchase orders yet                                       ||
|  |                                                                      ||
|  |         Create your first order to start                             ||
|  |         receiving inventory.                                         ||
|  |                                                                      ||
|  |         [+ Create First Order]                                       ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Клик "+ Create Order" | Переход на страницу создания |
| Клик на строку | Переход на страницу просмотра/редактирования |
| Search | Поиск по номеру PO |
| Supplier filter | Фильтр по поставщику |
| Status filter | DRAFT/SENT/PARTIAL/RECEIVED/CANCELLED |
| Warehouse filter | Фильтр по складу |
| Add Item | Модалка добавления товара |
| Remove Item | Удаление строки |
| Save Draft | Сохранить как черновик |
| Send to Supplier | Изменить статус на SENT |
| Receive Items | Переход на экран приёмки |
| Cancel Order | Отмена (если DRAFT или SENT) |
| Print/Export | Печать или экспорт PDF |

---

## API Calls

### GET /admin/inventory/purchase-orders

```json
// Query: ?supplierId=1&status=SENT&warehouseId=1
// Response 200
{
  "items": [
    {
      "id": 18,
      "poNumber": "PO-2501-0018",
      "supplierId": 1,
      "supplierName": "Fresh Farms LLC",
      "warehouseId": 1,
      "warehouseName": "Main Kitchen",
      "status": "SENT",
      "orderDate": "2026-01-18",
      "expectedDate": "2026-01-21",
      "receivedDate": null,
      "subtotal": 933680,
      "discountAmount": 12000,
      "taxAmount": 110602,
      "totalAmount": 1032282,
      "itemCount": 3,
      "receivedItemCount": 0,
      "currency": "UZS",
      "createdAt": "2026-01-18T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### GET /admin/inventory/purchase-orders/:id

```json
// Response 200
{
  "id": 18,
  "poNumber": "PO-2501-0018",
  "supplierId": 1,
  "supplierName": "Fresh Farms LLC",
  "supplierPhone": "+998901234567",
  "warehouseId": 1,
  "warehouseName": "Main Kitchen",
  "status": "SENT",
  "orderDate": "2026-01-18",
  "expectedDate": "2026-01-21",
  "receivedDate": null,
  "subtotal": 933680,
  "discountAmount": 12000,
  "taxAmount": 110602,
  "totalAmount": 1032282,
  "currency": "UZS",
  "notes": "Please deliver before 10 AM",
  "items": [
    {
      "id": 1,
      "itemId": 10,
      "itemName": "Tomatoes",
      "itemSku": "VEG-001",
      "quantityOrdered": 50,
      "quantityReceived": 0,
      "quantityRemaining": 50,
      "unit": "kg",
      "unitPrice": 8500,
      "discountPct": 0,
      "taxRate": 12,
      "totalPrice": 476000,
      "notes": null
    }
  ],
  "canEdit": true,
  "canCancel": true,
  "canReceive": true,
  "createdAt": "2026-01-18T10:00:00Z",
  "createdByName": "Admin User"
}
```

### POST /admin/inventory/purchase-orders

```json
// Request
{
  "supplierId": 1,
  "warehouseId": 1,
  "orderDate": "2026-01-18",
  "expectedDate": "2026-01-21",
  "discountAmount": 0,
  "taxAmount": 0,
  "currency": "UZS",
  "notes": "Please deliver before 10 AM",
  "items": [
    {
      "itemId": 10,
      "quantityOrdered": 50,
      "unit": "kg",
      "unitPrice": 8500,
      "discountPct": 0,
      "taxRate": 12
    }
  ]
}

// Response 201
{
  "id": 18,
  "poNumber": "PO-2501-0018",
  "status": "DRAFT",
  "totalAmount": 476000,
  ...
}
```

### PATCH /admin/inventory/purchase-orders/:id

```json
// Request
{
  "expectedDate": "2026-01-22",
  "notes": "Updated delivery date"
}

// Response 200
{
  "id": 18,
  "expectedDate": "2026-01-22",
  "updatedAt": "2026-01-18T11:00:00Z"
}
```

### POST /admin/inventory/purchase-orders/:id/send

```json
// Response 200
{
  "id": 18,
  "status": "SENT",
  "sentAt": "2026-01-18T12:00:00Z"
}
```

### POST /admin/inventory/purchase-orders/:id/cancel

```json
// Request
{
  "reason": "Supplier cannot fulfill order"
}

// Response 200
{
  "id": 18,
  "status": "CANCELLED",
  "cancelledAt": "2026-01-18T12:00:00Z"
}
```

### DELETE /admin/inventory/purchase-orders/:id

```json
// Response 204 (только для DRAFT)

// Response 400
{
  "statusCode": 400,
  "message": "Cannot delete order in SENT status",
  "error": "Bad Request"
}
```

---

## Decision Logic

```
1. Генерация номера PO:
   Формат: PO-YYMM-XXXX (PO-2501-0018)
   YYMM = год и месяц
   XXXX = порядковый номер за месяц

2. Expected Date:
   IF expectedDate не указано THEN
     expectedDate = orderDate + supplier.leadTimeDays
   END IF

3. Расчёт суммы позиции:
   basePrice = quantity * unitPrice
   discount = basePrice * (discountPct / 100)
   afterDiscount = basePrice - discount
   tax = afterDiscount * (taxRate / 100)
   totalPrice = afterDiscount + tax

4. Действия по статусу:
   IF status = DRAFT THEN
     canEdit = true, canCancel = true, canSend = true
   ELSE IF status = SENT THEN
     canEdit = false, canCancel = true, canReceive = true
   ELSE IF status = PARTIAL THEN
     canEdit = false, canCancel = false, canReceive = true
   ELSE
     canEdit = false, canCancel = false, canReceive = false
   END IF

5. Минимальный заказ:
   IF totalAmount < supplier.minimumOrderAmount THEN
     показать warning (но не блокировать)
   END IF
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| supplierId | Обязательное |
| warehouseId | Обязательное |
| orderDate | Обязательное, не в будущем |
| expectedDate | >= orderDate |
| items | Минимум 1 позиция |
| item.quantityOrdered | > 0 |
| item.unitPrice | >= 0 |
| item.discountPct | 0-100 |
| item.taxRate | 0-100 |

---

## Status Badge Colors

| Status | Цвет | Описание |
|--------|------|----------|
| DRAFT | Gray | Черновик |
| SENT | Blue | Отправлен |
| PARTIAL | Yellow | Частично получен |
| RECEIVED | Green | Полностью получен |
| CANCELLED | Red | Отменён |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Cannot edit sent order | Toast с предупреждением |
| 400 | Cannot cancel partial order | Показать объяснение |
| 400 | Item not found | Ошибка под полем товара |
| 404 | Order not found | Вернуться на список |

---

## FAQ

**Q: Можно ли редактировать отправленный заказ?**

A: Нет, после отправки редактирование заблокировано. Можно только отменить и создать новый.

**Q: Что делать если цена изменилась при приёмке?**

A: При приёмке можно указать фактическую цену, отличную от заказанной.

**Q: Как работает частичная приёмка?**

A: Если получена только часть товаров, статус меняется на PARTIAL. Можно создать несколько приёмок.

---

*Документ актуален на январь 2026*
