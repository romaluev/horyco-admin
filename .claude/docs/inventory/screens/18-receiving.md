# Screen 18: Receiving (Приёмка товара)

> Приёмка товаров по заказам поставщикам

---

## Quick Summary

```
Purchase Orders
    |
    v (Receive Items)
+-----------+
| Receiving | <-- текущий экран
+-----------+
    |
    +---> Confirm quantities
    +---> Adjust prices (if different)
    +---> Stock updated
    +---> WAC recalculated
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:purchase`
- URL: `/admin/inventory/purchase-orders/:id/receive`

---

## UI Layout: Receive Page

```
+-------------------------------------------------------------------------+
|  < Back to PO-2501-0018                                                 |
+-------------------------------------------------------------------------+
|  Receive Items                                              [Complete]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  Order Info                                                              |
|  +---------------------------------------------------------------------+|
|  | Supplier:      Fresh Farms LLC                                      ||
|  | Warehouse:     Main Kitchen                                         ||
|  | Order Date:    Jan 18, 2026                                         ||
|  | Expected:      Jan 21, 2026                                         ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Receive Date: [2026-01-21]                                             |
|  Receive #:    RCV-2501-0012 (auto-generated)                           |
|                                                                          |
|  Items to Receive                                                        |
|  +---------------------------------------------------------------------+|
|  | Item         | Ordered | Received | Now    | Price   | Note        ||
|  +---------------------------------------------------------------------+|
|  | Tomatoes     | 50 kg   | 0 kg     | [50  ] | [8,500] | [         ] ||
|  | Cucumbers    | 30 kg   | 0 kg     | [30  ] | [6,000] | [         ] ||
|  | Bell Peppers | 20 kg   | 10 kg    | [10  ] | [12,000]| [         ] ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [i] Bell Peppers: 10 kg already received on Jan 19                     |
|                                                                          |
|  Price Variance Warning:                                                 |
|  +---------------------------------------------------------------------+|
|  | [!] Tomatoes: Entered price 8,500 differs from ordered 8,000        ||
|  |     Variance: +6.25%                                                ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Notes: [Quality check passed. Bell peppers slightly damaged.       ]  |
|                                                                          |
|  Summary                                                                 |
|  +---------------------------------------------------------------------+|
|  | Items receiving: 3                                                  ||
|  | Total quantity:  90 units                                           ||
|  | Total value:     765,000 UZS                                        ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                       [Cancel]  [Confirm Receipt]       |
+-------------------------------------------------------------------------+
```

---

## Partial Receive (Already Received Some Items)

```
+-------------------------------------------------------------------------+
|  Receive Items - PO-2501-0015                              [Complete]   |
+-------------------------------------------------------------------------+
|                                                                          |
|  Previous Receipts                                                       |
|  +---------------------------------------------------------------------+|
|  | Receipt #       | Date       | Items | Amount                       ||
|  +---------------------------------------------------------------------+|
|  | RCV-2501-0010   | Jan 19     | 2     | 380,000 UZS                  ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Remaining to Receive                                                    |
|  +---------------------------------------------------------------------+|
|  | Item         | Ordered | Received | Remaining | Now    | Price      ||
|  +---------------------------------------------------------------------+|
|  | Tomatoes     | 50 kg   | 30 kg    | 20 kg     | [20  ] | [8,500]   ||
|  | Cucumbers    | 30 kg   | 30 kg    | 0 kg      | [--  ] | [--   ]   ||
|  | Bell Peppers | 20 kg   | 10 kg    | 10 kg     | [10  ] | [12,000]  ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [i] Cucumbers fully received. No remaining quantity.                   |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Receive Items - PO-2501-0018                                           |
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

### Order Fully Received State

```
+-------------------------------------------------------------------------+
|  < Back to PO-2501-0015                                                 |
+-------------------------------------------------------------------------+
|  Receive Items                                                          |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [check icon]                                                 ||
|  |                                                                      ||
|  |         Order Fully Received                                         ||
|  |                                                                      ||
|  |         All items have been received.                                ||
|  |                                                                      ||
|  |         [View Order Details]                                         ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Confirmation Dialog

