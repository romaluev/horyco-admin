# Бизнес-логика: Автосписание при заказах

> Stock Deduction, Outbox Pattern, Reversal

---

## Обзор

```
+-------------------------------------------------------------------------+
|                    FLOW АВТОСПИСАНИЯ                                     |
+-------------------------------------------------------------------------+
|                                                                          |
|  POS/WebApp                                                              |
|       |                                                                  |
|       v                                                                  |
|  Order COMPLETED                                                         |
|       |                                                                  |
|       v                                                                  |
|  OrderCompletedEvent -> domain_events_outbox                             |
|       |                                                                  |
|       v (async, ~1 sec)                                                  |
|  OutboxProcessor                                                         |
|       |                                                                  |
|       +---> hasFeature('addon_inventory')? ---> NO: skip                 |
|       |                                                                  |
|       v YES                                                              |
|  StockDeductionService.deductForOrder()                                  |
|       |                                                                  |
|       v                                                                  |
|  FOR EACH OrderItem:                                                     |
|       +---> Recipe = findByProduct(productId)                            |
|       +---> FOR EACH ingredient:                                         |
|             +---> StockMovement (SALE_DEDUCTION)                         |
|             +---> Stock.quantity -= qty                                  |
|       +---> FOR EACH modifier:                                           |
|             +---> Recipe = findByModifier(modifierId)                    |
|             +---> Repeat ingredient deduction                            |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## 1. Когда происходит списание

### Триггер

```
Order.status меняется на COMPLETED
       |
       v
OrderService записывает событие в outbox:
{
  eventType: 'ORDER_COMPLETED',
  aggregateType: 'order',
  aggregateId: orderId,
  payload: {
    orderId,
    tenantId,
    branchId,
    items: [
      {
        orderItemId,
        productId,
        quantity,
        modifiers: [
          { modifierId, quantity }
        ]
      }
    ]
  }
}
```

### Асинхронная обработка

```
OutboxProcessor (cron каждую секунду):
  1. SELECT * FROM domain_events_outbox
     WHERE status = 'pending'
     FOR UPDATE SKIP LOCKED

  2. FOR EACH event:
       processEvent(event)
       UPDATE status = 'processed'
```

---

## 2. Процесс списания

### Шаг 1: Найти склад

```
1. Получить branchId из события
2. Найти warehouse с isDefault=true для этого branch
3. Если не найден -> warning, skip
4. Если warehouse не активен -> warning, skip
```

### Шаг 2: Обработать позиции

```
FOR EACH orderItem:
  // Найти рецепт
  recipe = RecipeRepository.findByProduct(item.productId)

  IF recipe NOT FOUND:
    IF strictRecipeMode THEN
      throw Error
    ELSE
      log warning, continue
    END IF
  END IF

  // Списать ингредиенты
  FOR EACH ingredient IN recipe.ingredients:
    deductQty = item.quantity * ingredient.quantity * (1 + ingredient.wasteFactor)
    createStockMovement(warehouse, ingredient.itemId, deductQty, orderId)
  END FOR

  // Обработать модификаторы
  FOR EACH modifier IN item.modifiers:
    modifierRecipe = RecipeRepository.findByModifier(modifier.modifierId)
    IF modifierRecipe:
      FOR EACH ingredient IN modifierRecipe.ingredients:
        deductQty = item.quantity * modifier.quantity * ingredient.quantity * (1 + wasteFactor)
        createStockMovement(...)
      END FOR
    END IF
  END FOR
END FOR
```

### Шаг 3: Создать движение

```
createStockMovement:
  1. Проверить идемпотентность (уже есть движение?)
  2. Получить/создать Stock запись
  3. Создать StockMovement:
     {
       movementType: SALE_DEDUCTION,
       quantity: -deductQty,
       unitCost: stock.avgCost,
       totalCost: deductQty * stock.avgCost,
       referenceType: 'order',
       referenceId: orderId,
       referenceItemId: orderItemId
     }
  4. Обновить Stock.quantity
  5. Проверить алерты (low/out of stock)
```

---

## 3. Idempotency (Идемпотентность)

```
Проблема: событие может обработаться дважды
Решение: уникальный ключ на движение

UNIQUE INDEX:
  (tenant_id, reference_type, reference_id, item_id, reference_item_id, DATE(created_at))

При повторной попытке:
  - Constraint violation
  - Catch error, log warning, skip
