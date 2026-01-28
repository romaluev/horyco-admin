# Screen 19: Writeoffs (Списания)

> Управление списаниями товаров

---

## Quick Summary

```
Dashboard
    |
    v
+-----------+
| Writeoffs | <-- текущий экран
+-----------+
    |
    +---> Create Writeoff
    +---> Submit for Approval
    +---> Approve/Reject
```

---

## When to Show

- Пользователь имеет `addon_inventory` feature
- Пользователь имеет permission `inventory:writeoff`
- URL: `/admin/inventory/writeoffs`

---

## UI Layout: List

```
+-------------------------------------------------------------------------+
|  Writeoffs                                         [+ Create Writeoff]  |
+-------------------------------------------------------------------------+
|  [Search...]     Status: [All v]   Reason: [All v]   Date: [This month]|
+-------------------------------------------------------------------------+
|                                                                          |
|  +---------------------------------------------------------------------+|
|  | WO Number    | Date     | Reason     | Items | Value   | Status    ||
|  +---------------------------------------------------------------------+|
|  | WO-2501-0005 | Jan 18   | Spoilage   |   3   | 85,000  | [Pending] ||
|  | WO-2501-0004 | Jan 15   | Expired    |   5   | 120,000 | [Approved]||
|  | WO-2501-0003 | Jan 12   | Damaged    |   2   | 45,000  | [Approved]||
|  | WO-2501-0002 | Jan 10   | Theft      |   1   | 250,000 | [Rejected]||
|  | WO-2501-0001 | Jan 05   | Spoilage   |   8   | 180,000 | [Approved]||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  This Month Summary:                                                     |
|  Total Writeoffs: 680,000 UZS    Pending Approval: 85,000 UZS           |
|                                                         Page 1 of 3     |
+-------------------------------------------------------------------------+
```

---

## UI Layout: Create/Edit Writeoff

```
+-------------------------------------------------------------------------+
|  < Back to Writeoffs                                                    |
+-------------------------------------------------------------------------+
|  Create Writeoff                                                        |
+-------------------------------------------------------------------------+
|                                                                          |
|  Basic Info                                                              |
|  +---------------------------------------------------------------------+|
|  | Warehouse*:   [Main Kitchen                              v]         ||
|  | Date*:        [2026-01-18]                                          ||
|  | Reason*:      [Spoilage                                  v]         ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Items to Write Off                                      [+ Add Item]   |
|  +---------------------------------------------------------------------+|
|  | Item         | Current | Write Off | Unit | Cost    | Total        ||
|  +---------------------------------------------------------------------+|
|  | Tomatoes     | 45.5 kg | [5      ] | kg   | 8,000   | 40,000       ||
|  | Lettuce      | 3.0 kg  | [2      ] | kg   | 15,000  | 30,000       ||
|  | Cheese       | 12.0 kg | [0.5    ] | kg   | 85,000  | 42,500       ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Total Value: 112,500 UZS                                               |
|                                                                          |
|  Notes                                                                   |
|  +---------------------------------------------------------------------+|
|  | [Found spoiled during morning check. Items stored improperly.   ]   ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Attachments                                           [+ Add Photo]    |
|  +---------------------------------------------------------------------+|
|  | [photo1.jpg]  [photo2.jpg]                                          ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                               [Save as Draft]  [Submit for Approval]    |
+-------------------------------------------------------------------------+
```

---

## Approval View (for managers)

