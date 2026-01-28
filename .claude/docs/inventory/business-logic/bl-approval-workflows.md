# Бизнес-логика: Workflow согласования

> Approval Workflows для списаний и инвентаризаций

---

## Обзор

```
+-------------------------------------------------------------------------+
|                    ДОКУМЕНТЫ ТРЕБУЮЩИЕ СОГЛАСОВАНИЯ                      |
+-------------------------------------------------------------------------+
|                                                                          |
|  1. Writeoffs (Списания)                                                 |
|     - Если сумма > порога                                                |
|     - Всегда для причины THEFT                                           |
|                                                                          |
|  2. Inventory Counts (Инвентаризации)                                    |
|     - Если variance > порога                                             |
|                                                                          |
|  3. Purchase Orders (опционально)                                        |
|     - Если сумма > порога                                                |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## 1. Writeoff Approval

### Пороги

```
Settings:
  inventory.writeoffApprovalThreshold = 100000 (UZS)
  inventory.writeoffTheftAlwaysRequireApproval = true

Логика:
IF writeoff.totalValue > threshold THEN
  requireApproval = true
ELSE IF writeoff.reason = 'THEFT' AND theftAlwaysRequire THEN
  requireApproval = true
ELSE
  requireApproval = false (auto-approve при submit)
END IF
```

### Статусы

```
DRAFT -----> PENDING -----> APPROVED
  |            |                |
  v            v                v
CANCELLED   REJECTED      Stock deducted
```

### Права

```
Создание и submit: inventory:writeoff
Approve/Reject:    inventory:approve

Ограничение:
- Нельзя утверждать свои списания
- createdBy != approvedBy
```

### UI Flow

```
1. Сотрудник создаёт списание
2. Submit -> статус PENDING
3. Менеджер видит в "Pending Approvals"
4. Менеджер review:
   - Проверяет items
   - Смотрит фото (если есть)
   - Проверяет notes
5. Approve -> Stock deducted, movements created
   Reject -> Возврат создателю с причиной
```

---

## 2. Inventory Count Approval

### Пороги

```
Settings:
  inventory.countVarianceApprovalThreshold = 5 (%)
  inventory.countValueApprovalThreshold = 500000 (UZS)

Логика:
IF ABS(count.variancePercent) > varianceThreshold THEN
  requireApproval = true
ELSE IF ABS(count.varianceValue) > valueThreshold THEN
  requireApproval = true
ELSE
  requireApproval = false
END IF
```

### Опции утверждения

```
При утверждении:
1. Approve and Apply Adjustments
   - Stock обновляется до counted quantities
   - COUNT_ADJUSTMENT movements создаются

2. Approve Without Adjustments
   - Зафиксировать результат
   - Stock не меняется (informational)

3. Reject
   - Требовать пересчёт
   - Указать причину
```

### Права

```
Создание и подсчёт: inventory:count
Approve/Reject:     inventory:approve

Ограничение:
- Нельзя утверждать свои counts
```

---

## 3. Purchase Order Approval (опционально)

### Пороги

```
Settings:
  inventory.purchaseApprovalThreshold = 5000000 (UZS)
  inventory.purchaseApprovalEnabled = false (default)

Если включено:
IF po.totalAmount > threshold THEN
  requireApproval = true
  PO остаётся в DRAFT пока не утверждён
END IF
```

### Права

```
Создание: inventory:purchase
Approve:  inventory:approve

После approval: PO можно отправить (SENT)
```

---

## 4. UI: Pending Approvals Widget

```
Dashboard:
+--------------------------------------------------+
|  Pending Approvals                    [View All] |
+--------------------------------------------------+
|  * Writeoff WO-2501-0005 (112,500)   [Review]   |
|  * Count CNT-2501-002 (-5.2%)        [Review]   |
|  * Writeoff WO-2501-0006 (85,000)    [Review]   |
+--------------------------------------------------+
```

### Approval List Screen

```
+-------------------------------------------------------------------------+
|  Pending Approvals                                                      |
+-------------------------------------------------------------------------+
|  Type: [All v]                                                          |
+-------------------------------------------------------------------------+
|                                                                          |
|  Writeoffs                                                         [2]  |
|  +---------------------------------------------------------------------+|
|  | WO-2501-0005 | Jan 18 | Spoilage | 112,500 | John Doe    |[Review] ||
|  | WO-2501-0006 | Jan 18 | Expired  | 85,000  | Jane Smith  |[Review] ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Inventory Counts                                                  [1]  |
|  +---------------------------------------------------------------------+|
|  | CNT-2501-002 | Jan 15 | Partial | -5.2% | -260,000 | John Doe |[Rev] ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## 5. Approval Decision Modal

### Writeoff

