# Глоссарий и концепции

> Термины и понятия модуля инвентаризации

---

## Основные термины

### Warehouse (Склад)

Физическое место хранения товаров. Привязан к филиалу.

```
Свойства:
- Один филиал может иметь несколько складов
- isDefault = true определяет склад для автосписания
- isActive управляет доступностью
```

### Inventory Item (Номенклатура)

Единица учёта сырья или полуфабриката.

```
Типы:
- Raw Material: сырьё (томаты, мука, масло)
- Semi-finished: полуфабрикат (тесто, соус)

Ключевые поля:
- unit: базовая единица измерения (kg, L, pcs)
- minStockLevel: минимальный уровень для алерта
- reorderPoint: уровень для напоминания о заказе
- isSemiFinished: признак полуфабриката
```

### Stock (Остаток)

Текущее количество товара на конкретном складе.

```
Поля:
- quantity: общее количество
- reservedQuantity: зарезервировано под заказы
- availableQuantity: доступно = quantity - reserved
- avgCost: средневзвешенная себестоимость (WAC)
- lastCost: цена последней закупки
```

### Recipe (Техкарта)

Рецепт приготовления продукта. Связывает продукт меню с ингредиентами.

```
Связи:
- Product (продукт меню)
- Modifier (модификатор)
- Semi-finished Item (полуфабрикат)

Состав:
- ingredients: список ингредиентов с количествами
- outputQuantity: количество готового продукта
- calculatedCost: кэшированная себестоимость
```

---

## Финансовые термины

### WAC (Weighted Average Cost)

Средневзвешенная себестоимость. Метод расчёта себестоимости единицы товара.

```
Формула:
newWAC = (oldQty * oldWAC + newQty * newPrice) / (oldQty + newQty)

Пример:
До: 10 кг @ 80,000 = 800,000
Закупка: 20 кг @ 90,000 = 1,800,000
После: 30 кг, WAC = 2,600,000 / 30 = 86,667/кг
```

### Waste Factor (Коэффициент отходов)

Процент потерь при обработке ингредиента.

```
Применение:
effectiveQuantity = quantity * (1 + wasteFactor)

Пример:
Говядина: 0.15 кг, wasteFactor = 10%
Фактическое списание: 0.15 * 1.1 = 0.165 кг

Типичные значения:
- Масло, соусы: 0%
- Сыр, мясо: 5-10%
- Овощи, зелень: 15-30%
```

### Food Cost Percentage

Доля себестоимости в цене продажи.

```
Формула:
foodCostPercent = (recipeCost / sellingPrice) * 100

Пример:
Себестоимость бургера: 23,000
Цена продажи: 45,000
Food Cost: 51.1%

Целевые показатели:
- Хорошо: < 30%
- Нормально: 30-35%
- Высоко: 35-40%
- Критично: > 40%
```

### Gross Margin

Валовая маржа. Разница между ценой и себестоимостью.

```
Формула:
grossMargin = sellingPrice - recipeCost
marginPercent = grossMargin / sellingPrice * 100

Пример:
45,000 - 23,000 = 22,000 (48.9%)
```

---

## Документы и операции

### Purchase Order (PO / Заказ поставщику)

Документ заказа товаров у поставщика.

```
Статусы:
DRAFT -> SENT -> PARTIAL -> RECEIVED
             \-> CANCELLED

Ключевые поля:
- poNumber: номер (PO-YYMM-XXXX)
- supplierId: поставщик
- warehouseId: целевой склад
- items: позиции заказа
```

### Purchase Receive (Приёмка)

Документ приёмки товаров по заказу.

```
Что происходит:
1. Создаётся PurchaseReceive
2. Для каждой позиции:
   - StockMovement (PURCHASE_RECEIVE)
   - Stock.quantity увеличивается
   - WAC пересчитывается
3. PO статус обновляется
```

### Writeoff (Списание)

Документ списания испорченных или утерянных товаров.

