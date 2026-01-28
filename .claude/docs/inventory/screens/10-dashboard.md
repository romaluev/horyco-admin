# Screen 10: Dashboard (Обзор склада)

> Главная страница модуля инвентаризации

---

## Quick Summary

```
Sidebar: Inventory
         |
         v
   +-----------+
   | Dashboard | <-- текущий экран
   +-----------+
         |
         +---> Low Stock Items ---> Stock Levels
         +---> Recent Movements ---> Movements
         +---> Pending Approvals ---> Writeoffs / Counts
         +---> Upcoming Deliveries ---> Purchase Orders
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:view`
- URL: `/admin/inventory` или `/admin/inventory/dashboard`

---

## UI Layout

```
+-------------------------------------------------------------------------+
|  Inventory Dashboard                                    [Warehouse: v]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +----------------+  +----------------+  +----------------+  +----------+|
|  | Total Items    |  | Low Stock      |  | Out of Stock   |  | Stock    ||
|  |     156        |  |     12         |  |      3         |  | Value    ||
|  |                |  |   [!] Alert    |  |   [!] Alert    |  | 45.2M    ||
|  +----------------+  +----------------+  +----------------+  +----------+|
|                                                                          |
|  +------------------------------------+  +------------------------------+|
|  | Low Stock Items                    |  | Recent Movements             ||
|  +------------------------------------+  +------------------------------+|
|  | [Y] Tomatoes        5 kg / 20 kg  |  | Today                        ||
|  | [Y] Cheese          2 kg / 10 kg  |  | * -2kg Tomatoes (Order)      ||
|  | [R] Olive Oil       0 L / 5 L     |  | * +50kg Flour (PO #234)      ||
|  | [Y] Chicken         8 kg / 25 kg  |  | * -0.5kg Cheese (Order)      ||
|  |                     [View All ->]  |  |              [View All ->]   ||
|  +------------------------------------+  +------------------------------+|
|                                                                          |
|  +------------------------------------+  +------------------------------+|
|  | Pending Approvals                  |  | Upcoming Deliveries          ||
|  +------------------------------------+  +------------------------------+|
|  | * Writeoff WO-2412-0003 (150k)    |  | * PO-2412-0015 (Tomorrow)    ||
|  | * Count CNT-2412-0002 (5% var)    |  | * PO-2412-0018 (Jan 25)      ||
|  |                      [Review ->]   |  |              [View All ->]   ||
|  +------------------------------------+  +------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Inventory Dashboard                                    [Warehouse: v]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +----------------+  +----------------+  +----------------+  +----------+|
|  | [skeleton]     |  | [skeleton]     |  | [skeleton]     |  |[skeleton]||
|  | [skeleton]     |  | [skeleton]     |  | [skeleton]     |  |[skeleton]||
|  +----------------+  +----------------+  +----------------+  +----------+|
|                                                                          |
|  +------------------------------------+  +------------------------------+|
|  | Low Stock Items                    |  | Recent Movements             ||
|  +------------------------------------+  +------------------------------+|
|  | [skeleton line]                    |  | [skeleton line]              ||
|  | [skeleton line]                    |  | [skeleton line]              ||
|  | [skeleton line]                    |  | [skeleton line]              ||
|  +------------------------------------+  +------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

### Empty State (новый склад)

```
+-------------------------------------------------------------------------+
|  Inventory Dashboard                                    [Warehouse: v]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +----------------+  +----------------+  +----------------+  +----------+|
|  | Total Items    |  | Low Stock      |  | Out of Stock   |  | Stock    ||
|  |       0        |  |      0         |  |      0         |  | Value    ||
|  |                |  |                |  |                |  |    0     ||
|  +----------------+  +----------------+  +----------------+  +----------+|
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [box icon]                                                   ||
|  |                                                                      ||
|  |         Get started with Inventory                                   ||
|  |                                                                      ||
|  |         1. Add your inventory items                                  ||
|  |         2. Create recipes for products                               ||
|  |         3. Record initial stock                                      ||
|  |                                                                      ||
|  |         [+ Add First Item]   [Import Items]                          ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

### Error State