```
+--------------------------------------------------+
|  Approve Writeoff                          [X]   |
+--------------------------------------------------+
|                                                   |
|  WO-2501-0005                                     |
|  Created by: John Doe on Jan 18, 2026            |
|  Reason: Spoilage                                 |
|  Total Value: 112,500 UZS                        |
|                                                   |
|  Items:                                           |
|  - Tomatoes: 5 kg (40,000)                       |
|  - Lettuce: 2 kg (30,000)                        |
|  - Cheese: 0.5 kg (42,500)                       |
|                                                   |
|  Notes: Found spoiled during morning check        |
|                                                   |
|  [Photo 1] [Photo 2]                             |
|                                                   |
|  Decision:                                        |
|  (*) Approve                                      |
|  ( ) Reject                                       |
|                                                   |
|  IF Reject:                                       |
|  Reason: [                                   ]   |
|                                                   |
|                     [Cancel]  [Confirm]          |
+--------------------------------------------------+
```

### Inventory Count

```
+--------------------------------------------------+
|  Approve Inventory Count                   [X]   |
+--------------------------------------------------+
|                                                   |
|  CNT-2501-002                                     |
|  Warehouse: Main Kitchen                          |
|  Count Date: Jan 15, 2026                        |
|  Completed by: John Doe                          |
|                                                   |
|  Summary:                                         |
|  - Items Counted: 45                             |
|  - Items with Variance: 8                        |
|  - Variance: -5.2% (-260,000 UZS)                |
|                                                   |
|  Large Variances:                                 |
|  - Mozzarella: -2 kg (-170,000)                  |
|  - Beef: -1.5 kg (-127,500)                      |
|                                                   |
|  Decision:                                        |
|  (*) Approve and Apply Adjustments               |
|  ( ) Approve Without Adjustments                 |
|  ( ) Reject (require recount)                    |
|                                                   |
|  Notes: [                                   ]    |
|                                                   |
|                     [Cancel]  [Confirm]          |
+--------------------------------------------------+
```

---

## 6. API

### List Pending Approvals

```
GET /admin/inventory/approvals/pending

Response 200:
{
  "writeoffs": [
    {
      "id": 5,
      "writeoffNumber": "WO-2501-0005",
      "totalValue": 112500,
      "reason": "SPOILAGE",
      "createdAt": "2026-01-18T10:00:00Z",
      "createdByName": "John Doe"
    }
  ],
  "counts": [
    {
      "id": 2,
      "countNumber": "CNT-2501-002",
      "variancePercent": -5.2,
      "varianceValue": -260000,
      "completedAt": "2026-01-15T18:00:00Z",
      "completedByName": "John Doe"
    }
  ],
  "totalPending": 3
}
```

### Approve Writeoff

```
POST /admin/inventory/writeoffs/:id/approve

Response 200:
{
  "id": 5,
  "status": "APPROVED",
  "approvedAt": "2026-01-18T15:00:00Z",
  "approvedByName": "Manager Name",
  "movementsCreated": 3
}
```

### Reject Writeoff

```
POST /admin/inventory/writeoffs/:id/reject

Request:
{
  "reason": "Photos unclear, please provide better documentation"
}

Response 200:
{
  "id": 5,
  "status": "REJECTED",
  "rejectedAt": "2026-01-18T15:00:00Z",
  "rejectionReason": "Photos unclear..."
}
```

---

## 7. Notifications

```
При создании pending approval:
- Notification to users with inventory:approve permission
- Badge update in sidebar

При approve/reject:
- Notification to creator
- Email (if configured)
```

---

## 8. Settings in Admin

```
+-------------------------------------------------------------------------+
|  Approval Settings                                                      |
+-------------------------------------------------------------------------+
|                                                                          |
|  Writeoffs                                                               |
|  +---------------------------------------------------------------------+|
|  | Require approval for writeoffs over:                                ||
|  | [100,000    ] UZS                                                   ||
|  |                                                                     ||
|  | [x] Always require approval for theft                               ||
|  | [ ] Require photo for writeoffs over threshold                      ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Inventory Counts                                                        |
|  +---------------------------------------------------------------------+|
|  | Require approval for variance over:                                 ||
|  | [5         ] %  OR  [500,000   ] UZS                                ||
|  +---------------------------------------------------------------------+|
|                                                                          |
|  Purchase Orders (optional)                                              |
|  +---------------------------------------------------------------------+|
|  | [ ] Enable approval for large purchase orders                       ||
|  | Threshold: [5,000,000 ] UZS                                         ||
|  +---------------------------------------------------------------------+|
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## 9. Audit Trail

```
Каждое решение записывается:

WriteoffApproval:
{
  writeoffId,
  action: 'APPROVED' | 'REJECTED',
  userId,
  userName,
  timestamp,
  reason (if rejected)
}

CountApproval:
{
  countId,
  action: 'APPROVED_WITH_ADJ' | 'APPROVED_NO_ADJ' | 'REJECTED',
  userId,
  userName,
  timestamp,
  notes
}
```

---

## FAQ

**Q: Кто может утверждать?**

A: Пользователи с permission `inventory:approve`. Обычно это менеджеры или владельцы.

**Q: Можно ли утвердить свой документ?**

A: Нет, система проверяет createdBy != approvedBy.

**Q: Что если нет approvers?**

A: Документы застревают в PENDING. Нужно назначить пользователя с правами.

**Q: Как настроить пороги per-branch?**

A: Пока настройки глобальные. Branch-specific пороги в roadmap.

---

*Документ актуален на январь 2026*
