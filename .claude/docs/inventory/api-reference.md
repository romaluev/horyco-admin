# API Reference

> Справочник всех API endpoints модуля инвентаризации

**Base URL:** `/api/admin/inventory`

---

## Оглавление

1. [Warehouses](#warehouses)
2. [Items](#items)
3. [Stock](#stock)
4. [Movements](#movements)
5. [Recipes](#recipes)
6. [Suppliers](#suppliers)
7. [Purchase Orders](#purchase-orders)
8. [Writeoffs](#writeoffs)
9. [Inventory Counts](#inventory-counts)
10. [Production](#production)
11. [Alerts](#alerts)

---

## Warehouses

### GET /warehouses

Список складов.

```
Query: ?isActive=true

Response 200:
[
  {
    "id": 1,
    "name": "Main Kitchen",
    "code": "WH-001",
    "branchId": 1,
    "branchName": "Central Branch",
    "isActive": true,
    "isDefault": true,
    "itemCount": 156,
    "totalStockValue": 45234000
  }
]
```

### GET /warehouses/:id

Детали склада.

### POST /warehouses

Создать склад.

```
Request:
{
  "name": "Main Kitchen",
  "code": "WH-001",
  "branchId": 1,
  "isActive": true,
  "isDefault": true
}
```

### PATCH /warehouses/:id

Обновить склад.

### DELETE /warehouses/:id

Удалить склад (soft delete).

### GET /warehouses/:id/stock-summary

KPI склада.

```
Response 200:
{
  "totalItems": 156,
  "lowStockCount": 12,
  "outOfStockCount": 3,
  "totalStockValue": 45234000
}
```

---

## Items

### GET /items

Список номенклатуры.

```
Query: ?category=vegetables&isActive=true&isSemiFinished=false&search=tom

Response 200:
{
  "items": [...],
  "total": 156,
  "page": 1,
  "limit": 20
}
```

### GET /items/categories

Список категорий.

### GET /items/:id

Детали товара.

### POST /items

Создать товар.

```
Request:
{
  "name": "Tomatoes",
  "sku": "VEG-001",
  "category": "vegetables",
  "unit": "kg",
  "minStockLevel": 20,
  "maxStockLevel": 100,
  "isActive": true,
  "isSemiFinished": false
}
```

### PATCH /items/:id

Обновить товар.

### DELETE /items/:id

Удалить товар.

### GET /items/:id/conversions

Конверсии единиц.

### POST /items/:id/conversions

Добавить конверсию.

```
Request:
{
  "fromUnit": "box",
  "conversionFactor": 10
}
```

### DELETE /items/:id/conversions/:conversionId

Удалить конверсию.

---

## Stock

### GET /stock

Остатки по складу.

```
Query: ?warehouseId=1&category=vegetables&status=low

Response 200:
{
  "items": [
    {
      "itemId": 10,
      "itemName": "Tomatoes",
      "quantity": 45.5,
      "reservedQuantity": 2.0,
      "availableQuantity": 43.5,
      "avgCost": 8000,
      "totalValue": 364000,
      "status": "ok"
    }
  ],
  "summary": {
    "totalItems": 156,
    "lowStockCount": 12,
    "totalValue": 45234000
  }
}
```

### GET /stock/low

Товары с низким остатком.

### GET /stock/out

Товары без остатка.

### POST /stock/adjust

Ручная корректировка.

```
Request:
{
  "warehouseId": 1,
  "itemId": 10,
  "newQuantity": 44.0,
  "reason": "Correction after count",
  "notes": "Physical count showed 44kg"
}

Response 200:
{
  "quantity": 44.0,
  "previousQuantity": 45.5,
  "movementId": 500
}
```

### GET /stock/export

Экспорт в Excel.

```
Query: ?warehouseId=1&format=xlsx
Response: Binary file
```

---

## Movements

### GET /movements

История движений.

```
Query: ?warehouseId=1&itemId=10&movementType=SALE_DEDUCTION&fromDate=2026-01-01&toDate=2026-01-18

Response 200:
{
  "items": [
    {
      "id": 500,
      "itemName": "Tomatoes",
      "movementType": "SALE_DEDUCTION",
      "quantity": -2.0,
      "unitCost": 8000,
      "totalCost": 16000,
      "balanceAfter": 43.5,
      "referenceType": "order",
      "referenceId": 1234,
      "createdAt": "2026-01-18T14:30:00Z"
    }
  ],
  "summary": {
    "totalPurchases": 2500000,
    "totalSales": 850000
  }
}
```

### GET /movements/:id

Детали движения.

### GET /movements/export

Экспорт.

---

## Recipes

### GET /recipes

Список рецептов.

```
Query: ?search=burger&isActive=true&type=product

Response 200:
{
  "items": [
    {
      "id": 1,
      "name": "Classic Burger",
      "productName": "Classic Burger",
      "calculatedCost": 23300,
      "marginPercent": 48.2
    }
  ]
}
```

### GET /recipes/:id

Детали рецепта с ингредиентами.

### POST /recipes

Создать рецепт.

```
Request:
{
  "productId": 100,
  "outputQuantity": 1,
  "outputUnit": "portion",
  "ingredients": [
    {
      "itemId": 10,
      "quantity": 0.15,
      "wasteFactor": 0.1
    }
  ]
}
```

### PATCH /recipes/:id

Обновить рецепт.

### DELETE /recipes/:id

Удалить рецепт.

### POST /recipes/:id/recalculate-cost

Пересчитать себестоимость.

### POST /recipes/:id/duplicate

Дублировать рецепт.

---

## Suppliers

### GET /suppliers

Список поставщиков.

### GET /suppliers/:id

Детали поставщика.

### POST /suppliers

Создать поставщика.

```
Request:
{
  "name": "Fresh Farms LLC",
  "contactName": "John Doe",
  "phone": "+998901234567",
  "leadTimeDays": 3,
  "minimumOrderAmount": 500000
}
```

### PATCH /suppliers/:id

Обновить поставщика.

### DELETE /suppliers/:id

Удалить поставщика.

### GET /suppliers/:id/items

Товары поставщика.

### POST /suppliers/:id/items

Привязать товар.

### DELETE /suppliers/:id/items/:itemId

Отвязать товар.

### GET /suppliers/:id/orders

История заказов.

---

## Purchase Orders

### GET /purchase-orders

Список заказов.

```
Query: ?status=SENT&supplierId=1

Response 200:
{
  "items": [
    {
      "id": 18,
      "poNumber": "PO-2501-0018",
      "supplierName": "Fresh Farms",
      "status": "SENT",
      "totalAmount": 2500000,
      "expectedDate": "2026-01-21"
    }
  ]
}
```

### GET /purchase-orders/:id

Детали заказа.

### POST /purchase-orders

Создать заказ.

```
Request:
{
  "supplierId": 1,
  "warehouseId": 1,
  "orderDate": "2026-01-18",
  "items": [
    {
      "itemId": 10,
      "quantityOrdered": 50,
      "unit": "kg",
      "unitPrice": 8500
    }
  ]
}
```

### PATCH /purchase-orders/:id

Обновить заказ (только DRAFT).

### DELETE /purchase-orders/:id

Удалить заказ (только DRAFT).

### POST /purchase-orders/:id/send

Отправить поставщику.

### POST /purchase-orders/:id/cancel

Отменить заказ.

### POST /purchase-orders/:id/receive

Приёмка товара.

```
Request:
{
  "receiveDate": "2026-01-21",
  "items": [
    {
      "poItemId": 1,
      "quantityReceived": 50,
      "unitPrice": 8500
    }
  ]
}

Response 200:
{
  "id": 12,
  "receiveNumber": "RCV-2501-0012",
  "orderStatus": "RECEIVED",
  "stockUpdates": [...]
}
```

### GET /purchase-orders/:id/receives

История приёмок.

---

## Writeoffs

### GET /writeoffs

Список списаний.

```
Query: ?status=PENDING&reason=SPOILAGE

Response 200:
{
  "items": [...],
  "summary": {
    "totalWriteoffs": 680000,
    "pendingApproval": 112500
  }
}
```

### GET /writeoffs/:id

Детали списания.

### POST /writeoffs

Создать списание.

```
Request:
{
  "warehouseId": 1,
  "writeoffDate": "2026-01-18",
  "reason": "SPOILAGE",
  "items": [
    {
      "itemId": 10,
      "quantity": 5.0
    }
  ]
}
```

### PATCH /writeoffs/:id

Обновить (только DRAFT).

### POST /writeoffs/:id/submit

Отправить на утверждение.

### POST /writeoffs/:id/approve

Утвердить.

### POST /writeoffs/:id/reject

Отклонить.

```
Request:
{
  "reason": "Need more documentation"
}
```

---

## Inventory Counts

### GET /counts

Список инвентаризаций.

### GET /counts/:id

Детали инвентаризации.

### POST /counts

Создать инвентаризацию.

```
Request:
{
  "warehouseId": 1,
  "countDate": "2026-01-18",
  "countType": "FULL",
  "blindCount": false
}
```

### GET /counts/:id/items

Позиции для подсчёта.

### PATCH /counts/:id/items/:itemId

Ввести подсчёт.

```
Request:
{
  "countedQuantity": 45.0,
  "notes": "Double checked"
}
```

### POST /counts/:id/complete

Завершить подсчёт.

### POST /counts/:id/submit

Отправить на утверждение.

### POST /counts/:id/approve

Утвердить.

```
Request:
{
  "applyAdjustments": true,
  "notes": "Approved"
}
```

### POST /counts/:id/reject

Отклонить.

---

## Production

### GET /production

Список производственных заказов.

### GET /production/today

Расписание на сегодня.

### GET /production/:id

Детали заказа.

### POST /production

Создать заказ.

```
Request:
{
  "warehouseId": 1,
  "itemId": 100,
  "plannedQuantity": 20,
  "scheduledDate": "2026-01-18",
  "scheduledTime": "09:00"
}
```

### POST /production/:id/start

Начать производство (списать ингредиенты).

### POST /production/:id/complete

Завершить (добавить выход).

```
Request:
{
  "quantityProduced": 19.5,
  "notes": "Slight loss"
}
```

### POST /production/:id/cancel

Отменить.

### GET /production/statistics

Статистика производства.

---

## Alerts

### GET /alerts

Список алертов.

```
Query: ?warehouseId=1&alertType=OUT_OF_STOCK&acknowledged=false

Response 200:
{
  "items": [
    {
      "id": 1,
      "itemName": "Basil",
      "alertType": "OUT_OF_STOCK",
      "currentQuantity": 0,
      "thresholdQuantity": 1,
      "affectedProducts": [...]
    }
  ],
  "summary": {
    "outOfStock": 3,
    "lowStock": 12,
    "totalUnacknowledged": 15
  }
}
```

### GET /alerts/summary

Краткая сводка для badge.

### POST /alerts/:id/acknowledge

Подтвердить просмотр.

### POST /alerts/:warehouseId/acknowledge-all

Подтвердить все.

---

## Common Error Responses

```
400 Bad Request:
{
  "statusCode": 400,
  "message": "Validation error message",
  "error": "Bad Request"
}

401 Unauthorized:
{
  "statusCode": 401,
  "message": "Unauthorized"
}

403 Forbidden:
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}

404 Not Found:
{
  "statusCode": 404,
  "message": "Resource not found"
}

500 Internal Server Error:
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Pagination

```
Query params:
- page: номер страницы (default: 1)
- limit: элементов на странице (default: 20, max: 100)

Response:
{
  "items": [...],
  "total": 156,
  "page": 1,
  "limit": 20
}
```

---

## Date Formats

```
- Date only: "2026-01-18" (ISO 8601)
- DateTime: "2026-01-18T14:30:00Z" (ISO 8601 UTC)
```

---

*Документ актуален на январь 2026*
