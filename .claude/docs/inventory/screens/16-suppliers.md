# Screen 16: Suppliers (Поставщики)

> Управление поставщиками и их товарами

---

## Quick Summary

```
Dashboard
    |
    v
+-----------+
| Suppliers | <-- текущий экран
+-----------+
    |
    +---> Create Supplier (modal)
    +---> Edit Supplier (modal)
    +---> View Purchase History
    +---> Link Items
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:purchase`
- URL: `/admin/inventory/suppliers`

---

## UI Layout

```
+-------------------------------------------------------------------------+
|  Suppliers                                            [+ Add Supplier]  |
+-------------------------------------------------------------------------+
|  [Search...]                              Status: [Active v]            |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | Supplier           | Contact        | Items | Orders | Last Order   ||
|  +---------------------------------------------------------------------+|
|  | Fresh Farms LLC    | +998 90 123... |  25   |   48   | Jan 15, 2026 ||
|  | Dairy Direct       | +998 71 456... |  12   |   32   | Jan 18, 2026 ||
|  | Meat Masters       | +998 93 789... |   8   |   15   | Jan 10, 2026 ||
|  | Kitchen Supply Co  | +998 95 012... |  45   |   22   | Jan 12, 2026 ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                                         Page 1 of 2     |
+-------------------------------------------------------------------------+
```

---

## Supplier Detail/Edit Modal

```
+-------------------------------------------------------------------------+
|  Edit Supplier: Fresh Farms LLC                                    [X]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  [General]  [Contact]  [Items]  [Payment Terms]  [History]              |
|                                                                          |
|  General                                                                 |
|  +---------------------------------------------------------------------+|
|  | Name*:        [Fresh Farms LLC                         ]            ||
|  | Code:         [SUP-001                                 ]            ||
|  | Tax ID:       [123456789                               ]            ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Contact                                                                 |
|  +---------------------------------------------------------------------+|
|  | Contact Name: [John Doe                                ]            ||
|  | Phone:        [+998 90 123 45 67                       ]            ||
|  | Email:        [john@freshfarms.uz                      ]            ||
|  | Address:      [123 Farm Road, Tashkent                 ]            ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Delivery Settings                                                       |
|  +---------------------------------------------------------------------+|
|  | Lead Time:    [3        ] days                                      ||
|  | Min Order:    [500,000  ] UZS                                       ||
|  | Currency:     [UZS                                   v]             ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Options                                                                 |
|  +---------------------------------------------------------------------+|
|  | [x] Active                                                          ||
|  | [x] Preferred supplier                                              ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                             [Cancel]  [Save Changes]    |
+-------------------------------------------------------------------------+
```

---

## Items Tab

```
+-------------------------------------------------------------------------+
|  Edit Supplier: Fresh Farms LLC                                    [X]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  [General]  [Contact]  [Items]  [Payment Terms]  [History]              |
|                                                                          |
|  Linked Items                                           [+ Link Item]   |
|  +---------------------------------------------------------------------+|
|  | Item           | SKU      | Unit  | Last Price | Last Order         ||
|  +---------------------------------------------------------------------+|
|  | Tomatoes       | VEG-001  | kg    | 8,500      | Jan 15, 2026       ||
|  | Cucumbers      | VEG-002  | kg    | 6,000      | Jan 15, 2026       ||
|  | Bell Peppers   | VEG-003  | kg    | 12,000     | Jan 10, 2026       ||
|  | Lettuce        | VEG-004  | kg    | 15,000     | Jan 12, 2026       ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [i] These are items you typically order from this supplier.            |
|      Prices are from last purchase order.                               |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## History Tab

```
+-------------------------------------------------------------------------+
|  Edit Supplier: Fresh Farms LLC                                    [X]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  [General]  [Contact]  [Items]  [Payment Terms]  [History]              |
|                                                                          |
|  Statistics                                                              |
|  +---------------------------------------------------------------------+|
|  | Total Orders:         48                                            ||
|  | Total Spent:          125,000,000 UZS                               ||
|  | Average Order:        2,604,167 UZS                                 ||
|  | First Order:          Mar 2025                                      ||
|  | Last Order:           Jan 15, 2026                                  ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Recent Orders                                                           |
|  +---------------------------------------------------------------------+|
|  | PO Number     | Date       | Amount    | Status                     ||
|  +---------------------------------------------------------------------+|
|  | PO-2501-0015  | Jan 15     | 2,500,000 | Received                   ||
|  | PO-2501-0008  | Jan 08     | 1,800,000 | Received                   ||
|  | PO-2412-0045  | Dec 28     | 3,200,000 | Received                   ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [View All Orders]                                                       |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Link Item Modal

