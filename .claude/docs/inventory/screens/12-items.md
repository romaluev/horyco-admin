# Screen 12: Inventory Items (Номенклатура товаров)

> Управление номенклатурой сырья и полуфабрикатов

---

## Quick Summary

```
Dashboard
    |
    v
+-----------+
|   Items   | <-- текущий экран
+-----------+
    |
    +---> Create Item (modal/page)
    +---> Edit Item (modal/page)
    +---> Unit Conversions (section)
    +---> View Stock for Item
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:view` (просмотр)
- Пользователь имеет permission `inventory:manage` (CRUD)
- URL: `/admin/inventory/items`

---

## UI Layout

```
+-------------------------------------------------------------------------+
|  Inventory Items                             [+ Add Item]  [Import CSV] |
+-------------------------------------------------------------------------+
|  [Search...]        Category: [All v]  Status: [Active v]  Type: [All v]|
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | # | Name           | SKU      | Unit  | In Stock | Min Lvl | Cost   ||
|  +---------------------------------------------------------------------+|
|  | 1 | Tomatoes       | VEG-001  | kg    | 45.5     | 20      | 8,000  ||
|  | 2 | Mozzarella     | DAI-003  | kg    | 12.0     | 10      | 85,000 ||
|  | 3 | Olive Oil      | OIL-001  | liter | 8.5      | 5       | 120,000||
|  | 4 | Flour 00       | DRY-001  | kg    | 150.0    | 50      | 6,000  ||
|  | 5 | Pizza Dough [*]| PREP-001 | kg    | 25.0     | 10      | 12,000 ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  [*] = Semi-finished item (полуфабрикат)                                |
|                                                         Page 1 of 12    |
+-------------------------------------------------------------------------+
```

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Inventory Items                             [+ Add Item]  [Import CSV] |
+-------------------------------------------------------------------------+
|  [Search...]        Category: [All v]  Status: [Active v]               |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  | [skeleton] | [skeleton] | [skeleton] | [skeleton] | [skeleton]      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

### Empty State

```
+-------------------------------------------------------------------------+
|  Inventory Items                             [+ Add Item]  [Import CSV] |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [box icon]                                                   ||
|  |                                                                      ||
|  |         No inventory items yet                                       ||
|  |                                                                      ||
|  |         Add your raw materials and semi-finished                     ||
|  |         products to start tracking.                                  ||
|  |                                                                      ||
|  |         [+ Add Item]   [Import from CSV]                             ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Item Detail/Edit Modal

```
+-------------------------------------------------------------------------+
|  Edit Item: Tomatoes                                               [X]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  [Basic Info]  [Stock Settings]  [Conversions]  [Suppliers]             |
|                                                                          |
|  Basic Info                                                              |
|  +---------------------------------------------------------------------+|
|  | Name*:        [Tomatoes                               ]             ||
|  | SKU:          [VEG-001                                ]             ||
|  | Barcode:      [4780123456789                          ]             ||
|  | Category:     [Vegetables                           v]             ||
|  | Base Unit*:   [kg                                   v]             ||
|  | Description:  [Fresh tomatoes for cooking            ]             ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Stock Settings                                                          |
|  +---------------------------------------------------------------------+|
|  | Min Stock Level:    [20        ] kg                                 ||
|  | Max Stock Level:    [100       ] kg                                 ||
|  | Reorder Point:      [30        ] kg                                 ||
|  | Reorder Quantity:   [50        ] kg                                 ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Options                                                                 |
|  +---------------------------------------------------------------------+|
|  | [x] Active                                                          ||
|  | [ ] Semi-finished (polufabrikat)                                    ||
|  | [x] Track inventory                                                 ||
|  | Tax Rate: [12    ] %                                                ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Default Supplier: [Fresh Farms LLC                   v]                |
|                                                                          |
|                                            [Cancel]  [Save Changes]     |
+-------------------------------------------------------------------------+
```

---

## Unit Conversions Tab

```
+-------------------------------------------------------------------------+
|  Edit Item: Tomatoes                                               [X]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  [Basic Info]  [Stock Settings]  [Conversions]  [Suppliers]             |
|                                                                          |
|  Unit Conversions                                    [+ Add Conversion] |
|  +---------------------------------------------------------------------+|
|  | From Unit    | To Unit (base) | Factor    | Actions                 ||
|  +---------------------------------------------------------------------+|
|  | 1 box        | = 10 kg        | 10        | [Edit] [Delete]         ||
|  | 1 crate      | = 25 kg        | 25        | [Edit] [Delete]         ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  How it works:                                                           |
|  When you receive 2 boxes of Tomatoes, system will record 20 kg.        |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Add Conversion Modal