```
+-------------------------------------------------------------------------+
|  Inventory Dashboard                                    [Warehouse: v]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [warning icon]                                               ||
|  |                                                                      ||
|  |         Failed to load dashboard data                                ||
|  |                                                                      ||
|  |         [Retry]                                                      ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Клик на Warehouse selector | Dropdown со списком складов |
| Выбор склада | Перезагрузка данных для выбранного склада |
| Клик на KPI карточку "Low Stock" | Переход на `/inventory/stock?filter=low` |
| Клик на KPI карточку "Out of Stock" | Переход на `/inventory/stock?filter=out` |
| Клик "View All" под Low Stock Items | Переход на `/inventory/stock?filter=low` |
| Клик "View All" под Recent Movements | Переход на `/inventory/movements` |
| Клик "Review" под Pending Approvals | Переход на `/inventory/writeoffs?status=pending` |
| Клик на конкретный Writeoff | Переход на `/inventory/writeoffs/:id` |
| Клик "View All" под Upcoming Deliveries | Переход на `/inventory/purchase-orders?status=sent` |
| Клик на конкретный PO | Переход на `/inventory/purchase-orders/:id` |

---

## API Calls

### GET /admin/inventory/warehouses

Получить список складов для селектора.

```json
// Response 200
[
  {
    "id": 1,
    "name": "Main Kitchen",
    "branchId": 1,
    "branchName": "Central Branch",
    "isActive": true,
    "isDefault": true
  },
  {
    "id": 2,
    "name": "Bar Storage",
    "branchId": 1,
    "branchName": "Central Branch",
    "isActive": true,
    "isDefault": false
  }
]
```

### GET /admin/inventory/warehouses/:id/stock-summary

Получить KPI для выбранного склада.

```json
// Response 200
{
  "warehouseId": 1,
  "warehouseName": "Main Kitchen",
  "totalItems": 156,
  "lowStockCount": 12,
  "outOfStockCount": 3,
  "totalStockValue": 45234000,
  "currency": "UZS",
  "lastUpdated": "2026-01-18T14:30:00Z"
}
```

### GET /admin/inventory/stock/low?warehouseId=1&limit=5

Получить топ-5 товаров с низким остатком.

```json
// Response 200
[
  {
    "id": 1,
    "itemId": 10,
    "itemName": "Tomatoes",
    "itemUnit": "kg",
    "quantity": 5,
    "minStockLevel": 20,
    "status": "low",
    "percentRemaining": 25
  },
  {
    "id": 2,
    "itemId": 15,
    "itemName": "Olive Oil",
    "itemUnit": "liter",
    "quantity": 0,
    "minStockLevel": 5,
    "status": "out",
    "percentRemaining": 0
  }
]
```

### GET /admin/inventory/movements?warehouseId=1&limit=10

Получить последние движения.

```json
// Response 200
[
  {
    "id": 100,
    "itemId": 10,
    "itemName": "Tomatoes",
    "movementType": "SALE_DEDUCTION",
    "quantity": -2,
    "unitCost": 8000,
    "totalCost": 16000,
    "referenceType": "order",
    "referenceId": 1234,
    "referenceDisplay": "Order #1234",
    "createdAt": "2026-01-18T14:30:00Z"
  },
  {
    "id": 99,
    "itemId": 20,
    "itemName": "Flour",
    "movementType": "PURCHASE_RECEIVE",
    "quantity": 50,
    "unitCost": 6000,
    "totalCost": 300000,
    "referenceType": "purchase_order",
    "referenceId": 234,
    "referenceDisplay": "PO-2501-0234",
    "createdAt": "2026-01-18T12:00:00Z"
  }
]
```

### GET /admin/inventory/writeoffs/pending?limit=5

Получить списания ожидающие утверждения.

```json
// Response 200
[
  {
    "id": 3,
    "writeoffNumber": "WO-2412-0003",
    "status": "PENDING",
    "totalValue": 150000,
    "itemCount": 3,
    "reason": "SPOILAGE",
    "createdAt": "2026-01-18T10:00:00Z",
    "createdBy": "John Doe"
  }
]
```

### GET /admin/inventory/counts?status=pending&limit=5

Получить инвентаризации ожидающие утверждения.

```json
// Response 200
[
  {
    "id": 2,
    "countNumber": "CNT-2412-0002",
    "status": "PENDING_APPROVAL",
    "countType": "FULL",
    "variancePercent": -5.2,
    "varianceValue": -250000,
    "completedAt": "2026-01-17T18:00:00Z"
  }
]
```

### GET /admin/inventory/purchase-orders?status=sent&limit=5

Получить ожидаемые поставки.

```json
// Response 200
[
  {
    "id": 15,
    "poNumber": "PO-2412-0015",
    "supplierId": 1,
    "supplierName": "Fresh Farms LLC",
    "status": "SENT",
    "expectedDate": "2026-01-19",
    "totalAmount": 2500000,
    "itemCount": 5
  }
]
```

---

## Decision Logic

```
1. При загрузке страницы:
   a. Загрузить список складов
   b. Выбрать склад по умолчанию (isDefault=true) или первый
   c. Загрузить данные для выбранного склада

2. При смене склада:
   a. Обновить URL query param ?warehouseId=X
   b. Перезагрузить все виджеты

3. Определение статуса товара:
   IF quantity <= 0 THEN
     status = "out" (красный)
   ELSE IF quantity <= minStockLevel THEN
     status = "low" (жёлтый)
   ELSE
     status = "ok" (зелёный)
   END IF

4. Форматирование валюты:
   - Значения >= 1,000,000: показывать как "45.2M"
   - Значения >= 1,000: показывать как "250k"
   - Иначе: полное число с разделителями
```

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 401 | Unauthorized | Редирект на логин |
| 403 | Module not enabled | Показать upsell |
| 404 | Warehouse not found | Показать ошибку, предложить выбрать другой |
| 500 | Server error | Показать error state с кнопкой Retry |

---

## Refresh Strategy

- Auto-refresh каждые 60 секунд
- Показывать "Last updated: X minutes ago"
- Manual refresh по кнопке

---

## Mobile Considerations

На мобильных устройствах:
- KPI карточки в 2 колонки
- Виджеты в 1 колонку (вертикально)
- Warehouse selector как full-screen modal

---

## FAQ

**Q: Какой склад показывать по умолчанию?**

A: Склад с `isDefault=true`. Если такого нет — первый активный.

**Q: Что показывать если нет pending approvals?**

A: Скрыть виджет или показать "No pending approvals".

**Q: Кликабельны ли KPI карточки?**

A: Да, Low Stock и Out of Stock ведут на отфильтрованный список остатков.

---

*Документ актуален на январь 2026*