```
+--------------------------------------------------+
|  Link Item to Supplier                     [X]   |
+--------------------------------------------------+
|                                                   |
|  Item*:        [Search items...           v]     |
|                                                   |
|  Supplier SKU: [Optional - supplier's code ]     |
|                                                   |
|  Notes:        [                           ]     |
|                                                   |
|  [i] This helps auto-fill PO items               |
|                                                   |
|                         [Cancel]  [Link]         |
+--------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Клик "+ Add Supplier" | Открыть модалку создания |
| Клик на строку | Открыть модалку редактирования |
| Search | Поиск по имени, коду, контакту |
| Status filter | Active/Inactive/All |
| Link Item | Привязать товар к поставщику |
| Unlink Item | Убрать привязку товара |
| View All Orders | Переход на PO с фильтром по поставщику |
| Delete Supplier | Подтверждение и soft delete |

---

## API Calls

### GET /admin/inventory/suppliers

```json
// Query: ?search=fresh&isActive=true
// Response 200
{
  "items": [
    {
      "id": 1,
      "name": "Fresh Farms LLC",
      "code": "SUP-001",
      "taxId": "123456789",
      "contactName": "John Doe",
      "phone": "+998901234567",
      "email": "john@freshfarms.uz",
      "address": "123 Farm Road, Tashkent",
      "leadTimeDays": 3,
      "minimumOrderAmount": 500000,
      "currency": "UZS",
      "isActive": true,
      "isPreferred": true,
      "itemCount": 25,
      "orderCount": 48,
      "totalSpent": 125000000,
      "lastOrderDate": "2026-01-15",
      "createdAt": "2025-03-01T00:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

### GET /admin/inventory/suppliers/:id

```json
// Response 200
{
  "id": 1,
  "name": "Fresh Farms LLC",
  "code": "SUP-001",
  "taxId": "123456789",
  "contactName": "John Doe",
  "phone": "+998901234567",
  "email": "john@freshfarms.uz",
  "address": "123 Farm Road, Tashkent",
  "leadTimeDays": 3,
  "minimumOrderAmount": 500000,
  "currency": "UZS",
  "paymentTerms": "Net 30",
  "isActive": true,
  "isPreferred": true,
  "notes": "Reliable supplier, delivers on time",
  "statistics": {
    "orderCount": 48,
    "totalSpent": 125000000,
    "averageOrderAmount": 2604167,
    "firstOrderDate": "2025-03-01",
    "lastOrderDate": "2026-01-15"
  },
  "createdAt": "2025-03-01T00:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

### POST /admin/inventory/suppliers

```json
// Request
{
  "name": "Fresh Farms LLC",
  "code": "SUP-001",
  "taxId": "123456789",
  "contactName": "John Doe",
  "phone": "+998901234567",
  "email": "john@freshfarms.uz",
  "address": "123 Farm Road, Tashkent",
  "leadTimeDays": 3,
  "minimumOrderAmount": 500000,
  "currency": "UZS",
  "isActive": true,
  "isPreferred": false
}

// Response 201
{
  "id": 1,
  "name": "Fresh Farms LLC",
  ...
}
```

### PATCH /admin/inventory/suppliers/:id

```json
// Request
{
  "leadTimeDays": 2,
  "isPreferred": true
}

// Response 200
{
  "id": 1,
  "leadTimeDays": 2,
  "isPreferred": true,
  "updatedAt": "2026-01-18T11:00:00Z"
}
```

### DELETE /admin/inventory/suppliers/:id

```json
// Response 204 (No Content)

// Response 400 (если есть открытые PO)
{
  "statusCode": 400,
  "message": "Cannot delete supplier with open purchase orders",
  "error": "Bad Request"
}
```

### GET /admin/inventory/suppliers/:id/items

```json
// Response 200
[
  {
    "id": 1,
    "itemId": 10,
    "itemName": "Tomatoes",
    "itemSku": "VEG-001",
    "itemUnit": "kg",
    "supplierSku": "TOM-FRESH",
    "lastPrice": 8500,
    "lastOrderDate": "2026-01-15",
    "priceHistory": [
      {"date": "2026-01-15", "price": 8500},
      {"date": "2026-01-08", "price": 8000},
      {"date": "2025-12-28", "price": 8200}
    ]
  }
]
```

### POST /admin/inventory/suppliers/:id/items

```json
// Request
{
  "itemId": 10,
  "supplierSku": "TOM-FRESH",
  "notes": "Grade A tomatoes"
}

// Response 201
{
  "id": 1,
  "itemId": 10,
  "itemName": "Tomatoes",
  "supplierSku": "TOM-FRESH"
}
```

### DELETE /admin/inventory/suppliers/:id/items/:itemId

```json
// Response 204 (No Content)
```

### GET /admin/inventory/suppliers/:id/orders

```json
// Query: ?limit=10
// Response 200
{
  "items": [
    {
      "id": 15,
      "poNumber": "PO-2501-0015",
      "orderDate": "2026-01-15",
      "totalAmount": 2500000,
      "status": "RECEIVED"
    }
  ],
  "total": 48,
  "page": 1,
  "limit": 10
}
```

---

## Decision Logic

```
1. Lead Time:
   - Используется для расчёта expectedDate при создании PO
   - expectedDate = orderDate + leadTimeDays

2. Minimum Order Amount:
   - Показывать warning если сумма PO меньше минимума
   - Не блокировать создание

3. Preferred Supplier:
   - Показывать первым в списке при выборе
   - Использовать для авто-предложений

4. Price History:
   - Записывается при приёмке товара
   - Если фактическая цена отличается от заказанной
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| name | Обязательное, 1-200 символов |
| code | Опциональное, уникальное |
| phone | Опциональное, формат телефона |
| email | Опциональное, формат email |
| leadTimeDays | >= 0, целое число |
| minimumOrderAmount | >= 0 |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Code already exists | Ошибка под полем code |
| 400 | Cannot delete with orders | Показать диалог с объяснением |
| 404 | Supplier not found | Закрыть модалку, обновить список |

---

## FAQ

**Q: Что такое Lead Time?**

A: Время доставки в днях. Используется для расчёта ожидаемой даты при создании заказа.

**Q: Можно ли привязать один товар к нескольким поставщикам?**

A: Да, один товар может поставляться разными поставщиками с разными ценами.

**Q: Что значит Preferred Supplier?**

A: Приоритетный поставщик. Показывается первым в списке и предлагается по умолчанию.

---

*Документ актуален на январь 2026*