```
+-------------------------------------------------------------------------+
|  < Back to Writeoffs                                                    |
+-------------------------------------------------------------------------+
|  WO-2501-0005                                    Status: PENDING        |
+-------------------------------------------------------------------------+
|                                                                          |
|  Created by: John Doe on Jan 18, 2026 10:30 AM                          |
|                                                                          |
|  Details                                                                 |
|  +---------------------------------------------------------------------+|
|  | Warehouse:    Main Kitchen                                          ||
|  | Date:         Jan 18, 2026                                          ||
|  | Reason:       Spoilage                                              ||
|  | Total Value:  112,500 UZS                                           ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Items                                                                   |
|  +---------------------------------------------------------------------+|
|  | Item         | Quantity | Unit | Cost    | Total                    ||
|  +---------------------------------------------------------------------+|
|  | Tomatoes     | 5.0      | kg   | 8,000   | 40,000                   ||
|  | Lettuce      | 2.0      | kg   | 15,000  | 30,000                   ||
|  | Cheese       | 0.5      | kg   | 85,000  | 42,500                   ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Notes                                                                   |
|  +---------------------------------------------------------------------+|
|  | Found spoiled during morning check. Items stored improperly.        ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Attachments                                                             |
|  +---------------------------------------------------------------------+|
|  | [photo1.jpg]  [photo2.jpg]                                          ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Approval                                                                |
|  +---------------------------------------------------------------------+|
|  | [!] This writeoff exceeds 100,000 UZS threshold                     ||
|  | Manager approval required.                                          ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Rejection Reason (if rejecting):                                        |
|  +---------------------------------------------------------------------+|
|  | [                                                              ]    ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|                                              [Reject]  [Approve]        |
+-------------------------------------------------------------------------+
```

---

## States

### Status Flow

```
+---------------------------------------------------------------------+
|  СТАТУСЫ СПИСАНИЯ                                                    |
+---------------------------------------------------------------------+
|                                                                      |
|  DRAFT -----> PENDING -----> APPROVED -----> (Stock deducted)        |
|    |            |                                                    |
|    v            v                                                    |
|  CANCELLED   REJECTED                                                |
|                                                                      |
|  DRAFT:      Черновик, можно редактировать                           |
|  PENDING:    Ожидает утверждения                                     |
|  APPROVED:   Утверждено, товар списан                                |
|  REJECTED:   Отклонено                                               |
|  CANCELLED:  Отменено создателем                                     |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## Writeoff Reasons

| Reason | Описание |
|--------|----------|
| SPOILAGE | Порча (гниль, плесень) |
| EXPIRED | Истёк срок годности |
| DAMAGED | Повреждение |
| THEFT | Кража |
| SHRINKAGE | Усушка/утруска |
| SAMPLE | Проба/дегустация |
| OTHER | Другое (требует пояснения) |

---

## User Actions

| Действие | Результат |
|----------|-----------|
| Create Writeoff | Открыть форму создания |
| Add Item | Добавить товар к списанию |
| Save as Draft | Сохранить черновик |
| Submit for Approval | Отправить на утверждение |
| Approve | Утвердить списание (stock обновляется) |
| Reject | Отклонить с указанием причины |
| Cancel | Отменить черновик |
| Add Photo | Приложить фото |

---

## API Calls

### GET /admin/inventory/writeoffs

```json
// Query: ?status=PENDING&reason=SPOILAGE&fromDate=2026-01-01
// Response 200
{
  "items": [
    {
      "id": 5,
      "writeoffNumber": "WO-2501-0005",
      "warehouseId": 1,
      "warehouseName": "Main Kitchen",
      "writeoffDate": "2026-01-18",
      "reason": "SPOILAGE",
      "reasonDisplay": "Spoilage",
      "status": "PENDING",
      "itemCount": 3,
      "totalValue": 112500,
      "notes": "Found spoiled during morning check",
      "createdAt": "2026-01-18T10:30:00Z",
      "createdByName": "John Doe"
    }
  ],
  "summary": {
    "totalWriteoffs": 680000,
    "pendingApproval": 112500,
    "countByReason": {
      "SPOILAGE": 2,
      "EXPIRED": 1,
      "DAMAGED": 1
    }
  },
  "total": 25,
  "page": 1,
  "limit": 20
}
```

### GET /admin/inventory/writeoffs/:id

```json
// Response 200
{
  "id": 5,
  "writeoffNumber": "WO-2501-0005",
  "warehouseId": 1,
  "warehouseName": "Main Kitchen",
  "writeoffDate": "2026-01-18",
  "reason": "SPOILAGE",
  "reasonDisplay": "Spoilage",
  "status": "PENDING",
  "totalValue": 112500,
  "notes": "Found spoiled during morning check",
  "attachments": [
    {"id": 1, "filename": "photo1.jpg", "url": "/uploads/..."}
  ],
  "items": [
    {
      "id": 1,
      "itemId": 10,
      "itemName": "Tomatoes",
      "itemUnit": "kg",
      "quantity": 5.0,
      "unitCost": 8000,
      "totalCost": 40000,
      "currentStock": 45.5,
      "notes": null
    }
  ],
  "approvalThreshold": 100000,
  "requiresApproval": true,
  "canEdit": true,
  "canApprove": false,
  "approvedAt": null,
  "approvedByName": null,
  "rejectionReason": null,
  "createdAt": "2026-01-18T10:30:00Z",
  "createdByName": "John Doe"
}
```

### POST /admin/inventory/writeoffs

```json
// Request
{
  "warehouseId": 1,
  "writeoffDate": "2026-01-18",
  "reason": "SPOILAGE",
  "notes": "Found spoiled during morning check",
  "items": [
    {
      "itemId": 10,
      "quantity": 5.0,
      "notes": null
    }
  ]
}