```
+--------------------------------------------------+
|  Confirm Receipt                           [X]   |
+--------------------------------------------------+
|                                                   |
|  You are about to receive:                        |
|                                                   |
|  * 50 kg Tomatoes @ 8,500 = 425,000              |
|  * 30 kg Cucumbers @ 6,000 = 180,000             |
|  * 10 kg Bell Peppers @ 12,000 = 120,000         |
|                                                   |
|  Total: 725,000 UZS                              |
|                                                   |
|  This will:                                       |
|  * Add items to Main Kitchen warehouse           |
|  * Update stock quantities                        |
|  * Recalculate average costs (WAC)               |
|                                                   |
|  [!] Price variance detected for Tomatoes        |
|                                                   |
|                     [Cancel]  [Confirm]          |
+--------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Изменить Receive Date | Дата приёмки |
| Изменить quantity | Количество для приёмки |
| Изменить price | Фактическая цена (если отличается) |
| Добавить note | Заметка к позиции |
| Cancel | Вернуться к PO без изменений |
| Confirm Receipt | Создать приёмку, обновить stock |

---

## API Calls

### GET /admin/inventory/purchase-orders/:id (with receive info)

```json
// Response 200
{
  "id": 18,
  "poNumber": "PO-2501-0018",
  "status": "SENT",
  "items": [
    {
      "id": 1,
      "itemId": 10,
      "itemName": "Tomatoes",
      "quantityOrdered": 50,
      "quantityReceived": 0,
      "quantityRemaining": 50,
      "unit": "kg",
      "unitPrice": 8000,
      "lastReceivedPrice": null
    }
  ],
  "receives": [],
  "canReceive": true
}
```

### GET /admin/inventory/purchase-orders/:id/receives

```json
// Response 200 (история приёмок)
[
  {
    "id": 10,
    "receiveNumber": "RCV-2501-0010",
    "receiveDate": "2026-01-19",
    "itemCount": 2,
    "totalValue": 380000,
    "notes": null,
    "items": [
      {
        "id": 1,
        "itemId": 10,
        "itemName": "Tomatoes",
        "quantityReceived": 30,
        "unitPrice": 8000,
        "totalCost": 240000
      }
    ],
    "createdAt": "2026-01-19T14:00:00Z",
    "createdByName": "John Doe"
  }
]
```

### POST /admin/inventory/purchase-orders/:id/receive

```json
// Request
{
  "receiveDate": "2026-01-21",
  "notes": "Quality check passed",
  "items": [
    {
      "poItemId": 1,
      "quantityReceived": 50,
      "unitPrice": 8500,
      "notes": "Grade A tomatoes"
    },
    {
      "poItemId": 2,
      "quantityReceived": 30,
      "unitPrice": 6000
    },
    {
      "poItemId": 3,
      "quantityReceived": 10,
      "unitPrice": 12000,
      "notes": "Slightly damaged, discounted"
    }
  ]
}

// Response 200
{
  "id": 12,
  "receiveNumber": "RCV-2501-0012",
  "receiveDate": "2026-01-21",
  "totalValue": 765000,
  "orderStatus": "RECEIVED",
  "stockUpdates": [
    {
      "itemId": 10,
      "itemName": "Tomatoes",
      "previousQuantity": 45.5,
      "newQuantity": 95.5,
      "previousWAC": 8000,
      "newWAC": 8236,
      "movementId": 500
    }
  ]
}
```

---

## Decision Logic

```
1. Валидация количества:
   IF quantityReceived > quantityRemaining THEN
     показать ошибку "Cannot receive more than ordered"
   END IF

   IF quantityReceived <= 0 THEN
     пропустить позицию (не включать в приёмку)
   END IF

2. Обнаружение variance:
   IF unitPrice != poItem.unitPrice THEN
     variancePercent = (unitPrice - poItem.unitPrice) / poItem.unitPrice * 100
     показать warning если |variancePercent| > 5%
   END IF

3. Обновление статуса PO:
   IF все items.quantityReceived >= items.quantityOrdered THEN
     orderStatus = RECEIVED
   ELSE IF любой item частично получен THEN
     orderStatus = PARTIAL
   END IF

4. Расчёт WAC при приёмке:
   newWAC = (currentQty * currentWAC + receivedQty * receivedPrice)
            / (currentQty + receivedQty)

5. Генерация номера приёмки:
   Формат: RCV-YYMM-XXXX
```

---

## What Happens on Confirm

```
+---------------------------------------------------------------------+
|  ПРОЦЕСС ПРИЁМКИ                                                     |
+---------------------------------------------------------------------+
|                                                                      |
|  1. Создание PurchaseReceive                                         |
|     +--------------------------------------------------------------+ |
|     | id: 12                                                       | |
|     | receiveNumber: RCV-2501-0012                                 | |
|     | purchaseOrderId: 18                                          | |
|     | receiveDate: 2026-01-21                                      | |
|     +--------------------------------------------------------------+ |
|                                                                      |
|  2. Для каждой позиции:                                              |
|     +--------------------------------------------------------------+ |
|     | a) Создать PurchaseReceiveItem                               | |
|     | b) Создать StockMovement (PURCHASE_RECEIVE)                  | |
|     | c) Обновить Stock (quantity, avgCost)                        | |
|     | d) Обновить POItem.quantityReceived                          | |
|     | e) Записать историю цен (если изменилась)                    | |
|     +--------------------------------------------------------------+ |
|                                                                      |
|  3. Обновить статус PO (PARTIAL или RECEIVED)                        |
|                                                                      |
|  4. Обновить статистику поставщика                                   |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| receiveDate | Обязательное, не в будущем |
| items | Минимум 1 позиция с quantity > 0 |
| item.quantityReceived | > 0, <= remaining |
| item.unitPrice | > 0 |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Order cannot be received | Toast, вернуться к PO |
| 400 | Quantity exceeds remaining | Ошибка под полем quantity |
| 400 | Item not found | Ошибка для позиции |
| 404 | Order not found | Вернуться на список PO |

---

## Price Variance Thresholds

| Variance | UI |
|----------|-----|
| 0-5% | Нет предупреждения |
| 5-10% | Warning (жёлтый) |
| >10% | Alert (оранжевый) |
| >20% | Strong alert (красный), требует подтверждения |

---

## FAQ

**Q: Можно ли получить больше чем заказано?**

A: Нет, система блокирует приёмку больше остатка. Нужно создать новый PO.

**Q: Что если фактическая цена отличается?**

A: Указать фактическую цену в поле. Разница будет отражена в Stock с новым WAC.

**Q: Как отменить приёмку?**

A: Напрямую нельзя. Нужно создать корректировку stock или списание.

**Q: Когда обновляется WAC?**

A: Сразу при подтверждении приёмки. Новая цена влияет на себестоимость.

---

*Документ актуален на январь 2026*