```

---

## 4. Отмена заказа (Reversal)

### Когда происходит

```
1. Order был COMPLETED
2. Order меняется на CANCELLED
3. OrderCancelledEvent -> outbox
4. StockDeductionService.reverseForOrder()
```

### Процесс возврата

```
reverseForOrder(event):
  1. Найти все StockMovements с referenceId = orderId

  2. FOR EACH movement:
       // Проверить что не было возврата
       IF existsReversal(movement.id) THEN
         skip
       END IF

       // Создать обратное движение
       reversal = {
         movementType: SALE_REVERSAL,
         quantity: +ABS(movement.quantity),
         unitCost: movement.unitCost,
         referenceType: 'order_reversal',
         referenceId: movement.id
       }

       // Вернуть товар на склад
       stock.quantity += ABS(movement.quantity)
       // WAC не меняется!
  END FOR
```

---

## 5. UI Последствия

### Для POS/WebApp

```
Заказ завершается мгновенно (синхронно).
Списание происходит в фоне (~1 сек).

UI НЕ блокируется:
- Нет задержки при завершении
- Нет ошибок от склада

Возможные warnings (не ошибки):
- "Recipe not found for product X"
- "Warehouse not active"
```

### Для Admin Panel

```
Dashboard -> Recent Movements:
  Показывать движения с типом SALE_DEDUCTION

Order Details:
  "Stock Deducted" badge после списания
  Ссылка на movements

Alerts:
  Показывать low/out of stock если возникли после списания
```

---

## 6. Настройки

### strictRecipeMode

```
Settings: inventory.strictRecipeMode

true: ошибка если рецепт не найден (BadRequestException)
false: warning, продолжаем без списания (default)

Рекомендация: false для production, true для testing
```

### Stock Control Mode

```
При СОЗДАНИИ заказа (не списании):

Settings: inventory.stockControlMode = 'none' | 'warn' | 'block'

'none':  не проверять наличие (default)
'warn':  предупреждение в POS
'block': блокировать создание заказа

См. bl-stock-control.md
```

---

## 7. API для Frontend

### Проверка статуса списания

```
GET /admin/orders/:id

Response:
{
  "id": 1234,
  "status": "COMPLETED",
  "inventoryDeducted": true,
  "deductedAt": "2026-01-18T14:31:00Z",
  "deductionWarnings": [
    "Recipe not found for product 'Custom Dish'"
  ]
}
```

### Движения для заказа

```
GET /admin/inventory/movements?referenceType=order&referenceId=1234

Response:
{
  "items": [
    {
      "id": 500,
      "itemName": "Tomatoes",
      "quantity": -0.33,
      "unitCost": 8000,
      "totalCost": 2640
    }
  ],
  "totalCost": 23500
}
```

---

## 8. Диаграмма таймингов

```
T+0s    POS: Complete Order
        |
        +-> Order.status = COMPLETED
        +-> OrderCompletedEvent -> outbox
        +-> Response: 200 OK (мгновенно!)

T+1s    OutboxProcessor picks event
        |
        +-> hasFeature check
        +-> StockDeductionService
        +-> Movements created
        +-> Event marked processed

T+1s    Stock updated
        +-> Alerts generated (if needed)
```

---

## 9. Error Handling

| Ошибка | Действие |
|--------|----------|
| Warehouse not found | Warning, skip (не блокируем) |
| Recipe not found | Warning или Error (зависит от strictMode) |
| Duplicate movement | Skip (идемпотентность) |
| Stock record missing | Создать с quantity=0 |
| Database error | Retry с exponential backoff |

---

## 10. Мониторинг

```
Что отслеживать:
- Количество pending events в outbox
- Время обработки events
- Количество warnings/errors
- Failed events (retry_count > max)

Алерты:
- outbox queue > 1000 events
- Processing time > 5 sec average
- Failed events > 10/hour
```

---

## FAQ

**Q: Что если заказ отменён до списания?**

A: Событие OrderCancelled обработается после OrderCompleted. Списание произойдёт, затем reversal.

**Q: Можно ли списать вручную?**

A: Не для заказов. Для ручного списания используйте Writeoff или Adjustment.

**Q: Что если склад переполнен событиями?**

A: Outbox обрабатывает батчами. При большой нагрузке очередь может расти, но всё будет обработано.

---

*Документ актуален на январь 2026*