```
+--------------------------------------------------+
|  Add Unit Conversion                       [X]   |
+--------------------------------------------------+
|                                                   |
|  Base unit: kg                                    |
|                                                   |
|  1 [box         ] = [10        ] kg              |
|                                                   |
|                         [Cancel]  [Add]          |
+--------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Клик "+ Add Item" | Открыть форму создания |
| Клик "Import CSV" | Открыть импорт диалог |
| Клик на строку | Открыть форму редактирования |
| Search input | Поиск по name, SKU, barcode |
| Category filter | Фильтр по категории |
| Status filter | Active/Inactive/All |
| Type filter | All/Raw Material/Semi-finished |
| Клик на In Stock | Переход на Stock Levels для этого item |
| Add Conversion | Открыть модалку конверсии |
| Delete Item | Подтверждение и soft delete |

---

## API Calls

### GET /admin/inventory/items

```json
// Query: ?search=tom&category=vegetables&isActive=true&isSemiFinished=false
// Response 200
{
  "items": [
    {
      "id": 1,
      "name": "Tomatoes",
      "sku": "VEG-001",
      "barcode": "4780123456789",
      "category": "vegetables",
      "unit": "kg",
      "description": "Fresh tomatoes",
      "minStockLevel": 20,
      "maxStockLevel": 100,
      "reorderPoint": 30,
      "reorderQuantity": 50,
      "isActive": true,
      "isSemiFinished": false,
      "isTrackable": true,
      "taxRate": 12,
      "defaultSupplierId": 1,
      "defaultSupplierName": "Fresh Farms LLC",
      "totalStock": 45.5,
      "avgCost": 8000,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20
}
```

### GET /admin/inventory/items/categories

```json
// Response 200
["vegetables", "dairy", "meat", "dry goods", "oils", "prepared"]
```

### POST /admin/inventory/items

```json
// Request
{
  "name": "Tomatoes",
  "sku": "VEG-001",
  "barcode": "4780123456789",
  "category": "vegetables",
  "unit": "kg",
  "description": "Fresh tomatoes",
  "minStockLevel": 20,
  "maxStockLevel": 100,
  "reorderPoint": 30,
  "reorderQuantity": 50,
  "isActive": true,
  "isSemiFinished": false,
  "isTrackable": true,
  "taxRate": 12,
  "defaultSupplierId": 1
}

// Response 201
{
  "id": 1,
  "name": "Tomatoes",
  ...
}
```

### PATCH /admin/inventory/items/:id

```json
// Request
{
  "name": "Fresh Tomatoes",
  "minStockLevel": 25
}

// Response 200
{
  "id": 1,
  "name": "Fresh Tomatoes",
  "minStockLevel": 25,
  "updatedAt": "2026-01-18T11:00:00Z"
}
```

### DELETE /admin/inventory/items/:id

```json
// Response 204 (No Content)

// Response 400
{
  "statusCode": 400,
  "message": "Cannot delete item used in active recipes",
  "error": "Bad Request"
}
```

### GET /admin/inventory/items/:id/conversions

```json
// Response 200
[
  {
    "id": 1,
    "fromUnit": "box",
    "toUnit": "kg",
    "conversionFactor": 10,
    "createdAt": "2025-06-01T00:00:00Z"
  },
  {
    "id": 2,
    "fromUnit": "crate",
    "toUnit": "kg",
    "conversionFactor": 25,
    "createdAt": "2025-06-01T00:00:00Z"
  }
]
```

### POST /admin/inventory/items/:id/conversions

```json
// Request
{
  "fromUnit": "box",
  "conversionFactor": 10
}

// Response 201
{
  "id": 1,
  "fromUnit": "box",
  "toUnit": "kg",
  "conversionFactor": 10
}
```

### DELETE /admin/inventory/items/:id/conversions/:conversionId

```json
// Response 204 (No Content)
```

---

## Decision Logic

```
1. SKU генерация:
   IF sku не указан THEN
     предложить автогенерацию: {CATEGORY_PREFIX}-{NUMBER}
   END IF

2. Категории:
   - Показывать существующие + возможность добавить новую
   - Новая категория добавляется при сохранении item

3. Полуфабрикат (isSemiFinished):
   IF isSemiFinished = true THEN
     - item может быть выходом ProductionOrder
     - должен иметь Recipe для производства
   END IF

4. Валидация min/max:
   minStockLevel <= reorderPoint <= maxStockLevel

5. При удалении:
   - Проверить использование в рецептах
   - Проверить наличие остатков
   - Проверить использование в открытых PO
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| name | Обязательное, 1-200 символов |
| sku | Опциональное, уникальное, 1-50 символов |
| barcode | Опциональное, 1-50 символов |
| category | Опциональное, 1-100 символов |
| unit | Обязательное, из списка или custom |
| minStockLevel | >= 0 |
| maxStockLevel | >= minStockLevel |
| reorderPoint | >= minStockLevel, <= maxStockLevel |
| taxRate | 0-100 |

---

## Available Units

```
Weight: kg, g, lb, oz
Volume: liter, ml, gallon
Count: pcs, box, pack, dozen, crate, bag, bottle, can
```

---

## Import CSV Format

```csv
name,sku,category,unit,minStockLevel,maxStockLevel,taxRate
Tomatoes,VEG-001,vegetables,kg,20,100,12
Mozzarella,DAI-003,dairy,kg,10,50,12
```

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | SKU already exists | Ошибка под полем SKU |
| 400 | Invalid unit | Ошибка под полем unit |
| 400 | Cannot delete | Показать причину в диалоге |
| 404 | Item not found | Закрыть форму, обновить список |

---

## FAQ

**Q: Чем отличается обычный item от полуфабриката?**

A: Полуфабрикат производится из других items (например, тесто из муки и воды). Он может быть выходом Production Order.

**Q: Что такое reorderPoint?**

A: Уровень при котором система напоминает о необходимости заказа. Используется для алертов.

**Q: Можно ли изменить базовую единицу после создания?**

A: Нет, если есть остатки или движения. Нужно создать новый item.

---

*Документ актуален на январь 2026*
