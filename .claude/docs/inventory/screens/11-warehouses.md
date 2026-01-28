# Screen 11: Warehouses (Склады)

> Управление складами

---

## Quick Summary

```
Dashboard
    |
    v
+------------+
| Warehouses | <-- текущий экран
+------------+
    |
    +---> Create Warehouse (modal)
    +---> Edit Warehouse (modal)
    +---> View Stock Summary
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:view` (просмотр)
- Пользователь имеет permission `inventory:manage` (CRUD)
- URL: `/admin/inventory/warehouses`

---

## UI Layout

```
+-------------------------------------------------------------------------+
|  Warehouses                                          [+ Add Warehouse]  |
+-------------------------------------------------------------------------+
|  [Search...]                              Status: [All v] [Active only] |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | Name            | Branch          | Items | Stock Value | Status    ||
|  +---------------------------------------------------------------------+|
|  | Main Kitchen    | Central Branch  |  156  | 45.2M UZS   | [Active]  ||
|  | Bar Storage     | Central Branch  |   42  | 12.5M UZS   | [Active]  ||
|  | Cold Storage    | Central Branch  |   28  | 18.3M UZS   | [Inactive]||
|  | Branch 2 Store  | Mall Branch     |  134  | 38.1M UZS   | [Active]  ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                                        Page 1 of 1      |
+-------------------------------------------------------------------------+
```

---

## States

### Loading State

```
+-------------------------------------------------------------------------+
|  Warehouses                                          [+ Add Warehouse]  |
+-------------------------------------------------------------------------+
|  [Search...]                              Status: [All v]               |
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
|  Warehouses                                          [+ Add Warehouse]  |
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  |                                                                      ||
|  |         [warehouse icon]                                             ||
|  |                                                                      ||
|  |         No warehouses yet                                            ||
|  |                                                                      ||
|  |         Create your first warehouse to start                         ||
|  |         tracking inventory.                                          ||
|  |                                                                      ||
|  |         [+ Add Warehouse]                                            ||
|  |                                                                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Warehouse Detail/Edit Modal

```
+--------------------------------------------------+
|  Add Warehouse                             [X]   |
+--------------------------------------------------+
|                                                   |
|  Basic Info                                       |
|  +-----------------------------------------------+
|  | Name*:        [Main Kitchen              ]    |
|  | Code:         [WH-001                    ]    |
|  | Branch*:      [Central Branch          v]    |
|  +-----------------------------------------------+
|                                                   |
|  Address                                          |
|  +-----------------------------------------------+
|  | Address:      [123 Main Street           ]    |
|  | City:         [Tashkent                  ]    |
|  +-----------------------------------------------+
|                                                   |
|  Options                                          |
|  +-----------------------------------------------+
|  | [x] Active                                    |
|  | [x] Default warehouse for branch              |
|  +-----------------------------------------------+
|                                                   |
|                         [Cancel]  [Save]         |
+--------------------------------------------------+
```

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Клик "+ Add Warehouse" | Открыть модалку создания |
| Клик на строку таблицы | Открыть модалку редактирования |
| Search input | Фильтрация по имени/коду |
| Status filter | Фильтрация по активности |
| Клик на Stock Value | Переход на Stock Levels для этого склада |
| Toggle Active в модалке | Активация/деактивация склада |
| Delete (в меню строки) | Подтверждение и удаление |

---

## API Calls

### GET /admin/inventory/warehouses

```json
// Query params: ?isActive=true&search=main
// Response 200
[
  {
    "id": 1,
    "name": "Main Kitchen",
    "code": "WH-001",
    "branchId": 1,
    "branchName": "Central Branch",
    "address": "123 Main Street",
    "city": "Tashkent",
    "isActive": true,
    "isDefault": true,
    "itemCount": 156,
    "totalStockValue": 45234000,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-01-18T10:00:00Z"
  }
]
```

### POST /admin/inventory/warehouses

```json
// Request
{
  "name": "Main Kitchen",
  "code": "WH-001",
  "branchId": 1,
  "address": "123 Main Street",
  "city": "Tashkent",
  "isActive": true,
  "isDefault": true
}

// Response 201
{
  "id": 1,
  "name": "Main Kitchen",
  "code": "WH-001",
  "branchId": 1,
  "branchName": "Central Branch",
  "isActive": true,
  "isDefault": true,
  "createdAt": "2026-01-18T10:00:00Z"
}
```

### PATCH /admin/inventory/warehouses/:id

```json
// Request
{
  "name": "Main Kitchen Updated",
  "isActive": false
}

// Response 200
{
  "id": 1,
  "name": "Main Kitchen Updated",
  "isActive": false,
  "updatedAt": "2026-01-18T11:00:00Z"
}
```

### DELETE /admin/inventory/warehouses/:id

```json
// Response 204 (No Content)

// Response 400 (если есть остатки)
{
  "statusCode": 400,
  "message": "Cannot delete warehouse with existing stock. Move or write off items first.",
  "error": "Bad Request"
}
```

### GET /admin/branches (для dropdown)

```json
// Response 200
[
  {
    "id": 1,
    "name": "Central Branch"
  },
  {
    "id": 2,
    "name": "Mall Branch"
  }
]
```

---

## Decision Logic

```
1. Валидация при создании:
   - name: обязательное, 1-100 символов
   - branchId: обязательное, должен существовать
   - code: опциональное, уникальное в рамках tenant

2. При установке isDefault=true:
   - Автоматически снять isDefault с других складов того же филиала

3. При деактивации (isActive=false):
   - Предупредить если есть ненулевые остатки
   - Склад остаётся в системе, но не используется для новых операций

4. При удалении:
   - Проверить наличие остатков (quantity > 0)
   - Проверить наличие открытых PO
   - Если есть - заблокировать удаление

5. Связь с филиалом:
   - Один филиал может иметь несколько складов
   - Минимум один default склад на филиал (для автосписания)
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| name | Обязательное, 1-100 символов |
| code | Опциональное, 1-50 символов, уникальное |
| branchId | Обязательное, существующий филиал |
| address | Опциональное, макс 200 символов |
| city | Опциональное, макс 100 символов |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Validation error | Показать ошибки под полями |
| 400 | Cannot delete with stock | Показать диалог с объяснением |
| 400 | Code already exists | Показать ошибку под полем code |
| 404 | Warehouse not found | Закрыть модалку, обновить список |
| 500 | Server error | Toast с ошибкой, сохранить форму |

---

## Permissions Check

```
IF NOT hasPermission('inventory:manage') THEN
  скрыть кнопку "+ Add Warehouse"
  скрыть actions в таблице (edit, delete)
  показать только просмотр
END IF
```

---

## FAQ

**Q: Можно ли создать несколько складов для одного филиала?**

A: Да, например: Main Kitchen, Bar Storage, Cold Storage.

**Q: Что происходит при удалении склада?**

A: Soft delete. История движений сохраняется.

**Q: Как связан склад с автосписанием?**

A: При завершении заказа система списывает со склада с `isDefault=true` для филиала заказа.

---

*Документ актуален на январь 2026*