```
Причины:
- SPOILAGE: порча
- EXPIRED: истёк срок
- DAMAGED: повреждение
- THEFT: кража
- SAMPLE: проба

Статусы:
DRAFT -> PENDING -> APPROVED
              \-> REJECTED
```

### Inventory Count (Инвентаризация)

Процесс сверки фактических остатков с системными.

```
Типы:
- FULL: все товары
- PARTIAL: выбранные категории
- SPOT: случайная выборка

Результат:
- Variance = countedQty - systemQty
- При утверждении создаются COUNT_ADJUSTMENT movements
```

### Production Order (Производственный заказ)

Документ производства полуфабрикатов.

```
Статусы:
PLANNED -> IN_PROGRESS -> COMPLETED
              \-> CANCELLED

При Start: списываются ингредиенты
При Complete: добавляется выход на склад
```

---

## Движения склада

### Stock Movement (Движение)

Запись изменения остатка товара.

| Type | Направление | Описание |
|------|-------------|----------|
| PURCHASE_RECEIVE | + | Приёмка закупки |
| SALE_DEDUCTION | - | Продажа (автосписание) |
| SALE_REVERSAL | + | Отмена продажи |
| WRITEOFF | - | Списание |
| ADJUSTMENT | +/- | Ручная корректировка |
| PRODUCTION_INPUT | - | Списание на производство |
| PRODUCTION_OUTPUT | + | Выпуск с производства |
| TRANSFER_OUT | - | Перемещение (отправка) |
| TRANSFER_IN | + | Перемещение (получение) |
| COUNT_ADJUSTMENT | +/- | Корректировка по инвентаризации |

---

## Контроль и алерты

### Stock Alert (Алерт)

Уведомление о низком остатке.

```
Типы:
- OUT_OF_STOCK: quantity <= 0 (критично)
- LOW_STOCK: 0 < quantity <= minStockLevel (предупреждение)
- REORDER: quantity <= reorderPoint (информация)
```

### Stock Control Mode

Режим проверки наличия при продаже.

```
Режимы:
- none: не проверять (по умолчанию)
- warn: предупреждение при недостатке
- block: блокировать продажу

Настройка: settings.inventory.stockControlMode
```

---

## Интеграция с заказами

### Deduction Flow (Автосписание)

Процесс автоматического списания при продаже.

```
1. Order.status = COMPLETED
2. OrderCompletedEvent -> Outbox
3. OutboxProcessor (каждую секунду)
4. hasFeature('addon_inventory')?
5. StockDeductionService.deductForOrder()
6. Для каждого OrderItem:
   - Найти Recipe
   - Для каждого ingredient: создать movement
7. Event = processed
```

### Outbox Pattern

Паттерн гарантированной доставки событий.

```
Проблема: синхронное списание блокирует заказ
Решение: асинхронная обработка через outbox

Таблица: domain_events_outbox
Обработка: каждую секунду
Идемпотентность: уникальный ключ по reference
```

---

## Единицы измерения

### Base Units

| Категория | Единицы |
|-----------|---------|
| Вес | kg, g, lb, oz |
| Объём | liter, ml, gallon |
| Штуки | pcs, box, pack, dozen, crate, bag, bottle, can |

### Unit Conversion

Конверсия между единицами для одного товара.

```
Пример:
1 box = 10 kg
1 crate = 25 kg

При приёмке 2 boxes = 20 kg записывается на склад
```

---

## Права доступа

| Permission | Описание |
|------------|----------|
| inventory:view | Просмотр остатков, движений |
| inventory:manage | CRUD товаров, рецептов, складов |
| inventory:adjust | Ручные корректировки |
| inventory:purchase | Заказы поставщикам |
| inventory:writeoff | Создание списаний |
| inventory:approve | Утверждение списаний и инвентаризаций |
| inventory:count | Проведение инвентаризаций |
| inventory:production | Управление производством |

---

*Документ актуален на январь 2026*