// Response 201
{
  "id": 5,
  "writeoffNumber": "WO-2501-0005",
  "status": "DRAFT",
  "totalValue": 40000,
  ...
}
```

### POST /admin/inventory/writeoffs/:id/submit

```json
// Response 200
{
  "id": 5,
  "status": "PENDING",
  "submittedAt": "2026-01-18T11:00:00Z"
}
```

### POST /admin/inventory/writeoffs/:id/approve

```json
// Response 200
{
  "id": 5,
  "status": "APPROVED",
  "approvedAt": "2026-01-18T12:00:00Z",
  "approvedByName": "Manager User",
  "stockMovements": [
    {"itemId": 10, "movementId": 501}
  ]
}
```

### POST /admin/inventory/writeoffs/:id/reject

```json
// Request
{
  "reason": "Photos unclear, please provide better documentation"
}

// Response 200
{
  "id": 5,
  "status": "REJECTED",
  "rejectedAt": "2026-01-18T12:00:00Z",
  "rejectionReason": "Photos unclear..."
}
```

---

## Decision Logic

```
1. Approval Threshold:
   IF writeoff.totalValue > settings.writeoffApprovalThreshold THEN
     requiresApproval = true
   ELSE
     auto-approve при submit
   END IF

2. Permission check:
   - inventory:writeoff -> создание и submit
   - inventory:approve -> approve/reject

3. При утверждении:
   - Создаётся StockMovement (WRITEOFF) для каждого item
   - Stock.quantity уменьшается
   - WAC не меняется

4. Нельзя списать больше чем есть:
   IF item.quantity > stock.availableQuantity THEN
     показать ошибку
   END IF
```

---

## Validation Rules

| Поле | Правила |
|------|---------|
| warehouseId | Обязательное |
| writeoffDate | Обязательное, не в будущем |
| reason | Обязательное |
| items | Минимум 1 позиция |
| item.quantity | > 0, <= available stock |
| notes | Обязательное если reason = OTHER |

---

## Status Badge Colors

| Status | Цвет |
|--------|------|
| DRAFT | Gray |
| PENDING | Yellow |
| APPROVED | Green |
| REJECTED | Red |
| CANCELLED | Gray strikethrough |

---

## Error Handling

| Код | Сообщение | UI действие |
|-----|-----------|-------------|
| 400 | Quantity exceeds stock | Ошибка под полем quantity |
| 400 | Cannot edit approved | Toast с предупреждением |
| 403 | Cannot approve own writeoff | Toast с предупреждением |

---

## FAQ

**Q: Можно ли утвердить своё списание?**

A: Нет, требуется утверждение другим пользователем с permission `inventory:approve`.

**Q: Что если списание было утверждено ошибочно?**

A: Нужно создать корректировку stock для возврата товара. Отменить утверждение нельзя.

**Q: Нужны ли фото для списания?**

A: Рекомендуется для сумм выше порога. Может быть обязательным по настройкам.

---

*Документ актуален на январь 2026*
